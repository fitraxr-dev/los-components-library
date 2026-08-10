'use client';

import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
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
import type { LoginResponseDto } from '@/services/openapi/auth-service';


export const useTableSupportingDocument = (props: TableUploadDocumentProps) => {
  const { module, process, id, showModalSelector = true, isDeletable, existingDocuments = []} = props;
  const { processId, debtorId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(10);
  const { viewOnly } = useViewOnly();
  const [{ userData }] = useApp();
  const [documentGroup, setDocumentGroup] = useState<String[] | undefined>(undefined);
  const [filter, setFilter] = useSessionStorage(`${props.module}-${props.process}-filter-supporting-document`, null);

  // Extract documentNumbers from existing documents for comparison
  const existingDocumentNumbers = useMemo(() => {
    return existingDocuments.map((doc) => doc.documentNumber).filter(Boolean);
  }, [existingDocuments]);
  const { data: searchByOptions } = useGetParameterList('searchByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: sortByOptions } = useGetParameterList('sortByViewAllDocs', { label: 'value1', value: 'value2' });
  const { data: divisionList } = useGetParameterList('division', { label: 'value1', value: 'value2' });
  const { data: documentGroupData, isFetching: isFetchDocumentGroupLoading } = useGetParameterDocumentGroup(
    {
      filter: {
        documentCategory: DocumentGroupParamRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT,
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

    type newUserData = LoginResponseDto & {
      profilePicture: string;
    }
    const userDataWithGroupTypes = userData as newUserData & { userGroup?: { code?: string } };
    const isUserGroupBusiness = userDataWithGroupTypes?.userGroup?.code === 'BUSINESS';

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
      TypeProcess.REVIEWER_DH,
      TypeProcess.REVIEWER_DK
    ];

    const readOnly = listReadOnly.includes(props.process);
    const { divisionCode } = useDivision();

    const businessDivisionArray = [
      BUSINESS_DIVISION,
      SECOND_FINANCING_DIVISION,
      DP_2_DIVISION,
      DPB_DIVISION,
      DUS_DIVISION,
      DPPU_1_DIVISION,
      DPPU_2_DIVISION,
      DPPU_3_DIVISION];
    const isBusinessDivision = businessDivisionArray?.includes(divisionCode);

    const { data: supportingDocumentData, isLoading: supportingDocumentLoading } = useGetDocumentList({
      filter: {
        ...filter?.filter,
        //tidak jadi pakai debtorId, pakai bucketProcessId karena fitur umun
        bucketProcessId: id !== undefined && id !== null ? String(id) : processId,
        documentCategory: DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT,
        documentParentApprovedMandatory: props.approvedMandatory,
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

    const supportingDocumentContents = supportingDocumentData?.contents;
    const supportingDocumentPage = supportingDocumentData?.page;

    const supportingDocumentList = supportingDocumentContents?.map((item) => ({
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
      NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, title: 'Supporting Document', type: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT });
    };

    const handleOpenAddExistingModal = () => {
      const createProps = {
        blacklist: supportingDocumentList?.map((res) => res?.id) || [],
        debtorId: debtorId,
        documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT.toString()],
        documentCategoryDisabled: true,
        documentParent: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT,
        module,
        process,
      };
      // const createProps = {
      //   debtorId: debtorId,
      //   documentCategory: [DocumentTypeRequestDtoDocumentCategoryEnum.SUPPORTINGDOCUMENT.toString()],
      //   documentCategoryDisabled: true,
      // };
      NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, createProps);
    };

    const handleOpenDetailModal = async (id: number) => {
      NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, { ...props, id, title: 'Supporting Document', type: DocumentTypeRequestDtoDocumentParentEnum.SUPPORTINGDOCUMENT });
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
        title: 'Apakah anda yakin untuk Menghapus data Supporting Document?',
        type: 'warning',
      });
    };

    useEffect(() => {
      if (supportingDocumentList?.length === 0) {
        setNoPage(1);
      }
    }, [supportingDocumentList]);

    return {
      existingDocumentNumbers,
      filter,
      filterContentList,
      filterDropdownList,
      handleAddDocument,
      handleOpenDeleteModal,
      handleOpenDetailModal,
      isDeletable,
      isDeleteLoading,
      isUserGroupBusiness,
      noPage,
      readOnly,
      setFilter,
      setItemPerPage,
      setNoPage,
      supportingDocumentList,
      supportingDocumentLoading,
      supportingDocumentPage,
      viewOnly,
    };
};
