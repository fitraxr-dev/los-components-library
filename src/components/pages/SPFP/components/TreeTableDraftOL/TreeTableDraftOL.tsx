/* eslint-disable max-len */
'use client';

import { useState } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import {
  Box,
  Checkbox,
  CircularProgress,
  Paper,
  useTheme,
} from '@mui/material';
import MuiTable from '@mui/material/Table';
import MuiTableBody from '@mui/material/TableBody';
import MuiTableCell from '@mui/material/TableCell';
import MuiTableContainer from '@mui/material/TableContainer';
import MuiTableHead from '@mui/material/TableHead';
import MuiTableRow from '@mui/material/TableRow';
import dayjs from 'dayjs';

import { TypeProcess } from '@/enums/Module';
import useApp from '@/hooks/useApp';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import IconTooltip from '@/components/shared/IconTooltip';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';


import { getUserRole, type UserRole } from '../../UploadOfferingLetterPage/helpers/offeringLetterHelpers';
import {
  shouldShowAddNewButtonByRoleStatus,
  shouldShowFinalOLAddNewButton,
} from '../../UploadOfferingLetterPage/helpers/roleStatusStepperHelper';
import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';
import ModalAddDraftOL from '../ModalAddDraftOL/ModalAddDraftOL';
import ModalAddOL from '../ModalAddOL/ModalAddOL';
import ModalDetailOL from '../ModalDetailOL/ModalDetailOL';
import ModalFinalDraftOL from '../ModalFinalDraftOL/ModalFinalDraftOL';

import { useTreeTableDraftOL } from './TreeTableDraftOL.hook';

import type { TableProps } from './TreeTableDraftOL.types';


const bpIconSx = () => ({
  '.Mui-focusVisible &': {
    outline: '2px auto rgba(19,124,189,.6)',
    outlineOffset: 2,
  },
  backgroundColor: '#f5f8fa',
  backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
  borderRadius: 1,
  boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
  height: '1rem',
  'input:disabled ~ &': {
    background: 'rgba(206,217,224,.5)',
    boxShadow: 'none',
  },
  'input:hover ~ &': {
    backgroundColor: '#ebf1f5',
  },
  width: '1rem',
});

const CheckboxIcon = () => {
  return <Box component="span" sx={bpIconSx} />;
};

const CheckboxCheckedIcon = () => {
  return (
    <Box
      component="span"
      sx={{
        ...bpIconSx,
        '&::before': {
          backgroundImage:
            'url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 16 16\'%3E%3Cpath' +
            ' fill-rule=\'evenodd\' clip-rule=\'evenodd\' d=\'M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 ' +
            '1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z\' fill=\'%23fff\'/%3E%3C/svg%3E")',
          content: '""',
          display: 'block',
          height: '1rem',
          width: '1rem',
        },
        backgroundColor: 'currentColor',
        backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
        borderRadius: 1,
        'input:hover ~ &': {
          backgroundColor: 'currentColor',
        },
      }}
    />
  );
};

const TableTreeDraftOL = ({
  tableHeader = [],
  tableData = [],
  isLoading = false,
  pageSize = 5,
  anomalyRow = () => ({ bgcolor: 'none' }),
  isDti = false,
  ...tableProps
}: TableProps) => {
  const theme = useTheme();
  const [state] = useApp();
  const bucket = useSpfpBucketContext();
  const [checked, setChecked] = useState(false);

  let draftOLData = [];
  let finalOLData = [];

  // Separate data based on isFinal flag from children
  draftOLData = tableData.map((parent) => ({
    ...parent,
    children: (parent.children || []).filter((child) => !child.isFinal),
  }));

  finalOLData = tableData.map((parent) => ({
    ...parent,
    children: (parent.children || []).filter((child) => child.isFinal),
  }));

  // Try to get division from userDivision first, fallback to user.division array
  // userDivision ada di accessManagementActive.userDivision berdasarkan struktur API
  const userDivision = (state.userData?.user as any)?.accessManagementActive?.userDivision ||
    (state.userData?.user as any)?.userDivision ||
    (state.userData as any)?.userDivision;
  const division = state.userData?.user?.division;
  const divisionForRole = userDivision || division;

  // Get userRoleRefactor from accessManagementActive
  const userRoleRefactor = (state.userData?.user as any)?.accessManagementActive?.userRoleRefactor ||
    (state.userData as any)?.userRoleRefactor;

  const userRole: UserRole | null = getUserRole(
    state.currentRole || [],
    divisionForRole,
    userRoleRefactor,
    userDivision
  );

  const {
    generateAlphabetLetter,
    handleOpenAddModal,
    handleOpenAddFinalModal,
    handleDelete,
  } = useTreeTableDraftOL();

  const parentTableHeader = [
    {
      key: 'action',
      label: 'Action',
      options: (row) => {
        const list = [];

        if (row?.isEditable) {
          list.push({
            iconName: 'edit',
            onClick: (data) => {
              NiceModal.show(modal.MODAL_ADD_OL, {
                bucketProcessId: bucket.bucketProcessId,
                editData: {
                  ...data,
                  id: data.noDraft,
                },
                module: bucket.module,
                process: bucket.process,
              });
            },
          });
        }
        if (row?.isDelete) {
          list.push({
            iconName: 'delete',
            onClick: (data) => handleDelete(data.noDraft),
          });
        }

        return list;
      },
      type: 'action',
    },
  ];

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

  const renderTableCell = (data, index, header, parentData?) => {
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

    // Type: checkbox
    if (header.type === 'checkbox') {
      return (
        <MuiTableCell
          key={`checkbox${index}`}
          padding="checkbox"
          sx={header.sx ?? {}}
        >
          <Checkbox
            color="primary"
            disabled={typeof header.isDisabled === 'function' ? header.isDisabled(data) : header.isDisabled}
            checked={typeof header.isSelected === 'function' ? header.isSelected(data) : (data?.[header.key] || false)}
            onChange={(event) => {
              const checked = event.target.checked;
              setChecked(checked);

              if (header.onSelectChange) {
                header.onSelectChange(data, checked);
              }
            }}
            inputProps={{ 'aria-label': 'controlled' }}
            icon={<CheckboxIcon />}
            checkedIcon={<CheckboxCheckedIcon />}
          />
        </MuiTableCell>
      );
    }

    // Type: action
    if (header.type === 'action') {
      const options = typeof (header.options) === 'function' ? header.options(data) : header.options;

      // Pisahkan action view-only (detail, preview, download) dari action lainnya
      // Action view-only harus selalu muncul, tidak peduli tableProps.hidden
      const viewOnlyActions = options.filter((option) =>
        option.iconName === 'detail' ||
        option.iconName === 'preview-document' ||
        option.iconName === 'download'
      );
      const otherActions = options.filter((option) =>
        option.iconName !== 'detail' &&
        option.iconName !== 'preview-document' &&
        option.iconName !== 'download'
      );

      return (
        <MuiTableCell
          key={`action${index}`}
          padding="none"
          sx={header.sx ?? {}}
        >
          {/* Action view-only selalu muncul, tidak peduli tableProps.hidden */}
          {viewOnlyActions.map((option) => {
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
                onClick={() => option.onClick(data, index, parentData)}
              >
                <IconTooltip
                  iconName={option.iconName}
                  sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                />
              </Button>
            );
          })}
          {/* Action lainnya mengikuti tableProps.hidden */}
          {!tableProps.hidden && otherActions.map((option) => {
            const isDisabled = typeof (option.isDisabled) === 'function'
              ? option.isDisabled(data)
              : option.isDisabled;
            return (
              <>
                {data.status && data.status !== '-' && option.iconName === 'delete' ?
                  null :
                  <Button
                    disabled={isDisabled}
                    variant="text"
                    key={`action${option.iconName}`}
                    sx={{
                      minWidth: 0,
                      padding: theme.spacing(1),
                    }}
                    onClick={() => option.onClick(data, index, parentData)}
                  >
                    <IconTooltip
                      iconName={option.iconName}
                      sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                    />
                  </Button>
                }
              </>
            );
          })}
        </MuiTableCell>
      );
    }
  };


  return (
    <Paper sx={styPaper}>
      <MuiTableContainer sx={styTableContainer}>
        <MuiTable stickyHeader>
          <MuiTableHead sx={styTableHead}>
            <MuiTableRow>{renderTableHeader()}</MuiTableRow>
          </MuiTableHead>
          <MuiTableBody
            sx={{
              '& .MuiTableCell-body': {
                fontSize: '0.8333333333vw',
                fontWeight: '400',
                padding: theme.spacing(2),
              },
            }}
          >
            {isLoading && (
              <MuiTableRow>
                <MuiTableCell
                  align="center"
                  colSpan={tableHeader?.length || 6}
                  sx={{ borderBottom: 'none', height: '15vw' }}
                >
                  <CircularProgress />
                </MuiTableCell>
              </MuiTableRow>
            )}
            {!isLoading && (!draftOLData || draftOLData.length === 0) && (
              <MuiTableRow>
                <MuiTableCell
                  align="center"
                  colSpan={tableHeader?.length || 6}
                  sx={{ borderBottom: 'none', height: '15vw' }}
                >
                  <EmptyPlaceholder status="data" />
                </MuiTableCell>
              </MuiTableRow>
            )}
            {draftOLData?.map((rows, index) => {
              return (
                <>
                  <MuiTableRow>
                    <MuiTableCell align="left">
                      <b>{index + 1}</b>
                    </MuiTableCell>
                    <MuiTableCell align="left" colSpan={3}>
                      <b>{rows.nameOL}</b>
                    </MuiTableCell>
                    <MuiTableCell align="left" />
                    <MuiTableCell align="left">
                      <div style={{ display: tableProps.hidden ? 'none' : '' }}>
                        {parentTableHeader?.map((header) =>
                          renderTableCell(rows, index, header),
                        )}
                      </div>
                    </MuiTableCell>
                  </MuiTableRow>

                  <MuiTableRow>
                    <MuiTableCell align="left" />
                    <MuiTableCell align="left" colSpan={3}>Draft OL</MuiTableCell>
                    <MuiTableCell align="left" />
                    <MuiTableCell align="left">
                      <div style={{ display: tableProps.hidden ? 'none' : '' }}>
                        {(() => {
                          // Add New button uses shouldShowAddNewButtonByRoleStatus helper
                          // Based on Role, Divisi, and Status/Stepper mapping
                          // This is for parent level (cycle 0) Add New button
                          // Get roleCode and divisionCode for more accurate checking
                          const roleCode = userRoleRefactor?.roleCode;
                          const divisionCode = userDivision?.divisionCode;

                          const showAddNew = shouldShowAddNewButtonByRoleStatus(
                            userRole,
                            bucket?.process || '',
                            divisionForRole,
                            roleCode,
                            divisionCode
                          );

                          // Logic: Show Add New button if:
                          // 1. No draft OL exists yet (can add first draft), OR
                          // 2. Last draft OL has status COMPLY or NOT_COMPLY (can add next draft)
                          const children = rows?.children || [];
                          const hasNoDraft = children.length === 0;

                          let canAddNew = hasNoDraft;
                          let isCustomerBanding = false;

                          if (!hasNoDraft && children.length > 0) {
                            // Get the last draft OL
                            const lastDraft = children[children.length - 1];
                            // Check if last draft has status COMPLY or NOT_COMPLY
                            const lastDraftHasStatus = lastDraft?.status === 'NOT_COMPLY';
                            const lastDraftIsCustomerBanding = lastDraft?.isCustomerBanding === true;
                            canAddNew = lastDraftHasStatus;
                            isCustomerBanding = lastDraftIsCustomerBanding;
                          }

                          // Hide Add New button when isDti and process is SPFP_DPOP
                          const isNotDtiDPOP = isDti && bucket?.process !== TypeProcess.SPDP;

                          if (((showAddNew || isNotDtiDPOP) && canAddNew) || ((showAddNew || isNotDtiDPOP) && isCustomerBanding)) {
                            return (
                              <Button
                                variant="outlined"
                                startIcon="add-2"
                                startIconSx={{ fontSize: theme.spacing(3) }}
                                sx={{
                                  height: theme.spacing(6),
                                  padding: theme.spacing(1),
                                }}
                                onClick={() => handleOpenAddModal(rows)}
                              >
                                Add New
                              </Button>
                            );
                          }
                          return null;
                        })()}
                      </div>
                    </MuiTableCell>
                  </MuiTableRow>

                  {rows.children.map((row, childIndex) => (
                    <MuiTableRow key={`child-row-${index}-${row.noOl}`}>
                      <MuiTableCell align="left" />
                      <MuiTableCell align="right">
                        <RowWrapper sx={{ gap: 2, justifyContent: 'left' }}>
                          <TextStyle variant="body4">
                            {generateAlphabetLetter(childIndex)}.
                          </TextStyle>
                          {row.noOl || '-'}
                        </RowWrapper>
                      </MuiTableCell>
                      <MuiTableCell align="left">{row?.offeringLetterDate ? dayjs(row?.offeringLetterDate)?.format('DD MMM YYYY, HH:mm:ss') : '-'}</MuiTableCell>
                      <MuiTableCell align="left">
                        <Button
                          variant="outlined"
                          color="primary"
                          noClick
                          sx={{ px: 1, py: 0.5 }}
                          textVariant="body5"
                        >
                          {row?.status ? (row.status as string).replace('_', ' ') : '-'}
                        </Button>
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {tableHeader?.map((header) => {
                          if (header.type === 'checkbox') {
                            return (
                              <div key={`checkbox-${index}-${row.noDraft}`}>
                                {renderTableCell(row, index, header, rows)}
                              </div>
                            );
                          }
                          return null;
                        })}
                      </MuiTableCell>
                      <MuiTableCell align="left">
                        {tableHeader?.map((header) => {
                          if (header.type === 'action') {
                            const options = typeof (header.options) === 'function' ? header.options(row, index, rows) : header.options;

                            // Pisahkan action view-only (detail, preview, download) dari action lainnya
                            // Action view-only harus selalu muncul, tidak peduli tableProps.hidden
                            const viewOnlyActions = options?.filter((option) =>
                              option.iconName === 'detail' ||
                              option.iconName === 'preview-document' ||
                              option.iconName === 'download'
                            ) || [];
                            const otherActions = options?.filter((option) =>
                              option.iconName !== 'detail' &&
                              option.iconName !== 'preview-document' &&
                              option.iconName !== 'download'
                            ) || [];

                            return (
                              <RowWrapper key={`action-wrapper-${index}-${row.noDraft}`} sx={{ display: 'inline-flex', gap: 0 }}>
                                {/* Action view-only selalu muncul, tidak peduli tableProps.hidden */}
                                {viewOnlyActions.map((option) => {
                                  const isDisabled = typeof (option.isDisabled) === 'function'
                                    ? option.isDisabled(row)
                                    : option.isDisabled;
                                  return (
                                    <Button
                                      disabled={isDisabled}
                                      variant="text"
                                      key={`action-viewonly-${option.iconName}-${index}`}
                                      sx={{
                                        minWidth: 0,
                                        padding: theme.spacing(1),
                                      }}
                                      onClick={() => option.onClick(row, index, rows)}
                                    >
                                      <IconTooltip
                                        iconName={option.iconName}
                                        sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                                      />
                                    </Button>
                                  );
                                })}
                                {/* Action lainnya mengikuti tableProps.hidden */}
                                {!tableProps.hidden && otherActions.map((option) => {
                                  const isDisabled = typeof (option.isDisabled) === 'function'
                                    ? option.isDisabled(row)
                                    : option.isDisabled;
                                  return (
                                    row.status && row.status !== '-' && option.iconName === 'delete' ?
                                      null :
                                      <Button
                                        disabled={isDisabled}
                                        variant="text"
                                        key={`action-${option.iconName}-${index}`}
                                        sx={{
                                          minWidth: 0,
                                          padding: theme.spacing(1),
                                        }}
                                        onClick={() => option.onClick(row, index, rows)}
                                      >
                                        <IconTooltip
                                          iconName={option.iconName}
                                          sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                                        />
                                      </Button>
                                  );
                                })}
                              </RowWrapper>
                            );
                          }
                          return null;
                        })}
                      </MuiTableCell>
                    </MuiTableRow>
                  ))}
                  {(
                    <>
                      <MuiTableRow>
                        <MuiTableCell align="left" />
                        <MuiTableCell align="left" colSpan={3}>Final OL</MuiTableCell>
                        <MuiTableCell align="left" />
                        <MuiTableCell align="left">
                          <div style={{ display: tableProps.hidden ? 'none' : '' }}>
                            {(() => {
                              const roleCode = userRoleRefactor?.roleCode;
                              const divisionCode = userDivision?.divisionCode;

                              const showAddNewFinal = shouldShowFinalOLAddNewButton(
                                userRole,
                                bucket?.process || '',
                                divisionForRole,
                                roleCode,
                                divisionCode
                              );

                              const childrenFinal = finalOLData
                                ?.find((finalRow) => finalRow.noDraft === rows.noDraft)
                                ?.children || [];
                              const hasNoFinalDraft = childrenFinal.length === 0;

                              const isProcessFinal = bucket?.process === TypeProcess.SPFP_FINAL;
                              const canShowAddNewFinal = (showAddNewFinal || isDti) && isProcessFinal;

                              if (canShowAddNewFinal && hasNoFinalDraft) {
                                return (
                                  <Button
                                    variant="outlined"
                                    startIcon="add-2"
                                    startIconSx={{ fontSize: theme.spacing(3) }}
                                    sx={{
                                      height: theme.spacing(6),
                                      padding: theme.spacing(1),
                                    }}
                                    onClick={() => handleOpenAddFinalModal(rows)}
                                  >
                                    Add New
                                  </Button>
                                );
                              }
                              return null;
                            })()}
                          </div>
                        </MuiTableCell>
                      </MuiTableRow>

                      {finalOLData
                        ?.find((finalRow) => finalRow.noDraft === rows.noDraft)
                        ?.children?.map((row, childIndex) => (
                          <MuiTableRow key={`final-row-${index}-${row.noOl}`}>
                            <MuiTableCell align="left" />
                            <MuiTableCell align="right">
                              <RowWrapper sx={{ gap: 2, justifyContent: 'left' }}>
                                <TextStyle variant="body4">
                                  {generateAlphabetLetter(childIndex)}.
                                </TextStyle>
                                {row.noOl || '-'}
                              </RowWrapper>
                            </MuiTableCell>
                            <MuiTableCell align="left">{row?.offeringLetterDate ? dayjs(row?.offeringLetterDate)?.format('DD MMM YYYY, HH:mm:ss') : '-'}</MuiTableCell>
                            <MuiTableCell align="left" />
                            <MuiTableCell align="left">
                              {tableHeader?.map((header) => {
                                if (header.type === 'checkbox') {
                                  return (
                                    <div key={`checkbox-final-${index}-${row.noDraft}`}>
                                      {renderTableCell(row, index, header, rows)}
                                    </div>
                                  );
                                }
                                return null;
                              })}
                            </MuiTableCell>
                            <MuiTableCell align="left">
                              {tableHeader?.map((header) => {
                                if (header.type === 'action') {
                                  const options = typeof (header.options) === 'function' ? header.options(row, index, rows) : header.options;

                                  // Pisahkan action view-only (detail, preview, download) dari action lainnya
                                  // Action view-only harus selalu muncul, tidak peduli tableProps.hidden
                                  const viewOnlyActions = options?.filter((option) =>
                                    option.iconName === 'detail' ||
                                    option.iconName === 'preview-document' ||
                                    option.iconName === 'download'
                                  ) || [];
                                  const otherActions = options?.filter((option) =>
                                    option.iconName !== 'detail' &&
                                    option.iconName !== 'preview-document' &&
                                    option.iconName !== 'download'
                                  ) || [];

                                  return (
                                    <RowWrapper key={`action-wrapper-final-${index}-${row.noDraft}`} sx={{ display: 'inline-flex', gap: 0 }}>
                                      {/* Action view-only selalu muncul, tidak peduli tableProps.hidden */}
                                      {viewOnlyActions.map((option) => {
                                        const isDisabled = typeof (option.isDisabled) === 'function'
                                          ? option.isDisabled(row)
                                          : option.isDisabled;
                                        return (
                                          <Button
                                            disabled={isDisabled}
                                            variant="text"
                                            key={`action-viewonly-final-${option.iconName}-${index}`}
                                            sx={{
                                              minWidth: 0,
                                              padding: theme.spacing(1),
                                            }}
                                            onClick={() => option.onClick(row, index, rows)}
                                          >
                                            <IconTooltip
                                              iconName={option.iconName}
                                              sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                                            />
                                          </Button>
                                        );
                                      })}
                                      {/* Action lainnya mengikuti tableProps.hidden */}
                                      {!tableProps.hidden && otherActions.map((option) => {
                                        const isDisabled = typeof (option.isDisabled) === 'function'
                                          ? option.isDisabled(row)
                                          : option.isDisabled;
                                        return (
                                          row.status && row.status !== '-' && option.iconName === 'delete' ?
                                            null :
                                            <Button
                                              disabled={isDisabled}
                                              variant="text"
                                              key={`action-final-${option.iconName}-${index}`}
                                              sx={{
                                                minWidth: 0,
                                                padding: theme.spacing(1),
                                              }}
                                              onClick={() => option.onClick(row, index, rows)}
                                            >
                                              <IconTooltip
                                                iconName={option.iconName}
                                                sx={{ ...(isDisabled && ({ path: { stroke: theme.palette.text.disabled } })) }}
                                              />
                                            </Button>
                                        );
                                      })}
                                    </RowWrapper>
                                  );
                                }
                                return null;
                              })}
                            </MuiTableCell>
                          </MuiTableRow>
                        ))}
                    </>
                  )}
                </>
              );
            })}
          </MuiTableBody>
        </MuiTable>

        <ModalDef
          id={modal.MODAL_ADD_DRAFT_OL}
          component={ModalAddDraftOL}
        />

        <ModalDef
          id={modal.MODAL_ADD_OL}
          component={ModalAddOL}
        />

        <ModalDef
          id={modal.MODAL_FINAL_DRAFT_OL}
          component={ModalFinalDraftOL}
        />

        <ModalDef
          id={modal.OFFERING_LETTER_DETAIL}
          component={ModalDetailOL}
        />
      </MuiTableContainer>
    </Paper>
  );
};

export default TableTreeDraftOL;
