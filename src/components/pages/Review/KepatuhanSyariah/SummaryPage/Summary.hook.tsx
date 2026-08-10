import { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { MODAL } from '@/configs/constants/modalId';
import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useSessionStorage from '@/hooks/useSessionStorage';
import useViewOnly from '@/hooks/useViewOnly';

import { useShariahComplianceAccess } from '../hooks/useShariahComplianceAccess';

import useGetAdditionalInformation from './hooks/useGetAdditionalInformation';


const useSummaryPage = () => {
  const { processId }: { processId: string } = useParams();
  const theme = useTheme();

  const [activeTab, setActiveTab] = useSessionStorage('active-tab-dk', '1');
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const path = usePathname();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const queryClient = useQueryClient();
  const router = useCustomRouter();

  const { viewOnly } = useViewOnly();

  const {
    hasAnyUpdateAccess: canUpdateShariahCompliance,
  } = useShariahComplianceAccess();

  const { data: additionalInfoData } = useGetAdditionalInformation({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
  });

  const { control, watch, setValue, getValues } = useForm({
    defaultValues: {
      disclaimer: { label: '', value: '' },
    },
  });

  const disclaimerValue = watch('disclaimer');

  const { data: complyNotComplyOptions } = useGetParameterList('additionalInfoReviewDK', {
    label: 'value1',
    value: 'value2',
  });

  const complyNotComplyList = complyNotComplyOptions || [];

  useEffect(() => {
    if (additionalInfoData?.disclaimer && complyNotComplyList.length > 0) {
      const foundItem = complyNotComplyList.find(
        (item) => item.value === additionalInfoData.disclaimer
      );

      if (foundItem) {
        setValue('disclaimer', foundItem);
      }
    }
  }, [additionalInfoData, complyNotComplyList, setValue]);

  useEffect(() => {
    if (disclaimerValue?.value) {
      sessionStorage.setItem('summary-disclaimer', JSON.stringify(disclaimerValue));
    }
  }, [disclaimerValue]);

  useEffect(() => {
    const savedDisclaimer = sessionStorage.getItem('summary-disclaimer');
    if (savedDisclaimer && complyNotComplyList.length > 0) {
      try {
        const parsedDisclaimer = JSON.parse(savedDisclaimer);
        const isValidOption = complyNotComplyList.some(
          (item) => item.value === parsedDisclaimer.value
        );

        if (isValidOption) {
          setValue('disclaimer', parsedDisclaimer);
        }
      } catch (error) {
        console.error('Error parsing saved disclaimer:', error);
      }
    }
  }, [complyNotComplyList, setValue]);

  const handleChangeTab = (val: string) => {
    setActiveTab(val);
  };

  const { isPending: submitBucketSuccessPending, mutate: submitBucket } = useSubmitBucket(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba lagi', type: 'error' });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['bucket-list']});
        queryClient.invalidateQueries({ queryKey: ['bucket-stepper', { bucketProcessId: processId }]});
        sessionStorage.removeItem('summary-disclaimer');
        showNiceModalV2({
          onClose: () => {
            setTimeout(() => {
              setIsLoading(false);
              router.push(replacePath(KEPATUHAN_SYARIAH.BASE_PATH, {
                module: moduleIndex,
              }));
            }, 3000);

          }, title: 'Data berhasil di simpan', type: 'success',
        });
      },
    }
  );


  const handleEdit = () => {

    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onCancel: () => { closeNiceModal(MODAL.GLOBAL.CONFIRM); },
      onSubmit: () => {
        setIsLoading(true);
        submitBucket({
          submitRequestDto: {
            action: 'EDIT',
            bucketProcessId: processId,
            module: TypeModule.MIP_REVIEW,
            process: TypeProcess.REVIEWER_DK,
          },
        });
        closeNiceModal(MODAL.GLOBAL.CONFIRM);
        showNiceModalV2({ title: 'Data berhasil di simpan', type: 'success' });
      },
      title: 'Data sebelumnya akan dirubah dengan Penerbitan yang baru, apakah anda yakin?',
    });
  };
  const clearFormData = () => {
    sessionStorage.removeItem('summary-disclaimer');
  };


  return {
    activeTab,
    additionalInfoData,
    canUpdateShariahCompliance,
    clearFormData,
    complyNotComplyList,
    control,
    disclaimerValue,
    getValues,
    handleChangeTab,
    handleEdit,
    isEdit,
    isLoading,
    setIsEdit,
    setIsLoading,
    setValue,
    theme,
    viewOnly,
  };
};

export default useSummaryPage;
