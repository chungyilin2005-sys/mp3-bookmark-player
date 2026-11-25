# 🎧 MP3 時間軸書籤播放器

在瀏覽器裡播放本機音訊檔，隨時標記時間點書籤、顯示音波條。音訊只在你的裝置上讀取，不會上傳。

**線上使用：** https://chungyilin2005-sys.github.io/mp3-bookmark-player/

## 功能

- 播放 MP3 / WAV / M4A / OGG，±5 秒、語速 0.75x～1.5x
- 時間點書籤：新增、編輯、刪除、點擊跳轉，匯出 / 匯入 JSON
- 音波條：顯示書籤旗標，點擊或拖曳跳轉，可縮放（全覽 / 60 秒 / 20 秒 / 5 秒）
- 自動儲存：書籤與播放位置存在瀏覽器 localStorage，重新選同一個檔案即可還原
- 剪輯：
  - 設定起點 A / 終點 B（按鈕、`[` `]` 鍵、拖曳音波上的 A/B 把手，或直接選兩個書籤）
  - 試聽選取範圍、A-B 循環播放
  - 匯出片段：MP3 直接切割音框、不重新編碼（音質不變、速度快）；其他格式輸出 WAV
  - 依書籤分割：以書籤為切點切成多段、用備註命名，打包成 ZIP（附分割清單 JSON）
- 鍵盤快捷鍵：Space、← →、B、M、Z、[ ]、L、1～9
- 手機可用

## 安全性

- 不載入任何外部資源（CSS 已預先編譯內嵌，不使用 CDN、Google Fonts）
- Content-Security-Policy 只允許執行雜湊值相符的內嵌 script
- 使用者文字一律以 `textContent` 寫入，不經過 `innerHTML`
- 匯入 JSON 有大小、筆數、備註長度限制
- 剪輯與 ZIP 打包全部在瀏覽器內完成，不使用外部函式庫、不上傳任何資料

## 開發

原始碼在 `src/player.src.html`。修改後執行：

```bash
node build.mjs
```

會用 `tailwindcss@3.4.17` 編譯 CSS、內嵌到頁面，並重新計算 CSP 雜湊，輸出 `index.html`。

> 修改 `<script>` 後一定要重新建置，否則 CSP 雜湊不符，頁面的 JavaScript 會被瀏覽器擋下。
