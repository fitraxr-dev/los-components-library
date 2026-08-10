'use client';
import { useEffect, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { useParams, usePathname } from 'next/navigation';

import { toDateString } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import useGetDetailMasterDebtor from '@/hooks/services/master/debtor/useGetDetailMasterDebtor';
import useGetAllAnalyst from '@/hooks/services/useGetAllAnalyst';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import AlertDifferentData from '../../SmiComponent/AlertDifferentData';

import type { TypeModule, TypeProcess } from '@/enums/Module';


type DebtorInformationProps = {
  isMaintenanceCustomer?: boolean;
  isOpen?: boolean;
  module: TypeModule;
  process: TypeProcess;
  showSubtitle?: boolean;
  showDifferentDataAlert?: boolean;
  alertRefetchInterval?: number | false;
  isUseGetMasterDetail?: boolean;
  isReviewer?: boolean;
}

const TableDebtorInformation = ({
  module,
  process,
  showSubtitle = true,
  showDifferentDataAlert = true,
  alertRefetchInterval,
  isOpen = true,
  isMaintenanceCustomer = false,
  isUseGetMasterDetail = false,
  isReviewer = false,
}: DebtorInformationProps) => {
  const theme = useTheme();
  const [_, dispatch] = useApp();
  const { setDebtorId, analystId, processId, setAnalystId, setDebtorName } = useIdentity();
  const path = usePathname();
  const query = useParams();
  const { debtorId } = query;

  const isSimulation = path.includes('/bmpp-simulation');

  const { data: debtorInfoDataMaster } = useGetDetailMasterDebtor({
    debtorId: debtorId,
  }, { enabled: isUseGetMasterDetail && !!debtorId });

  const { data: debtorInfoDataBucket } = useGetBucketById({
    bucketProcessId: processId, module, process,
  }, { enabled: !isUseGetMasterDetail });

  const debtorInfoData = isUseGetMasterDetail ? debtorInfoDataMaster : debtorInfoDataBucket;
  const [analystKeyword, setAnalystKeyword] = useState('');
  const [analystDropdownList, setAnalystDropdownList] = useState([]);

  const isNewCustomer = debtorInfoDataBucket?.isNewClient ?
    debtorInfoDataBucket?.isNewClient :
    debtorInfoDataMaster?.isNewDebtor;
  const customerName = isUseGetMasterDetail
    ? `${debtorInfoData?.institutionTypeLabel || ''} ${debtorInfoData?.name || debtorInfoData?.debtorName}` || '-'
    : `${debtorInfoData?.institutionTypeLabel || ''} ${debtorInfoData?.debtorName || ''}` || '-';

  // Analyst data
  const {
    data: analystData,
    isSuccess: isGetAnalystDataSuccess,
    isFetching: isLoadingAnalystData,
  } = useGetAllAnalyst(
    { value: analystKeyword }
  );


  useEffect(() => {
    if (analystData && isGetAnalystDataSuccess) {
      setAnalystDropdownList(
        analystData?.contents?.map((item) => ({
          id: item.userId,
          label: item.fullName,
        }))
      );
    }
  }, [analystData, isGetAnalystDataSuccess]);

  useEffect(() => {
    setDebtorId(debtorInfoData?.debtorId);
    setAnalystKeyword(debtorInfoData?.analystName);
    setAnalystId(debtorInfoData?.analystId?.toString());
    setDebtorName(debtorInfoData?.debtorName);
    dispatch({
      data: debtorInfoData?.bucketParentId,
      type: reducer?.SET_PARENT_ID,
    });
  }, [debtorInfoData]);

  const renderDefault = (
    <Cell title="Nama Analis" value={isSimulation ? '-' : debtorInfoData?.analystName ?? '-'} />
  );

  const renderdebtorInformation = (
    <Cell
      title="Nama Analis"
      type="autocomplete"
      isMandatory={true}
      autoCompleteOptions={{
        input: {
          disabled: false,
          dropdownList: analystDropdownList,
          isLoading: isLoadingAnalystData,
          label: null,
          onChange: (data) => { setAnalystId(data.id.toString()); setAnalystKeyword(data.label); },
          placeholder: 'Pilih nama analis',
          value: { id: analystId, label: analystKeyword },
        },
      }}
    />
  );

  const isRenderDebtorInformationByProcess = [];

  const renderAnalystCell =
    isRenderDebtorInformationByProcess.includes(process) && (getLastPath(path) === 'debtor-information' || getLastPath(path) === 'customer-information')
      ? renderdebtorInformation
      : renderDefault;

  return (
    <>
      {showDifferentDataAlert && processId ? (
        <AlertDifferentData
          bucketProcessId={processId}
          module={module}
          process={process}
          refetchInterval={alertRefetchInterval}
          isReviewer={isReviewer}
        />
      ) : null}
      <SectionTitle
        title="Informasi Customer"
        subtitle={
          showSubtitle
            ? `${debtorInfoData?.institutionTypeLabel} ${isUseGetMasterDetail ? debtorInfoData?.name : debtorInfoData?.debtorName} | CIF: ${debtorInfoData?.cif ?? '-'} | GAM: ${debtorInfoData?.gamName}`
            : null
        }
        isOpen={isOpen}
      >
        <BaseContainer
          sx={{
            boxShadow: 2,
            maxWidth: '100%',
            mt: theme.spacing(3),
            padding: theme.spacing(2),
          }}
        >

          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(2),
              gridTemplateColumns: {
                sm: 'repeat(2, 1fr)',
                xs: '1fr',
              },
            }}
          >
            <Cell
              title="Nama Customer"
              value={customerName}
              wrapText={true}
            />
            <Cell
              title="Nama Staff"
              value={debtorInfoData?.staffName ?? '-'}
              wrapText={true}
            />
            <Cell
              title="New / Eksisting Client"
              value={isNewCustomer ? 'New Client' : 'Eksisting Client'}
            />
            {!isMaintenanceCustomer && renderAnalystCell}
            <Cell
              title="CIF"
              value={debtorInfoData?.cif ?? '-'}
            />
            <Cell
              title="Divisi"
              value={isUseGetMasterDetail ? debtorInfoData?.divisionName : debtorInfoData?.staffDivisionLabel}
            />
            {!isMaintenanceCustomer && (
              <Cell
                title="Master ID"
                value={isSimulation ? '-' : debtorInfoData?.bucketMaster ?? '-'}
              />
            )}
            <Cell
              title="ID Process "
              value={isSimulation ? '-' : debtorInfoData?.bucketProcessId ?? '-'}
            />
            <Cell
              title="General Account Manager"
              value={debtorInfoData?.gamName ?? '-'}

            />
            <Cell
              title="Created Date"
              value={
                isUseGetMasterDetail ? (debtorInfoData?.createdDate ? toDateString(debtorInfoData?.createdDate) : '-') :
                  (debtorInfoData?.createdAt ? toDateString(debtorInfoData?.createdAt) : '-')
              }
            />
          </Box>
        </BaseContainer>
      </SectionTitle>
    </>
  );
};

export default TableDebtorInformation;
