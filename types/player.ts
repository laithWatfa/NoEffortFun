export interface Player {
    uid: string;
    nickname: string;
    avatar?: string;
    score: number;
    ready: boolean;
    connected: boolean;
    joinedAt: number;
    lastSeen?: number;
}

