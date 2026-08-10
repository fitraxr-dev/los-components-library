'use client';

import * as React from 'react';

import { Box } from '@mui/material';

import { risalahRapat } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetConsentSheetList from './hooks/useGetConsentSheetList';

import type { ConsentSheetListUser } from './hooks/useGetConsentSheetList';


const renderMemberInfo = (row: ConsentSheetListUser) => (
  <ColumnWrapper sx={{ height: '150px' }}>
    <TextStyle variant="body3" weight={700}>
      {row.staffName}
    </TextStyle>
    <TextStyle variant="body4" weight={600}>
      {row.jobPositionLabel} {row.divisionLabel}
    </TextStyle>
  </ColumnWrapper>
);

const renderSignatureInfo = (row: ConsentSheetListUser) => (
  <ColumnWrapper>
    <Box sx={{ height: '100px' }} />
    {row.sku && (
      <ColumnWrapper sx={{ justifyContent: 'end' }}>
        <TextStyle variant="body3" weight={400}>
          Nomor SKU: {row.sku?.skuNo}
        </TextStyle>
        <TextStyle variant="body3" weight={400}>
          Tanggal SKU: {row.sku?.skuDate}
        </TextStyle>
        <TextStyle variant="body3" weight={400}>
          Nama: {row.sku?.staffName}
        </TextStyle>
        <TextStyle variant="body3" weight={400}>
          Jabatan: {row.sku?.jobPositionLabel} {row.sku?.divisionLabel}
        </TextStyle>
      </ColumnWrapper>
    )}
  </ColumnWrapper>
);

const usePreviewAcknowledgementSheet = () => {
  const router = useCustomRouter();
  const { processId } = useIdentity();

  const { data: consentSheetData, isLoading: isConsentSheetLoading } = useGetConsentSheetList({
    bucketProcessId: processId,
    from: 'PREVIEW',
  }, {
    select: (data) => {
      const sections = data?.content?.listDivision ?? [];
      const sortedData = [...sections]
        .sort((a, b) => a.sequence - b.sequence)
        .map((sec) => ({
          ...sec,
          listUser: (sec.listUser ?? [])
            .sort((a, b) => a.sequence - b.sequence),
        }));

      return sortedData;
    },
  });

  const createTableHeader = React.useCallback((title: string) => {
    return [
      {
        key: 'member',
        label: title,
        render: renderMemberInfo,
        sx: { minWidth: '40vw' },
      },
      {
        key: 'signature',
        label: 'Tanda Tangan',
        render: renderSignatureInfo,
        sx: { minWidth: '20vw' },
      },
    ];
  }, []);

  const tableSections = React.useMemo(() => {
    return (consentSheetData ?? []).map((section, index) => ({
      data: section.listUser ?? [],
      header: createTableHeader(section.divisionName),
      key: section.id ?? section.divisionName ?? index,
    }));
  }, [consentSheetData]);

  const handleClose = React.useCallback(() => {
    const nextPath = replacePath(risalahRapat.FINANCING_COMMITTEE_PAGE, { processId });
    router.push(nextPath);
  }, [processId, router]);

  return {
    handleClose,
    isAssignedUserLoading: isConsentSheetLoading,
    tableSections,
  };
};

export default usePreviewAcknowledgementSheet;
