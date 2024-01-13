function searchAndWriteProductIDs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pluginsSheet = ss.getSheetByName('00_plugins');
  var ignoreSheet = ss.getSheetByName('03_ignore_name');
  var pidSheet = ss.getSheetByName('10_pid');

  // プラグインの名前を取得
  var pluginNames = pluginsSheet.getRange('A2:A' + pluginsSheet.getLastRow()).getValues().flat();

  // ignoreシートから除外するプラグイン名を取得
  var ignoredNames = ignoreSheet.getRange('A2:A' + ignoreSheet.getLastRow()).getValues().flat();

  //シートのいったんクリア
  pidSheet.getRange(2, 1).setValue("Loading...");
  pidSheet.getRange(2, 1, pidSheet.getLastRow()-2+1, 3).clearContent();


  for (var i = 0; i < pluginNames.length; i++) {
    var keyword = pluginNames[i].trim();
    if (keyword && !ignoredNames.includes(keyword)) {
      var productInfo = getProductList(keyword);
      if (productInfo.totalRes === '0') {
        pidSheet.appendRow([keyword, '検索結果なし']);
      } else {
        for (var j = 0; j < productInfo.products.length; j++) {
          var product = productInfo.products[j];
          pidSheet.appendRow([keyword, product.pname, product.pid]);
        }
      }
    }
  }
}

function getProductList(keyword) {
  Logger.log("チェック開始 ____" + keyword);

  var url = 'https://jvndb.jvn.jp/myjvn';
  var payload = {
    'method': 'getProductList',
    'feed': 'hnd',
    'keyword': keyword
  };

  var options = {
    'method': 'post',
    'payload': payload
  };

  var response = UrlFetchApp.fetch(url, options);
  var xml = response.getContentText();
  Logger.log("-----xml-----");
  Logger.log(xml);
  
  var document = XmlService.parse(xml);  
  var root = document.getRootElement();
  var ns = root.getNamespace(); // "http://jvndb.jvn.jp/myjvn/Results" 名前空間を取得
  var statusNs = XmlService.getNamespace('http://jvndb.jvn.jp/myjvn/Status'); // "status" 名前空間を取得
  
  var status = root.getChild('Status', statusNs);
  if (status) {
    Logger.log(status);
    var totalRes = status.getAttribute('totalRes').getValue();
    Logger.log(totalRes);
    // 他の処理
  } else {
    // statusオブジェクトが存在しない場合のエラーハンドリング
    Logger.log("オブジェクトが存在しません");
    return { totalRes: '0', products: [] }; // 適切なエラーハンドリング
  }
  
  var products = [];
  if (totalRes !== '0') {
    var vendorInfo = root.getChild('VendorInfo', ns);
    var vendors = vendorInfo.getChildren('Vendor', ns);
    for (var i = 0; i < vendors.length; i++) {
      var vendor = vendors[i];
      var productElements = vendor.getChildren('Product', ns);
      for (var j = 0; j < productElements.length; j++) {
        var product = productElements[j];
        var pname = product.getAttribute('pname').getValue();
        var pid = product.getAttribute('pid').getValue();
        products.push({ pname: pname, pid: pid });
      }
    }
  }

  return { totalRes: totalRes, products: products };
}



// function getProductList(keyword) {
//   var url = 'https://jvndb.jvn.jp/myjvn';
//   var payload = {
//     'method': 'getProductList',
//     'feed': 'hnd',
//     'keyword': keyword
//   };

//   var options = {
//     'method' : 'post',
//     'payload' : payload
//   };

//   var response = UrlFetchApp.fetch(url, options);

//   // レスポンスをログに出力
//   Logger.log(response.getContentText());
// }
