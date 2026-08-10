import { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { MODAL } from '@/configs/constants/modalId';
import { ActivityType } from '@/enums/Activity';
import { API } from '@/helpers/api';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';


import { useNavigationContext } from '../../../context/NavigationContext';

import useGetParameterLOVItemList from './hooks/useGetParameterLOVItemList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface ListOfValueData {
  ariumCode: string;
  id: number;
  keterangan: string;
  lovId: string;
  temenosCode: string;
  valueName: string;
}

const schema = yup.object({
  ariumCode: yup.string().required('ARIUM CODE is required'),
  keterangan: yup.string().required('Keterangan is required'),
  lovId: yup.string().required('LOV ID is required'),
  temenosCode: yup.string().required('TEMENOS CODE is required'),
  valueName: yup.string().required('Value Name is required'),
});

type FormData = yup.InferType<typeof schema>;

export const useListOfValue = () => {
  const { isViewOnly } = useMasterParameter();
  const { navigationData } = useNavigationContext();
  const { recordActivity } = useRecordLog();

  // Get bucketProcessId from NavigationContext
  const bucketProcessId = navigationData.bucketProcessId;
  const moduleName = navigationData.modul;
  // API call for LOV item list - always call API
  const shouldCallAPI = true;


  const { data: lovItemData, isFetching: isLovItemLoading } = useGetParameterLOVItemList({
    filter: {
      bucketProcessId,
      module: moduleName,
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: {
      key: '',
      value: '',
    },
  });

  const form = useForm<FormData>({
    defaultValues: {
      ariumCode: '',
      keterangan: '',
      lovId: '',
      temenosCode: '',
      valueName: '',
    },
    resolver: yupResolver(schema),
  });

  // Handle delete function
  const handleDelete = (item: ListOfValueData) => {
    NiceModal.show(
      MODAL.GLOBAL.CONFIRM,
      {
        agreeText: 'Ya',
        cancelText: 'Tidak',
        onSubmit: async () => {
          try {
            // Prepare data for recordActivity
            const changeBefore = JSON.stringify({
              ariumCode: item.ariumCode,
              bucketProcessId,
              id: item.id,
              keterangan: item.keterangan,
              lovId: item.lovId,
              module: moduleName,
              temenosCode: item.temenosCode,
              valueName: item.valueName,
            });

            // Record activity for delete
            recordActivity({
              activity: ActivityType.DELETE,
              bucketProcessId,
              changeAfter: null, // No data after delete
              changeBefore,
              menuCode: 'parameter-lov',
              module: moduleName,
              process: 'parameter-lov',
              remarks: `delete parameter lov item: ${item.valueName} (${item.ariumCode})`,
            });

            // TODO: Add actual delete API call here
            // await API('parameter.parameterLov.delete', { data: { id: item.id } });

            closeNiceModal(MODAL.GLOBAL.CONFIRM);
          } catch (error) {
            console.error('Error deleting data:', error);
          }
        },
        title: 'Apakah anda yakin ingin menghapus data ini?',
      },
    );
  };

  // Handle edit function
  const handleEdit = (data: ListOfValueData) => {
    // Record activity for edit attempt
    recordActivity({
      activity: ActivityType.EDIT,
      bucketProcessId,
      menuCode: 'parameter-lov',
      module: moduleName,
      process: 'parameter-lov',
      remarks: `attempt to edit parameter lov item: ${data.valueName} (${data.ariumCode})`,
    });

    // Show modal with pre-filled data for editing
    NiceModal.show('MODAL_ADD_LIST_OF_VALUE', {
      editData: data,
      isEdit: true,
    });
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '60px',
        textAlign: 'center',
      },
      type: 'index',
    },
    {
      key: 'id',
      label: 'LOV ID',
      sx: {
        minWidth: '100px',
      },
    },
    {
      key: 'valueName',
      label: 'Value Name',
      sx: {
        minWidth: '200px',
      },
    },
    {
      key: 'ariumCode',
      label: 'Kode Arium',
      sx: {
        minWidth: '120px',
      },
    },
    {
      key: 'temenosCode',
      label: 'Kode Temenos',
      sx: {
        minWidth: '120px',
      },
    },
    ...(isViewOnly ? [{
      key: 'description',
      label: 'Keterangan',
      sx: {
        minWidth: '200px',
      },
    }] : []),
    // Only add action column if not in view-only mode
    ...(!isViewOnly ? [{
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'edit',
          onClick: (data: any) => {
            handleEdit(data);
          },
        },
      ],
      sx: {
        minWidth: '120px',
        textAlign: 'center',
      },
      type: 'action' as const,
    }] : []),
  ];

  const isLoading = false;

  const handleAdd = () => {
    NiceModal.show('MODAL_ADD_LIST_OF_VALUE');
  };

  return {
    data: lovItemData,
    form,
    handleAdd,
    handleDelete,
    handleEdit,
    isLoading: isLovItemLoading,
    isViewOnly,
    navigationData,
    tableHeader,
  };
};
