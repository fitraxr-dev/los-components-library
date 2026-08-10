'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useCheckAccess from '@/hooks/useCheckAccess';

import { useApuPptContext } from '@/components/layouts/ApuPptLayout/ApuPpt.context';
import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalAddNew from './components/ModalAddNew';
import ModalTableDk from './components/ModalTableDk/ModalTableDk';
import { modal } from './RequestList.constants';
import useRequestList from './RequestList.hook';


const ListPage = () => {
  const theme = useTheme();
  const { isBusinessDivision, isDpopDivision, isRM } = useApuPptContext();
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    setFilter,
    noPage,
    setNoPage,
    setItemPerPage,
    filterDropdownList,
    filterContentList,
    tableHeader,
    tableData,
    tablePage,
    isLoading,
    filter,
    handleOpenAddNewModal,
  } = useRequestList();

  const canAdd = useCheckAccess(accessid.REQUEST_APU_PPT_CREATE);

  return (
    <>
      <Title title="Request Assesment APU PPT/Pengkinian Data List" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
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
            onClick={() => NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
              checkboxList: [
                { label: 'APU PPT', value: 'APU_PPT' },
                { label: 'Pengkinian Data', value: 'APU_PPT_PENGKINIAN_DATA' },
              ],
              queryKeyList: ['bucket-list'],
              titleCheckbox: 'Tipe Permohonan',
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
          {(canAdd) && (
            <Box>
              <Button onClick={handleOpenAddNewModal}>
                Add New
              </Button>
            </Box>
          )}
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={noPage}
            handlePageChange={setNoPage}
            onPageSizeChange={setItemPerPage}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={modal.ADD_NEW_MODAL}
        component={ModalAddNew}
      />

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />

      <ModalDef
        id={modal.MODAL_TABLE_DK}
        component={ModalTableDk}
      />
    </>
  );
};

export default ListPage;
