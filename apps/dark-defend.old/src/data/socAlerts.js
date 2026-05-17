export const socAlerts = [
  {
    id: "SOC-8814",
    title: "Suspicious onboarding link detected",
    severity: "Medium",
    category: "Phishing",
    source: "Email Gateway",
    datasource: "Microsoft Defender for O365",
    status: "open",
    timestamp: "2026-05-06 23:04",
    direction: "inbound",
    description:
      "Suspicious onboarding email containing an external profile setup link targeting a new employee.",

    artifact: {
      subject: "Action Required: Finalize Your Onboarding Profile",
      sender: "onboarding@hrconnex.thm",
      recipient: "j.garcia@thetrydaily.thm",
      attachment: "None",
      content:
        "Hi Ms. Garcia,\n\nWelcome to TheTryDaily.\n\nAs part of your onboarding, please complete your final profile setup so we can configure your access.\n\nhttps://hrconnex.thm/onboarding/15400654060/j.garcia\n\nIf you have questions, please reach out to the HR Onboarding Team.",
    },

    indicators: [
      { type: "domain", value: "hrconnex.thm", verdict: "suspicious" },
      {
        type: "url",
        value: "https://hrconnex.thm/onboarding/15400654060/j.garcia",
        verdict: "suspicious",
      },
    ],

    signals: [
      "External onboarding link",
      "Profile setup request",
      "New employee targeting",
      "Business-context impersonation",
    ],

    timeline: [
      { time: "23:04", event: "Email received by secure gateway" },
      { time: "23:04", event: "External URL extracted from message body" },
      { time: "23:05", event: "Domain reputation returned low confidence" },
    ],

    recommendedAction:
      "Escalate to SOC, verify HR sender identity and block the URL until confirmed.",
    expectedVerdict: "Suspicious",
  },

  {
    id: "SOC-8815",
    title: "Multiple failed logins followed by new device success",
    severity: "High",
    category: "Authentication",
    source: "Identity Provider",
    datasource: "Okta Identity Threat Protection",
    status: "open",
    timestamp: "2026-05-06 23:18",
    direction: "inbound",
    description:
      "Repeated failed login attempts followed by a successful authentication from a new device and unfamiliar network.",

    artifact: {
      subject: "Identity alert for m.chen",
      sender: "idp.monitor@internal",
      recipient: "soc@company.local",
      attachment: "None",
      content:
        "15 failed login attempts detected for m.chen from unfamiliar ASN. One successful login followed from a new device.",
    },

    indicators: [
      { type: "user", value: "m.chen", verdict: "suspicious" },
      { type: "asn", value: "AS-UNKNOWN-4412", verdict: "suspicious" },
      { type: "device", value: "new-device-login", verdict: "suspicious" },
    ],

    signals: [
      "Repeated failed authentication",
      "Successful login after failures",
      "New device",
      "Unfamiliar network origin",
    ],

    timeline: [
      { time: "23:14", event: "Failed login burst started" },
      { time: "23:17", event: "Fifteen failed attempts recorded" },
      { time: "23:18", event: "Successful login from new device" },
      { time: "23:18", event: "Identity alert generated" },
    ],

    recommendedAction:
      "Force password reset, revoke active sessions and require MFA verification.",
    expectedVerdict: "Malicious",
  },

  {
    id: "SOC-8816",
    title: "Internal awareness newsletter detected",
    severity: "Low",
    category: "Email",
    source: "Email Gateway",
    datasource: "Microsoft Defender for O365",
    status: "open",
    timestamp: "2026-05-06 23:31",
    direction: "inbound",
    description:
      "Internal awareness newsletter containing an approved tracking link for campaign completion metrics.",

    artifact: {
      subject: "May security newsletter",
      sender: "security-awareness@company.local",
      recipient: "all@company.local",
      attachment: "None",
      content:
        "This month’s awareness newsletter includes an approved internal tracking link to measure completion.",
    },

    indicators: [
      {
        type: "sender",
        value: "security-awareness@company.local",
        verdict: "clean",
      },
      {
        type: "campaign",
        value: "approved-awareness-campaign",
        verdict: "clean",
      },
    ],

    signals: [
      "Internal sender",
      "Expected awareness campaign",
      "No credential request",
      "Approved tracking context",
    ],

    timeline: [
      { time: "23:31", event: "Internal newsletter delivered" },
      { time: "23:31", event: "Tracking link identified" },
      { time: "23:32", event: "Campaign allowlist matched" },
    ],

    recommendedAction:
      "Mark benign and document the approved internal campaign context.",
    expectedVerdict: "Benign",
  },

  {
    id: "SOC-8817",
    title: "Encoded PowerShell command execution",
    severity: "High",
    category: "Endpoint",
    source: "EDR",
    datasource: "CrowdStrike Falcon",
    status: "open",
    timestamp: "2026-05-06 23:42",
    direction: "internal",
    description:
      "Endpoint telemetry detected PowerShell execution using encoded command arguments from a user workstation.",

    artifact: {
      subject: "Endpoint process alert",
      sender: "edr.sensor@internal",
      recipient: "soc@company.local",
      attachment: "process-tree.json",
      content:
        "powershell.exe launched with -EncodedCommand from WIN-014. Parent process: winword.exe. Child process attempted outbound network connection.",
    },

    indicators: [
      { type: "host", value: "WIN-014", verdict: "suspicious" },
      {
        type: "process",
        value: "powershell.exe -EncodedCommand",
        verdict: "malicious",
      },
      { type: "parent", value: "winword.exe", verdict: "suspicious" },
    ],

    signals: [
      "Encoded PowerShell",
      "Office document parent process",
      "Outbound connection attempt",
      "Possible macro execution",
    ],

    timeline: [
      { time: "23:41", event: "User opened Word document" },
      { time: "23:42", event: "winword.exe spawned powershell.exe" },
      { time: "23:42", event: "Encoded command detected" },
      { time: "23:43", event: "Outbound connection blocked by EDR" },
    ],

    recommendedAction:
      "Isolate endpoint, collect process tree, quarantine document and hunt for similar executions.",
    expectedVerdict: "Malicious",
  },

  {
    id: "SOC-8818",
    title: "Periodic outbound beaconing detected",
    severity: "High",
    category: "Network",
    source: "Network Sensor",
    datasource: "Zeek",
    status: "open",
    timestamp: "2026-05-07 00:02",
    direction: "outbound",
    description:
      "Network telemetry detected periodic outbound connections from an internal host to an uncommon external domain.",

    artifact: {
      subject: "Beaconing pattern detected",
      sender: "network.sensor@internal",
      recipient: "soc@company.local",
      attachment: "conn.log",
      content:
        "Host 10.10.4.22 contacted sync-update-cdn.net every 60 seconds for 18 minutes. JA3 fingerprint uncommon in environment.",
    },

    indicators: [
      { type: "ip", value: "10.10.4.22", verdict: "suspicious" },
      { type: "domain", value: "sync-update-cdn.net", verdict: "suspicious" },
      {
        type: "ja3",
        value: "72a589da586844d7f0818ce684948eea",
        verdict: "suspicious",
      },
    ],

    signals: [
      "Periodic connection interval",
      "Uncommon external domain",
      "Unusual TLS fingerprint",
      "Potential C2 beacon",
    ],

    timeline: [
      { time: "23:44", event: "First outbound connection observed" },
      { time: "23:50", event: "Regular 60 second interval detected" },
      { time: "00:01", event: "JA3 fingerprint marked uncommon" },
      { time: "00:02", event: "Beaconing alert generated" },
    ],

    recommendedAction:
      "Contain host, block destination domain and investigate persistence mechanisms.",
    expectedVerdict: "Malicious",
  },

  {
    id: "SOC-8819",
    title: "Repeated SQL injection attempts blocked by WAF",
    severity: "Medium",
    category: "Web",
    source: "Web Application Firewall",
    datasource: "Cloudflare WAF",
    status: "open",
    timestamp: "2026-05-07 00:14",
    direction: "inbound",
    description:
      "WAF detected repeated SQL injection payloads targeting the authentication endpoint.",

    artifact: {
      subject: "WAF anomaly report",
      sender: "waf.alerts@internal",
      recipient: "soc@company.local",
      attachment: "waf-events.csv",
      content:
        "Multiple requests to /login contained SQL injection patterns including OR 1=1 and UNION SELECT probes.",
    },

    indicators: [
      { type: "path", value: "/login", verdict: "suspicious" },
      { type: "payload", value: "' OR '1'='1", verdict: "malicious" },
      { type: "payload", value: "UNION SELECT", verdict: "malicious" },
    ],

    signals: [
      "Authentication endpoint targeted",
      "Known SQLi payload patterns",
      "Repeated probing",
      "WAF blocked requests",
    ],

    timeline: [
      { time: "00:10", event: "First suspicious login request blocked" },
      { time: "00:12", event: "Payload variation detected" },
      { time: "00:14", event: "WAF rule threshold exceeded" },
    ],

    recommendedAction:
      "Review source IP reputation, confirm WAF blocks, and notify application team to inspect logs.",
    expectedVerdict: "Suspicious",
  },

  {
    id: "SOC-8820",
    title: "Approved internal vulnerability scan",
    severity: "Low",
    category: "Network",
    source: "Network Sensor",
    datasource: "Zeek",
    status: "open",
    timestamp: "2026-05-07 00:25",
    direction: "internal",
    description:
      "Large port scan detected from an internal security scanner during approved testing window.",

    artifact: {
      subject: "Internal scan activity",
      sender: "network.sensor@internal",
      recipient: "soc@company.local",
      attachment: "scan-summary.log",
      content:
        "Host scanner-01 initiated broad TCP scan across internal subnet. Change ticket CHG-2026-051 approved this activity.",
    },

    indicators: [
      { type: "host", value: "scanner-01", verdict: "clean" },
      { type: "ticket", value: "CHG-2026-051", verdict: "clean" },
      { type: "activity", value: "broad-tcp-scan", verdict: "suspicious" },
    ],

    signals: [
      "Broad internal scan",
      "Known scanner host",
      "Approved change ticket",
      "Expected testing window",
    ],

    timeline: [
      { time: "00:20", event: "Internal TCP scan detected" },
      { time: "00:21", event: "Scanner host matched allowlist" },
      { time: "00:22", event: "Change ticket validated" },
    ],

    recommendedAction:
      "Mark benign and attach the approved change ticket to the alert record.",
    expectedVerdict: "Benign",
  },
];
