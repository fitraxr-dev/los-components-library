import { usePathname, useParams } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DP_2_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_2_DIVISION,
  DPPU_3_DIVISION,
} from '@/configs/constants';
import { loanProcessingSummary } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  loanProcessingSummary.BUCKET_LPS_BAST_PAGE,
];

const useLpsLayoutBast = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { divisionCode } = useDivision();
  const [{ currentRole }] = useApp();
  const isMaker = currentRole.includes('MAKER');
  const isChecker = currentRole.includes('CHECKER');
  const isSuperAdmin = isMaker || isChecker;
  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DP_2_DIVISION,
    DPB_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION];
  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);
  const { redirectToFromPage } = useNavigationFromPage();
  const params = useParams();
  const bucketProcessId = params?.processId as string;
  const isLpsbd = bucketProcessId?.toUpperCase().includes('LPSBD');

  const additionalBackBtn = [
    loanProcessingSummary.BUCKET_LPS_BAST_PAGE,
  ];


  function handleBack() {
    if (redirectToFromPage()) return;
    router.replace(loanProcessingSummary.BUCKET_LPS_BAST_PAGE);
  };

  const additionalIgnorePath = [
    ...ignorePath
  ];

  const renderDetailLayout = additionalIgnorePath.includes(path);
  const isBackBtn = !additionalBackBtn.includes(path);


  return {
    bucketProcessId,
    handleBack,
    isBackBtn,
    isDivisiBisnis,
    isLpsbd,
    isSuperAdmin,
    renderDetailLayout,
  };
};

export default useLpsLayoutBast;
