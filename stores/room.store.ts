import { create } from "zustand";

import type { Room } from "@/types/room";

interface RoomStore {
    room: Room | null;

    setRoom: (room: Room | null) => void;

    clearRoom: () => void;
}

export const useRoomStore = create<RoomStore>((set) => ({
    room: null,

    setRoom: (room) => set({ room }),

    clearRoom: () => set({ room: null }),
}));