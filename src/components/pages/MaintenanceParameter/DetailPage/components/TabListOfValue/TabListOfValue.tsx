'use client';

import { useState } from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, useTheme } from '@mui/material';
import { useRouter } from 'next/navigation';
import { FormProvider } from 'react-hook-form';

import { MASTER_PARAMETER } from '@/configs/constants/pathname';

import { useMasterParameterTabs } from '@/components/layouts/MasterParameterLayout/components/MasterParameterTabs';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import AddNewListOfValue from '../../../components/addNewListOfValue/AddNewListOfValue';
import { TAB } from '../../Detail.constant';

import { useListOfValue } from './TabListOfValue.hook';


const TabListOfValue = () => {
  const theme = useTheme();
  const router = useRouter();
  const { setActiveTab } = useMasterParameterTabs();

  const { data, form, handleAdd, isLoading, tableHeader, isViewOnly, navigationData } = useListOfValue();

  // State untuk template file
  const [templateFile] = useState('Field Of Name');

  return (
    <FormProvider {...form}>
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
                fontSize: '0.75rem',
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
            value={navigationData?.description}
          />
        </Box>
        <BaseContainer sx={{ boxShadow: 7 }}>
          <Table
            currentPage={1}
            isLoading={isLoading}
            tableData={data?.contents || []}
            tableHeader={tableHeader}
            totalPage={data?.totalPages || 1}
            footer={!isViewOnly ? <TableFooter onClick={handleAdd} /> : undefined}
          />
        </BaseContainer>
        <RowWrapper sx={{ gap: 2, justifyContent: 'flex-end', mt: 2 }}>
          <Button variant="outlined" onClick={() => router.push(MASTER_PARAMETER.PARAMETER_LOV_LIST_PAGE)}>
            Close
          </Button>
          {!navigationData.isBucketListDetail && (
            <Button variant="contained" onClick={() => setActiveTab(TAB.SUMMARY)}>
              Save
            </Button>
          )}
        </RowWrapper>


        <ModalDef
          component={AddNewListOfValue}
          id="MODAL_ADD_LIST_OF_VALUE"
        />
      </ColumnWrapper>
    </FormProvider>
  );
};

export default TabListOfValue;
