import { useEffect, useState } from 'react';

import NiceModal from '@ebay/nice-modal-react';
import { useTheme } from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { usePathname, useSearchParams } from 'next/navigation';

import {
  BUSINESS_DIVISION,
  SECOND_FINANCING_DIVISION,
  DPB_DIVISION,
  DUS_DIVISION,
  DPPU_1_DIVISION,
  DPPU_3_DIVISION,
  roles,
  DPPU_2_DIVISION,
  DP_2_DIVISION,
} from '@/configs/constants';
import { legalSigning } from '@/configs/constants/pathname';
import { ActivityType } from '@/enums/Activity';
import { TypeModule, TypeProcess } from '@/enums/Module';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useDivision from '@/hooks/useDivision';
import useIdentity from '@/hooks/useIdentity';
import useRecordLog from '@/hooks/useRecordLog';
import useViewOnly from '@/hooks/useViewOnly';

import useGetDetailProcessingType from '@/components/shared/SmiSection/PK/hooks/useGetDetailProcessingType';
import useGetDetailSyariahFacility from '@/components/shared/SmiSection/PK/hooks/useGetDetailSyariahFacility';
import useGetFinancingFacilityMapping from '@/components/shared/SmiSection/PK/hooks/useGetFinancingFacilityMapping';
import useGetListFinancingPk from '@/components/shared/SmiSection/PK/hooks/useGetListFinancingPk';
import useSaveFinancingPk from '@/components/shared/SmiSection/PK/hooks/useSaveFinancingPk';
import { MODALPK } from '@/components/shared/SmiSection/PK/PK.constants';

import useSaveChildLimit from '../hooks/useSaveChildLimit';
import { tab } from '../ParentChildLimitPage/ParentChildLimit.constant';

import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { ListFinancingFacilityResponseDto } from '@/services/openapi/bucket-service';


interface UseChildLimitProps {
  financingFacilityId?: number | null;
  setActiveTab: (tab: string) => void;
}

const useChildLimit = ({ financingFacilityId: financingFacilityIdProp, setActiveTab }: UseChildLimitProps) => {
  const { processId, parentId } = useIdentity();
  const { viewOnly } = useViewOnly();
  const searchParams = useSearchParams();
  const [selected, setSelected] = useState<string[]>([]);
  const noPage = 1;
  const itemPerPage = 100;
  const theme = useTheme();
  const queryClient = useQueryClient();
  const path = usePathname();
  const router = useCustomRouter();
  const [disableSave, setDisableSave] = useState(false);
  const [payloadChild, setPayloadChild] = useState(null);
  const { recordActivity } = useRecordLog();


  const financingFacilityIdFromUrl = searchParams.get('financingFacilityId');
  const facilityIdFromUrl = searchParams.get('facilityId');
  const lpsMode = searchParams.get('lpsMode') === 'true';
  const isFromLimitInduk = searchParams.get('fromLimitInduk') === 'true';

  const {
    data: pkDetail,
  } = useGetDetailProcessingType(
    { bucketProcessId: parentId, id: 0 },
    { enabled: lpsMode }
  );

  let financingFacilityId: number | null = null;

  if (financingFacilityIdProp) {
    financingFacilityId =
      typeof financingFacilityIdProp === 'string'
        ? Number(financingFacilityIdProp)
        : financingFacilityIdProp;
  } else if (financingFacilityIdFromUrl) {
    financingFacilityId = Number(financingFacilityIdFromUrl);
  }

  const isParentChildLimitMode = !!financingFacilityId || !!financingFacilityIdFromUrl;
  const isAddNewMode = isParentChildLimitMode && !financingFacilityId;
  const viewOnlyParam = searchParams.get('viewOnly');
  const isDetailMode = viewOnlyParam === 'true';
  const isLpsMode = lpsMode;
  const isLegalSigningParam = searchParams.get('isLegalSigning') === 'true';

  const payload = {
    bucketProcessId: processId,
    parentSyariahLimitId: searchParams.get('parentSyariahLimitId') || undefined,
  };

  const { data: detailData } = useGetDetailSyariahFacility({ filter: payload }, !!searchParams.get('parentSyariahLimitId'));

  const { divisionCode } = useDivision();
  const divisiBisnisArray = [
    BUSINESS_DIVISION,
    SECOND_FINANCING_DIVISION,
    DPB_DIVISION,
    DP_2_DIVISION,
    DUS_DIVISION,
    DPPU_1_DIVISION,
    DPPU_2_DIVISION,
    DPPU_3_DIVISION,
  ];
  const isDivisiBisnis = divisiBisnisArray.includes(divisionCode);

  const currentPathModule = path?.split('/')[2];
  const pathModuleLegalSigning = legalSigning.LIST_PAGE?.split('/')[2];
  const isLegalSigning = currentPathModule === pathModuleLegalSigning;
  const [{ currentRole }] = useApp();
  const isMaker = currentRole?.includes?.(roles.MAKER);
  console.log('isMaker', isMaker);
  console.log('currentRole', currentRole);

  const openModalDetail = (data: any) => {
    NiceModal.show(MODALPK.DETAIL_FACILITY, {
      hidePK: true,
      id: data?.id,
      idFacility: data?.facilityId,
      processId: isLegalSigning ? parentId : processId,
    });
  };

  const [tableData, setTableData] = useState<any[]>([]);

  const { data: mappingData } = useGetFinancingFacilityMapping(
    {
      bucketParentId: isLegalSigning ? parentId : processId,
    },
    isParentChildLimitMode
  );

  const payloadFilter: any = {
    bucketProcessId: isLegalSigning ? parentId : processId,
    module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
    process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
  };

  const { data: facilityListContents } = useGetListFinancingPk(
    {
      filter: payloadFilter,
      page: {
        itemPerPage: itemPerPage,
        noPage: noPage,
      },
    },
    {
      bucketParentId: lpsMode ? pkDetail?.bucketParentId : (isLegalSigning ? parentId : processId),
    }
  );

  useEffect(() => {
    if (facilityListContents) {
      const listFacility = JSON.parse(localStorage.getItem('facilityhasUsed') || '[]');
      let transformedData = facilityListContents.map((data) => {
        if (isLegalSigningParam || lpsMode || viewOnly) {
          if (listFacility.includes(data.facilityId)) {
            const displayOrderValue =
              data?.financingSegment === 'SYARIAH'
                ? `IDR ${formatNumberWithCommas(data?.totalOrderValue || 0)}`
                : `${data?.currencyOrderValueAfterExchangeRate} ${data?.orderValueAfterExchangeRate}`;
            return {
              ...data,
              orderValue: displayOrderValue,
            };
          }
        } else {
          if (!listFacility.includes(data.facilityId)) {
            const displayOrderValue =
              data?.financingSegment === 'SYARIAH'
                ? `IDR ${formatNumberWithCommas(data?.totalOrderValue || 0)}`
                : `${data?.currencyOrderValueAfterExchangeRate} ${data?.orderValueAfterExchangeRate}`;
            return {
              ...data,
              orderValue: displayOrderValue,
            };
          }
        }
        return null;
      });

      transformedData = transformedData.filter((facility) => facility?.financingSegment === 'SYARIAH');

      if (isLpsMode) {
        // Mode LPS: Gunakan data sesuai listFacility (localStorage) yang sudah disiapkan sebelumnya
      } else if (isParentChildLimitMode) {
        const mappingContents = mappingData?.contents || [];
        const facilityMappingMap = new Map<string, number | null>();

        mappingContents.forEach((item) => {
          facilityMappingMap.set(item.facilityId, item.financingFacilityId);
        });

        if (isDetailMode && financingFacilityId) {
          transformedData = transformedData.filter((facility) => {
            const mappedParentId = facilityMappingMap.get(facility.facilityId);
            return mappedParentId === financingFacilityId;
          });
        }
        else if (isAddNewMode) {
          transformedData = transformedData.filter((facility) => {
            const mappedParentId = facilityMappingMap.get(facility.facilityId);
            return mappedParentId === undefined || mappedParentId === null;
          });
        }
        else {
          transformedData = transformedData.filter((facility) => {
            const mappedParentId = facilityMappingMap.get(facility.facilityId);

            if (mappedParentId !== undefined) {
              if (mappedParentId === financingFacilityId) return true;
              if (mappedParentId !== null && mappedParentId !== financingFacilityId) return false;
              if (mappedParentId === null) return true;
            }
            return true;
          });
        }
      }

      if (transformedData.length === 0) {
        setDisableSave(true);
      } else {
        setDisableSave(false);
      }
      setTableData(transformedData);
    }
  }, [
    facilityListContents,
    mappingData,
    isParentChildLimitMode,
    isAddNewMode,
    financingFacilityId,
    isDetailMode,
    isLpsMode,
    facilityIdFromUrl,
  ]);

  const { mutate: saveChildLimit, isPending: isLoading } = useSaveChildLimit({
    onError: (error) => {
      showNiceModalV2({ title: error?.message, type: 'error' });
    },
    onSuccess: (response: any) => {
      recordActivity({
        activity: ActivityType.SAVE,
        bucketProcessId: processId,
        changeAfter: JSON.stringify(payloadChild),
        changeBefore: '',
        module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
        process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
        remarks: 'Save Child Limit',
      });
      queryClient.invalidateQueries({ queryKey: ['bucket-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['agreement-mapping-financing-facility']});
      queryClient.invalidateQueries({ queryKey: ['financing-facility-mapping']});
      showNiceModalV2({
        onClose: () => {
          if (!searchParams.get('parentSyariahLimitId')) {
            const queryParams = new URLSearchParams({
              parentSyariahLimitId: response.content.parentSyariahLimitId,
              ...(lpsMode && { lpsMode: 'true' }),
              ...(isFromLimitInduk && { fromLimitInduk: 'true' }),
            });
            router.push(`${path}?${queryParams.toString()}`);
          }
          setActiveTab(tab.PARENT_LIMIT);
        },
        title: 'Mapping Fasilitas Kredit ke Parent Limit Berhasil',
        type: 'success',
      });
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
      key: 'orderValue',
      label: 'Nominal',
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
      key: 'action',
      label: 'Action',
      options: [{ iconName: 'detail', onClick: (data) => openModalDetail(data) }],
      type: 'action',
    },
  ];

  if (!isLegalSigning && !viewOnly && !isDetailMode) {
    tableHeader.unshift({
      isDisabled: () => !isDivisiBisnis && !isMaker,
      isSelected: (data) => selected?.includes(data?.facilityId),
      key: 'checkbox',
      onSelectChange: (data) => {
        if (selected?.includes(data?.facilityId)) {
          setSelected(selected.filter((el) => el !== data.facilityId));
        } else {
          setSelected((prevState) => [...prevState, data?.facilityId]);
        }
      },
      type: 'checkbox',
    });
  }

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      // if (isLpsMode) {
      //   setSelected([]);
      //   return;
      // }

      if (detailData?.contents.length > 0) {
        const childrenOfThisParent = detailData?.contents?.[0]?.childLimit?.map((item: any) => item.facilityId);
        const selectedFacilities = tableData
          .filter((facility) => childrenOfThisParent.includes(facility.facilityId))
          .map((facility) => facility.facilityId);
        setSelected(selectedFacilities);
      } else if (searchParams.get('facilityId')) {
        setSelected(searchParams.get('facilityId')?.split(',') || []);
      }
    }
  }, [tableData, isLpsMode, detailData]);

  function handleSave() {
    if (isAddNewMode) {
      showNiceModalV2({
        title: 'Buat parent terlebih dahulu sebelum mapping child',
        type: 'error',
      });
      return;
    }

    const previouslyMappedToThisParent =
      mappingData?.contents
        ?.filter((item) => item.financingFacilityId === financingFacilityId)
        .map((item) => item.facilityId) || [];

    const selectedSet = new Set(selected);
    const previousSet = new Set(previouslyMappedToThisParent);

    const hasAdditions = selected.some((id) => !previousSet.has(id));
    const hasRemovals = previouslyMappedToThisParent.some((id) => !selectedSet.has(id));

    if (!hasAdditions && !hasRemovals) {
      showNiceModalV2({
        title: 'Tidak ada perubahan untuk disimpan',
        type: 'error',
      });
      return;
    }

    const allSelectedFacilities = selected.map((facilityId) => {
      const mappingInfo = mappingData?.contents?.find((item) => item.facilityId === facilityId);
      return {
        bucketProcessId: mappingInfo?.bucketProcessId || processId,
        facilityId: facilityId,
        // financingFacilityId: financingFacilityId,
      };
    });

    const displayedFacilityIds = new Set(tableData.map((item) => item.facilityId));

    const toBeRemovedFacilities = previouslyMappedToThisParent
      .filter((facilityId) => !selectedSet.has(facilityId) && displayedFacilityIds.has(facilityId))
      .map((facilityId) => {
        const mappingInfo = mappingData?.contents?.find((item) => item.facilityId === facilityId);
        return {
          bucketProcessId: mappingInfo?.bucketProcessId || processId,
          facilityId: facilityId,
          // financingFacilityId: null,
        };
      });

    const allFacilities = [...allSelectedFacilities, ...toBeRemovedFacilities];

    if (allFacilities.length === 0) {
      showNiceModalV2({
        title: 'Tidak ada perubahan untuk disimpan',
        type: 'error',
      });
      return;
    }

    const listFacilityId = allFacilities.map((facility) => facility.facilityId);


    const payloads = {
      bucketProcessId: processId,
      facilityId: listFacilityId,
      idLimitInduk: detailData?.contents?.[0]?.parentSyariahLimitIdExisting || null,
      module: lpsMode ? TypeModule.LPS : TypeModule.ENGAGEMENT_AGREEMENT,
      parentSyariahLimitId: searchParams.get('parentSyariahLimitId') || null,
      process: lpsMode ? TypeProcess.LPS_CORE : TypeProcess.ENGAGEMENT_AGREEMENT,
    };

    saveChildLimit(payloads);
    setPayloadChild(payloads);
  }

  function formatNumberWithCommas(value: number): string {
    return value.toLocaleString('en-US', {
      maximumFractionDigits: 2,
      minimumFractionDigits: 2,
    });
  }

  function parseOrderValue(orderValue: string): number {
    if (!orderValue || orderValue.trim() === '') {
      return 0;
    }
    const cleanValue = orderValue.replace(/,/g, '');
    const parsedValue = parseFloat(cleanValue);
    return isNaN(parsedValue) ? 0 : parsedValue;
  }

  function calculateTotalOrderValue(facilityList: ListFinancingFacilityResponseDto[]): string {
    let totalOrderValue = 0;

    facilityList.forEach((facility) => {
      if (facility.financingSegment === 'SYARIAH') {
        totalOrderValue += facility.totalOrderValue || 0;
      } else {
        if (facility.orderValueAfterExchangeRate) {
          const parsedValue = parseOrderValue(facility.orderValueAfterExchangeRate);
          totalOrderValue += parsedValue;
        }
      }
    });

    return formatNumberWithCommas(totalOrderValue);
  }

  const [totalOrder, setTotalOrder] = useState('');

  useEffect(() => {
    if (tableData && tableData.length > 0) {
      const facilityList = facilityListContents || [];
      const displayedFacilityIds = new Set(tableData.map((item) => item.facilityId));
      const filteredFacilityList = facilityList.filter((item) => displayedFacilityIds.has(item.facilityId));

      const totalOrderValue = calculateTotalOrderValue(filteredFacilityList);
      setTotalOrder('IDR' + ' ' + totalOrderValue);
    } else {
      setTotalOrder('IDR 0.00');
    }
  }, [tableData, facilityListContents]);

  return {
    disableSave,
    facilityListContents: tableData,
    handleSave,
    isDetailMode,
    isLegalSigning,
    isLoading,
    isLpsMode,
    selected,
    tableHeader,
    theme,
    totalOrder,
    viewOnly,
  };
};

export default useChildLimit;
