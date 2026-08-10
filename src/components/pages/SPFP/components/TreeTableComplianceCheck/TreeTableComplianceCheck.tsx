'use client';
import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { Box, Paper, useTheme } from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import { usePathname } from 'next/navigation';


import { spfp } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconButton from '@/components/shared/IconButton';
import IconTooltip from '@/components/shared/IconTooltip';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';
import ModalAddDraftOL from '../ModalAddDraftOL/ModalAddDraftOL';

// import { useTreeTableDraftOL } from './TreeTableDraftOL.hook';

import { useTreeTableCompliance } from './TreeTableComplianceCheck.hook';

import type { TableProps } from '../TreeTableDraftOL/TreeTableDraftOL.types';


const TreeTableComplianceCheck = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 5,
  anomalyRow = () => ({ bgcolor: 'none' }),
  ...tableProps
}: TableProps) => {
  const theme = useTheme();
  const router = useCustomRouter();
  const path = usePathname();
  const pathname = path.split('/');

  const {
    handleDeleteComplianceCheck,
  } = useTreeTableCompliance();

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

  const renderTableHeader = () => (
    <>
      {tableHeader?.map((header) => {
        if (header.headerRender) {
          return (
            <MuiTableCell
              key={`${header.label}`}
            // sx={header.sx ?? {}}
            >
              {header.headerRender()}
            </MuiTableCell>
          );
        }
        return (
          <MuiTableCell key={`${header.label}`} sx={header.headerSx ?? {}}>
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
    // Prioritize custom render
    if (header.render) {
      return (
        <MuiTableCell
          key={`${header.label}${data[header.key]}${index}`}
          sx={header.sx ?? {}}
        >
          {header.render(data, index)}
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
  };

  // Propagate on PageSizeChange
  // useEffect(() => {
  //   if (tableProps.onPageSizeChange) {
  //     tableProps.onPageSizeChange(_pageSize);
  //   }

  //   // Reset page to 1
  //   if (tableProps.handlePageChange) {
  //     tableProps.handlePageChange(1);
  //   }
  // }, [tableProps.onPageSizeChange, _pageSize]);

  return (
    <Paper sx={styPaper}>
      <MuiTableContainer sx={styTableContainer}>
        <MuiTable stickyHeader>
          <MuiTableHead sx={styTableHead}>
            <MuiTableRow>{renderTableHeader()}</MuiTableRow>
          </MuiTableHead>
          {/* {isLoading ? renderLoading() : renderTableBody()} */}
          <MuiTableBody
            sx={{
              '& .MuiTableCell-body': {
                fontSize: '0.8333333333vw',
                fontWeight: '400',
                padding: theme.spacing(2),
              },
            }}
          >
            {tableData?.map((rows, index) => (
              <>
                <MuiTableRow>
                  <MuiTableCell align="left">
                    <b>{index + 1}</b>
                  </MuiTableCell>
                  <MuiTableCell align="left" colSpan={2}>
                    <b>{rows.complianceTitle}</b>
                  </MuiTableCell>
                  <MuiTableCell>
                    <RowWrapper>
                      {!tableProps.hidden ?
                        <>
                          {/* ????????? */}
                          <Button
                            variant="outlined"
                            startIcon="add-2"
                            startIconSx={{ fontSize: theme.spacing(3) }}
                            sx={{
                              height: theme.spacing(6),
                              padding: theme.spacing(1),
                            }}
                            onClick={() => {
                              router.push(
                                `${replacePath(
                                  spfp.NOTE_COMPLIANCE_CHECK_PAGE,
                                  {
                                    complianceNumber: rows.complianceNumber,
                                    module: pathname[3],
                                    processId: rows.bucketProcessId,
                                  },
                                )}/?mode=create`,
                              );
                            }}
                          >
                            Add New
                          </Button>
                          {!rows?.complianceChild?.some((obj) => {
                            return obj.open === false;
                          }) && !(rows?.cycles > 1) &&
                            <IconButton iconName="delete" onClick={() => handleDeleteComplianceCheck(rows)} />
                          }
                        </>
                        : null
                      }
                    </RowWrapper>
                  </MuiTableCell>
                </MuiTableRow>
                {rows?.complianceChild?.map((row) => (
                  <>
                    <MuiTableRow>
                      <MuiTableCell align="left"></MuiTableCell>
                      <MuiTableCell align="left" sx={{ maxWidth: '300px', wordBreak: 'break-word' }}>
                        <ColumnWrapper sx={{ alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                          <RowWrapper sx={{ alignItems: 'flex-start', flexBasis: 0, gap: 1, width: '100%' }}>
                            <FiberManualRecordIcon sx={{ color: '#284A63', flexShrink: 0, fontSize: '0.6rem', mt: 0.5 }} />
                            <TextStyle variant="body4" sx={{ wordBreak: 'break-word' }}>
                              {row.complianceTitle}
                            </TextStyle>
                          </RowWrapper>
                        </ColumnWrapper>
                      </MuiTableCell>
                      <MuiTableCell align="left" colSpan={tableHeader?.length - 3}>
                        <Button variant="outlined" sx={{ px: 1, py: 0.5 }} textVariant="body5">
                          {row.open ? 'Open' : 'Closed'}
                        </Button>
                      </MuiTableCell>

                      {tableHeader?.map((header) =>
                        renderTableCell(row, index, header),
                      )}
                    </MuiTableRow>
                  </>
                ))}
              </>
            ))}
          </MuiTableBody>
        </MuiTable>

        <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
          {/* --- Render Footer --- */}
          {!isLoading && tableProps.footer}
          {(!isLoading && tableProps.renderFooter) && tableProps.renderFooter()}
        </RowWrapper>
        <ModalDef
          id={modal.MODAL_ADD_DRAFT_OL}
          component={ModalAddDraftOL}
        />
      </MuiTableContainer>
    </Paper>
  );
};

export default TreeTableComplianceCheck;
