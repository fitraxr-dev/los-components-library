'use client';

import { useState } from 'react';

import {
  roles,
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DTI_DIVISION,
} from '@/configs/constants';
import { TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useSaveBucketDetail from '@/hooks/services/useSaveBucketDetail';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { useSpfpBucketContext, useSpfpContext } from '@/components/layouts/SPFPLayout/SPFP.context';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import WordEditor from '@/components/shared/WordEditor';

import { action } from '../../VerificationSheet.constants';

import { useBusiness } from './Business.hook';


const useBusinessPage = (props) => {
  const bucket = useSpfpBucketContext();
  const { goToNextStep } = useSpfpContext();
  const [state] = useApp();
  const { viewOnly } = useViewOnly();
  const [container, setContainer] = useState(null);
  const { data: dataBucket } = useGetBucketById({ ...bucket });

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    DTI_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];
  const businessData = props?.data?.length ? props?.data?.find((e) => businessDivisionArray?.includes(e.division)) : {};
  const isBusiness = (state.userData.user as any)?.accessManagementActive?.userDivision?.divisionCode &&
    businessDivisionArray?.includes((state.userData.user as any).accessManagementActive.userDivision.divisionCode);
  const isMaker = state.currentRole.includes(roles.MAKER);
  const isChecker = state.currentRole.includes(roles.CHECKER);
  const isTaskForce = state.currentPosition.includes('TASK_FORCE');
  const isDti = isTaskForce || isMaker || isChecker;
  const isSPFP = bucket?.process === TypeProcess.SPFP;

  const {
    buttons,
    isSaveLoading,
    setShouldGoNext,
    handleSave,
    handleOpenSubmitModal,
    handleDecline,
    isActionNull,
    isAutoSaveFetching,
    isEnableSubmitAskForInfo,
    isSubmitBusinessVerifLoading,
    stepper,
  } = useBusiness(container);

  const isTl = state.currentRole.includes(roles.TL);
  const isRm = state.currentRole.includes(roles.RM);
  const isKadiv = state.currentRole.includes(roles.KADIV);
  const isProgressCompleted = stepper?.progress === 100;

  const { mutate: mutateSaveSubmission } = useSaveBucketDetail({
    onError: () => {
      showNiceModalV2({
        title: 'Terjadi kesalahan, Mohon di coba kembali',
        type: 'error',
      });
    },
  });

  return (
    <>
      <TableDebtorInformation
        {...bucket}
      />
      <RowWrapper sx={{ mt: 3 }}>
        <WordEditor
          isReadOnly={(!isBusiness && (!isDti)) || viewOnly || (isDti && !isSPFP)}
          container={container}
          setContainer={setContainer}
          isLoading={isSaveLoading || props?.isLoading}
          initialValue={businessData?.description}
          onSave={(blob) => {
            setShouldGoNext(false);
            handleSave(blob);
          }}
        />
      </RowWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 4, py: 3 }}>
        {viewOnly && (
          <Button
            sx={{ mr: 2 }}
            onClick={() => {
              setShouldGoNext(true);
              goToNextStep();
            }}
          >
            Next
          </Button>
        )}
        {
          (isRm || isTl || isKadiv || (isDti)) ? (
            <>
              {(buttons[action.CANCELED] || buttons[action.REJECTED]) &&
                <Button
                  isLoading={isSubmitBusinessVerifLoading}
                  sx={{ mr: 2 }}
                  onClick={handleDecline}
                  variant="outlined"
                  color="error"
                  disabled={viewOnly}
                >
                  Decline
                </Button>
              }
            </>
          ) : null
        }
        {(isBusiness || (isDti)) && !viewOnly && (
          <>
            {(buttons[action.SAVE]) &&
              <Button
                isLoading={isSaveLoading || props?.isLoading}
                sx={{ mr: 2 }}
                disabled={viewOnly || isAutoSaveFetching}
                onClick={() => {
                  setShouldGoNext(false);
                  convertToDocx(container).then((blob) => {
                    const values = props?.formMethods?.getValues?.() || {};
                    mutateSaveSubmission({
                      ...dataBucket,
                      remarks: values.remark,
                      typeFinancing: dataBucket?.financeType,
                      typeSubmission: values.submissionType,
                      ...bucket,
                    }, {
                      onSuccess: () => handleSave(blob),
                    });
                  });
                }}
              >
                {isAutoSaveFetching ? 'Auto Saving...' : 'Save'}
              </Button>
            }
            {buttons[action.SAVE_NEXT] && (
              <Button
                isLoading={isSaveLoading || props?.isLoading}
                sx={{ mr: 2 }}
                disabled={viewOnly}
                onClick={() => {
                  setShouldGoNext(true);
                  convertToDocx(container).then((blob) => {
                    const values = props?.formMethods?.getValues?.() || {};
                    mutateSaveSubmission({
                      ...dataBucket,
                      remarks: values.remark,
                      typeFinancing: dataBucket?.financeType,
                      typeSubmission: values.submissionType,
                      ...bucket,
                    }, {
                      onSuccess: () => {
                        handleSave(blob);
                      },
                    });
                  });
                }}
              >
                Next
              </Button>
            )}
          </>
        )}
        {
          isTl || isKadiv || isChecker ? (
            <>
              {buttons[action.RETURN_TO_MAKER] &&
                <Button
                  isLoading={isSubmitBusinessVerifLoading}
                  sx={{ mr: 2 }}
                  onClick={() => handleOpenSubmitModal({ action: action.RETURN_TO_MAKER })}
                  disabled={viewOnly}
                >
                  Return To Maker
                </Button>
              }
            </>
          ) : null
        }
        {
          isTl || isKadiv || isDti ? (
            <>
              {buttons[action.RETURN_STAFF] &&
                <Button
                  isLoading={isSubmitBusinessVerifLoading}
                  sx={{ mr: 2 }}
                  onClick={() => handleOpenSubmitModal({ action: action.RETURN_STAFF })}
                  disabled={viewOnly}
                >
                  Return To Staff
                </Button>
              }
            </>
          ) : null
        }

        {
          isKadiv || isChecker ? (
            <>
              {buttons[action.KADIV_TO_TL] &&
                <Button
                  color="info"
                  isLoading={isSubmitBusinessVerifLoading}
                  sx={{ mr: 2 }}
                  onClick={() => handleOpenSubmitModal({ action: action.KADIV_TO_TL })}
                  disabled={viewOnly}
                >
                  Return To TL
                </Button>
              }
            </>
          ) : null
        }
        {buttons[action.SUBMIT] &&
          <Button
            color="success"
            isLoading={isSubmitBusinessVerifLoading}
            onClick={() => handleOpenSubmitModal({ action: action.SUBMIT })}
            disabled={
              viewOnly ||
              !props?.data?.length ||
              !isProgressCompleted ||
              (isBusiness && !isEnableSubmitAskForInfo)
            }
          >
            {(isKadiv || isChecker) ? 'Approve' : 'Submit'}
          </Button>
        }
      </RowWrapper>

    </>
  );
};

export default useBusinessPage;
