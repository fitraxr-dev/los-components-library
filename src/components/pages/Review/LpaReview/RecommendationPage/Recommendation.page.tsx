'use client';
import { TypeModule, TypeProcess } from '@/enums/Module';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import RowWrapper from '@/components/shared/RowWrapper';
import TableDebtorInformation from '@/components/shared/SmiTable/TableDebtorInformation';
import TableUploadDocument from '@/components/shared/SmiTable/TableUploadDocument';
import Title from '@/components/shared/Title';
import WordEditor from '@/components/shared/WordEditor';

import ConfirmationLatest from '../components/ConfirmationLatest/ConfirmationLatest';

import useRecommendation from './Recommendation.hook';


const RecommendationPage = () => {
  const {
    data,
    renderActionButtons,
    container,
    setContainer,
    module,
    process,
    isLoading,
    viewOnly,
  } = useRecommendation();

  return (
    <ColumnWrapper sx={{ gap: 3 }}>
      <ConfirmationLatest />
      <TableDebtorInformation module={module} process={process} />
      <Title title="Rekomendasi" />
      <WordEditor
        isReadOnly={viewOnly}
        container={container}
        setContainer={setContainer}
        initialValue={data?.content?.description}
        isLoading={isLoading}
      />

      <TableUploadDocument
        module={TypeModule.LPA}
        process={TypeProcess.LPA_REVIEW}
        showModalSelector={true}
        excludeProcess={true}
      />

      <RowWrapper sx={{ gap: 2, justifyContent: 'end', py: 3 }}>
        {renderActionButtons()}
      </RowWrapper>
    </ColumnWrapper>
  );
};

export default RecommendationPage;
