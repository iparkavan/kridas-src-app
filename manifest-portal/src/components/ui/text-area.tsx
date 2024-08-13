import * as React from 'react';
import { cn } from '../../lib/cn';

type TextareaProps = React.ComponentPropsWithoutRef<'textarea'> & {
  errorMessage?: string;
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, errorMessage, ...props }, ref) => {
    return (
      <div>
        <textarea
          className={cn(
            'min-h-[100px] w-full resize-none rounded-md border border-grayGreen100 px-4 py-3 focus:border-deepForest focus:ring-0',
            errorMessage && 'border-tomato',
            className
          )}
          ref={ref}
          {...props}
        />
        {errorMessage && <p className="text-sm text-tomato">{errorMessage}</p>}
      </div>
    );
  }
);
Textarea.displayName = 'Textarea';

export { Textarea };
