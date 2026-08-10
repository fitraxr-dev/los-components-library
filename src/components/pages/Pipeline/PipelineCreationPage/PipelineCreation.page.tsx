'use client';
import { usePathname } from 'next/navigation';

import { getLastPath } from '@/helpers/navigation';

import CreateNew from './components/CreateNew';
import Detail from './components/Detail';


const PipelineCreationPage = () => {
  const path = usePathname();

  return (getLastPath(path) === 'detail') ? <Detail /> : <CreateNew />;
};

export default PipelineCreationPage;
