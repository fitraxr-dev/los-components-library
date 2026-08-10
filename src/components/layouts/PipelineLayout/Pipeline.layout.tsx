'use client';
import { useParams, usePathname, useSearchParams } from 'next/navigation';

import { pipeline } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { matchesPathname, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { PipelineProvider } from './Pipeline.context';


const PipelineLayout = ({ children }) => {
  const { processId, debtorId, groupId } = useParams();
  const path = usePathname();
  const router = useCustomRouter();

  const projectPath = replacePath(pipeline.PROJECT_PAGE, { debtorId, processId });
  const managementShareholderPath = replacePath(pipeline.MANAGEMENT_SHAREHOLDER_PAGE, { processId });
  const groupPath = replacePath(pipeline.GROUP_PAGE, { debtorId, processId });
  const groupCreateNewPath = replacePath(pipeline.NEW_GROUP_PAGE, { debtorId, processId });
  const groupDetailPath = replacePath(pipeline.GROUP_DETAIL_PAGE, { debtorId, groupId, processId });

  const ignorePath = [
    pipeline.LIST_PAGE,
    pipeline.NEW_PAGE,
    projectPath,
    groupPath,
    groupDetailPath,
    managementShareholderPath,
    groupCreateNewPath,
  ];

  const isProjectPath = matchesPathname(path, projectPath);
  const isManagementShareholderPath = matchesPathname(path, managementShareholderPath);
  const isGroupPath = matchesPathname(path, groupPath);
  const isCreateNewGroupPath = matchesPathname(path, groupCreateNewPath);
  const isGroupDetailPath = matchesPathname(path, groupDetailPath);
  const renderDetailPage = !ignorePath.includes(path);
  const { redirectToFromPage } = useNavigationFromPage();
  const handleBack = () => {
    if (redirectToFromPage()) return;
    renderDetailPage ? router.push(pipeline.LIST_PAGE) : router.back();
  };

  return (
    <PipelineProvider>
      {
        renderDetailPage
          || isProjectPath
          || isGroupPath
          || isGroupDetailPath
          || isCreateNewGroupPath
          || isManagementShareholderPath ? <BackButton handleClick={handleBack} /> : null}
      <BaseContainer>
        {
          renderDetailPage ? (
            <StepperV2
              module={TypeModule.PIPELINE}
              process={TypeProcess.PIPELINE}
            />
          ) : null
        }
        {children}
      </BaseContainer>
    </PipelineProvider>
  );
};

export default PipelineLayout;
