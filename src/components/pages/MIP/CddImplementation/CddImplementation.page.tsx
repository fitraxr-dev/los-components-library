'use client';

import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import BaseContainer from '@/components/shared/BaseContainer';
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

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      <RowWrapper justifyContent="space-between" alignItems="center" >
        <Title title="Penerapan Customer Due Diligence (CDD)" />
      </RowWrapper>
      <ColumnWrapper gap={theme.spacing(3)}>
        <TableDebtorInformation module={TypeModule.MIP} process={TypeProcess.MIP} />
      </ColumnWrapper>

      <SectionTitle title="Penerapan Customer Due Diligence (CDD)" />
      <RowWrapper display="flex" gap={theme.spacing(2)} justifyContent="space-between">
        <ColumnWrapper sx={{ width: '70%' }} py={theme.spacing(1)}>
          <BaseContainer
            sx={{
              alignItems: 'center',
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
              sx={{ gap: 0 }}
            />
          </BaseContainer>
        </ColumnWrapper>
        <ColumnWrapper sx={{ width: '30%' }} py={theme.spacing(1)}>
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
                display: 'flex',
                flexDirection: 'row',
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
                    }}
                    control={
                      <Radio
                        sx={{
                          '& .MuiSvgIcon-root': {
                            fontSize: theme.typography.body4.fontSize,
                          },
                          color: theme.palette.primary.main,
                        }}
                      />
                    }
                    key={index}
                    label={
                      <TextStyle variant="body4" weight={600}>
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

      <TableOthersSpecialApproval
        module={TypeModule.MIP}
        process={TypeProcess.MIP}
        showSectionTitle={false}
      />

    </ColumnWrapper >
  );
};

export default CddImplementationPage;
