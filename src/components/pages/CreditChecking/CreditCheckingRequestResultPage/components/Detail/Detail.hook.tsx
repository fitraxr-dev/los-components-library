import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import dayjs from 'dayjs';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { creditChecking } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, matchesPathname, replacePath } from '@/helpers/navigation';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useViewOnly from '@/hooks/useViewOnly';

import { useCreditCheckingContext } from '@/components/layouts/CreditCheckingLayout/CreditChecking.context';
import Input from '@/components/shared/Input';

import useCreditCheckingRequestResult from '../../CreditCheckingRequestResult.hook';

import type { DetailProps } from './Detail.types';


const useDetailRequest = ({ form, onChange }: DetailProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const { processId } = useParams();
  const { viewOnly } = useViewOnly();
  const { isDpop, isStaff, stepper } = useCreditCheckingContext();

  const { data: typeSubmissionData } = useGetParameterList('typeSubmission');
  const { data: requestPurposeRaw } = useGetParameterList('requestPurpose');
  const { data: checkThroughData } = useGetParameterList('checkThrough');
  const { data: popUp } = useGetParameterList('ccPopUpNeedUrgent');
  const isSummary = stepper?.from?.includes('SUMMARY');
  const newCreditCheckingRequestPath = replacePath(creditChecking.DETAIL_REQUEST_PAGE, { processId });
  const newCreditCheckingDocumentVerif = replacePath(creditChecking.BUCKET_DOCUMENT_VERIFICATION_PAGE, { processId });
  const isRequestMode = matchesPathname(pathname, newCreditCheckingRequestPath);
  const isVerifMode = matchesPathname(pathname, newCreditCheckingDocumentVerif) && stepper.from === 'ASK_FOR_INFO' && isDpop && isStaff;
  const isVerificationMode = getLastPath(pathname) === 'document-verification';

  const {
    changeBgInput,
    findDataMaster,
    getDataLabel,
    needCheckMaster,
  } = useCreditCheckingRequestResult();

  const {
    data: bucketDetail,
  } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.CREDIT_CHECKING,
    process: isRequestMode ? TypeProcess.CREDIT_CHECKING : TypeProcess.CREDIT_CHECKING_RESULT,
  });

  const { otherRequestPurpose, requestPurpose } = form;

  const requestPurposeData = requestPurposeRaw.map((item, index) => {
    const isOthers = item.value === 'OTHERS';
    const placeRight = isOthers || index >= 3;
    const isOthersChecked = requestPurpose?.value?.includes('OTHERS');

    return {
      additionalCheckboxSx: {
        gridColumn: placeRight ? '2 / 3' : '1 / 2',
        ...(item.value === 'AUDIT_IMPLEMENTATION' && { mt: `-${theme.spacing(7)}` }),
      },
      label: item.label,
      renderAdditionalContent: isOthers && isOthersChecked
        ? () => (
          <Input
            placeholder="Input"
            disabled={viewOnly || !isRequestMode}
            value={otherRequestPurpose?.value || ''}
            onChange={(val) => onChange('otherRequestPurpose', val)}
            containerSx={{
              gridColumn: '2 / 3',
              ml: 1.5,
            }}
          />
        )
        : undefined,
      value: item.value,
    };
  });

  const [hasShownUrgencyWarning, setHasShownUrgencyWarning] = useState(false);

  const handleShowUrgencyWarning = () => {

    NiceModal.show(MODAL.GLOBAL.WARNING, {
      cancelText: 'Close',
      title: (
        <>
          <p>
            {popUp[0].label}
          </p>
        </>
      ),
    });
  };

  return {
    bucketDetail,
    changeBgInput,
    checkThroughData,
    findDataMaster,
    getDataLabel,
    handleShowUrgencyWarning,
    hasShownUrgencyWarning,
    isRequestMode,
    isSummary,
    isVerifMode,
    isVerificationMode,
    needCheckMaster,
    requestPurposeData,
    typeSubmissionData,
  };
};

export default useDetailRequest;
