import { useSelector } from 'react-redux';

import makeDataSelector from '../store/make-data-selector';

const userSelector = makeDataSelector('user');

export default function useUser() {
  return useSelector(userSelector);
}
