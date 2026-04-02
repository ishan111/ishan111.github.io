(function () {
  const config = window.CT_DEMO_CONFIG || {};
  const eventLog = document.getElementById("eventLog");
  const permissionStatus = document.getElementById("permissionStatus");

  function nowStamp() {
    return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }

  function log(message, data) {
    const wrapper = document.createElement("div");
    wrapper.className = "entry";

    const time = document.createElement("div");
    time.className = "time";
    time.textContent = `[${nowStamp()}]`;

    const msg = document.createElement("div");
    msg.textContent = message;

    wrapper.appendChild(time);
    wrapper.appendChild(msg);

    if (data !== undefined) {
      const pre = document.createElement("pre");
      pre.textContent = typeof data === "string" ? data : JSON.stringify(data, null, 2);
      pre.style.margin = "8px 0 0";
      pre.style.whiteSpace = "pre-wrap";
      wrapper.appendChild(pre);
    }

    eventLog.prepend(wrapper);
  }

  function getField(id) {
    return document.getElementById(id).value.trim();
  }

  function getIdentityPayload() {
    const email = getField("email");
    const identity = getField("identity") || email;
    const payload = {
      Name: getField("name") || "Demo User",
      Email: email,
      Identity: identity
    };

    const phone = getField("phone");
    if (phone) payload.Phone = phone;

    return payload;
  }

  function validateConfig() {
    if (!config.accountId || config.accountId === "REPLACE_WITH_CLEVERTAP_ACCOUNT_ID") {
      log("CleverTap account ID is missing. Edit config.js before going live.");
      return false;
    }
    return true;
  }

  function initCleverTap() {
    window.clevertap = {
      event: [],
      profile: [],
      account: [],
      onUserLogin: [],
      notifications: [],
      privacy: [],
      region: config.region || "in1"
    };

    if (config.targetDomain) {
      window.clevertap.account.push({ id: config.accountId }, config.region || "in1", config.targetDomain);
    } else {
      window.clevertap.account.push({ id: config.accountId });
    }

    window.clevertap.privacy.push({ optOut: false });
    window.clevertap.privacy.push({ useIP: false });

    const sdkScript = document.createElement("script");
    sdkScript.type = "text/javascript";
    sdkScript.async = true;
    sdkScript.src = (document.location.protocol === "https:" ? "https://d2r1yp2w7bby2u.cloudfront.net" : "http://static.clevertap.com") + "/js/clevertap.min.js";
    sdkScript.onload = function () {
      log("CleverTap Web SDK loaded.", { accountId: config.accountId, region: config.region || "default" });

      if (config.enableLocalStorageEncryption && typeof window.clevertap.enableLocalStorageEncryption === "function") {
        window.clevertap.enableLocalStorageEncryption(true);
        log("Local storage encryption enabled.");
      }
    };
    sdkScript.onerror = function () {
      log("Failed to load CleverTap Web SDK. Check network access and config.");
    };

    document.head.appendChild(sdkScript);
  }

  function updatePermissionStatus() {
    if (!("Notification" in window)) {
      permissionStatus.textContent = "Not supported";
      permissionStatus.className = "status-pill warning";
      return;
    }

    const permission = Notification.permission;
    const mapping = {
      granted: { text: "Granted", cls: "status-pill success" },
      denied: { text: "Denied", cls: "status-pill warning" },
      default: { text: "Not requested yet", cls: "status-pill neutral" }
    };

    const current = mapping[permission] || mapping.default;
    permissionStatus.textContent = current.text;
    permissionStatus.className = current.cls;
  }

  function identifyUser() {
    const payload = getIdentityPayload();

    if (!payload.Email) {
      alert("Please enter an email.");
      return;
    }

    window.clevertap.onUserLogin.push({ Site: payload });
    log("onUserLogin pushed to CleverTap.", payload);
  }

  function updateProfile() {
    const payload = getIdentityPayload();

    if (!payload.Email) {
      alert("Please enter an email.");
      return;
    }

    window.clevertap.profile.push({ Site: payload });
    log("Profile update pushed to CleverTap.", payload);
  }

  function trackEvent(name, props) {
    window.clevertap.event.push(name, props);
    log(`Event tracked: ${name}`, props);
  }

function enablePush(customTitle) {
  const titleText = customTitle || "Stay updated with personalized alerts?";

  setTimeout(() => {
    window.clevertap.notifications.push({
      titleText,
      bodyText: "Allow notifications to receive updates.",
      okButtonText: "Allow",
      rejectButtonText: "No thanks",
      okButtonColor: "#a51c30",
      serviceWorkerPath: "/clevertap_sw.js"
    });

    console.log("CT push triggered after delay");
  }, 2000);
}

  document.getElementById("identifyUserBtn").addEventListener("click", identifyUser);
  document.getElementById("pushProfileBtn").addEventListener("click", updateProfile);

  document.getElementById("viewHomeBtn").addEventListener("click", function () {
    trackEvent("Home Page Viewed", {
      page_name: "Demo Landing Page",
      source: "github_pages_demo",
      platform: "web"
    });
  });

  document.getElementById("viewOfferBtn").addEventListener("click", function () {
    trackEvent("Offer Viewed", {
      offer_type: "Credit Card",
      offer_name: "IDFC FIRST Wealth Card",
      placement: "Hero Banner"
    });
  });

  document.getElementById("startJourneyBtn").addEventListener("click", function () {
    trackEvent("Application Started", {
      product: "Credit Card",
      step_name: "basic_details",
      journey_name: "web_acquisition_demo"
    });
  });

  document.getElementById("clickCtaBtn").addEventListener("click", function () {
    trackEvent("CTA Clicked", {
      cta_name: "Apply Now",
      section: "Offer Card",
      destination: "Lead Form"
    });
  });

  document.getElementById("purchaseIntentBtn").addEventListener("click", function () {
    trackEvent("High Intent Captured", {
      score_band: "high",
      trigger: "multiple_engagement_events",
      campaign_readiness: "retarget"
    });
  });

  document.getElementById("enablePushBtn").addEventListener("click", function () {
    enablePush();
  });

  document.getElementById("softPromptBtn").addEventListener("click", function () {
    enablePush("Would you like browser notifications for this demo?");
  });

  updatePermissionStatus();
  if (validateConfig()) initCleverTap();
  log("Demo UI ready. Fill in user details, then identify the user.");
})();
