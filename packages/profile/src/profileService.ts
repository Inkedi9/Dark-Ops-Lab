export {
    addGlobalXp,
    awardGlobalBadge,
    getGlobalLevel,
    getGlobalProfile,
    getGlobalRank,
    getGlobalTelemetry,
    localProfileAdapter,
    resetGlobalProfile,
    saveGlobalProfile,
} from "./localProfileAdapter";

import { localProfileAdapter } from "./localProfileAdapter";

export const profileService = localProfileAdapter;
