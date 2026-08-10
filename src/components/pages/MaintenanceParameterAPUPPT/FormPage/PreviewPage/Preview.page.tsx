'use client';

import * as React from 'react';

import { useParams, useRouter } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDocumentVerification from '@/components/shared/SmiTable/TableDocumentVerification';
import Title from '@/components/shared/Title';

import useGetParameterGroupPreview from './hooks/useGetParameterGroupPreview';
import { tableHeaderChild, tableHeaderGrandChild, tableHeaderParent } from './Preview.constant';


const PreviewPage = () => {
  const router = useRouter();
  const params = useParams();
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  // Get route params
  const routeId = (params as any)?.id;
  const routeGroupId = (params as any)?.groupId;
  const routeProcessId = (params as any)?.processId;
  const routeMode = (params as any)?.mode;
  const routeModeGroup = (params as any)?.modeGroup;
  const routeModeSubItem = (params as any)?.modeSubItem;

  // Handle processId - can be 'null' string for detail mode
  const effectiveProcessId = routeProcessId === 'null' ? null : routeProcessId;

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ href: `/${routeId}/preview`, label: 'Preview' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: effectiveProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/preview',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Preview page',
    });
  }, [push, reset, recordActivity, routeId, effectiveProcessId]);

  const { data: parameterGroupPreviewData, isLoading } = useGetParameterGroupPreview(
    effectiveProcessId
      ? { bucketProcessId: effectiveProcessId, id: routeGroupId }
      : { feature: routeGroupId }
  );

  const handleBack = () => {
    // Record back navigation activity
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: effectiveProcessId || '',
      changeAfter: '',
      changeBefore: '',
      menuCode: 'parameter-mapping-apu-ppt',
      module: 'parameter-mapping-apu-ppt',
      process: routeId?.toString() || '',
      remarks: 'Navigate back from Preview',
    });

    // Navigate back based on the route structure
    if (routeModeGroup && routeModeSubItem && routeGroupId) {
      // If coming from add-group flow, go back to the add-group page
      const addGroupPath =
        `/master-parameter/parameter-mapping-apu_ppt/${routeId}/${routeProcessId || 'null'}/${routeMode}/process/${routeModeGroup}/add-group/${routeModeSubItem}`;
      router.push(addGroupPath);
    } else if (routeProcessId && routeMode) {
      // If coming from process flow, go back to the process page
      const processPath =
        `/master-parameter/parameter-mapping-apu_ppt/${routeId}/${routeProcessId}/${routeMode}/process`;
      router.push(processPath);
    } else {
      // If coming from edit flow or other cases, use default router.back()
      router.back();
    }
  };

  return (
    <ColumnWrapper gap={3}>
      <Title title="Parameter Mapping APU PPT - Preview" />
      <BaseContainer sx={{ boxShadow: 7 }}>
        <TableDocumentVerification
          isLoading={isLoading}
          tableHeader={tableHeaderParent}
          tableData={parameterGroupPreviewData?.contents}
          tableHeaderChild={tableHeaderChild}
          tableHeaderGrandChild={tableHeaderGrandChild}
        />
      </BaseContainer>
      <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
        <Button variant="outlined" onClick={handleBack}>
          Back
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default PreviewPage;
