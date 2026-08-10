'use client';
import { useContext } from 'react';

import { useTheme } from '@mui/material';
import { useParams } from 'next/navigation';

import { mip } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useViewOnly from '@/hooks/useViewOnly';

import { MIPContext } from '@/components/layouts/MIPLayout/MIP.context';
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


// TODO: REFACTOR EXECUTIVE SUMMARY MUP & MIP
const ExecutiveOverviewPage = () => {
  const theme = useTheme();
  const router = useCustomRouter();
  const { processId } = useParams();
  const [state] = useApp();

  const {
    activeTab,
    handleChangeTab,
    containerIndicator,
    containerFullfillment,
    setShouldGoNext,
    setContainerFullfillment,
    setContainerIndicator,
    isFetchLoading,
    isSaveLoading,
    isAutoSaveFetching,
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
  const { goToNextStep } = useContext(MIPContext);
  const { viewOnly } = useViewOnly();

  return (

    <ColumnWrapper gap={3}>
      <Title title="Ringkasan Eksekutif" />
      <TableDebtorInformation
        module={state.pages.mipModule}
        process={state.pages.mipProcess}
      />

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
                          replacePath(mip.EXECUTIVE_OVERVIEW_ADD_FULLFILLMENT_PAGE, { processId }));
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
              isLoading={isFetchFinancialLoading}
              initialValue={financialEconomyDetail?.description}
              onSave={handleSave}
            />
          </ColumnWrapper>
        </TabItem>
      </RowWrapper>
      <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
        {viewOnly ? (
          <Button
            isLoading={isSaveLoading}
            onClick={() => {
              goToNextStep();
            }}
          >
            Next
          </Button>
        ) : (
          <>
            <Button
              isLoading={isSaveLoading}
              disabled={!(dataList?.contents?.length !== 0) || isAutoSaveFetching}
              onClick={() => {
                setShouldGoNext(false);
                handleSave();
              }}
            >
              {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
            </Button>
            <Button
              isLoading={isSaveLoading}
              disabled={!(dataList?.contents?.length !== 0)}
              onClick={() => {
                setShouldGoNext(true);
                handleSave();
              }}
            >
              Next
            </Button>
          </>
        )}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default ExecutiveOverviewPage;
