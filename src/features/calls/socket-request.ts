import type { Socket } from "socket.io-client";

type Acknowledgement<T> =
  | { ok: true; data: T }
  | { ok: false; error: { code: string; message: string } };

export function socketRequest<T>(
  socket: Socket | null,
  event: string,
  payload: object,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (!socket?.connected) {
      reject(new Error("Calls are reconnecting. Please try again in a moment."));
      return;
    }
    socket.timeout(10_000).emit(
      event,
      payload,
      (timeout: Error | null, response?: Acknowledgement<T>) => {
        if (timeout) {
          reject(new Error("The call server did not respond. Please try again."));
        } else if (response?.ok === true) {
          resolve(response.data);
        } else {
          reject(new Error(response?.error.message ?? "Unable to update this call."));
        }
      },
    );
  });
}
