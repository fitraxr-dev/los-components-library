import { useEffect } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { stringToNumber } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import { modal, tab } from '../../Detail.constants';
import useGetDetailProposalPlan from '../../hooks/useGetDetailProposalPlan';
import useSaveProposalPlanMaster from '../../hooks/useSaveProposalPlanMaster';

import type { ModalFacilityProposalPlanProps } from './ModalFacilityProposalPlan.types';


const useModalFacilityProposalPlan = (props: ModalFacilityProposalPlanProps) => {
  const { handleChangeTab, debtorId, groupId, id, setValue, isDebtor } = props;
  const queryClient = useQueryClient();

  const { mutate: saveProposal, isPending: isSaveLoading } = useSaveProposalPlanMaster({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: (variables) => {
      if (isDebtor) {
        queryClient.invalidateQueries({ queryKey: ['proposed-debtor-financing-facility', {
          debtorId: variables.debtorId,
          groupId,
          ownership: 'DEBTOR',
        }]});
      } else {
        queryClient.invalidateQueries({ queryKey: ['proposed-group-financing-facility']});
      }

      onSuccessNiceModal();
    },
  });

  const onSuccessNiceModal = () => {
    showNiceModalV2({
      onClose: () => {
        showNiceModalV2({
          cancelText: 'Cancel',
          onCancel: () => {handleOnCancel();},
          onSubmit: () => {handleChangeTab(tab.CALCULATION);},
          submitText: 'Ok',
          title: 'Mohon untuk melakukan Calculate ulang pada tab Perhitungan BMPP',
          type: 'warning',
        });
      },
      type: 'success',
    });
  };

  const { data: detailData, isLoading, isSuccess } = useGetDetailProposalPlan({ id: stringToNumber(id) });

  const handleOnSave = (data) => {
    closeNiceModal(modal.facilityProposalPlan);
    const groupIdTemp = debtorId === groupId ? null : (groupId ? groupId : detailData?.groupId);
    saveProposal({
      debtorId,
      groupId: groupIdTemp,
      proposalPlanValue: data.nominalInIdr,
    });
  };

  const handleOnCancel = () => {
    closeNiceModal(modal.facilityProposalPlan);
    if (isDebtor) {
      queryClient.invalidateQueries({ queryKey: ['proposed-debtor-financing-facility']});
    } else {
      queryClient.invalidateQueries({ queryKey: ['proposed-group-financing-facility']});
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setValue('nominalInIdr', detailData?.proposalPlanValue);
    }
  }, [detailData]);

  return {
    detailData,
    handleOnSave,
    isLoading,
    isSaveLoading,
    isSuccess,
  };
};

export default useModalFacilityProposalPlan;
