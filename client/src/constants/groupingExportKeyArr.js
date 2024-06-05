/**
 * @description 匯出設定
 */
const groupingExportKeyArr = Object.freeze({
  member: [
    // 會員資料
    ['memberCardId', '會員卡號'],
    ['memberName', '姓名'],
    ['birthday', '生日'],
    ['gender', '性別'],
    ['email', 'Email'],
    ['address', '居住地'],
    ['specialMemberType', '特殊會員類型'],
    ['memberShip', '會籍'],
    ['memberShipExpiredDate', '會籍到期日'],
    ['lastPoint', '剩餘有效積點']
  ],
  static: [
    // 消費統計
    ['memberTag', '標籤'],
    ['registrationDate', '註冊日期'],
    ['orderChannel', '消費來源'],
    ['orderBrand', '消費品牌'],
    ['orderOriginalAmount', '累計原始訂單金額'],
    ['orderCount', '累計消費次數'],
    ['orderPaidAmount', '累計實際消費金額'],
    ['discountCount', '累計折扣次數'],
    ['discountAmount', '累計折扣金額'],
    ['discountPointCount', '累計折抵點數次數'],
    ['discountPoint', '累計折抵點數'],
    ['cancelReturnCount', '取消退貨次數'],
    ['cancelReturnAmount', '取消退貨金額']
  ]
});

export default groupingExportKeyArr;
