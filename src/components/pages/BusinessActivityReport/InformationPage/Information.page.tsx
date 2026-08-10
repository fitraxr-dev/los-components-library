'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { FormProvider } from 'react-hook-form';

import { DEFAULT_STEPS_BAR } from '@/components/layouts/BusinessActivityReportLayout/BusinessActivityReport.constant';
import useBarInformation from '@/components/pages/BusinessActivityReport/InformationPage/Information.hook';
import Stepper from '@/components/shared/Stepper';
import Tabs, { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';

import { modal as MODAL, TAB_ITEMS, tab } from '../InformationPage/Information.constant';

import BusinessCallInformation from './components/BusinessCallInformation/BusinessCallInformation';
import ModalExistingUser from './components/BusinessCallInformation/component/ModalExistingUser/ModalExistingUser';
import FollowUp from './components/FollowUp/FollowUp';


const InformationPage = () => {
  const { activeTab, handleChangeTab, methods, isNew } = useBarInformation();
  return (
    <>
      {/* {isNew ? <Stepper
        steps={DEFAULT_STEPS_BAR}
        onClick={(path) => null}
      /> : null} */}
      <Title title="Information" />
      <Tabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} />
      <FormProvider {...methods} >
        <TabItem activeValue={activeTab} value={tab.BUSINESSCALLINFORMATION}>
          <BusinessCallInformation handleChangeTab={() => handleChangeTab(tab.FOLLOWUP)} />
        </TabItem>

        <TabItem activeValue={activeTab} value={tab.FOLLOWUP}>
          <FollowUp />
        </TabItem>
      </FormProvider>
      <ModalDef
        id={MODAL.EXISTING_USER}
        component={ModalExistingUser}
      />
    </>
  );
};

export default InformationPage;
