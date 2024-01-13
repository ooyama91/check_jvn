function start_getProductList(){

  sendCurlRequest("Advanced Custom Fields");

}

function sendCurlRequest(keyword) {
  var url = 'https://jvndb.jvn.jp/myjvn';
  var payload = {
    'method': 'getProductList',
    'feed': 'hnd',
    'keyword': keyword
  };

  var options = {
    'method' : 'post',
    'payload' : payload
  };

  var response = UrlFetchApp.fetch(url, options);

  // レスポンスをログに出力
  Logger.log(response.getContentText());
}


function pending_getVulnOverviewList() {
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
