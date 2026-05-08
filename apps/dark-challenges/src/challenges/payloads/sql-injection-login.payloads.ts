export const sqlInjectionPayloads = {
    valid: [
        "' OR '1'='1",
        "' OR 1=1--",
        "admin'--",
    ],

    invalid: [
        "admin",
        "password123",
    ],

    advanced: [
        "' UNION SELECT NULL--",
    ],

    notes: [
        "Classic auth bypass using OR condition",
        "Commenting rest of query with --",
    ],
};