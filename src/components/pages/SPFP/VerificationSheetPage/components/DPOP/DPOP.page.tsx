import { useState } from 'react';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  roles,
} from '@/configs/constants';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { convertToDocx } from '@/helpers/synfusion';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import WordEditor from '@/components/shared/WordEditor';

import { useDPOP } from './DPOP.hook';


const useDPOPPage = (props) => {
  const bucket = useSpfpBucketContext();
  const { goToNextStep } = useSpfpContext();
  const [state] = useApp();
  const { stepper } = state;
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);

  const isDpop = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode?.includes('DPOP');
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isDti = isTaskForce || isMaker || isChecker;
  const isSPFPDpop = bucket?.process === TypeProcess.SPDP;

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];

  const isBusiness = (state.userData?.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);

  const {
    dpopData,
    // isFetching,
    isAutoSaveFetching,
    isSaveLoading,
    setShouldGoNext,
    handleSave,
  } = useDPOP(props, container);

  return (
    <>
      <TableDebtorInformation
        {...bucket}
      />
      <RowWrapper sx={{ mt: 3 }}>
        <WordEditor
          isReadOnly={viewOnly || (!isDpop && ((isDti && !isSPFPDpop) || isBusiness)) || stepper.from === 'DPOP_STAFF_ASSIGNMENT' || stepper.from === 'SPFP_FINAL'}
          container={container}
          setContainer={setContainer}
          isLoading={isSaveLoading || props?.isLoading}
          initialValue={dpopData?.description}
          onSave={(blob) => {
            setShouldGoNext(false);
            handleSave(blob);
          }}
        />
      </RowWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 4, py: 3 }}>
        {(viewOnly || ((isDpop || isDti) && stepper.from !== 'DPOP_STAFF_ASSIGNMENT' && stepper.from !== 'SPFP_FINAL')) && (
          <>
            <Button
              disabled={isAutoSaveFetching}
              isLoading={isSaveLoading || props?.isLoading}
              sx={{ mr: 2 }}
              onClick={() => {
                if (viewOnly) {
                  setShouldGoNext(true);
                  goToNextStep();
                } else {
                  convertToDocx(container).then(handleSave);
                }
              }}
            >
              {isAutoSaveFetching ? 'Auto Saving...' : viewOnly ? 'Next' : 'Save'}
            </Button>
            {!viewOnly && (
              <Button
                isLoading={isSaveLoading || props?.isLoading}
                sx={{ mr: 2 }}
                onClick={() => {
                  if (viewOnly) {
                    setShouldGoNext(true);
                    goToNextStep();
                  } else {
                    setShouldGoNext(true);
                    convertToDocx(container).then(handleSave);
                  }
                }}
              >
                Next
              </Button>
            )}
          </>
        )}

      </RowWrapper >
    </>
  );
};

export default useDPOPPage;
