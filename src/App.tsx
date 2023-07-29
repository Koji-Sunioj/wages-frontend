import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import MyAccount from "./pages/MyAccount";
import AuthForm from "./components/AuthForm";

import { TAppState, TAppDispatch } from "./utils/types";
import { resetMutate, verifyToken } from "./redux/reducers/userSlice";

function App() {
  const token = localStorage.getItem("token");
  const dispatch = useDispatch<TAppDispatch>();
  const {
    auth: { data, loading, error, mutateType },
  } = useSelector((state: TAppState) => state!);

  const shouldFetch = data === null && token !== null && !error && !loading;

  useEffect(() => {
    switch (mutateType) {
      case "idle":
        shouldFetch && dispatch(verifyToken(token));
        break;
      case "invalid token":
        localStorage.removeItem("token");
        dispatch(resetMutate());
        break;
    }
  }, [shouldFetch, token, dispatch, mutateType]);

  return (
    <BrowserRouter>
      <NavBar authData={data} />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/sign-in" element={<AuthForm task={"Sign in"} />} />
          <Route
            path="/forgot-password"
            element={<AuthForm task={"Forgot password"} />}
          />
          <Route
            path="/reset-password"
            element={<AuthForm task={"Reset password"} />}
          />
          <Route path="/sign-up" element={<AuthForm task={"Sign up"} />} />
          {data !== null && (
            <Route
              path="/my-account"
              element={<MyAccount authData={data} />}
            ></Route>
          )}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
