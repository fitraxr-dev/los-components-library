'use client';
import React from 'react';

import { create, useModal } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import Table from '@/components/shared/Table';

import { modal } from '../../RatingAndRiskProfile.constants';

import useHistoryRating from './ModalHistoryRating.hooks';


const ModalHistoryRating = create(() => {
  const modalId = modal.HISTORY_RATING;
  const { visible } = useModal(modalId);
  const theme = useTheme();

  const {
    filter,
    setFilter,
    isLoading,
    filterContentList,
    filterDropdownList,
    ratingHistoryList,
    ratingHistoryPage,
    TABLE_HEADER,
    page,
    setPage,
    setPageSize,
    pageSize,
  } = useHistoryRating();

  return (
    <SectionModal
      title="History Rating"
      isOpen={visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '70vw' }}
    >
      <ColumnWrapper gap={theme.spacing(1)} marginBottom={theme.spacing(5)}>
        <Box width="45vw">
          <Input
            type="search"
            value={filter}
            hasFilter
            hideFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={TABLE_HEADER}
            tableData={ratingHistoryList}
            totalPage={ratingHistoryPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            pageSize={pageSize}
          />
        </BaseContainer>
      </ColumnWrapper>
      <RowWrapper sx={{ justifyContent: 'end', mt: 3, py: 3 }}>
        <Button
          sx={{ mr: 3 }}
          onClick={() => closeNiceModal(modalId)}
        >
          Close
        </Button>
      </RowWrapper>
    </SectionModal>
  );
});

export default ModalHistoryRating;
