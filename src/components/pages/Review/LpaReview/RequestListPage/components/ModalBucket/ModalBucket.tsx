'use client';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';

import { pipeline } from '@/configs/constants/pathname';
import closeNiceModal from '@/hooks/useCloseNiceModal';
import useCustomRouter from '@/hooks/useCustomRouter';

import Button from '@/components/shared/Button';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';

import { MODAL_ID } from '../../RequestList.constant';
import { ModalSimilarDebtor } from '../ModalSimilarDebtor';

import { useModalBucket } from './ModalBucket.hook';

import type { PipelineContextType } from '@/components/layouts/PipelineLayout/Pipeline.context';


const ModalBucket = NiceModal.create(() => {
  const modalId = MODAL_ID.MODAL_REQUEST;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    bucketStatus,
    debtorValidation,
    filter,
    filterContentList,
    filterDropdownList,
    isCheckingStatus,
    isCreateButtonDisabled,
    isLoading,
    page,
    selected,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
    listMasterDebtor,
    totalPage,
    handleSubmit,
  } = useModalBucket();

  const showSimilarDebtorModal = () => {
    if (debtorValidation?.similarDebtorList?.length > 0) {
      NiceModal.show(MODAL_ID.SIMILAR_DEBTOR, {
        dataTable: debtorValidation.similarDebtorList,
      });
    }
  };

  const footer = (
    <RowWrapper sx={{ justifyContent: 'end', mt: 2 }}>
      <Button
        disabled={
          isLoading ||
          isCheckingStatus ||
          !selected.length ||
          debtorValidation?.hasDuplicate ||
          (bucketStatus?.status && !['COMPLETED', 'REJECTED', 'CANCELED'].includes(bucketStatus.status)) ||
          isCreateButtonDisabled
        }
        onClick={() => handleSubmit()}
      >
        New Request
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
    >
      <Input
        type="search"
        value={filter}
        onChange={setFilter}
        placeholder="Pencarian..."
        dropdownList={filterDropdownList}
        contentList={filterContentList}
      />

      {/* DK Validation Message */}
      {debtorValidation && selected?.length > 0 && (debtorValidation.hasDuplicate || debtorValidation.hasSimilar) && (
        <RowWrapper
          gap={1}
          justifyContent="space-between"
          sx={{
            backgroundColor: debtorValidation.hasDuplicate
              ? '#fce8e8'
              : '#fff9e5',
            borderRadius: theme.spacing(1),
            mb: 2,
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
                  fill: debtorValidation.hasDuplicate
                    ? theme.palette.custom.softRed
                    : theme.palette.custom.lightYellow,
                },
              }}
            />
            <TextStyle
              variant="body4"
              fontWeight={400}
            >
              {debtorValidation.hasDuplicate
                ? 'Terdaftar dalam database DK. Proses tidak dapat dilanjutkan.'
                : 'Terdapat kemiripan dengan database DK.'
              }
            </TextStyle>
          </RowWrapper>
          {debtorValidation?.hasSimilar && debtorValidation.similarDebtorList?.length > 0 && (
            <RowWrapper>
              <Button variant="outlined" size="small" onClick={showSimilarDebtorModal}>
                View Data Details
              </Button>
            </RowWrapper>
          )}
        </RowWrapper>
      )}
      <Table
        isPaper
        isLoading={isLoading}
        maxHeight="23.5vw"
        tableHeader={tableHeader}
        tableData={listMasterDebtor}
        totalPage={totalPage}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
    </SectionModal>
  );
});


export default ModalBucket;
