// Description: pid_sheetをクリアする
function clear_pid_sheet() {

  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var pidSheet = ss.getSheetByName('10_pid');

  //シートのいったんクリア
  pidSheet.getRange(2, 1).setValue("Loading...");
  pidSheet.getRange(2, 1, pidSheet.getLastRow()-2+1, 3).clearContent();

}

