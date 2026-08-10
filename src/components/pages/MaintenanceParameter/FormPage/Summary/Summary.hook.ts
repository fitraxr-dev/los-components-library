import React, { useMemo } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { yupResolver } from '@hookform/resolvers/yup';
import { useTheme } from '@mui/material';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSubmitBucket from '@/hooks/services/useSubmitBucket';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useRecordLog from '@/hooks/useRecordLog';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import TextStyle from '@/components/shared/TextStyle/TextStyle';


import useGetSummaryChangesList from './hooks/useGetSummaryChangesList';

import type { TableHeader } from '@/components/shared/Table/Table.types';


interface SummaryData {
  id: number;
  fieldName: string;
  oldValue: string;
  newValue: string;
  changeType: 'ADD' | 'UPDATE' | 'DELETE';
}

const schema = yup.object({
  changeType: yup.string().required('Change Type is required'),
  fieldName: yup.string().required('Field Name is required'),
  newValue: yup.string().required('New Value is required'),
  oldValue: yup.string(),
});

type FormData = yup.InferType<typeof schema>;

export const useSummary = () => {
  // Summary hook for Parameter LOV
  const { isViewOnly } = useMasterParameter();
  const [{ currentRole }] = useApp();
  const theme = useTheme();
  const router = useRouter();
  const params = useParams();
  const { recordActivity } = useRecordLog();

  const isMaker = !!currentRole?.includes?.(roles.MAKER);
  const viewOnly = isViewOnly;

  // Get data from route parameters
  const bucketProcessId = params.processId as string;
  const moduleName = params.module as string;
  const description = params.description as string;

  // API calls for both tables
  const { data: updateData, isFetching: isUpdateLoading } = useGetSummaryChangesList({
    filter: {
      action: 'UPDATE',
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

  const { data: addData, isFetching: isAddLoading } = useGetSummaryChangesList({
    filter: {
      action: 'ADD',
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
      changeType: 'ADD',
      fieldName: '',
      newValue: '',
      oldValue: '',
    },
    resolver: yupResolver(schema),
  });

  const { mutate: submitBucket } = useSubmitBucket({
    onError() {
      showNiceModalV2({
        onClose: () => {
        },
        type: 'error',
      });
    },
    onSuccess() {
      showNiceModalV2({
        type: 'success',
      });

      setTimeout(() => {
        closeNiceModal(MODAL.GLOBAL.COMMENT);
        closeNiceModal(MODAL.GLOBAL.SUCCESS);
        router.push(MASTER_PARAMETER.PARAMETER_LOV_LIST_PAGE);
      }, 1000);
    },
  });

  // Transform data for UPDATE table (similar to MaintenanceParameterVA)
  const transformUpdateDataForLOV = (data: any[]) => {
    const transformedData: any[] = [];
    let indexCounter = 1;

    data.forEach((item) => {
      if (item.oldData) {
        // If there's old data, show both Previous and Last Modified rows
        transformedData.push({
          ...item.oldData,
          index: { rowSpan: 2, value: indexCounter },
          status: 'Previous',
          statusLabel: 'Previous',
        });
      } else {
        // If no old data, show Previous row with empty/dash data
        transformedData.push({
          changeType: '-',
          fieldName: '-',
          index: { rowSpan: 2, value: indexCounter },
          newValue: '-',
          oldValue: '-',
          status: 'Previous',
          statusLabel: 'Previous',
        });
      }

      // Always show Last Modified row
      transformedData.push({
        ...item,
        index: { rowSpan: 0, value: '' },
        status: 'Last Modified',
        statusLabel: 'Last Modified',
      });

      indexCounter++;
    });

    return transformedData;
  };

  // Table data for UPDATE
  const tableDataUpdate = updateData?.contents
    ? transformUpdateDataForLOV(updateData.contents)
    : [];

  // Header for UPDATE table (with Status column and rowSpan)
  const tableHeaderUpdate: TableHeader[] = [
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
      key: 'status',
      label: 'Status',
      render: (row: any) => {
        return React.createElement(TextStyle, {
          color: theme.palette.primary.main,
          variant: 'body4',
          weight: 600,
        }, row.status);
      },
      sx: { minWidth: '10vw' },
    },
    {
      key: 'code',
      label: 'LOV Code',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'valueName',
      label: 'Value Name',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'ariumCode',
      label: 'Kode Arium',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'temenosCode',
      label: 'Kode Temenos',
      sx: {
        minWidth: '120px',
      },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Yes' : 'No'),
      sx: { minWidth: '7vw' },
    },
    {
      key: 'modifiedBy',
      label: 'Modified By',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'modifiedDate',
      label: 'Last Modified',
      sx: {
        minWidth: '150px',
      },
      type: 'date',
    },
  ];

  // Header for ADD NEW table (without Status column, simpler structure)
  const tableHeaderAddNew: TableHeader[] = [
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
      key: 'code',
      label: 'LOV Code',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'valueName',
      label: 'Value Name',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'ariumCode',
      label: 'Kode Arium',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'temenosCode',
      label: 'Kode Temenos',
      sx: {
        minWidth: '120px',
      },
    },
    {
      key: 'isActive',
      label: 'Active',
      render: (row: any) => React.createElement(TextStyle, { variant: 'body4' }, row.isActive ? 'Yes' : 'No'),
      sx: { minWidth: '7vw' },
    },
    {
      key: 'createdBy',
      label: 'Created By',
      sx: {
        minWidth: '150px',
      },
    },
    {
      key: 'createdDate',
      label: 'Created Date',
      sx: {
        minWidth: '150px',
      },
      type: 'date',
    },
  ];

  const isLoading = isUpdateLoading || isAddLoading;

  const handleAdd = () => {
    NiceModal.show('MODAL_ADD_SUMMARY');
  };

  const handleDecline = () => {
    form.reset();
  };

  const handleCancel = () => {
    updateStatus('CANCELED');
  };

  const handleClose = () => {
    router.push(MASTER_PARAMETER.PARAMETER_LOV_LIST_PAGE);
  };

  const updateStatus = async (act: 'SUBMIT' | 'RETURN_TO_MAKER' | 'REJECT' | 'CANCELED' | 'APPROVED') => {
    let action: string = act;
    if (act === 'REJECT') {
      action = 'REJECTED';
    }

    NiceModal.show(
      MODAL.GLOBAL.COMMENT,
      {
        onSave: ({ comment }) => {
          closeNiceModal(MODAL.GLOBAL.COMMENT);
          closeNiceModal(MODAL.GLOBAL.SUCCESS);

          // Get form data if any
          const formValues = form.getValues();

          const payload = {
            action,
            bucketProcessId,
            comment,
            isCompleteEditAskForInfo: false,
            module: TypeModule.PARAMETER_LOV,
            process: TypeProcess.PARAMETER_LOV,
          };

          // Record activity for submit bucket
          const activityType = act === 'SUBMIT' ? ActivityType.SUBMIT :
            act === 'REJECT' ? ActivityType.REJECT :
              act === 'CANCELED' ? ActivityType.CANCEL :
                act === 'COMPLETED' ? ActivityType.COMPLETE :
                  ActivityType.SUBMIT;

          recordActivity({
            activity: activityType,
            bucketProcessId,
            changeAfter: JSON.stringify(payload),
            changeBefore: null,
            menuCode: 'parameter-lov',
            module: TypeModule.PARAMETER_LOV,
            process: TypeProcess.PARAMETER_LOV,
            remarks: `${act.toLowerCase()} parameter lov bucket: ${description} (${moduleName})`,
          });

          submitBucket({
            submitRequestDto: payload,
          });

        },
      },
    );
  };

  const handleApprovalStatusModal = () => {
    NiceModal.show('APPROVAL_STATUS_MODAL_PARAMETER');
  };

  const hasDataToSubmit = (addData?.contents?.length || 0) > 0 || (updateData?.contents?.length || 0) > 0;

  return {
    addData: { contents: addData?.contents || [], totalPages: addData?.totalPages || 1 },
    form,
    handleAdd,
    handleApprovalStatusModal,
    handleCancel,
    handleClose,
    handleDecline,
    hasDataToSubmit,
    isLoading,
    isMaker,
    tableDataUpdate,
    tableHeaderAddNew,
    tableHeaderUpdate,
    updateData: { contents: updateData?.contents || [], totalPages: updateData?.totalPages || 1 },
    updateStatus,
    viewOnly,
  };
};
