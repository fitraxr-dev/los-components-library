import React from 'react';

import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';

import BusinessGroupSection from '@/components/shared/SmiSection/DebtorInformation/BusinessGroupSection';

import useBusinessGroup from './BusinessGroup.hook';


const BusinessGroup = () => {
  const [state] = useApp();
  const path = usePathname();
  const lastPath = getLastPath(path);
  const currentStep = state?.stepper?.steps?.find((step) => step?.key === lastPath);
  const isCurrentStepEnable = currentStep?.enable;

  const {
    bucketBusinessGroup,
    businessGroupListContents,
    businessGroupListLoading,
    businessGroupListPage,
    itemPerPage,
    noPage,
    setItemPerPage,
    setNoPage,
    handleDeleteGroupBusiness,
    handleOpenAddModal,
    tableHeader,
  } = useBusinessGroup();

  return (
    <BusinessGroupSection
      handleOpenAddModal={handleOpenAddModal}
      noPage={noPage}
      itemPerPage={itemPerPage}
      tableHeader={tableHeader}
      tableData={businessGroupListContents}
      tablePage={businessGroupListPage}
      tableLoading={businessGroupListLoading}
      setItemPerPage={setItemPerPage}
      setNoPage={setNoPage}
      handleDeleteGroupBusiness={handleDeleteGroupBusiness}
      businessGroupDropdownData={bucketBusinessGroup}
      hasTableFooter={isCurrentStepEnable}
    />
  );
};

export default BusinessGroup;
