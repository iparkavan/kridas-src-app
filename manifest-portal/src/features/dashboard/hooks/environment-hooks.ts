import { useOutletContext } from 'react-router-dom';
import { EnvironmentState } from '../types/environment-types';

const useEnvironment = () => {
  return useOutletContext<EnvironmentState>();
};

export { useEnvironment };
