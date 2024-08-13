import { ComponentPropsWithoutRef } from 'react';
import { cn } from '../../lib/cn';

type ErrorMessageProps = ComponentPropsWithoutRef<'p'>;

const ErrorMessage = ({
  className,
  children,
  ...otherProps
}: ErrorMessageProps) => {
  return (
    <p className={cn('text-tomato', className)} {...otherProps}>
      {children}
    </p>
  );
};

export { ErrorMessage };
