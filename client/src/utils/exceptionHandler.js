const LEVEL = {
  INFO: 'INFO',
  WARRING: 'WARRING',
  ERROR: 'ERROR'
};

class ExceptionHandleService {
  constructor({ _NAME, _NOTICE }) {
    this._NAME = _NAME ? _NAME : 'unknown'; // 註冊哪一個 .js 使用，方便快速找到錯誤的檔案
    this._NOTICE = _NOTICE ? _NOTICE : null; // 其它備註，非必填

    // system
    this._LEVEL = LEVEL; // 必填
  }

  logger(level, msg) {
    switch (level) {
      case LEVEL.INFO:
        console.info(msg);
        break;
      case LEVEL.WARRING:
        console.warn(msg);
        break;
      case LEVEL.ERROR:
        console.error(msg);
        console.log('=== error', msg);
        break;
      default:
        console.log(msg);
    }
  }

  /**
   * error 統一處理簡易 middleware
   * @param {*} error 原生錯誤
   * @param {*} cusMsg 自定義錯誤訊息
   * @param {*} level
   */
  errorReport(error, cusMsg, level) {

    console.log('=== errorReport')
    console.log('=== error', error)
    console.log('=== cusMsg', cusMsg)
    console.log('=== level', level)

    // api call
    this.logger(
      level,
      `>${this._NAME}<
[NOTICE]: ${this._NOTICE}
[訊息]: ${cusMsg}
${error}`
    );
  }
}

export default ExceptionHandleService;
