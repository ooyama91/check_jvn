function slack_notification() {

    // スクリプトプロパティからスプレッドシートのURLを取得
    const SPREADSHEET_URL = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_URL');

    // アクティブなスプレッドシートを取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // 00_pluginsシートを取得
    const sheet_plugin = ss.getSheetByName('00_plugin');
    // 10_pidシートを取得
    const sheet_pid = ss.getSheetByName('10_pid');
    // 20_VulnOverviewListシートを取得
    const sheet_VulnOverviewList = ss.getSheetByName('20_VulnOverviewList');

    // 00_pluginsシートの行数-1を取得
    const sheet_plugin_last_row = sheet_plugin.getLastRow() - 1;
    // 10_pidシートの行数-1を取得
    const sheet_pid_last_row = sheet_pid.getLastRow() - 1;
    // 20_VulnOverviewListシートの行数-1を取得
    const sheet_VulnOverviewList_last_row = sheet_VulnOverviewList.getLastRow() - 1;

    // 20_VulnOverviewListシートのデータを取得
    const data = sheet_VulnOverviewList.getDataRange().getValues();
    // 1行目を削除
    data.shift();

    //メッセージの設定、前段の挿入
    var message = "JVN脆弱性検索情報"+"\n";
    message += SPREADSHEET_URL+"\n";
    message += "検索された脆弱性："+sheet_VulnOverviewList_last_row+"件"+"\n";
    message += "（検索対象のプラグイン数："+sheet_plugin_last_row+"件）"+"\n";

    //---------------------
    //SLACK通知
    //--------------------

    // スクリプトプロパティからslackのwebhook URLを取得 
    const SERVER_ALERT_URL = PropertiesService.getScriptProperties().getProperty('SERVER_ALERT_URL');
    const DM_URL = PropertiesService.getScriptProperties().getProperty('DM_URL');


    var postUrl = SERVER_ALERT_URL;
    var username = 'bot';  // 通知時に表示されるユーザー名
    var icon = ':traffic_light:';  // 通知時に表示されるアイコン

    var jsonData =
        {
            "username" : username,
            "icon_emoji": icon,
            "text" : message
        };
    var payload = JSON.stringify(jsonData);

    var options =
        {
            "method" : "post",
            "contentType" : "application/json",
            "payload" : payload
        };

    UrlFetchApp.fetch(postUrl, options);

}
