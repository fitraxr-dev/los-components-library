'use client';

import { useContext } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import {
  BusinessActivityReport,
} from '@/components/layouts/BusinessActivityReportLayout/BusinessActivityReport.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalApproval from './components/ModalApproval';
import ModalDataDk from './components/ModalDataDK';
import ModalDebtor from './components/ModalDebtor';
import { modal } from './List.constants';
import useList from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const { state, setState } = useContext(BusinessActivityReport);
  const {
    data,
    filter,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
    currentRole,
    isLoading,
  } = useList();

  const canAdd = useCheckAccess(accessid.BUSINESS_ACTIVITY_REPORT_CREATE);

  const isApproved =
    currentRole.includes('MAKER') ||
    currentRole.includes('KADIV') ||
    currentRole.includes('CHECKER');

  return (
    <>
      <Title title="Business Activity Report List" />
      <ColumnWrapper gap={theme.spacing(1)} mb={theme.spacing(8)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          gap={theme.spacing(3)}
        >
          <Box width="45vw">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <Button
            onClick={() =>
              NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                checkboxList: [
                  { label: 'New Customer', value: 'BAR_NEW' },
                  { label: 'Existing Customer', value: 'BAR_EXISTING' },
                ],
                processTemplateType: 'BAR',
                queryKeyList: ['get-user-collaboration'],
                titleCheckbox: 'Tipe Customer',
              })
            }
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
          {isApproved && (
            <Button onClick={() => NiceModal.show(modal.APPROVAL)}>
              Approval Status
            </Button>
          )}
          {canAdd && (
            <Button
              onClick={() => NiceModal.show(modal.DEBTOR, { setState, state })}
            >
              New Business Act Report
            </Button>
          )}
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            maxHeight="42vh"
            tableHeader={tableHeader}
            tableData={data?.contents || []}
            totalPage={data?.page?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef id={modal.DEBTOR} component={ModalDebtor} />

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />

      <ModalDef id={modal.APPROVAL} component={ModalApproval} />

      <ModalDef id={modal.CUSTOMER_DK_VALIDATION} component={ModalDataDk} />
    </>
  );
};

export default ListPage;
