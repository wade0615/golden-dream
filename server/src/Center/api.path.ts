const member = {
  /** 取得會員特殊類型選單 */
  getMemberSpecialTypeMenu: `/getMemberSpecialTypeMenu`,
  /** 取得會員基本資料 */
  getMemberDetail: `/getMemberDetail`,
  /** 取得會員列表 */
  getMemberList: `/getMemberList`,
  /** 取得會員共用資料(OAuth) */
  getMemberCommonData: `/getMemberCommonData`,
  /** 新增會員詳細資料 */
  addMemberDetail: `/addMemberDetail`,
  /** 修改會員詳細資料 */
  updMemberDetail: `/updMemberDetail`,
  /** 取得特殊會員類型列表 */
  getMemberSpecialList: `/getMemberSpecialList`,
  /** 修改特殊會員排序 */
  updMemberSpecialRank: `/updMemberSpecialRank`,
  /** 修改特殊會員詳細資料 */
  updMemberSpecialDetail: `/updMemberSpecialDetail`,
  /** 特殊會員資料刪除(軟刪) */
  delMemberSpecialDetail: `/delMemberSpecialDetail`,
  /** 檢查上傳電話號碼 */
  chkUploadMemberMobile: `/chkUploadMemberMobile`,
  /** 下載特殊會員類型範本 */
  downloadMemberSpecialTypeExample: `/downloadMemberSpecialTypeExample`,
  /** 批量儲存特殊會員類型 */
  updBatchMemberSpecialType: `/updBatchMemberSpecialType`,
  /** 依手機號碼取得會員資料 */
  getMemberDetailByMobile: `/getMemberDetailByMobile`,
  /** 更改會員密碼(OAuth) */
  updateMemberPassword: `/updateMemberPassword`,
  /** 重新發送驗證碼(OAuth) */
  resendSms: `/resendSms`,
  /** 依推薦碼取得會員資料 */
  getMemberDetailByReferrerCode: `/getMemberDetailByReferrerCode`,

  // 積點歷程
  /** 取得會員積點歷程下單選項 */
  getMemberPointFilterOptions: `/getMemberPointFilterOptions`,
  /** 取得會員積點歷程 */
  getMemberPointLog: `/getMemberPointLog`,

  // 會籍歷程
  /** 取得會員會籍歷程 */
  getMemberShipLog: `/getMemberShipLog`,

  // 訂位資訊
  /** 取得會員訂位資訊 */
  getMemberBookingLog: `/getMemberBookingLog`,

  // 電子票卷、交易管理-電子票券紀錄
  /** 取得會員電子票卷紀錄 */
  getMemberEcVoucherLog: `/getMemberEcVoucherLog`,
  /** 取得會員電子票卷詳細資料 */
  getMemberEcVoucherInfo: `/getMemberEcVoucherInfo`,

  /** 取得會員紅利資料(OAuth) */
  getMemberBonus: `/getMemberBonus`,
  /** 取得紅利點數紀錄 */
  getBonusHistory: `/getBonusHistory`,
  /** 取得會員總覽分析 */
  getOverviewAnalysis: `/getOverviewAnalysis`
};

const brand = {
  /** 取得品牌設定列表 */
  getBrandList: `/getBrandList`,
  /** 取得品牌菜單 */
  getBrandMenu: `/getBrandMenu`,
  /** 取得品牌關聯門市的菜單 */
  getBrandMapStoreMenu: `/getBrandMapStoreMenu`,
  /** 品牌門市刪除(軟刪) */
  delBrandDetail: `/delBrandDetail`,
  /** 品牌門市儲存 */
  updBrandDetail: `/updBrandDetail`,
  /** 修改品牌排序 */
  updBrandSort: `/updBrandSort`,
  /** 取得品牌與門市列表 */
  getBrandAndStoreList: `/getBrandAndStoreList`
};

const store = {
  /** 取得門市設定列表 */
  getStoreList: `/getStoreList`,
  /** 修改門市設定 */
  updStoreDetail: `/updStoreDetail`,
  /** 取得門市商場菜單 */
  getStoreMallMenu: `/getStoreMallMenu`
};

const channel = {
  /** 取得渠道列表 */
  getChannelList: `/getChannelList`,
  /** 修改渠道順序 */
  updChannelSort: `/updChannelSort`,
  /** 修改渠道資料 */
  updChannelDetail: `/updChannelDetail`,
  /** 取得渠道下拉式選單 */
  getChannelMenu: `/getChannelMenu`
};

const point = {
  // 基本設定
  /** 取得基本設定詳細資訊 */
  getBasicSettingInfo: `/getBasicSettingInfo`,
  /** 編輯基本設定 */
  updateBasicSetting: `/updateBasicSetting`,

  // 積點發放規則
  /** 積點發放規則列表 */
  getPointSendingList: `/getPointSendingList`,
  /** 積點發放規則篩選資料 */
  getPointSendingFilterOptions: `/getPointSendingFilterOptions`,
  /** 複製發放規則 */
  copyPointSending: `/copyPointSending`,
  /** 停用發放規則 */
  stopPointSending: `/stopPointSending`,
  /** 新增/編輯消費型積點設定 */
  addConsSetting: `/consSetting`,
  /** 消費型積點設定所需參數 */
  getConsSettingParameter: `/getConsSettingParameter`,
  /** 消費型積點設定詳細資料 */
  getConsSettingInfo: `/getConsSettingInfo`,
  // /** 取得品牌門市列表 */ 棄用
  // getStoreList: `/getStoreList`,
  // /** 門市列表篩選資料 */ 棄用
  // getStoreFilterOptions: `/getStoreFilterOptions`,
  /** 取得商品列表 */
  getProductList: `/getProductList`,
  /** 刪除消費型、活動型積點設定 */
  delPointSending: `/delPointSending`,
  /** 新增/編輯活動型積點設定 */
  addRewardSetting: `rewardSetting`,
  /** 活動型積點設定詳細資料 */
  getRewardSettingInfo: `/getRewardSettingInfo`,

  // 積點調整
  /** 積點調整列表 */
  getPointAdjustList: `/getPointAdjustList`,
  /** 複製積點調整 */
  copyPointAdjust: `/copyPointAdjust`,
  /** 刪除積點調整 */
  delPointAdjust: `/delPointAdjust`,
  /** 新增/編輯積點調整 */
  addPointAdjust: `/pointAdjust`,
  /** 積點調整詳細資訊 */
  getPointAdjustInfo: `/getPointAdjustInfo`,
  /** 下載上傳會員積點範本 */
  downloadMemberPointExample: `/downloadMemberPointExample`,
  /** 匯入 excel 會員積點 */
  uploadMemberPoint: `/uploadMemberPoint`
};

const memberShip = {
  /** 取得會籍設定列表 */
  getMemberShipSettingList: '/getMemberShipSettingList',
  /** 新增編輯會籍版本 */
  addMemberShipSetting: '/memberShipSetting',
  /** 編輯生效中的會籍版本 */
  updateActiveMemberShipSetting: '/activeMemberShipSetting',
  /** 複製會籍版本 */
  copyMemberShipSetting: '/copyMemberShipSetting',
  /** 刪除會籍版本 */
  delMemberShipSetting: '/delMemberShipSetting',
  /** 新增編輯單項會籍 */
  addMemberShip: '/memberShip',
  /** 編輯啟用中的單項會籍 */
  updateActiveMemberShip: '/activeMemberShip',
  /** 發布會籍版本 */
  releaseMemberShipSetting: '/releaseMemberShipSetting',
  /** 會籍版本設定詳細資訊 */
  getMemberShipSettingInfo: '/getMemberShipSettingInfo',
  /** 取得會員消費納入會籍計算時間 & next會籍參數 */
  getMemberSettingParameter: '/getMemberSettingParameter',
  /** [CRM][POS] 取得初階會籍資料  */
  getBasicMemberShipSetting: '/getBasicMemberShipSetting',
  /** [CRM][Backend] 取得會籍下拉式選單 */
  getMemberShipMenu: '/getMemberShipMenu',

  /** 排程 demo 用 */
  batchDemo: '/batchDemo',
  batchMemberShipDemo: '/batchMemberShipDemo',
  controlBatch: '/controlBatch',
  deleteFinishKey: '/deleteFinishKey'
};

const order = {
  /** 取得訂單紀錄 */
  getOrderLog: `/getOrderLog`,
  /** 取得會員訂單記錄 */
  getMemberOrderLog: `/getMemberOrderLog`,
  /** 取得訂單詳細資料 */
  getOrderDetail: `/getOrderDetail`,
  /** 補登訂單資料 */
  addOrderDetail: `/addOrderDetail`,
  /** 依交易編號取得訂單詳情 */
  getOrderDetailByTransactionId: `/getOrderDetailByTransactionId`,

  /** 優惠券商品券退貨 */
  returnCoupon: `/returnCoupon`,

  // 積點明細
  /** 取得積點明細列表 */
  getPointLog: `/getPointLog`,
  /** 積點明細下拉篩選資料 */
  getPointLogFilterOptions: `/getPointLogFilterOptions`,
  /** 匯出積點明細 */
  exportPointLog: `/exportPointLog`,
  /** 取得交易資料匯出列表 */
  getOrderExportList: `/getOrderExportList`,
  /** 取得會員消費資料 */
  getMemberOrderData: `/getMemberOrderData`
};

const commodity = {
  /** 取得商品資料列表 */
  getCommodityList: `/getCommodityList`,
  /** 新增商品資料 */
  addCommodityDetail: `/addCommodityDetail`
};

const holiday = {
  /** 假日設定 */
  getHolidaySettingList: `/getHolidaySettingList`,
  /** 下載假日設定範本 */
  downloadHolidayExample: `/downloadHolidayExample`,
  /** 上傳假日設定 */
  uploadHolidaySetting: `/uploadHolidaySetting`,
  /** 儲存假日設定 */
  updBatchHolidaySetting: `/updBatchHolidaySetting`
};

const common = {
  /** 更新 code center */
  updateCodeCenter: `/updateCodeCenter`,
  /** 取得品牌設定列表 */
  getTownshipCityData: `/getTownshipCityData`,
  /** 上傳圖片 */
  uploadImage: `/uploadImage`,
  /** 檢查電話號碼是否存在 */
  checkMobileIsExisted: `/checkMobileIsExisted`,
  /** 取得redis keys */
  getRedisKeys: `/getRedisKeys`,
  /** 刪除redis key */
  delRedisKey: `/delRedisKey`,
  /** 設置redis 資料 */
  setRedisData: `/setRedisData`,
  /** 匯入 csv 資料 */
  importCsvData: `/importCsvData`,
  /** 匯出 csv 資料 */
  exportCsvData: `/exportCsvData`,

  /** 匯入通知 */
  importNotification: `/importNotification`
};

const meal = {
  /** 取得基本設定詳細資訊 */
  getMealPeriodList: '/getMealPeriodList',
  /** 編輯排序 */
  updMealPeriodSort: '/updMealPeriodSort',
  /** 編輯餐期設定 */
  updateMealPeriodSetting: '/updateMealPeriodSetting',
  /** 刪除餐期 */
  delMealPeriodSetting: '/delMealPeriodSetting',
  /** 新增餐期 */
  addMealPeriodSetting: '/addMealPeriodSetting'
};

const payment = {
  /** 取得基本設定詳細資訊 */
  getPaymentList: '/getPaymentList',
  /** 編輯排序 */
  updPaymentSort: '/updPaymentSort',
  /** 編輯餐期設定 */
  updatePaymentSetting: '/updatePaymentSetting',
  /** 刪除餐期 */
  delPaymentSetting: '/delPaymentSetting',
  /** 新增餐期 */
  addPaymentSetting: '/addPaymentSetting'
};

const auth = {
  /** 登入 */
  login: '/login',
  /** 登出 */
  logout: '/logout',
  /** 刷新 */
  refresh: '/refresh',
  /** 取得用戶資料 */
  getAuthInfo: '/getAuthInfo',
  /** dashboard 資訊 */
  getDashboard: '/getDashboard',
  /** 刪除 token for 前端 demo */
  tokenDemo: '/tokenDemo'
};

const permission = {
  //帳號相關
  /** 取得帳號列表 */
  getAccountList: '/getAccountList',
  /** 取得帳號資訊 */
  getAccountInfo: '/getAccountInfo',
  /** 取得帳號事業部選項 */
  getAccountDepart: '/getAccountDepart',
  /** 編輯帳號 */
  updateAccount: '/updateAccount',
  /** 新增帳號 */
  addAccount: '/addAccount',
  /** 複製帳號 */
  copyAccount: '/copyAccount',
  /** 修改帳號狀態 */
  updateAccountState: '/updateAccountState',
  /** 刪除帳號 */
  deleteAccount: '/deleteAccount',

  //權限相關
  /** 取得角色列表 */
  getRoleList: 'getRoleList',
  /** 取得權限列表 */
  getAuthItems: 'getAuthItems',
  /** 取得角色權限 */
  getRolePermissions: 'getRolePermissions',
  /** 修改角色 */
  updateRoleInfo: 'updateRoleInfo',
  /** 修改角色權限 */
  updateRolePermissions: 'updateRolePermissions',
  /** 新增角色 */
  addRole: 'addRole',
  /** 複製角色 */
  copyRole: 'copyRole',
  /** 刪除角色 */
  deleteRole: 'deleteRole',
  /** 變更角色狀態 */
  updateRoleState: 'updateRoleState',
  /** 變更角色排序 */
  updateRoleListSort: 'updateRoleListSort'
};

const coupon = {
  /** 取得兌換券設定列表 */
  getCouponSettingList: `/getCouponSettingList`,
  /** 取得兌換券設定詳細資料 */
  getCouponSettingDetail: `/getCouponSettingDetail`,
  /** 修改兌換券詳細資料 */
  updCouponSettingDetail: `/updCouponSettingDetail`,
  /** 刪除兌換券詳細資料 */
  delCouponSettingDetail: `/delCouponSettingDetail`,
  /** 取得兌換券發放列表 */
  getCouponSendList: `/getCouponSendList`,
  /** 取得兌換券發放詳細資料 */
  getCouponSendDetail: `/getCouponSendDetail`,
  /** 修改兌換券發放詳細資料 */
  updCouponSendDetail: `/updCouponSendDetail`,
  /** 刪除兌換券發放詳細資料 */
  delCouponSendDetail: `/delCouponSendDetail`,
  /** 依兌換券編碼會員兌換券資料 */
  getMemberCouponDetailByRedeemId: `/getMemberCouponDetailByRedeemId`,
  /** 核銷兌換券 */
  writeOffCouponDetail: `/writeOffCouponDetail`,
  /** 取得兌換券明細列表 */
  getCouponDetailList: `/getCouponDetailList`,
  /** 退貨兌換券 */
  refundCouponDetail: `/refundCouponDetail`,
  /** 匯出兌換券 */
  exportCouponDetailList: `/exportCouponDetailList`,
  /** 取得會員兌換券明細 */
  getMemberCouponDetailList: `/getMemberCouponDetailList`,
  /** 下載兌換券發放選擇會員範本 */
  downloadCouponSendExample: `/downloadCouponSendExample`,
  /** 取得會員票券列表 */
  getMemberCouponList: `/getMemberCouponList`,
  /** 取得會員票券詳情 */
  getMemberCouponDetail: `/getMemberCouponDetail`,
  /** 取得會員歷史票券列表 */
  getMemberHistoryCouponList: `/getMemberHistoryCouponList`,
  /** 取得會員歷史票券詳情 */
  getMemberHistoryCouponDetail: `/getMemberHistoryCouponDetail`,
  /** 取得票券兌換碼 */
  getMemberCouponCode: `/getMemberCouponCode`,
  /** 取得即將到期票券數量 */
  getAboutToExpiredCoupon: `/getAboutToExpiredCoupon`,
  /** 轉贈票券 */
  giveMemberCoupon: `/giveMemberCoupon`,
  /** 取得優惠券列表 */
  getCouponSearch: `/getCouponSearch`,
  /** 優惠券詳情 */
  getCouponDetail: `/getCouponDetail`,
  /** 兌換優惠券 */
  exchangeCoupon: `/exchangeCoupon`,
  /** [POS] 取得會員票券詳情 */
  getPosMemberCouponDetail: `/getPosMemberCouponDetail`,
  /** [POS] 核銷會員票券 */
  writeOffPosCouponDetail: `/writeOffPosCouponDetail`
};

const rewardCard = {
  /** 取得集點卡列表 */
  getRewardCardSettingList: `/getRewardCardSettingList`,
  /** 取得集點卡詳情 */
  getRewardCardSettingDetail: `/getRewardCardSettingDetail`,
  /** 儲存集點卡資料 */
  updRewardCardSettingDetail: `/updRewardCardSettingDetail`,
  /** 刪除集點卡 */
  delRewardCardSettingDetail: `/delRewardCardSettingDetail`,
  /** 取得集點發送列表 */
  getRewardSendList: `/getRewardSendList`,
  /** 取得集點發送詳情 */
  getRewardSendDetail: `/getRewardSendDetail`,
  /** 上傳集點發送 Excel */
  uploadRewardSendDetail: `/uploadRewardSendDetail`,
  /** 儲存集點發送 */
  updRewardSendDetail: `/updRewardSendDetail`,
  /** 刪除集點發送 */
  delRewardSendDetail: `/delRewardSendDetail`,
  /** 下載集點發送範本 */
  downloadRewardSendExample: `/downloadRewardSendExample`,
  /** 取得集點卡下拉式選單 */
  getRewardCardMenu: `/getRewardCardMenu`,
  /** 取得集點明細 */
  getRewardDetail: `/getRewardDetail`,
  /** 取得會員集點明細 */
  getMemberRewardDetail: `/getMemberRewardDetail`,
  /** 匯出會員集點明細 */
  exportRewardDetail: `/exportRewardDetail`,
  /** 取得會員集點活動列表 */
  getMemberRewardCardList: `/getMemberRewardCardList`,
  /** 取得會員集點活動詳情 */
  getMemberRewardCardDetail: `/getMemberRewardCardDetail`,
  /** 取得會員集點活動可兌換獎品列表 */
  getMemberRewardCardGiftList: `/getMemberRewardCardGiftList`,
  /** 取得會員集點活動可兌換獎品詳情 */
  getMemberRewardCardGiftDetail: `/getMemberRewardCardGiftDetail`,
  /** 兌換獎品 */
  exchangeRewardCard: `/exchangeRewardCard`,
  /** 取得集點歷程 */
  getRewardCardHistory: `/getRewardCardHistory`,
  /** DEMO用 */
  demoBatch: `/demoBatch`,
  /** DEMO用 新增交易資料 */
  demoAddData: `/demoAddData`
};

const notify = {
  /** 取得通知分類設定 */
  getNotifyClassList: `/getNotifyClassList`,
  /** 修改通知分類設定排序 */
  updNotifyClassRank: `/updNotifyClassRank`,
  /** 修改通知分類詳細資料 */
  updNotifyClassDetail: `/updNotifyClassDetail`,
  /** 刪除通知分類 */
  delNotifyClassDetail: `/delNotifyClassDetail`,
  /** 取得通知分類下拉式選單 */
  getNotifyClassMenu: `/getNotifyClassMenu`,
  /** 取得通知人員列表 */
  getNotifyMemberList: `/getNotifyMemberList`,
  /** 修改通知人員詳細資料 */
  updNotifyMemberDetail: `/updNotifyMemberDetail`,
  /** 刪除通知人員資料 */
  delNotifyMemberDetail: `/delNotifyMemberDetail`,
  /** 下載通知人員名單範本 */
  downloadNotifyMemberExample: `/downloadNotifyMemberExample`,
  /** 上傳新增通知人員名單 */
  uploadAddNotifyMemberDetail: `/uploadAddNotifyMemberDetail`,
  /** 儲存新增通知人員名單 */
  updBatchAddNotifyMemberDetail: `/updBatchAddNotifyMemberDetail`,
  /** 儲存刪除通知人員名單 */
  updBatchDelNotifyMemberDetail: `/updBatchDelNotifyMemberDetail`
};

const tag = {
  /** 取得標籤列表 */
  getTagList: `/getTagList`,
  /** 取得標籤詳細資料 */
  getTagDetail: `/getTagDetail`,
  /** 新增標籤資料 */
  insTagData: `/insTagData`,
  /** 停用標籤 */
  stopTagStatus: `/stopTagStatus`,
  /** 刪除標籤 */
  delTagData: `/delTagData`,
  /** 下載標籤 */
  downloadTagExample: `/downloadTagExample`,
  /** 取得標籤分類列表 */
  getTagGroupList: `/getTagGroupList`,
  /** 新增標籤分類 */
  insTagGroup: `/insTagGroup`,
  /** 刪除標籤分類 */
  delTagGroup: `/delTagGroup`,
  /** 調整標籤分類排序 */
  updTagGroupSort: `/updTagGroupSort`,
  /** 取得標籤下拉式選單 */
  getTagMenu: `/getTagMenu`,
  /** 取得標籤分類下拉式選單 */
  getTagGroupMenu: `/getTagGroupMenu`,
  /** 新增會員標籤 */
  addTagMember: `/addTagMember`,
  /** 移除會員標籤 */
  delTagMember: `/delTagMember`,
  /** 取得貼標列表 */
  getTagMemberList: `/getTagMemberList`
};

const cluster = {
  /** 取得分群通用設定 */
  getClusterCommonSetting: `/getClusterCommonSetting`,
  /** 設置分群通用設定 */
  updClusterCommonSetting: `/updClusterCommonSetting`,
  /** 取得分群設定列表 */
  getClusterSettingList: `/getClusterSettingList`,
  /** 取得分群設定詳細 */
  getClusterSettingDetail: `/getClusterSettingDetail`,
  /** 更新分群設定 */
  updClusterSetting: `/updClusterSetting`,
  /** 計算分群觸及人數 */
  countClusterMember: `/countClusterMember`,
  /** 取得分群下載列表 */
  getClusterDownloadList: `/getClusterDownloadList`,
  /** 停用分群設定 */
  stopClusterSetting: `/stopClusterSetting`,
  /** 刪除分群設定 */
  delClusterSetting: `/delClusterSetting`,
  /** demo set */
  demo: `/demo`
};

const mot = {
  /** 編輯單次/定期群發建立條件 */
  updateMotClusterSetting: `/updateMotClusterSetting`,
  /** 編輯單次/定期群發發送內容設定 */
  updateMotClusterContent: `/updateMotClusterContent`,
  /** 取得單次/定期群發發送內容資訊 */
  getMotClusterInfo: `/getMotClusterInfo`,
  /** 取得單次/定期群發列表 */
  getMotClusterList: `/getMotClusterList`,
  /** 群發設定測試發送 */
  clusterSendTest: `/clusterSendTest`,
  /** 停用定期群發管理 */
  stopMotCluster: `/stopMotCluster`,
  /** 刪除群發管理 */
  deleteMotCluster: `/deleteMotCluster`,

  // 群發通用設定
  /** 取得群發通用設定 */
  getMotCommonSetting: `/getMotCommonSetting`,
  /** 編輯群發通用設定 */
  updateMotCommonSetting: `/updateMotCommonSetting`,

  // 會員MOT管理
  /** 取得事件設定所需參數 */
  getMotSettingParameter: `/getMotSettingParameter`,
  /** 編輯建立條件 */
  updateMotSetting: `/updateMotSetting`,
  /** 編輯發送內容設定 */
  updateMotContentSetting: `/updateMotContentSetting`,
  /** 測試發送 */
  sendTest: `/sendTest`,
  /** 取得 MOT 設定資訊 */
  getMotSettingInfo: `/getMotSettingInfo`,
  /** 取得 MOT 設定列表 */
  getMotSettingList: `/getMotSettingList`,
  /** 啟用/停用 MOT 事件 */
  updateMotState: `/updateMotState`,

  // 群發紀錄
  /** 取得群發紀錄 */
  getSendLog: `/getSendLog`,
  /** 匯出單筆群發紀錄 */
  exportSendLog: `/exportSendLog`,

  /** 新增事件(OAuth) */
  insertEvent: `/insertEvent`,
  /** 偵測 email 是否有被打開 */
  mailTrack: `/mailTrack`
};

const report = {
  /** 取得報表匯出列表 */
  getReportExportList: '/getReportExportList',
  /** 下載報表 */
  downloadReportExport: '/downloadReportExport'
};

export default {
  member,
  point,
  brand,
  store,
  channel,
  memberShip,
  order,
  commodity,
  holiday,
  common,
  meal,
  payment,
  permission,
  auth,
  coupon,
  rewardCard,
  notify,
  tag,
  cluster,
  mot,
  report
};
