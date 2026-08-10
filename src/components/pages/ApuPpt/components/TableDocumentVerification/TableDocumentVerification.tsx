'use client';
import { useEffect, useState } from 'react';

import { CircularProgress, Paper, useTheme } from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import parse from 'html-react-parser';


import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconTooltip from '@/components/shared/IconTooltip';
import Pagination from '@/components/shared/Pagination';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


import type { BgColumnProps, TableDocumentVerificationProps } from './TableDocumentVerification.types';


const TableDocumentVerification = ({
  tableHeader = [],
  tableData = [],
  tableHeaderChild = [],
  tableHeaderGrandChild = [],
  listDiff = [],
  isLoading = false,
  pageSize = 10,
  anomalyRow = () => ({ bgcolor: 'none' }),
  ...tableProps
}: TableDocumentVerificationProps) => {
  const theme = useTheme();
  const [_pageSize, setPageSize] = useState(pageSize);

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

  const bgColumn = (param: BgColumnProps) => {
    let color = 'white';
    if (listDiff?.includes(param?.docId)) {
      color = '#FCE6E8';
    } else if (param?.data?.length > 0) {
      const child = param?.data;
      if (child?.every((el) => listDiff?.includes(el?.docId))) {
        color = '#FCE6E8';
      }
    } else if (param?.index % 2 === 0) {
      color = '#F0F3FB';
    }
    return color;
  };

  const renderTableHeader = () => (
    <>
      {tableHeader?.map((header, idx) => {
        if (header.type === 'checkbox' && header.label === null) {

          return <MuiTableCell key="checkbox" sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? {}} />;
        }

        return (
          <MuiTableCell key={`${header.label}`} sx={typeof header.sx === 'function' ? header.sx(tableData[idx]) : header.sx ?? { }}>
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

  const alphabetAll: string[] = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  const countNestedChildren = (list?): number => {
    const amoutLength = list.reduce((count, item) => count + 1 + countNestedChildren(item.childList), 0);
    return amoutLength;
  };

  const renderTableCell = (data, index, header) => {

    // text html
    if (header.type === 'textHtml') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {parse(data?.[header.key])}
          </TextStyle>
        </MuiTableCell>
      );
    }

    if (header.type === 'index') {
      if (data?.childList?.length >= 1) {
        return (
          <MuiTableCell
            key={`index${index}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
            rowSpan={countNestedChildren(data?.childList) + 1}
          >
            <TextStyle variant="body4" align="center">{listNumber(index)}</TextStyle>
          </MuiTableCell>
        );
      } else {

        return (
          <MuiTableCell
            key={`index${index}`}
            sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
          >
            <TextStyle variant="body4">{listNumber(index)}</TextStyle>
          </MuiTableCell>
        );

      }
    }


    if (data?.isGroupedByParent && data?.childList?.length >= 1 && header.key === 'document') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <TextStyle variant="body4">
            {/* {data?.[header.key]} */}
            {parse(data?.[header.key])}
          </TextStyle>
        </MuiTableCell>
      );
    }
    if (header.type === 'isChild' && header.key === 'document') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <RowWrapper>
            <ul>
              <li>
                <TextStyle
                  variant="body4"

                >
                  {parse(data?.[header.key])}

                  {/* {data?.[header.key]} */}
                </TextStyle>
              </li>
            </ul>

          </RowWrapper>
        </MuiTableCell>
      );
    }

    if (header.type === 'isGrandChild' && header.key === 'document') {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <RowWrapper ml={9} gap={1}>
            <TextStyle variant="body4">
              {alphabetAll[index]}.
            </TextStyle>
            <TextStyle
              variant="body4"
              // sx={{
              //   lineHeight: '1.6',
              // }}
            >
              {parse(data?.[header.key])} {/* use html-react-parser */}

              {/* {data?.[header.key]} */}
            </TextStyle>
          </RowWrapper>
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

    // Type: action
    if (header.type === 'action' && data?.isEditable) {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={typeof header.sx === 'function' ? header.sx(tableData[index]) : header.sx ?? {}}
        >
          <RowWrapper gap={2}>
            {options.map((option, i) => {
              const isDisabled = typeof (option.isDisabled) === 'function'
                ? option.isDisabled(data)
                : option.isDisabled;

              const isLoading = typeof (option.isLoading) === 'function'
                ? option.isLoading(data)
                : option.isLoading;

              if (option.iconName === '' && data?.additionalAction === 'SHAREHOLDER_MANAGEMENT') {
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
                    {data?.additionalAction === 'SHAREHOLDER_MANAGEMENT' && <IconTooltip
                      iconName="goto-maintenance-customer"
                      sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                    />}
                  </Button>
                );
              }


              return (
                <RowWrapper key={`${option.iconName}-${index}`} gap={2}>
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
                    {option?.iconName && <IconTooltip
                      iconName={option?.iconName}
                      sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                    />}
                  </Button>
                </RowWrapper>

              );
            })}
          </RowWrapper>
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


  const renderTableBody = () => {
    if ((!isLoading && tableData?.length) === 0) {
      return (
        <MuiTableBody
          sx={{
            '& .MuiTableCell-body': {
              padding: theme.spacing(1),
            },
          }}
        >
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
        </MuiTableBody>
      );
    }
    return (
      <MuiTableBody
        sx={{
          '& .MuiTableCell-body': {
            padding: theme.spacing(1),
          },
        }}
      >
        {tableData?.map((data, index) => (
          <>
            <MuiTableRow
              sx={{
                backgroundColor: bgColumn({
                  data: data?.childList, docId: data?.docId, index,
                }),
              }}
            >
              {tableHeader.map((head) =>
                renderTableCell(data, index, head)
              )}
            </MuiTableRow>
            {data?.childList?.length >= 1 &&
                data?.childList?.map((res, x) => (
                  <>
                    <MuiTableRow
                      key={res?.id}
                      sx={{
                        backgroundColor: bgColumn({
                          docId: res?.docId,
                          index,
                        }),
                      }}
                    >

                      {tableHeaderChild.map((headChild) =>
                        renderTableCell(res, x, headChild)
                      )}
                    </MuiTableRow>
                    {res?.childList?.length >= 1 && res?.childList?.map((gChild, i) => (
                      <MuiTableRow
                        key={gChild?.id}
                        sx={{
                          backgroundColor: bgColumn({ docId: gChild?.docId, index }),
                        }}
                      >
                        {tableHeaderGrandChild.map((grandChild) =>
                          renderTableCell(gChild, i, grandChild)
                        )}
                      </MuiTableRow>
                    ))}
                  </>
                ))
            }
          </>
        ))}
      </MuiTableBody>
    );
  };

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

export default TableDocumentVerification;
