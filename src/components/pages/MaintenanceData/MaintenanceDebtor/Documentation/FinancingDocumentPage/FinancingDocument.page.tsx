'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';

import { formatDateTime } from '@/helpers/date';

import ActionButtons from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import ModalDetailDocument from '../components/ModalDetailDocument';
import { modal } from '../Documentation.constants';

import useFinancingDocument from './FinancingDocument.hook';


const FinancingDocumentPage = () => {
  const theme = useTheme();

  const {
    documentData,
    page,
    pageSize,
    setPage,
    setPageSize,
    filter,
    setFilter,
    tableHeader,
    filterDropdownList,
    filterContentList,
    handleOpenSubmitModal,
    isSubmitLoading,
    handleClose,
    actions,
  } = useFinancingDocument();

  return (
    <>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Documentation" />
        <SectionTitle title="Document Pembiayaan" isOpen>
          <ColumnWrapper gap={theme.spacing(3)}>
            <Box sx={{ width: '45vw' }}>
              <Input
                type="search"
                value={filter}
                onChange={setFilter}
                placeholder="Pencarian..."
                dropdownList={filterDropdownList}
                contentList={filterContentList}
              />
            </Box>
            <RowWrapper alignItems="center" gap={theme.spacing(2)}>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.custom.text}
              >
                Data as of : {formatDateTime(documentData?.data?.additionalData?.lastUpdate)}
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </TextStyle>
            </RowWrapper>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                tableData={documentData?.data?.contents ?? []}
                tableHeader={tableHeader}
                pageSize={pageSize}
                currentPage={page}
                totalPage={documentData?.data?.page?.totalPage ?? 0}
                onPageSizeChange={setPageSize}
                handlePageChange={setPage}
              />
            </BaseContainer>
          </ColumnWrapper>
        </SectionTitle>

        <ActionFooterDetail />

      </ColumnWrapper>

      <ModalDef
        id={modal.DETAIL_DOCUMENT}
        component={ModalDetailDocument}
      />
    </>
  );
};

export default FinancingDocumentPage;
