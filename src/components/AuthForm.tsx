import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useSearchParams, useNavigate } from "react-router-dom";

import {
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
    if (mutateType === "signed" && data !== null) {
      const { token } = data;
      dispatch(resetMutate());
      navigate("/");
      localStorage.setItem("token", token);
    } else if (mutateType === "created") {
      dispatch(resetMutate());
      (document.getElementById("auth-form")! as HTMLFormElement).reset();
      navigate("/sign-in");
    } else if (mutateType === "patched") {
      dispatch(resetMutate());
      navigate("/my-account", { state: { message: message } });
    }
  });

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
    }
  };

  const defaultEmail = searchParams.get("email") || data?.sub || "";
  const shouldDisableEmail =
    task === "Reset password" || task === "Forgot password";

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
              disabled={shouldDisableEmail}
            />
            <label htmlFor="password">Password</label>
            <input type="password" name="password" />
            <div style={{ display: task === "Sign in" ? "none" : "grid" }}>
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
        <Link to={"/sign-up"}>No account? Sign up here</Link>
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
