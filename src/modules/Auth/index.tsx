import { Images } from "../../assets/images";
import { Button } from "@/components/ui/button";
import { api } from "../../lib/api";
import { useState } from "react";
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);
    try {
      await api.login(email, password);
      window.location.href = "/home";
    } catch (requestError) {
      console.error("Login error:", requestError);
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to sign in.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between min-h-screen w-full">
      {/* Left Column */}
      <div className="w-full xl:w-1/2 min-h-screen py-10 xl:pt-20 xl:pb-28 flex flex-col items-center px-6 sm:px-16 xl:px-28 relative">
        <div className="w-full max-w-xl">
          <div className="flex justify-center">
            <img src={Images[0]} alt="" className="w-20 h-25 object-contain" />
          </div>

          <p className="mt-16 font-medium text-base leading-relaxed">
            Meet Yiedie, the digital{" "}
            <span className="text-[#0F0282] font-semibold">
              Counseling and Consultation
            </span>{" "}
            platform designed for modern institutions. Provide accessible and
            organized counselling and consultation services through one secure
            digital platform.
          </p>

          <div className="w-full mt-20">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-color5 rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Academic Management & Career counselling
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-color5rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Financial Planning & Business Consultation
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-color5 rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Relationships & Marriage Counselling
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-color5 rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Religious and Spiritual Counselling etc.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap w-full mt-20">
            <div className="w-1/2 h-28 pr-2 pb-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-color4 border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-color5">100%</p>
                <p className="font-medium text-xs sm:text-sm text-white">
                  Verified Counsellors and Consultants
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pl-2 pb-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-color4 border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-color5">AI-Powered</p>
                <p className="font-medium text-xs sm:text-sm text-white">
                  Predictions
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pr-2 pt-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-color4 border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-color5">Real-time</p>
                <p className="font-medium text-xs sm:text-sm text-white">
                  Analytics and Live Chats supports
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pl-2 pt-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-color4 border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-color5">
                  360<sup>o</sup>{" "}
                </p>
                <p className="font-medium text-xs sm:text-sm text-white">
                  Security Management
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:absolute xl:bottom-10 px-6 sm:px-16 xl:px-28 w-full mt-12 xl:mt-0">
          <p className="text-xs sm:text-[14px] text-[#0A0332] ">
            Health | Education and Career | Relationship and Marriage | Finance
            | Legal | Personal | Religious & Spiritual | Social Support |
            Motivation and Inspiration |
          </p>
        </div>
      </div>

      {/* Right Column */}
      <div className=" bg-color4 w-full xl:w-1/2 min-h-screen py-10 xl:pt-20 xl:pb-28 flex flex-col items-center px-6 sm:px-16 xl:px-28 relative ">
        <div className="w-full max-w-xl">
          <div className="w-full mt-10  font-bold">
            <p className="text-3xl sm:text-4xl text-color5">Welcome back to</p>
            <p className="text-3xl sm:text-4xl text-color5">Yiedie,</p>
            <p className="text-3xl sm:text-4xl mt-20 text-white">
              Please Sign-in to continue
            </p>
            <p className="text-xs sm:text-sm mt-2 font-medium text-white">
              Enter your correct credentials to access the dashboard
            </p>
          </div>

          <div className="w-full mt-12">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              <label className="text-sm font-bold text-white" htmlFor="email">
                Email/Phone number
              </label>

              <input
                type="text"
                className="h-14 rounded-2xl mt-4 p-3 bg-white text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Enter your email / phone number"
                id="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />

              <label
                className="text-sm font-bold text-white mt-8"
                htmlFor="password"
              >
                Password
              </label>

              <input
                type="password"
                className="h-14 rounded-2xl mt-4 p-3 bg-white text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Enter your password"
                id="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />

              {error && <p className="mt-3 text-sm text-red-200">{error}</p>}

              <Button
                variant={"secondary"}
                type="submit"
                disabled={isSubmitting}
                className="mt-10 h-14 w-full rounded-2xl text-base text-white font-semibold bg-[#FEAD01] hover:bg-[#ff9900c8]"
              >
                {isSubmitting ? "Signing In..." : "Sign In"}
              </Button>
            </form>

            <a href="/forget-password">
              <p className="text-center mt-4 text-[#9D9D9D] underline font-semibold text-sm cursor-pointer hover:text-gray-600">
                Forgotten Password
              </p>
            </a>
          </div>
        </div>

        <div className="xl:absolute xl:bottom-10 w-full text-white flex flex-col items-center mt-12 xl:mt-0 px-6 sm:px-16 xl:px-28">
          <div className="flex gap-4 mt-5 text-sm">
            <span className="cursor-pointer hover:underline">policies</span>
            <span className="cursor-pointer hover:underline">Supports</span>
            <span className="cursor-pointer hover:underline">Help centre</span>
          </div>
          <p className="mt-2 text-center text-xs">
            Copyright © 2024-2025 AltBit Softwares. All rights reserved.
          </p>
          <p className=" mt-0.5 text-center text-xs">
            counselling and consultation app
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
