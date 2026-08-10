'use client';
import { useContext, useEffect } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import { TypePosition } from '@/enums/Position';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';
import useIdentity from '@/hooks/useIdentity';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import { PipelineContext } from '@/components/layouts/PipelineLayout/Pipeline.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import ModalDataDk from './components/ModalDataDK';
import ModalDebtor from './components/ModalDebtor';
import { modal } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const theme = useTheme();
  const [{ currentPosition }] = useApp();
  const { state, setState } = useContext(PipelineContext);
  const { setProcessId } = useIdentity();

  const canAddPipeline = useCheckAccess(accessid.PIPELINE_CREATE);
  const { anomalyRowStyle } = useGetRowDataColors();

  useEffect(() => {
    setProcessId('');
  }, []);

  const {
    data,
    filter,
    filterContentList,
    filterDropdownList,
    isLoading,
    page,
    tableHeader,
    setFilter,
    setPage,
    setPageSize,
  } = useList();

  return (
    <>
      <Title title="Pipeline List" />

      <ColumnWrapper gap={theme.spacing(1)}>
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

          {/* Upload Dokumen */}
          <Button
            onClick={() =>
              NiceModal.show(MODAL.MODAL_UPLOAD_TEMPLATE, {
                processTemplateType: 'PIPELINE',
                queryKeyList: ['bucket-list'],
              })
            }
            startIcon="upload"
          >
            Upload Dokumen
          </Button>

          {/* Add New Pipeline */}
          {canAddPipeline && (
            <Button
              onClick={() =>
                NiceModal.show(modal.DEBTOR, { setState, state })
              }
              startIcon="add"
            >
              Add New Pipeline
            </Button>
          )}
        </RowWrapper>

        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={data?.contents}
            totalPage={data?.page?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      {/* Modal */}
      <ModalDef id={modal.DEBTOR} component={ModalDebtor} />

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />

      <ModalDef
        id={modal.CUSTOMER_DK_VALIDATION}
        component={ModalDataDk}
      />
    </>
  );
};

export default ListPage;
