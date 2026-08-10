import type { StepperConfig } from '@/hooks/useGlobalStepper';


export const STEPPER_CONFIG: Record<string, StepperConfig> = {
  'maintenance-parameter': {
    baseUrl: '/master-parameter/parameter-lov',
    stepPaths: ['process', 'summary', 'validasi'],
    steps: ['Process', 'Summary', 'Validasi'],
  },
  'maintenance-proyek': {
    baseUrl: '/maintenance-data/maintenance-proyek',
    stepPaths: ['project-information', 'project-owner', 'contractor', 'informasi-lainnya'],
    steps: ['Project Information', 'Project Owner', 'Contractor', 'Informasi Lainnya'],
  },
  'parameter-mapping-apu_ppt': {
    baseUrl: '/master-parameter/parameter-mapping-apu_ppt',
    stepPaths: ['process', 'summary', 'validasi'],
    steps: ['Process', 'Summary', 'Validasi'],
  },
  'parameter-mapping-bar': {
    baseUrl: '/master-parameter/parameter-mapping-bar',
    stepPaths: ['process', 'summary', 'validasi'],
    steps: ['Process', 'Summary', 'Validasi'],
  },
  'parameter-va': {
    baseUrl: '/master-parameter/parameter-va',
    stepPaths: ['process', 'summary', 'validasi'],
    steps: ['Process', 'Summary', 'Validasi'],
  },
  // Add more modules here as needed
};

export const getStepperConfig = (moduleName: string): StepperConfig | null => {
  return STEPPER_CONFIG[moduleName] || null;
};
