'use client';
import { useEffect } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import RowWrapper from '@/components/shared/RowWrapper';
import Search from '@/components/shared/Search';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import DetailLovModal from '../../components/DetailModal';
import SLAPipelineModal from '../components/SLAPipelineModal/SLAPipelineModal';
import { modal } from '../constants';

import ApprovalModal from './components/ApprovalModal';
import { useList } from './Detail.hook';


const ListPage = () => {

  const {
    tableHeader,
    isLoading,
    page,
    data,
    setPage,
    setFilter,
    setPageSize,
  } = useList();

  useEffect(() => {
    console.log('log data', data?.contents);
  }, [data?.contents]);

  return (
    <>
      <RowWrapper
        sx={{
          alignItems: 'center',
          gap: 3,
          justifyContent: 'space-between',
        }}
      >
        <Title sx={{ flex: 1 }} title="Maintenance Master SLA" />
        <Button color="info" onClick={() => {}}>Edit Tipe Permohonan</Button>
        <Button color="success" onClick={() => {}}>Simpan & Konfirmasi</Button>

      </RowWrapper>
      <div>
        <BaseContainer>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={data?.contents}
            currentPage={page}
            totalPage={data?.page?.totalPage ?? 1}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
          />
        </BaseContainer>
      </div>
      <ModalDef
        id={modal.SLA_PIPELINE_MODAL}
        component={SLAPipelineModal}
      />
      <ModalDef
        id={modal.DETAIL_MODAL}
        component={DetailLovModal}
      />
    </>
  );
};

export default ListPage;
