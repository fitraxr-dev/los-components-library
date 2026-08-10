'use client';

import { TypeModule, TypeProcess } from '@/enums/Module';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import Title from '@/components/shared/Title';

import DetailSiteVisit from './components/DetailSiteVisit/DetailSiteVisit';
import { useDataSiteVisit } from './DataSiteVisit.hook';


const DataSiteVisit = () => {
  const { viewOnly } = useViewOnly();

  const {
    siteVisitHistoryHeader,
    tableDataHistory,
    isLoading,
    isPemda,
    handleSaveSiteVisitHistory,
    isAutoSaveFetching,
    handleSyncRefina,
    isLoadingSyncRefina,
    page,
    setPage,
    setPageSize,
    tablePage,
    anomalyRow,
    isFetching,
  } = useDataSiteVisit();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <RowWrapper
        sx={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Title title={isPemda ? 'Data Site Visit (Refina)' : 'History Site Visit'} />
        { isPemda &&
          <Button
            startIcon="sync"
            onClick={handleSyncRefina}
            disabled={isLoadingSyncRefina}
            isLoading={isFetching}
          >
            Sync Data PEMDA
          </Button>
        }
      </RowWrapper>
      <Table
        anomalyRow={anomalyRow}
        isLoading={isPemda ? isLoadingSyncRefina : isLoading}
        isPaper
        tableData={tableDataHistory}
        tableHeader={siteVisitHistoryHeader}
        totalPage={tablePage?.totalPage ?? 1}
        currentPage={page}
        handlePageChange={setPage}
        onPageSizeChange={setPageSize}
      />
      <Title title="Site Visit Details" />
      <TableDebtorInformation module={TypeModule.SITE_VISIT} process={TypeProcess.SITE_VISIT} />
      <DetailSiteVisit isPemda={isPemda} />

      <RowWrapper gap={2} alignItems="center" justifyContent="end">
        <Button
          disabled={viewOnly || isAutoSaveFetching}
          isLoading={isLoading}
          onClick={() => handleSaveSiteVisitHistory({ shouldGoToNext: false })}
        >
          {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
        </Button>
        <Button
          disabled={viewOnly}
          isLoading={isLoading}
          onClick={() => handleSaveSiteVisitHistory({ shouldGoToNext: true })}
        >
          Next
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default DataSiteVisit;
