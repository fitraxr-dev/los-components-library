'use client';
import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';


import { lpaReview } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetCurrentModule from '../../../hooks/useGetCurrentModule';
import useDeleteLPAInformation from '../../hooks/useDeleteLPAInformation';
import useGetListLPAInformation from '../../hooks/useGetListLPAInformation';
import { MODAL_ID } from '../../Review.constants';

import { TABLE_HEADER_LIST_LPA, TABLE_HEADER_LIST_LPA_REVIEW } from './TableLPAInformation.constants';

import type { TableLPAInformationProps } from './TableLPAInformation.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTableLPAInformation = (props: TableLPAInformationProps) => {
  const { viewOnly } = useViewOnly();
  const { processId, parentId } = useIdentity();
  const { recordActivity } = useRecordLog();
  const theme = useTheme();
  const router = useCustomRouter();
  const path = usePathname();
  const pathArray = path.split('/');
  const typeReview = pathArray[3];
  const moduleIndex = pathArray[4];
  const { module, process } = useGetCurrentModule();
  const [lastDeletePayload, setLastDeletePayload] = useState<any>(null);

  const { data: LPAInformationListData, isLoading: LPAInformationListLoading } = useGetListLPAInformation({
    bucketProcessId: processId,
    module,
    process,
  });

  // Record activity when LPA information list is loaded
  useEffect(() => {
    if (LPAInformationListData) {
      recordActivity({
        activity: ActivityType.VIEW,
        bucketProcessId: processId || '',
        changeAfter: '',
        changeBefore: '',
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'view lpa information list',
      });
    }
  }, [LPAInformationListData, processId, module, process, recordActivity]);

  const anomalyRow = (data: any) => {
    if (!props.lpaDiffs || props.lpaDiffs.length === 0) {
      return {};
    }

    const diffItem = props.lpaDiffs.find((diff) => diff.id === data.id);
    if (diffItem && diffItem.changes === true) {
      return {
        backgroundColor: '#FFF9C4',
      };
    }

    if (diffItem && diffItem.updated === true) {
      return {
        backgroundColor: '#FFCDD2',
      };
    }

    return {};
  };

  const { isPending, mutate: deleteLpa } = useDeleteLPAInformation({
    onSuccess: () => {
      // Record activity for deleting LPA information
      recordActivity({
        activity: ActivityType.DELETE,
        bucketProcessId: processId || '',
        changeAfter: JSON.stringify({ status: 'deleted' }),
        changeBefore: JSON.stringify({
          lpaId: lastDeletePayload?.id,
        }),
        menuCode: 'lpa-review',
        module: module,
        process: process,
        remarks: 'successfully deleted lpa information',
      });

      showNiceModalV2({ type: 'success' });
    },
  });

  const handleDelete = (id: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => {
        const payload = { bucketProcessId: processId, id, module, process };
        setLastDeletePayload(payload);
        deleteLpa(payload);
      },
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin menghapus data?',
      type: 'warning',
    });
  };

  const handleOpenDetail = (id: string) => {
    // Record activity for viewing detail modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view lpa information detail modal (lpaId: ${id})`,
    });

    NiceModal.show(MODAL_ID.LPA_DETAIL, {
      id,
    });
  };


  const handleOpenPopUpLPAInformationNew = () => {
    // Record activity for viewing add modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: 'view add lpa information modal',
    });

    NiceModal.show(MODAL_ID.ADD_LPA);
  };

  const handleEditPopUpLPAInformation = (id: string) => {
    // Record activity for viewing edit modal
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view edit lpa information modal (lpaId: ${id})`,
    });

    NiceModal.show(MODAL_ID.ADD_LPA, {
      id,
    });
  };

  const handleOpenPopupLPAInformationDetail = ({ id }: any) => {
    // Record activity for viewing detail page
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: processId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'lpa-review',
      module: module,
      process: process,
      remarks: `view lpa information detail page (lpaId: ${id})`,
    });

    router.push(replacePath(lpaReview.DETAIL_LPA, {
      module: moduleIndex,
      parentId: id,
      processId: props.processId,
    }));
  };

  const tableHeader: Array<TableHeader> = useMemo(() => {
    switch (typeReview) {
      case 'lpa-request-review':
        return [
          ...TABLE_HEADER_LIST_LPA_REVIEW,
          {
            key: 'action',
            label: 'Action',
            options: [
              { iconName: 'detail', onClick: ({ id }) => handleOpenDetail(id) },
              { iconName: 'edit', isDisabled: viewOnly, onClick: ({ id }) => handleEditPopUpLPAInformation(id) },
              { iconName: 'delete', isDisabled: viewOnly, onClick: ({ id }) => handleDelete(id) },
            ],
            sx: { width: '10%' },
            type: 'action',
          }
        ];
      default:
        return [
          ...TABLE_HEADER_LIST_LPA,
          {
            key: 'action',
            label: 'Action',
            options: [
              { iconName: 'detail', onClick: ({ id }) => handleOpenPopupLPAInformationDetail({ id }) }
            ],
            sx: { width: '10%' },
            type: 'action',
          }
        ];
    }
  }, [typeReview]);


  return {
    LPAInformationListData,
    LPAInformationListLoading,
    anomalyRow,
    handleOpenPopUpLPAInformationNew,
    tableHeader,
    theme,
    typeReview,
  };
};

export default useTableLPAInformation;
