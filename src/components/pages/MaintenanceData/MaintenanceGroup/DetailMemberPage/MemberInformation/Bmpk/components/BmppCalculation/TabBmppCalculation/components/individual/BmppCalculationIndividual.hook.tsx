import { useEffect, useMemo, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { formatDateToUtc } from '@/helpers/date';
import useSessionStorage from '@/hooks/useSessionStorage';
import { BmppDetailRequestDtoBmppTypeEnum } from '@/services/openapi/master-service';

import useBmppMonitoringComponentResult
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/hooks/useBmppMonitoringComponentResult';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useGetBmppMonitoringIndividual from '../../hooks/useGetBmppMonitoringIndividual';
import useGetMaintenanceGroupDetail from '../group/hooks/useGetMaintenanceGroupDetail';

import useBmppSimulationCalculate from './hooks/useBmppSimulationCalculate';
import useGetGroupByDebtorId from './hooks/useGetGroupByDebtorId';
// import useGetGroupList from './hooks/useGetGroupList';

import type {
  UseTabCalculationProps,
} from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/TabBmppCalculation.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BmppGroupsRequestDtoBmppTypeEnum } from '@/services/openapi/master-service';


const useBmppCalculationIndividual = (props: UseTabCalculationProps) => {
  const {
    module,
    process,
    watch,
    setValue,
    calculationId,
    bmppType,
    onDataChange,
    dataMasterDebtor,
    isPemda,
  } = props;

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isHidePlaceholderGroup, setIsHidePlaceholderGroup] = useState(false);

  const [currentPopoverId, setCurrentPopoverId] = useState(null);
  const [storedGroup, setStoredGroup] = useSessionStorage('bmppGroupData', null);
  const [hasTriggeredCalculation, setHasTriggeredCalculation] = useState(false);

  // Get debtor ID from dataMasterDebtor
  const debtorId = dataMasterDebtor?.debtorId;

  // Use the new API to get group list by debtor ID
  const { data: groupList, isLoading: isLoadingGroupList } = useGetGroupByDebtorId(debtorId);

  const {
    mutate: calculateBmppSimulation,
    data: bmppSimulationData,
    isPending: isCalculating,
  } = useBmppSimulationCalculate();

  // Use getMonitoringIndividual API for individual BMPP calculation
  const { data: bmppIndividualData, isLoading: isBmppIndividualLoading } = useGetBmppMonitoringIndividual({
    filter: {
      debtorType: dataMasterDebtor?.generalInformation?.debtorType ?
        [dataMasterDebtor.generalInformation.debtorType] : undefined,
      gam: dataMasterDebtor?.generalInformation?.gam ?
        [dataMasterDebtor.generalInformation.gam] : undefined,
      isRelatedSmi: dataMasterDebtor?.generalInformation?.isRelatedSmi,
    },
    page: {
      itemPerPage: 25,
      noPage: 1,
    },
    searchDetail: {
      key: '',
      value: '',
    },
    sortList: {
    },
  }, {
    enabled: !!calculationId && !!dataMasterDebtor?.debtorId && !!watch('group'),
  });

  const { data: bmppGroupMasterContents, isLoading: isBmppGroupsMasterLoading } = useBmppMonitoringComponentResult({
    bmppType: bmppType as BmppGroupsRequestDtoBmppTypeEnum,
    bucketProcessId: calculationId ?? '-',
    groupId: watch('group') && watch('group') !== '' ? watch('group') : null,
    module,
    process,
  }, {
    enabled: watch('group') !== '' && watch('group') !== undefined,
  });

  const groupOptionsList = groupList?.data?.contents?.map((group) => ({
    label: group?.name,
    value: group?.id,
  })) || [];

  const { data: detailGroup } = useGetMaintenanceGroupDetail({ id: calculationId });

  useEffect(() => {
    const updatedData = { detailGroup: detailGroup, groupOptionsList: groupList?.data?.contents };
    onDataChange(updatedData);
  }, [groupList, detailGroup]);

  useEffect(() => {
    setHasTriggeredCalculation(false);
  }, [watch('group')]);

  useEffect(() => {
    const selectedGroup = watch('group');
    const hasIndividualData = bmppIndividualData?.data?.contents &&
      Array.isArray(bmppIndividualData.data.contents) &&
      bmppIndividualData.data.contents.length > 0;
    const hasGroupData = bmppGroupMasterContents &&
      Array.isArray(bmppGroupMasterContents) &&
      bmppGroupMasterContents.length > 0;
    const hasSimulationData = (bmppSimulationData as any)?.data?.contents &&
      Array.isArray((bmppSimulationData as any)?.data?.contents) &&
      (bmppSimulationData as any)?.data?.contents.length > 0;

    if (selectedGroup &&
        !hasIndividualData &&
        !hasGroupData &&
        !hasSimulationData &&
        !isCalculating &&
        !hasTriggeredCalculation) {

      const selectedGroupData = groupList?.data?.contents?.find((item) => item?.id === selectedGroup);

      if (selectedGroupData && dataMasterDebtor) {
        const payload = {
          bmppType: BmppDetailRequestDtoBmppTypeEnum.SIMULATIONNONPEMDA,
          bucketProcessId: debtorId || '',
          debtorId: debtorId || '',
          debtorRating: dataMasterDebtor?.generalInformation?.debtorRating || '',
          debtorType: dataMasterDebtor?.generalInformation?.debtorType?.label || '',
          groupId: selectedGroup,
          isRelation: dataMasterDebtor?.generalInformation?.isRelatedSmi || false,
          module: 'BMPP',
          process: 'BMPP',
        };

        setHasTriggeredCalculation(true);
        calculateBmppSimulation(payload);
      }
    }
  }, [watch('group'), bmppIndividualData, bmppGroupMasterContents, bmppSimulationData, isCalculating, hasTriggeredCalculation, groupList, dataMasterDebtor, debtorId, calculateBmppSimulation]);

  const tableData = bmppIndividualData?.data?.contents ||
    bmppGroupMasterContents ||
    (bmppSimulationData as any)?.data?.contents || [];


  const tableHeader: TableHeader[] = [
    {
      key: 'detail',
      label: 'Rincian',
      render: (row: any, index) => {
        const isDarkBlue = row?.colorBackground?.includes('#284A63');
        const weight = row.isParent ? 600 : 400;

        return (
          <RowWrapper sx={{ gap: theme.spacing(1) }}>
            <TextStyle
              weight={weight}
              color={row?.colorText}
            >
              {row.detail}
            </TextStyle>

            { row?.additionalInformation ?
              <PopupInfoInput
                index={index + 1}
                iconName={isDarkBlue ? 'information-trans' : 'information-shape'}
                status={currentPopoverId === (index + 1) && Boolean(anchorEl)}
                anchorEl={anchorEl}
                setAnchorEl={setAnchorEl}
                setCurrentPopoverId={setCurrentPopoverId}
                sx={{ alignItems: 'center', marginRight: 1, top: 0 }}
                content={
                  <Box sx={{ bgcolor: '#284A63', height: '100%', width: '100%' }}>
                    <ul
                      style={{
                        color: '#FFF',
                        margin: '0px',
                        paddingBlock: '6px',
                        paddingInline: '10px',
                      }}
                    >
                      <TextStyle variant="body5" color={theme.palette.white.main}>
                        {row?.additionalInformation}
                      </TextStyle>
                    </ul>
                  </Box>
                }
              /> : null
            }
          </RowWrapper>
        );
      },
      sx: (row) => ({
        backgroundColor: row?.colorBackground ? row?.colorBackground : 'transparent',
        width: '50%',
      }),
    },
    {
      key: 'value',
      label: 'Nilai in IDR',
      render: (row: any) => {
        const isConclusion = row?.key?.includes('CONCLUSION');
        const isPrecentage = row?.key?.includes('PERCENTAGE');
        const weight = isConclusion ? 600 : 400;
        const colorBeyond = row.value?.toLowerCase().includes('tidak') ? '#284A63' : '#EB5757';
        const colorBox = row.value?.toLowerCase().includes('tidak') ? '#BBE1FD57' : theme.palette.white.main;
        const fontColor = !row.value?.toLowerCase().includes('tidak') ? '#EB5757' : '';

        if (isConclusion) {
          const conclusionValue = row.value?.split('|');
          return (
            <ColumnWrapper sx={{ alignItems: 'end' }}>
              <Box
                sx={{
                  backgroundColor: colorBeyond,
                  borderRadius: 5,
                  color: theme.palette.white.main,
                  display: 'grid',
                  fontSize: theme.typography.body4,
                  gap: 2,
                  gridTemplateColumns: {
                    sm: 'auto auto',
                    xs: '1fr',
                  },
                  justifyContent: 'end',
                  padding: 1,
                }}
              >
                <ColumnWrapper sx={{ alignItems: 'center', justifyContent: 'center' }}>
                  <TextStyle variant="body4">
                    {conclusionValue[0]}
                  </TextStyle>
                </ColumnWrapper>

                <ColumnWrapper sx={{ alignItems: 'end' }}>
                  <Box
                    sx={{
                      alignContent: 'center',
                      alignItems: 'center',
                      backgroundColor: colorBox,
                      borderRadius: 5,
                      paddingX: 1,
                      paddingY: 0.3,
                    }}
                  >
                    <TextStyle variant="body4" color={fontColor}>
                      {conclusionValue[1]}
                    </TextStyle>
                  </Box>
                </ColumnWrapper>
              </Box>
            </ColumnWrapper>
          );
        } else if (isPrecentage) {
          const percentageValue = row.value?.split('|');
          return (
            <TextStyle weight={weight} color={row?.colorText}>
              <Tooltip
                title={percentageValue[1]}
                placement="top"
                slotProps={{
                  popper: {
                    sx: {
                      '& .MuiTooltip-tooltip': {
                        backgroundColor: '#284A63',
                        fontSize: '0.9375vw',
                        marginBottom: '3px !important',
                        paddingX: 3,
                        paddingY: 2,
                      },
                    },
                  },
                }}
              >
                {percentageValue[0]}
              </Tooltip>
            </TextStyle>
          );
        } else {
          return (
            <TextStyle
              weight={weight}
              color={row?.colorText}
            >
              {row.value}
            </TextStyle>
          );
        }
      },
      sx: (row) => ({
        backgroundColor: row?.colorBackground ? row?.colorBackground : 'transparent',
        textAlign: 'end',
        width: '50%',
      }),
    }
  ];

  useEffect(() => {
    if (groupList && groupList?.data?.contents?.length > 0) {
      const defaultGroup = storedGroup || groupOptionsList[0]?.value;
      setValue('group', defaultGroup);
      setIsHidePlaceholderGroup(true);
    } else {
      setIsHidePlaceholderGroup(false);
    }
  }, [groupList, storedGroup]);

  const sectionGroupData = useMemo(() => {
    const selectedGroup = watch('group');
    if (selectedGroup !== undefined && selectedGroup !== null) {
      setStoredGroup(selectedGroup);
      return groupList?.data?.contents?.find((item) => item?.id === selectedGroup);
    }
  }, [watch('group'), groupList]);

  const dataAsOfDate = useMemo(() => {
    return detailGroup?.content?.lastModified ?
      `${formatDateToUtc(new Date(detailGroup?.content?.lastModified), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [detailGroup?.content]);

  const debtorNameList = [];

  return {
    dataAsOfDate,
    debtorNameList,
    groupOptionsList,
    isBmppGroupsMasterLoading: (isBmppIndividualLoading || isBmppGroupsMasterLoading || isCalculating) &&
      !tableData?.length,
    isHidePlaceholderGroup,
    sectionGroupData,
    tableData,
    tableHeader,
  };
};

export default useBmppCalculationIndividual;
