export function calculateEmailScore(scenario, verdict, selectedFlags, mode = "beginner") {
  let score = 0;
  let isCorrect = false;

  const expectedType = scenario.type;
  const expectedFlags = scenario.redFlags || [];

  if (verdict === expectedType) {
    score += 50;
    isCorrect = true;
  } else if (expectedType === "phishing" && verdict === "suspicious") {
    score += 20;
  } else if (expectedType === "legitimate" && verdict === "suspicious") {
    score += 0;
  } else if (expectedType === "legitimate" && verdict === "phishing") {
    score -= 10;
  } else if (expectedType === "phishing" && verdict === "legitimate") {
    score -= 20;
  }

  const matchedFlags = selectedFlags.filter((flag) =>
    expectedFlags.includes(flag),
  );

  const falseFlags = selectedFlags.filter(
    (flag) => !expectedFlags.includes(flag),
  );

  score += matchedFlags.length * 8;
  score -= falseFlags.length * 3;

  if (expectedType === "phishing" && matchedFlags.length === 0) {
    score -= 10;
  }

  if (
    isCorrect &&
    falseFlags.length === 0 &&
    matchedFlags.length === expectedFlags.length
  ) {
    score += 10;
  }

  if (mode === "analyst") {
    score += isCorrect ? 5 : -5;
    score -= falseFlags.length * 2;
  }

  if (score < 0) score = 0;
  if (score > 100) score = 100;

  const feedback = buildFeedback({
    scenario,
    verdict,
    expectedType,
    expectedFlags,
    matchedFlags,
    falseFlags,
    mode,
    isCorrect,
  });

  return {
    score,
    isCorrect,
    matchedFlags,
    falseFlags,
    missedFlags: expectedFlags.filter((flag) => !selectedFlags.includes(flag)),
    feedback,
    mode,
  };
}

function buildFeedback({
  scenario,
  verdict,
  expectedType,
  expectedFlags,
  matchedFlags,
  falseFlags,
  mode,
  isCorrect,
}) {
  const missedFlags = expectedFlags.filter((flag) => !matchedFlags.includes(flag));
  const messages = [];

  if (isCorrect) {
    messages.push({
      tone: "success",
      title: "Verdict correct",
      text:
        expectedType === "phishing"
          ? "You correctly treated this artifact as a phishing attempt."
          : "You correctly avoided over-reporting a legitimate message.",
    });
  } else {
    messages.push({
      tone: "warning",
      title: "Verdict needs review",
      text: `You chose "${verdict}", but the expected verdict was "${expectedType}".`,
    });
  }

  if (expectedType === "phishing" && matchedFlags.length > 0) {
    messages.push({
      tone: "success",
      title: "Good signal detection",
      text: `You identified ${matchedFlags.length} useful red flag${matchedFlags.length > 1 ? "s" : ""}.`,
    });
  }

  if (missedFlags.length > 0) {
    messages.push({
      tone: "warning",
      title: "Missed indicators",
      text: `Review these signals: ${missedFlags.slice(0, 3).join(", ")}${missedFlags.length > 3 ? "..." : ""}.`,
    });
  }

  if (falseFlags.length > 0) {
    messages.push({
      tone: "warning",
      title: "Noise selected",
      text: `These selected flags were not expected here: ${falseFlags.slice(0, 2).join(", ")}${falseFlags.length > 2 ? "..." : ""}.`,
    });
  }

  if (expectedType === "legitimate" && falseFlags.length === 0 && isCorrect) {
    messages.push({
      tone: "success",
      title: "False positive avoided",
      text: "Good restraint. Not every security-looking email is malicious.",
    });
  }

  if (mode === "analyst") {
    messages.push({
      tone: "info",
      title: "Analyst mode",
      text: "Scoring is stricter because learning hints are hidden.",
    });
  }

  messages.push({
    tone: "info",
    title: "Takeaway",
    text: scenario.beginnerTip || scenario.explanation,
  });

  return messages;
}

export function getFinalStats(results) {
  const totalScore = results.reduce((acc, item) => acc + item.score, 0);
  const correct = results.filter((item) => item.isCorrect).length;
  const phishingCaught = results.filter(
    (item) => item.expectedType === "phishing" && item.verdict === "phishing",
  ).length;
  const falsePositives = results.filter(
    (item) => item.expectedType === "legitimate" && item.verdict === "phishing",
  ).length;
  const falseNegatives = results.filter(
    (item) => item.expectedType === "phishing" && item.verdict === "legitimate",
  ).length;

  return {
    totalScore,
    accuracy: results.length ? Math.round((correct / results.length) * 100) : 0,
    phishingCaught,
    falsePositives,
    falseNegatives,
  };
}
