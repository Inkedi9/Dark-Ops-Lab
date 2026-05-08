import { Zap } from "lucide-react";
import AppBadge from "@dark/ui/components/AppBadge";

export default function BrandPill() {
    return (
        <AppBadge variant="nexus" className="gap-2">
            <Zap size={14} />
            Learn • Hack • Defend
        </AppBadge>
    );
}