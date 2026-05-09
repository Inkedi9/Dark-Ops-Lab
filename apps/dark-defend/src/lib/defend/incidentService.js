const INCIDENTS_KEY = "darkdefend-incidents";

export function getIncidents() {
  const stored = localStorage.getItem(INCIDENTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function createIncidentFromScenario({
  email,
  result,
  mode,
  forced = false,
}) {
  if (!email) return null;

  if (result?.isCorrect && !forced) return null;

  const incident = {
    id: `INC-${Date.now()}`,
    scenarioId: email.id,
    title: `Missed phishing artifact: ${email.subject}`,
    severity:
      email.riskLevel === "Critical" || email.riskLevel === "High"
        ? "High"
        : "Medium",
    category: "Human-layer detection",
    source: "Phishing Simulator",
    status: "open",
    createdAt: new Date().toISOString(),
    mode,
    forced,
    reason: forced
      ? "Analyst manually escalated this artifact to SOC."
      : "Missed phishing decision generated automatic SOC review.",
    artifact: {
      sender: email.senderEmail,
      subject: email.subject,
      attachment: email.attachment || "None",
      url: email.linkUrl || "None",
      brand: email.brand || "default",
      avatar:
        email.avatar || email.senderName?.slice(0, 2).toUpperCase() || "EM",
    },
    signals: email.redFlags || [],
    recommendedAction:
      "Review missed indicators, notify user, and escalate to SOC if similar messages appear.",
  };

  const incidents = getIncidents();
  localStorage.setItem(INCIDENTS_KEY, JSON.stringify([incident, ...incidents]));

  return incident;
}

export function mapIncidentToSocAlert(incident) {
  return {
    id: incident.id,
    title: incident.title,
    severity: incident.severity,
    category: incident.category,
    source: incident.source,
    datasource: "DarkDefend Simulator",
    status: incident.status,
    timestamp: new Date(incident.createdAt).toLocaleString(),
    direction: "inbound",
    description: incident.reason,

    artifact: {
      subject: incident.artifact.subject,
      sender: incident.artifact.sender,
      recipient: "soc@darkdefend.local",
      attachment: incident.artifact.attachment,
      brand: incident.artifact.brand || "default",
      avatar: incident.artifact.avatar || "EM",
      content: `Missed simulator decision detected.\n\nSubject: ${incident.artifact.subject}\nSender: ${incident.artifact.sender}\nURL: ${incident.artifact.url}`,
    },

    indicators: [
      {
        type: "simulator",
        value: incident.scenarioId,
        verdict: "suspicious",
      },
    ],

    signals: incident.signals?.length
      ? incident.signals
      : ["Missed human-layer detection"],

    timeline: [
      {
        time: new Date(incident.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        event: incident.forced
          ? "Analyst manually escalated artifact"
          : "Simulator generated missed-decision incident",
      },
      {
        time: new Date(incident.createdAt).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        event: "Incident forwarded into SOC queue",
      },
    ],

    recommendedAction: incident.recommendedAction,
    expectedVerdict: "Suspicious",
    generated: true,
  };
}
