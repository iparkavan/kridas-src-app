type Auth = {
  idToken: string;
  refreshToken: string;
  accessToken: string;
  company: {
    companyName: string;
    clientId: string;
  };
};

export type { Auth };
