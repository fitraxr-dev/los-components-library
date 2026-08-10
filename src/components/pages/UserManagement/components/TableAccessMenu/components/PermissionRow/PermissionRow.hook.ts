import { status } from '../../TableAccessMenu.constants';

import type { PermissionRowProps } from './PermissionRow.types';


const usePermissionRow = (props: PermissionRowProps) => {
  const { data } = props;

  const getCheckboxPermission = (id: string) => {
    const splittedStr = id.split('-');
    return splittedStr[splittedStr.length - 1];
  };

  const getPermissionChecked = (permission: {
    id: string;
    label: string;
    status: number;
  }) => {
    let checked = false;

    if (data.status === status.checked) {
      if (getCheckboxPermission(permission.id) === 'view') {
        checked = true;
      } else {
        checked = permission.status === status.checked;
      }
    } else {
      checked = permission.status === status.checked;
    }

    return checked;
  };

  return {
    getCheckboxPermission,
    getPermissionChecked,
  };
};

export default usePermissionRow;
