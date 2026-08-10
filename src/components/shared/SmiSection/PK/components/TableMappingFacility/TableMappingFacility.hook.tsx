import { useEffect, useMemo, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname } from 'next/navigation';

import { BUSINESS_DIVISION_LIST } from '@/configs/constants';
import { legalSigning, engagementSubmission } from '@/configs/constants/pathname';
import { TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useAutoSaveDraft from '@/hooks/useAutoSaveDraft';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useViewOnly from '@/hooks/useViewOnly';

import TextStyle from '@/components/shared/TextStyle';

import useGetListFinancingPk from '../../hooks/useGetListFinancingPk';
import useSaveFinancingPk from '../../hooks/useSaveFinancingPk';
import { MODALPK } from '../../PK.constants';

import type { PkTabsProps } from '../../PK.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


const useTableMappingFacility = ({ handleNextTab, pkStatus }: PkTabsProps) => {
  const { processId, childId, parentId } = useIdentity();
  const [selected, setSelected] = useState([]);
  const [payloadSelected, setPayloadSelected] = useState([]);
  const { viewOnly } = useViewOnly();
  const [contents, setContents] = useState([]);
  const [navigateSave, setNavigateSave] = useState(false);
  const noPage = 1;
  const itemPerPage = 100;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const path = usePathname();

  const [appState] = useApp();
  const currentStatus = appState?.stepper?.from;

  const { divisionCode } = useDivision();
  const divisiBisnisArray = BUSINESS_DIVISION_LIST;
  const statusCheckBoxList = [
    'ASK_FOR_INFO',
    'PK_ENGAGEMENT_DRAFT',
  ];

  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);

  const currentPathModule = path?.split('/')[2];
  const pathModuleLegalSigning = legalSigning.LIST_PAGE?.split('/')[2];
  const pathModulePk = engagementSubmission.LIST_PAGE?.split('/')[2];
  const isLegalSigning = currentPathModule === pathModuleLegalSigning;
  const isPkRoute = currentPathModule === pathModulePk;
  const isMaker = appState?.currentRole?.includes('MAKER');
  const isStaff = appState?.currentRole?.includes('STAFF');
  const isStatus = pkStatus === statusCheckBoxList[0] && (isMaker || isStaff) || pkStatus === statusCheckBoxList[1];
  const isCheckbox = ((isMaker ? isMaker : isDivisiBisnis) && isStatus);

  const openModalDetail = (id: number, facilityId: string, bucketProcessId: string) => {
    NiceModal.show(MODALPK.DETAIL_FACILITY_PK, { facilityId, id, processId: bucketProcessId });
  };

  const isViewOnly = useMemo(() => {
    return viewOnly;
  }, [viewOnly]);

  const { data: facilityListContents } = useGetListFinancingPk(
    {
      filter: {
        bucketProcessId: isLegalSigning ? parentId : processId,
        module: TypeProcess.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
      },
      page: {
        itemPerPage: itemPerPage,
        noPage: noPage,
      },
    },
    {
      bucketParentId: isLegalSigning ? parentId : processId,
    },
    childId,
    isLegalSigning || isViewOnly

  );

  const filteredFacilityListContents = useMemo(
    () => facilityListContents.filter((res) => res !== undefined),
    [facilityListContents]
  );

  const { mutate: saveFinancingPk, isPending: isLoading } = useSaveFinancingPk({
    onError: () => {
      setNavigateSave(false);
      showNiceModalV2({ type: 'error' });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['validate-result-debtor']});
      queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});

      if (navigateSave) {
        showNiceModalV2({
          onClose: () => {
            setNavigateSave(false);
            handleNextTab();
          },
          title: 'Mapping fasilitas kredit ke PK berhasil',
          type: 'success',
        });
      } else {
        showNiceModalV2({
          title: 'Mapping fasilitas kredit ke PK berhasil',
          type: 'success',
        });
      }
    },
  });

  const tableHeader: TableHeader[] = [
    {
      key: 'index',
      label: 'No',
      sx: { minWidth: '3.5vw' },
      type: 'index',
    },
    {
      key: 'parentSyariahLimitId',
      label: 'ID Limit Induk',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'facilityId',
      label: 'ID Fasilitas',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'orderTypeLabel',
      label: 'Order Type',
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'mappingOrderTypeLabel',
      label: 'Mapping Order Type',
      sx: { minWidth: '12.5vw' },
    },
    {
      key: 'financingSegmentLabel',
      label: 'Segmen Pembiayaan',
      sx: {
        minWidth: '12.5vw',
      },
    },
    {
      key: 'mappingFinancingSegmentLabel',
      label: 'CORE Mapping Segmen Pembiayaan',
      sx: {
        minWidth: '19.5vw',
      },
    },
    {
      key: 'productLabel',
      label: 'Produk/Skema Pembiayaan',
      sx: { minWidth: '10vw' },
    },
    {
      key: 'totalOrderValue',
      label: 'Nominal',
      render: (data) => {
        return <TextStyle>{(data?.currencyOrderValueAfterExchangeRate || '') + ' ' + data?.totalOrderValue}</TextStyle>;
      },
      sx: { minWidth: '7.5vw' },
    },
    {
      key: 'timePeriod',
      label: 'Jangka Waktu',
      sx: { minWidth: '8.5vw' },
    },
    {
      key: 'projectName',
      label: 'Proyek',
      sx: { minWidth: '8.5vw' },
    },
    {
      key: 'remark',
      label: 'Keterangan',
      sx: { minWidth: '8.5vw' },
    },
    {
      key: 'action',
      label: 'Action',
      options: [
        { iconName: 'detail', onClick: (data) => openModalDetail(data?.id, data?.facilityId, data?.bucketProcessId) },
      ],
      type: 'action',
    },
  ];

  if (isPkRoute && isCheckbox) {
    tableHeader.unshift({
      // isDisabled: () => !isCheckbox,
      isSelected: (data) => selected?.includes(data?.facilityId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected?.includes(data?.facilityId)) {
          setSelected(selected.filter((el) => el !== data.facilityId));
          if (payloadSelected.some((el) => el.facilityId === data.facilityId)) {
            setPayloadSelected(payloadSelected.filter((el) => el.facilityId !== data.facilityId));
          }
        } else {
          setSelected((prevState) => ([...prevState, data?.facilityId]));
          setPayloadSelected((prevState) => ([...prevState, {
            facilityId: data.facilityId,
            financingFacilityId: data.id,
          }]));
        }
      },
      type: 'checkbox',
    });
  }

  useEffect(() => {
    if (filteredFacilityListContents) {
      const listHasPkName = filteredFacilityListContents
        .filter((res) => res?.pkName !== null && res?.bucketProcessIdMapping === childId)
        .map((item) => item.facilityId);
      setSelected(listHasPkName);
      setPayloadSelected(filteredFacilityListContents.filter((res) => res?.pkName !== null
        && res?.bucketProcessIdMapping === childId).map((item) => ({
        facilityId: item.facilityId,
        financingFacilityId: item.id,
      })));
    }
  }, [filteredFacilityListContents, childId]);

  const autoSavePayload = useMemo(() => () => {
    return Promise.resolve({
      bucketParentId: processId,
      bucketProcessId: childId,
      financingFacilities: payloadSelected?.map((res) => ({
        facilityId: res.facilityId,
        financingFacilityId: res.financingFacilityId,
      })) || [],
      module: TypeProcess.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    });
  }, [processId, childId, payloadSelected]);

  const { isFetching: isAutoSaveFetching } = useAutoSaveDraft({
    isActive: isCheckbox && isPkRoute,
    payload: autoSavePayload,
    url: 'agreement.add.saveMapp',
  });

  function handleSave() {
    const payloadPk = {
      bucketParentId: processId,
      bucketProcessId: childId,
      financingFacilities: payloadSelected?.map((res) => ({
        facilityId: res.facilityId,
        financingFacilityId: res.financingFacilityId,
      })) || [],
      module: TypeProcess.ENGAGEMENT_AGREEMENT,
      process: TypeProcess.ENGAGEMENT_AGREEMENT,
    };
    setNavigateSave(false);
    saveFinancingPk(payloadPk as any);
  };

  function handleNext() {
    if (viewOnly) {
      handleNextTab();
    } else {
      const payloadPk = {
        bucketParentId: processId,
        bucketProcessId: childId,
        financingFacilities: payloadSelected?.map((res) => ({
          facilityId: res.facilityId,
          financingFacilityId: res.financingFacilityId,
        })) || [],
        module: TypeProcess.ENGAGEMENT_AGREEMENT,
        process: TypeProcess.ENGAGEMENT_AGREEMENT,
      };
      setNavigateSave(true);
      saveFinancingPk(payloadPk as any);
    }
  };

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]) {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      // Ambil dari facility.totalOrderValue
      const orderValue = facility?.totalOrderValue ? facility.totalOrderValue : 0;

      // Add the orderValue to the total
      totalOrderValue += orderValue;
    });

    // Format totalOrderValue with commas and two decimal places
    const formattedTotal = totalOrderValue.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });

    return formattedTotal;
  }

  const [totalOrder, setTotalOrder] = useState('');
  useEffect(() => {
    if (filteredFacilityListContents) {
      const facilityList = filteredFacilityListContents;
      const totalOrderValue = calculateTotalOrderValue(facilityList);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
    }
  }, [filteredFacilityListContents]);

  useEffect(() => {
    if (filteredFacilityListContents) {
      const transformedData = filteredFacilityListContents.map((data) => {
        return {
          ...data,
          totalOrderValue: formatNumberWithCommas(data?.totalOrderValue || 0),
        };
      });
      setContents(transformedData);
    }
  }, [filteredFacilityListContents]);

  return {
    facilityListContents: contents,
    handleNext,
    handleSave,
    isAutoSaveFetching,
    isCheckbox,
    isLegalSigning,
    isLoading,
    isPkRoute,
    selected,
    tableHeader,
    theme,
    totalOrder,
    viewOnly,
  };
};

export default useTableMappingFacility;
