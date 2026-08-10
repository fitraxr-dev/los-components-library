'use client';
import { ModalDef } from '@ebay/nice-modal-react';
import Box from '@mui/material/Box';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import ModalDetail from '../../components/DetailModal';
import FormMasterModal from '../components/FormMasterModal';

import { modal } from './DetailMaster.constants';
import useRequestTypeMasterDetail from './DetailMaster.hook';


const DetailMasterPage = () => {
  const {
    handleSaveEdit,
    tableHeader,
    isLoading,
    page,
    data,
    setPage,
    setPageSize,
    isEditing,
    setIsEditing,
    handleOpenAddModal,
  } = useRequestTypeMasterDetail();

  return (
    <>
      <Title title="Master Tipe Permohonan" />
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        { isEditing ?
          <Button
            startIcon="edit"
            color="info"
            onClick={() => setIsEditing(true) }
          >
            Edit Tipe Permohonan
          </Button> :
          <Button
            color="success"
            onClick={handleSaveEdit}
          >
            Simpan & Konfirmasi
          </Button>
        }
      </RowWrapper>

      <Table
        isLoading={isLoading}
        maxHeight="42vh"
        tableHeader={tableHeader}
        tableData={data?.contents}
        totalPage={data?.page?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
        footer={<TableFooter sx={{ mr: 4 }} handleOpenAddModal={handleOpenAddModal} />}
      />

      <ModalDef
        id={modal.DETAIL_MODAL}
        component={ModalDetail}
      />

      <ModalDef
        id={modal.ADD_REQUEST_FORM}
        component={FormMasterModal}
      />
    </>
  );
};

export default DetailMasterPage;
