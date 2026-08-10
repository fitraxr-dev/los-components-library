import NiceModal from '@ebay/nice-modal-react';

import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';

import useDeleteExternalRating from '../../hooks/useDeleteExternalRating';
import useGetExternalRatingList from '../../hooks/useGetExternalRatingList';
import { modalId } from '../ModalAddExternalRating/ModalAddExternalRating.constants';

import { TableHeaderList } from './ExternalRatingTable.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useExternalRatingTable = () => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const { typeProcess } = useAnnualReviewContext();

  const { data, isLoading } = useGetExternalRatingList({
    bucketProcessId: processId,
    module: TypeModule.ANNUAL_REVIEW,
    process: typeProcess,
  });

  const { mutate } = useDeleteExternalRating({
    onError: () => {
      showNiceModalV2({ title: 'Data gagal dihapus.', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus.', type: 'success' });
    },
  });


  const handleAddRating = () => {
    NiceModal.show(modalId.MODAL_ADD_EXTERNAL_RATING, {
      process: 'add',
    });
  };

  const handleEditRating = (data) => {
    NiceModal.show(modalId.MODAL_ADD_EXTERNAL_RATING, {
      id: data.id,
      process: 'edit',
    });
  };

  const handleDeleteRating = (data) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        mutate({ id: data.id });
      },
      submitText: 'Ya',
      title: 'Apakah Anda yakin ingin menghapus data ini?',
      type: 'warning',
    });
  };


  const tableHeader: TableHeader[] = [
    ...TableHeaderList,
    // TODO: Confirm ke Teh Aul Terkait Action
    // {
    //   key: 'action',
    //   label: 'Action',
    //   options: [
    //     {
    //       iconName: 'edit',
    //       isDisabled: viewOnly,
    //       onClick: (data) => {
    //         handleEditRating(data);
    //       },
    //     },
    //     {
    //       iconName: 'delete',
    //       isDisabled: viewOnly,
    //       onClick: (data) => {
    //         handleDeleteRating(data);
    //       },
    //     }
    //   ],
    //   sx: { minWidth: '6vw' },
    //   type: 'action',
    // }
  ];

  return {
    data,
    handleAddRating,
    isLoading,
    tableHeader,
    viewOnly,
  };
};

export default useExternalRatingTable;
