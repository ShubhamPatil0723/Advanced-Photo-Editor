import type { RootState, AppDispatch } from '@/redux/store';
import type { ThunkAction, UnknownAction } from '@reduxjs/toolkit';

export type { RootState, AppDispatch };

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  UnknownAction
>;

export interface LoadingState {
  [key: string]: boolean;
}

export interface ErrorState {
  [key: string]: string | null;
}
