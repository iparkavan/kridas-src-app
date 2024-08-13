import { useMutation } from '@tanstack/react-query';
import { login, signup } from '../api/authentication-api';
import { Login } from '../schemas/login-schema';
import { Signup } from '../schemas/signup-schema';

const useLogin = () =>
  useMutation({
    mutationFn: (data: Login) => login(data),
  });

const useSignup = () =>
  useMutation({
    mutationFn: (data: Signup) => signup(data),
  });

export { useLogin, useSignup };
