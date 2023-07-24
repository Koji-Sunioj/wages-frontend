import * as React from "react";

import { store } from "../redux/store";

export type TAppDispatch = typeof store.dispatch;

export type TUserState = {
  data: TAuth | null;
  loading: boolean;
  error: boolean;
  mutateType: string;
  message: string | null;
};

export type TAuth = {
  sub: string;
  iat: string;
  exp: string;
  created: string;
  token: string;
};

export type TAppState = {
  auth: TUserState;
};
