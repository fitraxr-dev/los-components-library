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

import useDigitalMemo from './DigitalMemo.hook';


const DigitalMemoPage = () => {
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
  } = useDigitalMemo();

  return (
    <>
      <ColumnWrapper gap={theme.spacing(3)}>
        <Title title="Documentation" />
        <SectionTitle title="Digital Memo" isOpen>
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
              {/* <EmptyPlaceholder status="coming-soon" /> */}

            </BaseContainer>
          </ColumnWrapper>
        </SectionTitle>

        {/* <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <ActionButtons
            actions={actions?.action || {}}
            // handleSave={handleSave}
            handleOpenSubmitModal={handleOpenSubmitModal}
            // isPending={isPending}
            isSubmitLoading={isSubmitLoading}
            // viewOnly={saveAction ? (isViewOnly || !isDirty) : isViewOnly}
            onClose={handleClose}
          />
        </RowWrapper> */}
        <ActionFooterDetail />

      </ColumnWrapper>

      <ModalDef
        id={modal.DETAIL_DOCUMENT}
        component={ModalDetailDocument}
      />
    </>
  );
};

export default DigitalMemoPage;
