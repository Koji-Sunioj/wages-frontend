import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { getApi } from "../../utils/getApi";
import { TUserState } from "../../utils/types";

const wagesEndPoint = getApi("WagesBackEnd");

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { email: string; password: string }) => {
    const request = await fetch(`${wagesEndPoint}/sign-in`, {
      method: "POST",
      body: JSON.stringify(userParams),
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();
    if (!request.ok) {
      throw new Error(response.message);
    }
    return response;
  }
);

export const signUp = createAsyncThunk(
  "sign-up",
  async (userParams: { email: string; password: string }) => {
    const request = await fetch(`${wagesEndPoint}/users`, {
      method: "POST",
      body: JSON.stringify(userParams),
      headers: { "Content-Type": "application/json" },
    });
    const response = await request.json();
    if (!request.ok) {
      throw new Error(response.message);
    }
    return response;
  }
);

export const verifyToken = createAsyncThunk(
  "verify-token",
  async (token: string) => {
    const request = await fetch(
      `${wagesEndPoint}/check-session?token=${token}`,
      { method: "GET" }
    );
    return await request.json();
  }
);

export const resetPw = createAsyncThunk(
  "reset-password",
  async (userParams: { email: string; password: string; token: string }) => {
    const { email, token } = userParams;
    const request = await fetch(
      `${wagesEndPoint}/users/${email}/reset-password`,
      {
        method: "PATCH",
        body: JSON.stringify(userParams),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const response = await request.json();
    if (!request.ok) {
      throw new Error(response.message);
    }
    return response;
  }
);

const initialAuthState: TUserState = {
  data: null,
  loading: false,
  error: false,
  mutateType: "idle",
  message: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
    setMessage: (state, action) => {
      state.message = action.payload;
      state.error = true;
    },
    resetMutate: (state) => {
      if (state.mutateType === "signed" || state.mutateType === "patched") {
        state.message = null;
      }
      state.mutateType = "idle";
    },
  },
  extraReducers(builder) {
    builder
      .addCase(resetPw.pending, (state) => {
        state.loading = true;
      })
      .addCase(resetPw.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.message = action.payload.message;
        state.mutateType = "patched";
      })
      .addCase(resetPw.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
        state.message = action.error.message!;
      })
      .addCase(signIn.pending, (state) => {
        state.loading = true;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.error = false;
        state.data = action.payload;
        state.loading = false;
        state.message = "successfully signed in";
        state.mutateType = "signed";
      })
      .addCase(signIn.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
        state.message = action.error.message!;
      })
      .addCase(verifyToken.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyToken.fulfilled, (state, action) => {
        state.error = false;
        state.data = action.payload;
        state.loading = false;
        state.message = "successfully signed in";
      })
      .addCase(verifyToken.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
        state.message = action.error.message!;
      })
      .addCase(signUp.pending, (state) => {
        state.loading = true;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.error = false;
        state.loading = false;
        state.message = action.payload.message;
        state.mutateType = "created";
      })
      .addCase(signUp.rejected, (state, action) => {
        state.error = true;
        state.loading = false;
        state.message = action.error.message!;
      });
  },
});

export const { resetUser, setMessage, resetMutate } = userSlice.actions;
export default userSlice.reducer;
