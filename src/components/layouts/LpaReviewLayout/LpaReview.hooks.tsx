import { useParams, usePathname } from 'next/navigation';

import { lpaRequestReview, lpaReview } from '@/configs/constants/pathname';
import { replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  lpaReview.ASSIGNMENT,
  lpaReview.MONITORING,
  lpaReview.REQUEST,
  lpaRequestReview.BUCKET_LIST,
  lpaRequestReview.MONITORING,
];

const useLpaReview = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();

  function handleBack() {
    if (redirectToFromPage()) return;
    router.back();
  };

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const processIdIndex = pathArray[5];
  const parentIdIndex = pathArray[7];
  const idIndex = pathArray[9];

  // Still need to be updated
  const additionalIgnorePath = [
    ...ignorePath,
    lpaReview.DETAIL_LPA
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    lpaReview.COLLATERAL_DETAIL
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    lpaReview.COLLATERAL_DETAIL
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[parentId]', parentIdIndex)
      .replace('[id]', idIndex),
    lpaReview.DETAIL_LPA
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[parentId]', parentIdIndex),
  ];

  const renderDetailLayout = additionalIgnorePath.includes(path);


  return {
    handleBack,
    renderDetailLayout,
  };
};

export default useLpaReview;
