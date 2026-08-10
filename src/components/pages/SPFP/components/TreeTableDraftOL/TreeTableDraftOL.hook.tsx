'use react';

import NiceModal from '@ebay/nice-modal-react';

import showNiceModalV2 from '@/helpers/showNiceModalV2';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';

import useDeleteOfferingLetter from '../../UploadOfferingLetterPage/hooks/useDeleteOfferingLetter';
import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';


export const useTreeTableDraftOL = () => {
  const bucket = useSpfpBucketContext();

  const { mutate: deleteOfferingLetter } = useDeleteOfferingLetter({
    onSuccess: () => {
      showNiceModalV2({
        title: 'Data berhasil dihapus',
        type: 'success',
      });
    },
  });

  const handleOpenAddModal = async (dataTable: any, parentData?: any) => {
    NiceModal.show(modal.MODAL_ADD_DRAFT_OL, {
      draftParent: parentData?.noDraft,
      module: bucket.module,
      nomorDraft: dataTable?.noDraft,
      process: bucket.process, // Pass parent's noDraft as draftParent
    });
  };

  const handleOpenAddFinalModal = async (dataTable: any, parentData?: any) => {
    NiceModal.show(modal.MODAL_FINAL_DRAFT_OL, {
      draftParent: parentData?.noDraft,
      module: bucket.module,
      nomorDraft: dataTable?.noDraft,
      process: bucket.process,
    });
  };
  const handleOpenEditModal = async (dataTable: any, parentData?: any) => {
    NiceModal.show(modal.MODAL_ADD_DRAFT_OL, {
      draftParent: parentData?.noDraft,
      // Pass parent's noDraft as draftParent
      editData: dataTable,

      module: bucket.module,

      nomorDraft: dataTable?.noDraft,
      process: bucket.process, // Pass the full data for editing
    });
  };

  const handleDetail = async (dataTable: any, parentData?: any) => {
    NiceModal.show(modal.MODAL_ADD_DRAFT_OL, {
      draftParent: parentData?.noDraft,
      editData: dataTable,
      isDetail: true, // Flag untuk disable semua field
      module: bucket.module,
      nomorDraft: dataTable?.noDraft,
      process: bucket.process,
    });
  };

  const handleDelete = (noDraft: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        deleteOfferingLetter({ id: noDraft });
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data? ',
      type: 'warning',
    });
  };

  const generateAlphabetLetter = (index: number): string => {
    return String.fromCodePoint(97 + (index));
  };

  return {
    generateAlphabetLetter,
    handleDelete,
    handleDetail,
    handleOpenAddFinalModal,
    handleOpenAddModal,
    handleOpenEditModal,
  };
};
