import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CANCELED, DECLINE, ONE_MINUTE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime, toYearStringNumber } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
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


import { payloadFilterList } from '../ManagementShareholder/ManagementShareholder.constants';

import { TableHeaderList } from './GroupInformation.constant';
import useGetGroupInformationData from './hooks/useGetGroupInformationData';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useGroupInformation = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const pathname = usePathname();
  const methods = useForm();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer group information page',
    });
  }, []);

  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();

  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  const isDebtor = processId?.includes('DEBT');

  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchByDebtorGroup', { label: 'value1', value: 'value2' });

  // Dropdown data
  const { data: sectorDropdownList } = useGetParameterList('sector', { label: 'value1', value: 'value2' });

  const { data: sortDropdownListAPI = []} = useGetParameterList('sortByDebtorGroup', { label: 'value1', value: 'value2' });

  const { data: groupTypeDropdownList } = useGetParameterList('groupType');

  const smiDropdownList = [
    { label: 'Ya', value: true },
    { label: 'Tidak', value: false },
  ];

  const SORT_KEY_MAP_MAIN: Record<string, string> = {
    GROUP_NAME: 'name',
    ID: 'groupCode',
    SECTOR: 'sector',
  };

  const mapSortKeyMain = (raw?: string) => {
    if (!raw) return '';
    return SORT_KEY_MAP_MAIN[raw.toUpperCase()] ?? raw;
  };

  const sortListPayload = filter?.sortList
    ? {
      columnName: mapSortKeyMain(filter.sortList.columnName),
      sortType: filter.sortList.sortType ?? 'ASC',
    }
    : {};

  const { data, isFetching: isLoading } = useGetGroupInformationData({
    filter: payloadFilterList(processId, filter),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: sortListPayload,
  }, {
    staleTime: ONE_MINUTE,
  });

  const dataAsOfDate = formatDateTime(data?.data?.additionalData?.lastUpdate) ?? '-';

  const filterDropdownList = searchByOptions;

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortDropdownListAPI,
      type: 'sort',
    },
    {
      endKey: 'endDate',
      label: 'Periode Last Modified',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'groupType',
      label: 'Jenis Group',
      options: groupTypeDropdownList,
      type: 'multiple-autocomplete',
    },
    {
      key: 'isRelatedSmi',
      label: 'Terkait dengan SMI',
      options: smiDropdownList,
      type: 'dropdown',
    },
    {
      key: 'sector',
      label: 'Sektor Industri',
      options: sectorDropdownList,
      type: 'multiple-autocomplete',
    }
  ];

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Group Information', url: '' },
    ]);
  }, []);

  const tableHeaderList: Array<TableHeader> = [
    ...TableHeaderList,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail', onClick: (data) => {
            gotoDetailPage(data?.groupCode);
          },
        },
      ],
      sx: {
        // minWidth: '4vw',
      },
      type: 'action',
    },
  ];

  // Action Button
  const [{ stepper, currentRole }] = useApp();
  // const pathname = usePathname();
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
    data,
    dataAsOfDate,
    debtorData,
    filter,
    filterContentList,
    filterDropdownList,
    // isDirty,
    handleClose,

    handleOpenSubmitModal,

    isDebtor,

    isLoading,

    isSubmitLoading,

    isViewOnly,

    methods,

    page,

    pageSize,

    setFilter,

    setPage,

    setPageSize,
    tableHeaderList,
    theme,
  };
};

export default useGroupInformation;
