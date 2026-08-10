'use client';

import { useParams } from 'next/navigation';

import useDetail from '@/components/pages/Report/ReportAssessmentApuPpt/DetailPage/Detail.hook';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import ReportAssessmentApuPptDetail from './components/ReportAssessmentApuPptDetail';


const DetailPage = () => {
  const params = useParams();
  const { data, isLoading } = useDetail(params.id as string);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Report Assessment APU PPT Detail" />
      <ReportAssessmentApuPptDetail data={data} isLoading={isLoading} />
    </ColumnWrapper>
  );
};

export default DetailPage;
