import * as React from 'react';

import { useParams, usePathname } from 'next/navigation';

import { risalahRapat } from '@/configs/constants/pathname';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';


const useRisalahRapatLayout = () => {
  const router = useCustomRouter();
  const path = usePathname();
  const { processId, id } = useParams();

  const [{ stepper }] = useApp();

  const ignorePaths = React.useMemo(() => {
    const arr = [
      risalahRapat.DRAFT_LIST_PAGE,
      replacePath(risalahRapat.PREVIEW_ACKNOWLEDGEMENT_SHEET, { processId }),
      replacePath(risalahRapat.EDIT_CORRECTIVE_ACTION_PLAN_PAGE, { id, processId }),
      replacePath(risalahRapat.ADD_NEW_CORRECTIVE_ACTION_PLAN_PAGE, { processId }),
    ].filter(Boolean);

    return arr;
  }, [processId, id]);

  const isDetailPage = React.useMemo(
    () => (path ? !ignorePaths.includes(path) : false),
    [path, ignorePaths],
  );

  const lastPath = React.useMemo(() => getLastPath(path), [path]);
  const basePath = React.useMemo(() => {
    if (!path) return '';
    const idx = path.lastIndexOf('/');
    return idx > 0 ? path.slice(0, idx) : path;
  }, [path]);

  const goToNextStep = React.useCallback(() => {
    const steps = stepper?.steps ?? [];
    if (!steps.length || !lastPath) return;

    const idx = steps.findIndex((s) => s.urlPath === lastPath);
    const next = idx >= 0 ? steps[idx + 1] : undefined;
    if (!next?.urlPath) return;

    router.push(`${basePath}/${next.urlPath}`);
  }, [stepper?.steps, lastPath, basePath, router]);

  return {
    goToNextStep,
    renderDetailLayout: isDetailPage,
  };
};

export default useRisalahRapatLayout;
