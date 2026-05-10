import type { ChallengeDefinition } from "@/engine/types";
import { FakeBrowser } from "./FakeBrowser";
import { FakeTerminalOutput } from "./FakeTerminalOutput";
import { BlindSqlPanel } from "./BlindSqlPanel";
import { TimeBasedSqlPanel } from "./TimeBasedSqlPanel";

type ChallengeSandboxProps = {
    challenge: ChallengeDefinition;
    preview: string;
    solved: boolean;
    attempts: number;
};

export function ChallengeSandbox({
    challenge,
    preview,
    solved,
    attempts,
}: ChallengeSandboxProps) {

    if (challenge.sandboxType === "browser") {
        return <FakeBrowser preview={preview} solved={solved} />;
    }

    if (challenge.sandboxType === "terminal") {
        return <FakeTerminalOutput solved={solved} attempts={attempts} />;
    }

    if (challenge.sandboxType === "sql" && challenge.sandboxMode === "time") {
        return (
            <TimeBasedSqlPanel
                preview={preview}
                solved={solved}
                attempts={attempts}
            />
        );
    }

    if (challenge.sandboxType === "sql" && challenge.sandboxMode === "blind") {
        return (
            <BlindSqlPanel
                preview={preview}
                solved={solved}
                attempts={attempts}
            />
        );
    }

    return (
        <FakeTerminalOutput
            preview={preview}
            solved={solved}
            attempts={attempts}
        />
    )
}
