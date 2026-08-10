import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import useGetRatingManagement from './hooks/useGetRatingManagement';
import { TableHeaderList } from './RatingManagement.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useRatingManagement = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });

  const pathname = usePathname();

  const { processId } = useIdentity();
  const router = useCustomRouter();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const isDebtor = processId?.includes('DEBT');
  const { recordActivity } = useRecordLog();
  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  const { data: searchByOptions } = useGetParameterList('searchByDebtorRating', { label: 'value1', value: 'value2' });

  const { data: sortByOptions } = useGetParameterList('sortByDebtorRating');

  const divisionOptions = useGetParameterList('division');

  const ratingTypeOptions = useGetParameterList('ratingType', { label: 'value1', value: 'key' });
  const ratingResultOptions = useGetParameterList('rating', { label: 'value1', value: 'key' });

  const { data: ratingManagementData } = useGetRatingManagement({
    filter: payloadFilterList(processId, filter),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  const filterDropdownList = searchByOptions;


  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Tanggal Rating Memo',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'periode',
      label: 'Rating Period',
      type: 'year',
    },
    {
      key: 'division',
      label: 'Division',
      options: divisionOptions?.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'ratingType',
      label: 'Rating Type',
      options: ratingTypeOptions?.data,
      type: 'multiple-autocomplete',
    },
    {
      key: 'ratingResult',
      label: 'Rating Result',
      options: ratingResultOptions?.data,
      type: 'multiple-autocomplete',
    },
  ];

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer rating management page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'Rating Management', url: '' }
    ]);
  }, []);

  const tableHeader: TableHeader[] = [
    ...TableHeaderList
  ];

  // Action Button
  const [{ stepper, currentRole }] = useApp();
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
      recordActivity({
        activity: ActivityType.SUBMIT,
        bucketProcessId: processId,
        menuCode: 'maintenance-customer',
        module: TypeModule.MAINTENANCE_DATA,
        process: TypeProcess.MAINTENANCE_CUSTOMER,
        remarks: 'submit maintenance customer',
      });

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
    filter,
    filterContentList,
    filterDropdownList,
    handleBackToListPage,
    handleClose,
    handleOpenSubmitModal,
    handleSubmit,
    isDebtor,
    isSubmitLoading,
    isViewOnly,
    page,
    pageSize,
    pathname,
    ratingManagementData,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useRatingManagement;
