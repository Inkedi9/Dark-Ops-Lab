export type DarkProfile = {
    id: string;
    username: string;
    xp: number;
    level: number;
    rank: string;
    badges: string[];
    completedLessons: string[];
    completedMissions: string[];
    completedDefend: string[];
    createdAt: string;
    updatedAt: string;
};

export type ProfileAdapter = {
    getProfile: () => Promise<DarkProfile | null>;
    createProfile: (username: string) => Promise<DarkProfile>;
    updateProfile: (profile: DarkProfile) => Promise<DarkProfile>;
    addXp: (amount: number) => Promise<DarkProfile>;
    resetProfile: () => Promise<void>;
};