import { useParams, usePathname } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
  DPOP_DIVISION,
} from '@/configs/constants';
import { apuPpt } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import setPreviewPage from '@/hooks/useSetPreviewPage';


const useApuPpt = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const params = useParams();
  const { processId } = useIdentity();
  const { divisionCode } = useDivision();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[3];
  const { redirectToFromPage } = useNavigationFromPage();
  const id = Number(params.id);

  const businessDivisionArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
    DPOP_DIVISION];
  const isBusinessDivision = businessDivisionArray?.includes(divisionCode);
  const isDpopDivision = divisionCode?.includes(DPOP_DIVISION);

  const ignoreBackButton = [
    apuPpt.REQUEST_LIST_PAGE,
    apuPpt.ASSIGNMENT_LIST_PAGE,
    apuPpt.MONITORING_LIST_PAGE,
    apuPpt.VERIFICATION_LIST_PAGE,
  ];

  const ignoreStepper = [
    ...ignoreBackButton,
    replacePath(apuPpt.REQUEST_DEBTOR_DOCUMENT_EDIT, { id, processId }),
    replacePath(apuPpt.ASSIGNMENT_DEBTOR_DOCUMENT_EDIT, { id, processId }),
    replacePath(apuPpt.MONITORING_DEBTOR_DOCUMENT_EDIT, { id, processId }),
    replacePath(apuPpt.VERIFICATION_DEBTOR_DOCUMENT_EDIT, { id, processId }),
    replacePath(apuPpt.REQUEST_BENEFICIAL_OWNER_EDIT, { id, processId }),
    replacePath(apuPpt.ASSIGNMENT_BENEFICIAL_OWNER_EDIT, { id, processId }),
    replacePath(apuPpt.MONITORING_BENEFICIAL_OWNER_EDIT, { id, processId }),
    replacePath(apuPpt.VERIFICATION_BENEFICIAL_OWNER_EDIT, { id, processId }),
    replacePath(apuPpt.REQUEST_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE, { id, processId }),
    replacePath(apuPpt.CUSTOMER_DUE_DILIGENCE_DETAIL_PAGE, { id, module: moduleIndex, processId }),
    replacePath(apuPpt.BENEFICIAL_OWNER_DETAIL, { id, module: moduleIndex, processId }),
    replacePath(apuPpt.DEBTOR_DOCUMENT_DETAIL, { id, module: moduleIndex, processId }),
    replacePath(apuPpt.ASSIGNMENT_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE, { id, processId }),
    replacePath(apuPpt.MONITORING_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE, { id, processId }),
    replacePath(apuPpt.VERIFICATION_CUSTOMER_DUE_DILIGENCE_EDIT_PAGE, { id, processId })

  ];

  const withStepper = !ignoreStepper.includes(path);
  const withBackButton = !ignoreBackButton.includes(path);

  let process: TypeProcess;
  const bucketPrefix = processId?.split('-')[0];

  if (bucketPrefix === 'AP') process = TypeProcess.APU_PPT;
  else if (bucketPrefix === 'APDP') process = TypeProcess.APU_PPT_DPOP;

  const handleBack = () => {
    if (redirectToFromPage()) return;
    if (path?.includes('edit') || path?.includes('detail')) return router.back();
    router.replace(replacePath(apuPpt.BASE_PATH, { module: moduleIndex }));
  };

  return {
    handleBack,
    process,
    withBackButton,
    withStepper,
  };
};

export default useApuPpt;
