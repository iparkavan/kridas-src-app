import * as React from 'react';
import * as ToastPrimitives from '@radix-ui/react-toast';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/cn';
import { LuX } from 'react-icons/lu';

const ToastProvider = ToastPrimitives.Provider;

const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Viewport>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    ref={ref}
    className={cn(
      'fixed bottom-0 left-[50%] z-[100] w-full max-w-[600px] translate-x-[-50%] p-6 sm:w-fit sm:p-4',
      className
    )}
    {...props}
  />
));
ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

const toastVariants = cva('relative flex rounded-md py-5 pl-6 pr-12', {
  variants: {
    variant: {
      success: 'bg-teal text-white',
      error: 'bg-tomato text-white',
    },
  },
});

const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root> &
    VariantProps<typeof toastVariants>
>(({ className, variant, ...props }, ref) => {
  return (
    <ToastPrimitives.Root
      ref={ref}
      className={cn(toastVariants({ variant }), className)}
      {...props}
    />
  );
});
Toast.displayName = ToastPrimitives.Root.displayName;

const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Close>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Close
    ref={ref}
    className={cn(
      'absolute right-4 top-[50%] translate-y-[-50%] rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-current',
      className
    )}
    toast-close=""
    {...props}
  >
    <LuX />
  </ToastPrimitives.Close>
));
ToastClose.displayName = ToastPrimitives.Close.displayName;

const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title>
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    ref={ref}
    className={cn('leading-none', className)}
    {...props}
  />
));
ToastTitle.displayName = ToastPrimitives.Title.displayName;

type ToastProps = React.ComponentPropsWithoutRef<typeof Toast>;

export {
  type ToastProps as DefaultToastProps,
  ToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastClose,
};
