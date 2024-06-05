// const switchType = (typeName) => {
//   let result;
//   switch (typeName) {
//     case '檢視/查詢':
//       result = 'view';
//       break;
//     case '新增/編輯':
//       result = 'edit';
//       break;
//     case '刪除':
//       result = 'delete';
//       break;
//     case '複製':
//       result = 'copy';
//       break;
//     case '啟用/停用':
//       result = 'active';
//       break;
//     case '下載':
//       result = 'download';
//       break;
//     default:
//       result = '';
//   }
//   return result;
// };

const switchType = (typeName) => {
  let result;
  if (/檢視|查詢/.test(typeName)) {
    result = 'view';
  } else if (/新增|編輯/.test(typeName)) {
    result = 'edit';
  } else if (typeName === '刪除') {
    result = 'delete';
  } else if (typeName === '複製') {
    result = 'copy';
  } else if (/啟用|停用/.test(typeName)) {
    result = 'active';
  } else if (typeName === '下載') {
    result = 'download';
  } else {
    result = '';
  }
  return result;
};

/** 取得擁有的全部 auth type */
const getHeaderAllAuthTypes = (_childItems) => {
  const allTypes = [];
  _childItems?.forEach((_childItem) => {
    _childItem?.child?.forEach((_authType) => {
      if (allTypes.includes(_authType.permissionName)) return;
      allTypes.push(_authType.permissionName);
    });
  });
  return allTypes;
};

class AuthItemsClass {
  constructor({ permissionId, permissionCode, permissionName, child }) {
    this.id = permissionId ?? '';
    this.value = permissionCode ?? '';
    this.label = permissionName ?? '';
    this.child =
      child?.map((_child_1) => {
        return {
          id: _child_1?.permissionId ?? '',
          value: _child_1?.permissionCode ?? '',
          label: _child_1?.permissionName ?? '',
          child: _child_1?.child?.map((_child_2) => {
            return {
              id: _child_2?.permissionId ?? '',
              value: _child_2?.permissionCode ?? '',
              label: _child_2?.permissionName ?? '',
              authType: switchType(_child_2.permissionName)
            };
          })
        };
      }) ?? [];
    this.allAuthTypes = getHeaderAllAuthTypes(child);
  }
}

export default AuthItemsClass;
