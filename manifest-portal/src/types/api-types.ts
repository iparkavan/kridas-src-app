type ApiSuccessRes<T = unknown> = {
  status: 'SUCCESS';
  data: T;
};

type ApiErrorRes = {
  status: 'ERROR';
  message: string;
};

export type { ApiSuccessRes, ApiErrorRes };
