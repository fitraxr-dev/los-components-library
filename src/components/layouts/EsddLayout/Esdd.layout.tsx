'use client';
import { usePathname } from 'next/navigation';

import { ESDD } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { ESDDProvider } from './Esdd.context';
import useEsdd from './Esdd.hooks';


const ESDDLayout = ({ children }) => {
  const path = usePathname();
  const router = useCustomRouter();
  const { renderDetailLayout } = useEsdd();
  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];

  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    const currentPathSubModule = path.split('/');

    if (redirectToFromPage()) return;

    if (currentPathSubModule.includes('corrective-action-plan') &&
      (currentPathSubModule.includes('add') || currentPathSubModule.includes('edit'))) {
      router.back();
    } else {
      router.push(replacePath(ESDD.BASE_PATH,
        {
          module: moduleIndex,
        }
      ));
    }
  };

  return (
    <ESDDProvider >
      {!matchesPathname(path, replacePath(ESDD.BASE_PATH, {
        module: moduleIndex,
      })) ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderDetailLayout ? (
          <>
            <StepperV2 module={TypeModule.MIP_REVIEW} process={TypeProcess.REVIEWER_DELST} />
          </>
        ) : null}
        {children}
      </BaseContainer>
    </ESDDProvider>
  );
};

export default ESDDLayout;
