// Dirty hack from https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/react-table
/* eslint-disable @typescript-eslint/ban-ts-comment, @typescript-eslint/no-empty-interface */
import {
  UsePaginationOptions,
  UseSortByColumnProps,
  UseSortByOptions,
} from 'react-table';

declare module 'react-table' {
  // take this file as-is, or comment out the sections that don't apply to your plugin configuration
  // @ts-ignore
  interface TableOptions<D extends Record<string, unknown>>
    extends UsePaginationOptions<D>,
    UseSortByOptions<D>,
    Record<string, unknown> {}

  // @ts-ignore
  interface ColumnInstance<D extends Record<string, unknown> = Record<string, unknown>>
    extends UseSortByColumnProps<D> {
  }
}
