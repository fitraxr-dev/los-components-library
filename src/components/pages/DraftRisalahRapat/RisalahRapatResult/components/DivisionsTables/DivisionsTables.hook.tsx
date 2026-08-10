import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material/styles';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { getCookie } from '@/helpers/cookie';
import { toDateStringNumber } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useApp from '@/hooks/useApp';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import Label from '@/components/pages/Review/components/Label';
import TextStyle from '@/components/shared/TextStyle';

import useDeleteUserAssignedDivision from '../../hooks/useDeleteUserAssignedDivision';
import useGetUsersByAssignedDivision from '../../hooks/useGetUsersByAssignedDivision';
import { MODAL, TABLE_HEADER_CONSTANT } from '../../RisalahRapatResult.contants';
import useRisalahRapatResult from '../../RisalahRapatResult.hooks';

import type { DivisionTablesProps } from './DivisionsTables.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDivisionsTables = (props: DivisionTablesProps) => {
  const { viewOnly } = useViewOnly();

  const theme = useTheme();
  const { title, value } = props;
  const { processId } = useIdentity();
  const [user] = useApp();

  const currentUserId = user.userData.user.userId;

  const { data: userByDivisionData, isLoading: getUserByDivisionData } = useGetUsersByAssignedDivision({
    bucketProcessId: processId,
    divisionId: value,
    module: TypeModule.RISALAH_RAPAT,
    process: TypeProcess.RISALAH_RAPAT,
  });

  useEffect(() => {
    const isConfirmed = userByDivisionData.userList.find((val) => val.staffId === +currentUserId);

    if (isConfirmed !== undefined) {
      props.isRegistered(isConfirmed);
    }

  }, [userByDivisionData]);

  const { mutate, isPending } = useDeleteUserAssignedDivision({
    onError: () => {
      showNiceModalV2({ title: 'Terjadi kesalahan, Mohon di coba kembali', type: 'error' });
    },
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil disimpan', type: 'success' });
    },
  });

  const tableHeader: TableHeader[] = [
    ...TABLE_HEADER_CONSTANT,
    {
      key: 'status',
      label: 'Status',
      render: (row) => (row.confirmed ? <Label text="Confirmed" /> : <Label text="On Progress" />),
      sx: {
        minWidth: '10vw',
      },
    },

    {
      key: 'dateConfirmed',
      label: 'Date Confirmed',
      render: (row) => (row.confirmedDate ?
        <TextStyle variant="body4">
          {toDateStringNumber(row.confirmedDate)}
        </TextStyle> :
        <TextStyle variant="body4">
          -
        </TextStyle>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: viewOnly ? [] : [
        {
          iconName: 'delete', isDisabled: (data) => { return !data.deletable; }, onClick: (data) => {
            showNiceModalV2({
              cancelText: 'Tidak', onSubmit() {
                mutate({
                  id: data.id,
                });
              }, submitText: 'Ya', title: 'Apakah anda yakin, ingin menghapus data?', type: 'warning',
            });
          },
        }],
      type: 'action',
    }
  ];

  const handleAddDirector = (division: string) => {
    NiceModal.show(MODAL.USER_COLLABORATION, { division });
  };

  const onProgress = userByDivisionData?.userList.find((dt) => dt.confirmed === false);

  return {
    getUserByDivisionData,
    handleAddDirector,
    onProgress,
    tableHeader,
    theme,
    title,
    userByDivisionData,
    viewOnly,
  }
  ;
};

export default useDivisionsTables;
