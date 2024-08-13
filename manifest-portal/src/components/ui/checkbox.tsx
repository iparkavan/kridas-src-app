import { forwardRef } from 'react';
import { cn } from '../../lib/cn';

type CheckboxProps = React.ComponentPropsWithRef<'input'> & {
  label?: string;
  error?: boolean;
};

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, id, error, ...otherProps }, ref) => {
    return (
      <div className="flex">
        <div>
          <input
            type="checkbox"
            id={id}
            className={cn(
              'h-6 w-6 rounded-md border-teal text-teal focus:ring-teal',
              error && 'border-tomato',
              className
            )}
            ref={ref}
            {...otherProps}
          />
        </div>
        <label htmlFor={id} className="ms-4 text-sm">
          {label}
        </label>
      </div>
    );
  }
);

export { Checkbox };
