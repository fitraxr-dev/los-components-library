import { useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { ActivityType } from '@/enums/Activity';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { stringToNumber } from '@/helpers/utils';
import useGetDetailProposalPlan from '@/hooks/services/mip/bmpp/useGetDetailProposalPlan';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import { modal, tab } from '../../BmppCalculation.constants';
import useSaveProposalPlanMaster from '../../hooks/useSaveProposalPlanMaster';

import type { ModalFacilityProposalPlanProps } from './ModalFacilityProposalPlan.types';


const useModalFacilityProposalPlan = (props: ModalFacilityProposalPlanProps) => {
  const { handleChangeTab, debtorId, groupId, id, setValue, isDebtor } = props;
  const queryClient = useQueryClient();
  const { recordActivity } = useRecordLog();
  const [state] = useApp();
  const [isSuccess, setIsSuccess] = useState(false);
  const _module = state.pages.mipModule;
  const process = state.pages.mipProcess;

  const { mutate: getDetailProposalPlan, isPending: isLoading, data: detailData, error } = useGetDetailProposalPlan({
    onError: () => {
      console.error(error);
    },
    onSuccess: () => {
      setIsSuccess(true);
    },
  });

  useEffect(() => {
    getDetailProposalPlan({
      id: stringToNumber(id),
    });
  }, []);

  useEffect(() => {
    if (isSuccess) {
      setValue('nominalInIdr', detailData?.proposalPlanValue);
    }
  }, [detailData]);

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

      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: groupId,
        module: _module,
        process: process,
        remarks:
        `Menyimpan data usulan fasilitas pembiayaan dengan DebtorId: ${variables?.debtorId}${groupId ? ` dan GroupId: ${groupId}` : ''}`,
      });

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

  return {
    detailData,
    handleOnSave,
    isLoading,
    isSaveLoading,
    isSuccess,
  };
};

export default useModalFacilityProposalPlan;
