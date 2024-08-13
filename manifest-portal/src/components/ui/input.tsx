import { forwardRef } from 'react';
import { cn } from '../../lib/cn';
import { IconButton } from './icon-button';

type InputProps = React.ComponentPropsWithRef<'input'> & {
  label?: string;
  errorMessage?: string;
  error?: boolean;
  wrapperClassName?: string;
  leftIcon?: JSX.Element;
  rightIcon?: JSX.Element;
  onRightIconClick?: () => void;
  rightIconTooltipContent?: string;
  withAsterik?: boolean;
};

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      id,
      errorMessage,
      error,
      wrapperClassName,
      leftIcon,
      rightIcon,
      onRightIconClick,
      rightIconTooltipContent,
      withAsterik = true,
      ...otherProps
    },
    ref
  ) => {
    return (
      <div className={wrapperClassName}>
        {label && (
          <label htmlFor={id} className="mb-2 block text-sm text-deepForest">
            <span
              className={cn(withAsterik && "after:ml-0.5 after:content-['*']")}
            >
              {label}
            </span>
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute bottom-0 left-2 top-0 inline-flex items-center justify-center px-2">
              {leftIcon}
            </span>
          )}
          <input
            id={id}
            className={cn(
              'block w-full rounded-md border border-grayGreen100 px-4 py-3 text-deepForest focus:border-deepForest focus:outline-none focus:ring-0 disabled:cursor-not-allowed disabled:bg-grayGreen50',
              className,
              leftIcon && 'pl-11',
              rightIcon && 'pr-11',
              (errorMessage || error) && 'border-tomato'
            )}
            ref={ref}
            {...otherProps}
          />
          {rightIcon && (
            <IconButton
              type="button"
              className="absolute right-2 top-[50%] translate-y-[-50%] px-2 focus:outline-current"
              onClick={onRightIconClick}
              tooltipContent={rightIconTooltipContent}
            >
              {rightIcon}
            </IconButton>
          )}
        </div>
        {errorMessage && (
          <p className="mt-1 text-sm text-tomato">{errorMessage}</p>
        )}
      </div>
    );
  }
);

export { Input };
