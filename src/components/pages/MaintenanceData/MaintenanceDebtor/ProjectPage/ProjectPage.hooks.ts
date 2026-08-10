import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { CANCELED, DECLINE, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { getLastPath, replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetDetailMasterDebtor from '@/hooks/services/useGetDetailMasterDebtor';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useGetProjectList from '@/hooks/services/useGetProjectList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../ManagementShareholder/ManagementShareholder.constants';

import useGetProjectInformation from './hooks/useGetProjectInformation';
import { TableHeaderList } from './ProjectPage.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useProjectPage = () => {
  const methods = useForm();
  // const { data } = useGetProjectList();
  const theme = useTheme();
  const router = useCustomRouter();
  const pathname = usePathname();
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();

  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const isDebtor = processId?.includes('DEBT');

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer project page',
    });
  }, []);

  //TODO: Implement The Object received to the form
  const { data: debtorData } = useGetDetailMasterDebtor({ debtorId: String(processId) }, { enabled: isDebtor });
  // --- PARAMETER ---

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchMaintenanceProject', { label: 'value1', value: 'value2' });

  // Sort By data
  const { data: sortByOptions } = useGetParameterList('sortByProject2', { label: 'value1', value: 'value2' });

  // Currency List
  const { data: currencyOptions } = useGetParameterList('currency');

  // Currency List
  const { data: sectorOptions } = useGetParameterList('sector');

  const filterDropdownList = searchByOptions;

  const { data: dataProject } = useGetProjectInformation({
    filter: payloadFilterList(processId as string, filter),
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  const dateAsOf = formatDateTime(dataProject?.data?.additionalData?.lastUpdate) ?? '-';

  const mockOptions = [
    { label: '-', value: '-' },
    { label: '-', value: '-' }
  ];

  const filterContentList = [
    {
      key: 'sortList',
      label: 'Urutkan Berdasarkan',
      options: sortByOptions,
      type: 'sort',
    },
    {
      key: 'currencies',
      label: 'Currency',
      options: currencyOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'sectors',
      label: 'Sektor yang dibiayai',
      options: sectorOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'area', // tidak terpakai
      label: 'Area', // tidak terpakai
      type: 'area-proyek',
    },
  ];

  const gotoDetailPage = (id: string) => {
    router.push(replacePath(`${pathname}/${id}`, { processId }));
  };

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Project', url: '' },
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
            gotoDetailPage(data?.id);
            // router.push(replacePath(
            //   maintenanceDebtor.PROJECT_DETAIL_PAGE,
            //   {
            //     debtorId,
            //     id: data.projectId,
            //     module: moduleIndex,
            //   },
            // ));
          },
        },
        // {
        //   iconName: 'edit', onClick: (data) => {},
        // },
        // {
        //   iconName: 'delete', onClick: (data) => {},
        // },
        // {
        //   iconName: 'preview-document', onClick: (data) => {},
        // },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    },
  ];

  // Action Button
  const [{ stepper, currentRole }] = useApp();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const isTL = currentRole.includes('TL');
  const isKadiv = currentRole.includes('KADIV');
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

  // handle save
  // const handleSave = () => {
  //   const payload = getValues('apuPptData');
  //   mutate({
  //     ...payload,
  //   });
  // };

  // ApiSubmit
  // const { mutate, isPending } = useSaveApuPpt({
  //   onError: () => {
  //     showNiceModalV2({
  //       title: 'Error',
  //       message: 'Failed to save data',
  //     });
  //   },
  // });

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
    dataProject,
    dateAsOf,
    debtorData,
    filter,
    filterContentList,
    filterDropdownList,
    // isDirty,
    handleClose,

    handleOpenSubmitModal,
    isDebtor,

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

export default useProjectPage;
