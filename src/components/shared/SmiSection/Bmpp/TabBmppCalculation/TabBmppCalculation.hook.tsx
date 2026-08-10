import { useEffect, useMemo, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';
import dayjs from 'dayjs';

import { ONE_MINUTE } from '@/configs/constants';
import { maintenanceDebtor, maintenanceGroup } from '@/configs/constants/pathname';
import Modules from '@/enums/Modules';
import { formatDateToUtc } from '@/helpers/date';
import showNiceModalV2 from '@/helpers/showNiceModalV2';
import useGetBmppGroup from '@/hooks/services/master/group/useGetBmppGroup';
import useGetBmppGroupList from '@/hooks/services/mip/bmpp/useGetBmppGroupList';
import useSubmitBmppCalculate from '@/hooks/services/mip/bmpp/useSubmitBmppCalculateV2';
import useGetParameterList from '@/hooks/services/useGetParameterList';
import useCustomRouter from '@/hooks/useCustomRouter';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import useBmppCalculationMaster from './hooks/useBmppCalculationMaster';
import useGetBmppDetail from './hooks/useGetBmppDetail';
import useGetBmppDetailMaster from './hooks/useGetBmppDetailMaster';
import useGetBmppGroupListMaster from './hooks/useGetBmppGroupListMaster';

import type { UseTabCalculationProps } from './TabBmppCalculation.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BmppDetailResponseDto } from '@/services/openapi/master-service';
import type {
  BmppDetailRequestDtoBmppTypeEnum,
  BmppGroupsComponentResponseDto,
  BmppGroupsRequestDtoBmppTypeEnum,
} from '@/services/openapi/mip-service';


const getBmppErrorDetail = (error: any) => {
  const responseData = error?.response?.data ?? {};

  return responseData?.errorDetail ?? 'Terjadi kesalahan saat menghitung BPMPP. Silakan coba lagi.';
};

const useTabBmppCalculation = (props: UseTabCalculationProps) => {
  const {
    module,
    process,
    watch,
    setValue,
    processId,
    bmppType,
    debtorId,
    reset,
    dataMasterDebtor,
    isMipBmpp,
    onDataChange,
  } = props;

  const theme = useTheme();
  const router = useCustomRouter();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isHidePlaceholderGroup, setIsHidePlaceholderGroup] = useState(false);
  const [isHidePlaceholderRating, setIsHidePlaceholderRating] = useState(false);

  const [currentPopoverId, setCurrentPopoverId] = useState(null);

  const { data, refetch: refetchBmppDetail } = useGetBmppDetail({
    bucketProcessId: processId,
    module,
    process,
  }, isMipBmpp);

  const { data: bmppCalculationDetailData, refetch: refetchBmppDetailMaster } = useGetBmppDetailMaster({
    bucketProcessId: processId,
    module,
    process,
  }, !isMipBmpp);

  const bmppDetailData: BmppDetailResponseDto = isMipBmpp ? data : bmppCalculationDetailData;
  const { data: ratingData } = useGetParameterList(Modules.RATING, {
    label: 'value1',
    value: 'key',
  }, {
    staleTime: ONE_MINUTE,
  });

  const { mutate: bmppCalculate, isPending: isLoadingCalculate } = useSubmitBmppCalculate({
    onError: (data) => {
      const title = getBmppErrorDetail(data);
      showNiceModalV2({
        customProp: { header: 'BMPP gagal dihitung', sx: { textAlign: 'left' }, variant: 'title1' },
        title,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Calculate berhasil dilakukan',
        type: 'success',
      });
      setTimeout(() => {
        refetchBmppGroups();
        refetchBmppDetail();
      }, 500);
    },
  });

  const { mutate: bmppCalculation, isPending: isLoadingCalculation } = useBmppCalculationMaster({
    onError: (data) => {
      const title = getBmppErrorDetail(data);
      showNiceModalV2({
        customProp: { header: 'BMPP gagal dihitung', sx: { textAlign: 'left' }, variant: 'title1' },
        title,
        type: 'error',
      });
    },
    onSuccess: () => {
      showNiceModalV2({
        title: 'Calculate berhasil dilakukan',
        type: 'success',
      });
      setTimeout(() => {
        refetchBmppGroupsMaster();
        refetchBmppDetailMaster();
      }, 500);
    },
  });

  const { data: bmppGroupContents, isLoading: isBmppGroupsLoading, refetch: refetchBmppGroups } = useGetBmppGroupList({
    bmppType: bmppType as BmppGroupsRequestDtoBmppTypeEnum,
    bucketProcessId: processId,
    groupId: watch('group') && watch('group') !== '' ? watch('group') : null,
    module,
    process,
  });

  const {
    data: bmppGroupMasterContents,
    isLoading: isBmppGroupsMasterLoading,
    refetch: refetchBmppGroupsMaster,
  } = useGetBmppGroupListMaster({
    bmppType: bmppType as BmppGroupsRequestDtoBmppTypeEnum,
    bucketProcessId: processId,
    groupId: watch('group') && watch('group') !== '' ? watch('group') : null,
    module,
    process,
  }, {
    enabled: !isMipBmpp && watch('debtorRating') !== '' && watch('debtorRating') !== undefined,
  });

  const { data: groupData } = useGetBmppGroup({
    filter: {
      debtorId,
    },
    page: {
      itemPerPage: 25,
      noPage: 1,
    },
  });

  const groupOptionsList = groupData?.contents?.map((group) => ({
    label: group?.name,
    value: group?.id,
  }));

  useEffect(() => {
    const updatedData = { groupOptionsList: groupData?.contents };
    onDataChange(updatedData);
  }, [groupData]);

  const tableData = isMipBmpp ? bmppGroupContents : bmppGroupMasterContents;

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

  const processBmppCalculate = (data) => {
    const payload = {
      bmppType: bmppType as BmppDetailRequestDtoBmppTypeEnum,
      bucketProcessId: processId,
      currency: bmppDetailData?.currency,
      debtorId,
      debtorRating: data.debtorRating,
      debtorType: props.isPemda ? 'BUMD' : dataMasterDebtor?.debtorType,
      exchangeRate: bmppDetailData?.exchangeRate,
      groupId: watch('group') && watch('group') !== '' ? watch('group') : null,
      isGroup: dataMasterDebtor?.isGroup,
      isRelation: dataMasterDebtor?.isRelatedToSmi ?? dataMasterDebtor?.isRelatedSmi,
      module,
      process,
      remarks: watch('remarks'),
      source: module,
    };

    if (isMipBmpp) {
      bmppCalculate(payload);
    } else {
      bmppCalculation(payload);
    }
  };

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

  const handleRouteMaintenanceDebitor = () => {
    router.push(maintenanceDebtor.LIST_PAGE);
  };

  const handleRouteMaintenanceGroup = () => {
    router.push(maintenanceGroup.LIST_PAGE);
  };

  useEffect(() => {
    reset(bmppDetailData);

    if (bmppDetailData?.groupId) {
      setValue('group', bmppDetailData?.groupId);
    }

    if (bmppDetailData?.groupId || bmppDetailData?.debtorRating) {
      setIsHidePlaceholderGroup(true);
      setIsHidePlaceholderRating(true);
    } else if ((!bmppDetailData?.groupId || bmppDetailData?.groupId === null) && groupOptionsList?.length > 0) {
      setValue('group', groupOptionsList[0]?.value);
      setIsHidePlaceholderGroup(true);
    } else {
      setIsHidePlaceholderRating(false);
    }

  }, [bmppDetailData, groupOptionsList?.length]);

  const dataAsOfDate = useMemo(() => {
    return bmppDetailData?.modificationDate
      ? dayjs(bmppDetailData?.modificationDate).format('DD MMM YYYY, [Pukul] HH:mm:ss')
      : '-';
  }, [bmppDetailData?.modificationDate]);

  const sectionGroupData = useMemo(() => {
    return groupData?.contents?.find((item) => item?.id === watch('group'));
  }, [watch('group'), groupData?.contents]);

  return {
    bmppDetailData,
    dataAsOfDate,
    groupOptionsList,
    handleCalculate,
    handleRouteMaintenanceDebitor,
    handleRouteMaintenanceGroup,
    isBmppGroupsLoading,
    isBmppGroupsMasterLoading,
    isHidePlaceholderGroup,
    isHidePlaceholderRating,
    isLoadingCalculate,
    isLoadingCalculation,
    ratingData,
    sectionGroupData,
    tableData,
    tableHeader,
  };
};

export default useTabBmppCalculation;
