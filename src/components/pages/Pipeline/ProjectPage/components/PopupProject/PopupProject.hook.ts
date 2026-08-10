import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatCurrency } from '@/helpers/formatCurrency';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { formatNumber } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useSaveProject from '@/components/pages/Pipeline/ProjectPage/hooks/useSaveProject';

import useGetProjectById from '../../hooks/useGetProjectById';
import { modal } from '../../Project.constants';

import { INITIAL_VALUES } from './PopupProject.constants';

import type { PopupProjectHookProps, SubmitDataProps } from './PopupProject.types';


export const usePopupProject = (props: PopupProjectHookProps) => {
  const { id } = props;

  const { debtorId, processId } = useParams();
  const { recordActivity } = useRecordLog();
  const [projectDetail, setProjectDetail] = useState(INITIAL_VALUES);
  const [lastSavedPayload, setLastSavedPayload] = useState<any>(null);

  const { isPending: isSaveLoading, mutate } = useSaveProject({
    onError: (err) => {
      if (err.response.data.errorCode === '0304') {
        showNiceModalV2({
          title: err.response.data.errorDetail,
          type: 'error',
        });
      }
    },
    onSuccess: () => {
      // Record activity for saving/editing project
      const isEdit = !!id;
      recordActivity({
        activity: isEdit ? ActivityType.EDIT : ActivityType.CREATE,
        bucketProcessId: String(processId) || '',
        changeAfter: JSON.stringify({
          city: lastSavedPayload?.city,
          debtorId: lastSavedPayload?.debtorId,
          district: lastSavedPayload?.district,
          name: lastSavedPayload?.name,
          projectCode: lastSavedPayload?.projectCode,
          province: lastSavedPayload?.province,
          sector: lastSavedPayload?.sector,
          value: lastSavedPayload?.value,
        }),
        changeBefore: isEdit ? JSON.stringify({
          city: projectDetail?.city,
          district: projectDetail?.district,
          name: projectDetail?.projectName,
          projectCode: projectDetail?.projectCode,
          province: projectDetail?.province,
          sector: projectDetail?.sector,
          value: projectDetail?.value?.value,
        }) : '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: isEdit ? 'successfully edited project' : 'successfully created project',
      });

      closeNiceModal(modal.PROJECT_PAGE);
      showNiceModalV2({
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const { data, isSuccess } = useGetProjectById({
    projectCode: String(id),
  });

  useEffect(() => {
    if (data && isSuccess) {
      // Record activity for viewing project detail
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: String(processId) || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'pipeline',
        module: TypeModule.PIPELINE,
        process: TypeProcess.PIPELINE,
        remarks: `view project detail in form (projectCode: ${data.projectCode})`,
      });

      setProjectDetail({
        city: data.city,
        district: data.district,
        exchangeRate: {
          currency: data.curExchangeRate,
          value: data.exchangeRate,
        },
        projectCode: data.projectCode,
        projectName: data.name,
        province: data.province,
        sector: data.sector,
        value: {
          currency: data.curExchangeRate === 'IDR' ? 'USD' : 'IDR',
          value: data.value,
        },
        valueInIdr: {
          currency: data.curValueInIdr,
          value: data.valueInIdr,
        },
      });
    }
  }, [data, isSuccess, processId, recordActivity]);


  const handleSubmit = (data: SubmitDataProps) => {
    const isValueCurrencyIDR = data?.value?.currency === 'IDR';

    const payloadCurrencyUSD = {
      curExchangeRate: data.exchangeRate.currency,
      curValueInIdr: data.valueInIdr.currency,
      exchangeRate: data.exchangeRate.value,
      valueInIdr: formatCurrency(data?.valueInIdr.value, { maxDecimal: 2 }),
    };

    const payload = {
      bucketProcessId: Array.isArray(processId) ? processId[0] : processId,
      city: data.city !== '' ? data.city : null,
      curValue: data.value.currency,
      debtorId: String(debtorId),
      district: data.district !== '' ? data.district : null,
      module: TypeModule.PIPELINE,
      name: data.projectName.trim(),
      process: TypeProcess.PIPELINE,
      projectCode: data.projectCode,
      province: data.province !== '' ? data.province : null,
      sector: data.sector,
      value: formatNumber(data.value.value),
      ...(!isValueCurrencyIDR ? payloadCurrencyUSD : {}),
    };

    setLastSavedPayload(payload);
    mutate(payload);
  };

  return {
    handleSubmit,
    isSaveLoading,
    projectDetail,
  };
};
