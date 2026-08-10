import React from 'react';

import {
  Checkbox,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
} from '@mui/material';

import { makeUID } from '@/helpers/utils';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import TextStyle from '@/components/shared/TextStyle';

import Row from './components/Row';
import { status } from './TableAccessMenu.constants';
import useTableAccessMenu from './TableAccessMenu.hook';

import type { TableAccessMenuProps } from './TableAccessMenu.types';


const TableAccessMenu = (props: TableAccessMenuProps) => {
  const {
    tableHeader,
    tableData = [],
    tableLabel,
    tableIndex,
    tableId,
    tableStatus,
    viewOnly,
    isLoading,
  } = props;
  const theme = useTheme();

  const sxTableHead = {
    '.MuiTableCell-head': {
      background: theme.palette.custom.blueGray,
      px: theme.spacing(1),
      py: theme.spacing(1),
    },
  };

  const { compute } = useTableAccessMenu(props);

  const renderTableHeader = () => {
    return (
      <>
        {tableHeader.map((header, idx) => {
          const label = typeof header.label === 'function' ? header.label(tableLabel) : header.label;
          if (header.type === 'checkbox') {

            return (
              <TableCell key={idx} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
                <Checkbox
                  disabled={viewOnly}
                  id={tableId}
                  checked={tableStatus === status.checked}
                  indeterminate={tableStatus === status.indeterminate}
                  onChange={(e) => {
                    const isChecked = e.target.checked;
                    compute(undefined, isChecked ? status.checked : status.unchecked);
                  }}
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
                  }}
                />
              </TableCell>
            );
          }

          if (header.type === 'action') {
            return (
              <TableCell key={header?.key} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
                {header.options?.map((option) => {
                  const isDisabled = option.isDisabled;
                  const isLoading = option.isLoading;

                  return (
                    <Button
                      disabled={isDisabled}
                      isLoading={isLoading}
                      variant="text"
                      key={`action-${option.iconName}`}
                      sx={{
                        minWidth: 0,
                        padding: theme.spacing(1),
                      }}
                      onClick={() => option.onClick({ tableId, tableIndex, tableLabel })}
                    >
                      <Icon
                        iconName={option.iconName}
                        sx={{
                          ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })),
                        }}
                      />
                    </Button>
                  );
                })}
              </TableCell>
            );
          }

          return (
            <TableCell key={`${header.label}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.primary.main}
              >
                {label}
              </TextStyle>
            </TableCell>
          );
        })}
      </>
    );
  };

  const renderTableBody = () => {
    return (
      <>
        <TableBody
          sx={{
            '& .MuiTableCell-body': {
              px: theme.spacing(1),
            },
          }}
        >
          {tableData.length === 0 && (
            <TableRow>
              <TableCell
                align="center"
                colSpan={tableHeader?.length}
                sx={{
                  borderBottom: 'none',
                  height: '15vw',
                }}
              >
                <EmptyPlaceholder status="data" />
              </TableCell>
            </TableRow>
          )}
          <Row tableHeader={tableHeader} compute={compute} items={tableData} viewOnly={viewOnly} />
        </TableBody>
      </>
    );
  };

  const renderTableLoading = () => (
    <TableBody >
      <TableRow>
        <TableCell
          align="center"
          colSpan={tableHeader?.length}
          sx={{
            borderBottom: 'none',
            height: '15vh',
          }}
        >
          <CircularProgress />
        </TableCell>
      </TableRow>
    </TableBody>
  );

  return (
    <TableContainer>
      <Table stickyHeader>
        <TableHead sx={sxTableHead}>
          {renderTableHeader()}
        </TableHead>
        {isLoading ? renderTableLoading() : renderTableBody()}
      </Table>
    </TableContainer>
  );
};

export default TableAccessMenu;
