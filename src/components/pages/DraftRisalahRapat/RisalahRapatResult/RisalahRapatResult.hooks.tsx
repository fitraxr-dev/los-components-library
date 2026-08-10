import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material/styles';
import { useParams, usePathname } from 'next/navigation';


import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getCookie } from '@/helpers/cookie';
import { replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';


import useGetCollaborationDivisions from './hooks/useGetCollaborationDivisions';
import useGetUserCollaboration from './hooks/useGetUserCollaboration';
import { MODAL, divisions as DIVISIONS, TABLE_HEADER_CONSTANT } from './RisalahRapatResult.contants';


const useRisalahRapatResult = () => {

  const [divisions, setDivisions] = useState([]);
  const { processId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const path = usePathname();
  const params = useParams();
  const router = useCustomRouter();
  const [userIsRegistered, setUserIsRegistered] = useState(undefined);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const segments: string[] = path.split('/');

  const isDivisiAvailable = divisions.length === 0;

  const { data: DIVISIONS } = useGetParameterList('divisionUserCollaboration', {
    disabled: false,
    label: 'value1',
    value: 'key',
  });
  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const currentStatus = debtorInfoData.status;

  const { data: listDivision, isSuccess: getCollaborationDiviisonSuccess } = useGetCollaborationDivisions({
    bucketProcessId: processId,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  const getDataDivisions = listDivision.listDivision;


  const { data: assignmentParameter } = useGetParameterList('assignmentUserCollaboration', {
    key: 'key',
    label: 'value1',
  });

  const handleDivisiModal = (mode: 'Add' | 'Edit') => {
    NiceModal.show(MODAL.SET_DIVISION, { mode });
  };

  const handleLembarPersetujuan = () => {
    NiceModal.show(MODAL.CONSENT_SHEET);
  };

  const handlePreviewPersetujuan = () => {
    router.push(replacePath(risalahRapat.PREVIEW_ACKNOWLEDGEMENT_SHEET, {
      module: segments[3],
      processId: params.processId,
    }));
  };

  useEffect(() => {
    const filteredDivisions = DIVISIONS.filter((division) =>
      getDataDivisions?.includes(division.value)
    );
    const data = filteredDivisions.map((division) => {
      return { title: division.label, value: division.value };
    });
    setDivisions(data);
  }, [getCollaborationDiviisonSuccess, getDataDivisions]);

  const handleCheckUser = (data: any) => {
    if (data !== undefined) {
      setIsConfirmed(data.confirmed);
      setUserIsRegistered(data);
    } else if (data === undefined) {
      setUserIsRegistered(undefined);
      setIsConfirmed(false);
    }
  };


  return {
    DIVISIONS,
    assignmentParameter,
    currentStatus,
    divisions,
    handleCheckUser,
    handleDivisiModal,
    handleLembarPersetujuan,
    handlePreviewPersetujuan,
    isConfirmed,
    isDivisiAvailable,
    processId,
    userIsRegistered,
    viewOnly,
  };

};

export default useRisalahRapatResult;
