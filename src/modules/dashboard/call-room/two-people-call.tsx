import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Icon } from "@iconify/react";

const TwoPeopleCall = () => {
  const [message, setMessage] = useState("");

  const iconClass =
    "text-[#9AB3DA] text-xl cursor-pointer hover:text-white transition-colors";

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    setMessage("");
  };

  return (
    <div className="grid gap-2 grid-cols-12 h-screen p-2 overflow-hidden">
      {/* Left Column Container */}
      <div className="col-span-8 gap-2 h-full flex">
        {/* Sidebar Container */}
        <div className="flex relative flex-col items-center pt-7 pb-20 w-20 h-full border bg-color4 rounded-3xl shrink-0">
          {/* User Avatar */}
          <Avatar className="h-11 w-11 shrink-0 cursor-pointer">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>abihsolo</AvatarFallback>
          </Avatar>

          <div className="border-t border-[#59595C] my-5 w-[40%]" />

          {/* Navigation Section 1 */}
          <div className="flex flex-col items-center gap-6">
            <Icon icon="akar-icons:home-alt1" className={iconClass} />
            <Icon icon="stash:people-group-duotone" className={iconClass} />
            <Icon icon="fluent:organization-20-regular" className={iconClass} />
          </div>

          <div className="border-t border-[#59595C] my-5 w-[40%]" />

          {/* Navigation Section 2 */}
          <div className="flex flex-col items-center gap-6">
            <Icon icon="mage:message-round" className={iconClass} />
            <Icon icon="ic:outline-add-reaction" className={iconClass} />
            <Icon icon="ci:add-plus" className={iconClass} />
          </div>

          <div className="border-t border-[#59595C] my-5 w-[40%]" />

          {/* Navigation Section 3 */}
          <div className="flex flex-col items-center gap-6">
            <Icon icon="akar-icons:airplay-video" className={iconClass} />
            <Icon icon="akar-icons:star" className={iconClass} />
          </div>
          <div className="border-t border-[#59595C] my-5 w-[40%]" />

          {/* Bottom Settings Icon */}
          <div className="absolute bottom-6">
            <Icon icon="ant-design:setting-outlined" className={iconClass} />
          </div>
        </div>

        {/* Main Content View */}
        <div className="w-full h-full flex flex-col gap-2">
          {/* Top Meeting Header */}
          <div className="h-24 shrink-0 rounded-2xl px-4 bg-[#F3F7FF] border border-[#ACA9FF] flex items-center justify-between">
            <div className="flex gap-2 items-center">
              <button
                type="button"
                className="h-10 w-10 rounded-full flex items-center justify-center"
              >
                <Icon icon="circum:circle-chev-left" height="1.5em" />
              </button>
              <div>
                <p className="text-xl text-[#000057]">
                  Our Weekly Project Meeting
                </p>
                <div className="flex gap-10 mt-1">
                  <p className="text-xs">15th September, 2026</p>
                  <p className="text-xs">
                    Participants :{" "}
                    <span className="bg-amber-600 p-1 rounded-full text-white px-2">
                      2
                    </span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex gap-2 items-end h-full pb-5">
              <button
                type="button"
                className="h-7 w-20 bg-red-600 rounded-md text-xs text-white"
              >
                Record
              </button>
              <button
                type="button"
                className="h-7 w-20 bg-[#EEEEFF] rounded-md text-xs"
              >
                8:30:49
              </button>
            </div>
          </div>

          {/* Video Grid Feed */}
          <div className="grid grid-cols-12 gap-2 flex-1 min-h-0">
            {/* Local Video Stream Container */}
            <div className="col-span-6 border border-[#ACA9FF] h-full rounded-2xl relative bg-black/5 overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>abihsolo</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs">Amanda</p>
                  <p className="text-[10px]">you</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-2 h-10 w-10 rounded-full bg-black justify-center cursor-pointer z-10">
                <Icon
                  icon="eva:expand-fill"
                  height="1.5em"
                  className="text-white"
                />
              </div>

              {/* Floating Media Controls Bar */}
              <div className="bg-black rounded-xl h-20 absolute bottom-10 left-10 right-10 flex gap-2 justify-center items-center z-10">
                <button
                  type="button"
                  className="bg-[#f3f7ffb5] h-10 w-10 rounded-full flex justify-center items-center"
                >
                  <Icon
                    icon="fluent:video-off-16-regular"
                    height="1.5em"
                    className="text-[#000057]"
                  />
                </button>
                <button
                  type="button"
                  className="bg-[#f3f7ffb5] h-10 w-10 rounded-full flex justify-center items-center"
                >
                  <Icon
                    icon="bi:mic-mute"
                    height="1.5em"
                    className="text-[#000057]"
                  />
                </button>
                <button
                  type="button"
                  className="bg-[#FF9001] h-10 w-24 rounded-full flex justify-center items-center"
                >
                  <Icon
                    icon="fluent:call-32-regular"
                    height="2.5em"
                    className="text-white"
                  />
                </button>
                <button
                  type="button"
                  className="bg-[#f3f7ffb5] h-10 w-10 rounded-full flex justify-center items-center"
                >
                  <Icon
                    icon="qlementine-icons:menu-dots-16"
                    height="1.5em"
                    className="text-[#000057]"
                  />
                </button>
              </div>
            </div>

            {/* Remote Video Stream Container */}
            <div className="col-span-6 border border-[#ACA9FF] h-full rounded-2xl relative bg-black/5 overflow-hidden">
              <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>abihsolo</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs">Amanda</p>
                  <p className="text-[10px]">other user</p>
                </div>
              </div>
              <div className="absolute top-2 right-2 flex items-center gap-2 h-10 w-10 rounded-full bg-black justify-center cursor-pointer z-10">
                <Icon
                  icon="eva:expand-fill"
                  height="1.5em"
                  className="text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Chat Section */}
      <div className="col-span-4 h-full rounded-2xl px-4 pb-4 bg-[#F3F7FF] border border-[#ACA9FF] flex flex-col justify-between overflow-hidden">
        {/* Chat Feed */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-1">
          <div className="border-y h-10 mt-6 mb-4 border-[#ACA9FF] flex items-center sticky top-0 bg-[#F3F7FF] z-10">
            <p>
              Chat <span className="text-[#FF9001]"> (19) </span>
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>abihsolo</AvatarFallback>
            </Avatar>
            <div className="p-2 bg-[#EEEEFF] rounded-2xl">
              <p className="text-xs">Lorem ipsum dolor sit amet</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2">
            <div className="p-2 bg-[#EEEEFF] rounded-2xl">
              <p className="text-xs">Lorem ipsum dolor sit amet</p>
            </div>
            <Avatar className="h-9 w-9 shrink-0 cursor-pointer">
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>abihsolo</AvatarFallback>
            </Avatar>
          </div>
        </div>

        {/* Input Bar Section */}
        <form
          onSubmit={handleSendMessage}
          className="mt-2 flex gap-2 justify-center items-center shrink-0"
        >
          <div className="h-11 w-full border border-[#ACA9FF] bg-white/50 rounded-xl flex items-center justify-between px-3 min-w-0 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#1900FF]/40 focus-within:shadow-md">
            <div className="flex gap-2 items-center flex-1 h-full min-w-0">
              <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 hover:rotate-90 active:scale-90 shrink-0">
                <Icon icon="akar-icons:plus" height="1.1em" />
              </div>
              <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90 shrink-0">
                <Icon icon="mdi:sticker-emoji" height="1.1em" />
              </div>
              <input
                type="text"
                placeholder="Type a message..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="text-xs h-full w-full min-w-0 py-2 bg-transparent outline-none text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
              />
            </div>
            <div className="flex gap-2 items-center shrink-0">
              <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 hover:rotate-12 active:scale-90 shrink-0">
                <Icon icon="mingcute:emoji-2-line" height="1.1em" />
              </div>
              <button
                type="button"
                className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
              >
                <Icon icon="codicon:mic" height="1.1em" />
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="h-11 w-11 bg-color4 rounded-full flex justify-center items-center shrink-0"
          >
            <Icon icon="bi:send" height="1em" className="text-white" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TwoPeopleCall;
