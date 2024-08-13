import { ComponentPropsWithoutRef, forwardRef } from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from './tooltip';
import { cn } from '../../lib/cn';

type IconButtonProps = ComponentPropsWithoutRef<'button'> & {
  tooltipContent?: string;
};

const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ children, className, tooltipContent, ...props }, ref) => {
    if (tooltipContent) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                className={cn('outline-offset-2', className)}
                ref={ref}
                {...props}
              >
                {children}
              </button>
            </TooltipTrigger>
            <TooltipContent>{tooltipContent}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <button
        className={cn('outline-offset-2', className)}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

export { IconButton };
