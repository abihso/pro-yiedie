import { Images } from "../../assets/images";
import { Button } from "@/components/ui/button";
import { api } from "../../lib/api";
import { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    role: "",
    firstName: "",
    middleName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const updateField = (field: keyof typeof form, value: string) =>
    setForm((current) => ({ ...current, [field]: value }));
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (form.role !== "client" && form.role !== "counsellor") {
      setError("Select a valid account role.");
      return;
    }
    setIsSubmitting(true);
    try {
      await api.register(
        `${form.firstName} ${form.middleName} ${form.lastName}`
          .replace(/\s+/g, " ")
          .trim(),
        form.email,
        form.password,
        form.role,
      );
      window.location.href = "/home";
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col xl:flex-row justify-between min-h-screen w-full">
      {/* Left Column (Maintained from Login for branding consistency) */}
      <div className="w-full xl:w-1/2 min-h-screen py-10 xl:pt-20 xl:pb-28 flex flex-col items-center px-6 sm:px-16 xl:px-28 relative">
        <div className="w-full max-w-xl">
          <div className="flex items-center gap-3 rounded-3xl border w-fit px-10 border-[#04EEFF] bg-[#E7F2FF]">
            <img src={Images[0]} alt="" className="w-10 h-20 object-contain" />
            <p className="font-bold text-4xl ml-2">Yiedie</p>
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
              <div className="w-3 h-3 bg-[#1900FF] rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Academic Management & Career counselling
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-[#1900FF] rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Financial Planning & Business Consultation
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-[#1900FF] rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Relationships & Marriage Counselling
              </p>
            </div>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-3 h-3 bg-[#1900FF] rounded-full shrink-0" />
              <p className="text-[#0F0282] font-bold text-sm sm:text-base">
                Religious and Spiritual Counselling etc.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap w-full mt-20">
            <div className="w-1/2 h-28 pr-2 pb-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-[#F4F9FF] border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-[#0F0282]">100%</p>
                <p className="font-medium text-xs sm:text-sm text-gray-700">
                  Verified Counsellors and Consultants
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pl-2 pb-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-[#F4F9FF] border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-[#0F0282]">AI-Powered</p>
                <p className="font-medium text-xs sm:text-sm text-gray-700">
                  Predictions
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pr-2 pt-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-[#F4F9FF] border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-[#0F0282]">Real-time</p>
                <p className="font-medium text-xs sm:text-sm text-gray-700">
                  Analytics and Live Chats supports
                </p>
              </div>
            </div>
            <div className="w-1/2 h-28 pl-2 pt-3">
              <div className="h-full rounded-3xl px-4 sm:px-7 bg-[#F4F9FF] border border-[#D0E2FF] flex flex-col justify-center">
                <p className="font-bold text-xl text-[#0F0282]">
                  360<sup>o</sup>{" "}
                </p>
                <p className="font-medium text-xs sm:text-sm text-gray-700">
                  Security Management
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="xl:absolute xl:bottom-10 px-6 sm:px-16 xl:px-28 w-full mt-12 xl:mt-0">
          <p className="text-xs sm:text-[14px] text-gray-500">
            Health | Education and Career | Relationship and Marriage | Finance
            | Legal | Personal | Religious & Spiritual | Social Support |
            Motivation and Inspiration |
          </p>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="bg-[#ebf6ff] w-full xl:w-1/2 min-h-screen py-10 xl:pt-20 xl:pb-28 flex flex-col items-center px-6 sm:px-16 xl:px-28 relative">
        <div className="w-full max-w-xl">
          <div className="w-full mt-6 text-[#1900FF] font-bold">
            <p className="text-3xl sm:text-4xl">Welcome to Yiedie,</p>
            <p className="text-3xl sm:text-4xl mt-2">
              Please Sign-up to continue
            </p>
            <p className="text-xs sm:text-sm mt-2 font-medium text-gray-600">
              Enter your correct details to create your account
            </p>
          </div>

          <div className="w-full mt-8">
            <form className="flex flex-col" onSubmit={handleSubmit}>
              {/* Role */}
              <label
                className="text-sm font-bold text-[#0A0332]"
                htmlFor="role"
              >
                Role <span className="text-red-500">*</span>
              </label>
              <div className="bg-[#bbb1ff50] rounded-2xl pr-2 mt-2">
                <select
                  className="h-14 w-full rounded-2xl p-3  text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                  id="role"
                  value={form.role}
                  onChange={(event) => updateField("role", event.target.value)}
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="client">Student / Client</option>
                  <option value="counsellor">Counsellor / Consultant</option>
                </select>
              </div>

              {/* First Name & Middle Name */}
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label
                    className="text-sm font-bold text-[#0A0332]"
                    htmlFor="firstName"
                  >
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                    placeholder="Enter your first name"
                    id="firstName"
                    value={form.firstName}
                    onChange={(event) =>
                      updateField("firstName", event.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col w-full sm:w-1/2">
                  <label
                    className="text-sm font-bold text-[#0A0332]"
                    htmlFor="middleName"
                  >
                    Middle Name
                  </label>
                  <input
                    type="text"
                    className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                    placeholder="Enter your middle name"
                    id="middleName"
                    value={form.middleName}
                    onChange={(event) =>
                      updateField("middleName", event.target.value)
                    }
                  />
                </div>
              </div>

              {/* Last Name */}
              <label
                className="text-sm font-bold text-[#0A0332] mt-6"
                htmlFor="lastName"
              >
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Enter your last name"
                id="lastName"
                value={form.lastName}
                onChange={(event) =>
                  updateField("lastName", event.target.value)
                }
              />

              {/* Email */}
              <label
                className="text-sm font-bold text-[#0A0332] mt-6"
                htmlFor="email"
              >
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Enter email"
                id="email"
                value={form.email}
                onChange={(event) => updateField("email", event.target.value)}
              />

              {/* Password */}
              <label
                className="text-sm font-bold text-[#0A0332] mt-6"
                htmlFor="password"
              >
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Enter password"
                id="password"
                value={form.password}
                onChange={(event) =>
                  updateField("password", event.target.value)
                }
              />

              {/* Confirm Password */}
              <label
                className="text-sm font-bold text-[#0A0332] mt-6"
                htmlFor="confirmPassword"
              >
                Confirm password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className="h-14 rounded-2xl mt-2 p-3 bg-[#bbb1ff50] text-sm sm:text-base outline-none focus:ring-2 focus:ring-[#1900FF]"
                placeholder="Confirm password"
                id="confirmPassword"
                value={form.confirmPassword}
                onChange={(event) =>
                  updateField("confirmPassword", event.target.value)
                }
              />

              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

              <Button
                variant={"secondary"}
                type="submit"
                disabled={isSubmitting}
                className="mt-8 h-14 w-full rounded-2xl text-base text-white font-semibold bg-[#1900FF] hover:bg-[#1900ffa2]"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
            </form>

            <div className="flex justify-center items-center gap-1 mt-4 text-sm font-semibold">
              <span className="text-[#9D9D9D]">already has an account,</span>
              <a href="#signin" onClick={(e) => e.preventDefault()}>
                <span className="text-[#1900FF] hover:underline cursor-pointer">
                  sign in
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="xl:absolute xl:bottom-10 w-full flex flex-col items-center mt-12 xl:mt-0 px-6 sm:px-16 xl:px-28">
          <div className="flex gap-4 mt-5 text-sm">
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
          <p className="text-[#9D9D9D] mt-2 text-center text-xs">
            Copyright © 2024-2025 AltBit Softwares. All rights reserved.
          </p>
          <p className="text-[#9D9D9D] mt-0.5 text-center text-xs">
            counselling and consultation app
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
