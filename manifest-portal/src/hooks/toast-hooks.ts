import { useStore } from '../store';

const useToast = () => useStore((state) => state.toast);

const useToastValue = () => useStore((state) => state.toastValue);

export { useToast, useToastValue };
