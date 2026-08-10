'use client';
import * as React from 'react';

import { Box, Grid } from '@mui/material';

import { ActivityType } from '@/enums/Activity';
import useRecordLog from '@/hooks/useRecordLog';

import { useBreadcrumbs } from '@/components/layouts/MasterParameterLayout/components/Breadcrumbs/Breadcrumbs.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';

import useProcess from './Process.hook';


const ProcessPage = () => {
  const { push, reset } = useBreadcrumbs();
  const { recordActivity } = useRecordLog();
  const {
    isLoading,
    tableData,
    page,
    pageSize,
    totalPage,
    tableHeader,
    handleRedirectClick,
    handleSave,
    handleNext,
    handleCancel,
    handleAdd,
    setPage,
    setPageSize,
    handleClose,
    detailData,
    isMaker,
    isViewOnly,
    routeMode,
    filter,
    setFilter,
    filterDropdownList,
    filterContentList,
  } = useProcess();

  React.useEffect(() => {
    reset();
    push({ href: '/master-parameter/parameter-mapping-apu_ppt', label: 'Parameter Mapping APU PPT' });
    push({ label: 'Process' });

    // Record activity for page access
    recordActivity({
      activity: ActivityType.VIEW,
      bucketProcessId: '',
      changeAfter: '',
      changeBefore: '',
      menuCode: '/master-parameter/parameter-mapping-apu_ppt/process',
      module: 'PARAMETER_APU_PPT',
      process: 'PARAMETER_APU_PPT',
      remarks: 'Accessed Parameter Mapping APU PPT Process page',
    });
  }, [push, reset, recordActivity]);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Process - Parameter Mapping APU PPT" />
      <SectionTitle title="Process" isOpen>
        <Grid
          container
          spacing={2}
          sx={{ boxShadow: 7, mt: 2, pb: 4, px: 2 }}
        >
          <Grid item xs={4}>
            <Input
              type="text"
              label="Kode Bentuk Usaha"
              value={detailData?.data?.content?.groupCode || ''}
              placeholder="Enter parameter name"
              disabled
            />
          </Grid>
          <Grid item xs={4}>
            <Input
              type="text"
              label="Bentuk Usaha"
              value={detailData?.data?.content?.groupName || ''}
              placeholder="Enter parameter value"
              disabled
            />
          </Grid>
          <Grid
            item
            xs={4}
            sx={{
              alignItems: 'center',
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <Button
              variant="outlined"
              onClick={handleRedirectClick}
              sx={{
                '& .MuiSvgIcon-root': {
                  fontSize: '1.5rem',
                  transform: 'rotate(0deg)',
                },
                '&:hover': {
                  borderColor: 'primary.dark',
                },
                alignItems: 'center',
                border: '3px solid',
                borderColor: 'primary.main',
                display: 'flex',
                fontSize: '0.575rem',
                height: 'fit-content',
                justifyContent: 'center',
                minWidth: 'auto',
                py: 2,
              }}
            >
              <Box sx={{ alignItems: 'center', display: 'flex', gap: 1 }}>
                <Icon iconName="redirect" />
                <span>Go To Parameter LOV</span>
              </Box>
            </Button>
          </Grid>
        </Grid>
      </SectionTitle>

      <SectionTitle title="Process List" isOpen>
        <ColumnWrapper gap={1}>
          <Input
            type="search"
            value={filter}
            onChange={setFilter}
            placeholder="Pencarian..."
            dropdownList={filterDropdownList}
            contentList={filterContentList}
            containerSx={{ width: '45vw' }}
          />
          <BaseContainer sx={{ boxShadow: 7, mt: 2 }}>
            <Table
              tableHeader={tableHeader}
              tableData={tableData || []}
              totalPage={totalPage}
              pageSize={pageSize}
              currentPage={page}
              isLoading={isLoading}
              handlePageChange={setPage}
              onPageSizeChange={setPageSize}
              footer={!isViewOnly && isMaker && routeMode !== 'detail' ? <TableFooter onClick={handleAdd} /> : undefined}
            />
          </BaseContainer>
        </ColumnWrapper>
      </SectionTitle>

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        {routeMode === 'detail' ? (
          <Button variant="outlined" onClick={handleClose}>
            Close
          </Button>
        ) : (
          <>
            <Button variant="outlined" onClick={handleClose}>
              Close
            </Button>
            <Button variant="outlined" color="error" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ProcessPage;
