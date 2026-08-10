import { Box } from '@mui/material';
import { Controller } from 'react-hook-form';

import useViewOnly from '@/hooks/useViewOnly';

import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import CheckboxApplication from '../CheckboxApplication/CheckboxApplication';

import useApplication from './Application.hook';


const ApplicationSection = ({
  control,
  watch,
  changeBgInput,
  findDataMaster,
  needCheckMaster,
  checkDiffAppCategory,
  appliPurpose,
}) => {
  const { viewOnly } = useViewOnly();
  const {
    applicationCategory,
    applicationPurpose,
    applicationType,
    theme,
    findLabelAplicationType,
    findLabelAplicationCategory,
    isDpopDivision,
  } = useApplication();


  return (
    <SectionTitle title="Tipe Permohonan" isOpen>
      <BaseContainer sx={{ boxShadow: 2, gap: 2 }}>
        <Box>
          <RowWrapper
            alignItems="center"
          >
            <ColumnWrapper>
              <Controller
                control={control}
                name="applicationType"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    disabled={viewOnly}
                    sx={{
                      backgroundColor: changeBgInput('applicationType'),
                    }}
                    label=""
                    inputRef={ref}
                    type="radio"
                    placeholder="Pilih Tipe Permohonan"
                    containerSx={{ flex: 1 }}
                    radioList={applicationType}
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />

            </ColumnWrapper>
            {watch('applicationType')?.includes('OTHERS') &&
              <Box>
                <Controller
                  control={control}
                  name="applicationTypeRemark"
                  render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                    <Input

                      {...field}
                      inputRef={ref}
                      disabled={viewOnly}
                      type="text"
                      inputProps={{
                        style: {
                          backgroundColor: changeBgInput('applicationTypeRemark'),
                        },
                      }}
                      placeholder="input Lainnya"

                      error={invalid}
                      helperText={error ? error.message : ''}
                    />
                  )}
                />
                {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('applicationTypeRemark') || '-'}</TextStyle>}
              </Box>
            }
            <Box flex={1} />
          </RowWrapper>
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('applicationType') ? findLabelAplicationType(findDataMaster('applicationType')) : '-'}</TextStyle>}

        </Box>
        <Box>
          <Controller
            control={control}
            name="applicationCategory"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                isMandatory
                {...field}
                disabled={viewOnly || isDpopDivision}
                inputRef={ref}
                inputSx={{
                  backgroundColor: changeBgInput('applicationCategory'),
                }}
                label="Jenis Permohonan"
                type="dropdown"
                onChange={(val) => checkDiffAppCategory(val)}
                placeholder="Pilih Jenis Permohonan"
                containerSx={{ flex: 1 }}
                dropdownList={applicationCategory}
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('applicationCategory') ? findLabelAplicationCategory(findDataMaster('applicationCategory')) : '-'}</TextStyle>}
        </Box>

        <Box mb={-2}>
          <Box>
            <Controller
              control={control}
              name="applicationPurpose"
              render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                <CheckboxApplication
                  isMandatory
                  {...field}
                  inputRef={ref}
                  disabled={viewOnly}
                  type="checkbox"
                  // checkboxList={
                  //   isDpopDivision ?
                  // (applicationPurpose?.sort((a, b) =>
                  // parseFloat(a.id) - parseFloat(b.id)).filter((val) => val.value !== 'OTHERS')) :
                  //     applicationPurpose?.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
                  // }
                  appliPurpose={appliPurpose}
                  checkboxList={
                    applicationPurpose?.sort((a, b) => parseFloat(a.id) - parseFloat(b.id))
                  }
                  needCheckMaster={needCheckMaster}
                  valMasterData={findDataMaster('applicationPurpose')}
                  label="Tujuan Permohonan"
                  containerSx={{ flex: 1 }}
                  error={invalid}
                  helperText={error ? error.message : ''}
                  position="vertical"
                  sx={{
                    '& .MuiSvgIcon-root': { fontSize: 14 },
                    'div': {
                      marginTop: 0,
                    },
                  }}
                />
              )}
            />
            {/* <Input
              disabled
              type="checkbox"
              checkboxList={[{ label: 'Lainnya', value: 'OTHERS' }]}
              containerSx={{ flex: 1 }}
              position="vertical"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 14 },
                display: !(isDpopDivision) ? 'none' : 'block',
                'div': {
                  marginTop: 0,
                },
                gap: 0,
              }}
              value={watch().applicationPurpose?.includes('OTHERS') ? 'OTHERS' : ''}
            /> */}
          </Box>
        </Box>
        {
          watch('applicationPurpose')?.includes('OTHERS') &&
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gridTemplateRows: 'auto',
            }}
          >
            <Box />
            <Box width="50%" sx={{ pl: theme.spacing(2) }} >
              <Controller
                control={control}
                name="applicationPurposeRemark"
                render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
                  <Input
                    {...field}
                    inputRef={ref}
                    disabled={viewOnly}
                    type="text"
                    inputProps={{
                      style: {
                        backgroundColor: changeBgInput('applicationPurposeRemark'),
                      },
                    }}
                    placeholder="input Lainnya"
                    error={invalid}
                    helperText={error ? error.message : ''}
                  />
                )}
              />
              {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('applicationPurposeRemark') || '-'}</TextStyle>}
            </Box>
          </Box>
        }
        <Box>
          <Controller
            control={control}
            name="applicationRemarks"
            render={({ field: { ref, ...field }, fieldState: { invalid, error } }) => (
              <Input
                {...field}
                disabled={viewOnly}
                inputRef={ref}
                type="area"
                label="Keterangan"
                placeholder="Input keterangan"
                rows={3}
                inputSx={{
                  backgroundColor: changeBgInput('applicationRemarks'),
                }}
                isMandatory
                error={invalid}
                helperText={error ? error.message : ''}
              />
            )}
          />
          {needCheckMaster && <TextStyle weight={500}>Data Sebelumnya : {findDataMaster('applicationRemarks') || '-'}</TextStyle>}
        </Box>
      </BaseContainer>
    </SectionTitle>
  );
};

export default ApplicationSection;
