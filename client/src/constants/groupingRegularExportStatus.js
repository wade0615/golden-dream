/**
 * @description 匯出時間設定 - 定期匯出
 */
const groupingRegularExportStatus = Object.freeze({
  everyHalfMonth: 'everyHalfMonth', // 每半月
  everyMonth: 'everyMonth', // 每月
  everyQuarter: 'everyQuarter', // 每季
  specifiedDate: 'specifiedDate', // 指定日期
  specifiedRangeDate: 'specifiedRangeDate', // 指定日期區間
  immediate: 'immediate' // 立即匯出
});

export default groupingRegularExportStatus;
