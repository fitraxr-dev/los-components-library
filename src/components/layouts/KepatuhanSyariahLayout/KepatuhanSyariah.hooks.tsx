import { usePathname } from 'next/navigation';

import { KEPATUHAN_SYARIAH } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useCustomRouter from '@/hooks/useCustomRouter';
import { useNavigationFromPage } from '@/hooks/useNavigateFromPage';


const ignorePath = [
  KEPATUHAN_SYARIAH.LIST_PAGE,
  KEPATUHAN_SYARIAH.ASSIGNMENT_PAGE,
  KEPATUHAN_SYARIAH.MONITORING_PAGE
];

const useKepatuhanSyariah = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { redirectToFromPage } = useNavigationFromPage();

  const pathArray = path.split('/');
  const moduleIndex = pathArray[4];
  const processIdIndex = pathArray[5];
  const idIndex = pathArray[7];
  const IdDetail = pathArray[8];

  const additionalIgnorePath = [
    ...ignorePath,
    KEPATUHAN_SYARIAH.EDIT_SYARIAH_COMPLIANCE_CHECKLIST
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    KEPATUHAN_SYARIAH.DETAIL_SYARIAH_COMPLIANCE_CHECKLIST
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    KEPATUHAN_SYARIAH.ADD_SUMMARY
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex),
    KEPATUHAN_SYARIAH.EDIT_SUMMARY
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex),
    KEPATUHAN_SYARIAH.DETAIL_SUMMARY
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', IdDetail),
  ];

  function handleBack() {
    const pathEditSummary = KEPATUHAN_SYARIAH.EDIT_SUMMARY
      .replace('[module]', moduleIndex)
      .replace('[processId]', processIdIndex)
      .replace('[id]', idIndex);

    const pathEdit = [
      getLastPath(KEPATUHAN_SYARIAH.EDIT_SYARIAH_COMPLIANCE_CHECKLIST),
      getLastPath(KEPATUHAN_SYARIAH.DETAIL_SYARIAH_COMPLIANCE_CHECKLIST),
      getLastPath(KEPATUHAN_SYARIAH.ADD_SUMMARY),
      getLastPath(KEPATUHAN_SYARIAH.DETAIL_SUMMARY),
      getLastPath(pathEditSummary),
    ];
    if (redirectToFromPage()) return;

    if (pathEdit.some((res) => path?.includes(res))) return router.back();
    router.replace(replacePath(KEPATUHAN_SYARIAH.BASE_PATH, {
      module: moduleIndex,
    }));
  };

  const renderDetailLayout = additionalIgnorePath.includes(path);


  return {
    handleBack,
    renderDetailLayout,
  };
};

export default useKepatuhanSyariah;
