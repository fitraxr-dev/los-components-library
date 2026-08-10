import React, { useState, useEffect } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useQueryClient } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { useForm } from 'react-hook-form';

import { accessid, uploadDatabaseDk } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCheckAccess from '@/hooks/useCheckAccess';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useUploadDatabaseDkContext } from '@/components/layouts/UploadDatabaseDkLayout/UploadDatabaseDk.context';

import useDownloadTemplate from './hooks/useDownloadTemplate';
import useGetHistoryUploadList from './hooks/useGetHistoryUploadList';
import useUploadDocument from './hooks/useUploadDocument';
import { modal } from './List.constants';

import type { SearchValue } from '@/components/shared/Input/components/Search/Search.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const router = useCustomRouter();
  const queryClient = useQueryClient();
  const { handleSetBreadcrumb } = useUploadDatabaseDkContext();
  const [filter, setFilter] = useState<SearchValue>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [fileInputKey, setFileInputKey] = useState(0);
  const canDownload = useCheckAccess(accessid.UPLOAD_DATABASE_DK_DOWNLOAD);
  const canView = useCheckAccess(accessid.UPLOAD_DATABASE_DK_VIEW);

  const { control, watch, reset, setError, clearErrors } = useForm({
    defaultValues: {
      document: {
        extension: '',
        file: '',
        name: '',
      },
    },
    mode: 'onChange',
    reValidateMode: 'onChange',
  });

  const documentValue = watch('document');

  const { mutate: uploadDocument, isPending: isUploading } = useUploadDocument();
  const { mutate: downloadTemplate, isPending: isDownloading } = useDownloadTemplate();

  useEffect(() => {
    handleSetBreadcrumb([]);
  }, []);

  useEffect(() => {
    if (documentValue?.file) {
      clearErrors('document');
    }
  }, [documentValue?.file, clearErrors]);

  const buildPayload = () => {
    const payload: any = {
      filter: {},
      page: {
        itemPerPage: pageSize,
        noPage: page,
      },
    };

    if (filter?.filter) {
      if (filter.filter.startDate) {
        payload.filter.startDate = dayjs(filter.filter.startDate as string).format('YYYY-MM-DD');
      }
      if (filter.filter.endDate) {
        payload.filter.endDate = dayjs(filter.filter.endDate as string).format('YYYY-MM-DD');
      }
      if (filter.filter.uploadBy) {
        payload.filter.uploadBy = filter.filter.uploadBy;
      }
      if (filter.filter.status) {
        payload.filter.status = filter.filter.status;
      }
    }

    return payload;
  };

  const { data: rawData, isLoading } = useGetHistoryUploadList(buildPayload());

  const data = React.useMemo(() => {
    if (!rawData) return rawData;
    return {
      ...rawData,
      contents: rawData.contents.map((item) => ({
        ...item,
        statusLabel: item.statusLabel
          ? item.statusLabel.charAt(0).toUpperCase() + item.statusLabel.slice(1).toLowerCase()
          : '-',
      })),
    };
  }, [rawData]);

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '4vw' },
      type: 'index',
    },
    {
      key: 'fileName',
      label: 'File Name',
      sx: { minWidth: '12vw' },
    },
    {
      key: 'createdBy',
      label: 'Upload By',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'createdDate',
      label: 'Upload Date',
      sx: { minWidth: '12vw' },
      type: 'date',
    },
    {
      key: 'totalRow',
      label: 'Total Rows',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'totalSuccess',
      label: 'Total Success',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'totalFailed',
      label: 'Total Failed',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      sx: { minWidth: '10vw' },
      type: 'status',
    },
    {
      key: 'action',
      label: 'Action',
      options: (row) =>
        row?.status === 0
          ? [
            {
              iconName: 'Failed',
              onClick: (data) => {
                handleOpenDetail(data);
              },
            },
          ]
          : canView ? [
            {
              iconName: 'detail',
              onClick: (data) => {
                router.replace(
                  replacePath(uploadDatabaseDk.DETAIL_PAGE, {
                    id: data?.id,
                  })
                );
              },
            },
          ] : [],
      sx: { minWidth: '6vw' },
      type: 'action',
    },
  ];

  const handleOpenDetail = (data) => {
    NiceModal.show(modal.DETAIL, { detailData: data });
  };

  const handleCustomerCheck = () => {
    NiceModal.show(modal.CUSTOMER_CHECK);
  };

  const handleUpload = () => {
    if (!documentValue?.file) {
      setError('document', {
        message: 'Silakan pilih file terlebih dahulu',
        type: 'manual',
      });
      return;
    }

    const file = documentValue.file as unknown as File;

    uploadDocument(file, {
      onError: (error: any) => {
        console.error('Upload failed:', error);

        let errorMessage = 'Upload gagal';

        if (error?.data?.data?.content?.message) {
          errorMessage = error.data.data.content.message;
        } else if (error?.data?.errorDesc) {
          errorMessage = error.data.errorDesc;
        } else if (error?.message) {
          errorMessage = error.message;
        }

        setError('document', {
          message: errorMessage,
          type: 'manual',
        });
      },
      onSuccess: (response) => {
        console.log('Upload success:', response);

        const contentMessage = response?.data?.content?.message;

        if (contentMessage && contentMessage.includes('Error')) {
          setError('document', {
            message: contentMessage,
            type: 'manual',
          });
          return;
        }

        queryClient.invalidateQueries({ queryKey: ['database-dk-lov-upload-by']});

        reset();
        setFileInputKey((prev) => prev + 1);
      },
    });
  };

  const handleDownloadTemplate = () => {
    downloadTemplate();
  };

  return {
    canDownload,
    control,
    data,
    fileInputKey,
    filter,
    handleCustomerCheck,
    handleDownloadTemplate,
    handleUpload,
    isDownloading,
    isLoading,
    isUploading,
    page,
    pageSize,
    setFilter,
    setPage,
    setPageSize,
    tableHeader,

  };
};

export default useList;
