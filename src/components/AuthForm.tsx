import { Link, useSearchParams } from "react-router-dom";

const AuthForm = ({
  task,
  confirmPw,
}: {
  task: string;
  confirmPw: boolean;
}) => {
  const [searchParams] = useSearchParams();
  console.log(searchParams.get("token"));
  console.log(searchParams.get("email"));
  return (
    <>
      <h2>{task}</h2>
      <form className="generic-component">
        <fieldset>
          <div className="generic-column">
            {task !== "Reset password" && (
              <>
                <label htmlFor="username">User name</label>
                <input type="text" name="username" />
              </>
            )}

            <label htmlFor="password">Password</label>
            <input type="text" name="password" />
            {task !== "Sign in" && (
              <>
                <label htmlFor="confirm-password">Confirm Password</label>
                <input type="text" name="confirm-password" />
              </>
            )}
          </div>
        </fieldset>
      </form>
      <br />
      {!confirmPw && <Link to={"/sign-up"}>No account? Sign up here</Link>}
    </>
  );
};

export default AuthForm;
