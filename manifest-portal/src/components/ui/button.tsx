import { forwardRef } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';

type ButtonVariantProps = VariantProps<typeof buttonVariants>;

type ButtonProps = React.ComponentPropsWithRef<'button'> &
  ButtonVariantProps & {
    isLoading?: boolean;
  };

const buttonVariants = cva(
  'relative inline-flex items-center justify-center whitespace-nowrap rounded-md px-7 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-grayGreen70 disabled:text-grayGreen100',
  {
    variants: {
      variant: {
        primary:
          'bg-deepForest text-white hover:bg-deepForest80 focus:ring-deepForest',
        secondary:
          'border border-grayGreen100 bg-transparent hover:bg-teal hover:text-white focus:ring-grayGreen100 disabled:border-none',
        link: 'p-0',
      },
    },
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, disabled, isLoading, children, variant, ...otherProps },
    ref
  ) => {
    return (
      <button
        className={cn(
          buttonVariants({ variant, className }),
          variant === 'primary' && isLoading && 'disabled:bg-grayGreen70',
          variant === 'secondary' && isLoading && 'disabled:bg-deepForest80'
        )}
        ref={ref}
        disabled={disabled || isLoading}
        {...otherProps}
      >
        {isLoading && (
          <div className="absolute">
            {/* Check if teal can be used for gradient below instead of hexcode */}
            <div className="relative flex h-5 w-5 animate-spin items-center justify-center overflow-hidden rounded-full bg-[conic-gradient(#3A9289,transparent)] direction-reverse">
              <div
                className={cn(
                  'absolute h-3 w-3 rounded-full',
                  variant === 'primary' && 'bg-grayGreen70',
                  variant === 'secondary' && 'bg-deepForest80'
                )}
              />
              <div className="absolute top-0 h-1 w-1 rounded-full bg-teal"></div>
            </div>
          </div>
        )}
        <span className={cn(isLoading && 'invisible')}>{children}</span>
      </button>
    );
  }
);

export { Button };
