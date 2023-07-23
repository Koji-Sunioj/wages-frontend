export type TUserState = {
  data: TAuth;
  loading: boolean;
  error: boolean;
  mutateType: string;
  message: string;
};

export type TAuth = {
  email: string;
  iat: string;
  exp: string;
  created: string;
};
