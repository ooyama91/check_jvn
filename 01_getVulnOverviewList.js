function start_getVulnOverviewList(){

  getVulnOverviewList("50004");

}

function getVulnOverviewList(pid) {
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

  // レスポンスをログに出力
  Logger.log(response.getContentText());
}


function __getVulnOverviewList__pending() {
  var url = 'https://jvndb.jvn.jp/myjvn';

  // リクエストボディのデータをオブジェクトに格納
  var requestBody = {
    'method': 'getVulnOverviewList',
    'feed': 'hnd',
    'keyword': 'Age Gate',
    'rangeDatePublic': 'n',
    'rangeDatePublished': 'n',
    'rangeDateFirstPublished': 'n'
  };

  // リクエストオプションを設定
  var options = {
    'method': 'post',
    'contentType': 'application/x-www-form-urlencoded',
    'payload': requestBody
  };

  // POSTリクエストを送信
  var response = UrlFetchApp.fetch(url, options);

  // レスポンスをログに出力
  Logger.log(response.getContentText());
}
