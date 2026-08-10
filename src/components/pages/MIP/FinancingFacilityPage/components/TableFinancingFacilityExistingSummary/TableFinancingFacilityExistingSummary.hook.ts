import { useMemo } from 'react';

import { formatCurrency } from '@/helpers/formatCurrency';
import useGetDetailBucketDebtor from '@/hooks/services/useGetDetailBucketDebtor';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import useGetFinancingFacilityExistingSummary, {
  type FinancingFacilityExistingSummaryItem,
} from '../../hooks/useGetFinancingFacilityExistingSummary';


interface UseTableFinancingFacilityExistingSummaryParams {
  itemPerPage: number;
  noPage: number;
}

interface NormalizedSummaryItem {
  callType: string;
  osIdr: number;
  osUsd: number;
  plafondIdr: number;
  plafondUsd: number;
}

const sanitizeNumber = (value?: string | number) => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (typeof value === 'string') {
    const numericValue = Number(value.replace(/[^0-9.-]/g, ''));
    return Number.isFinite(numericValue) ? numericValue : 0;
  }

  return 0;
};

const useTableFinancingFacilityExistingSummary = ({
  itemPerPage,
  noPage,
}: UseTableFinancingFacilityExistingSummaryParams) => {
  const [state] = useApp();
  const { processId } = useIdentity();

  const { data: debtorInfo } = useGetDetailBucketDebtor({
    bucketProcessId: processId,
    module: state.pages.mipModule,
    process: state.pages.mipProcess,
  });

  const payload = useMemo(
    () => ({
      filter: {
        debtorId: debtorInfo?.debtorId ?? '',
      },
      page: {
        itemPerPage,
        noPage,
      },
    }),
    [debtorInfo?.debtorId, itemPerPage, noPage]
  );

  const {
    data,
    isFetching,
  } = useGetFinancingFacilityExistingSummary(payload, {
    enabled: Boolean(debtorInfo?.debtorId),
  });

  const summaryData = useMemo<FinancingFacilityExistingSummaryItem[]>(
    () => data?.contents ?? [],
    [data?.contents]
  );

  const normalizedSummaryData = useMemo<NormalizedSummaryItem[]>(
    () =>
      summaryData.map((item) => ({
        callType: item.callType ?? '-',
        osIdr: sanitizeNumber(item.os?.idr),
        osUsd: sanitizeNumber(item.os?.usd),
        plafondIdr: sanitizeNumber(item.plafond?.idr),
        plafondUsd: sanitizeNumber(item.plafond?.usd),
      })),
    [summaryData]
  );

  const { tableData, totalOutstanding, totalPlafond } = useMemo(() => {
    const isNil = (value: unknown) => value === null || value === undefined;

    const rows = summaryData.map((summaryItem, index) => {
      const item = normalizedSummaryData[index];
      const isOsIdrNull = isNil(summaryItem?.os?.idr);
      const isOsUsdNull = isNil(summaryItem?.os?.usd);
      const isPlafondIdrNull = isNil(summaryItem?.plafond?.idr);
      const isPlafondUsdNull = isNil(summaryItem?.plafond?.usd);

      return {
        callType: item?.callType,
        totalOS: {
          idr: isOsIdrNull ? '-' : formatCurrency(String(item?.osIdr ?? 0)),
          usd: isOsUsdNull ? '-' : formatCurrency(String(item?.osUsd ?? 0)),
        },
        totalPlafond: {
          idr: isPlafondIdrNull ? '-' : formatCurrency(String(item?.plafondIdr ?? 0)),
          usd: isPlafondUsdNull ? '-' : formatCurrency(String(item?.plafondUsd ?? 0)),
        },
      };
    });

    const aggregated = normalizedSummaryData.reduce(
      (acc, item) => ({
        osIdr: acc.osIdr + item.osIdr,
        osUsd: acc.osUsd + item.osUsd,
        plafondIdr: acc.plafondIdr + item.plafondIdr,
        plafondUsd: acc.plafondUsd + item.plafondUsd,
      }),
      {
        osIdr: 0,
        osUsd: 0,
        plafondIdr: 0,
        plafondUsd: 0,
      }
    );

    return {
      tableData: rows,
      totalOutstanding: {
        idr: formatCurrency(String(aggregated.osIdr)),
        usd: formatCurrency(String(aggregated.osUsd)),
      },
      totalPlafond: {
        idr: formatCurrency(String(aggregated.plafondIdr)),
        usd: formatCurrency(String(aggregated.plafondUsd)),
      },
    };
  }, [normalizedSummaryData, summaryData]);

  return {
    isLoading: isFetching,
    summaryData: tableData,
    totalOutstanding,
    totalPlafond,
  };
};

export default useTableFinancingFacilityExistingSummary;
