'use client';
import { useContext } from 'react';

import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';

import { roles } from '@/configs/constants';
import { MODAL } from '@/configs/constants/modalId';
import { accessid } from '@/configs/constants/pathname';
import useApp from '@/hooks/useApp';
import useCheckAccess from '@/hooks/useCheckAccess';

import useGetRowDataColors from '@/components/layouts/MUILayout/components/hooks/useGetRowDataColors';
import { SiteVisitContex } from '@/components/layouts/SiteVisitLayout/SiteVisit.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import ModalUploadTemplate from '@/components/shared/SmiModal/ModalUploadTemplate';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import AddSiteVisit from './components/AddSiteVisit';
import { modalSiteVisit } from './List.constants';
import { useList } from './List.hook';


const ListPage = () => {
  const [{ currentRole }] = useApp();
  const theme = useTheme();
  const { state, setState } = useContext(SiteVisitContex);
  const canAddSiteVisit = useCheckAccess(accessid.SITE_VISIT_CREATE);
  const { anomalyRowStyle } = useGetRowDataColors();
  const {
    tableData,
    tablePage,
    filter,
    isLoading,
    setFilter,
    page,
    setPage,
    setPageSize,
    filterContentList,
    filterDropdownList,
    tableHeader,
  } = useList();

  return (
    <>
      <Title title="Site Visit List" />
      <ColumnWrapper gap={theme.spacing(1)}>
        <RowWrapper
          sx={{
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
          gap={2}
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
              processTemplateType: 'SITE_VISIT',
              queryKeyList: ['site-visit-list'],
            })}
            startIcon="upload"
          >
            Upload Dokumen
          </Button>
          {canAddSiteVisit ?
            (
              <Button
                startIcon="add"
                onClick={() => NiceModal.show(
                  modalSiteVisit.ADD_NEW_SITE_VISIT,
                  { setState, state }
                )}
              >
                Add New Site Visit Non PEMDA
              </Button>
            ) : null}
        </RowWrapper>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            isLoading={isLoading}
            tableHeader={tableHeader}
            tableData={tableData}
            totalPage={tablePage?.totalPage ?? 1}
            currentPage={page}
            handlePageChange={setPage}
            onPageSizeChange={setPageSize}
            anomalyRow={anomalyRowStyle}
          />
        </BaseContainer>
      </ColumnWrapper>

      <ModalDef
        id={MODAL.MODAL_UPLOAD_TEMPLATE}
        component={ModalUploadTemplate}
      />
      <ModalDef
        id={modalSiteVisit.ADD_NEW_SITE_VISIT}
        component={AddSiteVisit}
      />
    </>
  );
};

export default ListPage;
