import { RouterState } from 'redux-first-history';
import { initialState as user } from './slices';
import type { AuthState } from './slices';
import { isServer } from '../utils';

export type State = {
  user: AuthState;
  router: RouterState;
};

export default function getInitialState(pathname = '/'): State {
  // eslint-disable-next-line no-underscore-dangle
  return (!isServer && window?.__INITIAL_STATE__)
    // eslint-disable-next-line no-underscore-dangle
    ? window.__INITIAL_STATE__
    : {
      user,
      router: {
        location: {
          pathname,
          search: '',
          hash: '',
          key: '',
          state: '',
        },
        action: 'POP' as RouterState['action'],
      },
    };
}
