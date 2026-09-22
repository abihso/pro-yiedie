import { createContext, useContext } from "react";
import type { Socket } from "socket.io-client";
import type { User } from "../../lib/api";

export type CallInvitation = {
  requestId: string;
  conversationId: string;
  type: "audio" | "video";
  fromUserId: string;
  fromUserName: string;
  targetUserId: string;
  targetUserName: string;
  callerSocketId: string;
  expiresAt: string;
};

export type AcceptedCall = CallInvitation & {
  callId: string;
  acceptedBySocketId: string;
};

export type StartCallInput = {
  conversationId: string;
  targetUserId: string;
  type: "audio" | "video";
};

export type CallsContextValue = {
  socket: Socket | null;
  connected: boolean;
  user: User | null;
  busy: boolean;
  startCall: (input: StartCallInput) => Promise<void>;
};

export const CallsContext = createContext<CallsContextValue | null>(null);

export function useCalls() {
  const context = useContext(CallsContext);
  if (!context) throw new Error("Calls must be used within CallProvider.");
  return context;
}
