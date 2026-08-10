import { keepPreviousData, useQueries } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { GenericBucketRequestDto } from '@/helpers/api/types';
import type { GenericBucketRequestDtoDocumentTypeRequestDto } from '@/services/openapi/bucket-document-service';


interface SelectedDocumentsFilter {
  debtorId?: string;
  ownerId?: string;
  summaryId?: number | null;
}

type SummaryDocumentsPayload = GenericBucketRequestDtoDocumentTypeRequestDto & { filter: { id: number } };
type SelectedDocumentsPayload = GenericBucketRequestDto<SelectedDocumentsFilter>;

export interface UseCombinedDocumentsResult {
  summaryDocuments: any;
  selectedDocuments: any;
  isLoading: boolean;
  isPending: boolean;
  isError: boolean;
  error: unknown;
  refetchAll: () => Promise<void>;
}

const useGetResultDocuments = (
  summaryPayload: SummaryDocumentsPayload,
  selectedPayload: SelectedDocumentsPayload,
  options: any = {}
): UseCombinedDocumentsResult => {
  const { documentConfig, selectedConfig, enabled = true } = options;

  return useQueries({
    combine: (results) => {
      const [summaryDocuments, selectedDocuments] = results;

      const isLoading = results.some((r) => r.isLoading);
      const isPending = results.some((r) => r.isPending);
      const isError = results.some((r) => r.isError);
      const error = results.find((r) => r.isError)?.error ?? null;

      const refetchAll = async () => {
        await Promise.all(results.map((r) => r.refetch()));
      };

      return {
        error,
        isError,
        isLoading,
        isPending,
        refetchAll,
        selectedDocuments: selectedDocuments?.data,
        summaryDocuments: summaryDocuments?.data,
      };
    },
    queries: [
      {
        enabled,
        placeholderData: keepPreviousData,
        queryFn: async () => {
          try {
            const res = await API('bucketDocument.document.summary', {
              data: summaryPayload,
            });

            return res?.data?.data;
          } catch (error) {
            console.error(
              '[useGetResultDocuments] summaryDocuments failed',
              { error, summaryPayload }
            );
            throw error;
          }
        },
        queryKey: ['fast-track', 'result', 'summary-documents', summaryPayload],
        ...documentConfig,
      },
      {
        enabled,
        queryFn: async () => {
          try {
            const res = await API('fastTrack.result.selectedDocuments', {
              data: selectedPayload,
            });

            return res?.data?.data;
          } catch (error) {
            console.error(
              '[useGetResultDocuments] selectedDocuments failed',
              { error, selectedPayload }
            );
            throw error;
          }
        },
        queryKey: ['fast-track', 'result', 'selected-documents', selectedPayload],
        ...selectedConfig,
      },
    ],
  });
};

export default useGetResultDocuments;
