'use client';
import React from 'react';

import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import useApuPptData from './ApuPptData.hooks';


const ApuPptData = () => {
  const theme = useTheme();
  const {
    control,
    tableHeaderCddImplementation,
    penerapanCddData,
    isDebtor,
    debtorData,
    actions,
    handleOpenSubmitModal,
    isSubmitLoading,
    isViewOnly,
    handleClose,
    watch,
  } = useApuPptData();
  const viewOnly = true;

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="APUPPT Data" />
      { isDebtor ?
        <>
          <TableDebtorInformationLocal
            debtorName={debtorData?.name}
            gamName={debtorData?.gamName}
            staffName={debtorData?.staffName}
            isNewClient={debtorData?.isNewDebtor}
            cif={debtorData?.cif}
            division={debtorData?.divisionName}
            debtorId={debtorData?.debtorId}
            createdAt={debtorData?.createdDate}
          />
        </> :
        <>
          <TableDebtorInformation
            isMaintenanceCustomer={true}
            module={TypeModule.MAINTENANCE_DATA}
            process={TypeProcess.MAINTENANCE_CUSTOMER}
            showDifferentDataAlert={false}
          />
        </>
      }
      <SectionTitle title="APU PPT Data" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {formatDateTime(watch('lastUpdate') ?? '')}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            mb: theme.spacing(3),
          }}
        >
          <Controller
            name="licenseNumber"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Nomor Izin Dari Instansi Berwenang"
                placeholder="Masukkan Nomor Izin Dari Instansi Berwenang"
                type="text"
              />
            }
          />

          <Controller
            name="businessField"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Bidang Usaha / Kegiatan Usaha"
                placeholder="Masukkan Bidang Usaha / Kegiatan Usaha"
                type="text"
              />
            }
          />
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
            }}
          >
            <Controller
              name="establishmentPlace"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  disabled={viewOnly}
                  label="Tempat Pendirian"
                  placeholder="Masukkan Tempat Pendirian"
                  type="text"
                />
              }
            />
            <Controller
              name="establishmentDate"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  disabled={viewOnly}
                  label="Tanggal Pendirian"
                  placeholder="Masukkan Tanggal Pendirian"
                  value={formatDateTime(field.value)}
                  type="text"
                />
              }
            />
          </Box>

          <Controller
            name="businessEntityForm"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Bentuk Usaha"
                placeholder="Masukkan Bentuk Usaha"
                type="text"
              />
            }
          />

          <Controller
            name="registeredStockExchange"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Terdaftar Dalam Bursa Efek"
                placeholder="Masukkan Terdaftar Dalam Bursa Efek"
                type="text"
              />
            }
          />

          <Controller
            name="ultimateBenficialOwner"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Pemilik Manfaat Utama / Ultimate Beneficial Owner"
                placeholder="Masukkan Pemilik Manfaat Utama / Ultimate Beneficial Owner"
                type="text"
              />
            }
          />


          <Controller
            name="sourceOfFund"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Sumber Dana"
                placeholder="Masukkan Sumber Dana"
                type="text"
              />
            }
          />

          <Controller
            name="revenue"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Penghasilan"
                placeholder="Masukkan Penghasilan"
                type="text"
              />
            }
          />

        </Box>
        <Controller
          name="applicationPurposeRemark"
          control={control}
          render={({ field }) =>
            <Input
              {...field}
              disabled={viewOnly}
              label="Maksud & Tujuan Hubungan Usaha"
              placeholder="Masukkan Maksud & Tujuan Hubungan Usaha"
              type="area"
              rows={4}
            />
          }
        />
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="accountOwned"
            control={control}
            render={({ field }) =>
              <Input
                {...field}
                disabled={viewOnly}
                label="Rekening Yang Dimiliki"
                placeholder="Masukkan Rekening Yang Dimiliki"
                type="text"
              />
            }
          />

          <Box>
            <RowWrapper mb={1} alignItems="center">
              <TextStyle
                variant="body4"
                weight={600}
                color={
                  viewOnly ? theme.palette.custom.gray30
                    : theme.palette.custom.text
                }
              >
                Source Data
              </TextStyle>
              <TextStyle
                variant="body4"
                weight={600}
                color={theme.palette.error.main}
              >
                <Tooltip title="Nomor digital memo sesuai data terupdate" placement="right">
                  <Box display="flex" alignItems="center">
                    <Icon iconName="information-shape" />
                  </Box>
                </Tooltip>
              </TextStyle>
            </RowWrapper>
            <Controller
              name="sourceData"
              control={control}
              render={({ field }) =>
                <Input
                  {...field}
                  label=""
                  placeholder="Source Data"
                  type="text"
                  disabled
                />
              }
            />
          </Box>
        </Box>
      </SectionTitle>

      <SectionTitle title="Penerapan CDD" isOpen>
        <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.custom.text}
          >
            Data as of : {penerapanCddData?.contents[0]?.lastUpdate ? formatDateTime(penerapanCddData?.contents[0]?.lastUpdate) : '-'}
          </TextStyle>
          <TextStyle
            variant="body4"
            weight={600}
            color={theme.palette.error.main}
          >
            <Tooltip title="Tanggal dan jam update data terakhir" placement="right">
              <Box display="flex" alignItems="center">
                <Icon iconName="information-shape" />
              </Box>
            </Tooltip>
          </TextStyle>
        </RowWrapper>

        <BaseContainer>
          <Table
            tableHeader={tableHeaderCddImplementation}
            tableData={penerapanCddData?.contents}
            pageSize={5}
            totalPage={1}
            currentPage={1}
          />
        </BaseContainer>
      </SectionTitle>


      <ActionFooterDetail />
    </ColumnWrapper>
  );
};

export default ApuPptData;
