export type FormValues = {
  debtor: {
    contactPerson: string;
    debtorName: string;
    isAffiliate: boolean;
    position: {
      value: string;
      label: string;
    };
    relationshipSince: string;
    sectorName: string;
    yearFounded: string;
  };
  description: string;
  financingType: string;
  performanceFinancial: {
    assets: {
      currency: string;
      value: string;
    };
    ebitda: {
      currency: string;
      value: string;
    };
    equity: {
      currency: string;
      value: string;
    };
    income: {
      currency: string;
      value: string;
    };
    liability: {
      currency: string;
      value: string;
    };
    netProfit: {
      currency: string;
      value: string;
    };
    performanceFinancialDate: string;
  };
  processType: string;
  requestType: string;
};
