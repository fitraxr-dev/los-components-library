import React from 'react';

import { useParams } from 'next/navigation';

import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocumentV2';
import WordEditor from '@/components/shared/WordEditor';

import useGetFollowUp from '../../hooks/useGetFollowUp';
import useBarInformation from '../../Information.hook';


const FollowUp = () => {
  const { processId }: { processId: string } = useParams();

  const {
    isNew,
    canCreateBAR,
    canDownloadBAR,
    canEditBAR,
    canViewBAR,
    canDeleteBAR,
    isBarCreation,
    renderActionButtons,
    followUpContainer,
    setFollowUpContainer,
    businesCallContainer,
    setBusinessCallContainer,
    renderActions,
    isViewOnly,
  } = useBarInformation();

  const { data: followUpData, isLoading: followUpIsLoading } = useGetFollowUp({
    bucketProcessId: processId,
    module: TypeModule.BAR,
    process: TypeProcess.BAR,
  });

  const isReadOnlyBar = (canViewBAR === true)
    && (canDownloadBAR === true)
    && (canEditBAR === false)
    && (canDeleteBAR === false);

  return (
    <ColumnWrapper marginTop={3} sx={{ gap: 3 }}>
      <SectionTitle title="Pembahasan dalam Business Call" />
      <WordEditor
        id="discussion"
        container={businesCallContainer}
        setContainer={setBusinessCallContainer}
        isReadOnly={isNew || !isBarCreation || !canCreateBAR || !canEditBAR || isViewOnly}
        isLoading={followUpIsLoading}
        initialValue={followUpData?.discussion}
      />
      <SectionTitle title="Follow Up Items List" />
      <WordEditor
        id="followup"
        container={followUpContainer}
        setContainer={setFollowUpContainer}
        isReadOnly={isNew || !isBarCreation || !canCreateBAR || !canEditBAR || isViewOnly}
        isLoading={followUpIsLoading}
        initialValue={followUpData?.followUp}
      />
      {/* <SectionTitle title="Upload Dokumen" /> */}
      <TableUploadDocument
        module={TypeModule.BAR}
        process={TypeProcess.BAR}
        isReadOnly={isReadOnlyBar}
        actions={renderActions}
      />
      {!isNew ?
        <RowWrapper sx={{ gap: 2, justifyContent: 'end' }}>
          {renderActionButtons()}
        </RowWrapper> : null}
    </ColumnWrapper>
  );
};

export default FollowUp;
