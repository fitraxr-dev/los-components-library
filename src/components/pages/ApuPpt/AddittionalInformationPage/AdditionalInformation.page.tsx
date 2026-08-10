'use client';


import { useTheme } from '@mui/material';

import { TypeModule } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import SectionTitle from '@/components/shared/SectionTitle';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import { useAdditionalInformation } from './AdditionalInformation.hook';


const AdditionalInformationPage = () => {
  const theme = useTheme();

  const {
    renderActionButtons,
    additionalInformationDetail,
    process,
    setContainer,
    container,
    isLoading,
    viewOnly,
    isSynfunsionDisabled,
    isDpop,
  } = useAdditionalInformation();


  return (
    <ColumnWrapper>
      <ConfirmationLatest />
      <ColumnWrapper sx={{ gap: 3 }}>
        <RowWrapper >
          <Title title="Additional Information" />
        </RowWrapper>
        <TableDebtorInformation
          module={TypeModule.APU_PPT}
          process={process}
        />

        <SectionTitle title="Additional Information" isOpen>
          <WordEditor
            id="additionalWord"
            isReadOnly={isSynfunsionDisabled || viewOnly}
            container={container}
            setContainer={setContainer}
            isLoading={isLoading}
            initialValue={additionalInformationDetail?.description}
          />
        </SectionTitle>

        {!isDpop &&
          <TableUploadDocument
            module={TypeModule.APU_PPT}
            process={process}
            showModalSelector
          /> ||
          null
        }
        <RowWrapper sx={{ gap: theme.spacing(3), justifyContent: 'end', marginY: theme.spacing(3) }}>
          {renderActionButtons()}
        </RowWrapper>
      </ColumnWrapper>

    </ColumnWrapper>
  );
};

export default AdditionalInformationPage;
