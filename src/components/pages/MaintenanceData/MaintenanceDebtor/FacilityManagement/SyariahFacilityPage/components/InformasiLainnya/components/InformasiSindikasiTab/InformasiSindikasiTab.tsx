import { Box, Divider, useTheme } from '@mui/material';
import { Controller, FormProvider } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ButtonClose from '../ButtonClose';

import TableFacilityInformation from './components/TableFacilityInformation';
import useInformasiSindikasi from './InformasiSindikasiTab.hook';


const InformasiSindikasi = () => {
  const theme = useTheme();
  const {
    canEdit,
    isOrderType,
    methods,
    watchFields,
    krediturFields,
    handleAddKrediturItem,
    tableHeaderKreditur,
    agentFields,
    handleAddAgentItem,
    tableHeaderAgent,
    feeFields,
    handleAddFeeItem,
    tableHeaderFee,
    container,
    setContainer,
    dataTabSyndication,
    initialSectionFormat,
    facilityInformation,
    onSubmit,
  } = useInformasiSindikasi();
  console.log('dataTabSyndication', dataTabSyndication);
  const { control } = methods;

  const facilityData = facilityInformation?.data?.content;
  return (
    <>
      <Title title="Informasi Sindikasi" />
      <ColumnWrapper sx={{ gap: 3 }}>
        <TableFacilityInformation
          facilityID={!!isOrderType ? facilityData?.facilityId : facilityData?.facilityCore}
          facilityNo={facilityData?.facilityNo}
          divisi={facilityData?.division}
          rm={facilityData?.relationshipManager}
          lastModified={facilityData?.lastModified}
          modifiedBy={facilityData?.modifiedBy}
        />
        <FormProvider {...methods}>
          <SectionTitle isOpen title="Informasi Sindikasi">

            <ColumnWrapper gap={3}>
              <Title title="Bank Information" />

              <Controller
                name="isSyndicated"
                control={control}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Sindikasi"
                    placeholder="Input Sindikasi"
                    type="radio"
                    radioList={[
                      {
                        label: 'Ya',
                        value: true,
                      },
                      {
                        label: 'Tidak',
                        value: false,
                      },
                    ]}
                    onChange={(e) => {
                      field.onChange(e.target.value);
                      methods.setValue('isSyndicated', e.target.value);
                    }}
                    disabled={!canEdit}
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


              </Box>
              <TextStyle
                variant="body3"
                weight={600}
                color={theme.palette.primary.main}
                sx={{ py: theme.spacing(3) }}
              >
                Other:
              </TextStyle>

              <WordEditor
                // isReadOnly={viewOnly}
                // isLoading={isDetailNotesLoading}
                container={container}
                setContainer={setContainer}
                initialValue={dataTabSyndication?.other}
              />
            </ColumnWrapper>
          </SectionTitle>

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
        </FormProvider>

        <RowWrapper sx={{ gap: 2, justifyContent: 'end', pb: 2, pt: 3 }}>
          <ButtonClose />
          {canEdit && (
            <Button
              onClick={onSubmit}
            >
              Save
            </Button>
          )}
        </RowWrapper>
      </ColumnWrapper>
    </>
  );
};
export default InformasiSindikasi;
