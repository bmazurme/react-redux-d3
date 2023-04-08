import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';

import getAxiosInstance from '../utils/axiosInstance';
import type { AppDispatch } from '.';

interface CustomQueryArgs extends AxiosRequestConfig {
  onSuccess?: (dispatch: AppDispatch, data: unknown) => Promise<void>;
}

export type CustomBaseQueryType = BaseQueryFn<CustomQueryArgs, unknown, unknown>;

export const getBaseQuery = (baseURL: string): CustomBaseQueryType => async (
  { onSuccess, ...args },
  { dispatch },
) => {
  try {
    const axiosInstance = getAxiosInstance(baseURL);
    const result = await axiosInstance.request(args);

    if (onSuccess) {
      // errors doesn't throw up, so we need to use try catch here
      try {
        await onSuccess(dispatch, result.data);
      } catch (e) {
        console.error('Error in onSuccess method', e);
        throw e;
      }
    }

    return { data: result.data };
  } catch (error) {
    const err = error as AxiosError;

    if (err.response?.status === 401) {
      try {
        console.log('Unauthorized error');
        return { error: { message: 'Unauthorized error' } };
      } catch {
        // empty
      }
    }

    throw error;
  }
};
