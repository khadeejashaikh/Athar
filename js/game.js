(function () {
  var CARDS = [
    { id: "c1", kind: "WhatsApp message",
      text: "URGENT!! A child needs surgery today. Send 500 AED to this personal number right now. Please don't tell anyone and don't ask questions.",
      scam: true,
      why: "It pushes you to act right now, asks for money to a personal number, and tells you to keep it secret. Real charities use official channels and never ask for secrecy." },
    { id: "c2", kind: "Community poster",
      text: "Winter clothes drive. Drop off clean, good-condition jackets on Saturday 10am to 2pm at the community hall. Organisation name, phone number and website are printed at the bottom.",
      scam: false,
      why: "It names the organisation, gives clear details, and asks for useful items in good condition. Even so, check the details on the organisation's own website before you go." },
    { id: "c3", kind: "Email",
      text: "Congratulations! Your donation entered you into a prize draw. Click here and enter your card number and security code to claim your gift.",
      scam: true,
      why: "Charities do not ask for your card details to send you a prize. This is a phishing trick. Never enter card details from a link in a message." },
    { id: "c4", kind: "Social media post",
      text: "Please help my family. Transfer any amount to my friend's personal account. No time to explain. Share this post!",
      scam: true,
      why: "No organisation, no details, and the money goes to a personal account. If you want to help someone, use an official, authorised channel." },
    { id: "c5", kind: "Donation website",
      text: "You typed the organisation's official website address yourself. The page shows its name, contact details, and a clear donation page. A friend's link is not needed.",
      scam: false,
      why: "Typing the official address yourself, or finding it through UAE government guidance, is the safest way to reach a donation page. Always check that the address looks right." },
    { id: "c6", kind: "Person at the mall",
      text: "Someone with an unmarked box asks for cash. They have no badge, no organisation name, and no permit to show.",
      scam: true,
      why: "Authorised collectors can show who they represent and have permission to collect. If they cannot, do not give. You can donate through the organisation's official channel instead." },
    { id: "c7", kind: "Volunteer advert",
      text: "Volunteers wanted for a beach clean-up. Details and sign-up are listed on the organisation's own website and on an official volunteering platform.",
      scam: false,
      why: "The sign-up is on official, checkable pages. There is no fee and no request for money or personal documents. Confirm the date on the official page before you go." },
    { id: "c8", kind: "Text message",
      text: "ONLY 10 MINUTES LEFT! Donate now or the campaign closes forever! Pay using this link.",
      scam: true,
      why: "Fake countdowns create panic so you do not stop to check. Real campaigns do not need you to decide in minutes." }
  ];

  var order, pos, score, locked;
  var el = {
    kind: document.getElementById("card-kind"), text: document.getElementById("card-text"),
    real: document.getElementById("btn-real"), scam: document.getElementById("btn-scam"),
    feedback: document.getElementById("feedback"), next: document.getElementById("btn-next"),
    progress: document.getElementById("progress-text"), play: document.getElementById("play-area"),
    end: document.getElementById("end-area"), result: document.getElementById("result-text"),
    again: document.getElementById("btn-again")
  };

  function shuffle(a) {
    a = a.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1)); var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function start() {
    order = shuffle(CARDS); pos = 0; score = 0;
    el.end.hidden = true; el.play.hidden = false;
    showCard();
  }

  function showCard() {
    var c = order[pos]; locked = false;
    el.kind.textContent = c.kind;
    el.text.textContent = c.text;
    el.progress.textContent = "Message " + (pos + 1) + " of " + order.length;
    el.feedback.hidden = true; el.feedback.className = "feedback";
    el.next.hidden = true;
    el.real.disabled = false; el.scam.disabled = false;
    el.real.focus();
  }

  function answer(saysScam) {
    if (locked) return; locked = true;
    var c = order[pos], right = (saysScam === c.scam);
    if (right) {
      score++;
      var d = getData();
      if (!d.game[c.id]) { d.game[c.id] = true; saveData(d); addPoints(5); }
    }
    el.feedback.hidden = false;
    el.feedback.className = "feedback " + (right ? "right" : "wrong");
    el.feedback.textContent = (right ? "Correct. " : "Not quite. ") +
      "This one is " + (c.scam ? "suspicious" : "real-looking") + ". " + c.why;
    el.real.disabled = true; el.scam.disabled = true;
    el.next.textContent = pos === order.length - 1 ? "See my score" : "Next message";
    el.next.hidden = false; el.next.focus();
  }

  function next() {
    if (pos === order.length - 1) return finish();
    pos++; showCard();
  }

  function finish() {
    el.play.hidden = true; el.end.hidden = false;
    var msg = "You scored " + score + " out of " + order.length + ". ";
    if (score >= 6) { msg += "You spot scams well."; giveBadge("Scam Spotter"); }
    else msg += "Play again to improve and earn the Scam Spotter badge (6 or more).";
    el.result.textContent = msg;
  }

  el.real.addEventListener("click", function () { answer(false); });
  el.scam.addEventListener("click", function () { answer(true); });
  el.next.addEventListener("click", next);
  el.again.addEventListener("click", start);
  start();
})();
