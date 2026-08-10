import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useParams, usePathname } from 'next/navigation';
import { useForm } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDate } from '@/helpers/date';
import { replacePath } from '@/helpers/navigation';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';

import { payloadFilterList } from '../../../ManagementShareholder/ManagementShareholder.constants';
import useGetAssetList from '../../hooks/useGetAssetList';
import useGetCollateralDetail from '../../hooks/useGetCollateralDetai';
import useGetLpa from '../../hooks/useGetLpa';

import DetailAset from './component/DetailAset/DetailAset';
import {
  MODAL,
  tableHeaderBangunan,
  tableHeaderMesin,
  tableHeaderSaranaPelengkap,
  tableHeaderTanah,
  tableHeaderKapal,
  tableHeaderKendaraan,
  tableHeaderInventory,
} from './DetailAgunan.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useDetailAgunan = () => {
  const pathname = usePathname();
  const { agunanId, lpaId, processId } = useParams();
  const { control, setValue, watch } = useForm();
  const [documentAsset, setDocumentAsset] = useState({});
  const { handleSetBreadcrumb } = useMaintenanceDataContext();
  const modul = pathname.split('/')[3];
  const [typeAgunan, setTypeAgunan] = useState('');
  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer lpa detail agunan',
    });
  }, []);

  const { data: typeProperty } = useGetParameterList('typePropertyCollateralLandBuildingLPA');


  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'LPA', url: replacePath(maintenanceDebtor.LPA_PAGE, {
        debtorId: processId,
        module: modul,
      }) },
      { label: 'Detail LPA', url: replacePath(maintenanceDebtor.DETAIL_LPA_PAGE, {
        debtorId: processId,
        lpaId: lpaId,
        module: modul,
      }) },
      { label: 'Detail Agunan', url: '' },
    ]);
  }, []);


  const { data: lpaData, isSuccess: isSuccessLpa } = useGetLpa({
    filter: payloadFilterList(processId as string),
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: {},
    sortList: {},
  });

  const { data: collateralDetailData, isSuccess: isSuccessCollateralDetail } = useGetCollateralDetail({
    bucketProcessId: (lpaData as any)?.data?.contents.filter((item: any) => item.id === lpaId)[0]?.bucketProcessIdLPA ?? '',
    id: agunanId,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  }, {
    enabled: isSuccessLpa,
  });

  useEffect(() => {
    const data = (collateralDetailData as any)?.data?.content;
    if (collateralDetailData && isSuccessCollateralDetail) {
      setValue('collateralDetailData', data);
      setDocumentAsset(data?.document ?? {});
      setTypeAgunan(data?.type ?? '');

      if (data?.marketValue !== '' &&
        (data?.marketValue?.includes(',') || data?.marketValue?.includes('.'))) {
        setValue('collateralDetailData.marketValue', Number(data?.marketValue.replace(/[^0-9.-]+/g, '')));
      }
      if (data?.indicationLiquidationValue !== '' &&
        (data?.indicationLiquidationValue?.includes(',') || data?.indicationLiquidationValue?.includes('.'))) {
        setValue('collateralDetailData.indicationLiquidationValue', Number(data?.indicationLiquidationValue.replace(/[^0-9.-]+/g, '')));
      }
      if (data?.marketValueIdr !== '' &&
        (data?.marketValueIdr?.includes(',') || data?.marketValueIdr?.includes('.'))) {
        setValue('collateralDetailData.marketValueIdr', Number(data?.marketValueIdr.replace(/[^0-9.-]+/g, '')));
      }
      if (data?.indicationLiquidationIdr !== '' &&
        (data?.indicationLiquidationIdr?.includes(',') || data?.indicationLiquidationIdr?.includes('.'))) {
        setValue('collateralDetailData.indicationLiquidationIdr', Number(data?.indicationLiquidationIdr.replace(/[^0-9.-]+/g, '')));
      }
    }

    console.log('get value', watch('collateralDetailData'));

  }, [collateralDetailData, isSuccessCollateralDetail]);

  const { data: assetListData, isSuccess: isSuccessAssetList } = useGetAssetList({
    bucketProcessId: (lpaData as any)?.data?.contents.filter((item: any) => item.id === lpaId)[0]?.bucketProcessIdLPA ?? '',
    collateralId: agunanId,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  }, {
    enabled: isSuccessLpa && isSuccessCollateralDetail && !!typeAgunan,
  }, typeAgunan);


  const [assetList, setAssetList] = useState<any[]>([]);
  const [assetListBuilding, setAssetListBuilding] = useState<any[]>([]);
  const [assetListLand, setAssetListLand] = useState<any[]>([]);

  const mappingAssetList = (contents: any[] = []) => {
    const mappedAssets = contents.map((item: any) => {
      const formattedItem = Object.keys(item).reduce((acc: any, key: string) => {
        const value = item[key];
        if (typeof key === 'string' && key.toLowerCase().includes('date') && value) {
          try {
            acc[key] = formatDate(value);
          } catch (_error) {
            acc[key] = value;
          }
        } else {
          acc[key] = value;
        }
        return acc;
      }, {} as any);

      return {
        ...formattedItem,
        documentName: item?.document?.documentName ?? '-',
      };
    });
    return mappedAssets;
  };

  useEffect(() => {
    console.log(assetListData);
    console.log(isSuccessAssetList);
    if (typeAgunan === 'LAND_BUILDING') {
      setAssetListLand(mappingAssetList((assetListData as any)?.data[0]?.responseLand?.contents));
      setAssetListBuilding(mappingAssetList((assetListData as any)?.data[0]?.responseBuilding?.contents));
    } else {
      setAssetList(mappingAssetList((assetListData as any)?.data?.contents));
    }


  }, [assetListData, isSuccessAssetList]);


  const handleApprovalModal = (item: any) => {
    NiceModal.show(MODAL.DETAIL_AGUNAN_TANAH, {
      item,
      typeAgunan,
    });
  };

  const tableHeaderList: TableHeader[] = [
    ...(
      typeAgunan === 'LAND'
        ? tableHeaderTanah
        : typeAgunan === 'BUILDING'
          ? tableHeaderBangunan
          : typeAgunan === 'MACHINES_EQUIPMENT'
            ? tableHeaderMesin
            : typeAgunan === 'COMPLEMENTARY_FACILITIES'
              ? tableHeaderSaranaPelengkap
              : typeAgunan === 'BOAT'
                ? tableHeaderKapal
                : typeAgunan === 'VEHICLES'
                  ? tableHeaderKendaraan
                  : typeAgunan === 'INVENTORY'
                    ? tableHeaderInventory
                    : []
    ) as TableHeader[],
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (item) => handleApprovalModal(item),
        },
      ],
      type: 'action',
    }
  ];

  const tableHeaderListLand: Array<TableHeader> = [
    ...tableHeaderTanah,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (item) => handleApprovalModal({
            ...item,
            typeAgunan: 'LAND',
          }),
        },
      ],
      type: 'action',
    }
  ];

  const tableHeaderListBuilding: Array<TableHeader> = [
    ...tableHeaderBangunan,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (item) => handleApprovalModal({
            ...item,
            typeAgunan: 'BUILDING',
          }),
        },
      ],
      type: 'action',
    }
  ];

  NiceModal.register(MODAL.DETAIL_AGUNAN_TANAH, DetailAset);

  return {
    assetList,
    assetListBuilding,
    assetListLand,
    control,
    documentAsset,
    setValue,
    tableHeaderList,
    tableHeaderListBuilding,
    tableHeaderListLand,
    typeAgunan,
    typeProperty,
    watch,
  };
};

export default useDetailAgunan;
