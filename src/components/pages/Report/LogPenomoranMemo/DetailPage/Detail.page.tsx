'use client';

import { useParams } from 'next/navigation';

import useDetail from '@/components/pages/Report/LogPenomoranMemo/DetailPage/Detail.hook';
import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import LogPenomoranMemoDetail from './components/LogPenomoranMemoDetail';


const DetailPage = () => {
  const params = useParams();
  const { data, isLoading } = useDetail(params.id as string);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Log Penomoran Memo Detail" />
      <LogPenomoranMemoDetail data={data} isLoading={isLoading} />
    </ColumnWrapper>
  );
};

export default DetailPage;
