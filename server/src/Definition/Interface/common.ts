import { ServiceResponseStatus } from '../Enum/index';

export declare type ServiceResponse = {
  status: ServiceResponseStatus;
  message?: string;
  metadata?: unknown;
  data?: any;
};

export declare type FunctionResponse = {
  status: number;
  description?: string;
  data?: any;
};

export declare type DropdownOption = {
  label: string | number;
  value: string | number;
  desc?: string;
};
export declare type DropdownList = DropdownOption[];

export declare type ModifyByAt = {
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date;
  updatedByAccountId?: string;
};
