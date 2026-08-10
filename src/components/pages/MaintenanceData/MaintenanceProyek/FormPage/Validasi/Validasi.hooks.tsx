import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { Typography, useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { formatDateTime } from '@/helpers/date';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useMaintenanceProyekContext } from '@/components/layouts/MaintenanceProyekLayout/MaintenanceProyek.context';
import Button from '@/components/shared/Button';
import useGetTimelineByProcessId from '@/components/shared/SmiTable/TableValidation/hooks/useGetTimelineByProcessId';

import { ValidasiTableHeader } from './Validasi.constants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const UseValidasi = () => {
  const { handleSetBreadcrumb } = useMaintenanceProyekContext();
  const pathname = usePathname();
  const theme = useTheme();
  const router = useCustomRouter();
  const { id } = useParams();
  const [idConvert, setIdConvert] = useState(Array.isArray(id) ? id[0] : id);
  const isApproval = id ? id?.includes('MNTP-') : false;

  const pageBreadCrumb = useMemo(() => {
    if (pathname.includes('create')) return ({ label: 'Add New Project', url: '' });
    if (pathname.includes('edit')) return ({ label: 'Edit Project', url: '' });
    return ({ label: 'Detail Project', url: '' });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      pageBreadCrumb
    ]);
  }, []);

  const getBucketProcessId = () => {
    if (idConvert?.includes('MNTP')) {
      return idConvert;
    }

    if (idConvert?.includes('PRJ')) {
      if (typeof window !== 'undefined') {
        return sessionStorage.getItem('maintenance-proyek');
      }
    }

    return null;
  };

  // ==== Validasi Table

  const [validasiPage, setValidasiPage] = useState(1);
  const [validasiPageSize, setValidasiPageSize] = useState(5);

  const tableHeaderValidasi: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: {
        minWidth: '4vw',
      },
      type: 'index',
    },
    {
      key: 'comment',
      label: 'Comment',
      render: (row) => (
        <Typography
          variant="body4"
          sx={{ maxWidth: '100%' }}
          title={row?.comment || '-'}
        >
          <div
            style={{
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {row?.comment || '-'}
          </div>
        </Typography>
      ),
      sx: {
        maxWidth: '20vw',
        minWidth: '10vw',
      },
    },
    {
      key: 'statusLabel',
      label: 'Status',
      render: (row) => (
        <Button
          variant="outlined"
          sx={{ px: 1, py: 0.5 }}
          textVariant="body4"
          noClick
        >
          {row?.statusLabel}
        </Button >
      ),
    },
    ...ValidasiTableHeader,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            handleOpenDetail(data);
          },
        },
      ],
      sx: {
        minWidth: '10vw',
      },
      type: 'action',
    }
  ];

  // API List
  const { data: validasiData, isPending: isLoadingValidasi } = useGetTimelineByProcessId({
    filter: {
      bucketProcessId: getBucketProcessId(),
      module: 'MAINTENANCE_DATA',
      process: 'MAINTENANCE_PROJECT',
    },
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
  });

  const [validasiDataMapped, setValidasiDataMapped] = useState(null);

  useEffect(() => {
    const validasiDataTemp = validasiData?.contents?.map((item) => ({
      ...item,
      createdDate: formatDateTime(item.createdDate),
    }));

    setValidasiDataMapped(validasiDataTemp);
  }, [validasiData]);

  const handleOpenDetail = (data: { comment: string }) => {
    NiceModal.show(MODAL.GLOBAL.COMMENT, {
      initialComment: data.comment ?? '-',
      viewOnly: true,
    });
  };

  return {
    handleOpenDetail,
    isLoadingValidasi,
    router,
    setValidasiPage,
    setValidasiPageSize,
    tableHeaderValidasi,
    theme,
    validasiDataMapped,
    validasiPage,
    validasiPageSize,
  };
};

export default UseValidasi;
