import { DefaultToastProps } from '../components/ui/toast';

type ToastProps = DefaultToastProps & {
  title: React.ReactNode;
};

export type { ToastProps };
