'use client';

import * as React from 'react';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useCustomRouter from '@/hooks/useCustomRouter';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import useMasterParameter from '@/components/layouts/MasterParameterLayout/MasterParameter.hook';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDocumentUpdates from '@/components/shared/SmiComponent/AlertDocumentUpdates';
import TableDocumentVerification from '@/components/shared/SmiTable/TableDocumentVerification';
import Title from '@/components/shared/Title';

import useGetParameterGroupPreview from './hooks/useGetParameterGroupPreview';
import { tableHeaderChild, tableHeaderGrandChild, tableHeaderParent } from './Preview.constant';


const PreviewPage = () => {
  const router = useCustomRouter();

  const { processId, isBucketProcessId } = useMasterParameter();
  const { push, reset } = useBreadcrumbs();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-beneficial-owner', label: 'Parameter Beneficial Owner' });
    push({ href: `/${processId}/preview`, label: 'Preview' });
  }, [push, reset]);

  const { data: parameterGroupPreviewData, isLoading } = useGetParameterGroupPreview(
    isBucketProcessId
      ? { bucketProcessId: processId }
      : { feature: processId }
  );

  return (
    <ColumnWrapper gap={3}>
      <Title title="Beneficial Owner" />

      <AlertDocumentUpdates
        module={TypeModule.APU_PPT}
        process={TypeProcess.APU_PPT}
        document="BENEFICIAL_OWNER"
        applicationCategory={processId}
        message="Terdapat Perubahan Data di Tab Beneficial Owner"
      />

      <BaseContainer sx={{ boxShadow: 7 }}>
        <TableDocumentVerification
          isLoading={isLoading}
          tableHeader={tableHeaderParent}
          tableData={parameterGroupPreviewData?.contents}
          tableHeaderChild={tableHeaderChild}
          tableHeaderGrandChild={tableHeaderGrandChild}
        />
      </BaseContainer>
      <Input
        label="Keterangan"
        placeholder="Input Keterangan"
        type="area"
        minRows={4}
        disabled
      />

      <RowWrapper py={3} justifyContent="end">
        <Button
          variant="outlined"
          onClick={() => router.back()}
        >
          Close
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default PreviewPage;
