import { Routes, Route, BrowserRouter } from "react-router-dom";

import HomePage from "./pages/HomePage";
import NotFound from "./pages/NotFound";
import NavBar from "./components/NavBar";
import AuthForm from "./components/AuthForm";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
      <div className="container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/sign-in"
            element={<AuthForm confirmPw={false} task={"Sign in"} />}
          />
          <Route
            path="/forgot-password"
            element={<AuthForm confirmPw={true} task={"Reset password"} />}
          />
          <Route
            path="/sign-up"
            element={<AuthForm confirmPw={true} task={"Sign up"} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
