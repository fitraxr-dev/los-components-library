import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';


import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
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
import { GenericBucketRequestDtoMaintenanceConclusionFilterRequest } from '@/services/openapi/master-service';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import TextStyle from '@/components/shared/TextStyle';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';

import useGetDatabaseKepatuhan from './hooks/useGetDatabaseKepatuhan';
import useGetHighriskData from './hooks/useGetHighriskData';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useInternalAssessment = () => {
  const { processId } = useIdentity();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useCustomRouter();
  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });
  const { recordActivity } = useRecordLog();
  const isDebtor = processId?.includes('DEBT');
  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer internal assessment page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: '' },
      { label: 'Internal Assessment', url: '' }
    ]);
  }, []);

  const [filterHighrisk, setFilterHighrisk] = useState<SearchValue>({});
  const [pageHighrisk, setPageHighrisk] = useState(1);
  const [pageSizeHighrisk, setPageSizeHighrisk] = useState(5);

  const { data: highriskData } = useGetHighriskData({
    filter: payloadFilterList(processId, filterHighrisk),
    page: {
      itemPerPage: pageSizeHighrisk,
      noPage: pageHighrisk,
    },
    searchDetail: filterHighrisk?.searchDetail ?? {},
    sortList: filterHighrisk?.sortList ?? {},
  });

  const sortByOptions = useGetParameterList('sortCustomerHighRisk', {
    label: 'value1',
    value: 'value2',
  });

  const searchByOptionsHighRisk = useGetParameterList('searchCustomerHighRisk', {
    label: 'value1',
    value: 'value2',
  });

  const contentListHighRisk = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Status High Risk Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'summaryHighRisk',
      label: 'High Risk',
      options: [
        {
          label: 'Yes',
          value: true,
        },
        {
          label: 'No',
          value: false,
        },
      ],
      type: 'radio',
    },
  ];

  const tableHeaderHighRisk: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '1vw',
      },
      type: 'index',
    },
    {
      key: 'summaryHighRisk',
      label: 'High Risk (Y/N)',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center">
          {row.summaryHighRisk ? 'Yes' : 'No'}
        </TextStyle>
      ),
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'modifiedDate',
      label: 'Status High Risk Date',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center">
          {row.modifiedDate ? formatDateTime(row.modifiedDate) : '-'}
        </TextStyle>
      ),
    },
  ];

  const searchByOptionsDatabaseKepatuhan = useGetParameterList('searchCustomerDK', {
    label: 'value1',
    value: 'value2',
  });

  const sortByOptionsDatabaseKepatuhan = useGetParameterList('searchCustomerDK', {
    label: 'value1',
    value: 'value2',
  });

  const contentListDatabaseKepatuhan = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptionsDatabaseKepatuhan.data,
      type: 'sort',
    },
    {
      key: 'summary',
      label: 'Database Kepatuhan (Y/N)',
      options: [
        {
          label: 'Yes',
          value: 'true',
        },
        {
          label: 'No',
          value: 'false',
        },
      ],
      type: 'multiple-autocomplete',
    },
    {
      endKey: 'endDate',
      label: 'Status Database Kepatuhan Date',
      startKey: 'startDate',
      type: 'period',
    },
  ];

  const [filterDatabaseKepatuhan, setFilterDatabaseKepatuhan] = useState<SearchValue>({});
  const [pageDatabaseKepatuhan, setPageDatabaseKepatuhan] = useState(1);
  const [pageSizeDatabaseKepatuhan, setPageSizeDatabaseKepatuhan] = useState(5);

  const { data: databaseKepatuhanData } = useGetDatabaseKepatuhan({
    filter: payloadFilterList(processId, filterDatabaseKepatuhan),
    page: {
      itemPerPage: pageSizeDatabaseKepatuhan,
      noPage: pageDatabaseKepatuhan,
    },
    searchDetail: filterDatabaseKepatuhan?.searchDetail ?? {},
    sortList: filterDatabaseKepatuhan?.sortList ?? {},
  });

  const tableHeaderKepatuhan: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '1vw',
      },
      type: 'index',
    },
    {
      key: 'summary',
      label: 'Database Kepatuhan (Y/N)',
      sx: {
        minWidth: '16vw',
      },
    },
    {
      key: 'createdDate',
      label: 'Status Database Kepatuhan Date',
      render: (row) => (
        <TextStyle variant="body4" textAlign="center">
          {row.createdDate ? formatDateTime(row.createdDate) : '-'}
        </TextStyle>
      ),
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
    contentListDatabaseKepatuhan,
    contentListHighRisk,
    control,
    databaseKepatuhanData,
    debtorData,
    filterDatabaseKepatuhan,
    filterHighrisk,
    handleBackToListPage,
    handleClose,
    handleOpenSubmitModal,
    handleSubmit,
    highriskData,
    isDebtor,
    isSubmitLoading,
    isViewOnly,
    pageDatabaseKepatuhan,
    pageHighrisk,
    pageSizeDatabaseKepatuhan,
    pageSizeHighrisk,
    searchByOptionsDatabaseKepatuhan,
    searchByOptionsHighRisk,
    setFilterDatabaseKepatuhan,
    setFilterHighrisk,
    setPageDatabaseKepatuhan,
    setPageHighrisk,
    setPageSizeDatabaseKepatuhan,
    setPageSizeHighrisk,
    sortByOptionsDatabaseKepatuhan,
    tableHeaderHighRisk,
    tableHeaderKepatuhan,
  };

};

export default useInternalAssessment;
