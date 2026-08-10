'use client';

import { ModalDef } from '@ebay/nice-modal-react';
import {
  Box,
  FormControlLabel,
  Radio,
  RadioGroup,
  useTheme,
} from '@mui/material';

import { TypeModule, TypeProcess } from '@/enums/Module';

import { useAnnualReviewContext } from '@/components/layouts/AnnualReviewLayout/AnnualReview.context';
import BaseContainer from '@/components/shared/BaseContainer';
import Button from '@/components/shared/Button';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Input from '@/components/shared/Input';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
//import TableOthersSpecialApproval from '@/components/shared/SmiTable/SpecialApproval/TableOthersSpecialApproval';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import Table from '@/components/shared/Table';
import TextStyle from '@/components/shared/TextStyle';
import Title from '@/components/shared/Title';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { modal } from './CddImplementation.constants';
import useCddImplementation from './CddImplementation.hook';
import ModalCddDetail from './components/ModalCddDetail/ModalCddDetail';


const CddImplementationPage = () => {
  const {
    checkboxList,
    goToNextStep,
    tableHeader,
    theme,
    typeProcess,
    cddListData,
  } = useCddImplementation();
  const { isDepiDivision } = useAnnualReviewContext();

  return (
    <ColumnWrapper gap={theme.spacing(3)}>
      {isDepiDivision && <ConfirmationLatest />}
      <RowWrapper justifyContent="space-between" alignItems="center" >
        <Title title="Penerapan Customer Due Diligence (CDD)" />
      </RowWrapper>
      <ColumnWrapper gap={theme.spacing(3)}>
        <TableDebtorInformation module={TypeModule.ANNUAL_REVIEW} process={typeProcess} />
      </ColumnWrapper>

      <SectionTitle title="Penerapan Customer Due Diligence (CDD)" />
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
              sx={{ gap: 0 }}
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

      <BaseContainer
        sx={{
          borderRadius: theme.radius(1),
          boxShadow: 2,
          padding: theme.spacing(2),
        }}
      >
        <Table
          tableHeader={tableHeader}
          tableData={cddListData?.data?.contents || []}
        />
      </BaseContainer>
      <RowWrapper justifyContent="end" gap={theme.spacing(3)}>
        <Button
          onClick={goToNextStep}
        >
          Next
        </Button>
      </RowWrapper>

      <ModalDef
        id={modal.MODAL_CDD_DETAIL}
        component={ModalCddDetail}
      />
    </ColumnWrapper >
  );
};

export default CddImplementationPage;
