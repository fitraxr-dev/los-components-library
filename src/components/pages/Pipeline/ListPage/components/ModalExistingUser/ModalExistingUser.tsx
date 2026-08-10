'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { useModalExistingUser } from './ModalExistingUser.hook';

import type { ModalExistingUserProps } from './ModalExistingUser.constant';


const ModalExistingUser = NiceModal.create((props: ModalExistingUserProps) => {
  const modalId = MODAL.EXISTING_USER;
  const { visible } = useModal(modalId);
  const { similarDebtorList } = props;

  const {
    dkValidation,
    dkStatus,
    handleCreateNewDebiturAndPipeline,
    selected,
    tableHeader,
    handleCreatePipelineWithExisting,
    handleViewData,
  } = useModalExistingUser(props);

  const footer = (
    <RowWrapper sx={{ gap: '24px', justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={!!selected || dkStatus === 'isDuplicated'}
        onClick={handleCreateNewDebiturAndPipeline}
      >
        Create New Customer & Pipeline
      </Button>
      <Button
        disabled={!selected || dkStatus === 'isDuplicated'}
        onClick={handleCreatePipelineWithExisting}
      >
        Create Pipeline
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '90vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
      title="Rekomendasi Nama Customer"
    >
      <DKWarningToast
        status={dkStatus}
        title={dkValidation?.errorMessage }
        handleViewData={handleViewData}
      />
      <Table
        isPaper
        tableHeader={tableHeader}
        tableData={similarDebtorList}
      />
    </SectionModal>
  );
});


export default ModalExistingUser;


const DKWarningToast = (props: {
  status: 'isDuplicated' | 'isSimilar' | undefined;
  title: string;
  handleViewData: () => void;
}) => {
  const { status, handleViewData, title } = props;

  if (status === undefined) return <></>;

  let content = null;

  switch (status) {
    case 'isDuplicated':
      content = {
        icon: 'warning-1',
        statusColor: {
          bgcolor: '#FCE8E8',
          border: '1px solid #EB5757',
        },
        textStatus: 'Terdaftar dalam database DK. Proses tidak dapat dilanjutkan.',
      };
      break;
    case 'isSimilar':
      content = {
        icon: 'warning-2',
        statusColor: {
          bgcolor: '#FFF9E5',
          border: '1px solid #F6C000',
        },
        textStatus: 'Terdapat kemiripan dengan database DK.',
      };
      break;
  }


  return (
    <Box
      sx={{
        alignItems: 'center',
        bgcolor: '#FCE8E8',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: '16px',
        ...content?.statusColor,
      }}
    >
      <RowWrapper gap="16px">
        <Icon
          sx={{
            height: '1.25vw',
            width: '1.25vw',
          }}
          iconName={content?.icon}
        />
        <TextStyle
          variant="body4"
          weight={500}
          color="text.secondary"
        >
          {title}
        </TextStyle>
      </RowWrapper>
      {status === 'isSimilar' &&
        <Button variant="outlined" onClick={handleViewData}>
          View Data Details
        </Button>}
    </Box>
  );
};
