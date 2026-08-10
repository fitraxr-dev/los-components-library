'use client';
import { useEffect, useState } from 'react';

import { Box, useTheme } from '@mui/material';
import { usePathname } from 'next/navigation';

import { toDateString } from '@/helpers/date';
import { getLastPath } from '@/helpers/navigation';
import useGetAllAnalyst from '@/hooks/services/useGetAllAnalyst';
import useGetBucketById from '@/hooks/services/useGetBucketById';
import useApp from '@/hooks/useApp';
import useIdentity from '@/hooks/useIdentity';

import { reducer } from '@/components/layouts/AppLayout/App.constants';
import useGetDetailCustomer from '@/components/pages/VirtualAccount/hooks/useGetDetailCustomer';
import BaseContainer from '@/components/shared/BaseContainer';
import Cell from '@/components/shared/Cell';
import SectionTitle from '@/components/shared/SectionTitle';

import type { TypeProcess, TypeModule } from '@/enums/Module';


type DebtorInformationProps = {
  module: TypeModule;
  process: TypeProcess;
}

const TableDebtorInformationVa = ({
  module,
  process,
}: DebtorInformationProps) => {
  const theme = useTheme();
  const [_, dispatch] = useApp();
  const { setDebtorId, analystId, processId, setAnalystId, setDebtorName } = useIdentity();
  const path = usePathname();
  const [debtorIdFromProcess, bucketProcessId] = processId?.split('~') ?? [];

  const { data: debtorInfoData } = useGetDetailCustomer({ id: debtorIdFromProcess });

  const [analystKeyword, setAnalystKeyword] = useState('');
  const [analystDropdownList, setAnalystDropdownList] = useState([]);


  // Analyst data
  const {
    data: analystData,
    isSuccess: isGetAnalystDataSuccess,
    isFetching: isLoadingAnalystData,
  } = useGetAllAnalyst(
    { value: analystKeyword }
  );


  // useEffect(() => {
  //   if (analystData && isGetAnalystDataSuccess) {
  //     setAnalystDropdownList(
  //       analystData?.contents?.map((item) => ({
  //         id: item.userId,
  //         label: item.fullName,
  //       }))
  //     );
  //   }
  // }, [analystData, isGetAnalystDataSuccess]);

  // useEffect(() => {
  //   setDebtorId(debtorInfoData.debtorId);
  //   setAnalystKeyword(debtorInfoData.analystName);
  //   setAnalystId(debtorInfoData.analystId?.toString());
  //   setDebtorName(debtorInfoData.debtorName);
  //   dispatch({
  //     data: debtorInfoData.bucketParentId,
  //     type: reducer.SET_PARENT_ID,
  //   });
  // }, [debtorInfoData]);

  // const renderDefault = (
  //   <Cell title="Nama Analis" value={debtorInfoData.analystName} />
  // );

  // const renderdebtorInformation = (
  //   <Cell
  //     title="Nama Analis"
  //     type="autocomplete"
  //     isMandatory={true}
  //     autoCompleteOptions={{
  //       input: {
  //         disabled: false,
  //         dropdownList: analystDropdownList,
  //         isLoading: isLoadingAnalystData,
  //         label: null,
  //         onChange: (data) => {setAnalystId(data.id.toString());setAnalystKeyword(data.label);},
  //         placeholder: 'Pilih nama analis',
  //         value: { id: analystId, label: analystKeyword },
  //       },
  //     }}
  //   />
  // );

  // const isRenderDebtorInformationByProcess = [];

  // const renderAnalystCell =
  // isRenderDebtorInformationByProcess.includes(process) &&
  // (getLastPath(path) === 'debtor-information' || getLastPath(path) === 'customer-information')
  //   ? renderdebtorInformation
  //   : renderDefault;

  return (
    <SectionTitle isOpen={true} title="Informasi Customer" >
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
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Cell title="Nama Customer" value={debtorInfoData?.customerInformation?.customerName ?? '-'} />
          <Cell title="Nama RM" value={debtorInfoData?.customerInformation?.rm ?? '-'} />
          <Cell
            title="New / Eksisting Client"
            value={
              debtorInfoData?.customerInformation?.isNew === undefined
                ? '-'
                : !debtorInfoData?.customerInformation?.isNew
                  ? 'Eksisting Client'
                  : 'New Client'
            }
          />
          <Cell title="Nama Analis" value={debtorInfoData?.customerInformation?.analyst ?? '-'} />
          <Cell title="CIF" value={debtorInfoData?.customerInformation?.cif ?? '-'} />
          <Cell title="Divisi" value={debtorInfoData?.customerInformation?.division ?? '-'} />
          <Cell title="ID" value={debtorInfoData?.customerInformation?.id ?? '-'} />
          <Cell title="General Account Manager" value={debtorInfoData?.customerInformation?.gam ?? '-'} />
          <Cell title="Created Date" value={debtorInfoData?.customerInformation?.createdDate ? toDateString(debtorInfoData?.customerInformation?.createdDate) : '-'} />

        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default TableDebtorInformationVa;
