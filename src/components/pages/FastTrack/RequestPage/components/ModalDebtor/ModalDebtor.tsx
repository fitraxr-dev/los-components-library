'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import Loader from '@/components/shared/Loader';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../Request.constants';

import { useModalDebtor } from './ModalDebtor.hook';


const ModalDebtor = NiceModal.create(({
  state,
  setState,
}: any
) => {
  const modalId = modal.DEBTOR;
  const { visible } = useModal(modalId);


  const {
    data,
    filterContentList,
    filterDropdownList,
    debtorList,
    filter,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    handleSubmit,
    isValidateCheckDkSucces,
    labelCheckDk,
    openModalDk,
    colorCheckDkIcon,
    colorCheckDk,
    dataValidateCheckDk,
    theme,
    isShowBtnAddnew,
  } = useModalDebtor(modalId);

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      {isShowBtnAddnew &&
      <Button
        disabled={isLoading || !selected.length}
        onClick={() => handleSubmit()}
      >
        New Request
      </Button>}
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
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />
      {isValidateCheckDkSucces && selected?.length > 0 &&
        <RowWrapper
          gap={1}
          justifyContent="space-between"
          sx={{
            backgroundColor: colorCheckDk,
            borderRadius: theme.spacing(1),
            px: theme.spacing(2),
            py: theme.spacing(1),
          }}
        >
          <RowWrapper alignItems="center">
            <Icon
              iconName="warning-2"
              textVariant="title1"
              sx={{
                marginRight: theme.spacing(2),
                path: {
                  fill: colorCheckDkIcon,
                },
              }}
            />
            <TextStyle
              variant="body4"
              fontWeight={400}
            >
              {labelCheckDk}
            </TextStyle>
          </RowWrapper>
          {dataValidateCheckDk?.hasSimilar &&
          <RowWrapper>
            <Button variant="outlined" size="small" onClick={openModalDk}>
              View Data Details
            </Button>
          </RowWrapper>}
        </RowWrapper>}
      <Table
        isPaper
        isLoading={isLoading}
        tableHeader={tableHeader}
        tableData={debtorList}
        totalPage={data?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalDebtor;
