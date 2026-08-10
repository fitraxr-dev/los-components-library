'use client';

import NiceModal from '@ebay/nice-modal-react';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { Controller } from 'react-hook-form';

import closeNiceModal from '@/hooks/useCloseNiceModal';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionModal from '@/components/shared/SmiModal/SectionModal';
import TextStyle from '@/components/shared/TextStyle';


import { shareholderTooltip } from '../../../../ManagementShareholder.constants';

import useModalAddStructure from './ModalAddStructure.hooks';


const ModalAddStructure = NiceModal.create((props: any) => {

  const {
    control,
    modal,
    modalId,
    institutionTypeList,
    theme,
    handleSaveStructure,
    isSaveLoading,
    isEdit,
    isValid,
    isDirty,
    watch,
  } = useModalAddStructure(props);


  return (
    <SectionModal
      title={isEdit ? 'Edit New Shareholder' : 'Add New Shareholder'}
      isOpen={modal.visible}
      onClose={() => closeNiceModal(modalId)}
      customFooter={() => null}
      containerSx={{ minWidth: '32vw' }}
      onConfirm={() => {
        handleSaveStructure();
        closeNiceModal(modalId);
      }}
    >
      <ColumnWrapper sx={{ gap: 3 }}>

        <Controller
          name="parentId"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              label="Nama Shareholder Tingkat Sebelumnya"
              placeholder="Nama Shareholder Tingkat Sebelumnya"
              isMandatory
              type="dropdown"
              dropdownList={props.parentLevel}
              onValueChange={(values) => {
                field.onChange(values);
              }}
              error={!!formState.errors.parentId}
              helperText={formState.errors.parentId?.message || null}
            />
          )}
        />

        <Controller
          name="type"
          control={control}
          render={({ field, formState }) => (
            <Input
              {...field}
              type="dropdown"
              label="Type"
              placeholder="Type"
              value={field.value}
              dropdownList={institutionTypeList}
              onValueChange={(values) => {
                field.onChange(values);
              }}
              isMandatory
              error={!!formState.errors.type}
              helperText={formState.errors.type?.message || null}
            />
          )}
        />

        { watch('type') === 'INDIVIDUAL' &&
          <>
            <Controller
              name="prefix"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Gelar Depan"
                  placeholder="Gelar Depan"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                />
              )}
            />
          </>
        }

        <Box sx={{ width: '100%' }}>
          <RowWrapper mb={1}>
            <TextStyle
              variant="body4"
              weight={600}
              // color={!isDetailPage ? theme.palette.custom.text : '#ABABAB'}
            >
              Nama Manajemen
            </TextStyle>
            <TextStyle
              variant="body4"
              weight={600}
              color={theme.palette.error.main}
            >
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
          <Controller
            name="name"
            control={control}
            render={({ field, formState }) => (
              <Input
                {...field}
                // hasDataMaster={findDataMaster('name')}
                placeholder="Nama Shareholder"
                type="text"
                // disabled={isDetailPage}
                error={!!formState.errors.name}
                helperText={formState.errors.name?.message || null}
              />
            )}
          />
        </Box>

        { watch('type') === 'INDIVIDUAL' &&
          <>
            <Controller
              name="suffix"
              control={control}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Gelar Belakang"
                  placeholder="Gelar Belakang"
                  value={field.value}
                  onValueChange={(values) => {
                    field.onChange(values);
                  }}
                />
              )}
            />
          </>
        }

        <Controller
          name="informationSource"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Sumber Data Informasi"
              placeholder="Sumber Data Informasi"
              value={field.value}
            />
          )}
        />

        <Controller
          name="shares"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="Lembar Saham"
              placeholder="Lembar Saham"
              value={field.value}
              // maxLength={13}
              onValueChange={(values) => {
                field.onChange(values.floatValue);
              }}
              // isAllowed={(values) => {
              //   const { formattedValue, floatValue } = values;
              //   return (
              //     formattedValue === '' ||
              //     (!formattedValue?.includes('.') && floatValue >= 0) ||
              //     (formattedValue?.split('.')[1]?.length >= 0 && formattedValue?.split('.')[1]?.length <= 10)
              //   );
              // }}
            />
          )}
        />

        <Controller
          name="percentage"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              type="number"
              label="%"
              placeholder="%"
              disabled
              value={field.value}
              // isAllowed={(values) => {
              //   const { formattedValue, floatValue } = values;
              //   const isValidFormat = /^[0-9]*$/.test(formattedValue);
              //   return (
              //     formattedValue === '' ||
              //     (isValidFormat && floatValue > 0 && floatValue <= 100)
              //   );
              // }}
            />
          )}
        />

        <Box sx={{ width: '100%' }}>
          <RowWrapper mb={1}>
            <TextStyle
              variant="body4"
              weight={600}
            >
              Beneficial Owner
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
                <TextStyle variant="body5" >
                  Benefical Owner level paling bawah wajib perorangan/perseorangan.
                </TextStyle>
              }
            >
              <Box display="flex" alignItems="center" sx={{ ml: 1 }}>
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </RowWrapper>
          <Controller
            name="beneficialOwner"
            control={control}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                placeholder="Beneficial Owner"
              />
            )}
          />
        </Box>
      </ColumnWrapper>
      <RowWrapper mt={3} sx={{ justifyContent: 'end' }}>
        <Button
          variant="outlined"
          sx={{ mr: 2 }}
          onClick={() => {
            closeNiceModal(modalId);
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          sx={{ mr: 2 }}
          isLoading={isSaveLoading}
          onClick={() => {
            handleSaveStructure();
          }}
          disabled={!isValid}
        >
          Save
        </Button>
      </RowWrapper>
    </SectionModal>

  );
},
);

export default ModalAddStructure;
