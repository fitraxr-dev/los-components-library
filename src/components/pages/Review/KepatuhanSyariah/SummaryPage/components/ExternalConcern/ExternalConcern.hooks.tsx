import { useCallback } from 'react';

import { useParams, usePathname, useSearchParams } from 'next/navigation';


import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import { useShariahComplianceAccess } from '../../../hooks/useShariahComplianceAccess';
import useDeleteConcern from '../../hooks/useDeleteConcern';
import useGetSummaries from '../../hooks/useGetConcern';
import { TypeSummary } from '../../Summary.contants';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useInternConcern = () => {
  const { viewOnly } = useViewOnly();
  const router = useCustomRouter();
  const { processId }: { processId: string } = useParams();
  const path = usePathname();

  const searchParams = useSearchParams();

  const createQueryString = useCallback(
    (name: string, value: string, valQueue: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      params.set('queue', valQueue);
      return params.toString();
    },
    [searchParams]
  );

  const { data } = useGetSummaries({
    bucketProcessId: processId,
    module: TypeModule.MIP_REVIEW,
    process: TypeProcess.REVIEWER_DK,
    type: TypeSummary.EXTERNAL,
  });

  const {
    hasAnyUpdateAccess: canUpdate,
    hasAnyCreateAccess: canCreate,
  } = useShariahComplianceAccess();


  const { isSuccess, mutate } = useDeleteConcern(
    {
      onError: () => {
        showNiceModalV2({ title: 'Terjadi Kesalahan Silahkan, dicoba kembali', type: 'error' });
      },
      onSuccess: () => {
        showNiceModalV2({ title: 'Data berhasil di disimpan', type: 'success' });
      },
    }
  );

  const handleEdit = (id: number, idx: number) => {
    const idQueue = idx + 1;
    router.push(replacePath(KEPATUHAN_SYARIAH.EDIT_SUMMARY + '?' + createQueryString('type', 'external', String(idQueue)), {
      id: id,
      module: moduleIndex,
      processId: processId,
    }));
  };

  const handleDetail = (id: number, idx: number) => {
    const idQueue = idx + 1;
    router.push(replacePath(KEPATUHAN_SYARIAH.DETAIL_SUMMARY + '?' + createQueryString('type', 'internal', String(idQueue)), {
      id: id,
      module: moduleIndex,
      processId: processId,
    }));
  };


  const handleDeleteConfirm = (id: number) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => { mutate({ id }); },
      submitText: 'Iya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };


  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      type: 'index',
    },
    {
      key: 'shariaCompliance',
      label: 'Catatan Kepatuhan Syariah',
      render: (row, idx) => (
        <TextStyle variant="body4">{formatShariaCompliance(row?.shariaCompliance, idx)}</TextStyle>
      ),
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        ...(!viewOnly ? [
          {
            iconName: 'edit',
            isDisabled: !canUpdate,
            onClick: (val, idx) => handleEdit(val.id, idx),
          },
          {
            iconName: 'delete',
            isDisabled: !canUpdate,
            onClick: (val) => handleDeleteConfirm(val.id),
          }
        ] : []),

        ...(viewOnly ? [
          {
            iconName: 'detail',
            isDisabled: false,
            onClick: (val, idx) => handleDetail(val.id, idx),
          }
        ] : [])
      ],
      sx: { width: '10%' },
      type: 'action',
    },
  ];

  const formatShariaCompliance = (val, idx) => {
    let label = '-';
    if (val?.length) {
      const valSplit = val?.split(' ');
      label = `${valSplit[0]} ${valSplit[1]} ${idx + 1}`;
    }
    return label;
  };

  const moduleIndex = path.split('/')[4];

  const handleNewData = () => {
    if (!viewOnly) {
      const idQueue = data?.length >= 1 ? data?.length + 1 : 1;
      router.push(replacePath(KEPATUHAN_SYARIAH.ADD_SUMMARY.replace('[module]', moduleIndex) + '?' + createQueryString('type', 'external', String(idQueue)), {
        processId: processId,
      }));
    }
  };


  return {
    canCreate,
    canUpdate,
    data,
    handleNewData,
    isSuccess,
    tableHeader,
    viewOnly,
  };
};

export default useInternConcern;
