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

import UseProjectOwner from './ProjectOwner.hooks';


const ProjectOwner = () => {
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
  } = UseProjectOwner();

  const getPreviousValue = (fieldData, isPhoneField = false, phoneField = '') => {
    if (!fieldData?.updated) return '';

    const previousValue = fieldData?.previousValue;

    if (isPhoneField && previousValue && typeof previousValue === 'object') {
      return previousValue[phoneField] || '';
    }

    return previousValue || '';
  };

  const dataAsOfProjectOwner = useMemo(() => {
    return detailProyek?.data?.content?.owner?.modifiedDate
      ? formatDateTime(detailProyek.data.content.owner.modifiedDate)
      : '-';
  }, [detailProyek?.data?.content?.owner?.modifiedDate]);

  const { actions, handleSubmitModal, handleClose } = UseActionButtonsProyek(bucketProcessId);

  return (
    <ColumnWrapper>
      <RowWrapper sx={{ marginBottom: 5 }}>
        <Title
          title={`${title} Project Owner`}
        />
      </RowWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <SectionTitle isOpen title="Project Owner" >
          <Box display="flex" alignItems="center" py={2} gap={1}>
            <TextStyle variant="body4" weight={600}>
              {`Data as of : ${dataAsOfProjectOwner}`}
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
              name="owner.name"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  value={field.value || ''}
                  label="Pemilik Proyek"
                  placeholder="Input Pemilik Proyek"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.name)}
                />
              }
            />

            <Controller
              name="owner.contactName"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  value={field.value || ''}
                  label="Nama Kontak Pemilik Proyek"
                  placeholder="Input Nama Kontak Pemilik Proyek"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.contactName)}
                />
              }
            />
            <Box sx={{ gridColumn: 'span 2' }}>
              <Controller
                name="owner.address"
                control={control}
                render={({ field }) =>
                  <Input
                    {...field}
                    value={field.value || ''}
                    label="Alamat Kantor Pemilik Proyek"
                    placeholder="Input Alamat Kantor Pemilik Proyek"
                    type="area"
                    disabled={isDisableField}
                    hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.address)}
                  />
                }
              />
            </Box>

            <Controller
              name="owner.website"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  value={field.value || ''}
                  label="Website Pemilik Proyek"
                  placeholder="Input Website Pemilik Proyek"
                  type="text"
                  disabled={isDisableField}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.website)}
                />
              }
            />

            <Controller
              name="owner.email"
              control={control}
              render={({ field, fieldState: { error } }) =>
                <Input
                  {...field}
                  value={field.value || ''}
                  label="Email Kontak Pemilik Proyek"
                  placeholder="Input Email Kontak Pemilik Proyek"
                  type="text"
                  inputProps={{
                    pattern: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$',
                  }}
                  error={!!error}
                  helperText={error?.message || ''}
                  disabled={isDisableField}
                  hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.email)}
                />
              }
            />
            <Box>
              <TextStyle variant="body4" weight={600} color={isDetailPage && theme.palette.disabled.main}>
                Telepon Kontak Pemilik Proyek
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
                  name="owner.phone.phoneCode"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Kode"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.phone, true, 'phoneCode')}
                    />
                  }
                />

                <Controller
                  name="owner.phone.phoneNumber"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Input Telepon Kontak Pemilik Proyek"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.phone, true, 'phoneNumber')}
                    />
                  }
                />

                <Controller
                  name="owner.phone.phoneExt"
                  control={control}
                  render={({ field }) =>
                    <Input
                      {...field}
                      value={field.value || ''}
                      placeholder="Ext"
                      type="text"

                      onKeyDown={(e) => {
                        if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
                          e.preventDefault();
                        }
                      }}
                      disabled={isDisableField}
                      hasDataMaster={getPreviousValue(detailProyek?.data?.content?.owner?.phone, true, 'phoneExt')}
                    />
                  }
                />
              </Box>
            </Box>
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
          name="owner.modifiedBy"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value || ''}
              label="Modified By"
              placeholder="Modified By"
              type="text"
              disabled
            />
          }
        />

        <Controller
          name="owner.modifiedDate"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              value={field.value || ''}
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

export default ProjectOwner;
