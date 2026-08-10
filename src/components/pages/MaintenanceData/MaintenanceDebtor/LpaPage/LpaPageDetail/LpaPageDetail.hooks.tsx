import { useEffect, useState } from 'react';

import { usePathname, useParams } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';

import { maintenanceDebtor } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';
import { formatCurrency } from '@/helpers/formatCurrency';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';

import { useMaintenanceDataContext } from '@/components/layouts/MaintenanceData/MaintenanceData.context';
import useGetCollateralList from '@/components/pages/Review/LpaReview/DetailInformationPage/hooks/useGetCollateralList';
import Input from '@/components/shared/Input';

import { payloadFilterList } from '../../ManagementShareholder/ManagementShareholder.constants';
import useGetLpa from '../hooks/useGetLpa';
import useGetLpaDetail from '../hooks/useGetLpaDetail';

import { TableHeaderAgunan, TableHeaderRekonsiliasi } from './LpaPageDetail.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';


const useLpaPageDetail = () => {
  const router = useCustomRouter();
  const pathname = usePathname();
  const { processId } = useIdentity();

  const { lpaId } = useParams();
  const [container, setContainer] = useState(null);
  const { handleSetBreadcrumb } = useMaintenanceDataContext();

  const modul = pathname.split('/')[3];

  const { recordActivity } = useRecordLog();

  useEffect(() => {
    recordActivity({
      activity: ActivityType.VIEW,
      menuCode: 'maintenance-customer',
      module: TypeModule.MAINTENANCE_DATA,
      process: TypeProcess.MAINTENANCE_CUSTOMER,
      remarks: 'view maintenance customer lpa detail',
    });
  }, []);

  useEffect(() => {
    handleSetBreadcrumb([
      { label: 'LPA', url: replacePath(maintenanceDebtor.LPA_PAGE, {
        debtorId: processId,
        module: modul,
      }) },
      { label: 'Detail LPA', url: '' },
    ]);
  }, []);

  const { data: lpaData, isSuccess } = useGetLpa({
    filter: payloadFilterList(processId),
    page: {
      itemPerPage: 10,
      noPage: 1,
    },
    searchDetail: {},
    sortList: {},
  });

  const { data: lpaDetailData } = useGetLpaDetail(
    {
      bucketProcessId: lpaData?.data?.contents.filter((item: any) => item.id === lpaId)[0]?.bucketProcessIdLPA ?? '',
      id: lpaId,
      module: TypeModule.LPA,
      process: TypeProcess.LPA_REVIEW,
    },
    {
      enabled: isSuccess,
    }
  );


  const { control, setValue, reset, watch, getValues } = useForm({
    reValidateMode: 'onBlur',
  });


  // agunan
  const { data: getCollateralData, isLoading: collateralDataIsLoading } = useGetCollateralList({
    bucketProcessId: lpaData?.data?.contents.filter((item: any) => item.id === lpaId)[0]?.bucketProcessIdLPA ?? '',
    id: lpaId as string,
    module: TypeModule.LPA,
    process: TypeProcess.LPA_REVIEW,
  });

  const HeaderAgunan: Array<TableHeader> = [
    ...TableHeaderAgunan,
    {
      key: 'action',
      label: 'Action',
      options: [
        {
          iconName: 'detail',
          onClick: (data) => {
            router.push(replacePath(`${pathname}/${data.id}`, { id: data.id }));
          },
        },
      ],
      type: 'action',
    }
  ];

  // Rekonsiliasi
  const HeaderRekonsiliasi: Array<TableHeader> = [
    ...TableHeaderRekonsiliasi,
    {
      key: 'weight',
      label: 'Bobot',
      render: (row) => (
        <Controller
          name={row.key}
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              value={watch(row.key) ?? formatCurrency('0')}
              disabled={true}
            />
          )}
        />
      ),
      // sx: { width: '7.5vw' },
    },
    {
      key: 'marketValue',
      label: 'Nilai Pasar',
      render: (row) => (
        <Controller
          name={row.key}
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              value={formatCurrency(reconciliationCalculated[row.key].marketValue.toFixed(2))}
              disabled={true}
            />
          )}
        />
        // <TextStyle>{formatCurrency(reconciliationCalculated[row.key].marketValue.toFixed(2))}</TextStyle>
      ),
    },
    {
      key: 'liquidationValue',
      label: 'Indikasi Nilai Likuidasi',
      render: (row) => (
        <Controller
          name={row.key}
          control={control}
          render={({ field }) => (
            <Input
              type="number"
              value={formatCurrency(reconciliationCalculated[row.key].liquidationValue.toFixed(2))}
              disabled={true}
            />
          )}
        />
        // <TextStyle>{formatCurrency(reconciliationCalculated[row.key].liquidationValue.toFixed(2))}</TextStyle>
      ),
    },
  ];

  const [approachMethodology, setApproachMethodology] = useState([]);

  const [totalMaxReconciliationInput, setTotalMaxReconciliationInput] = useState(0);

  useEffect(() => {
    let res;
    res = parseFloat(getValues('costWeight')) + parseFloat(getValues('marketWeight')) + parseFloat(getValues('earningWeight'));
    setTotalMaxReconciliationInput(res);

  }, [watch('costWeight'), watch('marketWeight'), watch('earningWeight')]);

  const [reconciliationInput, setReconciliationInput] = useState({
    costWeight: 0,
    earningWeight: 0,
    marketWeight: 0,
  });

  const [reconciliationCalculated, setReconciliationCalculated] = useState({
    costWeight: { liquidationValue: 0, marketValue: 0 },
    earningWeight: { liquidationValue: 0, marketValue: 0 },
    marketWeight: { liquidationValue: 0, marketValue: 0 },
  });

  useEffect(() => {
    Object.keys(reconciliationInput).forEach((key) => {
      setReconciliationCalculated((prev) => {
        const approachData = totalApproachValueData.find((data) => data.key === key);

        const newData = { ...prev };
        newData[key] = {
          liquidationValue: reconciliationInput[key] * approachData.totalLiquidationValue / 100,
          marketValue: reconciliationInput[key] * approachData.totalMarketValue / 100,
        };

        return newData;
      });
    });

  }, [reconciliationInput, getCollateralData]);

  useEffect(() => {
    const data = lpaDetailData?.data?.content;
    reset(data);
    let approachMethodologyData = [];
    if (data?.earningApproach === true) approachMethodologyData.push('PENDEKATAN_PENDAPATAN');
    if (data?.marketApproach === true) approachMethodologyData.push('PENDEKATAN_PASAR');
    if (data?.costApproach === true) approachMethodologyData.push('PENDEKATAN_BIAYA');
    setApproachMethodology(approachMethodologyData);
    setReconciliationInput({
      costWeight: data?.costWeight,
      earningWeight: data?.earningWeight,
      marketWeight: data?.marketWeight,
    });
  }, [lpaDetailData, isSuccess]);

  const totalApproachValueData = [
    {
      approachMethodology: 'PENDEKATAN_PENDAPATAN',
      key: 'earningWeight',
      title: 'Pendekatan Pendapatan',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_PENDAPATAN') ? parseFloat(getCollateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_PENDAPATAN') ? parseFloat(getCollateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    },
    {
      approachMethodology: 'PENDEKATAN_BIAYA',
      key: 'costWeight',
      title: 'Pendekatan Biaya',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_BIAYA') ? parseFloat(getCollateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_BIAYA') ? parseFloat(getCollateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    },
    {
      approachMethodology: 'PENDEKATAN_PASAR',
      key: 'marketWeight',
      title: 'Pendekatan Pasar',
      totalLiquidationValue: approachMethodology.includes('PENDEKATAN_PASAR') ? parseFloat(getCollateralData?.totalIndicationLiquidationValue.replace(/,/g, '')) : 0,
      totalMarketValue: approachMethodology.includes('PENDEKATAN_PASAR') ? parseFloat(getCollateralData?.totalMarketValue.replace(/,/g, '')) : 0,
    }
  ];


  return {
    HeaderAgunan,
    HeaderRekonsiliasi,
    approachMethodology,
    collateralDataIsLoading,
    container,
    control,
    getCollateralData,
    reconciliationCalculated,
    reconciliationInput,
    setContainer,
    setValue,
    totalApproachValueData,
    totalMaxReconciliationInput,
    watch,
  };

};

export default useLpaPageDetail;
