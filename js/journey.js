(function () {
  var ACTS = [
    "Sort one shelf of books you no longer read",
    "Check on a neighbour or a relative",
    "Read about one organisation on the Money page",
    "Find one item at home in good condition that someone could use",
    "Look at one official volunteering platform",
    "Share one safe-giving tip with a friend",
    "Plan one small act for next week"
  ];
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function $(id) { return document.getElementById(id); }

  /* ----- level ----- */
  function renderLevel() {
    var i = getLevelInfo();
    $("level-name").textContent = i.name;
    $("points-text").textContent = i.points + " points";
    $("level-fill").style.width = i.percent + "%";
    $("level-bar").setAttribute("aria-valuenow", i.percent);
    $("next-text").textContent = i.next
      ? (i.nextAt - i.points) + " more points to reach " + i.next
      : "You reached the top level.";
    updateLevelChip();
  }

  /* ----- badges ----- */
  function renderBadges() {
    var earned = getData().badges, list = $("badge-list");
    list.innerHTML = "";
    Object.keys(ATHAR_BADGES).forEach(function (name) {
      var has = earned.indexOf(name) !== -1;
      var li = document.createElement("li");
      li.className = "badge" + (has ? " earned" : "");
      var s = document.createElement("strong"); s.textContent = name;
      var d = document.createElement("span"); d.textContent = ATHAR_BADGES[name];
      var st = document.createElement("span"); st.className = "status";
      st.textContent = has ? "Earned" : "Not yet";
      li.appendChild(s); li.appendChild(d); li.appendChild(document.createElement("br")); li.appendChild(st);
      list.appendChild(li);
    });
  }

  /* ----- challenge ----- */
  function streakOf(done) {
    var s = 0;
    for (var i = 0; i < 7; i++) { if (done[i]) s++; else break; }
    return s;
  }
  function renderChallenge() {
    var d = getData(), list = $("day-list");
    list.innerHTML = "";
    ACTS.forEach(function (act, i) {
      var li = document.createElement("li");
      if (d.challenge[i]) li.className = "done";
      var label = document.createElement("label");
      var cb = document.createElement("input");
      cb.type = "checkbox"; cb.checked = !!d.challenge[i];
      cb.addEventListener("change", function () { toggleDay(i, cb.checked); });
      var span = document.createElement("span");
      var b = document.createElement("strong"); b.textContent = "Day " + (i + 1) + ": ";
      var a = document.createElement("span"); a.className = "act"; a.textContent = act;
      span.appendChild(b); span.appendChild(a);
      label.appendChild(cb); label.appendChild(span); li.appendChild(label); list.appendChild(li);
    });
    var s = streakOf(d.challenge);
    $("streak-text").textContent = "Streak: " + s + (s === 1 ? " day" : " days") + " in a row from Day 1";
    $("week-done").hidden = !(s === 7);
  }
  function toggleDay(i, checked) {
    var d = getData();
    d.challenge[i] = checked;
    for (var k = 0; k < 7; k++) d.challenge[k] = !!d.challenge[k];
    saveData(d);
    if (checked) awardOnce("challenge-day-" + i, 10);
    var s = streakOf(d.challenge);
    if (s >= 3) giveBadge("Streak Starter");
    if (s === 7) giveBadge("Week Finisher");
    renderAll();
  }

  /* ----- giving log ----- */
  var shown = { hours: 0, items: 0, acts: 0 };
  function animate(id, key, to) {
    var el = $(id), from = shown[key];
    shown[key] = to;
    if (reduce || from === to) { el.textContent = to; return; }
    var start = null;
    function step(t) {
      if (start === null) start = t;
      var p = Math.min((t - start) / 600, 1);
      el.textContent = Math.round(from + (to - from) * p);
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
  var LABEL = { hours: "volunteer hours", items: "items given", acts: "small acts" };
  function renderLog() {
    var d = getData(), t = { hours: 0, items: 0, acts: 0 }, list = $("entry-list");
    list.innerHTML = "";
    d.log.forEach(function (e, idx) {
      if (t[e.type] !== undefined) t[e.type] += e.amount;
      var li = document.createElement("li");
      var txt = document.createElement("span");
      txt.textContent = e.amount + " " + LABEL[e.type] + (e.note ? " (" + e.note + ")" : "") + " on " + e.date;
      var del = document.createElement("button");
      del.type = "button"; del.className = "btn outline small"; del.textContent = "Remove";
      del.setAttribute("aria-label", "Remove entry: " + txt.textContent);
      del.addEventListener("click", function () { removeEntry(idx); });
      li.appendChild(txt); li.appendChild(del); list.appendChild(li);
    });
    if (!d.log.length) {
      var li = document.createElement("li"); li.className = "small";
      li.textContent = "No entries yet. Add your first one above."; list.appendChild(li);
    }
    animate("tot-hours", "hours", t.hours);
    animate("tot-items", "items", t.items);
    animate("tot-acts", "acts", t.acts);
  }
  function removeEntry(idx) {
    var d = getData(); d.log.splice(idx, 1); saveData(d); renderLog();
  }
  $("log-form").addEventListener("submit", function (ev) {
    ev.preventDefault();
    var err = $("log-error"), raw = $("log-amount").value.trim();
    var n = Number(raw);
    if (raw === "" || !isFinite(n) || n < 1 || n > 999 || Math.floor(n) !== n) {
      err.textContent = "Enter a whole number between 1 and 999."; $("log-amount").focus(); return;
    }
    err.textContent = "";
    var d = getData();
    d.log.push({ type: $("log-type").value, amount: n, note: $("log-note").value.trim(),
                 date: new Date().toLocaleDateString("en-GB") });
    saveData(d);
    $("log-amount").value = ""; $("log-note").value = "";
    if (d.log.length <= 10) addPoints(5);
    if (d.log.length >= 3) giveBadge("Log Keeper");
    renderAll();
  });

  $("reset-btn").addEventListener("click", function () {
    if (confirm("Reset your points, badges, challenge and log in this browser?")) {
      resetAthar(); shown = { hours: 0, items: 0, acts: 0 }; renderAll();
    }
  });

  function renderAll() { renderLevel(); renderBadges(); renderChallenge(); renderLog(); }
  renderAll();
})();
