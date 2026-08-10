import React, { useEffect, useState } from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { dayJsJakartaKeep } from '@/helpers/date';
import useCheckFileDokument from '@/hooks/useCheckFileDokument';
import useViewOnly from '@/hooks/useViewOnly';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';

import { shareholderTooltip } from '../../../../ManagementShareholder.constants';

import useTabGeneralInformation from './TabGeneralInformation.hook';

import type { TabGeneralInformationProps } from './TabGeneralInformation.types';


const TabGeneralInformation = (props: TabGeneralInformationProps) => {
  const { isDetailPage } = props;
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const [isViewOnly, setIsViewOnly] = useState(false);

  const {
    control,
    watch,
    handleClose,
    handleOnSave,
    handleSubmit,
    institutionTypeList,
    jobPositionList,
    idDocTypeList,
    isSaveLoading,
    findDataMaster,
    handleBackToListPage,
    handleNotComplete,
    setValue,
    isValid,
  } = useTabGeneralInformation();

  const [fileErrorNpwp, setFileErrorNpwp] = useState<string>('');
  const [fileErrorId, setFileErrorId] = useState<string>('');
  const [fileErrorFirstNoNotaryDeed, setFileErrorFirstNoNotaryDeed] = useState<string>('');
  const [fileErrorLastNoNotaryDeed, setFileErrorLastNoNotaryDeed] = useState<string>('');
  const { validateFile, acceptedFormatsText } = useCheckFileDokument();

  // useEffect(() => {
  //   setIsViewOnly(viewOnly || (watch('npwp')?.length !== 0 && watch('npwp')?.length < 15));
  // }, [watch('npwp')]);


  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <SectionTitle title="Detail Pihak Terkait Lainnya" isOpen>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: theme.spacing(3),
          }}
        >
          <Controller
            control={control}
            name="refId"
            render={({ field }) => (
              <Input
                {...field}
                placeholder="Placeholder"
                label="ID Ref. Pihak Terkait Lainnya"
                disabled
              />
            )}
          />

          <Controller
            control={control}
            name="institutionType"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="dropdown"
                placeholder="Choose Tipe"
                dropdownList={institutionTypeList}
                label="Tipe"
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                hasDataMaster={findDataMaster('institutionType', institutionTypeList)}
              />
            )}
          />

          <ColumnWrapper gap={theme.spacing(1)}>
            <RowWrapper>
              <TextStyle variant="body4" weight={600} color={isDetailPage && theme.palette.disabled.main}>
                Nama Pihak Terkait Lainnya
              </TextStyle>
              <TextStyle variant="body4" weight={600} color={theme.palette.error.main}>
                *
              </TextStyle>
              <Tooltip
                arrow
                placement="right"
                slotProps={{
                  arrow: {
                    sx: {
                      color: '#fff',
                    },
                  },
                  tooltip: {
                    sx: {
                      backgroundColor: '#fff',
                      boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.2)',
                      color: theme.palette.primary.main,
                    },
                  },
                }}
                title={
                  <ul>
                    {shareholderTooltip.map((dt) => (
                      <li key={dt}>
                        <TextStyle variant="body5" >
                          {dt}
                        </TextStyle>
                      </li>
                    ))}
                  </ul>
                }
              >
                <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                  <Icon iconName="information-shape" />
                </Box>
              </Tooltip>
            </RowWrapper>

            <Box
              sx={{
                display: 'grid',
                gap: theme.spacing(2),
                gridTemplateColumns: (watch('institutionType') === 'INDIVIDUAL' || watch('institutionType') === 'PMA') ? '20% 1fr 20%' : '1fr',
              }}
            >
              {(watch('institutionType') === 'INDIVIDUAL' || watch('institutionType') === 'PMA') && (
                <Controller
                  control={control}
                  name="name.prefix"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      {...field}
                      placeholder="Input Gelar"
                      error={!!error}
                      helperText={(invalid || error) && error.message}
                      disabled={isDetailPage || viewOnly}
                      hasDataMaster={findDataMaster('name.prefix')}
                    />
                  )}
                />
              )}
              <Controller
                control={control}
                name="name.fullName"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    {...field}
                    placeholder="Input Nama"
                    error={!!error}
                    helperText={(invalid || error) && error.message}
                    disabled={isDetailPage || viewOnly}
                    hasDataMaster={findDataMaster('name.fullName')}
                  />
                )}
              />
              {(watch('institutionType') === 'INDIVIDUAL' || watch('institutionType') === 'PMA') && (
                <Controller
                  control={control}
                  name="name.suffix"
                  render={({ field, fieldState: { error, invalid } }) => (
                    <Input
                      {...field}
                      placeholder="Input Gelar"
                      error={!!error}
                      helperText={(invalid || error) && error.message}
                      disabled={isDetailPage || viewOnly}
                      hasDataMaster={findDataMaster('name.suffix')}
                    />
                  )}
                />
              )}
            </Box>
          </ColumnWrapper>
          <Controller
            control={control}
            name="jobPosition"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="dropdown"
                placeholder="Choose Jabatan"
                label="Jabatan"
                dropdownList={jobPositionList}
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                hasDataMaster={findDataMaster('jobPosition', jobPositionList)}
              />
            )}
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Dokumen Pihak Terkait Lainnya" isOpen>
        <Box
          sx={{
            display: 'grid',
            gap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            py: theme.spacing(3),
          }}
        >
          <Controller
            control={control}
            name="idType"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="dropdown"
                placeholder="Choose ID Type"
                label="ID Type"
                dropdownList={idDocTypeList}
                isMandatory
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                hasDataMaster={findDataMaster('idType', idDocTypeList)}
              />
            )}
          />

          <Controller
            control={control}
            name="identityExpiry"
            render={({ field: { onChange, ...field }, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                type="date"
                label="Identity Expiry"
                InputProps={{ placeholder: 'Placeholder' }}
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                onChange={(val) => onChange(dayJsJakartaKeep(val))}
                hasDataMaster={findDataMaster('identityExpiry')}
              />
            )}
          />

          <Controller
            control={control}
            name="idNumber"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                placeholder="Input ID No."
                label="ID No."
                type="number"
                isMandatory
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                hasDataMaster={findDataMaster('idNumber')}
              />
            )}
          />

          <Controller
            name="idDocFile"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => {
              return (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload ID"
                  placeholder="Upload ID"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorId}
                  helperText={fileErrorId || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorId('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorId(result.errorMessage);
                      setValue('idDocFile', null);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              );}}
          />

          <Controller
            control={control}
            name="npwp"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                placeholder="Input NPWP"
                label="NPWP"
                maxLength={16}
                isMandatory
                error={!!error}
                helperText={(invalid || error) && error.message}
                disabled={isDetailPage || viewOnly}
                hasDataMaster={findDataMaster('npwp')}
              />
            )}
          />

          <Controller
            name="npwpDocFile"
            control={control}
            render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => {
              return (
                <Input
                  {...field}
                  inputRef={ref}
                  type="file"
                  label="Upload NPWP"
                  placeholder="Upload NPWP"
                  containerSx={{ flex: 1 }}
                  error={isTouched && invalid || !!fileErrorNpwp}
                  helperText={fileErrorNpwp || (isTouched && error ?
                    error.message : `Supported formats: ${acceptedFormatsText}`)}
                  downloadOnly={isDetailPage}
                  isMandatory
                  onChange={(val) => {
                    setFileErrorNpwp('');
                    const result = validateFile(val);
                    if (!result.isValid) {
                      setFileErrorNpwp(result.errorMessage);
                      setValue('npwpDocFile', null);
                      return;
                    }
                    field.onChange(val);
                  }}
                />
              );}}
          />


          {(watch('institutionType') !== 'INDIVIDUAL' && watch('institutionType') !== 'PMA') ? (
            <>
              <Controller
                control={control}
                name="firstNoNotaryDeed"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    {...field}
                    placeholder="Input Akta Pendirian"
                    label="Akta Pendirian"

                    isMandatory
                    error={!!error}
                    helperText={(invalid || error) && error.message}
                    disabled={isDetailPage || viewOnly}
                    hasDataMaster={findDataMaster('firstNoNotaryDeed')}
                  />
                )}
              />

              <Controller
                name="firstNoNotaryDeedFile"
                control={control}
                render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => {
                  return (
                    <Input
                      {...field}
                      inputRef={ref}
                      type="file"
                      label="Upload Akta Pendirian"
                      placeholder="Upload Akta Pendirian"
                      containerSx={{ flex: 1 }}
                      error={isTouched && invalid || !!fileErrorFirstNoNotaryDeed}
                      helperText={fileErrorFirstNoNotaryDeed || (isTouched && error ?
                        error.message : `Supported formats: ${acceptedFormatsText}`)}
                      downloadOnly={isDetailPage}
                      isMandatory
                      onChange={(val) => {
                        setFileErrorFirstNoNotaryDeed('');
                        const result = validateFile(val);
                        if (!result.isValid) {
                          setFileErrorFirstNoNotaryDeed(result.errorMessage);
                          setValue('firstNoNotaryDeedFile', null);
                          return;
                        }
                        field.onChange(val);
                      }}
                    />
                  );}}
              />

              <Controller
                control={control}
                name="lastNoNotaryDeed"
                render={({ field, fieldState: { error, invalid } }) => (
                  <Input
                    {...field}
                    placeholder="Input Akta Perubahan"
                    label="Akta Perubahan"

                    error={!!error}
                    helperText={(invalid || error) && error.message}
                    disabled={isDetailPage || viewOnly}
                    hasDataMaster={findDataMaster('lastNoNotaryDeed')}
                  />
                )}
              />

              <Controller
                name="lastNoNotaryDeedFile"
                control={control}
                render={({ field: { ref, ...field }, fieldState: { invalid, error, isTouched } }) => {
                  return (
                    <Input
                      {...field}
                      inputRef={ref}
                      type="file"
                      label="Upload Akta Perubahan"
                      placeholder="Upload Akta Perubahan"
                      containerSx={{ flex: 1 }}
                      error={isTouched && invalid || !!fileErrorLastNoNotaryDeed}
                      helperText={fileErrorLastNoNotaryDeed || (isTouched && error ?
                        error.message : `Supported formats: ${acceptedFormatsText}`)}
                      downloadOnly={isDetailPage}
                      onChange={(val) => {
                        setFileErrorLastNoNotaryDeed('');
                        const result = validateFile(val);
                        if (!result.isValid) {
                          setFileErrorLastNoNotaryDeed(result.errorMessage);
                          setValue('lastNoNotaryDeedFile', null);
                          return;
                        }
                        field.onChange(val);
                      }}
                    />
                  );}}
              />

            </>
          ) : null}

          <Controller
            control={control}
            name="modifiedBy"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                placeholder="Modified By"
                label="Modified By"
                disabled
                error={!!error}
                helperText={(invalid || error) && error.message}
              />
            )}
          />

          <Controller
            control={control}
            name="lastModified"
            render={({ field, fieldState: { error, invalid } }) => (
              <Input
                {...field}
                placeholder="Last Modified"
                label="Last Modified"
                disabled
                error={!!error}
                helperText={(invalid || error) && error.message}
              />
            )}
          />
        </Box>
      </SectionTitle>
      <RowWrapper justifyContent="end">
        {isDetailPage ? (
          <Button onClick={handleBackToListPage} variant="outlined">Close</Button>
        ) : (
          <Button
            onClick={handleOnSave}
            isLoading={isSaveLoading}
            disabled={isViewOnly || !isValid}
          >
            Save
          </Button>
        )}

      </RowWrapper>
    </ColumnWrapper>
  );
};

export default TabGeneralInformation;
