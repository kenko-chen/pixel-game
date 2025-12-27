/**
 * Google Apps Script for Pixel Quiz Game
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet.
 * 2. Rename Sheet1 to "題目" (Questions). 
 *    - Columns: ID, Question, A, B, C, D, Answer
 * 3. Create a new sheet named "回答" (Responses).
 *    - Columns: ID, 次數 (Attempts), 總分 (Total Score), 最高分 (Max Score), 首次通關分 (First Clear), 通關耗時次 (Attempts to Clear), 最近遊玩 (Last Played)
 * 4. Extensions > Apps Script -> Paste this code.
 * 5. Run 'setup' function once to ensure headers (optional but good).
 * 6. Deploy > New Deployment > Web App > "Anyone" can access.
 * 7. Copy URL to .env file in the frontend project.
 */

function doGet(e) {
  // Handle CORS
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    const action = e.parameter.action;
    
    if (action === 'getQuestions') {
      const count = parseInt(e.parameter.count) || 5;
      const data = getRandomQuestions(count);
      output.setContent(JSON.stringify({ status: 'success', data: data }));
    } else {
      output.setContent(JSON.stringify({ status: 'error', message: 'Invalid action' }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ status: 'error', message: err.toString() }));
  }
  
  return output;
}

function doPost(e) {
  const output = ContentService.createTextOutput();
  output.setMimeType(ContentService.MimeType.JSON);
  
  try {
    // Parse JSON body
    const postData = JSON.parse(e.postData.contents);
    const action = postData.action;

    if (action === 'submit') {
      const result = saveScore(postData);
      output.setContent(JSON.stringify({ status: 'success', result: result }));
    } else {
      output.setContent(JSON.stringify({ status: 'error', message: 'Invalid action' }));
    }
  } catch (err) {
    output.setContent(JSON.stringify({ status: 'error', message: err.toString() }));
  }
  
  return output;
}

function getRandomQuestions(count) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("題目");
  if (!sheet) throw new Error("Sheet '題目' not found");
  
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return []; // No data
  
  const range = sheet.getRange(2, 1, lastRow - 1, 7); // Columns A-G
  const values = range.getValues();
  
  // Map to objects
  const questions = values.map(row => ({
    id: row[0],
    question: row[1],
    options: {
      A: row[2],
      B: row[3],
      C: row[4],
      D: row[5]
    },
    answer: row[6]
  }));
  
  // Shuffle
  for (let i = questions.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [questions[i], questions[j]] = [questions[j], questions[i]];
  }
  
  // Slice
  const selected = questions.slice(0, count);
  
  // HIDE ANSWER for security if desired, but here we include it so frontend can check immediate feedback
  // If you want server-side grading, don't send 'answer' and grade in doPost.
  // We send it here as per user flow implication.
  return selected;
}

function saveScore(data) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName("回答");
  if (!sheet) {
    sheet = ss.insertSheet("回答");
    sheet.appendRow(["ID", "次數", "總分", "最高分", "首次通關分", "通關耗時次", "最近遊玩"]);
  }
  
  const userId = data.userId;
  const score = data.score;
  const passed = data.passed; // Boolean
  const now = new Date();
  
  // Find user row
  // Assuming ID is unique per user
  const lastRow = sheet.getLastRow();
  let rowIndex = -1;
  let userData = null;
  
  if (lastRow > 1) {
    const idList = sheet.getRange(2, 1, lastRow - 1, 1).getValues().flat();
    const idx = idList.indexOf(userId);
    if (idx !== -1) {
      rowIndex = idx + 2; // 1-based index + header
      userData = sheet.getRange(rowIndex, 1, 1, 7).getValues()[0];
    }
  }
  
  if (rowIndex !== -1) {
    // ID Found - Update
    // Columns: ID(0), Count(1), Total(2), Max(3), FirstClear(4), ClearCount(5), LastPlayed(6)
    
    let currentCount = parseInt(userData[1] || 0) + 1;
    let currentTotal = parseInt(userData[2] || 0) + score; // Accumulate Score
    let currentMax = parseInt(userData[3] || 0);
    if (score > currentMax) currentMax = score;
    
    let firstClear = userData[4];
    let attemptsToClear = userData[5];
    
    if (passed && !firstClear && firstClear !== 0) {
      // First time clearing!
      firstClear = score;
      attemptsToClear = currentCount;
    }
    
    // Update Row
    sheet.getRange(rowIndex, 2, 1, 6).setValues([[
      currentCount,
      currentTotal,
      currentMax,
      firstClear,
      attemptsToClear,
      now
    ]]);
    
    return { created: false, row: rowIndex };
    
  } else {
    // New User
    const newRow = [
      userId,
      1, // Count
      score, // Total
      score, // Max
      passed ? score : "", // First Clear
      passed ? 1 : "", // Attempts to Clear
      now
    ];
    sheet.appendRow(newRow);
    return { created: true };
  }
}
