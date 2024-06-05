const category = {
  template: 'v1',
  auth: 'auth',
  member: 'member',
  order: 'order',
  common: 'common',
  brand: 'brand',
  mealPeriod: 'meal',
  payment: 'payment',
  memberShip: 'memberShip',
  channel: 'channel',
  point: 'point',
  coupon: 'coupon',
  rewardCard: 'rewardCard',
  commodity: 'commodity',
  tag: 'tag',
  permission: 'permission',
  holiday: 'holiday',
  stroe: 'store',
  notify: 'notify',
  mot: 'mot',
  cluster: 'cluster',
  report: 'report'
};

const template = {
  getTemplate: `${category.template}/test`
};

const auth = {
  login: `${category.auth}/login`,
  getAuthInfo: `${category.auth}/getAuthInfo`,
  refresh: `${category.auth}/refresh`,
  logout: `${category.auth}/logout`,
  getDashboard: `${category.auth}/getDashboard`
};

const member = {
  getMemberSpecialTypeMenu: `${category.member}/getMemberSpecialTypeMenu`,
  getMemberDetail: `${category.member}/getMemberDetail`,
  getMemberList: `${category.member}/getMemberList`,
  getMemberCommonData: `${category.member}/getMemberCommonData`,
  addMemberDetail: `${category.member}/addMemberDetail`,
  exportMemberList: `${category.member}/exportMemberList`,
  getMemberSpecialList: `${category.member}/getMemberSpecialList`,
  updMemberSpecialRank: `${category.member}/updMemberSpecialRank`,
  updMemberSpecialDetail: `${category.member}/updMemberSpecialDetail`,
  delMemberSpecialDetail: `${category.member}/delMemberSpecialDetail`,
  uploadMemberMobile: `${category.member}/uploadMemberMobile`,
  updBatchMemberSpecialType: `${category.member}/updBatchMemberSpecialType`,
  getMemberDetailByMobile: `${category.member}/getMemberDetailByMobile`,
  updMemberDetail: `${category.member}/updMemberDetail`,
  updateMemberPassword: `${category.member}/updateMemberPassword`,
  resendSms: `${category.member}/resendSms`,
  downloadMemberSpecialTypeExample: `${category.member}/downloadMemberSpecialTypeExample`,
  exportAssignMemberList: `${category.member}/exportAssignMemberList`,
  getMemberPointFilterOptions: `${category.member}/getMemberPointFilterOptions`,
  getMemberPointLog: `${category.member}/getMemberPointLog`,
  getMemberShipLog: `${category.member}/getMemberShipLog`,
  getOverviewAnalysis: `${category.member}/getOverviewAnalysis`,
  getMemberBookingLog: `${category.member}/getMemberBookingLog`,
  getMemberEcVoucherLog: `${category.member}/getMemberEcVoucherLog`,
  getMemberEcVoucherInfo: `${category.member}/getMemberEcVoucherInfo`,
  chkUploadMemberMobile: `${category.member}/chkUploadMemberMobile`,
  chkUploadMobileCsv: `${category.member}/chkUploadMobileCsv`
};

const order = {
  exportOrderDetail: `${category.order}/exportOrderDetail`,
  getPointLogFilterOptions: `${category.order}/getPointLogFilterOptions`,
  getPointLog: `${category.order}/getPointLog`,
  exportPointLog: `${category.order}/exportPointLog`,
  getMemberOrderLog: `${category.order}/getMemberOrderLog`,
  getOrderLog: `${category.order}/getOrderLog`,
  getOrderDetail: `${category.order}/getOrderDetail`,
  addOrderDetail: `${category.order}/addOrderDetail`,
  getOrderDetailByTransactionId: `${category.order}/getOrderDetailByTransactionId`,
  getOrderExportList: `${category.order}/getOrderExportList`
};

const common = {
  getTownshipCityData: `${category.common}/getTownshipCityData`,
  uploadImage: `${category.common}/uploadImage`,
  getRedisKeys: `${category.common}/getRedisKeys`,
  delRedisKey: `${category.common}/delRedisKey`,
  exportCsvData: `${category.common}/exportCsvData`
};

const brand = {
  getBrandList: `${category.brand}/getBrandList`,
  updBrandDetail: `${category.brand}/updBrandDetail`,
  delBrandDetail: `${category.brand}/delBrandDetail`,
  updBrandSort: `${category.brand}/updBrandSort`,
  getBrandMenu: `${category.brand}/getBrandMenu`,
  getBrandAndStoreList: `${category.brand}/getBrandAndStoreList`,
  getBrandMapStoreMenu: `${category.brand}/getBrandMapStoreMenu`
};

const mealPeriod = {
  getMealPeriodList: `${category.mealPeriod}/getMealPeriodList`,
  addMealPeriod: `${category.mealPeriod}/addMealPeriodSetting`,
  updMealPeriodDetail: `${category.mealPeriod}/updateMealPeriodSetting`,
  delMealPeriodDetail: `${category.mealPeriod}/delMealPeriodSetting`,
  updMealPeriodSort: `${category.mealPeriod}/updMealPeriodSort`
};

const payment = {
  getPaymentList: `${category.payment}/getPaymentList`,
  addPayment: `${category.payment}/addPaymentSetting`,
  updPaymentDetail: `${category.payment}/updatePaymentSetting`,
  delPayment: `${category.payment}/delPaymentSetting`,
  updPaymentSort: `${category.payment}/updPaymentSort`
};

const memberShip = {
  getMemberShipSettingList: `${category.memberShip}/getMemberShipSettingList`,
  memberShipSetting: `${category.memberShip}/memberShipSetting`,
  copyMemberShipSetting: `${category.memberShip}/copyMemberShipSetting`,
  delMemberShipSetting: `${category.memberShip}/delMemberShipSetting`,
  memberShip: `${category.memberShip}/memberShip`,
  releaseMemberShipSetting: `${category.memberShip}/releaseMemberShipSetting`,
  getMemberShipSettingInfo: `${category.memberShip}/getMemberShipSettingInfo`,
  getMemberSettingParameter: `${category.memberShip}/getMemberSettingParameter`,
  getBasicMemberShipSetting: `${category.memberShip}/getBasicMemberShipSetting`,
  getMemberShipMenu: `${category.memberShip}/getMemberShipMenu`,
  activeMemberShipSetting: `${category.memberShip}/activeMemberShipSetting`,
  activeMemberShip: `${category.memberShip}/activeMemberShip`
};
const channel = {
  getChannelList: `${category.channel}/getChannelList`,
  updChannelSort: `${category.channel}/updChannelSort`,
  updChannelDetail: `${category.channel}/updChannelDetail`,
  getChannelMenu: `${category.channel}/getChannelMenu`
};

const permission = {
  getRoleList: `${category.permission}/getRoleList`,
  addRole: `${category.permission}/addRole`,
  copyRole: `${category.permission}/copyRole`,
  getAuthItems: `${category.permission}/getAuthItems`,
  getRolePermissions: `${category.permission}/getRolePermissions`,
  updateRoleInfo: `${category.permission}/updateRoleInfo`,
  updateRolePermissions: `${category.permission}/updateRolePermissions`,
  updateRoleState: `${category.permission}/updateRoleState`,
  updateRoleListSort: `${category.permission}/updateRoleListSort`,
  getAccountList: `${category.permission}/getAccountList`,
  addAccount: `${category.permission}/addAccount`,
  copyAccount: `${category.permission}/copyAccount`,
  getAccountDepart: `${category.permission}/getAccountDepart`,
  getAccountInfo: `${category.permission}/getAccountInfo`,
  updateAccount: `${category.permission}/updateAccount`,
  deleteAccount: `${category.permission}/deleteAccount`,
  updateAccountState: `${category.permission}/updateAccountState`,
  deleteRole: `${category.permission}/deleteRole`
};

const commodity = {
  getCommodityList: `${category.commodity}/getCommodityList`
};

const holiday = {
  getHolidaySettingList: `${category.holiday}/getHolidaySettingList`,
  downloadHolidayExample: `${category.holiday}/downloadHolidayExample`,
  uploadHolidaySetting: `${category.holiday}/uploadHolidaySetting`,
  updBatchHolidaySetting: `${category.holiday}/updBatchHolidaySetting`
};

const coupon = {
  getCouponSettingList: `${category.coupon}/getCouponSettingList`,
  getCouponSettingDetail: `${category.coupon}/getCouponSettingDetail`,
  updCouponSettingDetail: `${category.coupon}/updCouponSettingDetail`,
  delCouponSettingDetail: `${category.coupon}/delCouponSettingDetail`,
  updCouponSendDetail: `${category.coupon}/updCouponSendDetail`,
  delCouponSendDetail: `${category.coupon}/delCouponSendDetail`,
  getMemberCouponDetailByRedeemId: `${category.coupon}/getMemberCouponDetailByRedeemId`,
  writeOffCouponDetail: `${category.coupon}/writeOffCouponDetail`,
  getCouponDetailList: `${category.coupon}/getCouponDetailList`,
  refundCouponDetail: `${category.coupon}/refundCouponDetail`,
  exportMemberList: `${category.coupon}/exportMemberList`,
  getCouponSendList: `${category.coupon}/getCouponSendList`,
  getCouponSendDetail: `${category.coupon}/getCouponSendDetail`,
  downloadCouponSendExample: `${category.coupon}/downloadCouponSendExample`,
  getMemberCouponDetailList: `${category.coupon}/getMemberCouponDetailList`
};

const point = {
  getPointSendingList: `${category.point}/getPointSendingList`,
  getPointSendingFilterOptions: `${category.point}/getPointSendingFilterOptions`,
  stopPointSending: `${category.point}/stopPointSending`,
  copyPointSending: `${category.point}/copyPointSending`,
  delPointSending: `${category.point}/delPointSending`,
  getPointAdjustList: `${category.point}/getPointAdjustList`,
  copyPointAdjust: `${category.point}/copyPointAdjust`,
  delPointAdjust: `${category.point}/delPointAdjust`,
  downloadMemberPointExample: `${category.point}/downloadMemberPointExample`,
  uploadMemberPoint: `${category.point}/uploadMemberPoint`,
  getConsSettingParameter: `${category.point}/getConsSettingParameter`,
  consSetting: `${category.point}/consSetting`,
  getConsSettingInfo: `${category.point}/getConsSettingInfo`,
  rewardSetting: `${category.point}/rewardSetting`,
  getRewardSettingInfo: `${category.point}/getRewardSettingInfo`,
  getProductList: `${category.point}/getProductList`,
  getBasicSettingInfo: `${category.point}/getBasicSettingInfo`,
  updateBasicSetting: `${category.point}/updateBasicSetting`,
  getPointAdjustInfo: `${category.point}/getPointAdjustInfo`,
  pointAdjust: `${category.point}/pointAdjust`
};

const stroe = {
  getStoreList: `${category.stroe}/getStoreList`,
  updStoreDetail: `${category.stroe}/updStoreDetail`,
  getStoreMallMenu: `${category.stroe}/getStoreMallMenu`
};

const notify = {
  getNotifyClassList: `${category.notify}/getNotifyClassList`,
  updNotifyClassRank: `${category.notify}/updNotifyClassRank`,
  updNotifyClassDetail: `${category.notify}/updNotifyClassDetail`,
  delNotifyClassDetail: `${category.notify}/delNotifyClassDetail`,
  getNotifyClassMenu: `${category.notify}/getNotifyClassMenu`,
  getNotifyMemberList: `${category.notify}/getNotifyMemberList`,
  updNotifyMemberDetail: `${category.notify}/updNotifyMemberDetail`,
  delNotifyMemberDetail: `${category.notify}/delNotifyMemberDetail`,
  downloadNotifyMemberExample: `${category.notify}/downloadNotifyMemberExample`,
  uploadAddNotifyMemberDetail: `${category.notify}/uploadAddNotifyMemberDetail`,
  updBatchAddNotifyMemberDetail: `${category.notify}/updBatchAddNotifyMemberDetail`,
  uploadDelNotifyMemberDetail: `${category.notify}/uploadDelNotifyMemberDetail`,
  updBatchDelNotifyMemberDetail: `${category.notify}/updBatchDelNotifyMemberDetail`
};

const tag = {
  getTagList: `${category.tag}/getTagList`,
  getTagMenu: `${category.tag}/getTagMenu`,
  addNewTag: `${category.tag}/addNewTag`,
  getTagDetail: `${category.tag}/getTagDetail`,
  insTagData: `${category.tag}/insTagData`,
  stopTagStatus: `${category.tag}/stopTagStatus`,
  delTagData: `${category.tag}/delTagData`,
  downloadTagMember: `${category.tag}/downloadTagMember`,
  getTagGroupList: `${category.tag}/getTagGroupList`,
  insTagGroup: `${category.tag}/insTagGroup`,
  delTagGroup: `${category.tag}/delTagGroup`,
  updTagGroupSort: `${category.tag}/updTagGroupSort`,
  downloadTagDemo: `${category.tag}/downloadTagDemo`,
  batchAddMemberTagCheck: `${category.tag}/batchAddMemberTagCheck`,
  batchAddMemberTagSave: `${category.tag}/batchAddMemberTagSave`,
  getTagMemberList: `${category.tag}/getTagMemberList`,
  addTagMember: `${category.tag}/addTagMember`,
  delTagMember: `${category.tag}/delTagMember`
};

const rewardCard = {
  getRewardCardSettingList: `${category.rewardCard}/getRewardCardSettingList`,
  getRewardCardSettingDetail: `${category.rewardCard}/getRewardCardSettingDetail`,
  updRewardCardSettingDetail: `${category.rewardCard}/updRewardCardSettingDetail`,
  delRewardCardSettingDetail: `${category.rewardCard}/delRewardCardSettingDetail`,
  getRewardSendList: `${category.rewardCard}/getRewardSendList`,
  getRewardSendDetail: `${category.rewardCard}/getRewardSendDetail`,
  uploadRewardSendDetail: `${category.rewardCard}/uploadRewardSendDetail`,
  updRewardSendDetail: `${category.rewardCard}/updRewardSendDetail`,
  delRewardSendDetail: `${category.rewardCard}/delRewardSendDetail`,
  downloadRewardSendExample: `${category.rewardCard}/downloadRewardSendExample`,
  getRewardCardMenu: `${category.rewardCard}/getRewardCardMenu`,
  getRewardCardDetail: `${category.rewardCard}/getRewardCardDetail`,
  getMemberRewardDetail: `${category.rewardCard}/getMemberRewardDetail`,
  exportRewardDetail: `${category.rewardCard}/exportRewardDetail`,
  getRewardDetail: `${category.rewardCard}/getRewardDetail`
};

const mot = {
  exportSendLog: `${category.mot}/exportSendLog`,
  getMotCommonSetting: `${category.mot}/getMotCommonSetting`,
  updateMotCommonSetting: `${category.mot}/updateMotCommonSetting`,
  getMotSettingList: `${category.mot}/getMotSettingList`,
  updateMotState: `${category.mot}/updateMotState`,
  getMotSettingInfo: `${category.mot}/getMotSettingInfo`,
  getMotSettingParameter: `${category.mot}/getMotSettingParameter`,
  updateMotSetting: `${category.mot}/updateMotSetting`,
  updateMotContentSetting: `${category.mot}/updateMotContentSetting`,
  updateMotClusterContent: `${category.mot}/updateMotClusterContent`,
  getMotClusterInfo: `${category.mot}/getMotClusterInfo`,
  getMotClusterList: `${category.mot}/getMotClusterList`,
  updateMotClusterSetting: `${category.mot}/updateMotClusterSetting`,
  sendTest: `${category.mot}/sendTest`,
  getSendLog: `${category.mot}/getSendLog`,
  clusterSendTest: `${category.mot}/clusterSendTest`,
  stopMotCluster: `${category.mot}/stopMotCluster`,
  deleteMotCluster: `${category.mot}/deleteMotCluster`
};

const cluster = {
  getClusterCommonSetting: `${category.cluster}/getClusterCommonSetting`,
  updClusterCommonSetting: `${category.cluster}/updClusterCommonSetting`,
  getClusterSettingList: `${category.cluster}/getClusterSettingList`,
  getClusterSettingDetail: `${category.cluster}/getClusterSettingDetail`,
  updClusterSetting: `${category.cluster}/updClusterSetting`,
  getClusterDownloadList: `${category.cluster}/getClusterDownloadList`,
  countClusterMember: `${category.cluster}/countClusterMember`,
  stopClusterSetting: `${category.cluster}/stopClusterSetting`,
  delClusterSetting: `${category.cluster}/delClusterSetting`
};

const report = {
  getReportExportList: `${category.report}/getReportExportList`,
  downloadReportExport: `${category.report}/downloadReportExport`
};

export default {
  template,
  auth,
  member,
  order,
  common,
  brand,
  mealPeriod,
  payment,
  memberShip,
  channel,
  permission,
  commodity,
  holiday,
  coupon,
  point,
  stroe,
  notify,
  tag,
  rewardCard,
  mot,
  cluster,
  report
};
