'use client';

import * as React from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useDownloadGeneral from '@/hooks/useDownloadGeneral';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Search from '@/components/shared/Input/components/Search';
import SectionTitle from '@/components/shared/SectionTitle';
import ModalUploadDocument from '@/components/shared/SmiModal/ModalUploadDocument';
import ModalUploadDocumentExisting from '@/components/shared/SmiModal/ModalUploadDocumentExisting';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';

import { modal, TABLE_HEADER } from '../constants';

import { useTableFinancingDocument } from './TableFinancingDocument.hook';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const TableFinancingDocument = (props: TableUploadDocumentProps) => {
  const [state] = useApp();
  const path = usePathname();
  const apuPptPath = path.includes('apu-ppt');

  const {
    useSelected = false,
    selectedItems = [],
    onItemSelection,
    onSelectAll,
    searchFilter,
    onSearchChange,
  } = props;

  const downloadMutation = useDownloadGeneral({
    onError: (error) => {
      showNiceModalV2({
        title: 'Download gagal',
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Download berhasil',
        type: 'success',
      });
    },
  });

  const handleDownload = (id: number, fileName?: string) => {
    downloadMutation.mutate({ fileName, id });
  };

  const {
    financingDocumentLoading,
    financingDocumentList,
    financingDocumentPage,
    isDeleteLoading,
    noPage,
    setNoPage,
    setItemPerPage,
    handleAddDocument,
    handleOpenEditModal,
    handleOpenDeleteModal,
    readOnly,
    viewOnly,
    filter,
    setFilter,
    filterContentList,
    filterDropdownList,
    isUserGroupBusiness,
    isDeletable,
    existingDocumentNumbers,
  } = useTableFinancingDocument(props);

  const isSuperAdmin = state.currentRole.includes(roles.SUPER_ADMIN);
  const isSuperAdminMaker = state.currentRole.includes(roles.MAKER);
  const isStaffSuperAdmin = state.currentPosition.includes('TASK_FORCE');
  const isDisabled = isSuperAdmin || readOnly || viewOnly;
  const { isRM, isDpopDivision } = useApuPptContext();
  const isStaffDpop = isRM && isDpopDivision;


  const allowUpload = React.useMemo(() => {
    const stepperFromStatus = state.stepper.from?.toLowerCase() || '';
    const isStatusBlocked = stepperFromStatus.includes('cancel') ||
      stepperFromStatus.includes('reject') ||
      stepperFromStatus.includes('completed');
    const isFromHR = state.stepper.from === 'HR_ASK_FOR_INFO';
    const isApuPptModule = props.process === TypeProcess.APU_PPT;
    const isKajianModule = props.module === TypeModule.MIP_REVIEW;
    const isMipAnalyst = props.module === TypeModule.MIP && props.process === TypeProcess.MIP_ANALYST;
    const isMupAnalyst = props.module === TypeModule.MUP && props.process === TypeProcess.MUP_ANALYST;
    const isLps = props.module === TypeModule.LPS;
    const isCreditChecking = props.module === TypeModule.CREDIT_CHECKING;
    const normal = !viewOnly && isUserGroupBusiness && !isCreditChecking && !isLps;
    const hrException = isApuPptModule && isFromHR;
    const kajianException = !viewOnly && isKajianModule;
    const mipAnalystException = !viewOnly && isMipAnalyst;
    const mupAnalystException = !viewOnly && isMupAnalyst;
    const creditCheckingException = !viewOnly && isCreditChecking && !isDpopDivision;

    console.log('creditCheckingException', creditCheckingException);
    const superAdminMakerException = isSuperAdminMaker && !viewOnly;
    const staffException = isStaffSuperAdmin && !viewOnly;
    const lpsException = !viewOnly && isLps && !isDpopDivision;
    const apuPptProcess = apuPptPath ? (isApuPptModule && !isStatusBlocked) :
      (isStaffDpop && !isLps && !isCreditChecking);

    return normal || hrException || kajianException || mipAnalystException ||
      mupAnalystException || superAdminMakerException || staffException || apuPptProcess || lpsException
      || creditCheckingException;
  }, [
    state.stepper.from,
    props.module,
    props.process,
    viewOnly,
    isUserGroupBusiness,
    isSuperAdminMaker,
    isStaffSuperAdmin,
    isStaffDpop,
  ]);

  const handleActionButton = (row) => {
    let res = [];
    res.push(
      {
        iconName: 'preview-document',
        isDisabled: isDeleteLoading,
        onClick: (data) => {
          if (data?.document) {
            window.open((`${data?.document}?preview=true`), '_blank', 'noopener,noreferrer');
          } else {
            NiceModal.show(MODAL.GLOBAL.WARNING, {
              title: 'File tidak ditemukan',
            });
          }
        },
      },
      {
        iconName: 'download',
        isDisabled: isDeleteLoading,
        onClick: (row) => handleDownload(row.id, row.fileName),
      },
    );

    if (!isDisabled && (row.hasSubmitted || !row.isFromOtherProcess)) {
      res.unshift({
        iconName: 'edit',
        isDisabled: (row) => isDeleteLoading || !row?.isEditable,
        onClick: async (row) => handleOpenEditModal(row.id),
      });
    }
    res.unshift({
      iconName: 'delete',
      isDisabled: (row) => isDeleteLoading ||
        (isDeletable !== undefined && isDeletable !== null && !isDeletable) ||
        !row?.isDeletable,
      onClick: async (row) => handleOpenDeleteModal(row.id),
    });
    return res;
  };

  const baseHeaders = [
    ...TABLE_HEADER,
    {
      key: 'uploadedBy',
      label: 'Uploaded By',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'divisionLabel',
      label: 'Divisi',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'uploadedDate',
      label: 'Uploaded Date',
      sx: {
        minWidth: '16vw',
      },
    },
  ];

  const tableHeaderDocument: TableHeader[] = useSelected
    ? [
      {
        isDisabled: (row: any) => existingDocumentNumbers.includes(row.documentNumber),
        isSelected: (row: any) =>
          existingDocumentNumbers.includes(row.documentNumber) ||
          selectedItems.some((item) => item.id === row.id),
        key: 'checkbox',
        label: '',
        onSelectChange: (row: any) => {
          if (!existingDocumentNumbers.includes(row.documentNumber)) {
            onItemSelection?.(row, !selectedItems.some((item) => item.id === row.id));
          }
        },
        sx: {
          width: '50px',
        },
        type: 'checkbox' as const,
      },
      ...baseHeaders,
    ]
    : [
      ...baseHeaders,
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
      <SectionTitle title="Document Pembiayaan" isOpen>
        <Search
          value={searchFilter !== undefined ? searchFilter : filter}
          isDebounced
          hasFilter
          onChange={onSearchChange || setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeaderDocument}
            tableData={financingDocumentList}
            isLoading={financingDocumentLoading}
            currentPage={noPage}
            totalPage={financingDocumentPage?.totalPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            footer={allowUpload ? <TableFooter onClick={handleAddDocument} /> : null}

          />
        </BaseContainer>
      </SectionTitle>


      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT}
        component={ModalUploadDocument}
      />
      <ModalDef
        id={modal.MODAL_UPLOAD_DOCUMENT_EXISTING}
        component={ModalUploadDocumentExisting}
      />
    </>
  );
};

export default TableFinancingDocument;
