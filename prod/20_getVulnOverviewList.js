// Description: JVNDBから直近1ヶ月の脆弱性情報を取得する
function start_search_getVulnOverviewList() {
  // スプレッドシートの取得
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var pidSheet = sheet.getSheetByName('10_pid');
  const sheet_already_known_vuln_id = sheet.getSheetByName('18_already_known_vuln_id');
  var overviewSheet = sheet.getSheetByName('20_VulnOverviewList');
  var skippedPids = getSkippedPids(); // スキップするpidを取得  

  // pidSheetからデータを取得
  var dataRange = pidSheet.getDataRange();
  var data = dataRange.getValues();

  // シートのクリア
  overviewSheet.getRange("A2").setValue("Loading...");
  overviewSheet.getRange(2, 1, overviewSheet.getLastRow()-2+1, overviewSheet.getLastColumn()).clear();

  var rows = []; // 二次元配列を初期化

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
    if (pname === '検索結果なし') {
      continue; // 次のループへスキップ
    }

    // 脆弱性情報の取得
    var vulnData = search_getVulnOverviewList(pid);

    // データを二次元配列に追加
    vulnData.forEach(function(data) {
      var newRow = row.slice(0, 3); // name, pname, pid
      newRow.push(data.identifier, data.link, data.title, data.description);
      rows.push(newRow); // 二次元配列に行を追加
    });

  }

  // 1行もデータがない場合は「データなし」を表示
  if (rows.length === 0) {
    rows.push(["直近1ヶ月での脆弱性データなし"]);
  }
  // 一度にすべての行を追加
  overviewSheet.getRange(2, 1, rows.length, rows[0].length).setValues(rows);
}

function search_getVulnOverviewList(pid) {

  var url = 'https://jvndb.jvn.jp/myjvn';
  var payload = {
    'method': 'getVulnOverviewList',
    'feed': 'hnd',
    'productId': pid,
    'rangeDatePublic': 'n',
    'rangeDatePublished': 'm', // n=指定なし、m=直近1年
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
      // modified: modified

    };
  });
  
  return vulnData;
}

// スクリプトを開始するための関数
function run() {
  start_getVulnOverviewList();
}

function getSkippedPids() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet();
  var fixPidSheet = sheet.getSheetByName('15_ignore_pid');
  var data = fixPidSheet.getDataRange().getValues();

  // ヘッダーを除外し、C列だけにして、pidのみのリストを作成
  var skippedPids = data.slice(1).map(function(row) {
    return row[2];
  });

  Logger.log(skippedPids);

  return skippedPids;
}

