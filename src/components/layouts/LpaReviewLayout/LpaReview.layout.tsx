'use client';
import { usePathname } from 'next/navigation';

import { lpaRequestReview, lpaReview } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';
import useSessionStorage from '@/hooks/useSessionStorage';

import useGetCurrentModule from '@/components/pages/Review/LpaReview/hooks/useGetCurrentModule';
import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { LpaReviewProvider } from './LpaReview.context';
import useLpaReview from './LpaReview.hooks';


const LpaReviewLayout = ({ children }) => {
  const { module, process } = useGetCurrentModule();
  const path = usePathname();
  const router = useCustomRouter();
  const { renderDetailLayout } = useLpaReview();
  const pathArray = path.split('/');
  const lpaType = pathArray[3];
  const moduleIndex = pathArray[4];
  const isDetailInformationLPA = path.includes('detail-lpa-information');
  const { redirectToFromPage } = useNavigationFromPage();
  const [value, setValue] = useSessionStorage('lpa-review', null);

  function handleBack() {
    if (redirectToFromPage()) return;
    if (isDetailInformationLPA) {
      router.back();
    } else {
      try {
        const url = new URL(window.location.href);
        const returnParam = url.searchParams.get('return');
        if (returnParam && returnParam !== path) {
          router.push(decodeURIComponent(returnParam));
          setValue(null);
          return;
        }
      } catch (_e) {
      }

      if (value === null) {
        router.push(replacePath('/loan-processing/review/[lpa]/[module]', {
          lpa: lpaType,
          module: moduleIndex,
        }));
      } else {
        router.push(value);
      }
    }
    setValue(null);
  };

  const listMatch = [
    lpaReview.ASSIGNMENT,
    lpaReview.MONITORING,
    lpaReview.REQUEST,
    lpaRequestReview.BUCKET_LIST,
    lpaRequestReview.MONITORING
  ];

  return (
    <LpaReviewProvider>
      {listMatch.includes(path) ? null : <BackButton handleClick={handleBack} />}
      <BaseContainer>
        {
          !renderDetailLayout ? (
            <>
              <StepperV2
                process={process}
                module={module}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </LpaReviewProvider>
  );
};

export default LpaReviewLayout;
