import { cn } from '../../lib/cn';
import { Link as RouterLink, LinkProps } from 'react-router-dom';

const Link = ({ className, children, ...otherProps }: LinkProps) => {
  return (
    <RouterLink
      className={cn(
        'font-medium underline focus:outline-offset-2 focus:outline-deepForest',
        className
      )}
      {...otherProps}
    >
      {children}
    </RouterLink>
  );
};

export { Link };
