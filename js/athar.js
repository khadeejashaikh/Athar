(function () {
  var KEY = "athar_points";

  var LEVELS = [
    { name: "Seed", min: 0 },
    { name: "Sprout", min: 50 },
    { name: "Branch", min: 150 },
    { name: "Tree", min: 300 }
  ];

  var BADGES = {
    "Scam Spotter":   "Score 6 or more in Real or Scam?",
    "Triple Giver":   "Explore the money, items and volunteer pages",
    "Streak Starter": "Complete 3 days of the Small Acts challenge",
    "Week Finisher":  "Complete all 7 days of the Small Acts challenge",
    "Local Hero":     "Explore every cause for your emirate",
    "Log Keeper":     "Add 3 entries to your giving log"
  };

  function defaults() {
    return { points: 0, badges: [], awarded: {}, challenge: [], log: [], game: {} };
  }

  function getData() {
    try {
      var raw = JSON.parse(localStorage.getItem(KEY));
      if (raw && typeof raw === "object") {
        var d = defaults();
        for (var k in d) { if (raw[k] === undefined) raw[k] = d[k]; }
        return raw;
      }
    } catch (e) { /* storage empty or blocked */ }
    return defaults();
  }

  function saveData(d) {
    try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) { /* ignore */ }
  }

  /* ---------- levels ---------- */
  function getLevelInfo(points) {
    if (points === undefined) points = getData().points;
    var idx = 0;
    for (var i = 0; i < LEVELS.length; i++) { if (points >= LEVELS[i].min) idx = i; }
    var cur = LEVELS[idx], next = LEVELS[idx + 1] || null;
    var pct = next ? Math.round(((points - cur.min) / (next.min - cur.min)) * 100) : 100;
    return { name: cur.name, index: idx, points: points, next: next ? next.name : null,
             nextAt: next ? next.min : null, percent: pct };
  }
  function getLevel() { return getLevelInfo().name; }

  /* ---------- points ---------- */
  function addPoints(n) {
    var d = getData();
    var before = getLevelInfo(d.points).name;
    d.points += n;
    saveData(d);
    var after = getLevelInfo(d.points).name;
    showToast("+" + n + " points");
    if (after !== before) setTimeout(function () { showToast("Level up! You are now a " + after); }, 1600);
    updateLevelChip();
    return d.points;
  }

  // Give points only ONE time per key, so nobody can farm points by clicking again.
  function awardOnce(key, n) {
    var d = getData();
    if (d.awarded[key]) return false;
    d.awarded[key] = true;
    saveData(d);
    addPoints(n);
    return true;
  }

  /* ---------- badges ---------- */
  function hasBadge(name) { return getData().badges.indexOf(name) !== -1; }
  function giveBadge(name) {
    var d = getData();
    if (d.badges.indexOf(name) !== -1) return false;
    d.badges.push(name);
    saveData(d);
    showToast("New badge: " + name);
    return true;
  }

  /* ---------- exploring pages (for teammates) ----------
     markExplored("money") / ("items") / ("volunteer")  -> 5 points once each
     markExplored("cause-education") etc.               -> 5 points once each   */
  function markExplored(name) {
    awardOnce("explore-" + name, 5);
    var d = getData();
    if (d.awarded["explore-money"] && d.awarded["explore-items"] && d.awarded["explore-volunteer"]) {
      giveBadge("Triple Giver");
    }
  }

  /* ---------- reset (for demos) ---------- */
  function resetAthar() {
    try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
    updateLevelChip();
  }

  /* ---------- small pop-up message ---------- */
  function ensureStyles() {
    if (document.getElementById("athar-toast-style")) return;
    var s = document.createElement("style");
    s.id = "athar-toast-style";
    s.textContent =
      "#athar-toasts{position:fixed;bottom:20px;right:20px;display:flex;flex-direction:column;gap:8px;z-index:9999;pointer-events:none}" +
      ".athar-toast{background:#0F6B4F;color:#fff;padding:10px 16px;border-radius:10px;font:600 14px/1.3 system-ui,sans-serif;" +
      "box-shadow:0 4px 14px rgba(0,0,0,.2);border-left:4px solid #B8923A;animation:atharIn .25s ease}" +
      "@keyframes atharIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}" +
      "@media (prefers-reduced-motion:reduce){.athar-toast{animation:none}}";
    document.head.appendChild(s);
  }
  function showToast(msg) {
    if (!document.body) return;
    ensureStyles();
    var box = document.getElementById("athar-toasts");
    if (!box) {
      box = document.createElement("div");
      box.id = "athar-toasts";
      box.setAttribute("aria-live", "polite");
      document.body.appendChild(box);
    }
    var t = document.createElement("div");
    t.className = "athar-toast";
    t.textContent = msg;
    box.appendChild(t);
    setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 2800);
  }

  /* ---------- level chip for the navigation bar ----------
     Any element with id="athar-level" shows e.g. "Sprout · 60 pts"  */
  function updateLevelChip() {
    var el = document.getElementById("athar-level");
    if (!el) return;
    var i = getLevelInfo();
    el.innerHTML = "";
    var top = document.createElement("span");
    top.textContent = "LEVEL " + (i.index + 1) + " · " + i.name.toUpperCase();
    var bottom = document.createElement("b");
    bottom.textContent = i.points + " POINTS";
    el.appendChild(top);
    el.appendChild(bottom);
}
  document.addEventListener("DOMContentLoaded", updateLevelChip);

  /* ---------- make the functions available to every page ---------- */
  window.ATHAR_BADGES = BADGES;
  window.ATHAR_LEVELS = LEVELS;
  window.getData = getData;
  window.saveData = saveData;
  window.addPoints = addPoints;
  window.awardOnce = awardOnce;
  window.getLevel = getLevel;
  window.getLevelInfo = getLevelInfo;
  window.giveBadge = giveBadge;
  window.hasBadge = hasBadge;
  window.markExplored = markExplored;
  window.resetAthar = resetAthar;
  window.showToast = showToast;
  window.updateLevelChip = updateLevelChip;
})();
