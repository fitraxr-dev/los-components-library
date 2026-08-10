interface SyariahFormProps {
  paymentScheme: string;
  onChangeSyariahForm: (e) => void;
  financingFacilityData?: any;
  module?: string;
  process?: string;
  existing?: boolean;
  facilityId?: string;
  syariahComponentConfig?: {
    id?: number;
    productCode?: string;
    productCodeReference?: string;
    attributes?: Array<{
      attributeKey?: string;
      attributeLabel?: string;
      attributeType?: string;
      attributeFields?: string[];
      attributeValue?: string;
    }>;
  };
}

export default SyariahFormProps;
