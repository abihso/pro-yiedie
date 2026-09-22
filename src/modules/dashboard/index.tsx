import { ProfileMenu } from "../../components/profile";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Images } from "../../assets/images";
import { ChevronRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { MouseEvent } from "react";
import { api, type Counsellor, type User } from "../../lib/api";
import Calendar from "../../components/calendar";
import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarImage,
  AvatarGroupCount,
} from "@/components/ui/avatar";

const Dashboard = () => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<User | null>(null);
  const [counsellors, setCounsellors] = useState<Counsellor[]>([]);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    Promise.all([api.me(), api.counsellors()])
      .then(([currentUser, counsellorResponse]) => {
        setUser(currentUser);
        setCounsellors(counsellorResponse.counsellors);
      })
      .catch((requestError) => {
        setLoadError(
          requestError instanceof Error
            ? requestError.message
            : "Unable to load your dashboard.",
        );
        window.location.href = "/";
      });
  }, []);

  const [activeTab, setActiveTab] = useState("Dashboard-0");

  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeftState, setScrollLeftState] = useState(0);

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (!scrollRef.current) return;
    setIsDragging(true);
    setStartX(e.pageX - scrollRef.current.offsetLeft);
    setScrollLeftState(scrollRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !scrollRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollRef.current.scrollLeft = scrollLeftState - walk;
  };

  const navItems = ["Dashboard", "Why Yiedie", "How it works", "Pricing"];

  return (
    <div className="min-h-screen bg-[#f8fafc] overflow-x-hidden">
      {/* Top Header Section */}
      <div className="min-h-48 bg-[#e5e5e5e3] px-3 sm:px-5 pb-5 overflow-visible">
        <div className="h-14 border-black flex flex-wrap lg:flex-nowrap justify-between items-center w-full gap-2 overflow-visible">
          {/* Left Navigation and Logo */}
          <div className="h-full flex items-center gap-2 sm:gap-4 overflow-x-auto lg:overflow-visible scrollbar-none w-full lg:w-auto">
            <div className="bg-white mt-9 w-fit p-2 rounded-2xl h-16 shrink-0 flex items-center justify-center relative z-50 shadow-md transition-transform duration-300 hover:scale-105 cursor-pointer">
              <img
                src={Images[0]}
                alt=""
                className="w-10 h-10 object-contain"
              />
            </div>

            {/* Dynamic Navigation Tabs */}
            {navItems.map((item, index) => {
              const isActive = activeTab === `${item}-${index}`;
              return (
                <div
                  key={index}
                  onMouseEnter={() => setActiveTab(`${item}-${index}`)}
                  onClick={() => setActiveTab(`${item}-${index}`)}
                  className={`border-t-4 transition-all duration-300 flex justify-center items-end h-full w-fit shrink-0 cursor-pointer ${
                    isActive ? "border-[#A8A8AD]" : "border-transparent"
                  }`}
                >
                  <p
                    className={`font-extrabold py-1 px-2 rounded-b-lg transition-all duration-200 text-xs sm:text-sm active:scale-95 select-none ${
                      isActive
                        ? "bg-[#A8A8AD] text-white -translate-y-0.5"
                        : "text-[#000057] hover:text-[#1900FF]"
                    }`}
                  >
                    {item}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Right Notifications and Profile */}
          <div className="h-full flex items-center justify-end pt-5 shrink-0 ml-auto lg:ml-0">
            <div className="flex items-center gap-2 h-1/2">
              <Icon
                icon="mingcute:notification-fill"
                className="-mt-1 cursor-pointer shrink-0 transition-transform duration-200 hover:scale-125 hover:-rotate-12 active:scale-90"
                color="#09024B"
                fontSize={22}
              />
              <Icon
                icon="mage:message-fill"
                className="-mt-1 cursor-pointer shrink-0 transition-transform duration-200 hover:scale-125 hover:rotate-12 active:scale-90"
                color="#09024B"
                fontSize={22}
              />
              <div className="w-fit border-black shrink-0 transition-transform duration-200 hover:scale-105">
                <ProfileMenu />
              </div>
            </div>
          </div>
        </div>

        {/* Hero Search Area */}
        <div className="mt-16 sm:mt-18">
          <p className="text-[#000057] font-extrabold text-xl sm:text-3xl">
            {user
              ? `Welcome back, ${user.fullName}`
              : "Loading your account..."}
          </p>
          <p className="text-[#000057] font-extrabold text-xl sm:text-3xl">
            Find a perfect and professional counselor
          </p>
          {loadError && (
            <p className="text-red-600 text-sm mt-2">{loadError}</p>
          )}
          <div className="bg-color6 h-auto rounded-3xl sm:rounded-full mt-2 px-3 py-3 sm:py-2 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-sm transition-all duration-300 hover:shadow-md">
            <div className="border-b sm:border-b-0 sm:border-r-2 h-auto sm:h-3/5 border-[#B6B6B6] pb-2 sm:pb-0 sm:pl-6 sm:pr-6 w-full sm:w-2/10 flex gap-4 items-center shrink-0">
              <Icon
                icon="ri:search-fill"
                className="text-white text-xl sm:text-2xl shrink-0 transition-transform duration-200 hover:scale-110"
              />
              <p className="text-white text-sm whitespace-nowrap">
                service type keyword
              </p>
            </div>

            <div className="w-full h-full flex flex-col sm:flex-row items-center gap-3">
              <div className="relative flex items-center w-full h-12">
                <Icon
                  icon="duo-icons:location"
                  className="absolute left-4 text-xl sm:text-2xl text-white z-10 pointer-events-none"
                />
                <input
                  type="text"
                  className="w-full h-full text-white rounded-full pl-14 sm:pl-16 pr-4 bg-color6 sm:bg-transparent outline-none border sm:border-none text-sm transition-all duration-200 focus:bg-white focus:ring-2 focus:ring-[#1900FF]/30"
                  placeholder="service type keyword"
                />
              </div>
              <Button
                variant={"secondary"}
                className={
                  "bg-color5 hover:bg-[#1900ffb7] font-bold w-full sm:w-50 rounded-full h-12 text-white px-8 shrink-0 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                }
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories Scroll & Banner Row */}
      <div className="flex flex-col xl:flex-row my-5 px-3 sm:px-5 items-stretch xl:items-center gap-4">
        <div className="w-full xl:w-20 flex items-center justify-between gap-3 shrink-0">
          <div className="bg-[#1900FF] w-fit rounded-lg p-1 transition-transform duration-200 hover:scale-105 shadow-sm">
            <Icon
              icon="material-symbols:dashboard-rounded"
              className="w-10 h-10 text-white"
            />
          </div>
          {/* <button
            onClick={() => scroll("left")}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 active:scale-90 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
          >
            <ChevronLeft />
          </button> */}
        </div>

        <div
          className={`flex items-center gap-3 overflow-x-auto scrollbar-none px-2 py-1 w-full scroll-smooth [-webkit-overflow-scrolling:touch] select-none ${
            isDragging ? "cursor-grabbing" : "cursor-grab"
          }`}
          ref={scrollRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {[
            "Health & Wellness",
            "Education",
            "Relationships",
            "Family",
            "Finance",
            "Career",
            "Career",
            "Family",
          ].map((item, idx) => (
            <Button
              key={idx}
              variant="default"
              className="shrink-0 text-[#010158] font-extrabold h-15 w-48 border border-[#A19EFF] rounded-2xl bg-[#EDEBFF] hover:bg-[#1900FF] hover:text-white shadow-none cursor-pointer transition-all duration-200 hover:-translate-y-0.5 active:scale-95"
            >
              {item}
            </Button>
          ))}
        </div>

        <div className="w-full xl:w-fit flex items-center justify-between xl:justify-start gap-2 px-2 shrink-0">
          {/* <button
            onClick={() => scroll("right")}
            className="p-2 rounded-full bg-white shadow-sm hover:bg-gray-100 active:scale-90 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300 xl:order-first"
          >
            <ChevronRight />
          </button> */}
          <div className="bg-color6 h-14 rounded-xl flex flex-col justify-center items-start px-6 sm:px-8 w-full xl:w-87.5 shadow-sm transition-all duration-300 hover:shadow-md hover:-translate-y-0.5 cursor-pointer">
            <p className="text-xs sm:text-sm font-bold text-white truncate w-full">
              keep going to reach and improve even more.
            </p>
            <p className="text-xs sm:text-sm font-bold text-white truncate w-full">
              {counsellors.length} counsellors available to connect with today.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Dashboard Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[70px_minmax(0,1fr)_minmax(0,2fr)_minmax(0,1.2fr)] min-h-[50vh] px-3 sm:px-5 gap-3 my-6 items-start">
        {/* Left Sidebar Icon Column with Hover Tooltips */}
        <div className="relative flex flex-col gap-3 py-5 bg-color6 border border-[#c1c1ff] rounded-2xl min-h-17.5 lg:min-h-full items-center">
          {[
            { icon: "mynaui:users-group", label: "Counselors" },
            { icon: "vadivam:network", label: "Organisation" },
            { divider: true },
            {
              icon: "weui:discover-outlined",
              label: "Discover",
              link: "/dashboard/discovery",
            },
            {
              icon: "solar:feed-linear",
              label: "Feeds",
              link: "/dashboard/feeds",
            },
            { icon: "reicon:save", label: "Saved" },
            { divider: true },
            {
              icon: "mage:message-round",
              label: "Message",
              link: "/dashboard/messages",
            },
            { icon: "arcticons:google-journal", label: "My Journals" },
            { icon: "grommet-icons:resources", label: "Resources" },
            { divider: true },
            { icon: "akar-icons:schedule", label: "Schedule" },
            { icon: "qlementine-icons:task-16", label: "Task" },
            { divider: true },
            { icon: "uil:setting", label: "Settings", isBottom: true },
          ].map((item, idx) => {
            if (item.divider) {
              return (
                <div
                  key={`div-${idx}`}
                  className="border border-[#DEDEDE] my-1 w-[80%]"
                />
              );
            }

            return (
              <button
                key={idx}
                onClick={() => item.link && (window.location.href = item.link)}
                className={`relative group flex items-center justify-center w-full h-10 px-3 cursor-pointer bg-transparent border-none transition-transform duration-200 active:scale-90 ${
                  item.isBottom ? "absolute bottom-5" : ""
                }`}
              >
                <Icon
                  icon={item.icon!}
                  className="text-4xl text-[#aabfe1] group-hover:text-[#1900FF] shrink-0 transition-all duration-200 group-hover:scale-110"
                />
                <div className="absolute z-10 left-16 h-10 w-32 pl-4 items-center justify-start hidden group-hover:flex">
                  <div className="h-10 w-25 bg-[#0A0332] py-2 px-4 rounded-lg flex items-center justify-center shadow-md relative transition-transform duration-200 animate-in fade-in slide-in-from-left-2 before:content-[''] before:absolute before:right-full before:top-1/2 before:-translate-y-1/2 before:border-[6px] before:border-transparent before:border-r-[#0A0332]">
                    <p className="text-white font-bold text-sm tracking-tight whitespace-nowrap">
                      {item.label}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Messages Section */}
        <div className="bg-[#F0EFFC] rounded-2xl min-h-50 lg:min-h-full p-3 overflow-hidden transition-all duration-300 hover:shadow-sm">
          <div className="flex justify-between items-center">
            <p className="font-extrabold text-xl text-color6">Messages</p>
            <p className="text-xs cursor-pointer font-bold text-color6 transition-all duration-200 hover:underline hover:scale-105 active:scale-95">
              View all
            </p>
          </div>

          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-full p-2 mt-3 flex items-center gap-3 transition-all duration-200 hover:bg-[#d8d6f0] hover:shadow-sm hover:translate-x-1 cursor-pointer group"
            >
              <Avatar className="h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-110">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>

              <div className="flex justify-between w-full border-b-2 py-5">
                <div className="w-full overflow-hidden">
                  <p className="text-[#0A0332] font-bold text-sm truncate group-hover:text-[#1900FF] transition-colors">
                    Mr. Godfred Kusi (mentor)
                  </p>
                  <p className="text-[#0A0332]/70 font-medium text-xs truncate">
                    Latest message excerpt here...
                  </p>
                </div>
                <div className=" flex flex-col items-center gap-0.5 ">
                  <p className="text-[10px] ">Today</p>
                  <div className=" bg-blue-700 w-5 h-5 rounded-full "></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Anxiety Test & Appointments Section */}
        <div className="bg-white rounded-2xl min-h-50 lg:min-h-full">
          {/* Ad Banner */}
          <div className="rounded-2xl border border-gray-200 bg-color6 overflow-hidden py-4 px-4 sm:px-8 transition-all duration-300 hover:shadow-md hover:-translate-y-0.5">
            <div className="flex justify-between">
              <p className="text-white font-extrabold">Anxiety Test</p>
              <p className="text-white/80 text-sm font-medium">Ads</p>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="w-full">
                <p className="text-white mt-3 sm:mt-5 text-sm sm:text-base">
                  Have you been feeling particularly Anxious? Why not check it?
                </p>
                <Button
                  className={
                    "bg-white text-[#1900FF] hover:bg-gray-100 mt-6 sm:mt-10 font-bold py-6 sm:py-7 rounded-full w-full sm:w-40 cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95"
                  }
                >
                  Contact Us
                </Button>
              </div>
              <div className="w-full relative flex items-center justify-center min-h-40 sm:min-h-0 my-4 sm:my-0 group cursor-pointer">
                <div className="w-32 sm:w-40 rounded-[60px] sm:-ml-20 h-40 sm:h-48 z-40 bg-white overflow-hidden shadow-lg transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={Images[3]}
                    className="w-full h-full object-cover rounded-[60px] transition-transform duration-500 group-hover:scale-110"
                    alt=""
                  />
                </div>
                <div className="w-32 sm:w-40 h-36 sm:h-44 bg-[#FF7DCD] absolute top-2 z-15 rounded-full opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"></div>
                <div className="w-32 sm:w-40 h-32 sm:h-40 bg-[#E4F2FF] absolute -bottom-4 sm:-bottom-35 left-5 sm:left-5 rounded-[60px] opacity-80 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"></div>
              </div>
            </div>
          </div>

          {/* Appointments */}
          <div className="rounded-2xl border border-gray-200 py-4 px-4 sm:px-8 bg-[#f0effc] mt-5 overflow-hidden transition-all duration-300 hover:shadow-sm">
            <div className="flex justify-between items-center mb-4">
              <p className="font-bold text-[#000057] text-2xl">Appointments</p>
              <p className="text-xs cursor-pointer font-bold text-[#000057] transition-all duration-200 hover:underline hover:scale-105 active:scale-95">
                View all
              </p>
            </div>

            {/* Featured Appointment Item (Overflow Fixed) */}
            <div className="flex flex-col sm:flex-row justify-between bg-[#C9C9CD] p-3 sm:px-3 sm:py-2 min-h-14 rounded-2xl sm:rounded-full items-center gap-2 sm:gap-3 transition-all duration-200 hover:bg-[#b8b8bc] hover:shadow-md cursor-pointer hover:-translate-y-0.5">
              <div className="flex items-center gap-3 w-full sm:w-auto shrink-0">
                <div className="h-10 w-10 rounded-full bg-[#0A0332] flex justify-center items-center shrink-0 transition-transform duration-200 hover:scale-110">
                  <Icon
                    icon="qlementine-icons:camera-16"
                    className="text-white text-xl"
                  />
                </div>
                <div className="sm:hidden min-w-0 flex-1">
                  <p className="font-bold text-sm truncate">
                    Mr. Godfred Kusi (mentor)
                  </p>
                  <p className="text-xs text-[#656565] truncate">
                    You recently reacted on his post
                  </p>
                </div>
              </div>

              <div className="hidden sm:block min-w-0 flex-1">
                <p className="font-bold text-sm truncate">
                  Mr. Godfred Kusi (mentor)
                </p>
                <p className="text-xs text-[#656565] truncate">
                  You recently reacted on his post/view or read book
                </p>
              </div>

              <AvatarGroup className="w-full sm:w-auto justify-center sm:justify-start shrink-0">
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110 hover:z-50">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110 hover:z-50">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <Avatar className="h-8 w-8 transition-transform duration-200 hover:scale-110 hover:z-50">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <AvatarGroupCount>+4</AvatarGroupCount>
              </AvatarGroup>

              <Button className="bg-[#FF9001] hover:bg-[#e07f00] h-9 px-4 rounded-full w-full sm:w-auto shrink-0 font-bold text-xs sm:text-sm text-white whitespace-nowrap transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-95">
                Join Lesson
              </Button>
            </div>

            {/* Standard Appointment items */}
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="flex flex-col sm:flex-row mt-3 bg-[#E4E3F2] p-3 sm:px-2 sm:h-14 rounded-2xl sm:rounded-4xl items-center gap-3 transition-all duration-200 hover:bg-[#d8d7e8] hover:shadow-sm cursor-pointer hover:translate-x-1"
              >
                <div className="flex items-center gap-3 w-full sm:w-auto">
                  <Avatar className="h-10 w-10 shrink-0 transition-transform duration-200 hover:scale-110">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="sm:hidden">
                    <p className="font-bold text-sm">
                      Mr. Godfred Kusi (mentor)
                    </p>
                    <p className="text-xs text-[#656565]">
                      You recently reacted on his post
                    </p>
                  </div>
                </div>
                <div className="hidden sm:flex w-full justify-start overflow-hidden">
                  <div>
                    <p className="font-bold text-sm truncate">
                      Mr. Godfred Kusi (mentor)
                    </p>
                    <p className="text-xs text-[#656565] truncate">
                      You recently reacted on his post/view or read book
                    </p>
                  </div>
                </div>
                <div className="w-full sm:w-40 text-center sm:text-left">
                  <p className="sm:ml-5 text-xs sm:text-sm font-semibold text-[#1900FF]">
                    Upcoming
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reminders & Calendar Section */}
        <div className="bg-white min-h-50 lg:min-h-full flex flex-col gap-6 w-full">
          <div className="py-3 px-4 sm:px-5 bg-[#F0EFFC] border border-gray-200 rounded-2xl transition-all duration-300 hover:shadow-sm">
            <div className="flex justify-between items-center">
              <p className="font-bold text-xl text-[#000057]">Reminder</p>
              <p className="text-xs cursor-pointer font-bold text-[#000057] transition-all duration-200 hover:underline hover:scale-105 active:scale-95">
                View all
              </p>
            </div>
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="flex mt-3 bg-[#E4E3F2] px-2 h-14 rounded-4xl items-center gap-2 transition-all duration-200 hover:bg-[#d8d7e8] hover:shadow-sm cursor-pointer hover:translate-x-1 group"
              >
                <div className="w-12 sm:w-20 shrink-0 flex justify-center">
                  <div className="w-10 h-10 rounded-full flex justify-center items-center bg-[#FF9001] transition-transform duration-200 group-hover:scale-110">
                    <Icon
                      icon="mingcute:notification-fill"
                      className="h-6 text-white"
                    />
                  </div>
                </div>
                <div className="flex w-full justify-start overflow-hidden">
                  <div>
                    <p className="font-bold text-sm truncate group-hover:text-[#1900FF] transition-colors">
                      Email - Dr. Regan
                    </p>
                    <p className="text-xs text-[#656565] truncate">
                      New assignment posted
                    </p>
                  </div>
                </div>

                <Button className="bg-transparent rounded-full h-9 w-9 shrink-0 hover:bg-transparent shadow-none group-hover:translate-x-0.5 transition-transform">
                  <ChevronRight className="text-black" />
                </Button>
              </div>
            ))}
          </div>

          <Calendar />

          <Button
            className={
              "font-bold bg-[#000057] hover:bg-[#1500d6] h-20 -mt-10 rounded-t-none rounded-b-3xl text-3xl text-white transition-all duration-300 hover:shadow-lg hover:tracking-wide active:scale-98 cursor-pointer"
            }
          >
            Book Appointment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
