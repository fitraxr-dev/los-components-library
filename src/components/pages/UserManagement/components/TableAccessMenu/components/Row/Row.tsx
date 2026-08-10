import React, { Fragment } from 'react';

import { TableCell, TableRow, useTheme } from '@mui/material';
import parse from 'html-react-parser';

import { makeUID } from '@/helpers/utils';

import TextStyle from '@/components/shared/TextStyle';

import { status } from '../../TableAccessMenu.constants';
import CustomCheckbox from '../CustomCheckbox';
import PermissionRow from '../PermissionRow';

import type { RowProps } from './Row.types';


const Row = (props: RowProps) => {
  const { tableHeader, compute, items, viewOnly } = props;
  const theme = useTheme();

  function renderTableCell(data, header) {
    if (header.type === 'checkbox') {
      return (
        <TableCell
          key={makeUID()}
          sx={header.sx}
        >
          <CustomCheckbox
            viewOnly={viewOnly}
            type="parent"
            id={data.id}
            checked={data.status === status.checked}
            indeterminate={data.status === status.indeterminate}
            compute={compute}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
            }}
          />
        </TableCell>
      );
    }

    if (header.type === 'label') {
      return (
        <TableCell
          key={makeUID()}
          sx={header.sx}
        >
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.primary.main}
          >
            {parse(data.label)}
          </TextStyle>
        </TableCell>
      );
    }

    return (
      <TableCell
        key={makeUID()}
        sx={header.sx}
      />
    );
  };

  return (
    <Fragment key={makeUID()}>
      {items?.map((data) => {
        if (data.subMenu) {
          return (
            <Fragment key={data.id}>
              <TableRow>
                {tableHeader.map((header) => renderTableCell(data, header))}
              </TableRow>
              <Row
                key={data.id}
                items={data.subMenu}
                tableHeader={tableHeader}
                compute={compute}
                viewOnly={viewOnly}
              />
            </Fragment>
          );
        } else {
          return <PermissionRow key={data.id} data={data} compute={compute} viewOnly={viewOnly} />;
        }
      })}
    </Fragment>
  );
};

export default Row;
