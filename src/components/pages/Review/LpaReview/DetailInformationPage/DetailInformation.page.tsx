'use client';
import NiceModal, { ModalDef } from '@ebay/nice-modal-react';
import { Box, TableCell, useTheme } from '@mui/material';

import { formatCurrency } from '@/helpers/formatCurrency';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RadioButton from '@/components/shared/Input/components/RadioButton';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from './components/ConfirmationLatest';
import ModalAddExistingCollateral from './components/ModalAddExistingCollateral';
import ModalAddNewCollateral from './components/ModalAddNewCollateral';
import { modal } from './DetailInformation.constants';
import useDetailInformation from './DetailInformation.hook';


const DetailInformationPage = () => {
  const theme = useTheme();

  const {
    viewOnly,
    totalMaxReconciliationInput,
    container,
    setContainer,
    totalApproachValueData,
    reconciliationCalculated,
    collateralDetailTableHeader,
    totalApproachValueTableHeader,
    reconciliationTableHeader,
    register,
    filter,
    setFilter,
    handleSubmitData,
    handleSubmit,
    watchFields,
    setValue,
    getCollateralData,
    handleCloseButton,
    handleAddNewCollateral,
    collateralDataIsLoading,
    isPending,
    approachMethodology,
    handleCheckApproachMethodology,
    handleRoundedMarketValueChange,
    handleRoundedLiquidationChange,
    filterContentList,
    filterDropdownList,
    changeBgInput,
    findDataMaster,
    getDataLabel,
    needCheckMaster,
  } = useDetailInformation();

  return (
    <>
      <ColumnWrapper sx={{ gap: 3 }}>
        {/* <ConfirmationLatest /> */}
        <Title title="Detail Informasi LPA" />

        <Box
          sx={{
            display: 'grid',
            gridGap: theme.spacing(3),
            gridTemplateColumns: 'repeat(2, 1fr)',
          }}
        >
          <Input
            label="Nama KJPP"
            placeholder="Input nama KJPP"
            value={watchFields.kjpp}
            {...(register('kjpp') as any)}
            onChange={(data) => setValue('kjpp', data, { shouldDirty: true })}
            disabled={viewOnly}
            sx={{
              backgroundColor: changeBgInput('kjpp'),
            }}
            hasDataMaster={needCheckMaster ? findDataMaster('kjpp') : undefined}
          />
          <Input
            label="Nomor Laporan"
            placeholder="Input nomor laporan"
            value={watchFields.reportNo}
            {...(register('reportNo') as any)}
            onChange={(data) => setValue('reportNo', data, { shouldDirty: true })}
            disabled={viewOnly}
            sx={{
              backgroundColor: changeBgInput('reportNo'),
            }}
            hasDataMaster={needCheckMaster ? findDataMaster('reportNo') : undefined}
          />
          <Input
            type="date"
            label="Tanggal Laporan"
            value={watchFields.reportDate}
            {...(register('reportDate') as any)}
            onChange={(data) => setValue('reportDate', data, { shouldDirty: true })}
            disabled={viewOnly}
            sx={{
              backgroundColor: changeBgInput('reportDate'),
            }}
            hasDataMaster={needCheckMaster ? findDataMaster('reportDate') : undefined}
          />
          <Input
            type="date"
            label="Tanggal Penilaian"
            value={watchFields.assessmentDate}
            {...(register('assessmentDate') as any)}
            onChange={(data) => setValue('assessmentDate', data, { shouldDirty: true })}
            disabled={viewOnly}
            sx={{
              backgroundColor: changeBgInput('assessmentDate'),
            }}
            hasDataMaster={needCheckMaster ? findDataMaster('assessmentDate') : undefined}
          />
          <Input
            type="date"
            label="Tanggal Inspeksi (Site Visit)"
            value={watchFields.siteVisitDate}
            {...(register('siteVisitDate') as any)}
            onChange={(data) => setValue('siteVisitDate', data, { shouldDirty: true })}
            disabled={viewOnly}
          />
          <Input
            label="Tujuan Penilaian"
            placeholder="Input tujuan penilaian"
            value={watchFields.assessmentPurpose}
            {...(register('assessmentPurpose') as any)}
            onChange={(data) => setValue('assessmentPurpose', data, { shouldDirty: true })}
            disabled={viewOnly}
          />
        </Box>

        <ColumnWrapper
          sx={{
            alignItems: 'center',
            backgroundColor: theme.palette.custom.blueGray,
            borderRadius: theme.spacing(2),
            padding: theme.spacing(2),
          }}
        >
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.primary.main}
          >
            Pendekatan yang digunakan
          </TextStyle>
          <Input
            type="checkbox"
            checkboxList={[
              { label: 'Pendekatan Pendapatan', value: 'PENDEKATAN_PENDAPATAN' },
              { label: 'Pendekatan Biaya', value: 'PENDEKATAN_BIAYA' },
              { label: 'Pendekatan Pasar', value: 'PENDEKATAN_PASAR' },
            ]}
            inputSx={{ color: theme.palette.primary.main, fontWeight: 500 }}
            value={approachMethodology}
            onChange={(data) => handleCheckApproachMethodology(data)}
            disabled={viewOnly}
          />
        </ColumnWrapper>

        {approachMethodology.length > 0 && (
          <ColumnWrapper sx={{ gap: 2 }}>
            <TextStyle
              variant="body4"
              weight={500}
              color={theme.palette.primary.main}
            >
              Rekonsiliasi?
            </TextStyle>
            <RadioButton
              label={null}
              value={watchFields.reconciliation}
              {...(register('reconciliation') as any)}
              onChange={(data) => setValue('reconciliation', data.target.value, { shouldDirty: true })}
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
              sx={{ flex: 1 }}
              disabled={viewOnly}
            />
          </ColumnWrapper>
        )}

        <Input
          label="Keterangan"
          placeholder="Input Keterangan"
          type="area"
          rows={4}
          value={watchFields.remarkReconciliation || ''}
          {...(register('remarkReconciliation') as any)}
          onChange={(data) => setValue('remarkReconciliation', data, { shouldDirty: true })}
          disabled={viewOnly}
        />

        <ColumnWrapper
          sx={{
            alignItems: 'center',
            backgroundColor: theme.palette.custom.blueGray,
            borderRadius: theme.spacing(2),
            padding: theme.spacing(2),
          }}
        >
          <TextStyle
            variant="body4"
            weight={500}
            color={theme.palette.primary.main}
          >
            Termasuk Daftar KJPP Rekanan SMI?
          </TextStyle>
          <RadioButton
            label={null}
            value={watchFields.isIncludedInKjppPartner}
            {...(register('isIncludedInKjppPartner') as any)}
            onChange={(data) => setValue('isIncludedInKjppPartner', data.target.value, { shouldDirty: true })}
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
            sx={{ flex: 1 }}
            disabled={viewOnly}
          />
        </ColumnWrapper>
        <Input
          label="Keterangan"
          placeholder="Input Keterangan"
          type="area"
          rows={4}
          value={watchFields.remarkIncludedInKjppPartner || ''}
          {...(register('remarkIncludedInKjppPartner') as any)}
          onChange={(data) => setValue('remarkIncludedInKjppPartner', data, { shouldDirty: true })}
          disabled={viewOnly}
        />

        <SectionTitle title="Detail Agunan" isOpen>
          <Box width="100%">
            <Input
              type="search"
              value={filter}
              onChange={setFilter}
              placeholder="Pencarian..."
              dropdownList={filterDropdownList}
              contentList={filterContentList}
            />
          </Box>
          <Table
            isPaper
            tableHeader={collateralDetailTableHeader}
            isLoading={collateralDataIsLoading}
            tableData={getCollateralData?.contents}
            // renderAdditonalRow={() => (
            //   <>
            //     <TableCell colSpan={2}>
            //       <TextStyle
            //         variant="body4"
            //         weight={600}
            //         color={theme.palette.primary.main}
            //       >
            //         Total
            //       </TextStyle>
            //     </TableCell>
            //     <TableCell>
            //       <TextStyle
            //         variant="body4"
            //         weight={600}
            //         color={theme.palette.primary.main}
            //       >
            //         {getCollateralData?.totalIndicationLiquidationValue}
            //       </TextStyle>
            //     </TableCell>
            //     <TableCell>
            //       <TextStyle
            //         variant="body4"
            //         weight={600}
            //         color={theme.palette.primary.main}
            //       >
            //         {getCollateralData?.totalMarketValue}
            //       </TextStyle>
            //     </TableCell>
            //   </>
            // )}
            footer={!viewOnly ?
              <TableFooter onClick={handleAddNewCollateral} /> :
              null
            }
          />
        </SectionTitle>

        <SectionTitle title="Summary Nilai Agunan" isOpen>
          <Box
            sx={{
              display: 'grid',
              gridGap: theme.spacing(3),
              gridTemplateColumns: 'repeat(2, 1fr)',
              mt: theme.spacing(3),
            }}
          >
            <Input
              label="Summary Nilai Pasar"
              placeholder="Input Summary Nilai Pasar"
              value={watchFields.summaryMarketValue ? formatCurrency(watchFields.summaryMarketValue.toString()) : ''}
              onChange={(data) => setValue('summaryMarketValue', data)}
              disabled={true}
            />
            <Input
              label="Summary Indikasi Nilai Likuidasi"
              placeholder="InputSummary Indikasi Nilai Likuidasi"
              value={watchFields.summaryLiquidation ? formatCurrency(watchFields.summaryLiquidation.toString()) : ''}
              onChange={(data) => setValue('summaryLiquidation', data)}
              disabled={true}
            />
            <Input
              label="Summary Nilai Pasar (Pembulatan)"
              placeholder="Input Summary Nilai Pasar (Pembulatan)"
              value={watchFields.roundedMarketValue || ''}
              onChange={(data) => handleRoundedMarketValueChange(data)}
              disabled={viewOnly}
            />
            <Input
              label="Summary Indikasi Nilai Likuidasi (Pembulatan)"
              placeholder="Input Summary Indikasi Nilai Likuidasi (Pembulatan)"
              value={watchFields.roundedLiquidation || ''}
              onChange={(data) => handleRoundedLiquidationChange(data)}
              disabled={viewOnly}
            />
          </Box>
        </SectionTitle>

        <SectionTitle title="Total Nilai dari Objek Penilaian" isOpen>
          <Table
            isPaper
            tableHeader={totalApproachValueTableHeader}
            tableData={totalApproachValueData.filter((row) =>
              approachMethodology.includes(row.approachMethodology)
            )}
          />
        </SectionTitle>

        {((approachMethodology.length > 0 && (watchFields.reconciliation === true || watchFields.reconciliation === 'true'))) && (
          <SectionTitle
            title={`Rekonsiliasi Pendekatan ${approachMethodology.length === 2
              ? approachMethodology.map((method) => {
                switch (method) {
                  case 'PENDEKATAN_PENDAPATAN':
                    return 'Pendapatan';
                  case 'PENDEKATAN_BIAYA':
                    return 'Biaya';
                  case 'PENDEKATAN_PASAR':
                    return 'Pasar';
                  default:
                    return method;
                }
              }).join(' dan ')
              : approachMethodology.map((method) => {
                switch (method) {
                  case 'PENDEKATAN_PENDAPATAN':
                    return 'Pendapatan';
                  case 'PENDEKATAN_BIAYA':
                    return 'Biaya';
                  case 'PENDEKATAN_PASAR':
                    return 'Pasar';
                  default:
                    return method;
                }
              }).join(', ').replace(/,([^,]*)$/, ' dan$1')}`}
            isOpen
          >
            <Table
              isPaper
              tableHeader={reconciliationTableHeader}
              tableData={totalApproachValueData.filter((row) =>
                approachMethodology.includes(row.approachMethodology)
              )}
              renderAdditonalRow={() => (
                <>
                  <TableCell colSpan={1}>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.main}
                    >
                      Total Nilai Rekonsiliasi {approachMethodology.length === 2
                        ? approachMethodology.map((method) => {
                          switch (method) {
                            case 'PENDEKATAN_PENDAPATAN':
                              return 'Pendapatan';
                            case 'PENDEKATAN_BIAYA':
                              return 'Biaya';
                            case 'PENDEKATAN_PASAR':
                              return 'Pasar';
                            default:
                              return method;
                          }
                        }).join(' dan ')
                        : approachMethodology.map((method) => {
                          switch (method) {
                            case 'PENDEKATAN_PENDAPATAN':
                              return 'Pendapatan';
                            case 'PENDEKATAN_BIAYA':
                              return 'Biaya';
                            case 'PENDEKATAN_PASAR':
                              return 'Pasar';
                            default:
                              return method;
                          }
                        }).join(', ').replace(/,([^,]*)$/, ' dan$1')}
                    </TextStyle>
                  </TableCell>
                  <TableCell >
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.error.main}
                    >
                      {totalMaxReconciliationInput > 100 ? 'Total Bobot melebihi dari 100 persen' : null}
                    </TextStyle>
                  </TableCell>
                  <TableCell>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.main}
                    >
                      {formatCurrency(Object.keys(reconciliationCalculated).reduce(
                        (total, key) => (total + reconciliationCalculated[key].marketValue), 0
                      ).toFixed(2))}
                    </TextStyle>
                  </TableCell>
                  <TableCell>
                    <TextStyle
                      variant="body4"
                      weight={600}
                      color={theme.palette.primary.main}
                    >
                      {formatCurrency(Object.keys(reconciliationCalculated).reduce(
                        (total, key) => (total + reconciliationCalculated[key].liquidationValue), 0
                      ).toFixed(2))}
                    </TextStyle>
                  </TableCell>
                </>
              )}
            />
          </SectionTitle>
        )}

        <SectionTitle title="Informasi Pendekatan Yang Digunakan" />
        <WordEditor
          container={container}
          setContainer={setContainer}
          initialValue={watchFields?.approachInformation}
          isReadOnly={viewOnly}
        />

        <RowWrapper sx={{ justifyContent: 'end', py: 3 }}>
          {viewOnly ?
            <Button
              onClick={handleCloseButton}
              disabled={totalMaxReconciliationInput > 100}
            >
              Close
            </Button> :
            <Button
              isLoading={isPending}
              onClick={handleSubmit(handleSubmitData)}
              disabled={totalMaxReconciliationInput > 100}
            >
              Save
            </Button>
          }
        </RowWrapper>
      </ColumnWrapper>

      <ModalDef
        id={modal.ADD_EXISTING_COLLATERAL}
        component={ModalAddExistingCollateral}
      />
      <ModalDef
        id={modal.ADD_NEW_COLLATERAL}
        component={ModalAddNewCollateral}
      />
    </>
  );

};


export default DetailInformationPage;
