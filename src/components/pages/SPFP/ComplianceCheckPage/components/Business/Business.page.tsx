'use client';

import React, { useState } from 'react';

import {
  roles,
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  DP_2_DIVISION,
  DPPU_2_DIVISION,
  DTI_DIVISION,
} from '@/configs/constants';
import { TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import WordEditor from '@/components/shared/WordEditor';

import { action } from '../../../VerificationSheetPage/VerificationSheet.constants';

import { useBusiness } from './Business.hook';


const useBusinessPage = (props) => {
  const bucket = useSpfpBucketContext();
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { data: dataBucket } = useGetBucketById({ ...bucket });
  const { activeTab = 0, onSaveExternal, saveType = 'response' } = props;

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
    DTI_DIVISION
  ];

  const isBusiness = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);

  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isDti = isTaskForce || isMaker || isChecker;
  const isSPFP = bucket?.process === TypeProcess.SPFP;

  // If isBusiness and activeTab is 0 (Bisnis), enable fields
  // Otherwise, disable fields

  const isBusinessTabActive = activeTab === 0;
  const shouldDisable = !isBusiness || !isBusinessTabActive || viewOnly || (isDti && !isSPFP);

  const {
    isSaveLoading,
    handleSave,
  } = useBusiness();

  // Expose handleSave and container to parent via callback
  React.useEffect(() => {
    if (onSaveExternal) {
      onSaveExternal({
        container,
        handleSave: (blob) => handleSave(blob, saveType),
      });
    }
  }, [container, handleSave, onSaveExternal, saveType]);

  const isTl = state.currentRole.includes(roles.TL);
  const isRm = state.currentRole.includes(roles.RM);
  const isKadiv = state.currentRole.includes(roles.KADIV);

  const { mutate: mutateSaveSubmission } = useSaveBucketDetail({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
  });

  return (

    <RowWrapper sx={{ mt: 3 }}>
      <WordEditor
        id={props?.id}
        isReadOnly={shouldDisable}
        container={container}
        setContainer={setContainer}
        isLoading={isSaveLoading || props?.isLoading}
        initialValue={props?.data}
        isLandscape={props?.isLandscape}
        onSave={(blob) => {
          handleSave(blob, saveType);
        }}
      />
    </RowWrapper>
  );
};

export default useBusinessPage;
