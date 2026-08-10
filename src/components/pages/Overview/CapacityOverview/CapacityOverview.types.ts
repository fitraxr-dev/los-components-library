'use client';

export interface KadivCapacityOverviewData {
  label: string;
  newDebitur: number;
  existingDebitur: number;
}

export interface TLCapacityOverviewData {
  label: string;
  newDebitur: number;
  existingDebitur: number;
}

export type CapacityOverviewData = KadivCapacityOverviewData | TLCapacityOverviewData;
