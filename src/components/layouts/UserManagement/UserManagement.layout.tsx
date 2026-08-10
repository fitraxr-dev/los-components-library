'use client';
import { useParams } from 'next/navigation';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { UserManagementProvider, useUserManagementContext } from './UserManagement.context';
import useUserManagement from './UserManagement.hook';


const UserManagementContent = ({ children }) => {
  const { id }: { id: string } = useParams();
  const isHasProcessId = id && (id.includes('UM-') || id.includes('AM-'));
  const { renderDetailLayout, handleBack, isCreationPage, _module, _process } = useUserManagement();

  const {
    bucketProcessIdForStepper,
    isUserDetailLoading,
    isDetailReady,
  } = useUserManagementContext();

  const stepperId = (!isCreationPage && bucketProcessIdForStepper && isDetailReady) ?
    bucketProcessIdForStepper : (isHasProcessId ? id : null);

  const shouldShowStepper = renderDetailLayout &&
    !((isUserDetailLoading && !bucketProcessIdForStepper && !isCreationPage) || !isDetailReady);

  return (
    <>
      {renderDetailLayout ? <BackButton handleClick={handleBack} /> : null}
      {isCreationPage
        ? children
        : (
          <BaseContainer>
            {
              shouldShowStepper && (
                <StepperV2
                  id={stepperId}
                  module={_module}
                  process={_process}
                />
              )
            }
            {children}
          </BaseContainer>
        )}
    </>
  );
};

const UserManagementLayout = ({ children }) => {
  return (
    <UserManagementProvider>
      <UserManagementContent>
        {children}
      </UserManagementContent>
    </UserManagementProvider>
  );
};

export default UserManagementLayout;
