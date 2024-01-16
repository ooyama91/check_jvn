//00〜80の処理を実行する
function all_start() {

    fetch_plugin_ref();
    searchAndWriteProductIDs(0, 500);
    start_search_getVulnOverviewList();
    slack_notification();

    // 終了のメッセージを表示
    Browser.msgBox('処理が完了しました。');

}