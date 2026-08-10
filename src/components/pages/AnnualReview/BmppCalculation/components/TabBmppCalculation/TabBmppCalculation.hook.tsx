import { useEffect, useMemo, useState } from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { useForm } from 'react-hook-form';

import { formatDateToUtc } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useSessionStorage from '@/hooks/useSessionStorage';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useBmppCalculationMaster from './hooks/useBmppCalculationMaster';
import useBmppMonitoringComponentResult from './hooks/useBmppMonitoringComponentResult';
import useGetBmppDetailMaster from './hooks/useGetBmppDetailMaster';
import useGetGroupList from './hooks/useGetGroupList';
import useGetMaintenanceGroupDetail from './hooks/useGetMaintenanceGroupDetail';

import type {
  BmppDetailRequestDtoBmppTypeEnum,
  BmppGroupsComponentResponseDto,
  BmppGroupsRequestDtoBmppTypeEnum,
  TabBmppCalculationProps,
} from './TabBmppCalculation.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';


const useTabBmppCalculation = (props: TabBmppCalculationProps) => {
  const {
    module,
    process,
    calculationId,
    bmppType,
    onDataChange,
    dataMasterDebtor,
    processId,
    debtorId,
  } = props;

  const {
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
  } = useForm({
    defaultValues: {
      debtorName: null,
      debtorRating: '',
      debtorType: '',
      group: null,
      isRelation: null,
      remarks: '',
    },
    mode: 'onChange',
  });

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isHidePlaceholderGroup, setIsHidePlaceholderGroup] = useState(false);

  const [currentPopoverId, setCurrentPopoverId] = useState(null);
  const [storedGroup, setStoredGroup] = useSessionStorage('bmppGroupData', null);

  const { data: groupData } = useGetGroupList({
    filter: {
      bucketProcessId: calculationId,
    },
    page: {
      itemPerPage: 25,
      noPage: 1,
    },
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

  const groupOptionsList = groupData?.contents?.map((group) => ({
    label: group?.groupName,
    value: group?.groupCode,
  }));

  const { data: detailGroup } = useGetMaintenanceGroupDetail({ id: calculationId });

  useEffect(() => {
    const updatedData = { detailGroup: detailGroup, groupOptionsList: groupData?.contents };
    onDataChange(updatedData);
  }, [groupData, detailGroup]);

  const tableData = bmppGroupMasterContents;

  const tableHeader: TableHeader[] = [
    {
      key: 'detail',
      label: 'Rincian',
      render: (row: BmppGroupsComponentResponseDto, index) => {
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
      render: (row: BmppGroupsComponentResponseDto) => {
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
                <>{percentageValue[0]}</>
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
    if (groupData && groupData?.contents?.length > 0) {
      const defaultGroup = storedGroup || groupOptionsList[0]?.value;
      setValue('group', defaultGroup);
      setIsHidePlaceholderGroup(true);
    } else {
      setIsHidePlaceholderGroup(false);
    }
  }, [groupData, storedGroup]);

  const { data: bmppCalculationDetailData } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  });

  const { mutate: bmppCalculation, isPending: isLoadingCalculation } = useBmppCalculationMaster({
    onError: (data) => {
      const title = data.response.data.errorDetail;
      showNiceModalV2({
        customProp: { header: 'BMPP gagal dihitung', sx: { textAlign: 'left' }, variant: 'title1' },
        title,
        type: 'error',
      });
    },
    onSuccess: () => {
      if (!props.isPemda) {
        setValue('group', '');
      }
      showNiceModalV2({
        title: 'Calculate berhasil dilakukan',
        type: 'success',
      });
    },
  });

  const processBmppCalculate = (data) => {
    const payload = {
      bmppType: bmppType as BmppDetailRequestDtoBmppTypeEnum,
      bucketProcessId: processId,
      currency: bmppCalculationDetailData?.currency,
      debtorId,
      debtorRating: data.debtorRating,
      debtorType: props.isPemda ? 'BUMD' : dataMasterDebtor?.debtorType,
      exchangeRate: bmppCalculationDetailData?.exchangeRate,
      groupId: watch('group') && watch('group') !== '' ? watch('group') : null,
      isGroup: dataMasterDebtor?.isGroup,
      isRelation: dataMasterDebtor?.isRelatedToSmi,
      module,
      process,
      remarks: watch('remarks'),
    };

    bmppCalculation(payload);
  };

  const handleCalculate = (data) => {
    showNiceModalV2({
      cancelText: 'Tidak',
      customProp: { color: theme.palette.primary.main, icon: 'confirmation', size: theme.spacing(12), text: 'Confirmation' },
      onSubmit: () => processBmppCalculate(data),
      submitText: 'Ya',
      title: 'Apakah anda yakin data customer sudah benar?',
      type: 'warning',
    });
  };

  const sectionGroupData = useMemo(() => {
    const selectedGroup = watch('group');
    if (selectedGroup !== undefined && selectedGroup !== null) {
      setStoredGroup(selectedGroup);
      return groupData?.contents?.find((item) => item?.groupCode === selectedGroup);
    }
  }, [watch('group'), groupData]);

  const dataAsOfDate = useMemo(() => {
    return detailGroup?.content?.lastModified ?
      `${formatDateToUtc(new Date(detailGroup?.content?.lastModified), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [detailGroup?.content]);

  const debtorNameList = [];

  return {
    anchorEl,
    control,
    dataAsOfDate,
    debtorNameList,
    groupOptionsList,
    handleCalculate,
    handleSubmit,
    isBmppGroupsMasterLoading,
    isHidePlaceholderGroup,
    reset,
    sectionGroupData,
    setAnchorEl,
    setValue,
    tableData,
    tableHeader,
    theme,
    watch,
  };
};
export default useTabBmppCalculation;
