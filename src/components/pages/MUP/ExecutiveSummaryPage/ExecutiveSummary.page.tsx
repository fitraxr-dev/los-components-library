'use client';
import { useContext } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { mup } from '@/configs/constants/pathname';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { MUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import { TabItem } from '@/components/shared/Tabs';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import { CustomTabs } from './components/CustomTabs';
import { tab, TAB_ITEMS } from './ExecutiveSummary.constant';
import useExecutiveOverview from './ExecutiveSummary.hook';


const ExecutiveOverviewPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { processId } = useParams();

  const {
    activeTab,
    handleChangeTab,
    containerIndicator,
    containerFullfillment,
    setContainerFullfillment,
    setContainerIndicator,
    isFetchLoading,
    isSaveLoading,
    isSaveFinancialLoading,
    handleSave,
    tableHeader,
    executiveSummaryDetail,
    dataList,
    page,
    setPage,
    setItemPerPage,
    isFecthListLoading,
    itemPerPage,
    isFetchFinancialLoading,
    financialEconomyDetail,
  } = useExecutiveOverview();
  const { goToNextStep } = useContext(MUPContext);
  const { viewOnly } = useViewOnly();

  return (

    <ColumnWrapper gap={3}>
      <Title title="Ringkasan Eksekutif" />
      <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />

      <CustomTabs activeTab={activeTab} onChange={(val: string) => handleChangeTab(val)} items={TAB_ITEMS} />
      <RowWrapper>
        <TabItem activeValue={activeTab} value={tab.FULLFILLMENT} sx={{ width: '100%' }}>
          <ColumnWrapper gap={3}>
            <BaseContainer sx={{ boxShadow: 7 }}>
              <Table
                tableHeader={tableHeader}
                tableData={dataList?.contents}
                isLoading={isFecthListLoading}
                totalPage={dataList?.page?.totalPage ?? 1}
                currentPage={page}
                handlePageChange={setPage}
                onPageSizeChange={setItemPerPage}
                pageSize={itemPerPage}
                footer={
                  <RowWrapper
                    sx={{
                      justifyContent: 'end',
                    }}
                  >
                    <Button
                      variant="outlined"
                      startIcon="add-2"
                      startIconSx={{ fontSize: theme.spacing(3) }}
                      sx={{
                        height: theme.spacing(6),
                        padding: theme.spacing(1),
                      }}
                      onClick={() => {
                        router.push(
                          replacePath(mup.EXECUTIVE_OVERVIEW_ADD_FULLFILLMENT_PAGE, { processId }));
                      }}
                    >
                      Add New
                    </Button>
                  </RowWrapper>
                }
              />
            </BaseContainer>
            <SectionTitle title="Keterangan" />
            <ColumnWrapper width="100%">
              <WordEditor
                isReadOnly={false}
                container={containerFullfillment}
                setContainer={setContainerFullfillment}
                isLoading={isFetchLoading || isSaveLoading}
                initialValue={executiveSummaryDetail?.description}
                onSave={handleSave}
              />
            </ColumnWrapper>
          </ColumnWrapper>
        </TabItem>
      </RowWrapper>
      <RowWrapper>
        <TabItem activeValue={activeTab} value={tab.INDICATOR} sx={{ width: '100%' }}>
          <ColumnWrapper gap={3}>
            <WordEditor
              isReadOnly={false}
              container={containerIndicator}
              setContainer={setContainerIndicator}
              isLoading={isFetchFinancialLoading || isSaveFinancialLoading}
              initialValue={financialEconomyDetail?.description}
              onSave={handleSave}
            />
          </ColumnWrapper>
        </TabItem>
      </RowWrapper>
      <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
        <Button
          isLoading={isSaveLoading || isSaveFinancialLoading}
          disabled={!(dataList?.contents?.length !== 0)}
          onClick={() => {
            viewOnly ? goToNextStep() : handleSave();
          }}
        >
          {viewOnly ? 'Next' : 'Save'}
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ExecutiveOverviewPage;
