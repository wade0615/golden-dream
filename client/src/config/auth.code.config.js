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
    MODULE: 'crm_m_100',
    /** 會員資料 */
    INFO: {
      PAGE: 'crm_m_100_1010',
      READ: 'crm_m_100_1011',
      CREATE_UPDATE: 'crm_m_100_1012',
      EXPORT: 'crm_m_100_1013'
    },
    /** 會員資料下載 */
    DOWNLOAD_INFO: {
      PAGE: 'crm_m_100_1020',
      READ: 'crm_m_100_1021'
    },
    /** 特殊會員類型管理 */
    SPECIAL: {
      PAGE: 'crm_m_100_1030',
      READ: 'crm_m_100_1031',
      CREATE_UPDATE: 'crm_m_100_1032',
      DELETE: 'crm_m_100_1033'
    },
    /** 批量設定特殊會員 */
    BATCH_SETTING: {
      PAGE: 'crm_m_100_1040',
      READ: 'crm_m_100_1041',
      CREATE_UPDATE: 'crm_m_100_1042',
      DELETE: 'crm_m_100_1043'
    }
  }
};

export default AUTH_CODE;
