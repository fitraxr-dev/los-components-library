import React from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { TableCell, TableRow } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useDeleteSubData from '@/hooks/services/mip/corrective-action-plan/useDeleteSubData';
import useGetCorrectiveActionPlan from '@/hooks/services/mip/corrective-action-plan/useGetCorrectiveActionPlan';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import IconButton from '@/components/shared/IconButton';
import TextStyle from '@/components/shared/TextStyle';

import type { CorrectiveActionPlanHooks } from './CorrectiveActionPlan.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useCorrectiveActionPlanHooks = ({ module, process, isBusinessResponse, viewOnly }: CorrectiveActionPlanHooks) => {
  const router = useCustomRouter();
  const { processId } = useIdentity();
  const path = usePathname();

  const { data: correctiveActionPlanBucket, isLoading } = useGetCorrectiveActionPlan({
    bucketProcessId: processId,
    module: module,
    process: process,
  });


  const { isPending: deleteLoading, mutate: deleteSubData } = useDeleteSubData({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, silahkan dicoba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data Berhasil Dihapus', type: 'success' });
    },
  });


  const handleDeleteSubData = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteSubData({ id }),
      title: 'Apakah anda yakin untuk menghapus data?',
    });
  };

  const outputData = Object.entries(correctiveActionPlanBucket).map((data, index) => ({
    key: index,
    subData: data[1],
    title: data[0],
  }));

  const handleNewData = () => {
    router.push(`${path}/add`);
  };

  const tableHeader: TableHeader[] = [
    {
      key: 'type',
      label: 'Temuan/Gaps',
      render: (data) => {
        return (
          <>
            <TextStyle variant="body1">{data.title}</TextStyle>
          </>
        );
      },
    },
    {
      key: 'action',
      label: 'Action',
      options: [{ iconName: viewOnly ? 'detail' : 'edit', onClick: () => { } }],
      render: (data) => {
        return <></>;
      },
      sx: { width: '10%' },
      type: 'action',
    },
  ];

  const renderTableInBetweenRow = (data, depth = 0) => {
    return (
      <>
        {data.subData.map((element, index) => (
          <TableRow key={index}>
            <TableCell>
              <TextStyle sx={{ ml: 2 + (depth * 2) }} variant="body4">{`Temuan ${index + 1}`}</TextStyle>
            </TableCell>
            <TableCell>
              <IconButton
                iconName={viewOnly ? 'detail' : 'edit'}
                onClick={() => {router.push(`${path}/edit/${element}`); }}
              />
              {!isBusinessResponse && (
                <IconButton
                  isDisabled={viewOnly}
                  iconName="delete"
                  onClick={() => { handleDeleteSubData(element); }}
                />
              )}
            </TableCell>
          </TableRow>
        ))}
      </>
    );
  };

  return {
    handleNewData,
    isLoading,
    outputData,
    renderTableInBetweenRow,
    tableHeader,
  };
};

export default useCorrectiveActionPlanHooks;
