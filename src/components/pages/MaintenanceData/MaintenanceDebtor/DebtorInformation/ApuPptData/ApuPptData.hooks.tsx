import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { useForm, useFormContext } from 'react-hook-form';


import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import TextStyle from '@/components/shared/TextStyle';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import useGetApuPptData from './hooks/useGetApuPpt';
import useGetPenerapanCDD from './hooks/useGetPenerapanCDD';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useApuPptData = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { control, handleSubmit, watch, setValue, reset } = useForm({
    mode: 'onChange',
  });
  const { processId } = useIdentity();
  const router = useCustomRouter();
  const isDebtor = processId?.includes('DEBT');
  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  const { recordActivity } = useRecordLog();

  const [filter, setFilter] = useState<SearchValue>({});

  const { data: penerapanCddData } = useGetPenerapanCDD(
    {
      filter: {
        ...payloadFilterList(processId, filter),
      },
      page: {
        itemPerPage: 10,
        noPage: 1,
      },
      searchDetail: filter?.searchDetail ?? {},
      sortList: {
        columnName: 'modifiedDate',
        sortType: 'desc',
      },
    }
  );

  const { data: apuPptData } = useGetApuPptData(payloadFilterList(processId));

  useEffect(() => {
    reset(apuPptData?.content);
  }, [apuPptData]);

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer apu ppt data page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'APUPPT Data', url: '' }
    ]);
  }, []);

  const tableHeaderCddImplementation: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '1vw',
      },
      type: 'index',
    },
    {
      key: 'cddImplementation',
      label: 'Penerapan CDD',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'lastUpdate',
      label: 'Status Penerapan CDD Date',
      render: (value: string) => (
        <TextStyle variant="body4">
          {formatDateTime(value.lastUpdate ?? '')}
        </TextStyle>
      ),
    },
  ];

  const mockTableDataCddImplementation = [
    {
      cddImplementation: 'EDD',
      cddImplementationStatusDate: '25 Februari 2025 16:36:26',
    },
    {
      cddImplementation: 'CDD Sederhana',
      cddImplementationStatusDate: '25 Januari 2025 16:36:26',
    },
  ];

  // Action Button
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const [actions, setActions] = useState(null);

  useEffect(() => {
    for (const step of stepper.steps) {
      if ('childrenSteps' in step) {
        if (step.childrenSteps) {
          if (step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname))) {
            const actions = step.childrenSteps.find((children) => children.urlPath === getLastPath(pathname));
            setActions(actions);
            break;
          }
        }
        else {
          if (step.urlPath === getLastPath(pathname)) {
            const actions = step;
            setActions(actions);
            break;
          }
        }
      }
    }
  }, [stepper]);

  const handleClose = () => {
    router.back();
  };

  const handleOpenSubmitModal = ({ action }: {action: string}) => {
    if (action === DECLINE) {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment, radioValue }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          submitBucket({
            submitRequestDto: {
              action: radioValue,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
        },
        radioLabel: 'Declined',
        radioOptions: [
          { label: 'Canceled', value: CANCELED },
          { label: 'Rejected', value: REJECTED }
        ],
      });
    } else {
      NiceModal.show(MODAL.GLOBAL.COMMENT, {
        onSave: ({ comment }) => {
          submitBucket({
            submitRequestDto: {
              action,
              bucketProcessId: String(processId),
              comment,
              module: TypeModule.MAINTENANCE_DATA,
              process: TypeProcess.MAINTENANCE_CUSTOMER,
            },
          });
          closeNiceModal(MODAL.GLOBAL.COMMENT);
        },
      });
    }
  };

  const { mutate: submitBucket, isPending: isSubmitLoading } = useSubmitBucket({
    onError: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      closeNiceModal(MODAL.GLOBAL.COMMENT);
      showNiceModalV2({
        onClose: handleBackToListPage,
        title: 'Data berhasil disimpan',
        type: 'success',
      });
    },
  });

  const handleBackToListPage = () => {
    router.replace(maintenanceDebtor.LIST_PAGE);
  };


  return {
    actions,
    control,
    debtorData,
    handleClose,
    handleOpenSubmitModal,
    handleSubmit,
    isDebtor,
    isSubmitLoading,
    isViewOnly,
    penerapanCddData: penerapanCddData?.data,
    tableHeaderCddImplementation,
    watch,
  };
};

export default useApuPptData;
