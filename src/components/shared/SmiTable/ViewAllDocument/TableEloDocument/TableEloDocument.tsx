'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Tooltip, Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { TypeDivision } from '@/enums/Division';
import { TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';
import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import Icon from '@/components/shared/Icon';
import Search from '@/components/shared/Input/components/Search';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';

import ModalUploadDocumentElo from './components/ModalUploadDocumentElo';
import { MODAL_UPLOAD_DOCUMENT_ELO, tableHeaderList } from './TableEloDocument.constants';
import { useTableEloDocument } from './TableEloDocument.hook';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableEloDocument = (props: TableUploadDocumentProps) => {
  const theme = useTheme();
  const [{ currentRole, currentPosition, stepper }] = useApp();
  const { viewOnly } = useViewOnly();
  const { divisionCode } = useDivision();
  const path = usePathname();
  const apuPptPath = path.includes('apu-ppt');

  const {
    eloDocumentList,
    eloDocumentLoading,
    eloDocumentPage,
    filter,
    filterContentList,
    filterDropdownList,
    handleAddDocument,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isDeleteLoading,
    lastUpdate,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
  } = useTableEloDocument(props);

  const listReadOnly = [TypeProcess.REVIEWER_DK, TypeProcess.REVIEWER_DH];
  const readOnly = listReadOnly.includes(props.process);

  const isStaff = currentRole.includes(roles.RM);
  const isSuperAdmin = currentRole.includes(roles.SUPER_ADMIN);
  const isSuperAdminMaker = currentRole.includes(roles.MAKER);
  const isStaffSuperAdmin = currentPosition.includes('TASK_FORCE');
  const superAdminMakerException = isSuperAdminMaker && !viewOnly;
  const staffException = isStaffSuperAdmin && !viewOnly;
  const isApuPptModule = props.process === TypeProcess.APU_PPT;

  const isDisabled = isSuperAdmin || readOnly || viewOnly;

  // const allowUpload = React.useMemo(() => {
  //   const isFromHR = state.stepper.from === 'HR_ASK_FOR_INFO';
  //   const isApuPptModule = props.module === TypeModule.APU_PPT;

  //   const normal = !viewOnly && !readOnly;
  //   const hrException = isApuPptModule && isFromHR;

  //   return normal || hrException;
  // }, [state.stepper.from, props.module, viewOnly, readOnly]);
  //   return normal || hrException;
  // }, [state.stepper.from, props.module, viewOnly, readOnly]);

  // CR terakhir divisi DPOP
  const stepperFromStatus = stepper?.from?.toLowerCase() || '';
  const isStatusBlocked = stepperFromStatus.includes('cancel') ||
    stepperFromStatus.includes('reject') ||
    stepperFromStatus.includes('complete');
  const allowUpload = !isStatusBlocked && ((divisionCode === TypeDivision.DPOP_DIVISION) ||
        superAdminMakerException || staffException);

  const handleActionButton = (row) => {
    let res = [];
    res.push({
      apiDownload: 'bucketDocument.elo.preview',
      iconName: 'download',
      isDisabled: isDeleteLoading,
      isPreview: true,
    });

    if (allowUpload && !isDisabled && (row.hasSubmitted || !row.isFromOtherProcess)) {
      res.unshift(
        {
          iconName: 'edit',
          isDisabled: (row) => isDeleteLoading || !row?.isEditable,
          onClick: async (row) => handleOpenEditModal(row.id),
        },
        {
          iconName: 'delete',
          isDisabled: (row) => isDeleteLoading || !row?.isDeletable,
          onClick: async (row) => handleOpenDeleteModal(row.id),
        }
      );
    }
    return res;
  };

  const tableHeaderDocument: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: (row) => handleActionButton(row),
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  return (
    <>
      <SectionTitle title="Document ELO" isOpen>
        <Search
          value={filter}
          isDebounced
          hasFilter
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
        {props.dataAsOf && (
          <RowWrapper alignItems="center" gap={theme.spacing(2)} sx={{ my: theme.spacing(3) }}>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.custom.text}
            >
              Data as of : {lastUpdate ? formatDateTime(lastUpdate) : '-'}
            </TextStyle>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.error.main}
            >
              <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                <Box display="flex" alignItems="center">
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </TextStyle>
          </RowWrapper>
        )}
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderDocument}
            tableData={eloDocumentList}
            isLoading={eloDocumentLoading}
            currentPage={noPage}
            totalPage={eloDocumentPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={allowUpload ? <TableFooter onClick={handleAddDocument} /> : null}
          />
        </BaseContainer>
      </SectionTitle>

      {/* Modals */}
      <ModalDef
        id={MODAL_UPLOAD_DOCUMENT_ELO}
        component={ModalUploadDocumentElo}
      />
    </>
  );
};

export default TableEloDocument;
