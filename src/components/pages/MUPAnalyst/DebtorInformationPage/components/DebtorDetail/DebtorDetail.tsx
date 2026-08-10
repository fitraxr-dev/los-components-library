import React from 'react';

import { Box, useTheme } from '@mui/material';
import { Controller, useFormContext } from 'react-hook-form';

import useViewOnly from '@/hooks/useViewOnly';

import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';

import useDebtorDetail from './DebtorDetail.hook';


const DebtorDetail = () => {
  const theme = useTheme();
  const { viewOnly } = useViewOnly();
  const { control } = useFormContext();
  const {
    debtorDetail,
    isAnalyst,
    tableData,
    setTableData,
    tableHeader,
    isCreditorLoading,
    jobPositionData,
  } = useDebtorDetail();

  return (
    <SectionTitle title="Detail Customer" isOpen sx={{ mb: 3 }}>
      <BaseContainer sx={{ boxShadow: 7, padding: theme.spacing(2) }}>
        <Box sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2,1fr)' }}>
          <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
            <Input
              type="text"
              label="Nama Customer"
              value={debtorDetail.debtorName}
              placeholder="Nama Customer"
              containerSx={{ flex: 1 }}
              disabled
            />
          </Box>

          <Input
            type="text"
            label="Hubungan dengan SMI Sejak Tahun"
            value={debtorDetail.relationshipSince}
            placeholder="Hubungan dengan SMI Sejak Tahun"
            containerSx={{ flex: 1 }}
            disabled
          />

          <Input
            type="text"
            label="Tahun didirikan"
            value={debtorDetail.yearFounded}
            placeholder="Tahun Didirikan"
            containerSx={{ flex: 1 }}
            disabled
          />

          <Input
            disabled
            type="radio"
            label="Terafiliasi dengan SMI"
            value={debtorDetail.isAffiliate ? 'y' : 'n'}
            radioList={[
              { label: 'Ya', value: 'y' },
              { label: 'Tidak', value: 'n' },
            ]}
            containerSx={{ flex: 1 }}
          />

          <Input
            disabled
            type="radio"
            label="Customer Memiliki Group"
            value={debtorDetail.isGroup ? 'y' : 'n'}
            radioList={[
              { label: 'Ya', value: 'y' },
              { label: 'Tidak', value: 'n' },
            ]}
            containerSx={{ flex: 1 }}
          />

          <Input
            disabled
            type="radio"
            label="Terkait dengan SMI"
            value={debtorDetail.isRelatedToSmi ? 'y' : 'n'}
            radioList={[
              { label: 'Ya', value: 'y' },
              { label: 'Tidak', value: 'n' },
            ]}
            containerSx={{ flex: 1 }}
          />

          <Input
            disabled
            type="text"
            label="Rating Customer"
            value={debtorDetail.debtorRating}
            placeholder="Rating Customer"
            containerSx={{ flex: 1 }}
          />

          <Input
            disabled
            type="text"
            label="Jenis Customer"
            value={debtorDetail.debtorTypeLabel}
            placeholder="Jenis Customer"
            containerSx={{ flex: 1 }}
          />

          <Input
            disabled
            type="text"
            label="Jenis Sektor Usaha"
            placeholder="Jenis Sektor Usaha"
            value={debtorDetail.sectorName}
            containerSx={{ flex: 1 }}
          />

          <Box sx={{ display: 'flex', gap: theme.spacing(2) }}>
            <Input
              disabled
              type="text"
              label="Contact Person"
              placeholder="Contact Person"
              value={debtorDetail.contactPerson}
              containerSx={{ flex: 1 }}
            />

            <Autocomplete
              label="Jabatan"
              placeholder="Jabatan"
              value={jobPositionData.find((val) => val.label === debtorDetail?.position)?.label}
              disabled
            />
          </Box>
        </Box>

        <ColumnWrapper width="100%">
          <Table
            tableData={tableData}
            tableHeader={tableHeader}
            isLoading={isCreditorLoading}
            footer={
              !isAnalyst && !viewOnly ? (
                <RowWrapper sx={{ justifyContent: 'end' }}>
                  <Button
                    variant="outlined"
                    startIcon="add-2"
                    startIconSx={{ fontSize: theme.spacing(3) }}
                    sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                    onClick={() => setTableData([...tableData, { creditorName: '', creditorType: '' }])}
                  >
                    Add New
                  </Button>
                </RowWrapper>
              ) : null
            }
          />

          <Box
            mt={2}
            sx={{ display: 'grid', gridGap: theme.spacing(2), gridTemplateColumns: 'repeat(2,1fr)' }}
          >
            <Controller
              name="eirr"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="text"
                  label="EIRR"
                  placeholder="Input EIRR"
                  containerSx={{ flex: 1 }}
                  disabled={viewOnly}
                />
              )}
            />

            <Controller
              name="controllingParty"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="text"
                  label="Pihak Pengendali"
                  placeholder="Input Pihak Pengendali"
                  containerSx={{ flex: 1 }}
                  disabled={viewOnly}
                />
              )}
            />

            <Controller
              name="technicalMeetingDate"
              control={control}
              render={({ field: { ref, ...field } }) => (
                <Input
                  {...field}
                  inputRef={ref}
                  type="date"
                  label="Tanggal Rapat Teknis"
                  placeholder="Choose Tanggal Rapat Teknis"
                  InputProps={{ placeholder: 'Choose Tanggal Rapat Teknis' }}
                  disabled={viewOnly}
                />
              )}
            />
          </Box>
        </ColumnWrapper>
      </BaseContainer>
    </SectionTitle>
  );
};

export default DebtorDetail;
