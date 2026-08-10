import { Verified } from '@mui/icons-material';
import { useQueries, useQuery } from '@tanstack/react-query';

import { ONE_MINUTE } from '@/configs/constants';
import {
  CollateralBoatControllerApi,
  CollateralBuildingControllerApi,
  CollateralComplementaryFacilitiesControllerApi,
  CollateralInventoryControllerApi,
  CollateralLandControllerApi,
  CollateralMachinesEquipmentControllerApi,
  CollateralVehicleControllerApi,
} from '@/services/openapi/lpa-service';

import { mods } from '../CollateralDetail.constants';

import type {
  GenericListDtoCollateralBoatResponseDto,
  GenericListDtoCollateralBuildingResponseDto,
  GenericListDtoCollateralComplementaryFacilitiesResponseDto,
  GenericListDtoCollateralInventoryResponseDto,
  GenericListDtoCollateralLandResponseDto,
  GenericListDtoCollateralMachinesEquipmentResponseDto,
  GenericListDtoCollateralVehicleResponseDto,
  ListCollateralTypeRequestDto,
} from '@/services/openapi/lpa-service';
import type { UseQueryOptions } from '@tanstack/react-query';


const useGetCollateralsList = (
  { payload, type }: GetCollateralListProp,
  config?: Partial<UseQueryOptions<any>>
) => {
  const {
    BOAT,
    BUILDING,
    COMPLEMENTARY_FACILITIES,
    INVENTORY,
    LAND,
    MACHINES_EQUIPMENT,
    VEHICLES,
    LAND_BUILDING,
  } = mods;

  const vehicles = useGetVehicleList(payload, { ...config, enabled: type === VEHICLES });
  const machineEquipments = useGetMachineEquipmentList(payload, { ...config, enabled: type === MACHINES_EQUIPMENT });
  const lands = useGetLandList(payload, { ...config, enabled: type === LAND });
  const inventories = useGetInventoryList(payload, { ...config, enabled: type === INVENTORY });
  const complementaryFacilities = useGetComplementaryFacilitiesList(
    payload, { ...config, enabled: type === COMPLEMENTARY_FACILITIES });
  const buildings = useGetBuildingList(payload, { ...config, enabled: type === BUILDING });
  const boats = useGetBoatList(payload, { ...config, enabled: type === BOAT });
  const landBuilding = useGetLandAndBuildings(payload, { ...config, enabled: type === LAND_BUILDING });

  switch (type) {
    case BOAT:
      return boats;
    case BUILDING:

      return buildings;
    case COMPLEMENTARY_FACILITIES:

      return complementaryFacilities;
    case INVENTORY:

      return inventories;
    case MACHINES_EQUIPMENT:

      return machineEquipments;
    case LAND:

      return lands;
    case VEHICLES:

      return vehicles;
    case LAND_BUILDING:

      return landBuilding;
    default:

      return [];
  }
};

const useGetVehicleList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralVehicleResponseDto>>) => {
  const api = new CollateralVehicleControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralVehicle(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'vehicle', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetMachineEquipmentList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralMachinesEquipmentResponseDto>>) => {

  const api = new CollateralMachinesEquipmentControllerApi() ;

  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralMachinesEquipment(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'machine', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetLandList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralLandResponseDto>>) => {
  const api = new CollateralLandControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralLand(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'land', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetInventoryList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralInventoryResponseDto>>) => {

  const api = new CollateralInventoryControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralInventory(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'inventory', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetComplementaryFacilitiesList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralComplementaryFacilitiesResponseDto>>) => {

  const api = new CollateralComplementaryFacilitiesControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralComplementaryFacilities(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'complementary', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetBuildingList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralBuildingResponseDto>>) => {

  const api = new CollateralBuildingControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralBuilding(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'building', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetBoatList = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralBoatResponseDto>>) => {

  const api = new CollateralBoatControllerApi() ;
  const query = useQuery({
    queryFn: async () => {
      const res = await api.getListCollateralBoat(payload);

      return res?.data?.data;
    },
    queryKey: ['collateral-list', 'boat', payload],
    staleTime: ONE_MINUTE,
    ...config,
  });

  return query;
};

const useGetLandAndBuildings = (
  payload: ListCollateralTypeRequestDto,
  config?: Partial<UseQueryOptions<GenericListDtoCollateralBoatResponseDto>>) => {

  const land = new CollateralLandControllerApi() ;
  const building = new CollateralBuildingControllerApi() ;

  const query = useQueries({
    combine: (results: any) => {
      const data = results.map((result) => result.data);

      return {
        data: data,
        pending: results.some((result) => result.isPending),
      };
    },
    queries: [
      {
        queryFn: async () => {
          const res = await land.getListCollateralLand(payload);

          return res.data.data;
        },
        queryKey: ['collateral-list', 'land', payload],
      },
      {
        queryFn: async () => {
          const res = await building.getListCollateralBuilding(payload);

          return res.data.data;
        },
        queryKey: ['collateral-list', 'building', payload],
      },
    ],
  });

  return query;
};
type GetCollateralListProp = {
  payload: ListCollateralTypeRequestDto;
  type: mods;
}
export default useGetCollateralsList;
