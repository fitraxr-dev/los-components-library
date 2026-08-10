'use react';
import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { mocktableDraftOl } from '@/__mocks__/mockSpfp';
import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import useDeleteComplianceCheck from '../../ComplianceCheckPage/hooks/useDeleteComplianceCheck';
import { modal } from '../../UploadOfferingLetterPage/UploadOfferingLetter.constants';


export const useTreeTableCompliance = () => {

  const handleOpenNotes = async (dataTable: any) => {
    NiceModal.show(modal.MODAL_ADD_DRAFT_OL, { data: dataTable });
  };

  const { isPending: isSaveLoading, mutate: deleteComplianceCheck } = useDeleteComplianceCheck({
    onSuccess: () => {
      NiceModal.show(MODAL.GLOBAL.SUCCESS, {
        title: 'Data berhasil dihapus',
      });
    },
  });

  const handleDeleteComplianceCheck = (row) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteComplianceCheck({
        bucketProcessId: row.bucketProcessId,
        complianceNumber: row.complianceNumber,
        module: row.module,
        process: row.process,
      }),
      title: 'Apakah anda yakin untuk menghapus data Compliance Check?',
    });
  };

  return {
    handleDeleteComplianceCheck,
    handleOpenAddModal: handleOpenNotes,
  };
};
