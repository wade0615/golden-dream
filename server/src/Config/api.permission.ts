export const PermissionRoute = {
  /**
   * [會員管理]
   * 會員資料頁面
   */
  /** 取得總覽分析 */
  'member/getOverviewAnalysis': ['crm_m_100_1011'],
  /** 取得會員列表 */
  'member/getMemberList': ['crm_m_100_1011'],
  /** 取得會員特殊類型選單 */
  'member/getMemberSpecialTypeMenu': ['crm_m_100_1011'],
  /** 取得會員基本資料 */
  'member/getMemberDetail': ['crm_m_100_1011'],
  /** 取得會員共用資料(OAuth) */
  'member/getMemberCommonData': ['crm_m_100_1011'],
  /** 取得品牌設定列表 */
  'common/getTownshipCityData': [
    'crm_m_100_1011',
    'crm_poi_300_311',
    'crm_poi_300_312',
    'crm_sys_1400_1411',
    'crm_cou_400_411',
    'crm_cou_400_412',
    'crm_cou_400_414'
  ],
  /** 取得品牌菜單 */
  'brand/getBrandMenu': [
    'crm_m_100_1011',
    'crm_cou_400_411',
    'crm_cou_400_412',
    'crm_cou_400_414',
    'crm_pc_500_511',
    'crm_pc_500_512',
    'crm_tra_600_641',
    'crm_tra_600_651',
    'crm_tra_600_661'
  ],
  /** 取得會員訂位資訊 */
  'member/getMemberBookingLog': ['crm_m_100_1011'],
  /** 取得會員積點歷程下單選項 */
  'member/getMemberPointFilterOptions': ['crm_m_100_1011'],
  /** 取得會員積點歷程 */
  'member/getMemberPointLog': ['crm_m_100_1011'],
  /** 取得會員電子票卷紀錄 */
  'member/getMemberEcVoucherLog': ['crm_m_100_1011'],
  /** 取得會員電子票卷詳細資料 */
  'member/getMemberEcVoucherInfo': ['crm_m_100_1011'],
  /** 取得會員兌換券明細 */
  'coupon/getMemberCouponDetailList': ['crm_m_100_1011'],
  /** 取得會員會籍歷程 */
  'member/getMemberShipLog': ['crm_m_100_1011'],
  /** 新增會員詳細資料 */
  'member/addMemberDetail': ['crm_m_100_1012'],
  /** 修改會員詳細資料 */
  'member/updMemberDetail': ['crm_m_100_1012'],

  /**
   * [會員管理]
   * 特殊會員類型管理
   */
  /** 取得特殊會員類型列表 */
  'member/getMemberSpecialList': ['crm_m_100_1031'],
  /** 修改特殊會員排序 */
  'member/updMemberSpecialRank': ['crm_m_100_1032'],
  /** 修改特殊會員詳細資料 */
  'member/updMemberSpecialDetail': ['crm_m_100_1032'],
  /** 特殊會員資料刪除(軟刪) */
  'member/delMemberSpecialDetail': ['crm_m_100_1033'],

  /**
   * [會員管理]
   * 批量設定特殊會員
   */
  /** 下載特殊會員類型範本 */
  'member/downloadMemberSpecialTypeExample': [
    'crm_m_100_1041',
    'crm_m_100_1042'
  ],
  /** 檢查上傳電話號碼 */
  'member/chkUploadMemberMobile': ['crm_m_100_1042'],
  /** 批量儲存特殊會員類型 */
  'member/updBatchMemberSpecialType': ['crm_m_100_1042'],
  /** 依手機號碼取得會員資料 */
  'member/getMemberDetailByMobile': ['crm_m_100_1042', 'crm_tra_600_611'],

  /**
   * [會籍設定]
   * 會籍設定
   */
  /** 取得會籍設定列表 */
  'memberShip/getMemberShipSettingList': ['crm_ms_200_211'],
  /** 新增編輯會籍版本 */
  'memberShip/memberShipSetting': ['crm_ms_200_212'],
  /** 編輯生效中的會籍版本 */
  'memberShip/activeMemberShipSetting': ['crm_ms_200_212'],
  /** 複製會籍版本 */
  'memberShip/copyMemberShipSetting': ['crm_ms_200_214'],
  /** 刪除會籍版本 */
  'memberShip/delMemberShipSetting': ['crm_ms_200_213'],
  /** 新增編輯單項會籍 */
  'memberShip/memberShip': ['crm_ms_200_212'],
  /** 編輯啟用中的單項會籍 */
  'memberShip/activeMemberShip': ['crm_ms_200_212'],
  /** 發布會籍版本 */
  'memberShip/releaseMemberShipSetting': ['crm_ms_200_212', 'crm_ms_200_215'],
  /** 會籍版本設定詳細資訊 */
  'memberShip/getMemberShipSettingInfo': ['crm_ms_200_211'],
  /** 取得會員消費納入會籍計算時間 & next會籍參數 */
  'memberShip/getMemberSettingParameter': ['crm_ms_200_211'],
  /** 取得會籍下拉式選單 */
  'memberShip/getMemberShipMenu': [
    'crm_cou_400_411',
    'crm_cou_400_412',
    'crm_cou_400_414'
  ],

  /**
   * [積點管理]
   * 積點發放規則
   */
  /** 積點發放規則列表 */
  'point/getPointSendingList': ['crm_poi_300_311'],
  /** 積點發放規則篩選資料 */
  'point/getPointSendingFilterOptions': ['crm_poi_300_311'],
  /** 新增/編輯消費型積點設定 */
  'point/consSetting': ['crm_poi_300_312'],
  /** 消費型積點設定所需參數 */
  'point/getConsSettingParameter': ['crm_poi_300_312', 'crm_poi_300_311'],
  /** 消費型積點設定詳細資料 */
  'point/getConsSettingInfo': ['crm_poi_300_311'],
  /** 活動型積點設定詳細資料 */
  'point/getRewardSettingInfo': ['crm_poi_300_311'],
  /** 取得商品列表 */
  'point/getProductList': ['crm_poi_300_312'],
  /** 新增/編輯活動型積點設定 */
  'point/rewardSetting': ['crm_poi_300_312'],
  /** 取得品牌與門市列表 */
  'store/getBrandAndStoreList': ['crm_poi_300_312'],
  /** 刪除消費型、活動型積點設定 */
  'point/delPointSending': ['crm_poi_300_313'],
  /** 複製發放規則 */
  'point/copyPointSending': ['crm_poi_300_314'],
  /** 停用發放規則 */
  'point/stopPointSending': ['crm_poi_300_315'],

  /**
   * [積點管理]
   * 積點調整
   */
  /** 積點調整詳細資訊 */
  'point/getPointAdjustInfo': ['crm_poi_300_321'],
  /** 積點調整列表 */
  'point/getPointAdjustList': ['crm_poi_300_321'],
  /** 新增/編輯積點調整 */
  'point/pointAdjust': ['crm_poi_300_322'],
  /** 複製積點調整 */
  'point/copyPointAdjust': ['crm_poi_300_324'],
  /** 刪除積點調整 */
  'point/delPointAdjust': ['crm_poi_300_323'],
  /** 下載上傳會員積點範本 */
  'point/downloadMemberPointExample': ['crm_poi_300_322'],
  /** 匯入 excel 會員積點 */
  'point/uploadMemberPoint': ['crm_poi_300_322'],

  /**
   * [積點管理]
   * 基本設定
   */
  /** 取得基本設定詳細資訊 */
  'point/getBasicSettingInfo': ['crm_poi_300_331'],
  /** 編輯基本設定 */
  'point/updateBasicSetting': ['crm_poi_300_332'],

  /**
   * [兌換管理]
   * 優惠券/兌換商品設定
   */
  /** 取得兌換券設定列表*/
  'coupon/getCouponSettingList': ['crm_cou_400_411'],
  /** 取得兌換券設定詳細資料 */
  'coupon/getCouponSettingDetail': [
    'crm_cou_400_411',
    'crm_cou_400_412',
    'crm_cou_400_414'
  ],
  /** 修改兌換券詳細資料 */
  'coupon/updCouponSettingDetail': ['crm_cou_400_412', 'crm_cou_400_414'],
  /** 刪除兌換券詳細資料 */
  'coupon/delCouponSettingDetail': ['crm_cou_400_413'],

  /**
   * [兌換管理]
   * 優惠券/兌換商品發放
   */
  /** 取得兌換券發放列表 */
  'coupon/getCouponSendList': ['crm_cou_400_421'],
  /** 取得兌換券發放詳細資料 */
  'coupon/getCouponSendDetail': ['crm_cou_400_421', 'crm_cou_400_424'],
  /** 修改兌換券發放詳細資料 */
  'coupon/updCouponSendDetail': ['crm_cou_400_422', 'crm_cou_400_424'],
  /** 刪除兌換券發放詳細資料 */
  'coupon/delCouponSendDetail': ['crm_cou_400_423'],

  /**
   * [集點卡管理]
   * 集點卡設定
   */
  /** 取得集點卡列表 */
  'rewardCard/getRewardCardSettingList': ['crm_pc_500_511'],
  /** 取得集點卡詳情 */
  'rewardCard/getRewardCardSettingDetail': ['crm_pc_500_511'],
  /** 儲存集點卡資料 */
  'rewardCard/updRewardCardSettingDetail': ['crm_pc_500_512'],
  /** 刪除集點卡 */
  'rewardCard/delRewardCardSettingDetail': ['crm_pc_500_513'],

  /**
   * [集點卡管理]
   * 集點卡調整
   */
  /** 取得集點發送列表 */
  'rewardCard/getRewardSendList': ['crm_pc_500_551'],
  /** 取得集點發送詳情 */
  'rewardCard/getRewardSendDetail': ['crm_pc_500_551', 'crm_pc_500_552'],
  /** 上傳集點發送 Excel */
  'rewardCard/uploadRewardSendDetail': ['crm_pc_500_552'],
  /** 儲存集點發送 */
  'rewardCard/updRewardSendDetail': ['crm_pc_500_552'],
  /** 刪除集點發送 */
  'rewardCard/delRewardSendDetail': ['crm_pc_500_553'],
  /** 下載集點發送範本 */
  'rewardCard/downloadRewardSendExample': ['crm_pc_500_552'],
  /** 取得集點卡下拉式選單 */
  'rewardCard/getRewardCardMenu': ['crm_pc_500_551', 'crm_pc_500_552'],

  /** 取得會員集點明細 */
  'rewardCard/getMemberRewardDetail': ['crm_m_100_1011'],
  /** 匯出會員集點明細 */
  'rewardCard/exportRewardDetail': ['crm_pc_500_552'],

  /**
   * [交易管理]
   * 消費紀錄
   */
  /** 取得訂單紀錄 */
  'order/getOrderLog': ['crm_tra_600_611'],
  /** 取得會員訂單記錄 */
  'order/getMemberOrderLog': ['crm_m_100_1011'],
  /** 取得訂單詳細資料 */
  'order/getOrderDetail': ['crm_tra_600_611'],
  /** 補登訂單資料 */
  'order/addOrderDetail': ['crm_tra_600_612'],
  /** 依交易編號取得訂單詳情 */
  'order/getOrderDetailByTransactionId': ['crm_tra_600_611'],

  /** TODO:NOT YET
   * [交易管理]
   * 電子票券紀錄
   */

  /**
   * [交易管理]
   * 積點明細
   */
  /** 取得積點明細列表 */
  'order/getPointLog': ['crm_tra_600_631'],
  /** 積點明細下拉篩選資料 */
  'order/getPointLogFilterOptions': ['crm_tra_600_631'],
  /** 匯出積點明細 */
  'order/exportPointLog': ['crm_tra_600_632'],

  /**
   * [交易管理]
   * 優惠券明細/商品券明細
   */
  /** 取得兌換券明細列表 */
  'coupon/getCouponDetailList': ['crm_tra_600_651', 'crm_tra_600_661'],
  /** 匯出兌換券 */
  'coupon/exportCouponDetailList': ['crm_tra_600_651'],
  /** 退貨兌換券 */
  'coupon/refundCouponDetail': ['crm_tra_600_651', 'crm_tra_600_661'],
  /** 下載兌換券發放選擇會員範本 */
  'coupon/downloadCouponSendExample': ['crm_cou_400_422'],

  /**
   * [交易管理]
   * 集點卡明細
   */
  /** 取得集點明細 */
  'rewardCard/getRewardDetail': ['crm_tra_600_641'],

  /**   /** TODO:NOT YET
   * [交易管理]
   * 交易資料下載
   */
  /** 取得交易匯出資料列表 */
  'order/getOrderExportList': [
    'crm_m_100_1021',
    'crm_tag_1100_1141',
    'crm_tra_600_671'
  ],

  /**
   * [核銷管理]
   * 核銷兌換券
   */
  /** 依兌換券編碼會員兌換券資料 */
  'coupon/getMemberCouponDetailByRedeemId': ['crm_wo_700_711'],
  /** 核銷兌換券 */
  'coupon/writeOffCouponDetail': ['crm_wo_700_711'],

  /**
   * [會員分群管理]
   * 分群資料下載
   */
  /** 取得分群下載列表 */
  'cluster/getClusterDownloadList': ['crm_gp_800_811', 'crm_gp_800_812'],

  /**
   * [會員分群管理]
   * 定期/單次分群資料管理
   */
  /** 取得分群設定列表 */
  'cluster/getClusterSettingList': ['crm_gp_800_821', 'crm_gp_800_831'],
  /** 取得分群設定詳細 */
  'cluster/getClusterSettingDetail': ['crm_gp_800_821', 'crm_gp_800_831'],
  /** 更新分群設定 */
  'cluster/updClusterSetting': [
    'crm_gp_800_822',
    'crm_gp_800_832',
    'crm_gp_800_824',
    'crm_gp_800_834'
  ],
  /** 計算分群觸及人數 */
  'cluster/countClusterMember': [
    'crm_gp_800_821',
    'crm_gp_800_831',
    'crm_gp_800_822',
    'crm_gp_800_832',
    'crm_gp_800_824',
    'crm_gp_800_834'
  ],
  /** 停用分群設定 */
  'cluster/stopClusterSetting': ['crm_gp_800_825'],
  /** 刪除分群設定 */
  'cluster/delClusterSetting': ['crm_gp_800_823', 'crm_gp_800_833'],

  /**
   * [會員分群管理]
   * 分群通用設定
   */
  /** 取得分群通用設定 */
  'cluster/getClusterCommonSetting': ['crm_gp_800_841'],
  /** 設置分群通用設定 */
  'cluster/updClusterCommonSetting': ['crm_gp_800_842'],

  /** TODO:confirm after frontend finished
   * [自動化行銷管理]
   * 單次群發管理
   * 定期群發管理
   */
  /** 編輯單次/定期群發建立條件 */
  'mot/updateMotClusterSetting': ['crm_mot_900_912', 'crm_mot_900_914'],
  /** 編輯單次/定期群發發送內容設定 */
  'mot/updateMotClusterContent': ['crm_mot_900_912', 'crm_mot_900_914'],
  /** 取得單次/定期群發發送內容資訊 */
  'mot/getMotClusterInfo': ['crm_mot_900_911', 'crm_mot_900_912'],
  /** 取得單次/定期群發列表 */
  'mot/getMotClusterList': ['crm_mot_900_911'],
  /** 群發設定測試發送 */
  'mot/clusterSendTest': ['crm_mot_900_911', 'crm_mot_900_912'],
  /** 停用定期群發管理 */
  'mot/stopMotCluster': ['crm_mot_900_925'],
  /** 刪除群發管理 */
  'mot/deleteMotCluster': ['crm_mot_900_913', 'crm_mot_900_923'],

  /**
   * [自動化行銷管理]
   * 會員MOT管理
   */
  /** 取得事件設定所需參數 */
  'mot/getMotSettingParameter': ['crm_mot_900_931', 'crm_mot_900_932'],
  /** 編輯建立條件 */
  'mot/updateMotSetting': ['crm_mot_900_932'],
  /** 編輯發送內容設定 */
  'mot/updateMotContentSetting': ['crm_mot_900_932'],
  /** 測試發送 */
  'mot/sendTest': ['crm_mot_900_931', 'crm_mot_900_932'],
  /** 取得 MOT 設定資訊 */
  'mot/getMotSettingInfo': ['crm_mot_900_931', 'crm_mot_900_932'],
  /** 取得 MOT 設定列表 */
  'mot/getMotSettingList': ['crm_mot_900_931'],
  /** 啟用/停用 MOT 事件 */
  'mot/updateMotState': ['crm_mot_900_933'],

  /**
   * [自動化行銷管理]
   * 群發紀錄
   */
  /** 取得群發紀錄 */
  'mot/getSendLog': ['crm_mot_900_941'],
  /** 匯出單筆群發紀錄 */
  'mot/exportSendLog': ['crm_mot_900_941'],

  /**
   * [自動化行銷管理]
   * 群發通用設定
   */
  /** 取得群發通用設定 */
  'mot/getMotCommonSetting': [
    'crm_mot_900_951',
    'crm_mot_900_931',
    'crm_mot_900_932'
  ],
  /** 編輯群發通用設定 */
  'mot/updateMotCommonSetting': ['crm_mot_900_952'],

  /**
   * [標籤管理]
   * 會員標籤管理
   */
  /** 取得標籤列表 */
  'tag/getTagList': ['crm_tag_1100_1111'],
  /** 取得標籤詳細資訊 */
  'tag/getTagDetail': ['crm_m_100_1011', 'crm_tag_1100_1112'],
  /** 新增標籤資料 */
  'tag/insTagData': ['crm_tag_1100_1112'],
  /** 停用標籤 */
  'tag/stopTagStatus': ['crm_tag_1100_1114'],
  /** 刪除標籤 */
  'tag/delTagData': ['crm_tag_1100_1113'],

  /**
   * [標籤管理]
   * 標籤分類管理
   */
  /** 取得標籤分類管理列表 */
  'tag/getTagGroupList': ['crm_tag_1100_1121'],
  /** 新增/編輯標籤分類 */
  'tag/insTagGroup': ['crm_tag_1100_1122'],
  /** 刪除標籤分類 */
  'tag/delTagGroup': ['crm_tag_1100_1113'],
  /** 更改標籤分類排序 */
  'tag/updTagGroupSort': ['crm_tag_1100_1122'],

  /**
   * [標籤管理]
   * 批量貼標管理
   */
  /** 下載標籤範本 */
  'tag/downloadTagExample': ['crm_tag_1100_1132'],
  /** 取得標籤下拉式選單 */
  'tag/getTagMenu': ['crm_tag_1100_1131'],
  /** 取得標籤分類下拉式選單 */
  'tag/getTagGroupMenu': ['crm_tag_1100_1131'],
  /** 新增會員標籤 */
  'tag/addTagMember': ['crm_tag_1100_1132'],
  /** 移除會員標籤 */
  'tag/delTagMember': ['crm_tag_1100_1133'],
  /** 取得貼標列表 */
  'tag/getTagMemberList': ['crm_tag_1100_1131'],

  /**
   * [報表管理]
   */
  /** 取得報表匯出列表 */
  'report/getReportExportList': [
    'crm_rep_1200_1211',
    'crm_rep_1200_1221',
    'crm_rep_1200_1231',
    'crm_rep_1200_1241',
    'crm_rep_1200_1251',
    'crm_rep_1200_1261'
  ],
  /** 下載報表 */
  'report/downloadReportExport': [
    'crm_rep_1200_1212',
    'crm_rep_1200_1222',
    'crm_rep_1200_1232',
    'crm_rep_1200_1242',
    'crm_rep_1200_1252',
    'crm_rep_1200_1262'
  ],

  /**
   * [權限管理]
   * 角色管理
   */
  /** 取得角色列表 */
  'permission/getRoleList': [
    'crm_auth_1300_1311',
    'crm_auth_1300_1312',
    'crm_auth_1300_1321',
    'crm_auth_1300_1322'
  ],
  /** 取得權限列表 */
  'permission/getAuthItems': ['crm_auth_1300_1311'],
  /** 取得角色權限 */
  'permission/getRolePermissions': ['crm_auth_1300_1311'],
  /** 修改角色 */
  'permission/updateRoleInfo': ['crm_auth_1300_1312'],
  /** 修改角色權限 */
  'permission/updateRolePermissions': ['crm_auth_1300_1312'],
  /** 新增角色 */
  'permission/addRole': ['crm_auth_1300_1312'],
  /** 複製角色 */
  'permission/copyRole': ['crm_auth_1300_1314'],
  /** 刪除角色 */
  'permission/deleteRole': ['crm_auth_1300_1313'],
  /** 變更角色狀態 */
  'permission/updateRoleState': ['crm_auth_1300_1315'],
  /** 變更角色排序 */
  'permission/updateRoleListSort': ['crm_auth_1300_1311', 'crm_auth_1300_1312'],

  /**
   * [權限管理]
   * 帳號管理
   */
  /** 取得帳號列表 */
  'permission/getAccountList': ['crm_auth_1300_1321'],
  /** 取得帳號資訊 */
  'permission/getAccountInfo': ['crm_auth_1300_1322'],
  /** 取得帳號事業部選項 */
  'permission/getAccountDepart': ['crm_auth_1300_1322'],
  /** 編輯帳號 */
  'permission/updateAccount': ['crm_auth_1300_1322'],
  /** 新增帳號 */
  'permission/addAccount': ['crm_auth_1300_1322'],
  /** 複製帳號 */
  'permission/copyAccount': ['crm_auth_1300_1324'],
  /** 修改帳號狀態 */
  'permission/updateAccountState': ['crm_auth_1300_1325'],
  /** 刪除帳號 */
  'permission/deleteAccount': ['crm_auth_1300_1323'],

  /**
   * [系統管理]
   * 品牌門市管理
   */
  /** 取得門市設定列表 */
  'store/getStoreList': ['crm_sys_1400_1411'],
  /** 取得門市商場菜單 */
  'store/getStoreMallMenu': ['crm_poi_300_312'],
  /** 品牌門市儲存 */
  'brand/updBrandDetail': ['crm_sys_1400_1412'],
  /** 修改門市設定 */
  'store/updStoreDetail': ['crm_sys_1400_1412'],
  /** 取得品牌設定列表 */
  'brand/getBrandList': [
    'crm_sys_1400_1411',
    'crm_sys_1400_1421',
    'crm_sys_1400_1461'
  ],
  /** 修改品牌排序 */
  'brand/updBrandSort': ['crm_sys_1400_1411', 'crm_sys_1400_1412'],
  /** 取得品牌關聯門市的菜單 */
  'brand/getBrandMapStoreMenu': [
    'crm_wo_700_711',
    'crm_tra_600_611',
    'crm_pc_500_551',
    'crm_pc_500_552'
  ],
  /** 品牌門市刪除(軟刪) */
  'brand/delBrandDetail': ['crm_sys_1400_1413'],
  /** 取得品牌與門市列表 */
  'brand/getBrandAndStoreList': ['crm_sys_1400_1411'],

  /**
   * [系統管理]
   * 商品資訊
   */
  /** 取得商品資料列表 */
  'commodity/getCommodityList': ['crm_sys_1400_1421'],

  /**
   * [系統管理]
   * POS餐期設定
   */
  /** 取得基本設定詳細資訊 */
  'meal/getMealPeriodList': ['crm_sys_1400_1431'],
  /** 編輯排序 */
  'meal/updMealPeriodSort': ['crm_sys_1400_1431', 'crm_sys_1400_1432'],
  /** 編輯餐期設定 */
  'meal/updateMealPeriodSetting': ['crm_sys_1400_1432'],
  /** 刪除餐期 */
  'meal/delMealPeriodSetting': ['crm_sys_1400_1433'],
  /** 新增餐期 */
  'meal/addMealPeriodSetting': ['crm_sys_1400_1432'],

  /**
   * [系統管理]
   * 支付方式設定
   */
  /** 取得基本設定詳細資訊 */
  'payment/getPaymentList': ['crm_sys_1400_1441', 'crm_tra_600_611'],
  /** 編輯排序 */
  'payment/updPaymentSort': ['crm_sys_1400_1441', 'crm_sys_1400_1442'],
  /** 編輯餐期設定 */
  'payment/updatePaymentSetting': ['crm_sys_1400_1442'],
  /** 刪除餐期 */
  'payment/delPaymentSetting': ['crm_sys_1400_1443'],
  /** 新增餐期 */
  'payment/addPaymentSetting': ['crm_sys_1400_1442'],

  /**
   * [系統管理]
   * 假日設定
   */
  /** 假日設定 */
  'holiday/getHolidaySettingList': ['crm_sys_1400_1451'],
  /** 下載假日設定範本 */
  'holiday/downloadHolidayExample': ['crm_sys_1400_1452'],
  /** 上傳假日設定 */
  'holiday/uploadHolidaySetting': ['crm_sys_1400_1452'],
  /** 儲存假日設定 */
  'holiday/updBatchHolidaySetting': ['crm_sys_1400_1452'],

  /**
   * [系統管理]
   * 渠道設定
   */
  /** 取得渠道列表 */
  'channel/getChannelList': [
    'crm_poi_300_311',
    'crm_poi_300_312',
    'crm_sys_1400_1421',
    'crm_sys_1400_1461'
  ],
  /** 修改渠道順序 */
  'channel/updChannelSort': ['crm_sys_1400_1462'],
  /** 修改渠道資料 */
  'channel/updChannelDetail': ['crm_sys_1400_1462'],
  /** 取得渠道下拉式選單 */
  'channel/getChannelMenu': [
    'crm_m_100_1011',
    'crm_cou_400_411',
    'crm_cou_400_412',
    'crm_cou_400_414',
    'crm_tra_600_651',
    'crm_tra_600_661'
  ],

  /**
   * [系統管理]
   * 通知設定
   */
  /** 取得通知分類設定 */
  'notify/getNotifyClassList': ['crm_sys_1400_1471'],
  /** 修改通知分類設定排序 */
  'notify/updNotifyClassRank': ['crm_sys_1400_1471', 'crm_sys_1400_1472'],
  /** 修改通知分類詳細資料 */
  'notify/updNotifyClassDetail': ['crm_sys_1400_1472'],
  /** 刪除通知分類 */
  'notify/delNotifyClassDetail': ['crm_sys_1400_1473'],
  /** 取得通知分類下拉式選單 */
  'notify/getNotifyClassMenu': [
    'crm_sys_1400_1472',
    'crm_gp_800_821',
    'crm_gp_800_831',
    'crm_gp_800_822',
    'crm_gp_800_832',
    'crm_gp_800_824',
    'crm_gp_800_834'
  ],
  /** 取得通知人員列表 */
  'notify/getNotifyMemberList': ['crm_sys_1400_1471'],
  /** 修改通知人員詳細資料 */
  'notify/updNotifyMemberDetail': ['crm_sys_1400_1472'],
  /** 刪除通知人員資料 */
  'notify/delNotifyMemberDetail': ['crm_sys_1400_1473'],
  /** 下載通知人員名單範本 */
  'notify/downloadNotifyMemberExample': ['crm_sys_1400_1472'],
  /** 上傳新增通知人員名單 */
  'notify/uploadAddNotifyMemberDetail': ['crm_sys_1400_1472'],
  /** 儲存新增通知人員名單 */
  'notify/updBatchAddNotifyMemberDetail': ['crm_sys_1400_1472'],
  /** 上傳刪除通知人員名單 */
  'notify/uploadDelNotifyMemberDetail': ['crm_sys_1400_1472'],
  /** 儲存刪除通知人員名單 */
  'notify/updBatchDelNotifyMemberDetail': ['crm_sys_1400_1472'],

  /**
   * [共用]
   */
  'common/exportCsvData': ['crm_m_100_1013']
};
