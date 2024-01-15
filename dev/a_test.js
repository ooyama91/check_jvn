function a_test() {

    // IDをスクリプトプロパティから取得
    const SS_PLUGIN_ID = PropertiesService.getScriptProperties().getProperty('SS_PLUGIN_ID');
    // 参照するプラグイン一覧スプレッドシートをIDで取得
    const ss_plugin = SpreadsheetApp.openById(SS_PLUGIN_ID);
    // 00_22_pluginsシートの取得
    const sheet_plugin_ref = ss_plugin.getSheetByName('00_22_plugins');

    // 本スプレッドシートの取得
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    // 00_pluginsシートの取得
    const sheet_plugin = ss.getSheetByName('00_plugin');
    // いったんクリア
    sheet_plugin.getRange(2, 1).clearContent();
    sheet_plugin.getRange(2, 1).setValue("Loading...");

    // 00_22_pluginsシートのデータを取得して、00_pluginsシートに貼り付け
    const data = sheet_plugin_ref.getDataRange().getValues();
    // 1行目を削除
    data.shift();
    // 1列目が空、ないしは「総計」になっている行を削除
    for (let i = data.length - 1; i >= 0; i--) {
        if (data[i][0] === "" || data[i][0] === "総計") {
            data.splice(i, 1);
        }
    }
    // 00_pluginsシートに貼り付け
    sheet_plugin.getRange(2, 1, data.length, data[0].length).setValues(data);

}
