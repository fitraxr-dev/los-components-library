export interface BreadCrumbItem {
  label: string;
  url: string;
}

export interface State {
  actionButtons: any;
  activeTab: number;
  breadCrumb: BreadCrumbItem[];
  filterStatus: string;
  mockSteps: any[];
  percentage: number;
  searchQuery: string;
  selectedItems: any[];
  selectedTask: any[];
  tabActive: string;
  stepperData: any;
}

export const initialState: State = {
  actionButtons: {},
  activeTab: 0,
  breadCrumb: [
    { label: 'Home', url: '/' },
    { label: 'Reassignment SKU List', url: '/reassignment-sku' }
  ],
  filterStatus: 'all',
  mockSteps: [],
  percentage: 0,
  searchQuery: '',
  selectedItems: [],
  selectedTask: [],
  stepperData: null,
  tabActive: '',
};

export const initiateBreadCrumb: BreadCrumbItem[] = [
  { label: 'Home', url: '/' },
  { label: 'Reassignment SKU List', url: '/reassignment-sku' }
];

export const dummyStepperData = {
  from: 'CREATE_NEW',
  progress: 0,
  steps: [
    {
      action: {
        CLOSE: 'CLOSE',
      },
      bucketProcessId: '',
      childrenSteps: null,
      enable: true,
      isButtonShow: true,
      isDone: false,
      key: 'request',
      label: 'Request',
      urlPath: 'request',
    },
    {
      action: null,
      bucketProcessId: '',
      childrenSteps: null,
      enable: true,
      isButtonShow: true,
      isDone: false,
      key: 'validation',
      label: 'Validasi',
      urlPath: 'validation',
    }
  ],
};
