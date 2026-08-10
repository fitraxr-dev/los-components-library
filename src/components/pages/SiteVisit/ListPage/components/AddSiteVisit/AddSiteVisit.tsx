'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modalSiteVisit } from '../../List.constants';

import { useAddSiteVisit } from './AddSiteVisit.hook';

import type { SiteVisitContextType } from '@/components/layouts/SiteVisitLayout/SiteVisit.context';


const ModalAddNewSiteVisit = NiceModal.create(({
  state,
  setState,
}: SiteVisitContextType
) => {
  const modalId = modalSiteVisit.ADD_NEW_SITE_VISIT;
  const modal = useModal(modalId);

  const {
    tableData,
    tablePage,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    handleSubmit,
  } = useAddSiteVisit(modalId);

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={isLoading || !selected.length}
        onClick={handleSubmit}
      >
        Add Site Visit
      </Button>
    </RowWrapper>
  );

  return (
    <SectionModal
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      containerSx={{
        maxHeight: '75vh',
        maxWidth: '83vw',
        minWidth: '83vw',
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
        tableData={tableData}
        totalPage={tablePage?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalAddNewSiteVisit;
