/* eslint-disable no-undef */
/* eslint-disable import/prefer-default-export */
import usersApi from '..';
import { setCredentials } from '../../../slices/userSlice';

const usersApiEndpoints = usersApi
  .enhanceEndpoints({
    addTagTypes: ['Users'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      getUsersInfo: builder.query({
        query: (id) => ({
          url: `/user/${id}`,
          method: 'GET',
        }),
        providesTags: ['Users'],
      }),
      updateUser: builder.mutation({
        query: (user) => ({
          url: '/users/update',
          method: 'PATCH',
          data: user,
          async onSuccess(dispatch, data) {
            dispatch(setCredentials(data as User));
          },
        }),
      }),
      updatePassword: builder.mutation({
        query: (pass: Record<string, string>) => ({
          url: '/password/update',
          method: 'PATCH',
          data: pass,
          async onSuccess(dispatch, data) {
            dispatch(setCredentials(data as User));
          },
        }),
      }),
    }),
  });

export const {
  useGetUsersInfoQuery,
  useUpdateUserMutation,
  useUpdatePasswordMutation,
} = usersApiEndpoints;
