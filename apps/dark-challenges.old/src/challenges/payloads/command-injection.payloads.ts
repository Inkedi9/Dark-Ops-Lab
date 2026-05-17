export const commandInjectionPayloads = {
    valid: [
        "127.0.0.1; whoami",
        "127.0.0.1 && id",
        "127.0.0.1 | pwd",
    ],

    invalid: [
        "127.0.0.1",
        "localhost",
        "example.com",
    ],

    variations: [
        "127.0.0.1; ls",
        "127.0.0.1 && pwd",
    ],

    notes: [
        "Command injection happens when user input is passed into a shell command.",
        "Separators like ;, && and | can chain commands.",
        "Recon commands like whoami, id and pwd are useful for proving execution.",
    ],
};