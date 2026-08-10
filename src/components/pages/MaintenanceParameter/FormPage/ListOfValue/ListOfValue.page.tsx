'use client';

import * as React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import AddNewListOfValue from '../../components/addNewListOfValue/AddNewListOfValue';

import { useListOfValue } from './ListOfValue.hook';


const ListOfValuePage = () => {
  const theme = useTheme();
  const params = useParams();
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-lov', label: 'Parameter LOV' });
    const currentPath = window.location.pathname;
    push({ href: currentPath, label: 'Process' });
  }, [push, reset]);

  // Record activity for initial page load
  React.useEffect(() => {
    const description = decodeURIComponent(params.description as string);
    const processId = params.processId as string;
    const moduleName = params.module as string;

    recordActivity({
      activity: ActivityType.INITIAL_PAGE,
      bucketProcessId: processId,
      menuCode: 'parameter-lov',
      module: moduleName,
      process: 'parameter-lov',
      remarks: `view process step in parameter lov: ${description}`,
    });
  }, [params, recordActivity]);

  const {
    handleAdd,
    isLoading,
    tableHeader,
    isViewOnly,
    handleNext,
    handleClose,
    tableData,
    handlePageSizeChange,
    page,
    setPage,
    tablePage,
    totalPage,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
  } = useListOfValue();


  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Title title="List Of Value" />
        <Box sx={{ alignItems: 'center', display: 'flex', gap: 2 }}>
          <TextStyle color={theme.palette.primary.main} fontWeight={700} variant="title1">
            Label
          </TextStyle>
          <TextStyle color={theme.palette.primary.main} fontWeight={700} variant="title1">
            :
          </TextStyle>
          <Input
            containerSx={{
              '& .Mui-disabled': {
                '-webkit-text-fill-color': 'inherit',
                backgroundColor: 'transparent',
                color: 'inherit',
              },
              '& .MuiInputBase-input': {
                ...theme.typography.body4,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              },
              '& .MuiInputBase-input.Mui-disabled': {
                '-webkit-text-fill-color': 'inherit',
                color: 'inherit',
              },
              '& .MuiInputBase-root': {
                minHeight: '28px',
              },
              flex: 0.5,
              maxWidth: '475px',
            }}
            disabled={true}
            placeholder="Field Of Name"
            type="text"
            value={decodeURIComponent(params.description as string)}
          />
        </Box>
        <Input
          type="search"
          value={filter}
          onChange={setFilter}
          placeholder="Pencarian..."
          dropdownList={filterDropdownList}
          contentList={filterContentList}
          containerSx={{ width: '45vw' }}
        />
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            tableHeader={tableHeader}
            tableData={tableData || []}
            isLoading={isLoading}
            onPageSizeChange={handlePageSizeChange}
            handlePageChange={setPage}
            currentPage={page}
            totalPage={totalPage}
            footer={!isViewOnly ? <TableFooter onClick={handleAdd} /> : undefined}
          />
        </BaseContainer>
        <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          {isViewOnly ? (
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
          ) : (
            <>
              <Button variant="outlined" onClick={handleClose}>
                Close
              </Button>
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            </>
          )}
        </RowWrapper>

        <ModalDef
          component={AddNewListOfValue}
          id="MODAL_ADD_LIST_OF_VALUE"
        />
      </ColumnWrapper>
    </>
  );
};

export default ListOfValuePage;
