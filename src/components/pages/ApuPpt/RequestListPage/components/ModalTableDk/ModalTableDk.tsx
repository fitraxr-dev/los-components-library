import { create, useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';


import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../RequestList.constants';

import { tableHeaderList } from './ModalTableDk.constants';
import useModalTableDk from './ModalTableDk.hook';

import type { ModalTableDkProps } from './modalTableDk.types';
import type { DebtorListResponseDto } from '@/services/openapi/master-service';


const ModalTableDk = create((props: ModalTableDkProps) => {
  const theme = useTheme();
  const modalId = modal.MODAL_TABLE_DK;
  const { visible } = useModal(modalId);

  const { handleOpenAddNewModal } = useModalTableDk();


  return (
    <SectionModal
      isOpen={visible}
      onClose={handleOpenAddNewModal}
      customFooter={() => null}
      containerSx={{ minWidth: '85vw' }}
      title="Data List from Database DK"
    >
      <ColumnWrapper sx={{ gap: theme.spacing(3) }}>
        <BaseContainer sx={{ boxShadow: theme.shadows[10] }}>
          <Table
            tableHeader={tableHeaderList}
            tableData={props?.dataTable || []}
          />
        </BaseContainer>
        <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
          <Button
            variant="outlined"
            onClick={handleOpenAddNewModal}
          >
            Close
          </Button>
        </RowWrapper>
      </ColumnWrapper>
    </SectionModal>
  );
});

export default ModalTableDk;
