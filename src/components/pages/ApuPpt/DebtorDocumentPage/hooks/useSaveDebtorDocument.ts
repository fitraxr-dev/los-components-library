import { useMutation, useQueryClient } from '@tanstack/react-query';

import { DocumentDebtorControllerApi } from '@/services/openapi/mip-service';


const api = new DocumentDebtorControllerApi();

type SaveDebtorDocumentProps = {
  id: number;
  bucketProcessId: string;
  module: string;
  process: string;
  document: string;
  isBusinessCheck?: boolean;
  assessmentResult: any;
  documentDebtorType: string;
  isDpopCheck?: boolean;
  isCopy?: boolean;
  status?: string;
  verificationResult?: any;
}

const useSaveDebtorDocument = ({
  onSuccess = () => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveDebtorDocumentProps) => {
      const {
        id,
        bucketProcessId,
        process,
        module,
        document,
        isBusinessCheck,
        isCopy,
        isDpopCheck,
        assessmentResult,
        documentDebtorType,
        status,
        verificationResult,
      } = payload;

      const res = await api.saveDocumentDebtor(
        bucketProcessId,
        process,
        module,
        documentDebtorType,
        id,
        document,
        isBusinessCheck,
        isDpopCheck,
        isCopy,
        status,
        assessmentResult,
        verificationResult
      );

      return res.data;
    },
    onError: () => {
      onError();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['debtor-document', { id: variables.id }]});
      queryClient.invalidateQueries({ queryKey: ['debtor-documents', {
        bucketProcessId: variables.bucketProcessId,
        documentDebtorType: variables.documentDebtorType,
        module: variables.module,
        process: variables.process,
      }]});
      onSuccess();
    },
  });

  return mutation;
};

export default useSaveDebtorDocument;
