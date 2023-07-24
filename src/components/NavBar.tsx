import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { TAppDispatch, TAuth } from "../utils/types";
import { resetUser } from "../redux/reducers/userSlice";

const NavBar = ({ authData }: { authData: TAuth | null }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch<TAppDispatch>();

  const navPointer =
    authData === null
      ? { uri: "/sign-in", text: "Sign in" }
      : { uri: "/my-account", text: "My Account" };

  const logOut = () => {
    localStorage.removeItem("token");
    dispatch(resetUser());
    navigate("/");
  };

  return (
    <header className="header">
      <nav>
        <ul>
          <li>
            <Link to={"/"}>
              <strong>Home</strong>
            </Link>
          </li>
          <li>
            <Link to={navPointer["uri"]}>{navPointer["text"]}</Link>
          </li>
          {authData !== null && (
            <li>
              <button onClick={logOut} type="submit" id="log-out">
                Sign Out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default NavBar;
