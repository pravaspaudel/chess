import { Link } from "react-router";
import RegisterForm from "../components/RegisterForm";

const RegisterPage = () => {
  return (
    <div>
      <RegisterForm />

      <span>
        Already have an account
        <Link to={"/login"}>Login here</Link>
      </span>
    </div>
  );
};

export default RegisterPage;
