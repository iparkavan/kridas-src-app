import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';
import { Location, NavigateFunction } from 'react-router-dom';
import { Auth } from './features/authentication/types/authentication-types';
import { routes } from './constants/routes';
import { ToastProps } from './types/toast-types';

type DecodedToken = {
  given_name: string;
  family_name: string;
  email: string;
  'custom:companyId': string;
  'cognito:groups'?: string[];
};

type Login = (
  location: Location,
  navigate: NavigateFunction,
  data: Auth
) => void;

type LogoutType = () => void;

type Store = {
  auth: Auth | null;
  decodedToken: DecodedToken | null;
  login: Login;
  logout: LogoutType;
  toastValue: ToastProps;
  toast: (toastValue: ToastProps) => void;
};

// Have checked if idToken is present to decrypt
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isAuthType = (value: any): value is { auth: Store['auth'] } => {
  return (
    value &&
    typeof value === 'object' &&
    'auth' in value &&
    typeof value.auth === 'object' &&
    'idToken' in value.auth &&
    typeof value.auth.idToken === 'string'
  );
};

const STORE_NAME = 'authStore';

const useStore = create<Store>()(
  persist(
    (set) => ({
      auth: null,
      decodedToken: null,
      login: (location, navigate, data) => {
        const decodedToken = jwtDecode<DecodedToken>(data.idToken);
        set({
          auth: data,
          decodedToken,
        });
        const from = location.state?.from?.pathname || routes.credentials;
        navigate(from, { replace: true });
      },
      logout: () => {
        set({ auth: null, decodedToken: null });
        localStorage.removeItem(STORE_NAME);
      },
      toastValue: { open: false, title: '' },
      toast: (newToastValue: ToastProps) => {
        set({ toastValue: { open: true, ...newToastValue } });
      },
    }),
    {
      name: STORE_NAME,
      partialize: (state) => ({ auth: state.auth }),
      merge: (persistedState, currentState) => {
        if (isAuthType(persistedState) && persistedState.auth) {
          const decodedToken = jwtDecode<DecodedToken>(
            persistedState.auth.idToken
          );
          return { ...currentState, ...persistedState, decodedToken };
        }
        if (persistedState) {
          return {
            ...currentState,
            ...persistedState,
          };
        }
        return currentState;
      },
    }
  )
);

export { useStore, useStore as useAuth };
