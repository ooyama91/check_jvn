function start_search_getVulnOverviewList() {
  // スプレッドシートの取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var pidSheet = sheet.getSheetByName('10_pid');
  var overviewSheet = sheet.getSheetByName('20_VulnOverviewList');
  var skippedPids = getSkippedPids(); // スキップするpidを取得  

  // pidSheetからデータを取得
  var dataRange = pidSheet.getDataRange();
  var data = dataRange.getValues();

  // シートのクリア
  overviewSheet.getRange("A2").setValue("Loading...");
  overviewSheet.getRange(2, 1, overviewSheet.getLastRow()-2+1, overviewSheet.getLastColumn()).clear();

  // ヘッダー行を除いた全行をループ処理
  for (var i = 1; i < data.length; i++) {
    var row = data[i];
    var pname = row[1];
    var pid = row[2];

    //正の整数、の文字列に変換
    var pidInt = Math.floor(parseFloat(pid));
    var pidStr = pidInt.toString();

    // スキップリストに含まれているpidの場合は処理をスキップ
    if (skippedPids.indexOf(pidStr) !== -1) {
      continue; // 次のループへスキップ
    }

    // pnameが「検索結果なし」の場合はスキップ
    if (pname !== '検索結果なし') {
      // 脆弱性情報を取得
      Logger.log(pname + "____" + pidStr);
      var vulnData = search_getVulnOverviewList(pidStr);
      Logger.log(vulnData);
      // overviewSheetに情報を書き込む
      appendVulnDataToSheet(overviewSheet, row, vulnData);
    }
  }
}

function search_getVulnOverviewList(pid) {

  var url = 'https://jvndb.jvn.jp/myjvn';
  var payload = {
    'method': 'getVulnOverviewList',
    'feed': 'hnd',
    'productId': pid,
    'rangeDatePublic': 'n',
    'rangeDatePublished': 'n',
    'rangeDateFirstPublished': 'n'
  };
  
  var options = {
    'method' : 'post',
    'payload' : payload
  };
  
  var response = UrlFetchApp.fetch(url, options);
  var xml = response.getContentText();
  Logger.log(xml);
  
 // XMLをパースして必要なデータを取得
  var document = XmlService.parse(xml);
  var root = document.getRootElement();
  var rdfNs = XmlService.getNamespace('http://purl.org/rss/1.0/');

  // sec 名前空間オブジェクトを作成
  var secNs = XmlService.getNamespace('http://jvn.jp/rss/mod_sec/3.0/');

  // RDF名前空間を指定してitem要素のリストを取得
  var entries = root.getChildren('item', rdfNs);
  Logger.log("-----entries-----");
  Logger.log(entries);
  
  var vulnData = entries.map(function(entry) {

    // RSS名前空間でタイトル、リンク、説明を取得
    var title = entry.getChild('title', rdfNs).getText();
    var link = entry.getChild('link', rdfNs).getText();
    var description = entry.getChild('description', rdfNs).getText();

    // sec 名前空間で識別子を取得
    var identifier = entry.getChild('identifier', secNs).getText();
    
    Logger.log(title);
    Logger.log(link);
    Logger.log(description);
    Logger.log(identifier);

    return {
      identifier: identifier,
      link: link,
      title: title,
      description: description
    };
  });
  
  return vulnData;
}


function appendVulnDataToSheet(overviewSheet, originalRow, vulnData) {
  // 各脆弱性データをシートに書き込む
  vulnData.forEach(function(data) {
    var newRow = originalRow.slice(0, 3); // name, pname, pid
    newRow.push(data.identifier, data.link, data.title, data.description);
    overviewSheet.appendRow(newRow);
  });
}

// スクリプトを開始するための関数
function run() {
  start_getVulnOverviewList();
}

function getSkippedPids() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var fixPidSheet = sheet.getSheetByName('90_fix_pid');
  var data = fixPidSheet.getDataRange().getValues();
  
  // ヘッダーを除外し、pidのみのリストを作成
  var skippedPids = data.slice(1).map(function(row) {
    return row[2].toString(); // pidが格納されている列のインデックスを指定（0始まり）
  });

  Logger.log(skippedPids);

  return skippedPids;
}

