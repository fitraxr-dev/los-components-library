import { create, useModal } from '@ebay/nice-modal-react';

import { MODAL } from '@/configs/constants/modalId';
import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import Button from '../../Button';
import RowWrapper from '../../RowWrapper';

import { tableHeader } from './ModalStatusPk.constants';
import useModalStatusPk from './ModalStatusPk.hook';

import type { ModalStatusPkProps } from './ModalStatusPk.types';


const ModalStatusPk = create((props: ModalStatusPkProps) => {
  const modalId = MODAL.STATUS_PK;
  const modal = useModal(modalId);
  const { contentDataList, isLoading } = useModalStatusPk(props);

  return (
    <SectionModal
      title="Status PK"
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{
        minWidth: '80vw',
      }}
    >
      <BaseContainer sx={{ boxShadow: 7 }}>
        <Table
          isLoading={isLoading}
          tableHeader={tableHeader}
          tableData={contentDataList}
        />
      </BaseContainer>
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button variant="outlined" onClick={() => closeNiceModal(modalId)}>Close</Button>
      </RowWrapper>
    </SectionModal>
  );
});


export default ModalStatusPk;
