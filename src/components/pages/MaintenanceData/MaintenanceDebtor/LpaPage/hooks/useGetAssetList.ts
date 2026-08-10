import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { API } from '@/helpers/api';

import type { AxiosResponse } from 'axios';


const useGetAssetList = (
  payload: any,
  options?: any,
  typeAgunan?: string,
) => {
  const query = useQuery(
    {
      placeholderData: keepPreviousData,
      queryFn: async () => {
        try {
          let response: AxiosResponse<any, any>;
          let dataLandBuilding = [];
          if (typeAgunan === 'LAND') {
            response = await API('lpa.lpaDetail.getCollateralLandList', { data: payload });
          } else if (typeAgunan === 'BUILDING') {
            response = await API('lpa.lpaDetail.getCollateralBuildingList', { data: payload });
          } else if (typeAgunan === 'MACHINES_EQUIPMENT') {
            response = await API('lpa.lpaDetail.getCollateralMachinesEquipmentList', { data: payload });
          } else if (typeAgunan === 'COMPLEMENTARY_FACILITIES') {
            response = await API('lpa.lpaDetail.getCollateralComplementaryFacilitiesList', { data: payload });
          } else if (typeAgunan === 'INVENTORY') {
            response = await API('lpa.lpaDetail.getCollateralInventoryList', { data: payload });
          } else if (typeAgunan === 'VEHICLES') {
            response = await API('lpa.lpaDetail.getCollateralVehicleList', { data: payload });
          } else if (typeAgunan === 'BOAT') {
            response = await API('lpa.lpaDetail.getCollateralBoatList', { data: payload });
          } else if (typeAgunan === 'LAND_BUILDING') {
            const responseLand = await API('lpa.lpaDetail.getCollateralLandList', { data: payload });
            const responseBuilding = await API('lpa.lpaDetail.getCollateralBuildingList', { data: payload });
            dataLandBuilding = [
              {
                responseBuilding: responseBuilding.data.data,
                responseLand: responseLand.data.data,
              }
            ];
            response = { data: { data: dataLandBuilding } } as AxiosResponse<any, any>;
          }


          return response.data;
        } catch (error) {
          throw error;
        }
      },
      queryKey: [
        'maintenance-asset-list-data',
        payload
      ],
      ...options,
    }
  );

  // console.log('query', query);
  // console.log('typeAgunan', typeAgunan);

  return query;

};

export default useGetAssetList;
