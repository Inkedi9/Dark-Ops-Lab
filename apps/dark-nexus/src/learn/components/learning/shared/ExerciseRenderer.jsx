import SqlMockExercise from "../sql-injection/SqlMockExercise";
import XssMockExercise from "../xss/XssMockExercise";
import BrokenAuthExercise from "../broken-auth/BrokenAuthExercise";
import AccessControlExercise from "../access-control/AccessControlExercise";
import PhishingExercise from "../phishing/PhishingExercise";
import CommandInjectionExercise from "../command-injection/CommandInjectionExercise";
import LoggingDetectionExercise from "../logging-detection/LoggingDetectionExercise";
import OAuthExercise from "../oauth/OAuthExercise";
import PasswordSecurityExercise from "../password-security/PasswordSecurityExercise";
import PanelCard from "@dark/ui/components/PanelCard";
import AppBadge from "@dark/ui/components/AppBadge";

const exerciseMap = {
    "sql-injection": SqlMockExercise,
    xss: XssMockExercise,
    "broken-auth": BrokenAuthExercise,
    "access-control": AccessControlExercise,
    "command-injection": CommandInjectionExercise,
    "phishing-basics": PhishingExercise,
    "logging-detection-basics": LoggingDetectionExercise,
    "oauth-basics": OAuthExercise,
    "password-security": PasswordSecurityExercise,
};

export default function ExerciseRenderer({ lesson, onCompleteExercise }) {
    const ExerciseComponent = exerciseMap[lesson.id];

    if (ExerciseComponent) {
        return <ExerciseComponent onCompleteExercise={onCompleteExercise} />;
    }

    return (
        <PanelCard variant="featured" accent="blue" className="p-6">
            <AppBadge variant="blue">Mock exercise</AppBadge>

            <h2 className="mt-4 text-xl font-extrabold tracking-tight text-white">
                Exercise coming soon
            </h2>

            <p className="mt-3 text-sm leading-6 text-slate-400">
                This lesson already has its educational structure. The dedicated
                interactive exercise will be added in a future step.
            </p>
        </PanelCard>
    );
}
