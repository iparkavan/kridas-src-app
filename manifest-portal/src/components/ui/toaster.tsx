import { LuAlertCircle, LuCheckCircle } from 'react-icons/lu';
import { useToast, useToastValue } from '../../hooks/toast-hooks';
import {
  Toast,
  ToastClose,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from './toast';

const Toaster = () => {
  const { title, variant = 'success', ...toastProps } = useToastValue();
  const toast = useToast();

  return (
    <ToastProvider>
      <Toast
        {...toastProps}
        variant={variant}
        onOpenChange={(open) => {
          toast({ open, title: '' });
        }}
      >
        {title && (
          <ToastTitle className="flex items-center gap-3 break-all">
            {variant === 'success' && (
              <LuCheckCircle className="mt-[-1px] flex-shrink-0" />
            )}
            {variant === 'error' && (
              <LuAlertCircle className="mt-[-1px] flex-shrink-0" />
            )}
            {title}
          </ToastTitle>
        )}
        <ToastClose />
      </Toast>

      <ToastViewport />
    </ToastProvider>
  );
};

export { Toaster };
