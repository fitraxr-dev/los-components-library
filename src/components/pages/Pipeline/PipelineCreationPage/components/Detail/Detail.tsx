'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import { CircularProgress } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TablePaymentFacility from '@/components/shared/SmiTable/TablePaymentFacility';

import ModalNotificationFastTrack from '../ModalNotificationFastTrack';
import ModalRefina from '../ModalRefinaPipeline';
import PipelineTitle from '../PipelineTitle';

import useDetail from './Detail.hooks';


const Detail = () => {
  const {
    pipelineDetail,
    renderForm,
    viewOnly,
    isLoading,
    renderActionButtons,
    isPemda,
    refinaId,
    validateResult,
  } = useDetail();

  const hasValidRefinaId = refinaId && refinaId !== 'null';

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <PipelineTitle
        isViewOnly={viewOnly}
        isPemda={isPemda}
        debtorId={pipelineDetail?.debtorId}
        groupId={pipelineDetail?.groupId}
        isExisting={pipelineDetail?.isNewClient}
        result={validateResult?.content?.result}
        isInvalid={validateResult?.content?.invalid}
      />
      {isLoading ?
        <ColumnWrapper sx={{ alignItems: 'center', height: '15vh', justifyContent: 'center' }}>
          <RowWrapper sx={{ alignItems: 'center', height: '100%', justifyContent: 'center' }}>
            <CircularProgress
              color="primary"
            />
          </RowWrapper>
        </ColumnWrapper>
        :
        <>
          {renderForm}
          {!hasValidRefinaId && (
            <TablePaymentFacility
              module={TypeModule.PIPELINE}
              process={TypeProcess.PIPELINE}
              typeProcess={pipelineDetail?.typeProcess}
            />
          )}
          <RowWrapper sx={{ gap: 1, justifyContent: 'end', mt: 3, py: 3 }}>
            {renderActionButtons}
          </RowWrapper>
        </>
      }
      <ModalDef
        id={MODAL.SYNC_WITH_REFINA}
        component={ModalRefina}
      />
      <ModalDef
        id={MODAL.FAST_TRACK.NOTIFICATION}
        component={ModalNotificationFastTrack}
      />
    </ColumnWrapper>
  );
};

export default Detail;
