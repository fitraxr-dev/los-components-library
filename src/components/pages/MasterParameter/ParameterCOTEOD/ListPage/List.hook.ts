import * as React from 'react';

import NiceModal from '@ebay/nice-modal-react';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useCustomRouter from '@/hooks/useCustomRouter';

import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';

import useGetParameterCOTList from './hooks/useGetParameterCOTList';
import useGetParameterEODList from './hooks/useGetParameterEODList';
import { MODAL, TABLE_COT_HEADER, TABLE_EOD_HEADER } from './List.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useList = () => {
  const { isMaker } = useMasterParameter();
  const router = useCustomRouter();

  const { data: parameterCOTData, isFetching: isLoadingCOT } = useGetParameterCOTList();
  const { data: parameterEODData, isFetching: isLoadingEOD } = useGetParameterEODList();

  const navigate = React.useCallback((mode: string, processId: string) => {
    const nextPath = replacePath(MASTER_PARAMETER.PARAMETER_COT_EOD_DETAIL_PAGE, {
      mode,
      processId,
    });
    router.push(nextPath);
  }, [router]);

  const confirmEdit = React.useCallback((mode: string, processId: string) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      onSubmit: () => navigate(mode, processId),
      submitText: 'Ya',
      title: 'Apakah anda yakin ingin mengedit data ini?',
      type: 'warning',
    });
  }, [navigate]);

  const buildActionColumn = React.useCallback(
    (mode: 'cot' | 'eod', canEdit: boolean): TableHeader => ({
      key: 'action',
      label: 'Action',
      options: (row) => {
        const base = [
          {
            iconName: 'detail',
            onClick: (data) => navigate(`detail-${mode}`, data.id),
          },
        ];
        const editable = canEdit && row.isEditable ? [
          {
            iconName: 'edit',
            onClick: (data) => confirmEdit(`edit-${mode}`, data.id),
          },
        ] : [];
        return [...base, ...editable];
      },
      sx: { minWidth: '10vw' },
      type: 'action',
    }),
    [confirmEdit, navigate]
  );

  // * Memoize headers so they dont rebuild every render.
  // * tbh idk if this is the best way to implement it -raha
  const tableCotHeader: TableHeader[] = React.useMemo(
    () => [...TABLE_COT_HEADER, buildActionColumn('cot', isMaker)],
    [buildActionColumn, isMaker]
  );

  const tableEodHeader: TableHeader[] = React.useMemo(
    () => [...TABLE_EOD_HEADER, buildActionColumn('eod', isMaker)],
    [buildActionColumn, isMaker]
  );

  const handleOpenApprovalStatusModal = React.useCallback(() => {
    NiceModal.show(MODAL.APPROVAL_STATUS_MODAL);
  }, []);

  return {
    cot: {
      isLoading: isLoadingCOT,
      tableData: parameterCOTData?.contents,
      tableHeader: tableCotHeader,
    },
    eod: {
      isLoading: isLoadingEOD,
      tableData: parameterEODData?.contents,
      tableHeader: tableEodHeader,
    },
    handleOpenApprovalStatusModal,
  };
};

export default useList;
