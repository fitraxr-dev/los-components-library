export interface RequestByProcessIdDtoString {
  bucketProcessId?: string;
  module?: string;
  process?: string;
}

export interface MipStepResponseDto {
  bucketProcessId?: string;
  label?: string;
  key?: string;
  urlPath?: string;
  enable?: boolean;
  isDone?: boolean;
  isButtonShow?: boolean;
  action?: { [key: string]: string };
}

export interface MipStepProgressResponseDto {
  progress?: number;
  from?: string;
  steps?: Array<MipStepResponseDto>;
}
