import moment from "moment";
import { Link, useLocation } from "react-router-dom";

import { TAuth } from "../utils/types";

const MyAccount = ({ authData }: { authData: TAuth }) => {
  const { sub, created } = authData;
  const location = useLocation();

  return (
    <>
      <h2>Hello {sub}</h2>
      <p>
        Your account was created on {moment.utc(created).local().toString()}
      </p>
      <br />
      <Link to={"/reset-password"}>Reset your password</Link>
      {location.state !== null && location.state.hasOwnProperty("message") && (
        <p style={{ color: "blue" }}>
          <strong>{location.state.message}</strong>
        </p>
      )}
    </>
  );
};

export default MyAccount;
