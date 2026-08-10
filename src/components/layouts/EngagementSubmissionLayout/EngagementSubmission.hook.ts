import { usePathname } from 'next/navigation';

import { engagementSubmission } from '@/configs/constants/pathname';
import { getLastPath } from '@/helpers/navigation';


const ignorePath = [
  engagementSubmission.LIST_PAGE
];

const useEngagementSubmission = () => {
  const path = usePathname();
  const pathArray = path.split('/');
  const processIdIndex = pathArray[4];
  const idIndex = pathArray[6];
  const lastPath = getLastPath(path);
  const isParentChildPage = getLastPath(path) === 'parent-child-limit';


  const additionalIgnorePath = [
    ...ignorePath,
    engagementSubmission.PK_PROCESSING_DETIAL_PAGE
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    engagementSubmission.FACILITY_DETAIL
      .replace('[processId]', processIdIndex)
      .replace('[id]', lastPath)
  ];

  const isDetailPage = !additionalIgnorePath.includes(path);
  const renderDetailLayout = isDetailPage;

  const detailPage = [
    engagementSubmission.PK_PROCESSING_DETIAL_PAGE
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    engagementSubmission.FACILITY_DETAIL
      .replace('[processId]', processIdIndex)
      .replace('[id]', lastPath)
  ];

  const isEdit = detailPage.includes(path);

  return {
    isEdit,
    isParentChildPage,
    renderDetailLayout,
  };
};

export default useEngagementSubmission;
