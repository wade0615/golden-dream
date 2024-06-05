//notifyClassOptions
class MotTextSettingClass {
  constructor(data, options) {
    const _sendData = data.clusterSendContent;
    this.action = data?.action ?? '';
    this.clusterDescription = data?.clusterDescription ?? '';
    this.clusterName = data.clusterName ?? '';
    this.peopleCount = data?.peopleCount ?? [];
    this.motSendStatus = data?.motSendStatus ?? '';
    this.sendMethod = data?.sendMethod ?? [];
    this.sendTarget = data?.sendTarget ?? '';
    this.sendStartDate = data?.startDate ?? '';
    this.sendEndDate = data?.endDate ?? '';
    if (data?.motSendStatus === 'everyMonth') {
      this.sendDay = data?.sendDay ?? '';
    } // 每月發送才有
    this.sendTime = data?.sendTime ?? '';
    this.sendDayBefore = data?.sendDayBefore ?? '';
    this.fileName = data?.fileName ?? '';
    this.fileUrl = data?.fileUrl ?? '';
    this.positiveData = data?.positiveData ?? [];
    this.negativeData = data?.negativeData ?? [];
    this.notifyClass = _sendData?.notifyId
      ? this.processNotifyId(_sendData?.notifyId, options)
      : [];
    if (data?.sendMethod?.includes('sms')) {
      this.smsContent = _sendData?.smsContent ?? '';
    }
    if (data?.sendMethod?.includes('app')) {
      this.appPushTitle = _sendData?.appPushTitle ?? '';
      this.appPushContent = _sendData?.appPushContent ?? '';
      this.msgImg = _sendData?.msgImg ? [_sendData?.msgImg] : [];
      this.msgSource = _sendData?.msgSource
        ? String(_sendData?.msgSource)
        : '0';

      this.msgUrl = _sendData?.msgUrl ?? '';
      this.msgType = _sendData?.msgType ? String(_sendData?.msgType) : '0';
    }
    if (data?.sendMethod?.includes('email')) {
      this.emailTitle = _sendData?.emailTitle ?? '';
      this.emailContent = _sendData?.emailContent ?? '';
      this.templatePhotoRdo = _sendData?.templatePhotoRdo
        ? String(_sendData?.templatePhotoRdo)
        : '0';
      this.templatePhotoImg = _sendData?.templatePhotoImg
        ? [_sendData?.templatePhotoImg]
        : [];
      this.templateColorRdo = _sendData?.templateColorRdo
        ? String(_sendData?.templateColorRdo)
        : '0';
      this.templateColor = _sendData?.templateColor ?? '';
      this.contentRdo = _sendData?.contentRdo
        ? String(_sendData?.contentRdo)
        : '0';
      if (_sendData?.contentRdo === 0) {
        //內文按鈕 0: 啟用, 1: 隱藏
        this.btnColorRdo = _sendData?.btnColorRdo
          ? String(_sendData?.btnColorRdo)
          : '0';
        this.btnColor = _sendData?.btnColor ?? '';
        this.btnWordRdo = _sendData?.btnWordRdo
          ? String(_sendData?.btnWordRdo)
          : '0';
        this.btnWord = _sendData?.btnWord ?? '';
        this.btnWordingRdo = _sendData?.btnWordingRdo
          ? String(_sendData?.btnWordingRdo)
          : '0';
        this.btnWording = _sendData?.btnWording ?? '';
        this.btnLinkRdo = _sendData?.btnLinkRdo
          ? String(_sendData?.btnLinkRto)
          : '0';
        this.btnLink = _sendData?.btnLink ?? '';
      }
    }
  }

  processNotifyId(notifyId, notifyClassOptions) {
    if (!Array.isArray(notifyId)) return [];
    return notifyId
      .map((id) => notifyClassOptions.find((notify) => notify.value === id))
      .filter(Boolean); // 只保留找到的對應項目
  }
}

export default MotTextSettingClass;
