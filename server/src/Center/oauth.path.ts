const member = {
  /** 註冊 */
  register: `/member/register`,
  /** 修改會員資料 */
  update: `/member/update`,
  /** 取得sms資訊 */
  smsInfo: `/member/smsInfo`
};

const crm = {
  /** 修改會員密碼 */
  resetPassword: `/crm/reset_password`,
  /** 重新發送驗證碼 */
  resendSms: `/crm/resend_sms`,
  /** 後台更新會員資料 */
  updMemberInfo: '/crm/upd_member_info'
};

export default {
  member,
  crm
};
