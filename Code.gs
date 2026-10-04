/** Calendar Validation Apps Script backend.
 * Deploy as: Execute as user accessing the web app; require Google sign-in.
 * Store ALLOWED_EMAIL in Script Properties. Requests fail closed if Google
 * does not provide the signed-in email or it does not match ALLOWED_EMAIL.
 * Do not deploy this as an anonymous endpoint.
 */
const SPREADSHEET_ID = '1xyWWzannTSba1nYfaETe41ECARlMd-9vxWI5oM3JY6c';
const SHEETS = {
  calendar: 'Calendar Events',
  manual: 'Manual Events',
  results: 'Validation Results'
};
const HEADERS = {
  calendar: ['Date', 'Event / Title', 'Start Time', 'End Time', 'Owner / Team'],
  manual: ['Date', 'Event / Title', 'Start Time', 'End Time', 'Owner / Team', 'Record ID'],
  results: ['Status', 'Date', 'Manual Event', 'Calendar Event', 'Differences', 'Accuracy', 'Validated At']
};

function doGet(e) {
  try {
    requireOwner_();
    const payload = readData_();
    const callback = e && e.parameter && e.parameter.callback;
    if (callback && /^[A-Za-z_$][\w.$]*$/.test(callback)) {
      return ContentService.createTextOutput(callback + '(' + JSON.stringify(payload) + ');')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return json_(payload);
  } catch (err) {
    return json_({ error: String(err.message || err) });
  }
}

function doPost(e) {
  try {
    requireOwner_();
    const body = JSON.parse((e && e.postData && e.postData.contents) || '{}');
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      writeRows_(SHEETS.calendar, HEADERS.calendar, body.calendar || []);
      writeRows_(SHEETS.manual, HEADERS.manual, body.manual || []);
      writeRows_(SHEETS.results, HEADERS.results, body.results || []);
    } finally {
      lock.releaseLock();
    }
    return json_({ ok: true, savedAt: new Date().toISOString() });
  } catch (err) {
    return json_({ error: String(err.message || err) });
  }
}

function requireOwner_() {
  const allowed = PropertiesService.getScriptProperties().getProperty('ALLOWED_EMAIL');
  const active = Session.getActiveUser().getEmail();
  if (!allowed || !active || active.toLowerCase() !== allowed.toLowerCase()) {
    throw new Error('Access denied. Sign in as the configured owner account.');
  }
}
function readData_() {
  const ss = SpreadsheetApp.openById(SPREADSHEET_ID);
  return {
    calendar: readRows_(ss.getSheetByName(SHEETS.calendar), HEADERS.calendar.length),
    manual: readRows_(ss.getSheetByName(SHEETS.manual), HEADERS.manual.length).map(r => ({date:r[0], title:r[1], start:r[2], end:r[3], owner:r[4], id:r[5]})),
    results: readRows_(ss.getSheetByName(SHEETS.results), HEADERS.results.length)
  };
}
function readRows_(sheet, width) {
  if (!sheet || sheet.getLastRow() < 2) return [];
  return sheet.getRange(2, 1, sheet.getLastRow() - 1, width).getDisplayValues()
    .filter(r => r.some(v => v !== ''))
    .map(r => ({date:r[0], title:r[1], start:r[2], end:r[3], owner:r[4]}));
}
function writeRows_(name, headers, records) {
  const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(name);
  if (!sheet) throw new Error('Missing sheet: ' + name);
  const last = sheet.getLastRow();
  if (last > 1) sheet.getRange(2, 1, last - 1, Math.max(headers.length, sheet.getLastColumn())).clearContent();
  if (!records.length) return;
  const values = records.map(r => {
    if (Array.isArray(r)) return headers.map((_, i) => r[i] == null ? '' : String(r[i]));
    return headers.map(h => {
      const key = ({'Date':'date','Event / Title':'title','Start Time':'start','End Time':'end','Owner / Team':'owner','Record ID':'id','Status':'status','Manual Event':'manual','Calendar Event':'calendar','Differences':'note','Accuracy':'accuracy','Validated At':'validatedAt'})[h];
      return r[key] == null ? '' : String(r[key]);
    });
  });
  sheet.getRange(2, 1, values.length, headers.length).setValues(values);
}
function json_(value) {
  return ContentService.createTextOutput(JSON.stringify(value)).setMimeType(ContentService.MimeType.JSON);
}
