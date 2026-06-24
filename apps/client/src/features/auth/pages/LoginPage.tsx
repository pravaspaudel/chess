import { Link } from "react-router";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  return (
    <div>
      <LoginForm />

      <span>
        Not registered? <Link to={"/register"}>Register here</Link>
      </span>
    </div>
  );
};

export default LoginPage;
