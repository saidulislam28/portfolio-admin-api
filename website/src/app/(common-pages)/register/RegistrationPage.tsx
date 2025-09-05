"use client";

import ErrorMessage from "@/src/components/forms/ErrorMessage";
import Input from "@/src/components/forms/Input";
import { post } from "@/src/services/api/api";
import { API_REGISTRATION } from "@/src/services/api/endpoints";
import { yupResolver } from "@hookform/resolvers/yup";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { object, ref, string } from "yup";

const RegisterPage = () => {
  const [isAgree, setIsAgree] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  let userSchema = object({
    name: string().required("Name is required"),
    email: string().email().required("Email is required"),
    password: string().required("Password is required"),
    confirm_password: string()
      .required("Confirm Password is required")
      .oneOf([ref("password")], "Passwords and confirm Password do not match"),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, dirtyFields },
  } = useForm({ resolver: yupResolver(userSchema) });

  const registerMutation = useMutation(async (data) => await post(API_REGISTRATION, data), {
    onSuccess: (res) => {
      // const userInfo = encryptData(res.data);     

        if(res.success){
          toast.success("Registration User Successful")
          router.push("/");
        }

    },
    onError: (err) => {
      setError(err?.response?.data?.message);
      toast.error(err?.response?.data?.message);
    },
  });

  const onFormSubmit = (data: any) => {
    window.localStorage.setItem("userEmail", data?.email);
    const loginInfo: any = {
      name: data?.name,
      email: data?.email,
      password: data?.password,
    };

    registerMutation.mutate({ ...loginInfo });
  };

  return (
    <div className="bg-body-background py-8">
      <div className="main-container flex items-center flex-col lg:flex-row flex-col-reverse gap-10">
        <form
          className="p-10 border border-border-light bg-white space-y-4 w-full lg:w-[50%]"
          onSubmit={handleSubmit(onFormSubmit)}
        >
          <h2 className="text-center py-6 text-4xl font-semibold text-text-secondary">
            Registration
          </h2>
          <div className="form-group">
            {errors.name && errors.name?.message && (
              <ErrorMessage className={"invalid-feedback"} text={errors.name?.message} />
            )}

            <Input
              register={register}
              name="name"
              isRequired={true}
              errors={errors}
              placeholder="Your Full Name"
              type="text"
            />
          </div>
          <div className="form-group">
            <Input
              register={register}
              name="email"
              isRequired={true}
              errors={errors}
              placeholder="Your email or phone"
              type="email"
            />
          </div>

          <div className="form-group">
            <Input
              register={register}
              name="password"
              isRequired={true}
              errors={errors}
              placeholder="password"
              type="password"
            />
          </div>
          <div className="form-group">
            <Input
              register={register}
              name="confirm_password"
              isRequired={true}
              errors={errors}
              placeholder="Confirm password"
              type="password"
            />
          </div>

          <div className="flex items-center gap-4">
            <input
              className="form-control"
              type="checkbox"
              name="agree_terms_and_policy"
              id="agree-terms-and-policy"
              onChange={() => setIsAgree(!isAgree)}
            />
            <label htmlFor="agree-terms-and-policy text-black-text ">
              I agree to all the terms and conditions.
            </label>
          </div>

          <button
            disabled={!isAgree}
            className="w-full py-2 text-black-text font-medium bg-orange-500 text-white hover:bg-orange-100 transition-all duration-300"
            type="submit"
          >
            {registerMutation?.isLoading ? "Loading..." : "Sign up"}
          </button>

          <p className="font-medium text-lg text-text-secondary ">
            Already have an account?
            <Link href="/login" className="text-primary hover:text-blue-600 ml-3">
              Log in
            </Link>
          </p>
        </form>
        <div className="w-full lg:w-[50%]">
          <img className="size-full object-cover" src="/img/login.svg" alt="login image" />
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
