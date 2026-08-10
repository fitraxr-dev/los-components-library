'use client';
import { useEffect } from 'react';

import { useParams, usePathname } from 'next/navigation';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import useApp from './useApp';


const useIdentity = () => {
  const path = usePathname();
  const [appState, dispatch] = useApp();
  const { processId: processIdParams }: { processId: string } = useParams();


  if (!appState.identity) {
    localStorage.clear();
    location.reload();
  }

  useEffect(() => {
    if (processIdParams) {
      const bucketMasterIdList = ['DEPI', 'DELS', 'DK', 'DH'];
      const bucketPrefix = processIdParams.split('-')[0];
      const currentPath = path.split('/')[3];
      const mipPath = currentPath === 'mip';

      if (mipPath && bucketMasterIdList.includes(bucketPrefix)) {
        setProcessId(appState.identity.parentId);
      } else {
        setProcessId(processIdParams);
      }
    } else {
      setProcessId(null);
    }
  }, [processIdParams]);

  function setDebtorName(debiturName: string) {
    dispatch({
      data: debiturName,
      type: reducer.SET_DEBTOR_NAME,
    });
  }

  function setAnalystId(analystId: string) {
    dispatch({
      data: analystId,
      type: reducer.SET_ANALYST_ID,
    });
  }

  function setChildId(childId: string) {
    dispatch({
      data: childId,
      type: reducer.SET_CHILD_ID,
    });
  }

  function setDebtorId(debtorId: string) {
    dispatch({
      data: debtorId,
      type: reducer.SET_DEBTOR_ID,
    });
  }

  function setFacilityId(facilityId: string) {
    dispatch({
      data: facilityId,
      type: reducer.SET_FACILITY_ID,
    });
  }

  function setProcessId(processId: string) {
    dispatch({
      data: processId,
      type: reducer.SET_PROCESS_ID,
    });
  }


  const {
    analystId,
    childId,
    debiturName,
    debtorId,
    facilityId,
    parentId,
    processId,
  } = appState.identity;

  const bucketProcessId = appState.stepper.steps[0]?.bucketProcessId || '';

  const viewOnly = appState.viewOnly;

  const identity = appState.identity;
  const userData = appState.userData;

  return {
    analystId,
    bucketProcessId,
    childId,
    debiturName,
    debtorId,
    facilityId,
    identity,
    parentId,
    processId,
    setAnalystId,
    setChildId,
    setDebtorId,
    setDebtorName,
    setFacilityId,
    setProcessId,
    userData,
  };
};

export default useIdentity;
