import { useState, useMemo, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';


const useProposedFacilityDetailForm = () => {
  const [activeTab, setActiveTab] = useState('ChildLimit');
  const [isParentLimitSaved, setIsParentLimitSaved] = useState(false);
  const [hasChildData, setHasChildData] = useState(false);
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId, id } = useParams();
  const isEditPage = Boolean(id);
  const pathname = usePathname();
  const pathArray = pathname.split('/');
  const modul = pathname.split('/')[3];
  const isAdd = pathArray[7]?.includes('add');
  const [{ stepper }] = useApp();
  const isViewOnly = !stepper.steps
    .flatMap((step) => [step, ...(step.childrenSteps ?? [])])
    .find((step) => step.urlPath === 'facility-syariah')?.enable;

  useEffect(() => {
    handleSetBreadcrumb([
      {
        label: 'Facility Management',
        url: replacePath(maintenanceDebtor.FACILITY_SYARIAH_PAGE, {
          module: modul,
          processId: processId,
        }),
      },
      isAdd ? { label: 'Add Limit Induk Syariah', url: '' } : { label: 'ID ' + id + ' > Limit Induk Syariah', url: '' }
    ]);
  }, []);

  useEffect(() => {
    if (isAdd) {
      const savedFacilityId = sessionStorage.getItem('currentSyariahFacilityId');
      const savedLimitId = sessionStorage.getItem('currentSyariahLimitId');
      setIsParentLimitSaved(!!savedFacilityId && !!savedLimitId);
    } else {
      setIsParentLimitSaved(true);
    }
  }, [isAdd]);

  const TAB = useMemo(() => [
    {
      label: 'Child Limit',
      value: 'ChildLimit',
    },
    {
      disabled: !hasChildData,
      label: 'Parent Limit',
      value: 'ParentLimit',
    },
  ], [hasChildData]);

  const changeTabDirectly = (newValue: string) => {
    setActiveTab(newValue);
  };

  const changeTabWithValidation = (newValue: string) => {
    if (newValue !== activeTab) {
      NiceModal.show(MODAL.IS_DIRTY, {
        onSubmit: () => {
          setActiveTab(newValue);
        },
        title: 'Data belum tersimpan, apakah anda ingin menyimpan data ini dan berpindah ke tab lain?',
      });
    } else {
      setActiveTab(newValue);
    }
  };

  const handleChangeTab = (newValue: string, shouldValidate: boolean = false) => {

    if (shouldValidate) {
      changeTabWithValidation(newValue);
    } else {
      changeTabDirectly(newValue);
    }
  };

  const handleParentLimitSaved = () => {
    setIsParentLimitSaved(true);
  };

  return {
    TAB,
    activeTab,
    changeTabDirectly,
    changeTabWithValidation,
    handleChangeTab,
    handleParentLimitSaved,
    isEditPage,
    isParentLimitSaved,
    isViewOnly,
    modul,
    processId,
    setHasChildData,
  };
};

export default useProposedFacilityDetailForm;
