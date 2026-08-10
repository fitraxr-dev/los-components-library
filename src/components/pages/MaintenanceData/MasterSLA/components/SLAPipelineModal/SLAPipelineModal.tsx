import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import tableHeader from '@/components/pages/SPFP/MonitoringPage/components/TableHeader';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../constants';
import { data } from '../../DetailPage/components/ApprovalModal/ApprovalModal.constants';


const SLAPipelineModal = NiceModal.create((
  { existing }: any) => {
  const theme = useTheme();
  const modalId = modal.SLA_PIPELINE_MODAL;
  const niceModal = useModal(modalId);
  const isEdit = false;
  return (
    <SectionModal
      title={`${isEdit ? 'Edit' : 'Add'} Master SLA Pipeline`}
      isOpen={niceModal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '52vw' }}
    >
      <ColumnWrapper gap={theme.spacing(3)}>
        <Input
          type="dropdown"
          value=""
          // disabled={true}
        />
        <RowWrapper sx={{ flexFlow: 'row wrap' }}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
            sx={{ flex: '1 1 100%', mb: '0.4em' }}
          >SLA Deadline
          </TextStyle>
          <Box
            sx={{ flex: '1 1 0', mr: '.7em' }}
          >
            <Input
              type="text"
              value=""
            />
          </Box>
          <ColumnWrapper sx={{ justifyContent: 'center' }}>
            <TextStyle>hari</TextStyle>
          </ColumnWrapper>
        </RowWrapper>
        <Input
          label="Active"
          type="checkbox"
          checkboxList={[
            {
              label: 'Ya',
              value: 'ya',
            },
            {
              label: 'Tidak',
              value: 'tidak',
            },
          ]}
          // disabled={true}
        />
        <RowWrapper py={3} gap={2} justifyContent="end">
          <Button
            variant="outlined"
            onClick={() => closeNiceModal(modalId)}
            // disabled={isSaveLoading}
          >
            Cancel
          </Button>
          <Button
            color="darkBlue"
          >
            Save
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
},
);

export default SLAPipelineModal;
