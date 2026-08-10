import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';
import creditChecking from '@/services/endpoint/credit-checking';
import { SummaryControllerApi } from '@/services/openapi/credit-checking-service';

import type { SummaryAttachmentRequestDto } from '@/services/openapi/credit-checking-service';
import type { UseMutationOptions } from '@tanstack/react-query';


const api = new SummaryControllerApi();
export enum SummaryAttachmentDocumentGroup {
  DigitalMemo = 'DIGITAL_MEMO',
  FinancingDocument = 'FINANCING_DOCUMENT',
  SupportingDocument = 'SUPPORTING_DOCUMENT',
}
interface SummaryAttachment {
  bucketProcessId?: string;
  documentGroup?: SummaryAttachmentDocumentGroup;
  attachments?: number[];
}
interface SaveSummaryPayload {
  bucketProcessId?: string;
  disclaimer?: Blob;
  notes?: Blob;
  options?: SummaryAttachmentRequestDto[];
}
interface SummaryApiResponse {
  operationId: string | null;
  errorCode: string;
  errorDesc: string;
  errorSource: string;
  errorDetail: string | null;
  timestamp: string;
  data: {
    content: {
      id: number;
      bucketProcessId: string;
      disclaimer: string;
      notes: string;
      viewOnly: boolean;
    };
  };
}

const useSaveSummary = (
  config?: Partial<UseMutationOptions<SummaryApiResponse, Error, SaveSummaryPayload>>,
  onSuccess = (data, variables) => {},

) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveSummaryPayload) => {
      const { bucketProcessId, disclaimer, notes, options } = payload;
      const res = await API('creditChecking.creditChecking.saveSummary', {
        data: { bucketProcessId, notes, options },
        headers: { 'Content-Type': 'multipart/form-data' },
      }
      );

      return res.data;
    },
    onError: (error) => {
      // onError();
      console.error('Failed to Save Summary:', error);

    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ['get-summary', {
        bucketProcessId: variables.bucketProcessId,
      }]});
      console.error('Successfully Save Summary:', data);
      onSuccess(data, variables);
    },
    ...config,
  });

  return mutation;
};


export default useSaveSummary;
