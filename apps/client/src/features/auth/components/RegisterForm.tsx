import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/shared/ui/card";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { registerUserSchema } from "../schema/auth";
import { useForm } from "react-hook-form";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/shared/ui/field";
import { Input } from "@/shared/ui/input";
import { Button } from "@/shared/ui/button";
import type { RegisterUser } from "../types/user.type";
import { signup } from "../services/auth.service";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import { toast } from "sonner";
import { useNavigate } from "react-router";

const RegisterForm = () => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState("");

  const setUser = useAuthStore((state) => state.setUser);
  const navigate = useNavigate();

  const { register, formState, handleSubmit } = useForm<
    z.infer<typeof registerUserSchema>
  >({
    resolver: zodResolver(registerUserSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (payloadUser: RegisterUser) => {
    console.log("onsubmit has params user as ", payloadUser);

    try {
      setLoading(true);

      const user = await signup(payloadUser);
      setUser(user);

      toast.success("User registered successfully");

      setTimeout(() => {
        navigate("/profile");
      }, 800);
    } catch (error) {
      if (error instanceof Error) {
        setErrors(error.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>Register to continue next</CardHeader>

      <CardDescription>Please register to play chess </CardDescription>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)}>
          <FieldGroup>
            <Field>
              <FieldLabel>Username</FieldLabel>
              <Input
                placeholder="enter your username"
                {...register("username")}
              />

              {formState.errors.username && (
                <FieldError errors={[formState.errors.username]} />
              )}
            </Field>

            <Field>
              <FieldLabel>Email</FieldLabel>
              <Input placeholder="enter your email" {...register("email")} />

              {formState.errors.email && (
                <FieldError errors={[formState.errors.email]} />
              )}
            </Field>

            <Field>
              <FieldLabel>Password</FieldLabel>
              <Input
                placeholder="enter your password"
                {...register("password")}
              />

              {formState.errors.password && (
                <FieldError errors={[formState.errors.password]} />
              )}
            </Field>
          </FieldGroup>

          <Button disabled={loading}>
            {loading ? "Signing up....." : "Sign up"}
          </Button>
        </form>
      </CardContent>

      <Field>{errors && <p className="text-red-400">{errors}</p>}</Field>
    </Card>
  );
};

export default RegisterForm;
