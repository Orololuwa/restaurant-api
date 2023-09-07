import { Injectable, Logger } from '@nestjs/common';
import { ResponseState } from 'src/lib/helpers';

export type ErrorDetails = {
  technicalMessage: string;
  message: string;
  status: number;
  state: string;
  field?: string;
};

const ERROR_MESSAGE: string = 'An error occured, please contact support';
@Injectable()
export class ErrorService {
  constructor() {}

  public async error(error: any, action: string = ''): Promise<any> {
    console.log('@error');
    const details: ErrorDetails = {
      technicalMessage: error.message,
      message: error.errorMessage
        ? error.errorMessage
        : error?.message
        ? error.message
        : ERROR_MESSAGE,
      status: error?.status || 500,
      state: ResponseState.ERROR,
    };
    await this.reportError({ error, action });
    throw details;
  }

  public async reportError(payload: {
    error: any;
    action: string;
  }): Promise<void> {
    const { error, action } = payload;
    console.log('@send  error to a webhook for proper logging', action);

    Logger.error(error);
  }
}
