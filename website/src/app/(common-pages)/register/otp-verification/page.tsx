"use client";

// import SvgIcon from "@/components/SvgIcon";
// import { post } from "@/services/api/api";
// import { API_POST_QUIZ_ANSWERS } from "@/services/api/endpoints";
import {LOCAL_STORAGE_USER_EMAIL} from "@/config/constants";
import {API_USER_VERIFY_OTP,} from "@/src/services/api/endpoints";
import {yupResolver} from "@hookform/resolvers/yup";
import {signIn} from "next-auth/react";
import {useRouter} from "next/navigation";
import {Suspense, useState} from "react";
import {useForm} from "react-hook-form";
import {FaArrowRightLong} from "react-icons/fa6";
import OtpInput from "react-otp-input";
import {useMutation} from "react-query";
import {object, string} from "yup";
import "./otpPageStyle.css";

export default function OtpVerify() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const otpUrl = API_USER_VERIFY_OTP;

  let loginSchema = object({
    email: string()?.email()?.required("Email is required"),
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(loginSchema) });

  const verifyOtpMutation = useMutation(
    async (data: any) =>
      await signIn("credentials", {
        ...data,
        redirect: false,
        otpVerfication: true,
        verifyOtpApi: otpUrl,
      }),
    {
      onSuccess: async (res) => {
        if (res?.ok) {
          window.localStorage.removeItem(LOCAL_STORAGE_USER_EMAIL);
          router.push("/dashboard");
        }
        if (!res?.ok) {
          setError(res?.error);
        }
      },
      onError: (err) => {
        if (err && err?.response) {
          setError(err?.response?.data?.message);
        }
      },
    }
  );

  const onFormSubmit = (data: any) => {
    setError("");
    const payload: any = {
      email: window.localStorage.getItem("userEmail"),
      otp: Number(otp),
    };
    verifyOtpMutation.mutate(payload);
  };

  return (
    <Suspense>
        <div className="otp-verify-container">
            {/* <SvgIcon name="otp_icon" className={'otp_icon'} /> */}
            <h2 className="otp-heading">Verify your number or email</h2>
            <p className="otp-description">
                We’ve sent you an OTP both on your mobile number & email
            </p>
            <div className="otp-box">
                <OtpInput
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderInput={(props) => <input {...props} />}
                />
            </div>
            {error !== "" && (
                <div className={"d-flex justify-content-center"}>
                    <div className={"alert alert-danger"}>{error}</div>
                </div>
            )}
            <div className="verify-btn flex justify-center">
                {
                    <button
                        className="otpVerifyBtn flex items-center gap-4"
                        type="submit"
                        onClick={onFormSubmit}
                    >
                        {verifyOtpMutation.isLoading ? (
                            "Loading...."
                        ) : (
                            <>
                                submit <FaArrowRightLong />
                            </>
                        )}
                    </button>
                }
            </div>
        </div>
    </Suspense>
  );
}
