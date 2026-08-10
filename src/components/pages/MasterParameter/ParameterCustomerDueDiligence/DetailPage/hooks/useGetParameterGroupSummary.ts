import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { API } from '@/helpers/api';


interface ParameterGroupSummaryRequest {
  bucketProcessId: string;
}

const useGetParameterGroupSummary = (payload: ParameterGroupSummaryRequest) => {
  const enabled = !!payload.bucketProcessId;

  return useQueries({
    combine: (results) => {
      const [
        groupUpdate,
        groupAdd,
        itemUpdate,
        itemAdd,
        subItemUpdate,
        subItemAdd,
      ] = results;

      const pick = (query) => query?.data ?? [];

      const isLoading = results.some((r) => r.isLoading);
      const isPending = results.some((r) => r.isPending);
      const isError = results.some((r) => r.isError);

      return {
        data: {
          group: {
            add: pick(groupAdd),
            update: pick(groupUpdate),
          },
          item: {
            add: pick(itemAdd),
            update: pick(itemUpdate),
          },
          subItem: {
            add: pick(subItemAdd),
            update: pick(subItemUpdate),
          },
        },
        isError,
        isLoading,
        isPending,
      };
    },
    queries: [
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summary', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'group', payload],
      },
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summaryAdd', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'group', 'add', payload],
      },
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summaryItem', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'item', payload],
      },
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summaryItemAdd', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'item', 'add', payload],
      },
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summarySubItem', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'subitem', payload],
      },
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          const res = await API('parameter.parameterGroup.summarySubItemAdd', {
            data: payload,
          });

          return res?.data?.data?.contents;
        },
        queryKey: ['parameter-group', 'summary', 'subitem', 'add', payload],
      },
    ],
  });
};

export default useGetParameterGroupSummary;
