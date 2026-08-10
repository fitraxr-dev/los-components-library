import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';
import router from 'next/router';

import { DECLINE, CANCELED, REJECTED } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';
import { modal } from '../Documentation.constants';
import useGetDocument from '../hooks/useGetDocument';

import { tableHeaderList } from './DigitalMemo.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDigitalMemo = () => {
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const { processId } = useIdentity();
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer digital memo page',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'Document', url: '' },
      { label: 'Digital Memo', url: '' }
    ]);
  }, []);

  // Dropdown data
  const { data: searchByOptions } = useGetParameterList('searchCustomerDocument', { label: 'value1', value: 'value2' });

  const { data: statusOptions } = useGetParameterList('statusCustomerDocument', { label: 'value1', value: 'value2' });

  const { data: sortByOptions } = useGetParameterList('sortCustomerDocument', { label: 'value1', value: 'value2' });

  const { data: divisionOptions } = useGetParameterList('division');


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
      key: 'uploadDate',
      label: 'Upload Date',
      startKey: 'startDate',
      type: 'period',
    },
    {
      key: 'status',
      label: 'Status',
      options: statusOptions,
      type: 'multiple-autocomplete',
    },
    {
      key: 'divisionCreator',
      label: 'Divisi Creator',
      options: divisionOptions,
      type: 'multiple-autocomplete',
    },
  ];

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filter, setFilter] = useState<SearchValue>({});

  const payload = {
    ...payloadFilterList(processId, filter),
    documentCategory: 'DIGITAL_MEMO',
  };

  const { data: documentData } = useGetDocument({
    filter: payload,
    page: {
      itemPerPage: pageSize,
      noPage: page,
    },
    searchDetail: filter?.searchDetail ?? {},
    sortList: filter?.sortList ?? {},
  });

  const handleOpenDetailDocument = (data) => {
    NiceModal.show(modal.DETAIL_DOCUMENT, { data });
  };


  const tableHeader: TableHeader[] = [
    ...tableHeaderList,
    {
      key: 'uploadedBy',
      label: 'Upload By',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'uploadedDate',
      label: 'Upload Date',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'creatorName',
      label: 'Creator Name',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'divisionLabel',
      label: 'Division Creator',
      sx: {
        minWidth: '10vw',
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: () => [
        {
          iconName: 'detail',
          onClick: (data) => handleOpenDetailDocument(data),
        },
        { iconName: 'preview-document',
          isDisabled: (data) => !data?.document,
        },
        {
          iconName: 'download',
          isDisabled: (data) => !data?.document,
        },
      ],
      sx: {
        minWidth: '8vw',
      },
      type: 'action',
    }
  ];

  // Action Button
  const [{ stepper, currentRole }] = useApp();
  const pathname = usePathname();
  const isViewOnly = !stepper.steps.find((step) => step.urlPath === 'customer-information')?.enable;
  const isDebtor = processId?.includes('DEBT');
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
    documentData,
    filter,
    filterContentList,
    filterDropdownList,
    handleBackToListPage,
    handleClose,
    handleOpenSubmitModal,
    isDebtor,
    isKadiv,
    isSubmitLoading,
    isTL,
    isViewOnly,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,
  };
};

export default useDigitalMemo;
