'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import CheckBox from '@/components/shared/CheckBox';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { modal } from '../../Request.constants';

import { useModalDebtor } from './ModalDebtor.hook';


const ModalDebtor = NiceModal.create(({ }) => {
  const modalId = modal.DEBTOR;
  const { visible } = useModal(modalId);

  const {
    bucketStatus,
    data,
    debtorValidation,
    filter,
    filterContentList,
    filterDropdownList,
    debtorList,
    isLoading,
    isCheckingStatus,
    isNewRequestDisabled,
    openModalSimilarDebtor,
    page,
    retrieveFromLatest,
    selected,
    setFilter,
    setPage,
    setPageSize,
    setRetrieveFromLatest,
    shouldShowRetrieveCheckbox,
    shouldShowValidationMessage,
    tableHeader,
    theme,
    validationColor,
    validationIconColor,
    validationLabel,
    handleSubmit,
  } = useModalDebtor(modalId);

  const footer = (
    <RowWrapper sx={{ flexDirection: 'column', gap: 2, mt: 2 }}>
      <RowWrapper sx={{ alignItems: 'end', flexDirection: 'column', gap: 1, justifyContent: 'end' }}>
        {shouldShowRetrieveCheckbox && (
          <CheckBox
            checked={retrieveFromLatest}
            onChange={(checked) => setRetrieveFromLatest(checked)}
            label="Retrieved dari Request Kajian Teknis Terakhir?"
          />
        )}
        <Button
          disabled={isLoading || isNewRequestDisabled}
          onClick={() => handleSubmit()}
        >
          New Request
        </Button>
      </RowWrapper>
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
      {shouldShowValidationMessage && selected?.length > 0 && (
        <RowWrapper
          gap={1}
          justifyContent="space-between"
          sx={{
            backgroundColor: validationColor,
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
                  fill: validationIconColor,
                },
              }}
            />
            <TextStyle
              variant="body4"
              fontWeight={400}
            >
              {validationLabel}
            </TextStyle>
          </RowWrapper>
          {debtorValidation?.hasSimilar && (
            <RowWrapper>
              <Button variant="outlined" size="small" onClick={openModalSimilarDebtor}>
                View Data Details
              </Button>
            </RowWrapper>
          )}
        </RowWrapper>
      )}
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
