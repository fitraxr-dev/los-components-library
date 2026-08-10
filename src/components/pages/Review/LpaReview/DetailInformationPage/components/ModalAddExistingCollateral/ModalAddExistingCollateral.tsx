'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { mockModalCollateralExisting } from '../../../__mock_data__/mockDetailInformationPage';
import { modal } from '../../DetailInformation.constants';

import { useModalDebtor } from './ModalAddExistingCollateral.hook';


const ModalAddExistingCollateral = NiceModal.create(() => {
  const modalId = modal.ADD_EXISTING_COLLATERAL;
  const { visible } = useModal(modalId);

  const router = useCustomRouter();

  const {
    // data,
    filterContentList,
    filterDropdownList,
    isLoading,
    filter,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
  } = useModalDebtor();

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={isLoading || !selected.length}
        sx={{ mr: 1 }}
        onClick={() => {}}
      >
        Save
      </Button>
      <Button
        color="info"
        disabled={isLoading || !!selected.length}
        onClick={() => {
          closeNiceModal(modalId);
          NiceModal.show(modal.ADD_NEW_COLLATERAL);
        }}
      >
        Add New Agunan
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '75vw',
        minWidth: '75vw',
      }}
      customFooter={footer}
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={[]}
        totalPage={null}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalAddExistingCollateral;
