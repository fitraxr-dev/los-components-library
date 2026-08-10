import { useMutation, useQueryClient } from '@tanstack/react-query';

import { API } from '@/helpers/api';


const useSaveCollateral = ({
  onSuccess = (data: any) => {},
  onError = () => {},
}) => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (payload: SaveCollateralPayload) => {
      const formData = new FormData();

      Object.keys(payload).forEach((key) => {
        const value = payload[key];
        if (value !== null && value !== undefined) {
          if (value instanceof Blob) {
            formData.append(key, value);
          } else if (typeof value === 'object') {
            formData.append(key, JSON.stringify(value));
          } else {
            formData.append(key, String(value));
          }
        }
      });

      const res = await API('lpa.collateral.save', {
        data: formData,
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      return res.data.data.content;
    },
    onError: () => {
      onError();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['lpa-detail']});
      queryClient.invalidateQueries({ queryKey: ['collateral-detail']});
      onSuccess(data.id);
    },
  });

  return mutation;
};
type SaveCollateralPayload = {
  parentId: string;
  bucketProcessId: string;
  module: string;
  process: string;
  type: string;
  id?: string;
  description?: any;
  objectLocation?: string;
  coordinate?: string;
  propertyTypeRemark?: string;
  buildingTypeRemark?: string;
  buildingTypeOtherRemark?: string;
  indicationLiquidationValue?: string;
  indicationLiquidationCurrencyCode?: string;
  indicationLiquidationFxRateToIdr?: string;
  indicationLiquidationFxRateSource?: string;
  indicationLiquidationIdr?: string;
  marketValue?: string;
  marketValueCurrencyCode?: string;
  marketValueFxRateToIdr?: string;
  marketValueFxRateSource?: string;
  marketValueIdr?: string;
  detailLocation?: string;
  proofOwnership?: string;
  assesmentObject?: string;
  document?: string;
  documentFile?: File;
};


export default useSaveCollateral;
