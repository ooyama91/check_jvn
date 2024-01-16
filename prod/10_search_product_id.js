// Description: 00_pluginシートのプラグイン名を元に、10_pidシートにプラグインIDを検索して書き込む
function searchAndWriteProductIDs() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pluginsSheet = ss.getSheetByName('00_plugin');
  var ignoreSheet = ss.getSheetByName('05_ignore_name');
  var pidSheet = ss.getSheetByName('10_pid');

  // プラグインの名前を取得
  var pluginNames = pluginsSheet.getRange('A2:A' + pluginsSheet.getLastRow()).getValues().flat();

  // ignoreシートから除外するプラグイン名を取得
  var ignoredNames = ignoreSheet.getRange('A2:A' + ignoreSheet.getLastRow()).getValues().flat();

  //シートのいったんクリア
  pidSheet.getRange(2, 1).setValue("Loading...");
  pidSheet.getRange(2, 1, pidSheet.getLastRow()-2+1, 3).clearContent();

  var rows = []; // 二次元配列を初期化

  for (var i = 0; i < pluginNames.length; i++) {
    var keyword = pluginNames[i].trim();
    if (keyword && !ignoredNames.includes(keyword)) {
      var productInfo = getProductList(keyword);
      if (productInfo.totalRes === '0') {
        rows.push([keyword, '検索結果なし', '']); // 二次元配列に行を追加
      } else {
        for (var j = 0; j < productInfo.products.length; j++) {
          var product = productInfo.products[j];
          rows.push([keyword, product.pname, product.pid]); // 二次元配列に行を追加
        }
      }
    }
  }

  // rowsの列数を全ての行で最大の列数に揃える
  var maxColumns = rows.reduce(function(max, row) {
    return Math.max(max, row.length);
  }, 0);
  rows = rows.map(function(row) {
    return row.concat(new Array(maxColumns - row.length).fill(''));
  });

  Logger.log(rows);

  // 一度にすべての行を追加
  pidSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);

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

/*
TODO：件数が多かったりして、サーバーエラーが出た場合の回避方法を考える
<Result 
version="3.3" 
xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" 
xmlns="http://jvndb.jvn.jp/myjvn/Results" 
xmlns:mjres="http://jvndb.jvn.jp/myjvn/Results" 
xmlns:status="http://jvndb.jvn.jp/myjvn/Status" 
xsi:schemaLocation="http://jvndb.jvn.jp/myjvn/Results https://jvndb.jvn.jp/schema/results_3.3.xsd">
    <status:Status version="3.3" method="getProductList" lang="ja" retCd="1" retMax="" errCd="PR02990356" errMsg="サーバ側でエラーが発生しました。しばらく時間を置いてから再試行してください。問題が解決しない場合は管理者にお問い合わせください。" totalRes="" totalResRet="" firstRes="" feed="hnd" keyword="CGB+for+alpine+%E2%80%94+CGB+Gutenberg+Block+Plugin"/>
  </Result>
*/