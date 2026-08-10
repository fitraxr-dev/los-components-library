'use client';

import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import AddChildLimitModal from '../AddChildLimitModal';

import useChildLimitForm from './ChildLimitForm.hook';


interface ChildLimitFormProps {
  onDataStatusChange?: (hasData: boolean) => void;
  onNext?: () => void;
}

const ChildLimitForm = ({ onDataStatusChange, onNext }: ChildLimitFormProps) => {
  const theme = useTheme();

  const {
    filter,
    processList,
    isLoading,
    setPage,
    setPageSize,
    page,
    tableHeader,
    setFilter,
    filterDropdownList,
    filterContentList,
    processPage,
    isDetail,
    hanldeOpenAddModal,
    handleCancel,
    isHidden,
    isViewOnly,
    hasData,
    anomalyRow,
    canAddNew,
  } = useChildLimitForm();

  useEffect(() => {
    if (onDataStatusChange) {
      onDataStatusChange(hasData);
    }
  }, [hasData, onDataStatusChange]);

  const footer =
    (
      <RowWrapper
        sx={{ justifyContent: 'end', mb: 2 }}
      >
        {(!isHidden && !isDetail) && (
          <Button
            variant="outlined"
            startIcon="add-2"
            startIconSx={{ fontSize: theme.spacing(3) }}
            sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
            onClick={hanldeOpenAddModal}
            disabled={isViewOnly || !canAddNew}
          >
            Add New
          </Button>
        )}
      </RowWrapper>
    );

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle
        title="Fasilitas Pembiayaaan"
        isOpen
      >
        <Box sx={{ width: '45vw' }}>
          <Input
            type="search"
            value={filter}
            hasFilter
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
          />
        </Box>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={processList}
            totalPage={processPage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            isLoading={isLoading}
            onPageSizeChange={setPageSize}
            footer={footer}
            anomalyRow={anomalyRow}
          />
        </BaseContainer>
        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          <Button variant="outlined" onClick={handleCancel} sx={{ mr: 2 }}>
            Close
          </Button>
          <Button
            variant="contained"
            color="primary"
            disabled={!hasData}
            onClick={onNext}
            sx={{ mr: 2 }}
          >
            Next
          </Button>
        </RowWrapper>
      </SectionTitle>

      <ModalDef
        id={MODAL.MAINTENANCE_DATA.ADD_ADD_CHILD_LIMIT}
        component={AddChildLimitModal}
      />
    </ColumnWrapper>
  );
};

export default ChildLimitForm;
