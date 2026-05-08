export const blindSqliPayloads = {
    valid: [
        "username: admin",
        "password: admin",
        "token:",

        "username: guest",
        "password: guest",
        "token:",

        "username: guest",
        "password: guest",
        "token: debug-admin-token"
    ],

    invalid: [
        "guest-session",
        "admin",
        "guest' AND substring(password,1,1)='x'--",
    ],

    notes: [
        "guest session established",
        "debug token discovered",
        "bearer token replayed",
        "admin route accepted token",
        "challenge solved",
        "[BREACH SUCCESSFUL] target condition compromised",
    ],
};