import { useRouteError } from 'react-router-dom';

const BubbleError = () => {
  const error = useRouteError();
  throw error;
};

export { BubbleError };
