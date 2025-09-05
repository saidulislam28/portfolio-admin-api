"use client";

import Input from "@/src/components/forms/Input";
import { yupResolver } from "@hookform/resolvers/yup";
import { signIn } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { object, string } from "yup";

const ComponentName = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  let loginSchema = object({
    email: string().required("Email or phone is required"),
    password: string().required("Password is required"),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const onFormSubmit = async (data: any) => {

    console.log("clicked", data)

    setLoading(true);

    try {
      const response = await signIn("credentials", {
        email: data?.email,
        password: data?.password,
        redirect: false,
      });
      if (!response?.ok) {
        setLoading(false);
        setError(response?.error);
      } else {
        setError(null);
        setLoading(false);
        const historyPath = localStorage.getItem("history_path");
        if (historyPath) {
          router.replace(historyPath);
          localStorage.removeItem("history_path");
        } else {
          router.push("/");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="bg-body-background py-8">
      <div className="main-container flex-col flex-col-reverse lg:flex-row flex items-center justify-between gap-10">
        <form
          onSubmit={handleSubmit(onFormSubmit)}
          className=" border border-border-light p-8 bg-white w-full lg:w-[50%]"
        >
          <h2 className="text-center py-6 text-4xl font-semibold text-text-secondary">Login</h2>

          {error && <p className="text-sm text-red-500">{error}</p>}
          <div className="my-4">
            <Input
              label="Email Or phone"
              name="email"
              placeholder="Enter phone number or email"
              type="email"
              isRequired={true}
              errors={errors}
              register={register}
            />
          </div>
          <div className="my-4">
            <Input
              label=""
              name="password"
              placeholder="Enter password"
              isRequired={true}
              errors={errors}
              register={register}
              type="password"
            />
            {/* <p className="text-end text-blue-600 font-semibold cursor-pointer mt my-4">
                          Forget Password
                      </p> */}
          </div>

          <button
            className="w-full py-2  font-medium bg-orange-500 text-white hover:bg-orange-100 transition-all duration-300 mt-4"
            disabled={loading}
            type="submit"
          >
            {loading ? "Loading...." : "Login"}
          </button>
          <p className="mt-4 font-medium text-lg text-text-secondary">
            Don't have an account?{" "}
            <Link href="/register" className="text-primary hover:text-blue-600">
              Register now
            </Link>
          </p>
        </form>
        <div className="lg:w-[50%] w-full">
          <Image
            height={440}
            width={550}
            className="size-full object-cover"
            src="/img/login.svg"
            alt="login image"
          />
        </div>
      </div>
    </div>
  );
};

export default ComponentName;
