//-----------------------------------------
//
//メニュー追加（spreadsheetオープン時処理）
//
//-----------------------------------------
function onOpen() {
  const spreadsheet = SpreadsheetApp.getActive();
  const menuItems = [
    {name: '全て一括で行う（5分ぐらい）', functionName: 'all_start'}, 
    {name: '現在のプラグイン一覧を取得して、00_pluginシートに貼り付ける', functionName: 'fetch_plugin_ref'}, 
    {name: '10_pid_sheetを一旦クリアする', functionName: 'clear_pid_sheet'}, 
    {name: '10_pidシートにプラグインIDを検索して書き込む', functionName: 'searchAndWriteProductIDs'}, 
    {name: '20_JVNDBから脆弱性情報を取得する', functionName: 'start_search_getVulnOverviewList'}, 
  ];
  spreadsheet.addMenu('【カスタムメニュー】', menuItems); //メニューバーでの名前とその下のメニュー項目を追加
}// End onOpen
