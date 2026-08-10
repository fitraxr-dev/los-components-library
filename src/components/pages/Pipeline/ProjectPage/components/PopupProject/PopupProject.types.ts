type Payload = {
  id: number;
  projectName: string;
  value: {
    currency: string;
    value: string;
  };
  exchangeRate: {
    currency: string;
    value: string;
  };
  valueInIdr: {
    currency: string;
    value: string;
  };
  sector: string;
  province: string;
  city: string;
  district: string;
  createdBy: number;
  createdDate: string;
  modifiedBy: number;
  modifiedDate: string;
  projectCode: string;
  process: string;
  module: string;
  buckerProcessId: string | string[];
}

export type PopupProjectHookProps = {
  id: number;
}

export type PopupProjectProps = {
  id: number;
  viewOnly: boolean;
};

export type SubmitDataProps = Payload
