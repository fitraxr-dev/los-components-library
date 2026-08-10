'use client';
import { Box } from '@mui/material';

import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import Text from '@/components/shared/Input/components/Text';
import RowWrapper from '@/components/shared/RowWrapper';
import TextStyle from '@/components/shared/TextStyle';
import WordEditor from '@/components/shared/WordEditor';

import { useRiskProfileDetail } from './riskProfileDetail.hook';


const RiskProfileDetailPage = () => {
  const {
    containerDescription,
    containerMitigation,
    handleSave,
    contentRiskProfileDetail,
    setContainerDes,
    setContainerMit,
    typeRisksList,
    isLoading,
    isSaveLoading,
    handleCancel,
    masintonChange,
    masintonForm,
    viewOnly,
    handleBack,
  } = useRiskProfileDetail();

  const {
    valueTypeRisks,
    otherRisk,
  } = masintonForm;


  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ColumnWrapper sx={{ borderBottom: '0.5px solid', borderColor: '#e0e0e0', py: 3 }}>
        <RowWrapper sx={{ justifyContent: 'center' }}>
          <TextStyle
            variant="body1"
            sx={{
              fontWeight: '600',
            }}
            color="#284A63"
          >
            Profil Risiko
          </TextStyle >
        </RowWrapper>
      </ColumnWrapper>
      <Box
        sx={{ display: 'grid', gap: 2, gridTemplateRows: 'repeat(1, 1fr)' }}
      >
        <Input
          isMandatory
          id="input-request-type"
          data-testid="input-request-type"
          type="dropdown"
          label="Jenis Risiko"
          placeholder="Input Jenis Risiko"
          value={valueTypeRisks?.value}
          onChange={(e) => masintonChange('valueTypeRisks', e)}
          dropdownList={typeRisksList}
          error={valueTypeRisks.error}
          helperText={valueTypeRisks.error && valueTypeRisks.errorMessage}
          disabled={viewOnly}
        />
        {
          valueTypeRisks?.value === 'OTHER_RISK_DEPI' && (
            <Input
              placeholder="Input Jenis Resiko"
              type="text"
              onChange={(e) => masintonChange('otherRisk', e)}
              value={otherRisk?.value}
              error={otherRisk.error}
              helperText={otherRisk.error && otherRisk.errorMessage}
              disabled={viewOnly}
            />
          )}
      </Box>
      <ColumnWrapper sx={{ py: 3 }}>
        <Text>
          Deskripsi Risiko
        </Text>
        <WordEditor
          id="descriptionDepi"
          container={containerDescription}
          setContainer={setContainerDes}
          isLoading={isLoading || isSaveLoading}
          initialValue={contentRiskProfileDetail?.description}
          isReadOnly={viewOnly}
        />
      </ColumnWrapper>
      <ColumnWrapper sx={{ py: 3 }}>
        <Text>
          Mitigasi Risiko
        </Text>
        <WordEditor
          id="mitigationRiskDepi"
          container={containerMitigation}
          setContainer={setContainerMit}
          isLoading={isLoading || isSaveLoading}
          initialValue={contentRiskProfileDetail?.mitigation}
          isReadOnly={viewOnly}
        />
      </ColumnWrapper>
      <RowWrapper sx={{ gap: '15px', justifyContent: 'end', py: 3 }}>
        {
          viewOnly ?
            <>
              <Button
                onClick={handleBack}
              >
                Close
              </Button>
            </> :
            <>
              <Button
                variant="outlined"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button
                isLoading={isSaveLoading}
                onClick={() => handleSave(containerDescription, containerMitigation)}
              >
                Save
              </Button>
            </>
        }
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default RiskProfileDetailPage;
