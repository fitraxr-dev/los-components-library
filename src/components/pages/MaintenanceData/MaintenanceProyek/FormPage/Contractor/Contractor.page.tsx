'use client';
import { useMemo } from 'react';

import { Box, Tooltip } from '@mui/material';
import { Controller } from 'react-hook-form';

import { formatDateTime } from '@/helpers/date';
import useApp from '@/hooks/useApp';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionButtonsProyek from '../../components/ActionButtonsProyek/actionButtonsProyek';
import UseActionButtonsProyek from '../../hooks/useActionButtonsProyek';

import UseContractor from './Contractor.hooks';


const Contractor = () => {
  const [{ currentRole }] = useApp();

  const {
    bucketProcessId,
    control,
    detailProyek,
    handleSave,
    handleSubmit,
    isCreatePage,
    isAutoSaveFetching,
    isDetailPage,
    isDisableField,
    isSaveLoading,
    isValid,
    router,
    submitDisable,
    theme,
    title,
  } = UseContractor();

  const getPreviousValue = (fieldData, isPhoneField = false, phoneField = '') => {
    if (!fieldData?.updated) return '';

    const previousValue = fieldData?.previousValue;

    if (isPhoneField && previousValue && typeof previousValue === 'object') {
      return previousValue[phoneField] || '';
    }

    return previousValue || '';
  };

  const dataAsOfContractor = useMemo(() => {
    return detailProyek?.data?.content?.contractor?.modifiedDate
      ? formatDateTime(detailProyek.data.content.contractor.modifiedDate)
      : '-';
  }, [detailProyek?.data?.content?.contractor?.modifiedDate]);

  // Pass bucketProcessId to UseActionButtonsProyek
  const { actions, handleSubmitModal, handleClose } = UseActionButtonsProyek(bucketProcessId);

  return (
    <ColumnWrapper>
      <RowWrapper sx={{ marginBottom: 5 }}>
        <Title
          title={`${title} Contractor`}
        />
      </RowWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="Contractor" >
          <Box display="flex" alignItems="center" py={2} gap={1}>
            <TextStyle variant="body4" weight={600}>
              {`Data as of : ${dataAsOfContractor}`}
            </TextStyle>
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              py: 2,
            }}
          >
            <Controller
              name="contractor.name"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nama Kontraktor"
                  placeholder="Input Nama Kontraktor"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.name)}
                />
              }
            />

            <Controller
              name="contractor.contactName"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Nama Kontak Kontraktor"
                  placeholder="Input Nama Kontak Kontraktor"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.contactName)}
                />
              }
            />

            <Box sx={{ gridColumn: 'span 2' }}>
              <Controller
                name="contractor.address"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    label="Alamat Kantor Kontraktor"
                    placeholder="Input Alamat Kantor Kontraktor"
                    type="area"
                    disabled={isDisableField}
                    hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.address)}
                  />
                }
              />
            </Box>

            <Controller
              name="contractor.website"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Website Kontraktor"
                  placeholder="Input Website Kontraktor"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.website)}
                />
              }
            />

            <Controller
              name="contractor.email"
              control={control}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  label="Email Kontak Kontraktor"
                  placeholder="Input Email Kontak Kontraktor"
                  type="text"
                  inputProps={{
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                  }}
                  error={!!error}
                  helperText={error?.message || ''}
                  disabled={isDisableField}
                  hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.email)}
                />
              }
            />
            <Box>
              <TextStyle variant="body4" weight={600} color={isDetailPage && theme.palette.disabled.main}>
                Telepon Kontak Kontraktor
              </TextStyle>
              <Box
                sx={{
                  display: 'grid',
                  gridGap: theme.spacing(1),
                  gridTemplateColumns: '1fr 2fr 1fr',
                }}
                paddingTop={1}
              >
                <Controller
                  name="contractor.phone.phoneCode"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      placeholder="Kode"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.contractor?.phone, true, 'phoneCode')}
                    />
                  }
                />

                <Controller
                  name="contractor.phone.phoneNumber"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      placeholder="Input Telepon Kontak Kontraktor"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.contractor?.phone, true, 'phoneNumber')}
                    />
                  }
                />

                <Controller
                  name="contractor.phone.phoneExt"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      placeholder="Ext"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.contractor?.phone, true, 'phoneExt')}
                    />
                  }
                />
              </Box>
            </Box>
            <Controller
              name="contractor.classification"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label="Klasifikasi Usaha Kontraktor"
                  placeholder="Klasifikasi Usaha Kontraktor"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster = {getPreviousValue(detailProyek?.data?.content?.contractor?.classification)}
                />
              }
            />
          </Box>
        </SectionTitle>
      </ColumnWrapper>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
          py: 2,
        }}
      >
        <Controller
          name="contractor.modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled
            />
          }
        />

        <Controller
          name="contractor.modifiedDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              label="Last Modified"
              placeholder="Last Modified"
              type="text"
              disabled
            />
          }
        />
      </Box>
      { isCreatePage ? (
        <RowWrapper marginTop={5} justifyContent="end" gap={theme.spacing(2)}>
          <Button
            variant="outlined"
            onClick={() => { router.back(); }}
          >
            Close
          </Button>
          <Button
            isLoading={isSaveLoading}
            onClick={handleSubmit(handleSave)}
            disabled={!isValid}
          >
            Save
          </Button>
        </RowWrapper>
      ) : (
        <RowWrapper sx={{ gap: theme.spacing(2), justifyContent: 'end', py: 3 }}>
          <ActionButtonsProyek
            actions={actions?.action || {}}
            handleSave={handleSave}
            isAutoSaveFetching={isAutoSaveFetching}
            handleOpenSubmitModal={handleSubmitModal}
            isSubmitDisable={!submitDisable}
            isSubmitLoading={false}
            viewOnly={false}
            onClose={handleClose}
            currentRole={currentRole}
          />
        </RowWrapper>
      )}
    </ColumnWrapper>
  );
};

export default Contractor;
