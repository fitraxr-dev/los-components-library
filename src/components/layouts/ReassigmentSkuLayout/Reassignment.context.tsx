'use client';
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { usePathname } from 'next/navigation';

import { GENERAL_SKU } from '@/configs/constants/sku';
import { TypeModule, TypeProcess } from '@/enums/Module';
import { getLastPath, replacePath } from '@/helpers/navigation';
import useGetBucketStepper from '@/hooks/services/useGetBucketStepper';
import useApp from '@/hooks/useApp';
import useCustomRouter from '@/hooks/useCustomRouter';
import useIdentity from '@/hooks/useIdentity';

import { reducer } from '@/components/layouts/AppLayout/App.constants';

import { dummyStepperData, initialState, initiateBreadCrumb, type State } from './Reassignment.constants';

import type { ReactNode } from 'react';


export interface BreadCrumbItem {
  label: string;
  url: string;
}

export interface Step {
  bucketProcessId: string;
  label: string;
  key: string;
  urlPath: string;
  enable: boolean;
  isDone: boolean;
  isButtonShow: boolean;
  childrenSteps: any;
  action: any;
}

export const ReassignmentSkuContext = createContext<any>(undefined);

export const ReassignmentSkuProvider = ({ children }: { children: ReactNode }) => {
  const [state, setState] = useState<State>(initialState);
  const router = useCustomRouter();
  const [appState, dispatch] = useApp();
  const { processId } = useIdentity();
  const path = usePathname();

  const pathSegments = useMemo(() => path.split('/').filter(Boolean), [path]);
  const lastPath = useMemo(() => getLastPath(path), [path]);
  const mode = pathSegments[2];
  const isCreatePage = mode === GENERAL_SKU.CREATE;

  const isAddNewPath = path.includes('create');


  const { data: bucketStepperData, isLoading: isStepperLoading } = useGetBucketStepper({
    bucketProcessId: String(processId),
    module: TypeModule.REASSIGNMENT_SKU,
    process: TypeProcess.REASSIGNMENT_SKU,
  }, {
    enabled: Boolean(processId?.length) && path.includes('reassignment-sku') && !isCreatePage && !isAddNewPath,
  });

  const stepperData = isAddNewPath ? dummyStepperData : bucketStepperData;
  const steps = stepperData?.steps || [];

  useEffect(() => {
    if (stepperData) {
      dispatch({ data: stepperData, type: reducer.SET_STEPPER });
    }
  }, [stepperData, dispatch, isAddNewPath]);

  useEffect(() => {
    if (!steps.length) {
      setState((prev) => ({ ...prev, actionButtons: {} }));
      return;
    }

    const currentStep = steps.find((step: Step) =>
      step.urlPath === lastPath && step.action && typeof step.action === 'object'
    );

    setState((prev) => ({
      ...prev,
      actionButtons: currentStep?.action || {},
      stepperData: stepperData,
    }));
  }, [steps, lastPath, stepperData]);

  const goToNextStep = () => {
    const segments = path.split('/');
    const basePath = segments.slice(0, -1).join('/');
    const currentLastPath = getLastPath(path);
    const stepIndex = steps.findIndex((step: Step) => step.urlPath === currentLastPath);

    if (stepIndex === -1) return;

    const nextStep = steps[stepIndex + 1]?.urlPath;
    if (!nextStep) return;

    const nextPath = `${replacePath(basePath, { processId })}/${nextStep}`;
    router.push(nextPath);
  };

  const updateState = (updates: Partial<State>) => {
    setState((prev) => ({ ...prev, ...updates }));
  };

  const handleSetBreadcrumb = (params: BreadCrumbItem[] | BreadCrumbItem) => {
    updateState({
      breadCrumb: [...initiateBreadCrumb, ...(Array.isArray(params) ? params : [params])],
    });
  };

  const currentStep = useMemo(() => {
    if (!steps.length) return null;
    return steps.find((step: Step) => step.urlPath === lastPath);
  }, [steps, lastPath]);

  const isStepEnabled = currentStep?.enable || false;

  const setSelectedItems = (items: any[]) => updateState({ selectedItems: items });
  const setSearchQuery = (query: string) => updateState({ searchQuery: query });
  const setFilterStatus = (status: string) => updateState({ filterStatus: status });
  const setActiveTab = (tab: number) => updateState({ activeTab: tab });

  const contextValue = useMemo(() => ({
    goToNextStep,
    handleSetBreadcrumb,
    isStepEnabled,
    isStepperLoading: isAddNewPath ? false : isStepperLoading,

    setActiveTab,
    setFilterStatus,
    setSearchQuery,
    setSelectedItems,
    setState,
    state,
    stepperData: stepperData,
    ...state,
  }), [state, isStepperLoading, stepperData, isAddNewPath]);

  return (
    <ReassignmentSkuContext.Provider value={contextValue}>
      {children}
    </ReassignmentSkuContext.Provider>
  );
};

export const useReassignmentSkuContext = () => {
  const context = useContext(ReassignmentSkuContext);
  if (context === undefined) {
    throw new Error('useReassignmentSkuContext must be used within a ReassignmentSkuProvider');
  }
  return context;
};
