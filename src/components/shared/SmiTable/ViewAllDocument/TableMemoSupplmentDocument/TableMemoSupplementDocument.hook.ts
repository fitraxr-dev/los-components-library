import { useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useSearchParams } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useGetParameterDocumentGroup from '@/hooks/services/useGetParameterDocumentGroup';
import useGetParameterDocumentType from '@/hooks/services/useGetParameterDocumentType';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import useSessionStorage from '@/hooks/useSessionStorage';
import {
  DocumentGroupParamRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentCategoryEnum,
  DocumentTypeRequestDtoDocumentParentEnum,
  DocumentTypeRequestDtoOwnershipEnum,
} from '@/services/openapi/bucket-document-service';


import { modal } from '../constants';

import type { TableMemoSupplementDocumentProps } from './TableMemoSupplementDocument.types';


export const useTableMemoSupplementDocument = (props: TableMemoSupplementDocumentProps) => {
  const { showModalSelector } = props;
  // const { module, process } = props;
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const searchParams = useSearchParams();
  const [itemPerPage, setItemPerPage] = useState(10);
  const [documentGroup, setDocumentGroup] = useState<String[] | undefined>(undefined);
  const [filter, setFilter] = useSessionStorage(`${props.module}-${props.process}-filter-memo-supplement`, null);
  const { data: searchByOptions } = useGetParameterList('searchByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.DIGITALMEMO,
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
  const ownerId = searchParams.get('ownerId');

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
    },
    {
      key: 'documentType',
      label: 'Jenis Dokumen',
      options: dataTypes ?? [],
      type: 'multiple-autocomplete',
    },
  ];


  const { data: memoSupplementData, isLoading: memoSupplementLoading } = useGetDocumentList({
    filter: {
      ...filter?.filter,
      bucketProcessId: processId as string,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.WAITINGAPPROVAL,
      module: TypeModule.MIP_REVIEW,
      ownership: DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW,
      process: TypeProcess.MIP_REVIEW,
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

  const memoSupplementContents = memoSupplementData?.contents;
  const memoSupplementPage = memoSupplementData?.page;

  const memoSupplementList = memoSupplementContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel,
    updatedBy: item.createdBy,
    updatedDate: item.createdDate ? formatDate(new Date(item.createdDate), 'DD MMMM YYYY') : '-',
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

  const handleOpenAddNewModal = async () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
      module: TypeModule.MIP_REVIEW,
      ownerId: ownerId,
      ownership: DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW,
      process: TypeProcess.MIP_REVIEW,
      processId: processId,
      withDocElo: false,
    });
  };

  const handleOpenAddExistingModal = () => {
    const createProps = {
      blacklist: memoSupplementList?.map((res) => res?.id) || [],
      debtorId: debtorId,
      documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.DIGITALMEMO.toString()],
      documentCategoryDisabled: true,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
      module,
      process,
    };
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
  };

  const handleOpenEditModal = async (id: number) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      ...props,
      documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
      id: id,
      module: TypeModule.MIP_REVIEW,
      ownership: DocumentTypeRequestDtoOwnershipEnum.MIPREVIEW,
      process: TypeProcess.MIP_REVIEW,
      withDocElo: false,
    });
  };

  const handleOpenDeleteModal = async (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({
        bucketProcessId: processId,
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus dokumen Memo Supplement?',
      type: 'warning',
    });
  };

  return {
    filter,
    filterContentList,
    filterDropdownList,
    handleAddDocument,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isDeleteLoading,
    memoSupplementList,
    memoSupplementLoading,
    memoSupplementPage,
    noPage,
    setFilter,
    setItemPerPage,
    setNoPage,
  };
};
