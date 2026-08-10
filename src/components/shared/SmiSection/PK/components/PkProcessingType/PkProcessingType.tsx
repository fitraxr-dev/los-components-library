import { ModalDef } from '@ebay/nice-modal-react';
import { useTheme, useMediaQuery } from '@mui/material';

import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import IconButton from '@/components/shared/IconButton';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import Table from '@/components/shared/Table';
import TableFooter from '@/components/shared/TableFooter';
import Title from '@/components/shared/Title';
import VStack from '@/components/shared/VStack';

import { MODALPK } from '../../PK.constants';
import ModalUploadDocumentProvision from '../ModalUploadDocumentProvision';

import usePkProcessingType from './PkProcessingType.hook';

import type { PkProcessingTypeProps } from '../../PK.types';


const PkProcessingType = (props: PkProcessingTypeProps) => {
  const {
    commercialDescriptionList,
    descriptionList,
    masintonChange,
    masintonForm,
    openModalPenandatanganan,
    openModalUploadEfektif,
    isEffectiveLoading,
    isSigningLoading,
    signingList,
    effectiveList,
    tableHeaderSignin,
    tableHeaderEffective,
    legalStatusList,
    isLegalSigning,
    isLpsCore,
    todayDate,
    handleNext,
    handleSave,
    isMandatoryPK,
    isMandatoryLS,
    isAwaiting,
    isSaveLoading,
    formatTableHeader,
    viewOnly,
    isAutoSaveFetching,
    isStaff,
    handleEdit,
    handleSubmit,
    isDivisiBisnis,
    hasOther,
    isMaker,
  } = usePkProcessingType(props);

  const {
    pkDate,
    description,
    descriptionInformation,
    effectiveDate,
    effectiveConditions,
    pkNumber,
    nonCommercialDescription,
    pkName,
    signingConditions,
    commercialDescription,
    legalProcessStatusRequirement,
    otherLegalProcessStatusRequirement,
    otherCommercialDescription,
  } = masintonForm;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));


  return (
    <ColumnWrapper sx={{ gap: { sm: 3, xs: 2 } }}>
      <RowWrapper
        sx={{
          alignItems: 'center',
        }}
      >
        <Title title="PK Processing Type" />
        {((isMaker ? isMaker : isStaff) && viewOnly && (isMaker ? isMaker : isDivisiBisnis) && props?.isAskForInfo) && <IconButton iconName="edit-2" onClick={handleEdit} />}
      </RowWrapper>
      <RowWrapper
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            sm: 'repeat(2, 1fr)',
            xs: '1fr',
          },
        }}
      >
        <Input
          // selalu disabled
          disabled
          label="Nama PK"
          type="text"
          placeholder="Input nama PK"
          error={pkName.error}
          helperText={pkName.error && pkName.errorMessage}
          value={pkName.value.replace(/-\d+$/, '')}
          onChange={(val) => masintonChange('pkName', val)}
        />

        <Input
          isMandatory={isLegalSigning}
          disabled={!isLegalSigning || viewOnly}
          label="No PK/Adendum"
          type="text"
          placeholder="Input no PK/Adendum"
          value={pkNumber.value}
          onChange={(val) => masintonChange('pkNumber', val)}
          error={pkNumber.error}
          helperText={pkNumber.error && pkNumber.errorMessage}
        />

        <Input
          isMandatory={(isLegalSigning && !isAwaiting && effectiveConditions.value === true)}
          minDate={todayDate}
          disabled={!isLegalSigning || viewOnly || isAwaiting}
          type="date"
          label="Tanggal Efektif"
          placeholder="Tanggal Efektif"
          value={effectiveDate.value}
          onChange={(val) => masintonChange('effectiveDate', val?.toISOString())}
          error={(isLegalSigning && !isAwaiting) ? effectiveDate.error : false}
          helperText={(isLegalSigning && !isAwaiting) ? effectiveDate.error && effectiveDate.errorMessage : ''}
        />

        <Input
          isMandatory={isLegalSigning}
          minDate={todayDate}
          disabled={!isLegalSigning || viewOnly}
          type="date"
          label="Tanggal Tanda Tangan  PK/Adendum"
          placeholder="Tanggal PK/Adendum"
          value={pkDate.value}
          onChange={(val) => masintonChange('pkDate', val?.toISOString())}
          error={pkDate.error}
          helperText={pkDate.error && pkDate.errorMessage}
        />
        <VStack>
          <Input
            isMandatory={!isLegalSigning}
            label="Deskripsi"
            placeholder="Pilih deskripsi"
            disabled={isLegalSigning || viewOnly}
            type="dropdown"
            dropdownList={descriptionList}
            value={description.value}
            onChange={(val) => masintonChange('description', val)}
            error={description.error}
            helperText={description.error && description.errorMessage}
          />
          <VStack top="10px">
            {description.value === 'NON_KOMERSIAL' && (
              <Input
                isMandatory={!isLegalSigning}
                label="Keterangan Deskripsi"
                placeholder="Non Komersial"
                type="text"
                disabled={isLegalSigning || viewOnly}
                value={nonCommercialDescription.value}
                onChange={(val) => masintonChange('nonCommercialDescription', val)}
                error={nonCommercialDescription.error}
                helperText={nonCommercialDescription.error && nonCommercialDescription.errorMessage}
              />
            )}
          </VStack>
          {description.value === 'KOMERSIAL' && (
            <Input
              isMandatory={!isLegalSigning}
              label="Keterangan Deskripsi"
              sx={{
                '& .MuiSvgIcon-root': { fontSize: 12 },
                display: 'grid',
                gridTemplateColumns: {
                  sm: 'repeat(2, 1fr)',
                  xs: '1fr',
                },
                mt: 2,
              }}
              type="checkbox"
              size="small"
              disabled={isLegalSigning || viewOnly}
              checkboxList={commercialDescriptionList}
              value={commercialDescription.value}
              onChange={(val) => masintonChange('commercialDescription', val)}
              error={commercialDescription.error}
              helperText={commercialDescription.error && commercialDescription.errorMessage}
            />
          )}

          {(description.value === 'KOMERSIAL' && hasOther) && (
            <Input
              label="Other Description"
              placeholder="Fill other text.."
              type="text"
              isMandatory={!isLegalSigning}
              disabled={isLegalSigning || viewOnly}
              value={otherCommercialDescription.value}
              onChange={(val) => masintonChange('otherCommercialDescription', val)}
              error={otherCommercialDescription.error}
              helperText={otherCommercialDescription.error && otherCommercialDescription.errorMessage}
            />
          )}
        </VStack>
        <Input
          isMandatory={!isLegalSigning}
          label="Keterangan"
          type="area"
          rows={4}
          disabled={isLegalSigning || viewOnly}
          value={descriptionInformation.value}
          onChange={(val) => masintonChange('descriptionInformation', val)}
          error={descriptionInformation.error}
          helperText={descriptionInformation.error && descriptionInformation.errorMessage}
        />
      </RowWrapper>
      <BaseContainer sx={{ border: 1, borderColor: theme.palette.custom.gray30 }}>
        <RowWrapper>
          <Input
            isMandatory={!isLegalSigning}
            disabled={isLegalSigning || viewOnly}
            type="radio"
            label="Syarat Penandatanganan"
            position="horizontal"
            value={signingConditions.value}
            onChange={(val) => masintonChange('signingConditions', val.target.value === 'true')}
            radioList={[
              {
                label: 'Ya',
                value: true,
              },
              {
                label: 'Tidak',
                value: false,
              }
            ]}
          />
        </RowWrapper>
        {signingConditions.value && (
          <BaseContainer sx={{ boxShadow: 7 }}>
            <Table
              maxHeight={isMobile ? '50vh' : '42vh'}
              tableHeader={formatTableHeader(tableHeaderSignin)}
              tableData={signingList}
              isLoading={isSigningLoading}
              footer={!(isLegalSigning || viewOnly) &&
                <TableFooter onClick={openModalPenandatanganan} />}
            />
          </BaseContainer>
        )}
      </BaseContainer>
      <BaseContainer sx={{ border: 1, borderColor: theme.palette.custom.gray30 }}>
        <RowWrapper>
          <Input
            isMandatory={isLegalSigning}
            disabled={!isLegalSigning || viewOnly}
            type="radio"
            label="Syarat Efektif"
            position="horizontal"
            value={effectiveConditions.value}
            onChange={(val) => masintonChange('effectiveConditions', val.target.value === 'true')}
            radioList={[
              {
                label: 'Ya',
                value: true,
              },
              {
                label: 'Tidak',
                value: false,
              }
            ]}
          />
        </RowWrapper>
        {effectiveConditions.value && (
          <BaseContainer
            sx={{
              boxShadow: 7,
              overflow: 'auto',
              p: isMobile ? 0.5 : undefined,
            }}
          >
            <Table
              maxHeight={isMobile ? '50vh' : '42vh'}
              tableHeader={formatTableHeader(tableHeaderEffective)}
              tableData={effectiveList}
              isLoading={isEffectiveLoading}
              footer={!isLegalSigning && !viewOnly && effectiveConditions.value === true &&
                <TableFooter onClick={openModalUploadEfektif} />}
            />
          </BaseContainer>
        )}
      </BaseContainer>

      {/* tunggu konfirm SA apakah pake Syarat Status Proses Legal*/}
      <RowWrapper
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: {
            sm: 'repeat(2, 1fr)',
            xs: '1fr',
          },
        }}
      >
        <VStack>
          <Input
            isMandatory={isLegalSigning}
            disabled={viewOnly || !isLegalSigning}
            label="Syarat Status Proses Legal"
            placeholder="Syarat Status Proses Legal.."
            type="dropdown"
            dropdownList={legalStatusList}
            value={legalProcessStatusRequirement.value}
            onChange={(val) => masintonChange('legalProcessStatusRequirement', val)}
            error={legalProcessStatusRequirement.error}
            helperText={legalProcessStatusRequirement.error && legalProcessStatusRequirement.errorMessage}
          />
          {legalProcessStatusRequirement.value === 'OTHER' &&
            <VStack top="10px" >
              <Input
                disabled={viewOnly || !isLegalSigning}
                label="Other Status Proses Legal"
                placeholder="Other Status Proses Legal.."
                value={otherLegalProcessStatusRequirement.value}
                isMandatory
                onChange={(val) => { masintonChange('otherLegalProcessStatusRequirement', val); }}
              // error={otherLegalProcessStatusRequirement.error}
              // helperText={otherLegalProcessStatusRequirement.error
              // && otherLegalProcessStatusRequirement.errorMessage}
              />
            </VStack>
          }
        </VStack>
      </RowWrapper>

      <ModalDef
        id={MODALPK.MODAL_DOCUMENT_PROVISION}
        component={ModalUploadDocumentProvision}
      />
      <RowWrapper sx={{ gap: 2, justifyContent: 'end', mt: 3, py: 3 }}>
        {!viewOnly && (
          <Button
            onClick={handleSave}
            isLoading={isSaveLoading}
            disabled={isAutoSaveFetching || isLegalSigning ? isMandatoryLS : isMandatoryPK}
          >
            {isAutoSaveFetching ? 'Auto Save ...' : 'Save'}
          </Button>
        )}

        <Button
          onClick={handleNext}
          isLoading={isSaveLoading}
          disabled={!viewOnly && (!isLegalSigning ? isMandatoryLS : isMandatoryPK)}
        >
          Next
        </Button>

        {props?.isAskForInfo && !viewOnly &&
          <Button
            onClick={handleSubmit}
            isLoading={isSaveLoading}
            disabled={isLegalSigning ? isMandatoryLS : isMandatoryPK}
            variant="contained"
            color="success"
            sx={{ width: { sm: 'auto', xs: '100%' } }}
          >
            Submit
          </Button>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default PkProcessingType;
