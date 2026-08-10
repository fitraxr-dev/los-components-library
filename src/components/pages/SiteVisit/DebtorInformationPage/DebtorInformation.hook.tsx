import { useEffect, useState } from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useIdentity from '@/hooks/useIdentity';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

// Using inline type to avoid import issues
type DebtorInformationRequestSave = {
  bucketProcessId: string;
  debtor: {
    analystId: any;
    contactPerson: string;
    isAffiliate: boolean;
    positionId: string;
    relationshipSince: string;
    sectorName: string;
    typeFinancing: string;
    typeProcess: string;
    typeProposal: string;
    yearFounded: string;
  };
  description: string;
  group: any[];
};


const useDebtorInformation = () => {
  const { processId } = useIdentity();

  const { data: debtorInfoData, refetch: refetchDebtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: TypeModule.SITE_VISIT,
    process: TypeProcess.SITE_VISIT,
  });

  // Refetch data when component mounts or when switching tabs
  useEffect(() => {
    if (processId) {
      refetchDebtorInfo();
    }
  }, [processId, refetchDebtorInfo]);

  // Additional refetch when document becomes visible (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && processId) {
        refetchDebtorInfo();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [processId, refetchDebtorInfo]);

  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum)
    .includes(debtorInfoData?.institutionType);

  const [payload, setPayload] = useState<DebtorInformationRequestSave>({
    bucketProcessId: processId,
    debtor: {
      analystId: null,
      contactPerson: '',
      isAffiliate: true,
      positionId: '',
      relationshipSince: '',
      sectorName: '',
      typeFinancing: '',
      typeProcess: '',
      typeProposal: '',
      yearFounded: '',
    },
    description: '',
    group: [],
  });

  useEffect(() => {
    if (debtorInfoData) {
      const newPayload = structuredClone(payload);
      newPayload.bucketProcessId = processId;
      newPayload.description = debtorInfoData.description;
      newPayload.debtor.analystId = debtorInfoData.analystId;
      newPayload.debtor.typeFinancing = debtorInfoData.typeFinancing;
      newPayload.debtor.typeProposal = (debtorInfoData as any).typeProposal || '';
      newPayload.debtor.typeProcess = debtorInfoData.typeProcess;
      newPayload.debtor.yearFounded = debtorInfoData.yearFounded;
      newPayload.debtor.sectorName = debtorInfoData.sectorName;
      newPayload.debtor.relationshipSince = debtorInfoData.relationshipSince;
      newPayload.debtor.contactPerson = debtorInfoData.contactPerson;
      newPayload.debtor.positionId = debtorInfoData.positionId;
      setPayload(newPayload);
    }
  }, [debtorInfoData]);

  function selectn(objStr: string, val: any) {
    const newPayload = structuredClone(payload);
    eval(`newPayload.${objStr} = val`);
    setPayload(newPayload);
  }

  const changePayload = {
    analystId: (val: any) => selectn('debtor.analystId', val),
    contactPerson: (val: any) => selectn('debtor.contactPerson', val),
    description: (val: any) => selectn('description', val),
    group: (val: any) => selectn('group', val),
    isAffiliate: (val: any) => selectn('debtor.isAffiliate', val),
    positionId: (val: any) => selectn('debtor.positionId', val),
    relationshipSince: (val: any) => selectn('debtor.relationshipSince', val),
    sectorName: (val: any) => selectn('debtor.sectorName', val),
    typeFinancing: (val: any) => selectn('debtor.typeFinancing', val),
    typeProcess: (val: any) => selectn('debtor.typeProcess', val),
    typeProposal: (val: any) => selectn('debtor.typeProposal', val),
    yearFounded: (val: any) => selectn('debtor.yearFounded', val),
  };

  return {
    changePayload,
    isPemda,
    payload,
    setPayload,
  };
};


export default useDebtorInformation;
