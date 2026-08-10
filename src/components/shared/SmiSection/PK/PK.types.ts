export type PkProcessingProps = SmiComponentProps & {
  isLegalSigning?: boolean;
}

export type ActionBtnProps = {
  [key: string]: string | null;
}


export type PkTabsProps = {
  isLegalSigning?: boolean;
  handleNextTab: () => void;
  actionBtn?: ActionBtnProps;
  isViewOnly?: boolean;
  financingFacilityId?: number | null;
  pkStatus?: string;
}

export type PkProcessingTypeProps = PkTabsProps & {
  module: string;
  process: string;
  isAskForInfo: boolean;
}
