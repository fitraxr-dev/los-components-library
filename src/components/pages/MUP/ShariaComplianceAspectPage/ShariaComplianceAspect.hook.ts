import { useContext, useEffect, useState } from 'react';

import { useQueryClient } from '@tanstack/react-query';

import { DirtyContext } from '@/contexts/DirtyContext';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import { useMUPAccess } from '../hooks/useMUPAccess';


const useShariaComplianceAspect = () => {
  const { processId } = useIdentity();
  const [activeTab, setActiveTab] = useState('internal');
  const { baseMUPAccess } = useMUPAccess();
  const { recordActivity } = useRecordLog();
  const goToNextStep = useGoToNextStep();
  const queryClient = useQueryClient();
  const { setDirtyMsg } = useContext(DirtyContext);
  const canView = baseMUPAccess.canView;
  const { viewOnly } = useViewOnly();

  const tab = {
    EXTERNAL: 'external',
    INTERNAL: 'internal',
  };

  const tabItems = [
    {
      label: 'Internal Concern',
      value: tab.INTERNAL,
    },
    {
      label: 'External Concern',
      value: tab.EXTERNAL,
    }
  ];

  useEffect(() => {
    if (!baseMUPAccess.canView) {
      return;
    }

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `view Sharia Compliance Aspect page - initial tab: ${activeTab}`,
    });
  }, [baseMUPAccess.canView, processId, recordActivity, activeTab]);

  const handleChangeTab = (tabValue: string) => {
    const selectedTab = tabItems.find((item) => item.value === tabValue);
    const tabLabel = selectedTab?.label || tabValue;

    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: tabValue,
      changeBefore: activeTab,
      module: TypeModule.MUP,
      process: TypeProcess.MUP,
      remarks: `navigate to Sharia Compliance tab: ${tabLabel}`,
    });

    setActiveTab(tabValue);
  };

  const handleNext = () => {
    if (activeTab === tab.INTERNAL) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: tab.EXTERNAL,
        changeBefore: tab.INTERNAL,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'Moving from Internal Concern tab to External Concern tab',
      });
      setActiveTab(tab.EXTERNAL);
    } else {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: tab.EXTERNAL,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
        remarks: 'Completed Sharia Compliance Aspect and moving to next step',
      });
      setDirtyMsg(undefined);
      goToNextStep();
      queryClient.invalidateQueries({ queryKey: ['bucket-stepper', {
        bucketProcessId: processId,
        module: TypeModule.MUP,
        process: TypeProcess.MUP,
      }]});
    }
  };

  return {
    activeTab,
    canView,
    handleChangeTab,
    handleNext,
    processId,
    tab,
    tabItems,
    viewOnly,
  };
};

export default useShariaComplianceAspect;
