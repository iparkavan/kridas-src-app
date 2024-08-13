import { environmentLabels } from '../constants';

type Environment = keyof typeof environmentLabels;

type EnvironmentState = {
  environment: Environment;
  setEnvironment: React.Dispatch<React.SetStateAction<Environment>>;
};

export type { Environment, EnvironmentState };
