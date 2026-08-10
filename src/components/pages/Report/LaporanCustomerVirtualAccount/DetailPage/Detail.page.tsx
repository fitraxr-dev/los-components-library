'use client';

import { useParams } from 'next/navigation';

import ColumnWrapper from '@/components/shared/ColumnWrapper';
import Title from '@/components/shared/Title';

import LaporanCustomerVirtualAccountDetail from './components/LaporanCustomerVirtualAccountDetail';
import useDetail from './Detail.hook';


const DetailPage = () => {
  const params = useParams();
  const { data, isLoading } = useDetail(params.id as string);

  return (
    <ColumnWrapper gap={3}>
      <Title title="Laporan Detail Customer - Virtual Account - Detail" />
      <LaporanCustomerVirtualAccountDetail data={data} isLoading={isLoading} />
    </ColumnWrapper>
  );
};

export default DetailPage;
