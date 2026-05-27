/* =========================================================
  OPERATION 68 — SCRIPT.JS
========================================================= */

const MISSION_PASSWORD = "operation68";
const RECRUITER_EMAIL = "personalabteilung@operation68.de";

const TARGET_ACCESS_CODES = ["3141", "3.141", "3,141", "pi", "π"];

/* =========================================================
  HELPERS
========================================================= */

function normalizeAccessCode(value) {
  return value.trim().toLowerCase().replace(/\s+/g, "");
}

function focusAfterFlip(inputElement) {
  window.setTimeout(() => {
    inputElement?.focus();
  }, 350);
}

function flipAccessCard(card, inputElement) {
  if (!card) return;

  card.classList.add("is-flipped");
  focusAfterFlip(inputElement);
}

function setupAccessCardKeyboard(card, inputElement) {
  if (!card) return;

  card.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      flipAccessCard(card, inputElement);
    }
  });
}

/* =========================================================
  PAGE GUARDS
========================================================= */

const currentPath = window.location.pathname;

const isSupportPage = currentPath.includes("unterstuetzung.html");
const isTargetPage = currentPath.includes("zielperson.html");

if (isSupportPage) {
  const hasSupportAccess =
    sessionStorage.getItem("operation68Access") === "granted";

  if (!hasSupportAccess) {
    window.location.href = "index.html";
  }
}

/*
  Wichtig:
  Dieser Schutz greift nur, wenn du script.js auch in zielperson.html einbindest.
  Falls du dort kein script.js einbindest, brauchst du weiterhin das kleine Inline-Script.
*/
if (isTargetPage) {
  const hasTargetAccess =
    sessionStorage.getItem("operation68TargetAccess") === "granted";

  if (!hasTargetAccess) {
    window.location.href = "index.html";
  }
}

/* =========================================================
  INDEX: ZIELPERSONKARTE / IDENTIFIKATIONSNACHWEIS
========================================================= */

const targetAccessCard = document.querySelector("#targetAccessCard");
const targetAccessForm = document.querySelector("#targetAccessForm");
const targetAccessCode = document.querySelector("#targetAccessCode");
const targetAccessError = document.querySelector("#targetAccessError");


function normalizeTargetCode(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(",", ".");
}

function openTargetAccessCard() {
  if (!targetAccessCard) return;

  targetAccessCard.classList.add("is-flipped");

  window.setTimeout(() => {
    targetAccessCode?.focus();
  }, 350);
}

if (targetAccessCard) {
  targetAccessCard.addEventListener("click", (event) => {
    const clickedForm = event.target.closest("#targetAccessForm");
    const clickedInput = event.target.closest("input");
    const clickedButton = event.target.closest("button");

    if (clickedForm || clickedInput || clickedButton) return;

    openTargetAccessCard();
  });

  targetAccessCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const isInsideForm = event.target.closest("#targetAccessForm");

      if (isInsideForm) return;

      event.preventDefault();
      openTargetAccessCard();
    }
  });
}

if (targetAccessForm && targetAccessCode) {
  targetAccessForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const enteredCode = normalizeTargetCode(targetAccessCode.value);

    const isCorrectCode =
      enteredCode === "pi" ||
      enteredCode === "π" ||
      enteredCode === "3.141" ||
      enteredCode === "3141";

    if (isCorrectCode) {
      sessionStorage.setItem("operation68TargetAccess", "granted");
      window.location.assign("zielperson.html");
      return;
    }

    if (targetAccessError) {
      targetAccessError.textContent =
        "Identifikation fehlgeschlagen. Die Zielperson konnte mathematisch nicht bestätigt werden.";
    }

    targetAccessCode.value = "";
    targetAccessCode.focus();
  });
}

/* =========================================================
  INDEX: UNTERSTÜTZERKARTE / MISSIONS-CODE
========================================================= */


const supportAccessCard = document.querySelector("#supportAccessCard");
const indexMissionForm = document.querySelector("#indexMissionForm");
const indexMissionCode = document.querySelector("#indexMissionCode");
const indexMissionError = document.querySelector("#indexMissionError");

function openSupportAccessCard() {
  if (!supportAccessCard) return;

  supportAccessCard.classList.add("is-flipped");

  window.setTimeout(() => {
    indexMissionCode?.focus();
  }, 350);
}

if (supportAccessCard) {
  supportAccessCard.addEventListener("click", (event) => {
    const clickedForm = event.target.closest("#indexMissionForm");
    const clickedInput = event.target.closest("input");
    const clickedButton = event.target.closest("button");

    if (clickedForm || clickedInput || clickedButton) return;

    openSupportAccessCard();
  });

  supportAccessCard.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      const isInsideForm = event.target.closest("#indexMissionForm");

      if (isInsideForm) return;

      event.preventDefault();
      openSupportAccessCard();
    }
  });
}

if (indexMissionForm && indexMissionCode) {
  indexMissionForm.addEventListener("click", (event) => {
    event.stopPropagation();
  });

  indexMissionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    event.stopPropagation();

    const enteredPassword = indexMissionCode.value
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "");

    if (enteredPassword === MISSION_PASSWORD) {
      sessionStorage.setItem("operation68Access", "granted");
      window.location.assign("./unterstuetzung.html");
      return;
    }

    if (indexMissionError) {
      indexMissionError.textContent =
        "Zugriff verweigert. Falscher Missionscode.";
    }

    indexMissionCode.value = "";
    indexMissionCode.focus();
  });
}
/* =========================================================
  MISSION FLOW / SCREEN NAVIGATION
========================================================= */

const missionScreens = document.querySelectorAll(".mission-screen");
const missionNavButtons = document.querySelectorAll(".mission-nav__button");
const missionFlowButtons = document.querySelectorAll("[data-screen-target]");

function resetEvidenceBoardCards() {
  document.querySelector(".evidence-board")?.classList.remove("has-expanded-card");

  document.querySelectorAll(".flip-card").forEach((card) => {
    card.classList.remove("is-expanded");
    card.classList.remove("is-flipped");
  });
}

function showMissionScreen(screenName) {
  if (!screenName) return;

  missionScreens.forEach((screen) => {
    const isTargetScreen = screen.dataset.screen === screenName;
    screen.classList.toggle("is-active", isTargetScreen);
  });

missionNavButtons.forEach((button) => {
  const isTargetButton = button.dataset.screenTarget === screenName;
  button.classList.toggle("is-active", isTargetButton);

  if (isTargetButton) {
    button.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center"
    });
  }
});

  resetEvidenceBoardCards();

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}

missionFlowButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const targetScreen = button.dataset.screenTarget;
    showMissionScreen(targetScreen);
  });
});


/* =========================================================
  ERMITTLUNGSWAND: KARTEN GROSS ÖFFNEN / SCHLIESSEN
========================================================= */

const evidenceBoard = document.querySelector(".evidence-board");
const flipCards = document.querySelectorAll(".flip-card");

flipCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const clickedLink = event.target.closest("a");

    if (clickedLink) return;

    const isAlreadyExpanded = card.classList.contains("is-expanded");

    flipCards.forEach((otherCard) => {
      otherCard.classList.remove("is-expanded");
      otherCard.classList.remove("is-flipped");
    });

    if (isAlreadyExpanded) {
      evidenceBoard?.classList.remove("has-expanded-card");
      return;
    }

    card.classList.add("is-expanded");
    card.classList.add("is-flipped");
    evidenceBoard?.classList.add("has-expanded-card");

    /* Mobile: Karte bleibt an Ort und Stelle sichtbar */
    if (window.matchMedia("(max-width: 899px)").matches) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "center"
      });
    }
  });
});

/* Klick neben große Pinnwandkarte schließt sie */
if (evidenceBoard) {
  evidenceBoard.addEventListener("click", (event) => {
    const clickedCard = event.target.closest(".flip-card");

    if (clickedCard) return;

    resetEvidenceBoardCards();
  });
}
/* =========================================================
  BEWERBUNGSPOPUP / STELLEN
========================================================= */

const applicationModal = document.querySelector("#applicationModal");
const applicationForm = document.querySelector("#applicationForm");

const applicationRole = document.querySelector("#applicationRole");
const applicationStatus = document.querySelector("#applicationStatus");
const applicationDescription = document.querySelector("#applicationDescription");
const applicationEmail = document.querySelector("#applicationEmail");
const applicationMessage = document.querySelector("#applicationMessage");

const applicationCloseButtons = document.querySelectorAll("[data-close-application]");
const jobCards = document.querySelectorAll(".job-card");

function openApplicationModal(jobCard) {
  if (!applicationModal || !jobCard) return;

  const role = jobCard.dataset.role || "Unbekannter Posten";
  const status = jobCard.dataset.slots || jobCard.dataset.status || "Status unbekannt";
  const description =
    jobCard.dataset.description || "Keine Stellenbeschreibung hinterlegt.";

  if (applicationRole) applicationRole.value = role;
  if (applicationStatus) applicationStatus.value = status;
  if (applicationDescription) applicationDescription.value = description;
  if (applicationEmail) applicationEmail.value = "";
  if (applicationMessage) applicationMessage.value = "";

  applicationModal.classList.remove("hidden");
  applicationModal.setAttribute("aria-hidden", "false");

  window.setTimeout(() => {
    applicationEmail?.focus();
  }, 150);
}

function closeApplicationModal() {
  if (!applicationModal) return;

  applicationModal.classList.add("hidden");
  applicationModal.setAttribute("aria-hidden", "true");
}

jobCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    const clickedButton = event.target.closest(".job-open-button");
    const clickedTitle = event.target.closest("h3");

    if (!clickedButton && !clickedTitle) return;

    openApplicationModal(card);
  });
});

applicationCloseButtons.forEach((button) => {
  button.addEventListener("click", closeApplicationModal);
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeApplicationModal();
  }
});

if (applicationForm) {
  applicationForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const role = applicationRole?.value.trim() || "Unbekannter Posten";
    const status = applicationStatus?.value.trim() || "Status unbekannt";
    const applicantEmail = applicationEmail?.value.trim() || "";
    const message = applicationMessage?.value.trim() || "";

    const subject = `Bewerbung Entführungskomitee – ${role}`;

    const body = `
Nachricht an Mirjam W.
Leitung Personalmanagement & Berufungsverfahren

Beantragter Posten:
${role}

Status / Plätze:
${status}

E-Mail der bewerbenden Person:
${applicantEmail}

Bewerbung / Begründung:
${message}

Erklärung:
Hiermit bestätige ich meine Bereitschaft zur absoluten Geheimhaltung, zur ernsthaften Mitarbeit im Rahmen von Operation 68 sowie zur Einhaltung sämtlicher operativer Mindeststandards.

Diese Nachricht wurde über den internen Unterstützungsbereich von Operation 68 vorbereitet.
`.trim();

    const mailtoLink =
      `mailto:${encodeURIComponent(RECRUITER_EMAIL)}` +
      `?subject=${encodeURIComponent(subject)}` +
      `&body=${encodeURIComponent(body)}`;

    window.location.href = mailtoLink;
  });
}

/* =========================================================
  LANDING HUD — LIVE DATE / TIME / BATTERY
========================================================= */

const hudDate = document.querySelector("#hudDate");
const hudTime = document.querySelector("#hudTime");
const hudBatteryPercent = document.querySelector("#hudBatteryPercent");

function padNumber(number) {
  return String(number).padStart(2, "0");
}

function formatGermanDate(date) {
  const day = padNumber(date.getDate());
  const month = padNumber(date.getMonth() + 1);
  const year = date.getFullYear();

  return `${day}.${month}.${year}`;
}

function formatTime(date) {
  const hours = padNumber(date.getHours());
  const minutes = padNumber(date.getMinutes());

  return `${hours}:${minutes}`;
}

/*
  Akku-Logik:
  - 23:59 = 0 %
  - 08:00 = 100 %
  - zwischen 23:59 und 08:00 steigt der Akku
  - zwischen 08:00 und 23:59 sinkt der Akku
*/
function calculateBatteryPercent(date) {
  const minutesNow = date.getHours() * 60 + date.getMinutes();

  const fullBatteryMinute = 8 * 60;
  const emptyBatteryMinute = 23 * 60 + 59;
  const minutesPerDay = 24 * 60;

  let percent;

  if (minutesNow >= fullBatteryMinute && minutesNow <= emptyBatteryMinute) {
    const dayProgress =
      (minutesNow - fullBatteryMinute) /
      (emptyBatteryMinute - fullBatteryMinute);

    percent = 100 - dayProgress * 100;
  } else {
    const minutesSinceEmpty =
      minutesNow > emptyBatteryMinute
        ? minutesNow - emptyBatteryMinute
        : minutesNow + minutesPerDay - emptyBatteryMinute;

    const rechargeDuration =
      fullBatteryMinute + minutesPerDay - emptyBatteryMinute;

    percent = (minutesSinceEmpty / rechargeDuration) * 100;
  }

  return Math.max(0, Math.min(100, Math.round(percent)));
}

function updateLandingHud() {
  const now = new Date();

  if (hudDate) {
    hudDate.textContent = formatGermanDate(now);
  }

  if (hudTime) {
    hudTime.textContent = formatTime(now);
  }

  if (hudBatteryPercent) {
    const batteryPercent = calculateBatteryPercent(now);
    hudBatteryPercent.textContent = `${batteryPercent}%`;
  }
}

if (hudDate || hudTime || hudBatteryPercent) {
  updateLandingHud();
  window.setInterval(updateLandingHud, 1000);
}
