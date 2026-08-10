'use client';

import BaseContainer from '@/components/shared/BaseContainer';

import BreadCrumb from './components/BreadCrumb/BreadCrumb';
import CustomNavMenu from './components/CustomNavMenu';
import { ReassignmentSkuProvider } from './Reassignment.context';
import useReassignment from './Reassignment.hooks';


const ReassignmentContent = ({ children }) => {
  const { isActionPage, isListPage } = useReassignment();
  return (
    <>
      {!isListPage && <BreadCrumb />}
      <BaseContainer>
        {isActionPage && <CustomNavMenu />}
        {children}
      </BaseContainer>
    </>
  );
};

const ReassignmentLayout = ({ children }) => {
  return (
    <ReassignmentSkuProvider>
      <ReassignmentContent>{children}</ReassignmentContent>
    </ReassignmentSkuProvider>
  );
};

export default ReassignmentLayout;
