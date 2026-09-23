import PeopleGroupDuotoneIcon from "@iconify-react/stash/people-group-duotone";
import SettingOutlinedIcon from "@iconify-react/ant-design/setting-outlined";
import Task16Icon from "@iconify-react/qlementine-icons/task-16";
import ScheduleIcon from "@iconify-react/akar-icons/schedule";
import ResourcesIcon from "@iconify-react/grommet-icons/resources";
import GoogleJournalIcon from "@iconify-react/arcticons/google-journal";
import MessageRoundIcon from "@iconify-react/mage/message-round";
import SaveIcon from "@iconify-react/reicon/save";
import FeedLinearIcon from "@iconify-react/solar/feed-linear";
import DiscoverLightIcon from "@iconify-react/iconamoon/discover-light";
import OrganizationIcon from "@iconify-react/grommet-icons/organization";
import { Images } from "../../../assets/images";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import VideoOutlineIcon from "@iconify-react/basil/video-outline";
import CallOutlineIcon from "@iconify-react/famicons/call-outline";
import MenuDots16Icon from "@iconify-react/qlementine-icons/menu-dots-16";
import PlusIcon from "@iconify-react/akar-icons/plus";
import StickerEmojiIcon from "@iconify-react/mdi/sticker-emoji";
import Emoji2LineIcon from "@iconify-react/mingcute/emoji-2-line";
import MicIcon from "@iconify-react/codicon/mic";
import { useRef, useState, useEffect } from "react";
import { type User } from "../../../lib/api";
import { useCalls } from "../../../features/calls/call-context";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL ?? "http://localhost:4000/api"
).replace(/\/$/, "");

type ChatMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  body: string;
  createdAt: string;
};

const fetchWithCsrf = async (
  url: string,
  options: RequestInit = {},
): Promise<Response> => {
  const csrfResponse = await fetch(`${API_BASE_URL}/auth/csrf`, {
    credentials: "include",
  });

  if (!csrfResponse.ok) {
    throw new Error("Unable to initialize secure chat request.");
  }

  const csrfData = (await csrfResponse.json()) as { csrfToken?: string };
  const csrfToken = csrfData.csrfToken;

  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...(options.headers ?? {}),
      ...(csrfToken ? { "X-CSRF-Token": csrfToken } : {}),
    },
  });
};

const mergeMessages = (messages: ChatMessage[]) =>
  [...new Map(messages.map((message) => [message.id, message])).values()].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  );

const MessagesPanel = () => {
  const { user: currentUser, socket, connected, busy, startCall } = useCalls();
  const [followingUsers, setFollowingUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<
    string | null
  >(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [messageDraft, setMessageDraft] = useState("");
  const [chatError, setChatError] = useState("");
  const conversationIdRef = useRef<string | null>(null);
  const selectedUserId = selectedUser?.id;

  const handleStartCallRequest = async (type: "audio" | "video") => {
    if (
      !selectedUserId ||
      !selectedConversationId ||
      selectedConversationId !== conversationIdRef.current ||
      !connected ||
      busy
    ) {
      return;
    }

    const conversationId = selectedConversationId;
    setChatError("");
    try {
      await startCall({ conversationId, targetUserId: selectedUserId, type });
    } catch (error) {
      if (conversationIdRef.current !== conversationId) return;
      setChatError(
        error instanceof Error ? error.message : "Unable to start the call.",
      );
    }
  };

  const handleSendMessage = async () => {
    if (
      !selectedConversationId ||
      selectedConversationId !== conversationIdRef.current ||
      !messageDraft.trim()
    ) {
      return;
    }

    const conversationId = selectedConversationId;
    const payload = messageDraft.trim();
    const optimisticMessage = {
      id: `temp-${crypto.randomUUID()}`,
      conversationId,
      senderId: currentUser?.id ?? "me",
      body: payload,
      createdAt: new Date().toISOString(),
    };

    setMessages((previous) => [...previous, optimisticMessage]);
    setMessageDraft("");

    try {
      const response = await fetchWithCsrf(
        `${API_BASE_URL}/conversations/${conversationId}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ body: payload }),
        },
      );

      const result = (await response.json().catch(() => null)) as {
        message?: { id?: string; body?: string; createdAt?: string };
      } | null;

      if (!response.ok || !result?.message) {
        throw new Error("Message not sent.");
      }

      if (conversationIdRef.current !== conversationId) return;
      const savedMessage: ChatMessage = {
        ...optimisticMessage,
        id: result.message.id ?? optimisticMessage.id,
        body: result.message.body ?? optimisticMessage.body,
        createdAt: result.message.createdAt ?? optimisticMessage.createdAt,
      };
      setMessages((previous) =>
        mergeMessages([
          ...previous.filter((item) => item.id !== optimisticMessage.id),
          savedMessage,
        ]),
      );
    } catch (error) {
      console.error("Failed to send message:", error);
      if (conversationIdRef.current !== conversationId) return;
      setChatError(
        error instanceof Error ? error.message : "Message could not be sent.",
      );
      setMessages((previous) =>
        previous.filter((item) => item.id !== optimisticMessage.id),
      );
    }
  };

  useEffect(() => {
    if (!currentUser?.id) return;
    let isMounted = true;

    async function loadFollowing(userId: string) {
      try {
        const response = await fetch(
          `${API_BASE_URL}/users/${userId}/following`,
          { credentials: "include" },
        );

        if (!response.ok) {
          throw new Error("Unable to load following users.");
        }

        const data = (await response.json()) as { users?: User[] };
        const people = data.users ?? [];

        if (!isMounted) return;

        setFollowingUsers(people);
        setSelectedUser(
          (previous: User | null) => previous ?? people[0] ?? null,
        );
      } catch (error) {
        console.error("Failed to load messages sidebar data:", error);
      }
    }

    void loadFollowing(currentUser.id);

    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  useEffect(() => {
    let cancelled = false;
    conversationIdRef.current = null;
    if (!selectedUserId) return;

    const openConversation = async () => {
      try {
        const response = await fetchWithCsrf(`${API_BASE_URL}/conversations`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ kind: "direct", memberIds: [selectedUserId] }),
        });

        const payload = (await response.json().catch(() => null)) as {
          conversation?: { id?: string };
        } | null;
        if (cancelled) return;
        if (!response.ok || !payload?.conversation?.id) {
          throw new Error("Unable to open chat with this person.");
        }

        const conversationId = payload.conversation.id;
        conversationIdRef.current = conversationId;
        const historyResponse = await fetch(
          `${API_BASE_URL}/conversations/${conversationId}/messages?limit=50&offset=0`,
          { credentials: "include" },
        );
        if (!historyResponse.ok) throw new Error("Unable to load messages.");
        const history = (await historyResponse.json()) as {
          messages?: ChatMessage[];
        };
        if (cancelled) return;
        setMessages((previous) =>
          mergeMessages([...(history.messages ?? []), ...previous]),
        );
        setSelectedConversationId(conversationId);
      } catch (error) {
        if (cancelled) return;
        conversationIdRef.current = null;
        setChatError(
          error instanceof Error
            ? error.message
            : "Unable to load this conversation.",
        );
        setMessages([]);
        setSelectedConversationId(null);
      }
    };

    void openConversation();

    return () => {
      cancelled = true;
      conversationIdRef.current = null;
    };
  }, [selectedUserId]);

  useEffect(() => {
    if (!socket) return;
    const receiveMessage = (message: ChatMessage) => {
      if (message.conversationId !== conversationIdRef.current) return;
      setMessages((previous) => mergeMessages([...previous, message]));
    };
    socket.on("message:new", receiveMessage);
    return () => {
      socket.off("message:new", receiveMessage);
    };
  }, [socket]);

  const userInitials =
    currentUser?.fullName
      ?.split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part: string) => part[0]?.toUpperCase() ?? "")
      .join("") || "YO";

  const selectedContact = selectedUser;
  const callsDisabled = !selectedConversationId || !connected || busy;

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="h-14 shrink-0 flex items-center gap-3">
        <div className="w-16 bg-color6 h-full" />
        <p className="text-color1 font-extrabold text-xl">Messages</p>
      </div>

      <div className="flex justify-between flex-1 overflow-hidden ">
        {/* Leftmost Icon Sidebar */}
        <div className="w-16 px-3 flex gap-4 flex-col items-center bg-color6 relative shrink-0">
          <PeopleGroupDuotoneIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <OrganizationIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <div className="border w-full" />
          <DiscoverLightIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <FeedLinearIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <SaveIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <div className="border w-full mt-2" />
          <MessageRoundIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90 text-[#1900FF]"
          />
          <GoogleJournalIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <ResourcesIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <div className="border w-full mt-2" />
          <ScheduleIcon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <Task16Icon
            height="1em"
            className="text-3xl text-color4 cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90"
          />
          <div className="absolute bottom-6">
            <SettingOutlinedIcon
              height="1em"
              className="text-3xl text-color4 cursor-pointer transition-transform duration-300 hover:rotate-90 hover:scale-125 active:scale-90"
            />
          </div>
        </div>

        {/* Main Workspace */}
        <div className="w-full grid grid-cols-12 overflow-hidden">
          {/* Middle Navigation Column */}
          <div className="col-span-2 flex flex-col overflow-hidden ">
            {/* User Profile Card */}
            <div className="h-40 border border-[#ACA9FF] bg-[#f3f7ff] shrink-0 transition-all duration-300 hover:shadow-md">
              <div className="w-full flex flex-col relative pb-2 group cursor-pointer">
                <img
                  src={Images[5]}
                  alt=""
                  className="w-[94%] mt-2 rounded-lg h-16 object-cover self-center transition-transform duration-300 group-hover:scale-105"
                />
                <div className="flex flex-col justify-center pt-9 pb-2">
                  <p className="text-xs text-center font-medium transition-colors group-hover:text-[#1900FF]">
                    {currentUser?.fullName ?? "Loading profile..."}
                  </p>
                  <p className="text-[10px] text-center text-gray-500">
                    @{currentUser?.email?.split("@")[0] ?? "user"}
                  </p>
                </div>
                <div className="bg-white h-14 w-14 rounded-full absolute left-1/2 -translate-x-1/2 top-12 flex justify-center items-center shadow-sm transition-transform duration-300 group-hover:scale-110">
                  <Avatar className="h-12 w-12 shrink-0">
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-4 px-3 h-10 my-2 border border-[#ACA9FF] bg-[#f3f7ff] items-center shrink-0">
              {["All", "Groups", "Request", "Calls"].map((tab, idx) => (
                <button
                  key={tab}
                  className={`text-xs font-medium cursor-pointer transition-all duration-200 hover:text-[#1900FF] hover:-translate-y-0.5 active:scale-95 ${
                    idx === 0 ? "text-[#1900FF] font-bold" : ""
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Conversation List */}
            <div className="flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden border border-[#ACA9FF] bg-[#f3f7ff] p-3 flex flex-col gap-3">
              {followingUsers.length === 0 ? (
                <div className="flex h-full items-center justify-center text-center text-[10px] text-gray-500">
                  You are not following anyone yet.
                </div>
              ) : (
                followingUsers.map((person) => {
                  const isSelected = selectedContact?.id === person.id;
                  const handleName = person.fullName || "Followed user";
                  const handleTag = person.role
                    ? person.role.toUpperCase()
                    : "USER";

                  return (
                    <div
                      key={person.id}
                      onClick={() => {
                        if (person.id === selectedUserId) return;
                        conversationIdRef.current = null;
                        setSelectedConversationId(null);
                        setMessages([]);
                        setChatError("");
                        setMessageDraft("");
                        setSelectedUser(person);
                      }}
                      className={`flex gap-2 items-center p-1 rounded-lg cursor-pointer transition-all duration-200 hover:bg-[#ACA9FF]/20 hover:translate-x-1 active:scale-[0.98] group ${
                        isSelected
                          ? "bg-[#ACA9FF]/20 ring-1 ring-[#1900FF]/30"
                          : ""
                      }`}
                    >
                      <Avatar className="h-9 w-9 shrink-0 transition-transform duration-200 group-hover:scale-105">
                        <AvatarImage src="https://github.com/shadcn.png" />
                        <AvatarFallback>
                          {handleName
                            .split(" ")
                            .filter(Boolean)
                            .slice(0, 2)
                            .map((part: string) => part[0]?.toUpperCase() ?? "")
                            .join("") || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="truncate">
                        <p className="text-[10px] font-medium truncate transition-colors group-hover:text-[#1900FF]">
                          {handleName}
                        </p>
                        <p className="text-[8px] text-gray-500 truncate">
                          {handleTag}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Right Chat Column */}
          <div className="col-span-10 flex flex-col overflow-hidden">
            {/* Header */}
            <div className="h-12 bg-color6 border border-[#ACA9FF] flex justify-between items-center px-5 shrink-0">
              <div className="flex items-center gap-2 cursor-pointer group">
                <Avatar className="h-10 w-10 shrink-0 transition-transform duration-200 group-hover:scale-105">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-[10px] font-extrabold transition-colors text-white group-hover:text-[#eeeeefa1]">
                    {selectedContact?.fullName ??
                      currentUser?.fullName ??
                      "Select a contact"}
                  </p>
                  <p className="text-[8px] text-gray-500">
                    @
                    {selectedContact?.email?.split("@")[0] ??
                      currentUser?.email?.split("@")[0] ??
                      "user"}
                  </p>
                </div>
              </div>
              <div className="flex flex-row gap-3">
                <button
                  type="button"
                  onClick={() => void handleStartCallRequest("audio")}
                  disabled={callsDisabled}
                  className="p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Request an audio call"
                >
                  <CallOutlineIcon height="22px" color="white" />
                </button>
                <button
                  type="button"
                  onClick={() => void handleStartCallRequest("video")}
                  disabled={callsDisabled}
                  className="p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label="Request a video call"
                >
                  <VideoOutlineIcon height="22px" color="white" />
                </button>
                <div className="p-1.5 rounded-full cursor-pointer transition-all duration-200 hover:bg-black/5 dark:hover:bg-white/5 hover:scale-110 active:scale-90">
                  <MenuDots16Icon height="22px" color="white" />
                </div>
              </div>
            </div>

            {/* Chat Content Panel */}
            <div className="border flex-1 border-[#ACA9FF] flex flex-col justify-between py-4 px-6 overflow-hidden">
              <div className="flex-1 overflow-y-auto scrollbar-none [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden flex flex-col gap-3 pr-2">
                {messages.length === 0 ? (
                  <div className="flex h-full items-center justify-center text-center text-sm text-gray-500">
                    {selectedContact
                      ? "No messages yet. Say hello to start the conversation."
                      : "Select a person to start chatting."}
                  </div>
                ) : (
                  messages.map((message) => {
                    const isOutgoing = message.senderId === currentUser?.id;

                    return (
                      <div
                        key={message.id}
                        className={`w-full flex items-center gap-2 ${
                          isOutgoing ? "justify-end" : "justify-start"
                        }`}
                      >
                        {!isOutgoing && (
                          <Avatar className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-110 cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>
                              {selectedContact?.fullName
                                ?.split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map(
                                  (part: string) =>
                                    part[0]?.toUpperCase() ?? "",
                                )
                                .join("") || "U"}
                            </AvatarFallback>
                          </Avatar>
                        )}

                        <div
                          className={`max-w-[75%] py-3 px-6 flex items-center rounded-3xl transition-all duration-200 ${
                            isOutgoing
                              ? "bg-color6 text-white hover:bg-[#ACA9FF]/40 hover:shadow-sm"
                              : "bg-[#EAEAEA] text-[#656565] hover:bg-[#e0e0e0] hover:shadow-sm"
                          }`}
                        >
                          <p className="text-xs wrap-break-word">{message.body}</p>
                        </div>

                        {isOutgoing && (
                          <Avatar className="h-9 w-9 shrink-0 transition-transform duration-200 hover:scale-110 cursor-pointer">
                            <AvatarImage src="https://github.com/shadcn.png" />
                            <AvatarFallback>{userInitials}</AvatarFallback>
                          </Avatar>
                        )}
                      </div>
                    );
                  })
                )}
                {chatError && (
                  <p className="text-[10px] text-red-500">{chatError}</p>
                )}
              </div>

              {/* Chat Input Bar */}
              <div className="h-11 border border-[#ACA9FF] rounded-xl flex items-center justify-between px-3 mt-2 shrink-0 transition-all duration-200 focus-within:ring-2 focus-within:ring-[#1900FF]/40 focus-within:shadow-md">
                <div className="flex gap-3 items-center flex-1 h-full">
                  <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 hover:rotate-90 active:scale-90">
                    <PlusIcon height="1.1em" />
                  </div>
                  <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90">
                    <StickerEmojiIcon height="1.1em" />
                  </div>
                  <input
                    type="text"
                    value={messageDraft}
                    onChange={(e) => setMessageDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        void handleSendMessage();
                      }
                    }}
                    placeholder={
                      selectedConversationId
                        ? "Type a message..."
                        : "Select a person to chat"
                    }
                    disabled={!selectedConversationId}
                    className="text-xs h-full w-full py-2 bg-transparent outline-none text-gray-700 disabled:cursor-not-allowed disabled:text-gray-400"
                  />
                </div>
                <div className="flex gap-3 items-center">
                  <div className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 hover:rotate-12 active:scale-90">
                    <Emoji2LineIcon height="1.1em" />
                  </div>
                  <button
                    type="button"
                    onClick={() => void handleSendMessage()}
                    disabled={!selectedConversationId || !messageDraft.trim()}
                    className="p-1 rounded-full cursor-pointer transition-transform duration-200 hover:scale-125 active:scale-90 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <MicIcon height="1.1em" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Messages = () => {
  const { user } = useCalls();
  return <MessagesPanel key={user?.id ?? "signed-out"} />;
};

export default Messages;    
 