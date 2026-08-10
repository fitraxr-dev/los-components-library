import { useMemo } from 'react';

import { usePathname } from 'next/navigation';

import { apuPpt } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import Modules from '@/enums/Modules';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetBusinessGroupList from '@/hooks/services/useGetBusinessGroupList';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useIdentity from '@/hooks/useIdentity';
import setPreviewPage from '@/hooks/useSetPreviewPage';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useApuPpt from '@/components/layouts/ApuPptLayout/ApuPpt.hook';

import useGetValidateResult from '../../../../hooks/services/useGetValidateResult';
import useGetSimiliarProcess from '../DebtorProfileInformationPage/hooks/useGetSimiliarProcess';


const useDebtorInformation = () => {
  const { processId } = useIdentity();
  const { process } = useApuPpt();
  const pathname = usePathname();
  const { goToNextStep, actions } = useApuPptContext();

  const isRequestPath = pathname.includes('/request/');

  const { data: debtorInfoData } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });


  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  const { data: bucketDetail, isLoading: bucketDetailIsLoading, isSuccess } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const { data: validateResult, isSuccess: isValidateSuccess } = useGetValidateResult({
    debtorId: bucketDetail?.debtorId,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });

  const { data: similiarProcessData, isLoading: isLoadingSimiliar, isSuccess: isSuccesSimi } = useGetSimiliarProcess({
    bucketProcessId: processId,
    debtorId: bucketDetail?.debtorId,
    module: TypeModule.APU_PPT,
    process: TypeProcess.APU_PPT_DPOP,
  }, {
    enabled: bucketDetail?.debtorId !== null,
  });


  const { data: jobPositionData } = useGetParameterList(Modules.JOB_POSITION);
  const { data: institutionTypeDropdownList } = useGetParameterList('institutionType');

  const { data: businessGroupListData, isLoading: businessGroupListLoading } = useGetBusinessGroupList({
    bucketProcessId: bucketDetail?.bucketParentId ? bucketDetail?.bucketParentId : processId,
    module: TypeModule.APU_PPT,
    process: process,
  });

  const businessGroupTableData = businessGroupListData?.map((data) => ({
    ...data,
    groupName: data.name ?? '-',
  }));

  const handleViewRequest = () => {
    const path = replacePath(apuPpt.REQUEST_DEBTOR_INFORMATION_PAGE, {
      processId: bucketDetail?.bucketParentId,
    });

    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };

  const handleLatest = () => {
    const path = replacePath(
      apuPpt.VERIFICATION_DEBTOR_INFORMATION_PAGE,
      {
        processId: similiarProcessData?.content?.bucketProcessId,
      });
    window.open(setPreviewPage(path), '_blank', 'noopener,noreferrer');
  };


  const isDpop = useMemo(() => {
    return (process === TypeProcess.APU_PPT_DPOP) ? true : false;
  }, [process]);

  const checkBtn = (similiarProcessData) => {
    let btn = [];
    if (!isRequestPath) {
      btn = [{
        disabled: false,
        iconName: 'show',
        isLoading: bucketDetailIsLoading,
        label: 'View Request',
        onClick: handleViewRequest,
      }];
    }
    if (isSuccesSimi && !!similiarProcessData?.content) {
      btn.push({
        color: isRequestPath ? 'primary' : 'info',
        disabled: !similiarProcessData?.content,
        iconName: 'show',
        isLoading: isLoadingSimiliar,
        label: 'View The Latest APU PPT / Pengkinian Data',
        onClick: handleLatest,
      });
    }

    return btn;
  };

  return {
    businessGroupListLoading,
    businessGroupTableData,
    checkBtn,
    debtorInfoData,
    goToNextStep,
    institutionTypeDropdownList,
    isPemda,
    isValidateSuccess,
    jobPositionData,
    process,
    processId,
    similiarProcessData,
    validateResult,
  };
};

export default useDebtorInformation;
