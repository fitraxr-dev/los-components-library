'use client';

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useMUPContext } from '@/components/layouts/MUPLayout/MUP.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableOthersSpecialApproval from '@/components/shared/SmiTable/SpecialApproval/TableOthersSpecialApproval';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import useCddImplementation from './CddImplementation.hook';


const CddImplementationPage = () => {
  const theme = useTheme();
  const { checkboxList } = useCddImplementation();
  const { goToNextStep } = useMUPContext();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <RowWrapper justifyContent="space-between" alignItems="center" >
        <Title title="Penerapan Customer Due Diligence (CDD)" />
      </RowWrapper>
      <ColumnWrapper gap={theme.spacing(3)}>
        <TableDebtorInformation module={TypeModule.MUP} process={TypeProcess.MUP} />
      </ColumnWrapper>

      <SectionTitle title="Penerapan Customer Due Diligence (CDD)" isOpen sx={{ mb: 2 }}>
        <RowWrapper display="flex" gap={theme.spacing(2)} justifyContent="space-between">
          <ColumnWrapper sx={{ width: '65%' }} py={theme.spacing(1)}>
            <BaseContainer
              sx={{
                borderRadius: '16px',
                boxShadow: '0px 0.625vw 2.6vw 0px rgba(22, 26, 130, 0.14)',
                padding: '0.1vw',
              }}
            >
              <Input
                type="checkbox"
                checkboxList={checkboxList}
                value={['EnhancedDueDiligence']}
                disabled
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                  gap: theme.spacing(3),
                  justifyContent: 'center',
                  padding: theme.spacing(1),
                }}
              />
            </BaseContainer>
          </ColumnWrapper>
          <ColumnWrapper sx={{ width: '35%' }} py={theme.spacing(1)}>
            <BaseContainer
              sx={{
                borderRadius: '16px',
                boxShadow: '0px 0.625vw 2.6vw 0px rgba(22, 26, 130, 0.14)',
                display: 'flex',
                flexDirection: 'row',
                gap: 2,
                justifyContent: 'center',
                paddingBottom: 0,
                paddingTop: 0,
              }}
            >
              <Box display="flex" alignItems="center">
                <TextStyle sx={{ color: '#ABABAB' }} variant="body4">
                  High Risk
                </TextStyle>
              </Box>
              <RadioGroup
                sx={{
                  alignItems: 'center',
                  display: 'flex',
                  flexDirection: 'row',
                  height: '100%',
                }}
                value="yes"
              >
                {[
                  { label: 'Ya', value: 'yes' },
                  { label: 'Tidak', value: 'no' }
                ].map((data, index) => {
                  return (
                    <FormControlLabel
                      sx={{
                        '& .MuiFormControlLabel-label': {
                          marginLeft: '4px',
                          marginRight: '8px',
                        },
                        alignItems: 'center',
                        margin: 0,
                      }}
                      control={
                        <Radio
                          sx={{
                            '& .MuiSvgIcon-root': {
                              fontSize: theme.typography.body4.fontSize,
                            },
                            alignItems: 'center',
                            color: theme.palette.primary.main,
                            display: 'flex',
                            padding: '2px',
                          }}
                        />
                      }
                      key={data.value}
                      label={
                        <TextStyle
                          variant="body4"
                          sx={{
                            alignItems: 'center',
                            color: '#ABABAB',
                            display: 'flex',
                            fontWeight: '600',
                            height: '100%',
                          }}
                        >
                          {data.label}
                        </TextStyle>
                      }
                      disabled
                      value={data.value}
                    />
                  );
                })}
              </RadioGroup>
            </BaseContainer>
          </ColumnWrapper>
        </RowWrapper >
      </SectionTitle>

      <TableOthersSpecialApproval module={TypeModule.MUP} process={TypeProcess.MUP} />

      <RowWrapper justifyContent="flex-end" mt={theme.spacing(2)}>
        <Button
          variant="contained"
          color="primary"
          onClick={goToNextStep}
        >
          Next
        </Button>
      </RowWrapper>

    </ColumnWrapper >
  );
};

export default CddImplementationPage;
