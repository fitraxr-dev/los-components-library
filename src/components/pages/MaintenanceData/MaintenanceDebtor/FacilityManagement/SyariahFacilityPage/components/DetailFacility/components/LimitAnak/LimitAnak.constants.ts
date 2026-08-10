export interface SectionProps {
  title: string;
  children: React.ReactNode;
}

export interface DataItem {
  label: string;
  value: string | number | null;
  gridColumn?: string;
}

export interface Section {
  title: string;
  data: DataItem[];
}

export interface MappingFormData {
  mappingOrderType: { label: string; value: string } | null;
  mappingFinancingSegment: { label: string; value: string } | null;
  mappingProduct: { label: string; value: string } | null;
  os: number | null;
  financingObjectives: string;
  rateType: { id: string; label: string } | null;
  floatingReference: string;
  childFacilityAlias: string;
  projectId: string;
}
