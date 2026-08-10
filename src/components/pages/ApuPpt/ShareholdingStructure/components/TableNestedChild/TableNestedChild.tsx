'use client';
import { useEffect, useState } from 'react';

import {
  Checkbox,
  CircularProgress,
  Paper,
  TableCell,
  useTheme,
} from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import parse from 'html-react-parser';

import { toDateString } from '@/helpers/date';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconTooltip from '@/components/shared/IconTooltip';
import Pagination from '@/components/shared/Pagination';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';


import TableFooterNested from '../TableFooterNested/TableFooterNested';

import type { TableNestedChildProps } from './TableNestedChild.types';


const TableNestedChild = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  addNewLevel,
  addNewRow,
  deleteLevel,
  lastLevel,
  ...tableProps
}: TableNestedChildProps) => {
  const theme = useTheme();
  const [_pageSize, setPageSize] = useState(pageSize);
  const { viewOnly } = useViewOnly();

  const listNumber = (index: number) => {
    let number = index;

    if (Number.isInteger(tableProps.currentPage)) {
      const currentPage = tableProps.currentPage || 0;
      number = _pageSize * (currentPage - 1) + index;
    }

    return number + 1;
  };

  const styPaper = {
    ...(tableProps.isPaper
      ? {
        borderRadius: theme.radius(2),
        boxShadow: 2,
      }
      : {
        borderRadius: 0,
        boxShadow: 0,
      }),
    overflow: 'hidden',
    width: '100%',
  };

  const styTableContainer = {
    pb: 1,
    ...(tableProps.isPaper && {
      pb: 2,
      px: 2,
    }),
    ...(tableProps.maxHeight && { maxHeight: tableProps.maxHeight }),
    ...(tableProps.maxWidth && { maxWidth: tableProps.maxWidth }),
    ...(tableProps.minHeight && { minHeight: tableProps.minHeight }),
    ...(tableProps.minWidth && { minWidth: tableProps.minWidth }),
    '::-webkit-scrollbar-thumb:horizontal': {
      display: 'none',
    },
    '::-webkit-scrollbar:horizontal': {
      display: 'none',
      height: 0,
      width: 0,
    },
  };

  const styTableHead = {
    '.MuiTableCell-head': {
      pb: theme.spacing(1),
      pt: theme.spacing(3),
      px: theme.spacing(1),
    },
  };

  const renderTableHeader = () => (
    <>
      {tableHeader?.map((header, idx) => {
        if (header.type === 'checkbox' && header.label === null) {

          return <MuiTableCell key="checkbox" sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}} />;
        }

        return (
          <MuiTableCell key={`${header.label}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.primary.main}
            >
              {header.label}
            </TextStyle>
          </MuiTableCell>
        );
      })}
    </>
  );

  const renderTableCell = (data, index, header) => {
    // Handle checkbox
    if (header.type === 'checkbox') {
      return (
        <MuiTableCell
          key={`checkbox${index}`}
          padding="checkbox"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <Checkbox
            color="primary"
            disabled={header.isDisabled(data)}
            checked={header.isSelected(data)}
            onChange={() => header.onSelectChange(data)}
            inputProps={{ 'aria-label': 'controlled' }}
            sx={{
              '& .MuiSvgIcon-root': { fontSize: 'clamp(22px, 1.6vw, 36px)' },
            }}
          />
        </MuiTableCell>
      );
    }

    // Prioritize custom render
    if (header.render) {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          {header.render(data, index)}
        </MuiTableCell>
      );
    }

    if (header.type === 'status') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <Button
            variant="outlined"
            sx={{ borderRadius: 2, px: 1, py: 0.5 }}
            textVariant="body4"
            color={data?.[header.key]?.match(/REJECT|CANCELED/i) ? 'error' : 'primary'}
            noClick
          >
            {data?.[header.key] ?? '-'}
          </Button>
        </MuiTableCell>
      );
    }

    if (header.type === 'date') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {data?.[header.key] ? toDateString(data?.[header.key]) : '-'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    // Type: index
    if (header.type === 'index') {
      return (
        <MuiTableCell
          key={`index${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">{listNumber(index)}</TextStyle>
        </MuiTableCell>
      );
    }

    // Type: action
    if (header.type === 'action') {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          {options.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;

            const isLoading = typeof (option.isLoading) === 'function'
              ? option.isLoading(data)
              : option.isLoading;

            return (
              <Button
                disabled={isDisabled}
                variant="text"
                key={`action${option.iconName}`}
                sx={{
                  minWidth: 0,
                  padding: theme.spacing(1),
                }}
                onClick={() => option.onClick(data, index)}
                isLoading={isLoading}
              >
                <IconTooltip
                  iconName={option.iconName}
                  sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                />
              </Button>
            );
          })}
        </MuiTableCell>
      );
    }

    // text html
    if (header.type === 'textHtml') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {parse(data?.[header.key])} {/* use html-react-parser */}
          </TextStyle>
        </MuiTableCell>
      );
    }

    return (
      <MuiTableCell
        key={`${header.label}${data[header.key]}${index}`}
        sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
      >
        <TextStyle variant="body4">{data?.[header.key]}</TextStyle>
      </MuiTableCell>
    );
  };

  const renderTableBody = (list) => (
    <MuiTableBody
      sx={{
        '& .MuiTableCell-body': {
          padding: theme.spacing(1),
        },
      }}
    >
      {(!isLoading && tableData?.length === 0) && (
        <MuiTableRow>
          <MuiTableCell
            align="center"
            colSpan={tableHeader?.length}
            sx={{
              borderBottom: 'none',
              height: '15vw',
            }}
          >
            <EmptyPlaceholder status="data" />
          </MuiTableCell>
        </MuiTableRow>
      )}
      <>
        {list?.map((item, index) => (
          <>

            {
              item?.childList.map((chld, idx) => (
                <>
                  <MuiTableRow
                    key={item?.id ?? index}
                    sx={anomalyRow(item)}
                  >
                    {tableHeader?.map((header) =>
                      renderTableCell(chld, index, header),
                    )}
                  </MuiTableRow>
                </>
              ))
            }
            <MuiTableRow
              key={list.length + 1}
            >
              <TableCell colSpan={1} />
              <TableCell colSpan={2}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  Total
                </TextStyle>
              </TableCell>
              <TableCell colSpan={1}>
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  {item?.totalShares}
                </TextStyle>
              </TableCell>
              <TableCell colSpan={3} >
                <TextStyle
                  variant="body4"
                  weight={600}
                  color={theme.palette.primary.dark}
                >
                  {item?.totalPercentage ?? 0}%
                </TextStyle>
              </TableCell>
            </MuiTableRow>
          </>
        ))}
      </>
    </MuiTableBody>
  );


  const renderLoading = () => (
    <MuiTableBody >
      <MuiTableRow>
        <MuiTableCell
          align="center"
          colSpan={tableHeader?.length}
          sx={{
            borderBottom: 'none',
            height: '15vw',
          }}
        >
          <CircularProgress />
        </MuiTableCell>
      </MuiTableRow>
    </MuiTableBody>
  );


  const renderFooter = (level: number) => (
    <TableFooterNested
      onClickDelete={deleteLevel.bind(null, level)}
      onClickLevel={addNewLevel.bind(null, level)}
      onClickRow={addNewRow.bind(null, level)}
      isShowBtnAddNewLevel={lastLevel === level && level !== 10 }
    />
  );

  // Propagate on PageSizeChange
  useEffect(() => {
    if (tableProps.onPageSizeChange) {
      tableProps.onPageSizeChange(_pageSize);
    }

    // Reset page to 1
    if (tableProps.handlePageChange) {
      tableProps.handlePageChange(1);
    }
  }, [tableProps.onPageSizeChange, _pageSize]);

  useEffect(() => {
    if (tableData?.length === 0 && tableProps.handlePageChange) {
      tableProps?.handlePageChange(1);
    }
  }, [tableData]);

  return (
    <>
      {tableData?.length > 0 && tableData.map((res, idx) => (
        <SectionTitle isOpen title={`Tingkat ${res?.level}`} key={idx} >
          <Paper sx={{ ...styPaper, borderRadius: 3, boxShadow: 7, display: 'flex', flexDirection: 'column', px: 3 }}>
            <MuiTableContainer sx={styTableContainer}>
              <MuiTable stickyHeader>
                <MuiTableHead sx={styTableHead}>
                  <MuiTableRow>
                    {renderTableHeader()}
                  </MuiTableRow>
                </MuiTableHead>
                {isLoading ? renderLoading() : renderTableBody(res?.shareholders)}
              </MuiTable>
            </MuiTableContainer>
            {/* --- Render Pagination --- */}
            {!isLoading && Number.isInteger(tableProps.totalPage) && Number.isInteger(tableProps.currentPage) && (
              <Pagination
                currentPage={tableProps.currentPage}
                totalPage={tableProps.totalPage}
                handlePageChange={tableProps.handlePageChange}
                pageSize={_pageSize}
                setPageSize={setPageSize}
              />
            )}
            {/* --- Render Footer --- */}
            { !viewOnly && renderFooter(res?.level)}
          </Paper>
        </SectionTitle>
      ))}
    </>
  );
};

export default TableNestedChild;
