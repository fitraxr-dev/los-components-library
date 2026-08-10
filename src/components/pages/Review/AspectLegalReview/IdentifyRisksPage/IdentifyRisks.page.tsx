'use client';


import { TypeModule, TypeProcess } from '@/enums/Module';
import useIdentity from '@/hooks/useIdentity';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import AlertDifferentData from '@/components/shared/SmiComponent/AlertDifferentData';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';


import ConfirmationLatest from '../../components/ConfirmationLatest/ConfirmationLatest';

import { useIdentifyRisks } from './IdentifyRisks.hook';


const IdentifyLegalRisksPage = () => {

  const { processId } = useIdentity();
  const {
    containerDes,
    containerMit,
    handleSave,
    identifyDetail,
    setContainerDes,
    setContainerMit,
    typeRisksList,
    isLoading,
    isSaveLoading,
    handleCancel,
    masintonChange,
    masintonForm,
  } = useIdentifyRisks();

  const {
    valueTypeRisks,
    otherRisk,
  } = masintonForm;

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <AlertDifferentData
        bucketProcessId={processId}
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
        isReviewer={true}
        refetchInterval={5000}
      />
      <ConfirmationLatest
        module={TypeModule.MIP_REVIEW}
        process={TypeProcess.REVIEWER_DH}
      />
      <ColumnWrapper sx={{ borderBottom: '0.5px solid', borderColor: '#e0e0e0', py: 3 }}>
        <RowWrapper sx={{ justifyContent: 'center' }}>

          <TextStyle

            variant="body1"
            sx={{
              fontWeight: '600',
            }}
            color="#284A63"
          >
            Identifikasi Resiko
          </TextStyle >
        </RowWrapper>
      </ColumnWrapper>
      <ColumnWrapper sx={{ gap: 3 }}>
        <Input
          isMandatory
          id="input-request-type"
          data-testid="input-request-type"
          type="dropdown"
          label="Jenis Risiko"
          placeholder="Input Jenis Risiko"
          value={valueTypeRisks?.value}
          onChange={(e) => masintonChange('valueTypeRisks', e)}
          error={valueTypeRisks.error}
          helperText={valueTypeRisks.error && valueTypeRisks.errorMessage}
          dropdownList={typeRisksList}
        />
        {
          valueTypeRisks?.value === 'OTHER_RISK_DH' && (
            <Input
              placeholder="Input Jenis Resiko"
              type="text"
              onChange={(e) => masintonChange('otherRisk', e)}
              value={otherRisk?.value}
              error={otherRisk.error}
              helperText={otherRisk.error && otherRisk.errorMessage}
            />
          )}
        <ColumnWrapper sx={{ py: 3 }}>
          <Text isMandatory>
            Deskripsi Risiko
          </Text>
          <WordEditor
            id="descriptionRiskDh"
            container={containerDes}
            setContainer={setContainerDes}
            isLoading={isLoading || isSaveLoading}
            initialValue={identifyDetail?.riskDescription}
          />
        </ColumnWrapper>
        <ColumnWrapper sx={{ py: 3 }}>
          <Text isMandatory>
            Mitigasi Risiko
          </Text>
          <WordEditor
            id="descriptionMitigationDh"
            container={containerMit}
            setContainer={setContainerMit}
            isLoading={isLoading || isSaveLoading}
            initialValue={identifyDetail?.riskMitigation}
          />
        </ColumnWrapper>
      </ColumnWrapper>
      <RowWrapper sx={{ gap: '30px', justifyContent: 'end', py: 3 }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
        >
          Cancel
        </Button>
        <Button
          isLoading={isSaveLoading}
          onClick={() => handleSave(containerDes, containerMit)}
        >
          Save
        </Button>
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default IdentifyLegalRisksPage;
