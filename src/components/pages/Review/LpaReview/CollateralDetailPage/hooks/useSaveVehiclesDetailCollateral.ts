import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { CollateralVehicleRequestDto } from '@/services/openapi/lpa-service';


const useSaveCollateralVehicle = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: CollateralVehicleRequestDto) => {
      const formData = new FormData();

      let documentFile: File | Blob | null = null;
      if (payload.document && (payload.document as any).document) {
        documentFile = (payload.document as any).document as File;
      }

      const jsonData: any = { ...payload };
      if (jsonData.document && jsonData.document.document) {
        jsonData.document = { ...jsonData.document };
        delete jsonData.document.document;
      }

      formData.append('data', new Blob([JSON.stringify(jsonData)], { type: 'application/json' }));

      if (documentFile) {
        formData.append('file', documentFile);
      } else {
        formData.append('file', new Blob([], { type: 'application/octet-stream' }));
      }

      const res = await API('lpa.collateralVehicle.save', {
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
      queryClient.invalidateQueries({ queryKey: ['collateral-vehicle-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-list']});
      queryClient.invalidateQueries({ queryKey: ['vehicle']});

      onSuccess(data.id);
    },
  });

  return mutation;
};

export default useSaveCollateralVehicle;
