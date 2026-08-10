import { useContext, useEffect } from 'react';

import { Box, useTheme } from '@mui/material';
import PropTypes from 'prop-types';

import { TypeProcess } from '@/enums/Module';
import { toDateString } from '@/helpers/date';
import { DebtorNamesetResponseDtoRegionalGovernEnum } from '@/services/openapi/master-service';

import { PipelineContext } from '@/components/layouts/PipelineLayout/Pipeline.context';
import Cell from '@/components/shared/Cell';

import type { PipelineDataOnlyProps } from './PipelineDataViewOnly.type';


const PipelineDataViewOnly = ({ data }: PipelineDataOnlyProps) => {
  const theme = useTheme();
  const { state, setState } = useContext(PipelineContext);
  const isPemda = (Object).values<string>(DebtorNamesetResponseDtoRegionalGovernEnum).includes(
    data?.institutionType
  );

  useEffect(() => {
    setState({
      ...state,
    });
  }, []);

  return (
    <Box
      sx={{
        display: 'grid',
        gridGap: theme.spacing(1),
        gridTemplateColumns: 'repeat(2, 1fr)',
      }}
    >
      {isPemda &&
        <>
          <Cell title="Refina ID" value={data?.refinaId || '-'} />
          <Box />
        </>
      }
      <Cell title="Nama Customer" value={data?.debtorName || '-'} />
      <Cell title="Pipeline ID" value={data?.bucketProcessId || '-'} />
      {!isPemda &&
        <Cell title="NPWP" value={data?.npwp || '-'} />
      }
      <Cell title="Created Date" value={toDateString(data?.modifiedAt) || '-'} />
      {!isPemda &&
        <Cell title="Nama Group" value={data?.groupName || '-'} />
      }
      <Cell title="Nama RM" value={data?.staffName || '-'} />
      <Cell title="Datasource" value={data?.dataSourceLabel || '-'} />
      <Cell title="Divisi" value={data?.division || '-'} />
      <Cell title="Tipe Proses" value={data?.typeProcessLabel || '-'} />
      <Cell title="General Account Manager" value={data?.gamName || '-'} />
      <Cell title="Tipe Pembiayaan" value={data?.financeTypeLabel || '-'} />
      <Cell title="Nama Analis" value={data?.analystName || '-'} />
      <Cell title="New / Existing Client" value={data?.isNewClient !== null && data?.isNewClient !== undefined ? (data?.isNewClient ? 'New Client' : 'Existing Client') : '-'} />
      {data?.typeProcess !== TypeProcess.ANNUAL_REVIEW && <Cell title="Total plafond Pengajuan" value={data?.currency && data?.totalProposal ? `${data?.currency} ${data?.totalProposal}` : '-'} />}
      <Cell title="Remarks" value={data?.remarks || '-'} sx={{ gridColumn: '1 / 3' }} />
    </Box>
  );


};

PipelineDataViewOnly.propTypes = {
  data: PropTypes.shape({}),
};

export default PipelineDataViewOnly;
