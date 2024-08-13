import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '../../lib/cn';

const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root>
>(({ className, ...props }, ref) => (
  <SwitchPrimitives.Root
    className={cn(
      'h-6 w-10 cursor-pointer rounded-full border-4 border-transparent bg-grayGreen100 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-deepForest focus-visible:ring-offset-2 disabled:cursor-not-allowed data-[state=checked]:bg-deepForest80',
      className
    )}
    {...props}
    ref={ref}
  >
    <SwitchPrimitives.Thumb
      className={cn(
        'block h-4 w-4 rounded-full bg-white transition-transform will-change-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
      )}
    />
  </SwitchPrimitives.Root>
));
Switch.displayName = SwitchPrimitives.Root.displayName;

export { Switch };
