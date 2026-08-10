import { useQueries } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { UseQueryOptions } from '@tanstack/react-query';


const useGetDebtorDetail = (
  payload: any,
  config?: Partial<UseQueryOptions<any>>
) => {
  const { bucketProcessId, module, process } = payload;

  const query = useQueries({
    combine: (results: any) => {
      const data = results.map((result: any) => result.data);

      const formattedData = {
        bucketParentId: data[4]?.bucketParentId,
        bucketProcessId: data[0]?.bucketProcessId,
        coBorrower: {
          data: data[1],
          isChecked: data[1]?.isChecked,
        },
        debtor: {
          analystId: data[0]?.analystId,
          contactPerson: data[0]?.contactPerson,
          debtorName: data[0]?.debtorName,
          debtorRating: data[0]?.debtorRating,
          debtorType: data[0]?.debtorType,
          debtorTypeLabel: data[0]?.debtorTypeLabel,
          isAffiliate: data[0]?.isAffiliate,
          isGroup: data[0]?.isGroup,
          isRelatedToSmi: data[0]?.isRelatedToSmi,
          position: data[0]?.position,
          positionId: data[0]?.positionId,
          relationshipSince: data[0]?.relationshipSince,
          sectorName: data[0]?.sectorName,
          typeFinancing: data[4]?.typeFinancing,
          typeProcess: data[4]?.typeProcess,
          typeProposal: data[4]?.typeSubmission,
          yearFounded: data[0]?.yearFounded,
        },
        description: data[4]?.description,
        group: data[0]?.group,
        performanceFinancial: {
          assets: data[3]?.assets,
          currencyAssets: data[3]?.currencyAssets,
          currencyEbitda: data[3]?.currencyEbitda,
          currencyEquity: data[3]?.currencyEquity,
          currencyIncome: data[3]?.currencyIncome,
          currencyLiability: data[3]?.currencyLiability,
          currencyNetProfit: data[3]?.currencyNetProfit,
          ebitda: data[3]?.ebitda,
          equity: data[3]?.equity,
          income: data[3]?.income,
          liability: data[3]?.liability,
          netProfit: data[3]?.netProfit,
          performanceFinancialDate: data[3]?.performanceFinancialDate,
        },
        syndication: {
          data: {
            accountBankId: data[2]?.accountBankId,
            accountBankLabel: data[2]?.accountBankLabel,
            creditors: {
              contents: data[2]?.creditors?.contents,
              remark: data[2]?.creditors?.remark,
            },
            facilityAgentsId: data[2]?.facilityAgentsId,
            facilityAgentsLabel: data[2]?.facilityAgentsLabel,
            others: data[2]?.others,
            securityAgentId: data[2]?.securityAgentId,
            securityAgentLabel: data[2]?.securityAgentLabel,
            structuredFee: data[2]?.structuredFee,
          },
          isChecked: data[2]?.isChecked,
        },
      };

      return {
        data: formattedData,
        pending: results.some((result: any) => result.isPending),
      };
    },
    queries: [
      {
        enabled: !!bucketProcessId && !!module && !!process,
        queryFn: async () => {
          const response = await API('bucket.debtor.detail', { data: payload });
          return response.data.data.content;
        },
        queryKey: ['debtor-detail', payload],
      },
      {
        enabled: !!bucketProcessId && !!module && !!process,
        queryFn: async () => {
          const response = await API('bucket.debtor.coBorrower', { data: payload });
          return response.data.data.contents;
        },
        queryKey: ['coborrower-detail', payload],
      },
      {
        enabled: !!bucketProcessId && !!module && !!process,
        queryFn: async () => {
          const response = await API('bucket.debtor.syndication', { data: payload });
          return response.data.data.content;
        },
        queryKey: ['syndication-detail', payload],
      },
      {
        enabled: !!bucketProcessId && !!module && !!process,
        queryFn: async () => {
          const response = await API('bucket.debtor.performanceFinancial', { data: payload });
          return response.data.data.content;
        },
        queryKey: ['financial-performance-detail', payload],
      },
      {
        enabled: !!bucketProcessId && !!module && !!process,
        queryFn: async () => {
          const response = await API('bucket.debtor.detail', { data: payload });
          return response.data.data.content;
        },
        queryKey: ['type-detail', payload],
      },
    ],
  });

  return query;
};

export default useGetDebtorDetail;
