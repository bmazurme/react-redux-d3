/* eslint-disable no-undef */
import authApi from '..';
import { setCredentials } from '../../../slices/userSlice';

const authApiEndpoints = authApi
  .enhanceEndpoints({
    addTagTypes: ['User'],
  })
  .injectEndpoints({
    endpoints: (builder) => ({
      signUp: builder.mutation<void, Omit<User, 'id' | 'display_name'>>({
        query: (data) => ({
          url: '/signup',
          method: 'POST',
          data,
        }),
      }),
      signIn: builder.mutation<void, { email: string, password: string }>({
        query: (data) => ({
          url: '/signin',
          method: 'POST',
          data,
        }),
      }),
      getUser: builder.mutation<User | null, void>({
        query: () => ({
          url: '/users/me',
          method: 'GET',
          async onSuccess(dispatch, data) {
            dispatch(setCredentials(data as User));
          },
        }),
        invalidatesTags: ['User'],
      }),
      confirmUser: builder.mutation({
        query: (token: string) => ({
          url: `/confirm/${token}`,
          method: 'GET',
          // async onSuccess(dispatch, data) {
          //   dispatch(setCredentials(data as User));
          // },
        }),
        invalidatesTags: ['User'],
      }),
      signOut: builder.mutation<void, void>({
        query: () => ({
          url: '/logout',
          method: 'POST',
          async onSuccess(dispatch) {
            await dispatch(setCredentials(null));
          },
        }),
        invalidatesTags: ['User'],
      }),
    }),
  });

export const {
  useSignUpMutation,
  useSignInMutation,
  useGetUserMutation,
  useSignOutMutation,
  useConfirmUserMutation,
} = authApiEndpoints;
