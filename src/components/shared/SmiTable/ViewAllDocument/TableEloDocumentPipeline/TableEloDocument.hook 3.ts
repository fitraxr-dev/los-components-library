'use client';

import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DPOP_DIVISION,
} from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { TypeProcess } from '@/enums/Module';
import { formatDate, formatDateTime } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
} from '@/services/openapi/bucket-document-service';

import { modal } from '../constants';

import type { TableUploadDocumentProps } from '../../TableUploadDocument/TableUploadDocument.types';


export const useTableEloDocument = (props: TableUploadDocumentProps) => {
  const { module, process, id, showModalSelector } = props;

  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const { viewOnly } = useViewOnly();
  const [{ userData }] = useApp();
  const [documentGroup, setDocumentGroup] = useState<String[] | undefined>(undefined);
  const [filter, setFilter] = useSessionStorage(`${props.module}-${props.process}-filter-elo-document`, null);
  const { data: searchByOptions } = useGetParameterList('searchByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentTypeName',
        value: '',
      },
    },
  );

  const dataGroups = useMemo(() => {
    return documentGroupData?.map((item) => ({
      label: item.label,
      value: item.id,
    }));
  }, [documentGroupData]);

  const { data: documentTypeData, isFetching: isFetchDocumentTypeLoading } = useGetParameterDocumentType(
    {
      filter: {
        documentGroupCode: documentGroup?.join('|'),
      },
      page: {
        itemPerPage: 100,
        noPage: 1,
      },
      searchDetail: {
        key: 'documentGroupName',
        value: '',
      },
    },
    { enabled: !!documentGroup },
  );

  useMemo(() => {
    if (filter?.filter?.documentGroup) {
      setDocumentGroup(filter?.filter?.documentGroup);
    }
  }, [filter?.filter?.documentGroup]);

  const dataTypes = useMemo(() => {
    return documentTypeData?.map((item) => ({
      label: item.label,
      value: item.id,
    }));
  }, [documentTypeData]);

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'uploadedEndDate',
      key: 'modifiedDate',
      label: 'Tanggal Dokumen',
      startKey: 'uploadedStartDate',
      type: 'period',
    },
    {
      endKey: 'endDate',
      key: 'createdDate',
      label: 'Periode Created Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'division',
      label: 'Divisi',
      options: divisionList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'documentGroup',
      label: 'Group Dokumen',
      options: dataGroups ?? [],
      type: 'multiple-autocomplete',
      watch: (value) => {setDocumentGroup(value);},
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: dataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];

  const listReadOnly = [
    TypeProcess.REVIEWER_DK,
    TypeProcess.REVIEWER_DH
  ];

  const { divisionCode } = useDivision();
  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_3_DIVISION];
  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);
  const isDpop = divisionCode === DPOP_DIVISION;
  const readOnly = listReadOnly.includes(props.process);

  const { data: financingDocumentData, isLoading: financingDocumentLoading } = useGetDocumentList({
    filter: {
      ...filter?.filter,
      bucketProcessId: id !== undefined && id !== null ? String(id) : processId,
      documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT,
      documentParentApprovedMandatory: props.approvedMandatory,
      module,
      process,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  });

  const { isPending: isDeleteLoading, mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const financingDocumentContents = financingDocumentData?.contents;
  const financingDocumentPage = financingDocumentData?.page;

  const financingDocumentList = financingDocumentContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentName: item.documentName ?? '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel ?? '-',
    uploadedBy: item.modifiedBy ?? '-',
    uploadedDate: item.modifiedDate ? formatDateTime(item.modifiedDate) : '-',
  }));

  const handleAddDocument = () => {
    if (showModalSelector) return NiceModal.show(MODAL.GLOBAL.SELECTOR, {
      data: [
        {
          description: 'Tambah dokumen baru',
          key: 'new',
          label: 'Create New',
        },
        {
          description: 'Menambahkan dari dokumen eksisting',
          key: 'existing',
          label: 'Tambahkan dari Dokumen Eksisting',
        },
      ],
      onSubmit: (val: any) => {
        if (val === 'new') {
          handleOpenAddNewModal();
        } else {
          handleOpenAddExistingModal();
        };
      },
      title: 'Add Document',
    });
    handleOpenAddNewModal();
  };

  const handleOpenAddNewModal = () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, title: 'Document Pembiayaan', type: DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT });
  };

  const handleOpenAddExistingModal = () => {

    const createProps = {
      blacklist: financingDocumentList?.map((res) => res?.id) || [],
      debtorId: debtorId,
      documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.FINANCINGDOCUMENT.toString()],
      documentCategoryDisabled: true,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
      module,
      process,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };

  const handleOpenEditModal = (id: number) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, id, title: 'Document Pembiayaan', type: DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT });
  };

  const handleOpenDeleteModal = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({
        bucketProcessId: processId,
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.FINANCINGDOCUMENT,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk Menghapus data Dokumen Pembiayaan?',
      type: 'warning',
    });
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    financingDocumentList,
    financingDocumentLoading,
    financingDocumentPage,
    handleAddDocument,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isBusinessDivision,
    isDeleteLoading,
    isDpop,
    noPage,
    readOnly,
    setFilter,
    setItemPerPage,
    setNoPage,
    viewOnly,
  };
};
