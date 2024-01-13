//-----------------------------------------
//
//メニュー追加（spreadsheetオープン時処理）
//
//-----------------------------------------
function onOpen() {
  const spreadsheet = SpreadsheetApp.getActive();
  const menuItems = [
    {name: '00_pluginsのプラグイン名からpid候補を表示', functionName: 'searchAndWriteProductIDs'}, 
    {name: '10_pidで脆弱性情報を検索する', functionName: 'start_search_getVulnOverviewList'}, 
  ];
  spreadsheet.addMenu('【カスタムメニュー】', menuItems); //メニューバーでの名前とその下のメニュー項目を追加
}// End onOpen
