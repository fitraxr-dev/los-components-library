import { useEffect, useMemo, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import Tooltip from '@mui/material/Tooltip';

import { formatDateToUtc } from '@/helpers/date';
import useSessionStorage from '@/hooks/useSessionStorage';

import useBmppMonitoringComponentGroupResult
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/group/hooks/useBmppMonitoringComponentGroupResult';
import useGetBmppMonitoringCustomer
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/group/hooks/useGetBmppMonitoringCustomer';
import useGetMaintenanceGroupDetail
  from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/components/group/hooks/useGetMaintenanceGroupDetail';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import PopupInfoInput from '@/components/shared/Input/components/PopupInfoInput';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';

import type {
  UseTabCalculationProps,
} from '@/components/pages/BmppMonitoring/components/BmppCalculation/TabBmppCalculation/TabBmppCalculation.types';
import type { TableHeader } from '@/components/shared/Table/Table.types';
import type { BmppGroupsComponentResponseDto } from '@/services/openapi/master-service';
import type { BmppGroupsRequestDtoBmppTypeEnum } from '@/services/openapi/mip-service';


const useBmppCalculationGroup = (props: UseTabCalculationProps) => {
  const {
    watch,
    setValue,
    calculationId,
    onDataChange,
    bmppType,
  } = props;

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const [isHidePlaceholderGroup, setIsHidePlaceholderGroup] = useState(false);

  const [currentPopoverId, setCurrentPopoverId] = useState(null);
  const [storedCustomer, setStoredCustomer] = useSessionStorage('bmppCustomerData', null);

  const { data: customerData } = useGetBmppMonitoringCustomer({ bucketProcessId: calculationId });
  const { data: detailGroup } = useGetMaintenanceGroupDetail({ id: calculationId });

  const customerList = customerData?.contents?.map((cs) => ({
    label: cs.debtorName,
    value: cs.debtorId,
  }));

  useEffect(() => {
    const updatedData = { customerList: customerData?.contents, detailGroup: detailGroup?.content };
    onDataChange(updatedData);
  }, [customerData, detailGroup]);

  useEffect(() => {
    if (customerData?.contents?.length > 0) {
      const defaultCustomer = storedCustomer || customerList[0]?.value;
      setValue('customer', defaultCustomer);
      setIsHidePlaceholderGroup(true);
    } else {
      setIsHidePlaceholderGroup(false);
    }
  }, [customerData, storedCustomer]);

  const sectionCustomerData = useMemo(() => {
    const selectedCustomer = watch('customer');
    if (selectedCustomer !== undefined && selectedCustomer !== null) {
      setStoredCustomer(selectedCustomer);
      return customerData?.contents?.find((item) => item?.debtorId === selectedCustomer);
    }
  }, [watch('customer'), customerData]);

  const isCustomerEmpty = customerList?.length === 0;

  const dataAsOfDate = useMemo(() => {
    return detailGroup?.content?.lastModified ?
      `${formatDateToUtc(new Date(detailGroup?.content?.lastModified), 'DD MMM YYYY, [Pukul] HH:mm:ss')}` : '-';
  }, [detailGroup?.content]);

  const { data: bmppGroupMasterContents, isLoading: isBmppGroupsMasterLoading } =
    useBmppMonitoringComponentGroupResult({
      bmppType: bmppType as BmppGroupsRequestDtoBmppTypeEnum,
      bucketProcessId: calculationId ?? '-',
      debtorId: watch('customer') && watch('customer') !== '' ? watch('customer') : null,
      module: 'BMPP',
      process: 'BMPP',
    }, {
      enabled: watch('customer') !== '' && watch('customer') !== undefined,
    });

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

  return {
    anchorEl,
    currentPopoverId,
    customerList, dataAsOfDate,
    detailGroup, isBmppGroupsMasterLoading,
    isCustomerEmpty,
    isHidePlaceholderGroup,
    sectionCustomerData,
    setAnchorEl,
    setCurrentPopoverId, setIsHidePlaceholderGroup,
    tableData, tableHeader, theme,
  };
};

export default useBmppCalculationGroup;
