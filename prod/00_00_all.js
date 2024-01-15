//00〜80の処理を実行する
function start_search_getVulnOverviewList() {

    fetch_plugin_ref();
    searchAndWriteProductIDs();
    start_search_getVulnOverviewList();
    slack_notification();

    // 終了のメッセージを表示
    Browser.msgBox('処理が完了しました。');

}