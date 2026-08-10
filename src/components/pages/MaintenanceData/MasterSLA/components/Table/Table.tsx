'use client';
import React, { useEffect, useState } from 'react';

import { Checkbox, CircularProgress, Paper, useTheme } from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';

import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconTooltip from '@/components/shared/IconTooltip';
import Pagination from '@/components/shared/Pagination';
import TextStyle from '@/components/shared/TextStyle';

import type { TableProps } from '@/components/shared/Table/Table.types';


const Table = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 5,
  anomalyRow = () => ({ bgcolor: 'none' }),
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
      {tableHeader?.map((header) => {
        // if (header.type === 'checkbox') {
        //   return <MuiTableCell key="checkbox" sx={header.sx ?? {}} />;
        // }

        return (
          <MuiTableCell key={`${header.label}`} sx={header.sx ?? {}}>
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


  const renderTableCell = (data, index, header, rowSpan = 1) => {
    // Handle checkbox
    if (header.type === 'checkbox') {
      return (
        <MuiTableCell
          rowSpan={rowSpan}
          key={`checkbox${index}`}
          padding="checkbox"
          sx={header.sx ?? {}}
        >
          <Checkbox
            color="primary"
            disabled={header.isDisabled(data)}
            checked={header.isSelected(data)}
            onChange={() => header.onSelectChange(data)}
            inputProps={{ 'aria-label': 'controlled' }}
            size="small"
          />
        </MuiTableCell>
      );
    }

    // Prioritize custom render
    if (header.render) {
      return (
        <MuiTableCell
          rowSpan={rowSpan}
          key={`${header.label}${data[header.key]}${index}`}
          sx={header.sx ?? {}}
        >
          {header.render(data, index)}
        </MuiTableCell>
      );
    }

    // Type: index
    if (header.type === 'index') {
      return (
        <MuiTableCell
          rowSpan={rowSpan}
          key={`index${index}`}
          sx={header.sx ?? {}}
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
          rowSpan={rowSpan}
          key={`action${index}`}
          padding="none"
          sx={header.sx ?? {}}
        >
          {options.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;

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

    return (
      <MuiTableCell
        rowSpan={rowSpan}
        key={(header.key === 'confirm') ? `checkbox${index}` : `${header.label}${data[header.key]}${index}`}
        sx={header.sx ?? {}}
      >
        {(header.key === 'confirm') ?
          <Checkbox
            color="primary"
            disabled={header.isDisabled(data)}
            checked={header.isSelected(data)}
            onChange={() => header.onSelectChange(data)}
            inputProps={{ 'aria-label': 'controlled' }}
            size="small"
            sx={{ ml: 1 }}
          /> :
          <TextStyle variant="body4">{data?.[header.key]}</TextStyle>
        }

      </MuiTableCell>
    );
  };

  const renderTableCellMultiple = (data, index, header, multiRowHeader) => {
    return data.row.map((obj) => {
      console.log(obj, index);
      return (
        <MuiTableRow
          key={obj?.id ?? index}
          sx={anomalyRow(obj)}
          draggable={true}
          onDragStart={(e) => handleDragStart(e, index)}
          onDrop={(e) => handleDrop(e, index)}
          onDragOver={handleDragOver}
        >
          {tableHeader?.map((header) => {
            console.log('header', header.key, multiRowHeader.get(header.key));
            if (multiRowHeader.get(header.key) === 0) {
              multiRowHeader.set(header.key, 1);
              return renderTableCell(obj, index, header, data.row.length);
            } else if (multiRowHeader.get(header.key) === undefined) {
              return renderTableCell(obj, index, header);
            }
          }
          )}
        </MuiTableRow>
      );
    });
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
      {tableData?.map((data, index) => {
        if (!!data.multiRow) {
          const multiRowHeader = new Map();
          data.multiRow.header.map((str) => { multiRowHeader.set(str, 0);});
          return (
            <>
              {renderTableCellMultiple(data.multiRow, index, '', multiRowHeader)}
              { tableProps.renderInBetweenRow ? tableProps?.renderInBetweenRow(data) : null }
            </>
          );

        } else {
          return (
            <>
              <MuiTableRow
                key={data?.id ?? index}
                sx={anomalyRow(data)}
                draggable={true}
                onDragStart={(e) => handleDragStart(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragOver={handleDragOver}
              >
                {tableHeader?.map((header) =>
                  renderTableCell(data, index, header),
                )}
              </MuiTableRow>
              { tableProps.renderInBetweenRow ? tableProps?.renderInBetweenRow(data) : null }
            </>
          );
        }
      }
      )}
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
    <Paper sx={styPaper}>
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
