'use client';
import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import Stepper from '@/components/shared/Stepper';
import StepperV2 from '@/components/shared/StepperV2';
import StepperV3 from '@/components/shared/StepperV3';


import { DEFAULT_STEPS_VA } from './VirtualAccount.constant';
import { VirtualAccountProvider } from './VirtualAccount.context';
import UseVirtualAccount from './VirtualAccount.hook';


const VirtualAccountLayout = ({ children }) => {
  const { renderDetailLayout, handleBack, debtorIdFromProcess, bucketProcessId } = UseVirtualAccount();
  const router = useCustomRouter();
  const params = useParams();

  function handleClick(path: string) {
    const newPath = replacePath(path, { processId: params.processId });
    router.push(newPath);
  };

  return (
    <VirtualAccountProvider>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {renderDetailLayout ? (
          <>
            {/* <Stepper
              steps={DEFAULT_STEPS_VA}
              onClick={(path) => handleClick(path)}

            /> */}
            <StepperV2
              id={bucketProcessId === 'VA-ID' ? null : bucketProcessId}
              module={TypeModule.VA_CREATION}
              process={TypeProcess.VA_CREATION}
            />
          </>
        ) : null}
        {children}
      </BaseContainer>
    </VirtualAccountProvider>
  );
};

export default VirtualAccountLayout;
