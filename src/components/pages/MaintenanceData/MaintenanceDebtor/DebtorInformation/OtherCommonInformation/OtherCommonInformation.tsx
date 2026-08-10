'use client';
import React from 'react';

import { ModalDef } from '@ebay/nice-modal-react';
import { Box, Tooltip, useTheme } from '@mui/material';
import { Controller } from 'react-hook-form';

import { TypeModule, TypeProcess } from '@/enums/Module';
import { formatDateTime } from '@/helpers/date';

import ActionButtons, { ACTIONS } from '@/components/shared/ActionButtons';
import Autocomplete from '@/components/shared/Autocomplete';
import BaseContainer from '@/components/shared/BaseContainer';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import EmptyPlaceholder from '@/components/shared/EmptyPlaceholder';
import Icon from '@/components/shared/Icon';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ActionFooterDetail from '../../components/ActionFooterDetail/ActionFooterDetail';
import { modal } from '../../components/ActionFooterDetail/ActionFooterDetail.constant';
import ModalPlafonValidation from '../../components/ModalPlafonValidation/ModalPlafonValidation.page';
import TableDebtorInformationLocal from '../../components/TableDebtorInformationLocal';

import useOtherCommonInformation from './OtherCommonInformation.hooks';


const OtherCommonInformation = () => {
  const theme = useTheme();
  const {
    control,
    handleSave,
    TableHeaderTotal,
    TableHeaderSmi,
    TableDataTotal,
    TableDataSmi,
    gamDropdownList,
    isLoadingGamData,
    isLoadingRmData,
    isAutoSaveFetching,
    // setGamKeyword,
    isPending,
    isSubmitLoading,
    actions,
    isViewOnly,
    handleClose,
    setValue,
    valueGam,
    setValueGam,
    handleOpenSubmitModal,
    canEdit,
    findDataMaster,
    isDebtor,
    debtorData,
    setValueRm,
    valueRm,
    watch,
    rmDropdownList,
    detailRelationWithSmi,
    isFetchingDetailRelationWithSmi,
    valueDetailRelation,
    setValueDetailRelation,
    setIsSubmit,
    isSubmit,
  } = useOtherCommonInformation();

  const saveAction = actions?.action ? actions?.action[ACTIONS.SAVE] : null;

  return (
    <ColumnWrapper sx={{ gap: theme.spacing(3), paddingY: theme.spacing(3) }}>
      <Title title="Informasi Umum Lainnya" />
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

      <RowWrapper alignItems="center" py={theme.spacing(3)} gap={theme.spacing(2)}>
        <TextStyle
          variant="body4"
          weight={600}
          color={theme.palette.custom.text}
        >
          Data as of : 25 Oktober 2024 15:24:48
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

      <SectionTitle title="Informasi Pembiayaan" isOpen>
        <Box py={theme.spacing(3)}>
          <BaseContainer sx={{ padding: 0 }}>
            <RowWrapper gap={0}>
              <Box width="50%" sx={{ borderRight: '1px solid #e0e0e0' }} >
                <Box padding={theme.spacing(3)} display="flex" justifyContent="center">
                  <TextStyle
                    variant="body4"
                    color={theme.palette.primary.main}
                    weight={500}
                  >
                    Total Pembiayaan per Customer
                  </TextStyle>
                </Box>

                <Table
                  tableHeader={TableHeaderTotal}
                  tableData={TableDataTotal}
                />
              </Box>

              <Box width="50%" sx={{ borderRight: '1px solid #e0e0e0' }}>
                <Box padding={theme.spacing(3)} display="flex" justifyContent="center">
                  <TextStyle
                    variant="body4"
                    color={theme.palette.primary.main}
                    weight={500}
                  >
                    Porsi Pembiayaan SMI per Customer
                  </TextStyle>
                </Box>

                <Table
                  tableHeader={TableHeaderSmi}
                  tableData={TableDataSmi}
                />
              </Box>
            </RowWrapper>
          </BaseContainer>
        </Box>
      </SectionTitle>

      <SectionTitle title="Informasi Umum" isOpen>
        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="anotherInformation.relationInformation"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Informasi Berelasi"
                placeholder="Informasi Berelasi"
                type="text"
                // dropdownList={[
                //   { label: 'Ya', value: 'true' },
                //   { label: 'Tidak', value: 'false' },
                // ]}
                isMandatory
                hasDataMaster={findDataMaster('relationInformation')}
              />
            }
          />

          <Controller
            name="anotherInformation.isAffiliated"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
            {
              return (
                <Input
                  {...field}
                  label="Terafiliasi Dengan SMI"
                  placeholder="Pilih Terafiliasi Dengan SMI"
                  type="dropdown"
                  dropdownList={[
                    { label: 'Ya', value: 'true' },
                    { label: 'Tidak', value: 'false' },
                  ]}
                  isMandatory
                  hasDataMaster={findDataMaster('isAffiliated')}
                />
              );
            }
            }
          />

          <Controller
            name="anotherInformation.yearFounded"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Tahun Didirikan"
                placeholder="Masukkan Tahun Didirikan"
                type={isViewOnly ? 'text' : 'number'}
                isMandatory
                hasDataMaster={findDataMaster('yearFounded')}
              />
            }
          />

          <Controller
            name="anotherInformation.typeOfBusiness"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Jenis Sektor Usaha"
                placeholder="Masukkan Jenis Sektor Usaha"
                type="text"
                isMandatory
                hasDataMaster={findDataMaster('typeOfBusiness')}
              />
            }
          />

          <Controller
            name="anotherInformation.relationshipWithSmiSince"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Hubungan Dengan PT SMI Sejak Tahun"
                placeholder="Hubungan Dengan PT SMI Sejak Tahun"
                type={isViewOnly ? 'text' : 'number'}
                isMandatory
                hasDataMaster={findDataMaster('relationshipWithSmiSince')}
              />
            }
          />

          <Controller
            name="anotherInformation.detailRelation"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Autocomplete
                // {...field}
                id="input-detail-relation"
                disabled={isViewOnly}
                testId="input-detail-relation"
                isMandatory
                label="Detail Hubungan Dengan PT SMI"
                placeholder="Pilih Detail Hubungan Dengan PT SMI"
                dropdownList={detailRelationWithSmi}
                value={valueDetailRelation}
                isLoading={isFetchingDetailRelationWithSmi}
                onChange={(val) => {
                  console.log('val', val);
                  if (detailRelationWithSmi && detailRelationWithSmi.length > 0) {
                    if (val.value === '') {
                      setValue('anotherInformation.detailRelation', null);
                      setValueDetailRelation(null);
                      console.log('valueDetailRelation', valueDetailRelation);
                      console.log('watch', watch('anotherInformation.detailRelation'));
                    } else {
                      setValue('anotherInformation.detailRelation', val);
                      setValueDetailRelation(val);
                      console.log('valueDetailRelation', valueDetailRelation);
                      console.log('watch', watch('anotherInformation.detailRelation'));
                    }
                  }
                }}
                hasDataMaster={findDataMaster('detailRelation', detailRelationWithSmi)}
              />
            }
          />

          <Controller
            name="anotherInformation.generalAccountManager"
            control={control}
            render={({ field }) =>
            {
              return (

                <Autocomplete
                // {...field}
                  id="input-gam"
                  disabled={isViewOnly}
                  testId="input-gam"
                  isMandatory
                  label="General Account Manager"
                  placeholder="Pilih General Account Manager"
                  dropdownList={gamDropdownList}
                  value={valueGam}
                  isLoading={isLoadingGamData}
                  onChange={(val) => {
                    console.log('val', val);
                    if (gamDropdownList && gamDropdownList.length > 0) {
                      if (val.id === '') {
                        setValue('anotherInformation.generalAccountManager', null);
                        setValueGam(null);
                      } else {
                        setValue('anotherInformation.generalAccountManager', { label: val.label, value: String(val.id) });
                        setValueGam(val);
                      }
                    }
                  }}
                  hasDataMaster={findDataMaster('gamId', gamDropdownList)}
                />
              );
            }
            }
          />

          <Controller
            name="anotherInformation.rm"
            control={control}
            render={({ field }) =>
            {
              return (

                <Autocomplete
                // {...field}
                  id="input-rm"
                  disabled={isViewOnly}
                  testId="input-rm"
                  label="Nama Staff"
                  placeholder="Pilih Nama Staff"
                  dropdownList={rmDropdownList}
                  value={valueRm}
                  isLoading={isLoadingRmData}
                  onChange={(val) => {
                    console.log('val', val);
                    if (rmDropdownList && rmDropdownList.length > 0) {
                      if (val.id === '') {
                        setValue('anotherInformation.rm', null);
                        setValueRm(null);
                      } else {
                        setValue('anotherInformation.rm', { label: val.label, value: String(val.id) });
                        setValueRm(val);
                      }
                    }
                  }}
                  hasDataMaster={findDataMaster('rmId', rmDropdownList)}
                  // isMandatory
                />
              );
            }
            }
          />
        </Box>
      </SectionTitle>

      <SectionTitle title="Informasi Co-Borrower" isOpen>
        {/* <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
            paddingY: theme.spacing(3),
          }}
        >
          <Controller
            name="coBorrowerStatus"
            control={control}
            disabled={isViewOnly}
            render={({ field }) =>
              <Input
                {...field}
                label="Co Borrower Status"
                placeholder="Masukkan Co Borrower Status"
                type="dropdown"
                dropdownList={[
                  { label: 'Ya', value: 'yes' },
                  { label: 'Tidak', value: 'no' }
                ]}
              />
            }
          />
        </Box> */}
        <BaseContainer>
          {/* <Table
            tableHeader={TableHeaderCoBorrower}
            tableData={TableDataCoBorrower}
            footer={
              <RowWrapper sx={{ justifyContent: 'end', mb: 3 }}>
                <Button
                  variant="outlined"
                  startIcon="add-2"
                  startIconSx={{ fontSize: theme.spacing(3) }}
                  sx={{ height: theme.spacing(6), padding: theme.spacing(1) }}
                  onClick={() => {}}
                >
                  Add New
                </Button>
              </RowWrapper>
            }
            pageSize={5}
            totalPage={1}
            currentPage={1}
          /> */}
          <EmptyPlaceholder status="coming-soon" />

        </BaseContainer>
      </SectionTitle>
      <Box
        sx={{
          display: 'grid',
          gridGap: theme.spacing(3),
          gridTemplateColumns: 'repeat(2, 1fr)',
        }}
      >
        <Controller
          name="anotherInformation.modifiedBy"
          control={control}
          disabled={!isViewOnly}
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
          name="anotherInformation.modifiedDate"
          control={control}
          disabled={!isViewOnly}
          render={({ field }) => {
            field.value = formatDateTime(field.value);
            return (
              <Input
                {...field}
                label="Last Modified"
                placeholder="Last Modified"
                type="text"
                disabled
              />
            );
          }
          }
        />
      </Box>


      <ActionFooterDetail
        handleSave={handleSave}
        isAutoSaveFetching={isAutoSaveFetching}
        viewOnly={isViewOnly}
        onChange={(value) => {
          if (value) {
            setIsSubmit(value);
            handleSave();
          }
        }}
      />

      <ModalDef
        id={modal.PLAFON_VALIDATION}
        component={ModalPlafonValidation}
      />
    </ColumnWrapper>
  );
};

export default OtherCommonInformation;
