'use client';

import { useParams } from 'next/navigation';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import LaporanCustomerDetail from './components/LaporanCustomerDetail';
import useDetail from './Detail.hook';


const DetailPage = () => {
  const params = useParams();
  const { data, isLoading } = useDetail(params.id as string);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Laporan Detail Customer - Detail" />
      <LaporanCustomerDetail data={data} isLoading={isLoading} />
    </ColumnWrapper>
  );
};

export default DetailPage;
