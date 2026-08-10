'use client';
import { usePathname } from 'next/navigation';

import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { KepatuhanSyariahProvider } from './KepatuhanSyariah.context';
import useKepatuhanSyariah from './KepatuhanSyariah.hooks';


const KepatuhanSyariahLayout = ({ children }) => {
  const path = usePathname();
  const { renderDetailLayout, handleBack } = useKepatuhanSyariah();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];


  return (
    <KepatuhanSyariahProvider>
      {matchesPathname(path, replacePath(KEPATUHAN_SYARIAH.BASE_PATH, {
        module: moduleIndex,
      })) ? null : <BackButton handleClick={handleBack} />}
      <BaseContainer>
        {
          !renderDetailLayout ? (
            <>
              <StepperV2
                process={TypeProcess.REVIEWER_DK}
                module={TypeModule.MIP_REVIEW}
              />
            </>
          ) : null
        }
        {children}
      </BaseContainer>
    </KepatuhanSyariahProvider>
  );
};

export default KepatuhanSyariahLayout;
