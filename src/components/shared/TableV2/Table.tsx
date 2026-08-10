'use client';
import React, { useEffect, useState } from 'react';

import {
  Checkbox,
  CircularProgress,
  Paper,
  useTheme,
  TableSortLabel,
} from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import parse from 'html-react-parser';

import { formatDate, formatDateTime, toDateString } from '@/helpers/date';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Pagination from '@/components/shared/Pagination';
import TextStyle from '@/components/shared/TextStyle';

import IconTooltip from '../IconTooltip';
import { PREVIEW_FORMAT } from '../SmiTable/ViewAllDocument/constants';

import type { TableProps } from './Table.types';


const Table = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  withConditional = false,
  ...tableProps
}: TableProps) => {
  const theme = useTheme();
  const [_pageSize, setPageSize] = useState(pageSize);

  const handleDragStart = (event, rowIndex) => {
    event.dataTransfer.setData('text/plain', rowIndex);
    event.target.style.opacity = 0.5;
  };

  const handleDrop = (event, targetIndex) => {
    event.preventDefault();
    const draggedIndex = parseInt(event.dataTransfer.getData('text/plain'));

    if (draggedIndex !== targetIndex) {
      const newData = [...tableData];

      const element = newData[draggedIndex];
      newData.splice(draggedIndex, 1);
      newData.splice(targetIndex, 0, element);
      if (tableProps.onDragAndDrop) {
        tableProps.onDragAndDrop({
          currentIndex: targetIndex,
          currentItem: element,
          newTableData: newData,
          nextItem: targetIndex === newData.length - 1 ? null : newData[targetIndex + 1],
          previousItem: targetIndex > 0 ? newData[targetIndex - 1] : null,
        });
      }

      // if (tableProps.setTableData) {
      //   tableProps.setTableData(newData);
      // }

    }
    event.target.style.opacity = 1;
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

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
      backgroundColor: theme.palette.white.main,
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

        const headerContent = (
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.primary.main}
          >
            {header.label}
          </TextStyle>
        );

        return (
          <MuiTableCell
            key={`${header.label}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}}
          >
            {header.isSortable ? (
              <TableSortLabel
                active={!!header.sortDirection}
                direction={header.sortDirection || 'asc'}
                onClick={header.onSort}
              >
                {headerContent}
              </TableSortLabel>
            ) : (
              headerContent
            )}
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
            {data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY, HH:mm:ss') : '-'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    if (header.type === 'date-only') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {data?.[header.key] ? formatDate(data?.[header.key], 'DD MMM YYYY') : '-'}
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

    // Type: boolean
    if (header.type === 'boolean') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4" weight={400}>
            {data?.[header.key] === null ? ' ' : data?.[header.key] ? 'Covenant' : 'Non Covenant'}
          </TextStyle>
        </MuiTableCell>
      );
    }

    // Type: action
    if (header.type === 'action') {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      const headerSxFromProps = typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {};

      const headerSx = {
        minWidth: '8vw',
        ...headerSxFromProps,
      };

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={headerSx}
        >
          {options.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;

            //TODO: hapus di proyek baru
            let isLoading = false;

            if (option.iconName.includes('download')) {
              if (data.isSuccessUpload === false) {
                isLoading = true;
              }
            }

            if (option.isLoading) {
              isLoading = typeof (option.isLoading) === 'function'
                ? option.isLoading(data)
                : option.isLoading;
            }

            const isHidden = typeof (option.isHidden) === 'function'
              ? option.isHidden(data)
              : option.isHidden;

            if (isHidden) {
              return null;
            };

            let fileType = undefined;

            switch (true) {
              case !!data.fileType:
                fileType = data.fileType;
                break;
              case !!data.documentExtension:
                fileType = data.documentExtension;
                break;
              case !!data.fileExtension:
                fileType = data.fileExtension;
                break;
              case !!data.npwpFile:
                fileType = data.npwpFile.split('/').pop()?.split('.').pop();
                break;
              case !!data.ktpFile:
                fileType = data.ktpFile.split('/').pop()?.split('.').pop();
                break;
              default:
                fileType = undefined;
            }

            if (option.iconName.includes('preview')) {
              if (fileType && !PREVIEW_FORMAT.includes(fileType?.toLowerCase())) {
                return null;
              } else if (data.listDocuments?.length > 0) {
                if (data.listDocuments.length === 1) {
                  for (let i = 0; i < data.listDocuments.length; i++) {
                    if (!PREVIEW_FORMAT.includes(data.listDocuments[i].documentExtension?.toLowerCase())) {
                      return null;
                    }
                  }
                } else {
                  return null;
                }
              }
            }

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

  const renderTableBody = () => (
    <MuiTableBody
      sx={{
        '& .MuiTableCell-body': {
          padding: theme.spacing(1),
        },
      }}
    >
      {(!isLoading && tableData?.length) === 0 && (
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
      {tableData?.map((data, index) => (
        <>
          <MuiTableRow
            key={data?.id ?? index}
            sx={anomalyRow(data)}
            draggable={tableProps.onDragAndDrop !== undefined}
            onDragStart={(e) => handleDragStart(e, index)}
            onDrop={(e) => handleDrop(e, index)}
            onDragOver={handleDragOver}
          >
            {tableHeader?.map((header) =>
              renderTableCell(data, index, header),
            )}
          </MuiTableRow>
          {tableProps.renderInBetweenRow ? tableProps?.renderInBetweenRow(data) : null}
        </>
      ))}
      {tableProps.renderAdditonalRow && (
        <MuiTableRow
          key={tableData.length + 1}
          sx={{
            '.MuiTableCell-root': {
              borderBottom: 'none',
            },
          }}
        >
          {tableProps.renderAdditonalRow()}
        </MuiTableRow>
      )}
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

  // Propagate on PageSizeChange
  useEffect(() => {
    if (tableProps.onPageSizeChange) {
      tableProps.onPageSizeChange(_pageSize);
    }

    // Reset page to 1
    if (tableProps.handlePageChange && !withConditional) {
      tableProps.handlePageChange(1);
    }
  }, [tableProps.onPageSizeChange, _pageSize]);

  useEffect(() => {
    if (tableData?.length === 0 && tableProps.handlePageChange && !withConditional) {
      tableProps?.handlePageChange(1);
    }
  }, [tableData]);

  return (
    <Paper sx={{ ...styPaper, display: 'flex', flexDirection: 'column' }}>
      <MuiTableContainer sx={styTableContainer}>
        <MuiTable stickyHeader>
          <MuiTableHead sx={styTableHead}>
            <MuiTableRow>
              {renderTableHeader()}
            </MuiTableRow>
          </MuiTableHead>
          {isLoading ? renderLoading() : renderTableBody()}
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
      {!isLoading && tableProps.footer}
      {(!isLoading && tableProps.renderFooter) && tableProps.renderFooter()}
    </Paper>
  );
};

export default Table;
