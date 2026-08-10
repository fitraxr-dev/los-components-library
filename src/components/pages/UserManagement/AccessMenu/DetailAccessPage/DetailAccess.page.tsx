'use client';
import { useTheme } from '@mui/material';

import { useUserManagementContext } from '@/components/layouts/UserManagement/UserManagement.context';
import RowWrapper from '@/components/shared/RowWrapper';
import Tabs, { TabItem } from '@/components/shared/Tabs';

import TabAccessMenu from './components/TabAccessMenu';
import TabUserAccess from './components/TabUserAccess';
import { tab, tabList } from './DetailAccess.constants';
import useDetailAccessMenu from './DetailAccess.hook';


const DetailAccessMenuPage = () => {
  const { activeTab, handleChangeTab, renderActionButtons } = useDetailAccessMenu();
  const theme = useTheme();
  const { actions, isWait } = useUserManagementContext();

  return (
    <>
      <RowWrapper mt={3} justifyContent="start">
        <Tabs
          items={tabList}
          activeTab={activeTab}
          onChange={(val: string) => handleChangeTab(val)}
        />
      </RowWrapper>
      <TabItem activeValue={activeTab} value={tab.accessMenu}>
        <TabAccessMenu />
      </TabItem>
      <TabItem activeValue={activeTab} value={tab.userAccess}>
        <TabUserAccess />
      </TabItem>
      {isWait ? (
        <RowWrapper mt={3} justifyContent="end" gap={theme.spacing(3)}>
          {renderActionButtons()}
        </RowWrapper>) : (<></>)
      }

    </>
  );
};

export default DetailAccessMenuPage;
