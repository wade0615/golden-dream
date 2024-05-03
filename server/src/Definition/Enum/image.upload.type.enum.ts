export enum IMAGE_UPLOAD_TYPE {
  /** image */
  COUPON_MAIN_IMAGE = 'coupon_main_image',
  COUPON_THUMBNAIL = 'coupon_thumbnail_image',
  EDITOR = 'editor',
  REWARD_CARD_MAIN_IMAGE = 'rewardCard_main_image',
  REWARD_THUMBNAIL_IMAGE = 'rewardCard_thumbnail_image',
  /** MOT 模板圖片 */
  MOT_SETTING = 'mot_setting',
  /** MOT 發送內容設定 訊息夾縮圖 */
  MOT_MSG_IMAGE = 'mot_msg_image'
}

export enum FILE_SAVE_PATH {
  COUPON = '/coupon',
  EDITOR = '/editor',
  REWARD_CARD = '/reward-card',
  MOT_SETTING = '/mot-setting'
}

export const IMAGE_UPLOAD_TYPE_CONFIG: {
  [x: string]: {
    count: number;
    size: number;
    height: number;
    width: number;
    path: string;
  };
} = Object.freeze({
  [IMAGE_UPLOAD_TYPE.EDITOR]: {
    count: 1,
    size: null,
    height: null,
    width: null,
    path: FILE_SAVE_PATH.EDITOR
  },
  [IMAGE_UPLOAD_TYPE.COUPON_MAIN_IMAGE]: {
    count: 1,
    size: 3,
    height: 810,
    width: 1080,
    path: FILE_SAVE_PATH.COUPON
  },
  [IMAGE_UPLOAD_TYPE.COUPON_THUMBNAIL]: {
    count: 1,
    size: 3,
    height: 405,
    width: 540,
    path: FILE_SAVE_PATH.COUPON
  },
  [IMAGE_UPLOAD_TYPE.REWARD_CARD_MAIN_IMAGE]: {
    count: 1,
    size: 3,
    height: 810,
    width: 1080,
    path: FILE_SAVE_PATH.REWARD_CARD
  },
  [IMAGE_UPLOAD_TYPE.REWARD_THUMBNAIL_IMAGE]: {
    count: 1,
    size: 3,
    height: 405,
    width: 540,
    path: FILE_SAVE_PATH.REWARD_CARD
  },
  [IMAGE_UPLOAD_TYPE.MOT_SETTING]: {
    count: 1,
    size: 2,
    height: 400,
    width: 800,
    path: FILE_SAVE_PATH.MOT_SETTING
  },
  [IMAGE_UPLOAD_TYPE.MOT_MSG_IMAGE]: {
    count: 1,
    size: 2,
    height: 600,
    width: 600,
    path: FILE_SAVE_PATH.MOT_SETTING
  }
});
