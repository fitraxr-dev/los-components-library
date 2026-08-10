import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { CollateralBoatRequestDto } from '@/services/openapi/lpa-service';


const useSaveCollateralBoat = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CollateralBoatRequestDto) => {
      const formData = new FormData();

      let documentFile = null;
      if (payload.document && payload.document.document) {
        documentFile = payload.document.document;
      }

      const jsonData = { ...payload };
      if (jsonData.document && jsonData.document.document) {
        jsonData.document = { ...jsonData.document };
        delete jsonData.document.document; // Remove the file from JSON data
      }

      formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      if (documentFile) {
        formData.append('file', documentFile);
      } else {
        formData.append('file', new Blob([], { type: 'application/octet-stream' }));
      }

      const res = await API('lpa.collateralBoat.save', {
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['collateral-boat-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['boat']});
      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useSaveCollateralBoat;
