# Pixel Art Quiz Game Implementation Plan

## 1. System Overview
A React-based web application styled as a 2000s pixel art arcade game. Users enter an ID to start a quiz, answer questions randomly fetched from a Google Sheet, and their results are recorded back to the sheet.

## 2. Architecture

### Frontend (React + Vite)
- **State Management**: `useGameStore` (using `zustand` if allowed, or just React Context) to manage:
  - `user`: { id: string }
  - `gameStatus`: 'IDLE' | 'LOADING' | 'PLAYING' | 'VICTORY' | 'GAME_OVER'
  - `questions`: Array<Question>
  - `currentIndex`: number
  - `score`: number
  - `answers`: Map<questionId, selectedOption>
- **Styling**: Vanilla CSS with CSS Variables for themes. "Press Start 2P" font from Google Fonts.
- **Assets**: 
  - Bosses: `https://api.dicebear.com/9.x/pixel-art/svg?seed=${index}`
  - UI: Pixel borders, retro colors (neon green/pink on black).

### Backend (Google Apps Script)
- **Database**: Google Sheet with 2 tabs: 'Questions', 'Responses'.
- **API**: `doGet` handling 'getQuestions' and 'submitResult' actions.

## 3. Data Structure

### Google Sheets
- **Questions**: `Id`, `Question`, `OptionA`, `OptionB`, `OptionC`, `OptionD`, `Answer` (e.g., 'A'), `Difficulty` (optional)
- **Responses**: `UserId`, `PlayCount`, `TotalScore`, `MaxScore`, `FirstClearScore`, `AttemptsToClear`, `LastPlayedAt`

### API Interface
**Request: Get Questions**
`GET ?action=getQuestions&count=5`
**Response**
`{ status: 'success', data: [ { id: 1, question: '...', options: {A:..., B:...}, answer: 'A' } ... ] }`
*(Note: In a real secure app, answers shouldn't be sent to frontend, but for simple quiz logic it's easier to validate locally or send answers back for grading. Given "High Spec", I'll grade on server-side or send answers hashed? No, simple grading on server is best, but to speed up UI, we might grade locally and verify remotely. Implementation: Submit answers to server for grading.)*

**Request: Submit Result**
`POST body: JSON.stringify({ action: 'submit', userId: '...', answers: { qId: 'answer' ... } })` 
**Response**
`{ status: 'success', score: 100, passed: true }`

## 4. UI Design
- **Theme**: Dark background (`#202028`), bright text (`#c7f0d8`, `#43523d`), blocky buttons.
- **Components**:
  - `PixelContainer`: Wrapper with `box-shadow` hack or border-image to create pixel corners.
  - `BossFrame`: Display dicebear image with "HP bar" (game progress).
  - `OptionButton`: Keypad style buttons.

## 5. Implementation Steps
1.  **Setup**: Install `axios`, `canvas-confetti` (for victory). Clean up default files.
2.  **Styles**: Add 'Press Start 2P' font, reset CSS, define variables.
3.  **Google Apps Script**: Write the `.gs` file content for the user to copy.
4.  **Core Components**: Build `PixelCard`, `Button`, `Input`.
5.  **Game Logic**:
    - `useQuiz` hook to handle fetching and state.
    - `GameScreen`: The main loop.
6.  **Views**:
    - `Home`: Input ID.
    - `Quiz`: Loop through questions.
    - `Result`: Show score/success.
7.  **Integration**: Connect to Env vars.

## 6. Google Apps Script Code (For User)
The user will need to paste this into their Google Sheet's Apps Script editor.

```javascript
// constants from script properties or hardcoded
const SCRIPT_PROP = PropertiesService.getScriptProperties();
const SHEET_ID = 'YOUR_SPREADSHEET_ID_HERE'; // Or active

function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const customParams = e.parameter.action ? e.parameter : JSON.parse(e.postData.contents);
  const action = customParams.action;
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  if (action === 'getQuestions') {
    const qSheet = ss.getSheetByName('題目');
    const rows = qSheet.getDataRange().getValues();
    const headers = rows.shift(); // Remove header
    // Parse to objects
    // Shuffle and slice
    // Return JSON
  }
  
  if (action === 'submitScore') {
    // Handle scoring and updating '回答' sheet
  }
}
```

## 7. Configuration (.env)
```
VITE_GOOGLE_APP_SCRIPT_URL=...
VITE_PASS_THRESHOLD=3
VITE_QUESTION_COUNT=5
```
