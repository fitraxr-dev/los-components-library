import type { LoginResponseDto } from '@/services/openapi/auth-service';


export type AppState = {
  darkMode: boolean;
  identity: Identity;
  language: 'en' | 'id';
  currentRole: Array<string>;
  currentPosition: Array<string>;
  userData: UserData;
  viewOnly: boolean;
  stepper: Stepper;
  pages: any;
}

type UserData = null | LoginResponseDto & {
  profilePicture: string;
}

type Identity = {
  analystId: number;
  debtorId: string;
  facilityId: string;
  parentId: string;
  processId: string;
  childId: string;
  debiturName: string;
}

type Stepper = {
  progress: number | null;
  steps: any;
  from: string;
}
