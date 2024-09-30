// MODULE 模組 項目大標題
// PAGE 頁面 項目
// READ 檢視/查詢
// CREATE_UPDATE
// DELETE 刪除
// ENABLE_DISABLE 啟用/停用
// EXPORT 下載/匯出
// COPY 複製

const AUTH_CODE = {
  /** 儀表板設定 預留項目 當前沒用到 */
  DASHBOARD: {
    MODULE: '',
    PAGE: '',
    READ: ''
  },
  /** 首頁設定 預留項目 當前沒用到 */
  HOME_SETTING: {
    MODULE: '',
    PAGE: '',
    READ: '',
    CREATE_UPDATE: ''
  },
  /** 會員管理 */
  MEMBER: {
    MODULE: '100',
    /** 會員資料 */
    INFO: {
      PAGE: '100_1010',
      READ: '100_1011',
      CREATE_UPDATE: '100_1012',
      EXPORT: '100_1013'
    },
    /** 會員資料下載 */
    DOWNLOAD_INFO: {
      PAGE: '100_1020',
      READ: '100_1021'
    },
    /** 特殊會員類型管理 */
    SPECIAL: {
      PAGE: '100_1030',
      READ: '100_1031',
      CREATE_UPDATE: '100_1032',
      DELETE: '100_1033'
    },
    /** 批量設定特殊會員 */
    BATCH_SETTING: {
      PAGE: '100_1040',
      READ: '100_1041',
      CREATE_UPDATE: '100_1042',
      DELETE: '100_1043'
    }
  }
};

export default AUTH_CODE;
