import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  return (
    <>
      <h1>Welcome to the wages tracker app</h1>
      <p>
        Sign in to create your account and input the details of your hourly job,
        for visualizations
      </p>
      {location.state !== null && location.state.hasOwnProperty("message") && (
        <p style={{ color: "blue" }}>
          <strong>{location.state.message}</strong>
        </p>
      )}
    </>
  );
};

export default HomePage;
