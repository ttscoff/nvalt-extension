var INJECT_FILES = ["url.js", "content-script.js"];

function withActiveTab(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    callback(tabs && tabs.length ? tabs[0] : null);
  });
}

function manifestHas(permission) {
  var manifest = chrome.runtime.getManifest();
  var permissions = (manifest && manifest.permissions) || [];
  return permissions.indexOf(permission) !== -1;
}

function injectOne(tabId, file, callback) {
  function finish() {
    var error = chrome.runtime.lastError;
    callback(error ? error.message : null);
  }
  if (manifestHas("scripting") && chrome.scripting && chrome.scripting.executeScript) {
    chrome.scripting.executeScript({ target: { tabId: tabId }, files: [file] }, finish);
    return;
  }
  if (chrome.tabs && chrome.tabs.executeScript) {
    chrome.tabs.executeScript(tabId, { file: file }, finish);
    return;
  }
  callback("Cannot inject a script into this page.");
}

function injectFiles(tabId, files, callback) {
  var index = 0;
  function next(error) {
    if (error) {
      callback(error);
      return;
    }
    if (index >= files.length) {
      callback(null);
      return;
    }
    var file = files[index];
    index += 1;
    injectOne(tabId, file, next);
  }
  next(null);
}

function sendTabMessage(tabId, message, callback) {
  chrome.tabs.sendMessage(tabId, message, function (response) {
    if (chrome.runtime.lastError) {
      callback(null);
      return;
    }
    callback(response || null);
  });
}

function ensureContentScript(tabId, callback) {
  sendTabMessage(tabId, { type: "ping" }, function (response) {
    if (response && response.ok) {
      callback(true);
      return;
    }
    injectFiles(tabId, INJECT_FILES, function (error) {
      callback(!error, error);
    });
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (!request || request.type !== "popupAction") {
    return;
  }
  withActiveTab(function (tab) {
    if (!tab || typeof tab.id !== "number") {
      sendResponse({ ok: false, error: "No active tab." });
      return;
    }
    ensureContentScript(tab.id, function (ready, error) {
      if (!ready) {
        sendResponse({ ok: false, error: error || "This page cannot be scripted." });
        return;
      }
      sendTabMessage(tab.id, {
        type: request.action,
        title: request.title || "",
        readability: request.readability === "1" ? "1" : "0"
      }, function (response) {
        sendResponse(response || { ok: false, error: "No response from the page." });
      });
    });
  });
  return true;
});
