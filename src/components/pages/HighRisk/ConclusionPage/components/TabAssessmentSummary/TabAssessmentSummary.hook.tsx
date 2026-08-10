import { useContext, useEffect, useMemo, useState } from 'react';

import { usePathname } from 'next/navigation';

import { DirtyContext } from '@/contexts/DirtyContext';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import { convertToDocx } from '@/helpers/synfusion';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import TextStyle from '@/components/shared/TextStyle';

import { tab } from '../../Conclusion.constants';

import useGetAssesmentSummaryList from './hooks/useGetAssesmentSummaryList';
import useGetDetailConclusion from './hooks/useGetDetailConclusion';
import useSaveConclusion from './hooks/useSaveConclusion';
import { tableHeaderChild, tableHeaderGrandChild, tableHeaderList } from './TabAssessmentSummary.constants';

import type { TableHeaderVerification } from './components/TableDocumentVerification/TableDocumentVerification.types';


const useTabAssessmentSummary = ({ handleNextTab }) => {
  const { viewOnly } = useViewOnly();
  const { processId } = useIdentity();
  const pathname = usePathname();
  const router = useCustomRouter();
  const { setDirtyMsg } = useContext(DirtyContext);
  const [isSummaryHighRisk, setIsSummaryHighRisk] = useState(false);
  const [container, setContainer] = useState(null);

  const {
    data: conclusionData,
    isLoading: isDetailConclusionLoading,
    isSuccess: isDetailConclusionSuccess,
  } = useGetDetailConclusion({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  useEffect(() => {
    if (isDetailConclusionSuccess) {
      setIsSummaryHighRisk(conclusionData?.summaryHighRisk);
    }
  }, [conclusionData]);

  const { data: customerDueListData, isLoading: isCustomerDueListLoading } = useGetAssesmentSummaryList({
    bucketProcessId: processId,
    module: TypeModule.HIGH_RISK,
    process: TypeProcess.HIGH_RISK_DK,
  });

  const tableData = customerDueListData?.map((item) => ({
    ...item,
    document: item.document ?? '-',
  }));

  const { mutate: saveConclusion, isPending: isSaveLoading } = useSaveConclusion({
    onError: () => {
      showNiceModalV2({
        title: 'Data gagal disimpan',
        type: 'error',
      });
    },
    onSuccess: () => {
      setDirtyMsg(undefined);
    },
  });

  const handleOpenEdit = (id: string) => {
    router.push(replacePath(`${pathname}/edit/${id}`, { processId }));
  };

  const handleSave = async ({ goToNext }: {goToNext?: boolean}) => {
    const description = await convertToDocx(container);

    saveConclusion({
      bucketProcessId: processId,
      description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      summaryHighRisk: isSummaryHighRisk,
    }, {
      onSuccess: () => {
        showNiceModalV2({
          onClose: () => {
            goToNext ? handleNextTab(tab.CDD_IMPLEMENTATION) : undefined;
          },
          title: 'Data berhasil disimpan',
          type: 'success',
        });
      },
    });

  };

  const hasChildList = (row: any) => row?.childList?.length > 0;
  const generateTableHeader = useMemo(() => [
    {
      key: 'assessmentSummary',
      label: 'Assessment Summary',
      render: (row) =>
        !hasChildList(row) ? (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {row.assessmentSummary ? 'Ya' : row.assessmentSummary === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ) : null,
      sx: { width: '10%' },
    },
    {
      key: 'verificationSummary',
      label: 'Verification Summary',
      render: (row) =>
        !hasChildList(row) ? (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {row.verificationSummary ? 'Ya' : row.verificationSummary === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ) : null,
      sx: { width: '10%' },
    },
    {
      key: 'isDkCheck',
      label: 'Konfirmasi DK',
      render: (row) =>
        !hasChildList(row) ? (
          <ColumnWrapper>
            <TextStyle variant="body4" textAlign="center">
              {row.isDkCheck ? 'Ya' : row.isDkCheck === null ? '-' : 'Tidak'}
            </TextStyle>
          </ColumnWrapper>
        ) : null,
      sx: { width: '10%' },
    },
  ], [processId]);

  const buildTableHeader = (
    base: TableHeaderVerification[],
  ): TableHeaderVerification[] => {
    return [
      ...base,
      ...generateTableHeader,
      {
        key: 'action',
        label: 'Action',
        render: (row) =>
          !hasChildList(row) ? (
            <IconButton
              iconName="edit"
              isDisabled={hasChildList(row) || viewOnly}
              onClick={() => handleOpenEdit(row.id)}
            />
          ) : null,
        sx: { minWidth: '4vw' },
      },
    ];
  };

  const tableHeader = buildTableHeader(tableHeaderList);
  const tableHeadChildVerif = buildTableHeader(tableHeaderChild);
  const tableHeadGrandChildVerif = buildTableHeader(tableHeaderGrandChild);

  const autoSavePayload = useMemo(() => async () => {

    const description = await convertToDocx(container);

    return {
      bucketProcessId: processId,
      description,
      module: TypeModule.HIGH_RISK,
      process: TypeProcess.HIGH_RISK_DK,
      summaryHighRisk: isSummaryHighRisk,
    };
  }, [container, processId, isSummaryHighRisk]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    config: {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
    isActive: !viewOnly && isDetailConclusionSuccess && !!processId,
    payload: autoSavePayload,
    url: 'mip.hr.saveConclusion',
  });

  return {
    conclusionData,
    container,
    handleOpenEdit,
    handleSave,
    isAutoSaveFetching,
    isCustomerDueListLoading,
    isDetailConclusionLoading,
    isSaveLoading,
    isSummaryHighRisk,
    setContainer,
    setIsSummaryHighRisk,
    tableData,
    tableHeadChildVerif,
    tableHeadGrandChildVerif,
    tableHeader,
  };
};

export default useTabAssessmentSummary;
