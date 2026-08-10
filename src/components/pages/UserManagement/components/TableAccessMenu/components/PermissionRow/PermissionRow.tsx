import React from 'react';

import { TableCell, TableRow, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import TextStyle from '@/components/shared/TextStyle';

import { status } from '../../TableAccessMenu.constants';
import CustomCheckbox from '../CustomCheckbox';

import usePermissionRow from './PermissionRow.hook';

import type { PermissionRowProps } from './PermissionRow.types';


const PermissionRow = (props: PermissionRowProps) => {
  const { data, compute, viewOnly } = props;
  const theme = useTheme();

  const { getPermissionChecked, getCheckboxPermission } = usePermissionRow(props);
  const isChecked = data.status === status.checked;

  const permissionCellsDict = ['view', 'create', 'update', 'delete', 'download', 'menu'];

  const renderPermissionCells = () => {
    if (data.permissions === undefined || (data.permissions && data.permissions.length === 0)) {
      return [];
    }

    // initial cell content is empty
    let cell = Array(permissionCellsDict.length).fill(
      <TableCell />
    );

    for (const permission of data.permissions) {
      const splittedPermissionId = permission.id.split('-');
      const permissionKey = splittedPermissionId[splittedPermissionId.length - 1];

      if (permissionCellsDict.includes(permissionKey)) {
        cell[permissionCellsDict.indexOf(permissionKey)] = (
          <TableCell key={permission.id}>
            <CustomCheckbox
              viewOnly={viewOnly}
              id={permission.id}
              checked={getPermissionChecked(permission)}
              disabled={getCheckboxPermission(permission.id) === 'view' ? true : !isChecked}
              compute={compute}
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
              }}
            />
          </TableCell>
        );
      }
    }

    return cell;
  };

  return (
    <TableRow key={data.id}>
      <TableCell>
        <CustomCheckbox
          viewOnly={viewOnly}
          id={data.id}
          checked={isChecked}
          indeterminate={false}
          compute={compute}
          sx={{
            '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
          }}
        />
      </TableCell>
      <TableCell>
        <TextStyle variant="body4">{parse(data.label)}</TextStyle>
      </TableCell>
      {renderPermissionCells()}
      <TableCell />
    </TableRow>
  );
};

export default PermissionRow;
