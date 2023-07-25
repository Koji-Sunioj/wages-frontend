import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import {
  forgotPw,
  resetMutate,
  resetPw,
  setMessage,
  signIn,
  signUp,
} from "../redux/reducers/userSlice";
import { TAppDispatch, TAppState } from "../utils/types";

const AuthForm = ({ task }: { task: string }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();
  const {
    auth: { data, loading, error, message, mutateType },
  } = useSelector((state: TAppState) => state);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const afterAuth = (
      uri: string,
      state: { message: string } | null = null
    ) => {
      dispatch(resetMutate());
      navigate(uri, { state: state });
    };

    switch (mutateType) {
      case "signed":
        if (data !== null) {
          const { token } = data;
          afterAuth("/", { message: message! });
          localStorage.setItem("token", token);
        }
        break;
      case "created":
        afterAuth("/sign-in");
        (document.getElementById("auth-form")! as HTMLFormElement).reset();
        break;
      case "patched":
        data === null
          ? afterAuth("/sign-in", { message: message! })
          : afterAuth("/my-account", { message: message! });
        break;
    }
  }, [mutateType, data, dispatch, message, navigate]);

  const defaultEmail = searchParams.get("email") || data?.sub || "";
  const hasParams = searchParams.has("email") && searchParams.has("token");
  const needsReset = ["Reset password"].includes(task) || hasParams;
  const renderPw = task !== "Forgot password" || hasParams;
  const renderConfPw =
    ["Reset password", "Sign up"].includes(task) || hasParams;

  const sendLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const {
      currentTarget: {
        password: { value: password },
        email: { value: email },
        confirmPassword: { value: confirmPassword },
      },
    } = event;
    const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
    const meetsReqs = pattern.test(password) && password === confirmPassword;

    switch (task) {
      case "Sign in":
        dispatch(signIn({ email: email, password: password }));
        break;
      case "Sign up":
        meetsReqs
          ? dispatch(signUp({ email: email, password: password }))
          : dispatch(setMessage("passwords don't match or meet requirements"));
        break;
      case "Reset password":
        if (data !== null) {
          const { token } = data;
          meetsReqs
            ? dispatch(
                resetPw({ email: email, password: password, token: token })
              )
            : dispatch(
                setMessage("passwords don't match or meet requirements")
              );
        }
        break;
      case "Forgot password":
        if (hasParams) {
          const token = searchParams.get("token");
          dispatch(
            resetPw({ email: email, password: password, token: token! })
          );
        } else {
          dispatch(forgotPw(email));
        }
        break;
    }
  };

  return (
    <>
      <h2>{task}</h2>
      <form className="generic-component" onSubmit={sendLogin} id="auth-form">
        <fieldset disabled={loading}>
          <div className="generic-column">
            <label htmlFor="email">Email address</label>
            <input
              type="text"
              name="email"
              defaultValue={defaultEmail}
              disabled={needsReset}
            />
            <div style={{ display: renderPw ? "grid" : "none" }}>
              <label htmlFor="password">Password</label>
              <input type="password" name="password" />
            </div>
            <div
              style={{
                display: renderConfPw ? "grid" : "none",
              }}
            >
              <label htmlFor="confirmPassword">Confirm Password</label>
              <input type="password" name="confirmPassword" />
            </div>
            <div>
              <button>Submit</button>
            </div>
          </div>
        </fieldset>
      </form>
      <br />
      {task === "Sign in" && (
        <div className="generic-column">
          <Link to={"/sign-up"}>No account? Sign up here</Link>
          <br />
          <Link to={"/forgot-password"}>Forgot passowrd? Click here</Link>
        </div>
      )}
      {task === "Sign up" && (
        <p>
          <strong>
            password must contain one capital letter, one number and at least
            eight characters.
          </strong>
        </p>
      )}
      {message !== null && (
        <p style={{ color: error ? "red" : "blue" }}>
          <strong>{message}</strong>
        </p>
      )}
    </>
  );
};

export default AuthForm;
