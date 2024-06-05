import { formatDefTimeNew } from 'utils/timeUtils';

class AuthSettingListClass {
  constructor({
    account,
    alterDate,
    alterName,
    authMemberId,
    authName,
    createDate,
    createName,
    departList,
    lastLoginDate,
    state,
    roleName
  }) {
    this.id = authMemberId ?? '';
    this.account = account ?? '';
    this.name = authName ?? '';
    this.auth = authMemberId ?? '';
    this.departList =
      Array.from(new Set(departList?.map((obj) => obj.brandId)))?.map(
        (brandId) => {
          const _depart = departList?.find((obj) => obj.brandId === brandId);
          return {
            brandId: _depart.brandId ?? '-',
            brandName: _depart.brandName ?? ''
          };
        }
      ) ?? [];
    this.state = state ?? false;
    this.lastLoginDate = lastLoginDate
      ? formatDefTimeNew(new Date(lastLoginDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.createName = createName;
    this.createDate = createDate
      ? formatDefTimeNew(new Date(createDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.updateName = alterName;
    this.updateDate = alterDate
      ? formatDefTimeNew(new Date(alterDate), {
          formatString: 'yyyy/MM/dd HH:mm'
        })
      : '';
    this.roleName = roleName && roleName !== '' ? roleName : '-';
  }
}

export default AuthSettingListClass;
