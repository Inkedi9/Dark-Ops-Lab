export const storedXssPayloads = {
    valid: [
        "<script>alert(1)</script>",
        "<img src=x onerror=alert(1)>",
        "<svg onload=alert(1)>",
    ],

    variations: [
        "<img src=x onerror=\"alert('stored')\">",
        "<details open ontoggle=alert(1)>",
        "<iframe src=\"javascript:alert(1)\"></iframe>",
    ],

    invalid: [
        "hello world",
        "<b>hello</b>",
        "<p>normal comment</p>",
    ],

    notes: [
        "Stored XSS persists user input and executes later when rendered.",
        "Event handlers like onerror/onload are common payload vectors.",
        "The key difference from reflected XSS is persistence.",
    ],
};