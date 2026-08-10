import { usePathname } from 'next/navigation';

import { ESDD } from '@/configs/constants/pathname';


const ignorePath = [
  ESDD.DEBTOR_INFORMATION_PAGE,
  ESDD.FACILITY_OVERVIEW_PAGE,
  ESDD.EXECUTIVE_SUMMARY_PAGE,
  ESDD.ESDD_REPORT_PAGE,
  ESDD.CORRECTIVE_ACTION_PLAN_PAGE,
  ESDD.REPORTING_LIST_ROUTINE_PAGE,
  ESDD.SUMMARY_PAGE,
  ESDD.DRAFT_MEMO_PAGE,
  ESDD.VIEW_ALL_DOCUMENT_PAGE,
  ESDD.VALIDATION_PAGE,
  ESDD.ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE,
  ESDD.EDIT_CORRECTIVE_ACTION_PLAN_PAGE,
  ESDD.ASSIGNMENT_PAGE,
  ESDD.LIST_PAGE,
  ESDD.MONITORING_PAGE
];

const useEsdd = () => {
  const path = usePathname();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const processIdIndex = pathArray[5];
  const idIndex = pathArray[8];

  const additionalIgnorePath = [
    ...ignorePath,
    ESDD.ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex),
    ESDD.EDIT_CORRECTIVE_ACTION_PLAN_PAGE
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
  ];

  const isDetailPage = !additionalIgnorePath.includes(path);

  const renderDetailLayout = isDetailPage;

  return {
    renderDetailLayout,
  };
};

export default useEsdd;
