import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';

import { MODAL_ID } from '../../ReportingListRoutine.constants';

import useCreateNewSubReport from './CreateNewSubReport.hooks';

import type { CreateNewSubReportProps } from './CreateNewSubReport.types';


const CreateNewSubReport = NiceModal.create((props: CreateNewSubReportProps) => {
  const modalId = MODAL_ID.CREATE_SUB_REPORT;
  const modal = useModal(modalId);

  const { watch,
    setValue,
    handleSubmit,
    handleSaveRoutineSubReporting,
    isSaveLoadingSubReporting } = useCreateNewSubReport(props);

  return (
    <SectionModal
      title={watch('id') ? 'Edit Sub Laporan' : 'Add New Sub Laporan'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input label="Sub Laporan" placeholder="Masukan Sub Laporan" value={watch('report')} onChange={(e) => setValue('report', e)} />
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit(handleSaveRoutineSubReporting)}
          isLoading={isSaveLoadingSubReporting}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>
  );
},
);

export default CreateNewSubReport;
