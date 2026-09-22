import { Images } from "../../assets/images";
import { Button } from "@/components/ui/button";
import ArrowBackIcon from "@iconify-react/material-symbols/arrow-back";
import BaselineCloseIcon from "@iconify-react/ic/baseline-close";
import { useState } from "react";

const ForgotPassword = () => {
  const [showDialogBox, setShowDialogBox] = useState(false);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#f8fafc] py-6 px-4 sm:px-8 md:px-12 xl:px-28 items-center justify-between">
      {/* Responsive Dialog / Modal Box */}
      {showDialogBox && (
        <div className="flex items-center justify-center fixed inset-0 bg-[#000000c7] z-40 p-4 overflow-y-auto">
          <div className="relative flex flex-col items-center w-full max-w-md p-6 sm:p-10 my-auto rounded-3xl bg-white shadow-xl">
            <BaselineCloseIcon
              onClick={() => setShowDialogBox(false)}
              className="absolute right-4 top-4 w-6 h-6 sm:w-7 sm:h-7 cursor-pointer text-gray-500 hover:text-black"
            />
            <img
              src={Images[1]}
              alt="mail"
              className="w-12 h-12 mt-6 object-contain"
            />
            <p className="font-bold mt-6 text-2xl sm:text-3xl text-center text-[#0A0332]">
              Check your email
            </p>
            <p className="font-medium mt-6 text-sm sm:text-base text-center text-gray-600">
              We’ve sent a reset link and an OTP to
            </p>
            <p className="font-bold mt-2 text-sm sm:text-base text-center text-[#0A0332] break-all">
              oli********@untitledui.com
            </p>
            <Button
              onClick={() => setShowDialogBox(false)}
              className="w-full py-6 text-base font-semibold hover:bg-[#1900ffb9] bg-[#1900FF] mt-8 rounded-2xl"
            >
              Done
            </Button>
            <a
              onClick={() => setShowDialogBox(false)}
              className="flex items-center gap-4 mt-8 w-full cursor-pointer"
            >
              <span className="grow border-t border-gray-300"></span>
              <div className="flex items-center gap-2 shrink-0 text-gray-700 hover:text-[#1900FF]">
                <ArrowBackIcon height="1em" />
                <p className="text-sm font-medium">Back to login</p>
              </div>
              <span className="grow border-t border-gray-300"></span>
            </a>
          </div>
        </div>
      )}

      {/* Top Header / Branding */}
      <div className="flex flex-col items-center w-full max-w-xl ">
        <div className="flex items-center gap-2 mt-20 sm:mt-20">
          <img
            src={Images[0]}
            alt="AltBit Softwares"
            className="w-8 h-8 object-contain"
          />
          <p className="font-[1000] text-xl sm:text-2xl text-[#0C0332]">
            AltBit Softwares
          </p>
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-[#1900FF]">
            Forgot Password?
          </h1>
          <p className="text-sm text-gray-500 mt-2">
            No worries, we'll send you reset instructions.
          </p>
        </div>
      </div>

      <div className="w-full max-w-xl sm:max-w-2xl bg-[#F4F9FF] border border-[#D3D5FF] shadow-sm rounded-3xl p-6 sm:p-12 my-6 sm:my-8">
        <div className="mb-6 sm:mb-8">
          <h2 className="text-lg font-bold text-[#0A0332]">Reset password</h2>
          <p className="text-sm text-gray-500 mt-1">
            Enter your email you used in creating your account
          </p>
        </div>

        <form className="flex flex-col" onSubmit={(e) => e.preventDefault()}>
          {/* Select Reset Method */}
          <label
            className="text-sm font-bold text-[#0A0332]"
            htmlFor="resetMethod"
          >
            Select reset method
          </label>
          <div className="bg-[#bbb1ff50] mt-2 rounded-2xl pr-2">
            <select
              className="h-14 w-full p-3 rounded-2xl text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF] border border-transparent bg-transparent cursor-pointer"
              id="resetMethod"
              defaultValue=""
            >
              <option value="" disabled>
                Select email or phone number
              </option>
              <option value="email">Email</option>
              <option value="phone">Phone Number</option>
            </select>
          </div>

          {/* Email Input */}
          <label
            className="text-sm font-bold text-[#0A0332] mt-6"
            htmlFor="email"
          >
            Email
          </label>
          <input
            type="email"
            className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF] border border-transparent"
            placeholder="Enter your email"
            id="email"
          />

          {/* Submit Button */}
          <Button
            type="button"
            variant={"secondary"}
            onClick={() => setShowDialogBox(true)}
            className="mt-8 h-14 w-full rounded-2xl text-base text-white font-semibold bg-[#1900FF] hover:bg-[#1900ffa2]"
          >
            Reset Password
          </Button>
        </form>

        {/* Back to Login Link */}
        <div className="flex justify-center mt-6">
          <a
            href="/"
            // onClick={(e) => e.preventDefault()}
            className="text-sm font-semibold text-[#0A0332] hover:text-[#1900FF] flex items-center gap-1 cursor-pointer"
          >
            ← Back to log in
          </a>
        </div>
      </div>

      <div className="w-full flex flex-col items-center mt-4">
        <div className="flex flex-wrap justify-center gap-4 sm:gap-6 text-sm">
          <span className="text-[#9D9D9D] cursor-pointer hover:underline">
            policies
          </span>
          <span className="text-[#9D9D9D] cursor-pointer hover:underline">
            Supports
          </span>
          <span className="text-[#9D9D9D] cursor-pointer hover:underline">
            Help centre
          </span>
        </div>
        <p className="text-[#9D9D9D] mt-3 text-center text-xs">
          Copyright © 2024-2025 AltBit Softwares. All rights reserved.
        </p>
        <p className="text-[#9D9D9D] mt-0.5 text-center text-xs">
          counselling and consultation app
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
