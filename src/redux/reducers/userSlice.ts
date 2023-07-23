import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const signIn = createAsyncThunk(
  "sign-in",
  async (userParams: { userName: string; password: string }) => {
    const request = await fetch(`${signUpApi}auth`, {
      method: "POST",
      body: JSON.stringify(userParams),
    });
    return await request.json();
  }
);

const initialAuthState: TAuthState = {
  userName: null,
  AccessToken: null,
  expires: null,
  loading: false,
  message: null,
  patched: null,
  verified: false,
  counter: null,
};

export const userSlice = createSlice({
  name: "auth",
  initialState: initialAuthState,
  reducers: {
    resetUser: () => initialAuthState,
  },
  extraReducers(builder) {
    builder
      .addCase(confirmSignUp.fulfilled, (state) => {
        state.loading = false;
        state.patched = "signed";
        state.message = {
          variant: "success",
          value: "successfully signed up",
        };
      })
      .addCase(confirmSignUp.rejected, (state, action) => {
        state.loading = false;
        state.message = {
          variant: "danger",
          value: action.error.message!,
        };
      })
      .addCase(confirmSignUp.pending, (state) => {
        state.loading = true;
      });
  },
});

export const {
  resetUser,
  resetPatch,
  setMessage,
  resetMessage,
  setFromVerify,
  setCounter,
} = userSlice.actions;
export default userSlice.reducer;
