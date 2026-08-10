'use client';

import { Box, useTheme } from '@mui/material';
import { FormProvider } from 'react-hook-form';

import BaseContainer from '@/components/shared/BaseContainer';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TabCurrentAccess from './components/TabCurrentAccess/TabCurrentAccess';
import TabEditAccess from './components/TabEditAccess';
import TabUserAccess from './components/TabUserAccess';
import { tab } from './EditAccess.constants';
import useEditAccess from './EditAccess.hook';


const EditAccessPage = () => {
  const theme = useTheme();
  const { forms, activeTab, tabList, handleChangeTab } = useEditAccess();


  return (
    <FormProvider {...forms}>
      <BaseContainer>
        <Tabs items={tabList} onChange={handleChangeTab} activeTab={activeTab} />
        <Box width="100%" sx={{ marginTop: theme.spacing(3) }}>
          <TabItem activeValue={activeTab} value={tab.edit}>
            <TabEditAccess />
          </TabItem>
          <TabItem activeValue={activeTab} value={tab.currentAccess}>
            <TabCurrentAccess />
          </TabItem>
          <TabItem activeValue={activeTab} value={tab.userAccess}>
            <TabUserAccess />
          </TabItem>
        </Box>
      </BaseContainer>
    </FormProvider>
  );
};

export default EditAccessPage;
