export enum GENDER_STR {
  /** 男 */
  MAN = 'M',
  /** 女 */
  FEMALE = 'F',
  /** 秘密 */
  OTHER = 'S'
}

export const GENDER_TW_NAME = {
  [GENDER_STR.MAN]: '男',
  [GENDER_STR.FEMALE]: '女',
  [GENDER_STR.OTHER]: '保密'
};
