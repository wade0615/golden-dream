// import format from 'date-fns/format';

class AuthSettingDetailClass {
  constructor({
    authMemberId,
    account,
    authName,
    remark,
    createDate,
    createName,
    alterDate,
    alterName,
    roleList,
    depart,
    email
  }) {
    this.authMemberId = authMemberId ?? '';
    this.account = account ?? '';
    this.authName = authName ?? '';
    this.remark = remark ?? '';
    this.createDate = createDate ?? '';
    this.createName = createName ?? '';
    this.alterDate = alterDate ?? '';
    this.alterName = alterName ?? '';
    this.role = roleList?.[0]?.roleId ?? '';
    this.email = email ?? '';

    const departId = depart?.reduce((_accDepart, _curDepart) => {
      const storeId = _curDepart?.store?.map((_store) => _store?.storeId);
      return [..._accDepart, ...storeId];
    }, []);
    this.depart = departId ?? [];
  }
}

export default AuthSettingDetailClass;
