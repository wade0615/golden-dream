class MotSettingInfoClass {
  constructor(data, notifyClassOptions) {
    this.memberShipId = data?.memberShipId ?? '';
    this.memberShipName = data?.memberShipName ?? '';
    this.notifyId = this.processNotifyId(data?.notifyId, notifyClassOptions);
    this.smsContent = data?.smsContent ?? '';
    this.appPushTitle = data?.appPushTitle ?? '';
    this.appPushContent = data?.appPushContent ?? '';
    this.msgImg = data?.msgImg ? [data?.msgImg] : [];
    this.msgSource = data?.msgSource ? String(data?.msgSource) : '0';
    this.msgUrl = data?.msgUrl ?? '';
    this.msgType = data?.msgType ? String(data?.msgType) : '0';
    this.emailTitle = data?.emailTitle ?? '';
    this.emailContent = data?.emailContent ?? '';
    this.templatePhotoRdo = data?.templatePhotoRdo
      ? String(data?.templatePhotoRdo)
      : '0';
    this.templatePhotoImg = data?.templatePhotoImg
      ? [data?.templatePhotoImg]
      : [];
    this.templateColorRdo = data?.templateColorRdo
      ? String(data?.templateColorRdo)
      : '0';
    this.templateColor = data?.templateColor ?? '';
    this.contentRdo = data?.contentRdo ? String(data?.contentRdo) : '0';
    this.btnColorRdo = data?.btnColorRdo ? String(data?.btnColorRdo) : '0';
    this.btnColor = data?.btnColor ?? '';
    this.btnWordRdo = data?.btnWordRdo ? String(data?.btnWordRdo) : '0';
    this.btnWord = data?.btnWord ?? '';
    this.btnWordingRdo = data?.btnWordingRdo
      ? String(data?.btnWordingRdo)
      : '0';
    this.btnWording = data?.btnWording ?? '';
    this.btnLinkRto = data?.btnLinkRto ? String(data?.btnLinkRto) : '0';
    this.btnLink = data?.btnLink ?? '';
  }
  processNotifyId(notifyId, notifyClassOptions) {
    if (!Array.isArray(notifyId)) return [];
    return notifyId
      .map((id) =>
        notifyClassOptions.find((notify) => notify.value === String(id))
      )
      .filter(Boolean); // 只保留找到的對應項目
  }
}

export default MotSettingInfoClass;
