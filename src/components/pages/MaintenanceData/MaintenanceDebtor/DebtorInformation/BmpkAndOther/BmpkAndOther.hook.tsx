import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateToUtc } from '@/helpers/date';
import { replacePath, getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useRecordLog from '@/hooks/useRecordLog';
import useSessionStorage from '@/hooks/useSessionStorage';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import TextStyle from '@/components/shared/TextStyle';

import useGetIndividualDetail from './hooks/useGetIndividualDetail';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useBmpkAndOther = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const router = useCustomRouter();
  const params = useParams();
  const { processId } = params;
  const isDebtor = processId?.includes('DEBT');
  const { control, handleSubmit, watch, setValue } = useForm({
    mode: 'onChange',
  });
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer bmpk and other page',
    });
  }, []);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useSessionStorage('filter-detail-bmppmonitoring-individual', null);

  const searchByOptions = useGetParameterList('searchByIndividualMonitoring2', { label: 'value1', value: 'value2' });
  const sortByOptions = useGetParameterList('sortByIndividualMonitoring2', { label: 'value1', value: 'value2' });

  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  const { data: debtorInfoData } = useGetBucketById({
    bucketProcessId: String(processId),
    module: TypeModule.MAINTENANCE_DATA,
    process: TypeProcess.MAINTENANCE_CUSTOMER,
  });

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Customer Information', url: replacePath(maintenanceDebtor.CUSTOMER_INFORMATION_BMPP_MONITORING, {
        module: pathname.split('/')[3],
        processId: processId,
      }) },
      { label: 'BMPK/BMPD/BMPP Individual', url: '' }
    ]);
  }, []);

  const { data: individualDetailListData, isLoading } = useGetIndividualDetail({
    filter: {
      ...filter?.filter,
      debtorId: isDebtor ? processId : debtorInfoData?.debtorId,
      lastResult: filter?.filter?.lastResult === 'yes' ? true : filter?.filter?.lastResult === 'no' ? false : null,
    },
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? { key: '', value: '' },
    sortList: filter?.sortList ?? undefined,
  }, !!debtorInfoData);

  const tableHeaderBmpk: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        maxWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'description',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
    },
    {
      key: 'percentage',
      label: 'Persentase',
      render(row) {
        return (
          <TextStyle variant="body4">
            {`${row?.percentage}% of ${row?.percentageThreshold}%`}
          </TextStyle>
        );
      },
    },
    {
      key: 'lastModified',
      label: 'Data as of',
      type: 'date',
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (row) => {handleViewDetail(row);},
        },
      ],
      sx: { minWidth: '10vw' },
      type: 'action',
    }
  ];

  const mockData = [
    {
      calculationId: '80ee1599-1415-4e38-9c72-1933ac79fc4b',
      description: 'Tidak melampui',
      lastModified: '12 Juni 2025',
      percentage: '20',
      percentageThreshold: '50',
      processId: 'DEBT-00751',
    }
  ];

  const tableDataBmpk = individualDetailListData?.contents;
  const lastUpdateDate = individualDetailListData?.additionalData?.lastUpdate;
  const totalData = individualDetailListData?.page;

  const dataAsOfDate = useMemo(() => {
    return lastUpdateDate ? `${formatDateToUtc(new Date(lastUpdateDate), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [lastUpdateDate]);

  const handleViewDetail = (data) => {
    router.push(
      replacePath(
        maintenanceDebtor.CUSTOMER_INFORMATION_BMPP_MONITORING,
        {
          calculationId: data?.calculationId,
          module: isDebtor ? 'master' : 'maintenance',
          processId: isDebtor ? processId : debtorInfoData?.debtorId,
        }
      )
    );
  };

  const filterDropdownList = searchByOptions.data;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions.data,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Data as of',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'lastResult',
      label: 'Melampaui BMPK/BMPD/BMPP Individual',
      options: [
        { label: 'Ya', value: 'yes' },
        { label: 'Tidak', value: 'no' }
      ],
      type: 'dropdown',
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
      router.push(
        maintenanceDebtor.LIST_PAGE
      );
    },
  });

  const handleBackToListPage = () => {
    router.replace(maintenanceDebtor.LIST_PAGE);
  };

  return {
    actions,
    control,
    dataAsOfDate,
    debtorData,
    filter,
    filterContentList,
    filterDropdownList,
    handleBackToListPage,
    handleClose,
    handleOpenSubmitModal,
    handleSubmit,
    isDebtor,
    isLoading,
    isSubmitLoading,
    isViewOnly,
    page,
    setFilter,
    setPage,
    setPageSize,
    tableDataBmpk,
    tableHeaderBmpk,
    totalData,
  };
};

export default useBmpkAndOther;
