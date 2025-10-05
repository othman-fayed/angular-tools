export type ApplicationLifecycleState =
  | 'NotStarted'
  | 'InProgress'
  | 'Completed'
  | 'Failed'
  | 'Succeeded';

export interface ApplicationLifecycleSubPhaseDto {
  id: string;
  name?: string;
  value?: number;
  lifecycleState?: ApplicationLifecycleState;
  isEnd: boolean;
  failurePhaseId?: number | string;
  successPhaseId?: number | string;
  failureButtonText?: string;
  successButtonText?: string;
}

export interface ApplicationLifecyclePhaseDto extends ApplicationLifecycleSubPhaseDto {
  subPhases?: ApplicationLifecycleSubPhaseDto[];
}
