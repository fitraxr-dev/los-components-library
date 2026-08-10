import { create } from '@ebay/nice-modal-react';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { tableHeaderList } from './ModalTableDK.constants';
import useModalTableDk from './ModalTableDK.hook';

import type { ModalTableDkProps } from './ModalTableDK.types';


const ModalTableDK = create((props: ModalTableDkProps) => {
  const {
    handleOpenAddNewModal,
    modalId,
    theme,
    visible,
  } = useModalTableDk();

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
export default ModalTableDK;
