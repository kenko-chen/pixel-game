# Pixel Quiz Quest (Pixel Art 問答遊戲)

這是一個基於 React + Vite 開發的像素風格 (Pixel Art) 闖關問答遊戲。
遊戲特色包含復古街機介面、DiceBear 像素角色生成、以及與 Google Sheets/Apps Script 串接的完整後端計分系統。

![Pixel Art Style](https://api.dicebear.com/9.x/pixel-art/svg?seed=readme)

## 🚀 快速開始 (Quick Start)

### 1. 安裝環境
確保你的電腦已安裝 [Node.js](https://nodejs.org/)。

```bash
# 安裝相依套件
npm install

# 啟動本地開發伺服器
npm run dev
```

### 2. 環境變數設定 (.env)
在專案根目錄建立 `.env` 檔案（已由腳本產生範例），填入你的後端資訊：

```env
# Google Apps Script 部署後的 Web App URL
VITE_GOOGLE_APP_SCRIPT_URL=https://script.google.com/macros/s/你的SCRIPT_ID/exec

# 通過門檻 (答對幾題及格)
VITE_PASS_THRESHOLD=3

# 每次遊玩的題目數量
VITE_QUESTION_COUNT=5
```

---

## 📊 Google Sheets 設定 (後端資料庫)

本遊戲使用 Google Sheets 作為簡易資料庫。請依照以下步驟建立：

1.  新增一個 **Google Sheet**。
2.  建立兩個工作表 (Tabs)，名稱分別為 `題目` 和 `回答`。

### 工作表 1: `題目` (Questions)
這是題庫來源。請確保第一列 (Row 1) 為標題，資料從第二列開始。

| A | B | C | D | E | F | G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ID** | **Question** | **A** | **B** | **C** | **D** | **Answer** |
| q1 | 什麼是 AI? | 選項A | 選項B | 選項C | 選項D | A |

*(你可以直接複製下方的「生成式 AI 測試題庫」到這裡)*

### 工作表 2: `回答` (Responses)
這是用來記錄玩家成績的地方。程式會自動寫入，但你可以預先建立標題列：

| A | B | C | D | E | F | G |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **ID** | **次數** | **總分** | **最高分** | **首次通關分** | **通關耗時次** | **最近遊玩** |

---

## 🛠️ Google Apps Script 設定 (後端 API)

1.  在你的 Google Sheet 中，點擊上方選單 **擴充功能 (Extensions)** > **Apps Script**。
2.  刪除預設程式碼，將專案中的 `GOOGLESHEET_SCRIPT.gs` 內容完整複製貼上。
3.  點擊存檔 (磁碟片圖示)。
4.  **初次部署**：
    *   點擊右上角 **部署 (Deploy)** > **新增部署 (New deployment)**。
    *   選取類型：**網頁應用程式 (Web App)**。
    *   **執行身分 (Execute as)**: 設定為 **我 (Me)**。
    *   **誰可以存取 (Who has access)**: **重點！** 設定為 **所有使用者 (Anyone)**。
    *   點擊 **部署 (Deploy)**。
5.  複製產生的 **網頁應用程式網址 (Web App URL)**。
6.  將此網址貼回 `.env` 檔案中的 `VITE_GOOGLE_APP_SCRIPT_URL`。

### 常見問題
*   **更新程式碼後**：如果你修改了 GAS 程式碼，必須使用 **管理部署 (Manage deployments)** > 點擊筆 (Edit) > 版本選擇 **建立新版本 (New version)** > 部署，才會生效。

---

## 🌐 自動部署到 GitHub Pages

本專案已設定 GitHub Actions 工作流程 (`.github/workflows/deploy.yml`)，當你將程式碼推送到 GitHub 時，會自動建置並部署。

### 設定步驟

1.  **推送到 GitHub**: 將此專案上傳到你的 GitHub Repository。
2.  **設定 Secrets (環境變數)**:
    *   進入 Repository 的 **Settings** > **Secrets and variables** > **Actions**。
    *   點擊 **New repository secret**。
    *   新增 `VITE_GOOGLE_APP_SCRIPT_URL`，填入你的 GAS 網址。
    *   (選用) 點擊 **Variables** 分頁，新增 `VITE_PASS_THRESHOLD` 與 `VITE_QUESTION_COUNT` 來調整遊戲參數。
3.  **啟用 GitHub Pages**:
    *   進入 **Settings** > **Pages**。
    *   在 **Build and deployment** 下的 **Source** 選擇 `Deploy from a branch`。
    *   **Branch** 選擇 `gh-pages`，資料夾選擇 `/ (root)`。
    *   點擊 **Save**。
4.  **完成**: 等待 Actions 跑完 (約 1-2 分鐘)，你的遊戲就會在 `https://你的帳號.github.io/你的專案名稱/` 上線了！

---

## 📱 手機版支援
本遊戲已針對 RWD 進行優化，在手機上操作會自動切換為直式堆疊佈局，並適配觸控按鈕大小。

## 📁 專案結構
*   `src/components`: 遊戲主要元件 (Login, Game, Result)
*   `src/services`: API 串接邏輯
*   `src/index.css`: 全域樣式與像素風格定義
*   `GOOGLESHEET_SCRIPT.gs`:Google Apps Script 原始碼
