import { axios } from '../../../lib/axios';
import { ApiSuccessRes } from '../../../types/api-types';
import { Login } from '../schemas/login-schema';
import { Signup } from '../schemas/signup-schema';
import { Auth } from '../types/authentication-types';

const login = async (loginData: Login) => {
  const { data } = await axios.post<ApiSuccessRes<Auth>>('/login', loginData);
  return data.data;
};

const signup = async (signupData: Signup) => {
  await axios.post('/register', signupData);
};

export { login, signup };
