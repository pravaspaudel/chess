import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { useForm } from "react-hook-form";
import { loginUserSchema } from "../schema/auth";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/shared/ui/button";
import useAuthStore from "../store/useAuthStore";
import type { LoginUser } from "../types/user.type";
import { login } from "../services/auth.service";
import { useState } from "react";
import { useNavigate } from "react-router";

const LoginForm = () => {
  const setUser = useAuthStore((state) => state.setUser);

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { register, handleSubmit, formState } = useForm<
    z.infer<typeof loginUserSchema>
  >({
    resolver: zodResolver(loginUserSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginUser) => {
    try {
      console.log("this is onsubmit login form");
      console.log("values are ", values);
      setLoading(true);

      const response = await login(values);

      setUser(response);

      navigate("/profile");
    } catch (error) {
      console.log(error);

      if (error instanceof Error) {
        setError(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login to play chess</CardTitle>
        <CardDescription>Please enter your credentials</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input
                placeholder="enter your email"
                {...register("email")}
              ></Input>

              {formState.errors.email && (
                <FieldError errors={[formState.errors.email]} />
              )}
            </Field>
          </FieldGroup>

          <FieldGroup>
            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                placeholder="enter your password"
                {...register("password")}
              ></Input>

              {formState.errors.password && (
                <FieldError errors={[formState.errors.password]} />
              )}
            </Field>
          </FieldGroup>

          <Button type="submit" disabled={loading}>
            {loading ? "submitting......" : "Submit "}
          </Button>
        </form>
      </CardContent>

      <Field>{error && <p className="text-red-500 text-sm">{error}</p>}</Field>
    </Card>
  );
};

export default LoginForm;
