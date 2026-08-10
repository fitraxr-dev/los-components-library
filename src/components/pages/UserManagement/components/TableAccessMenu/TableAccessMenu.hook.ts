import { status } from './TableAccessMenu.constants';

import type { AccessMenu, TableAccessMenuProps } from './TableAccessMenu.types';


const useTableAccessMenu = (props: TableAccessMenuProps) => {
  const { tableData, onSelectRow = (data, tableStatus) => { } } = props;


  const toggleAllStatus = (newStatus: number) => {
    const copiedData = tableData.slice();

    copiedData.forEach((root) => {
      setStatus(root, newStatus);
    });

    onSelectRow(copiedData, newStatus);
  };


  const getTableStatus = (items: AccessMenu[]) => {
    const allChecked = items.every((item) => item.status === status.checked);
    const someChecked = items.some((item) => item.status === status.checked);
    const someIndeterminate = items.some((item) => item.status === status.indeterminate);

    if (allChecked) {
      return status.checked;
    } else if (someChecked || someIndeterminate) {
      return status.indeterminate;
    } else {
      return status.unchecked;
    }
  };

  const setStatus = (root: AccessMenu, newStatus: number) => {
    root.status = newStatus;
    if (Array.isArray(root.subMenu)) {
      root.subMenu.forEach((item) => {
        setStatus(item, newStatus);
      });
    }
    if (root.hasOwnProperty('permissions') && Array.isArray(root.permissions)) {
      root.permissions.forEach((item) => {
        item.status = newStatus;
      });
    }
  };

  const computeStatus = (items: AccessMenu[], hasPermissions: boolean) => {
    let checkedCount = 0;
    let indeterminateCount = 0;

    items.forEach((item) => {
      if (item.status === status.checked) checkedCount++;
      if (item.status === status.indeterminate) indeterminateCount++;
    });

    if (checkedCount === items.length) {
      return status.checked;
    } else if (checkedCount > 0 || indeterminateCount > 0) {
      return status.indeterminate;
    } else {
      return status.unchecked;
    }
  };

  // Deep-first traversal
  const traverse = (root: AccessMenu | AccessMenu[], checkboxId: string, newStatus: number) => {
    if (Array.isArray(root)) {
      root.forEach((item) => {
        traverse(item, checkboxId, newStatus);
      });
      return;
    }

    let id = root.id;

    if (id === checkboxId) {
      setStatus(root, newStatus);
      return;
    }

    if (root.hasOwnProperty('permissions') && Array.isArray(root.permissions)) {
      const permissionToUpdate = root.permissions.find((p) => p.id === checkboxId);
      if (permissionToUpdate) {
        setStatus(permissionToUpdate, newStatus);
      }
      root.status = computeStatus(
        (root.permissions || []).concat(root.subMenu || []),
        root.hasOwnProperty('permissions')
      );
    }

    if (Array.isArray(root.subMenu)) {
      root.subMenu.forEach((item) => {
        traverse(item, checkboxId, newStatus);
      });
      root.status = computeStatus(
        (root.subMenu || []).concat(root.permissions || []),
        root.hasOwnProperty('permissions')
      );
    }
  };


  const compute = (checkboxId?: string, newStatus?: number) => {
    const copiedData = tableData.slice();

    if (!checkboxId) {
      toggleAllStatus(newStatus);
      onSelectRow(copiedData, newStatus);
      return;
    }

    traverse(copiedData, checkboxId, newStatus);
    onSelectRow(copiedData, getTableStatus(copiedData));
  };


  return {
    compute,
  };
};

export default useTableAccessMenu;
