import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { date } from 'yup';

import { toDayString, toDaysDateString } from '@/helpers/date';
import { downloadFile } from '@/helpers/utils';
import closeNiceModal from '@/hooks/useCloseNiceModal';


import Button from '@/components/shared/Button';
import Cell from '@/components/shared/Cell';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';


import { MODAL_ID } from '../../Review.constants';

import useModalDetailInformationLpa from './ModalDetailInformationLpa.hooks';


const ModalDetailInformationLpa = NiceModal.create(({ id }: { id: string }) => {
  const modalId = MODAL_ID.LPA_DETAIL;
  const modal = useModal(modalId);
  const theme = useTheme();

  const { data } = useModalDetailInformationLpa(id);

  return (
    <SectionModal
      title="Detail Informasi LPA"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper sx={{ gap: 3 }} width="100%">
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(2),
            gridTemplateColumns: '1fr',
          }}
        >
          <Cell title="Nama KJPP" value={data?.kjpp} />
          <Cell title="Nomor Laporan" value={data?.reportNo} />
          <Cell title="Tanggal Laporan " value={toDaysDateString(data?.reportDate)} />
          <Cell title="Tanggal Penilaian" value={toDaysDateString(data?.assessmentDate)} />
          <Cell
            title="Keterangan"
            value={data?.remark}
          />

          <Cell title="Upload Date" value={toDaysDateString(data?.document?.modifiedDate)} />

          <Cell
            title="Upload By"
            value={data?.document?.modifiedBy}
          />

          <Cell
            title="Group Dokumen"
            value={data?.document?.documentGroupLabel}
          />
          <Cell
            title="Upload Dokumen"
            value={data?.document?.documentName}
            buttons={[
              {
                action: () => downloadFile(data?.document?.document, data?.document?.fileName),
                iconName: 'download',
                label: 'Download',
              },
            ]}
          />
          <Cell title="Jenis Dokumen" value={data?.document?.documentTypeLabel} />
          <Cell title="Nama Dokumen" value={data?.document?.documentName} />
          <Cell title="Nomor Dokumen" value={data?.document?.documentNumber} />
          <Cell title="Tanggal Dokumen" value={toDaysDateString(data?.document?.documentDate)} />
        </Box>
      </ColumnWrapper>

      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          variant="outlined"
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Cancel
        </Button>
      </RowWrapper>
    </SectionModal >
  );
});

export default ModalDetailInformationLpa;
