import { useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { usePathname } from 'next/navigation';

import { MODAL } from '@/configs/constants/modalId';
import { mup } from '@/configs/constants/pathname';
import { TypeModule } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { toLetters } from '@/helpers/string';
import useDeleteRoutineSubReporting from '@/hooks/services/mip/routine-reporting/useDeleteRoutineSubReporting';
import useGetListRoutine from '@/hooks/services/mip/routine-reporting/useGetListRoutine';
import useCustomRouter from '@/hooks/useCustomRouter';
import useGoToNextStep from '@/hooks/useGoToNextStep';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';


import { MODAL_ID, TABLE_HEADER as TABLE } from './ReportingListRoutine.constants';

import type { ReportingListRoutineTypes } from './ReportingListRoutine.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useReportingListRoutine = (props: ReportingListRoutineTypes) => {
  const router = useCustomRouter();
  const path = usePathname();
  const goToNextStep = useGoToNextStep();
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);


  const handleOpenCreateSubReport = ({ id, parentId }: {
    id?: number;
    parentId: number;
  }) => {
    NiceModal.show(MODAL_ID.CREATE_SUB_REPORT, {
      id,
      module: props.module,
      parentId,
    });
  };

  const handleOpenShowEditListReport = (data, isDetail = false) => {
    const splitPath = mup.ENVIRONMENTAL_AND_SOCIAL_SAFEGUARD_REPORT_RUTIN_EDIT_PAGE.split('/');
    const editReportRoutinePath = splitPath[splitPath?.length - 2]; // edit-report-routine
    router.push(`${path}/${editReportRoutinePath}/${data?.id}${isDetail ? '?viewOnly=true' : ''}`);
  };

  const { mutate: deleteSubRoutineReport } = useDeleteRoutineSubReporting({
    module: props.module,
    onSuccess: () => {
      showNiceModalV2({ title: 'Data berhasil dihapus', type: 'success' });
    },
  });

  const handleDeleteSubRoutineReport = (id: number) => {
    NiceModal.show(MODAL.GLOBAL.CONFIRM, {
      agreeText: 'Ya',
      cancelText: 'Tidak',
      onSubmit: () => deleteSubRoutineReport({ id }),
      title: 'Apakah anda yakin untuk menghapus data?',
    });
  };

  const { isLoading, data: routineReportBucket } = useGetListRoutine({
    bucketProcessId: processId,
    module: props.module,
    process: props.process,
  });

  console.log('data', routineReportBucket);

  const NEW_DATA = routineReportBucket?.reduce((acc, curr) => {
    if (curr?.subReports.length > 0) {
      const { subReports, ...rest } = curr;

      acc.push(rest);

      subReports?.forEach((subReport, index) => {
        acc?.push({
          ...subReport,
          alphabet: toLetters(index),
          deadlineOther: '-',
          grade: '-',
          gradeLabel: '-',
          isAnnual: '-',
          isQuarterly: '-',
          isSemester: '-',
          parentId: curr.id,
          remark: '-',
        });
      });
    } else {
      acc?.push({
        ...curr,
        gradeLabel: curr.gradeLabel || '-',
        remark: curr.remark || '-',
      });
    }

    return acc;
  }, []);

  const TABLE_HEADER: Array<TableHeader> = [
    {
      key: 'alphabet',
      label: 'No',
      render: (row, index) => {
        let count = 1;

        for (let i = 0; i < index; i++) {
          if (NEW_DATA[i].parentId === row.parentId) {
            count++;
          }
        }

        if (row.alphabet) {
          return <TextStyle variant="body4">{row.alphabet}</TextStyle>;
        }

        return <TextStyle variant="body4">{count}</TextStyle>;
      },
    },
    ...TABLE,
    {
      key: 'action',
      label: 'Action',
      options: (params) => {
        if (viewOnly && props.isBusinessResponse) {
          if (params.parentId) {
            return [];
          }

          return [
            {
              iconName: 'detail',
              onClick: (data) => handleOpenShowEditListReport(data, true),
            }
          ];
        }

        if (params.allowSubReport && !props.isBusinessResponse) {
          return [
            {
              iconName: 'edit',
              isDisabled: viewOnly,
              onClick: (data) => handleOpenShowEditListReport(data),
            },
            {
              iconName: 'add',
              isDisabled: viewOnly,
              onClick: (data) => handleOpenCreateSubReport({ parentId: data.id }),
            }];
        }

        if (params.parentId) {
          if (props.module === TypeModule.MUP) {
            return [];
          } else {
            return [
              {
                iconName: 'edit',
                isDisabled: viewOnly,
                onClick: (data) => handleOpenCreateSubReport({ id: data.id, parentId: data.parentId }),
              },
              {
                iconName: 'delete',
                isDisabled: viewOnly,
                onClick: (data) => handleDeleteSubRoutineReport(data.id),
              },
            ];
          }

        }

        return [
          {
            iconName: 'edit',
            isDisabled: viewOnly,
            onClick: (data) => handleOpenShowEditListReport(data),
          },
        ];
      },
      sx: { minWidth: '10vw' },
      type: 'action',
    },
  ];

  return {
    NEW_DATA,
    TABLE_HEADER,
    goToNextStep,
    page,
    pageSize,
    setPage,
    setPageSize,
    viewOnly,
  };
};

export default useReportingListRoutine;
