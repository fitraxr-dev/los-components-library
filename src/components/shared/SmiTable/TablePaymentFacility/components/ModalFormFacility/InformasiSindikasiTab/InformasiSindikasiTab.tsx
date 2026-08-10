import { Box, Divider, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';


import Autocomplete from '@/components/shared/Autocomplete';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import useInformasiSindikasi from './InformasiSindikasiTab.hook';


const InformasiSindikasi = ({ container, setContainer }: any) => {
  const theme = useTheme();
  const {
    methods,
    canEdit,
    krediturFields,
    handleAddKrediturItem,
    tableHeaderKreditur,
    agentFields,
    handleAddAgentItem,
    tableHeaderAgent,
    feeFields,
    handleAddFeeItem,
    tableHeaderFee,
    initialSectionFormat,
  } = useInformasiSindikasi();
  const { control } = methods;

  return (
    <>

      <TextStyle
        variant="body3"
        weight={600}
        color={theme.palette.primary.main}
        sx={{ py: theme.spacing(1) }}
      >
        Kreditur:
      </TextStyle>

      <Controller
        name="isSyndicated"
        control={control}
        render={({ field }) => (
          <Input
            {...field}
            type="checkbox"
            checkboxList={[
              {
                label: 'Sindikasi',
                value: 1,
              }
            ]}
            value={field.value ? [1] : []}
            onChange={(val) => {
              field.onChange(val?.[0]);
            }}
          />
        )}
      />

      <Box>
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ my: theme.spacing(3) }}
        >
          Informasi Sindikasi:
        </TextStyle>

        <Divider />
      </Box>

      <Box>

        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ my: theme.spacing(3) }}
        >
          Type of Fee
        </TextStyle>

        <Divider />

        <Box sx={{ borderRadius: '16px', boxShadow: '0px 4px 8px 0px #161A8224', my: theme.spacing(3), padding: theme.spacing(2) }}>
          <Table
            tableData={feeFields}
            tableHeader={tableHeaderFee}
            footer={<TableFooter onClick={handleAddFeeItem} />}
          />
        </Box>
      </Box>

      <Box>

        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ my: theme.spacing(3) }}
        >
          Kreditur Information
        </TextStyle>

        <Divider />

        <Box sx={{ borderRadius: '16px', boxShadow: '0px 4px 8px 0px #161A8224', my: theme.spacing(3), padding: theme.spacing(2) }}>
          <Table
            tableData={krediturFields}
            tableHeader={tableHeaderKreditur}
            footer={<TableFooter onClick={handleAddKrediturItem} />}
          />

        </Box>

        <Controller
          name="remark"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Keterangan"
              placeholder="Input Keterangan"
              type="area"
              rows={5}
            />
          }
        />
      </Box>

      <Box>
        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ my: theme.spacing(3) }}
        >
          Agent Information
        </TextStyle>
        <Divider />

        <Box sx={{ borderRadius: '16px', boxShadow: '0px 4px 8px 0px #161A8224', my: theme.spacing(3), padding: theme.spacing(2) }}>
          <Table
            tableData={agentFields}
            tableHeader={tableHeaderAgent}
            footer={<TableFooter onClick={handleAddAgentItem} />}
          />
        </Box>

        <TextStyle
          variant="body3"
          weight={600}
          color={theme.palette.primary.main}
          sx={{ py: theme.spacing(3) }}
        >
          Other:
        </TextStyle>
      </Box>
      <WordEditor
        // isReadOnly={viewOnly}
        // isLoading={isDetailNotesLoading}
        container={container}
        setContainer={setContainer}
        initialValue={methods.watch('other')}
        // initialSectionFormat={initialSectionFormat}
      />

      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Modified By"
              placeholder="Input Modified By"
              type="text"
              disabled

            />
          }
        />

        <Controller
          name="lastModified"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Last Modified"
              placeholder="Input Last Modified"
              type="text"
              disabled

              value={field?.value ? formatDateTime(field?.value) : field?.value}
            />
          }
        />
      </Box>
    </>
  );
};
export default InformasiSindikasi;
