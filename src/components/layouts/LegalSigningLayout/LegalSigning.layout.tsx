'use client';


import { usePathname } from 'next/navigation';

import { legalSigning } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import StepperV2 from '@/components/shared/StepperV2';

import BackButton from '../../shared/BackButton';
import BaseContainer from '../../shared/BaseContainer';

import { LegalSigningProvider } from './LegalSigning.context';
import useLegalSigning from './LegalSigning.hook';


const LegalSigningLayout = ({ children }) => {
  const router = useCustomRouter();
  const path = usePathname();

  const { redirectToFromPage } = useNavigationFromPage();
  const { renderDetailLayout, renderBackBtn } = useLegalSigning();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    const modulePath = path.split('/')[3];
    const pathDetail = getLastPath(legalSigning.PK_PROCESSING_DETAIL_PAGE);
    if (path?.includes(pathDetail)) return router.back();
    router.replace(replacePath(
      legalSigning.BASE_PATH,
      {
        module: modulePath,
      }
    ));
  };
  return (
    <LegalSigningProvider>
      {
        renderBackBtn && <BackButton handleClick={handleBack} />
      }
      <BaseContainer>
        {
          renderDetailLayout ?
            <>
              <StepperV2 module={TypeModule.ENGAGEMENT_AGREEMENT} process={TypeProcess.LEGAL_SIGNING} />
            </> : null
        }
        {children}
      </BaseContainer>
    </LegalSigningProvider>
  );
};

export default LegalSigningLayout;
