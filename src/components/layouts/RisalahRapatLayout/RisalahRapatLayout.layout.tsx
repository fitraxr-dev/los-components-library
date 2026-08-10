'use client';

import * as React from 'react';

import { usePathname } from 'next/navigation';

import { risalahRapat } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';

import BackButton from '@/components/shared/BackButton';
import BaseContainer from '@/components/shared/BaseContainer';
import StepperV2 from '@/components/shared/StepperV2';

import { RisalahRapatProvider } from './RisalahRapatLayout.context';
import useRisalahRapatLayout from './RisalahRapatLayout.hooks';


const RisalahRapatLayout = ({ children }) => {
  const router = useCustomRouter();
  const path = usePathname();
  const segments = path.split('/').filter(Boolean);

  const { renderDetailLayout } = useRisalahRapatLayout();
  const { redirectToFromPage } = useNavigationFromPage();
  const isAttachment = React.useMemo(() => segments.includes('attachment'), [segments]);
  const isAddOrEdit = React.useMemo(
    () => segments.some((s) => s === 'add' || s === 'edit'),
    [segments],
  );
  const isPreview = React.useMemo(
    () => segments.includes('preview-acknowledgement-sheet'),
    [segments],
  );

  const handleBack = React.useCallback(() => {
    if (redirectToFromPage()) return;
    if ((isAttachment && isAddOrEdit) || isPreview) {
      router.back();
      return;
    }

    router.push(risalahRapat.DRAFT_LIST_PAGE);
  }, [isAttachment, isAddOrEdit, isPreview, router]);

  return (
    <RisalahRapatProvider>
      {renderDetailLayout && <BackButton handleClick={handleBack} />}
      <BaseContainer>
        {renderDetailLayout && (
          <StepperV2 module={TypeModule.RISALAH_RAPAT} process={TypeProcess.RISALAH_RAPAT} />
        )}
        {children}
      </BaseContainer>
    </RisalahRapatProvider>
  );
};

export default RisalahRapatLayout;
