import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteDocument from '@/hooks/services/useDeleteDocument';
import useGetDocumentList from '@/hooks/services/useGetDocumentList';
import useIdentity from '@/hooks/useIdentity';
import { DocumentTypeRequestDtoOwnershipEnum } from '@/services/openapi/bucket-document-service';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import { modal } from './TableUploadDocumentSPFP.constants';

import type { TableUploadDocumentSPFPProps } from './TableUploadDocumentSPFP.types';


export const useTableUploadDocumentSPFP = (props: TableUploadDocumentSPFPProps) => {
  // const { module, process } = props;
  const { processId } = useIdentity();
  const [noPage, setNoPage] = useState(1);
  const [itemPerPage, setItemPerPage] = useState(5);
  const bucket = useSpfpBucketContext();

  const { data: changeMemoData, isLoading: changeMemoLoading } = useGetDocumentList({
    filter: {
      documentParent: props.documentParent,
      ownership: DocumentTypeRequestDtoOwnershipEnum.SPFP,
      ...bucket,
    },
    page: {
      itemPerPage: itemPerPage,
      noPage: noPage,
    },
  });

  const { isPending: isDeleteLoading, mutate: deleteDocument } = useDeleteDocument({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const changeMemoContents = changeMemoData?.contents;
  const changeMemoPage = changeMemoData?.page;

  const changeMemoList = changeMemoContents?.map((item) => ({
    ...item,
    documentDate: item.documentDate ? formatDate(new Date(item.documentDate), 'DD MMMM YYYY') : '-',
    documentNumber: item.documentNumber ? item.documentNumber : '-',
    documentType: item.documentTypeLabel,
    updatedBy: item.createdBy,
    updatedDate: item.createdDate ? formatDate(new Date(item.createdDate), 'DD MMMM YYYY') : '-',
  }));

  const handleOpenModalUploadDocument = () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      ownership: DocumentTypeRequestDtoOwnershipEnum.SPFP,
      type: props.documentParent,
      ...bucket,
    });
  };

  const handleOpenExistingModalUploadDocument = () => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT_EXISTING, {
      blacklist: changeMemoContents?.map((res) => res?.id) || [],
      documentParent: props.documentParent,
      ownership: DocumentTypeRequestDtoOwnershipEnum.SPFP,
      ...bucket,
    });
  };

  const handleOpenAddModal = async () => {
    if (props.showModalSelector) {
      return NiceModal.show(MODAL.GLOBAL.SELECTOR, {
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
          if (val === 'new') handleOpenModalUploadDocument();
          else handleOpenExistingModalUploadDocument();
        },
        title: 'Add Document',
      });
    }

    handleOpenModalUploadDocument();
  };

  const handleOpenEditModal = async (id: number) => {
    NiceModal.show(modal.MODAL_UPLOAD_DOCUMENT, {
      ...props,
      id: id,
      module: TypeModule.SPFP,
      ownership: DocumentTypeRequestDtoOwnershipEnum.SPFP,
      type: props.documentParent,
      ...bucket,
    });
  };

  const handleOpenDeleteModal = async (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => deleteDocument({
        bucketProcessId: processId,
        documentParent: props.documentParent,
        payload: {
          id,
        },
      }),
      submitText: 'Ya',
      title: 'Apakah anda yakin untuk menghapus dokumen ini?',
      type: 'warning',
    });
  };

  return {
    changeMemoList,
    changeMemoLoading,
    changeMemoPage,
    handleOpenAddModal,
    handleOpenDeleteModal,
    handleOpenEditModal,
    isDeleteLoading,
    noPage,
    setItemPerPage,
    setNoPage,
    shouldDisable: props.shouldDisable,
  };
};
