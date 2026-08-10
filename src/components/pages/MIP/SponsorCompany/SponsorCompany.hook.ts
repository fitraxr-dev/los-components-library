import { useContext, useState } from 'react';

import { useParams } from 'next/navigation';

import { roles } from '@/configs/constants';
import { DirtyContext } from '@/contexts/DirtyContext';
import { TypePosition } from '@/enums/Position';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';

import useGetSponsorCompanyAnalysis from './hooks/useGetSponsorCompanyAnalysis';
import useGetSponsorCompanyOverviewById from './hooks/useGetSponsorCompanyOverview';
import useSaveSponsorCompanyAnalysis from './hooks/useSaveSponsorCompanyAnalysis';
import useSaveSponsorCompanyOverview from './hooks/useSaveSponsorCompanyOverview';


export const useSponsorCompany = () => {
  const [{ currentPosition }] = useApp();
  const { processId } = useParams();
  const { dirtyMsg, setDirtyMsg } = useContext(DirtyContext);
  const [state] = useApp();
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  const [shouldGoNext, setShouldGoNext] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const isStaff = currentPosition?.includes(TypePosition.RM);
  const isAnalyst = currentPosition?.includes(TypePosition.ANALYST);

  const handleChangeTab = (val: number) => {
    if (!!dirtyMsg) {
      const isConfirmed = window.confirm('Apakah Anda yakin ingin meninggalkan halaman ini? Perubahan yang Anda buat tidak akan disimpan.');
      if (isConfirmed) {
        setActiveTab(val);
        setDirtyMsg(undefined);
      }
    } else {
      setActiveTab(val);
    }
  };

  const {
    data: overviewDetail,
    isFetching: isFetchOverviewLoading,
  } = useGetSponsorCompanyOverviewById(
    {
      bucketProcessId: processId as string,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    { enabled: activeTab === 0 && !!state.pages.mipModule && !!state.pages.mipProcess }
  );

  const {
    data: analysisDetail,
    isFetching: isFetchAnalysisLoading,
  } = useGetSponsorCompanyAnalysis(
    {
      bucketProcessId: processId as string,
      module: state.pages.mipModule,
      process: state.pages.mipProcess,
    },
    { enabled: activeTab === 1 && !!state.pages.mipModule && !!state.pages.mipProcess }
  );

  const { isPending: isSaveOverviewLoading, mutate: saveOverview } = useSaveSponsorCompanyOverview({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? setActiveTab(1) : null, type: 'success' });
    },
  });

  const { isPending: isSaveAnalysisLoading, mutate: saveAnalysis } = useSaveSponsorCompanyAnalysis({
    onSuccess: () => {
      // Reset dirty state
      setDirtyMsg(undefined);

      // Show modal
      showNiceModalV2({ onClose: () => shouldGoNext ? goToNextStep() : null, type: 'success' });
    },
  });

  const handleSaveOverview = (blob: Blob) => {
    if (viewOnly || !isStaff) {
      setActiveTab(1);
    } else {
      saveOverview({
        bucketProcessId: processId as string,
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  const handleSaveAnalysis = (blob: Blob) => {
    if (viewOnly || !isAnalyst) {
      goToNextStep();
    } else {
      saveAnalysis({
        bucketProcessId: processId as string,
        description: blob,
        module: state.pages.mipModule,
        process: state.pages.mipProcess,
      });
    }
  };

  return {
    activeTab,
    analysisDetail,
    handleChangeTab,
    handleSaveAnalysis,
    handleSaveOverview,
    isAnalyst,
    isFetchAnalysisLoading,
    isFetchOverviewLoading,
    isSaveAnalysisLoading,
    isSaveOverviewLoading,
    isStaff,
    overviewDetail,
    setActiveTab,
    setShouldGoNext,
  };
};
