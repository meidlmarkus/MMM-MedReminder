Module.register("MMM-MedReminder", {

  defaults: {
    text: "Ramipril nehmen!",
    alreadyText: "Heute schon genommen",
    notificationTrigger: "MED_TAKEN",
    resetNotification: "MED_RESET",
    resetHour: 3,
    debug: true,
    showDoneMs: 5000   // Anzeigezeit nach Einnahme
  },

  start: function () {
    this.state = this.loadState();
    this.showDoneUntil = 0;

    this.log("START", this.state);

    this.checkResetLoop();
  },

  getStyles: function () {
    return ["MMM-MedReminder.css"];
  },

  // ---------- UI ----------
  getDom: function () {
    const wrapper = document.createElement("div");
    wrapper.className = "med-wrapper";

    const now = Date.now();

    // ----- OFFEN -----
    if (!this.state.taken) {
      wrapper.innerHTML = `
        <div class="med-dot med-dot-open"></div>
        <div class="med-text">${this.config.text}</div>
      `;
      return wrapper;
    }

    // ----- ERLEDIGT (nur kurz sichtbar) -----
    if (now < this.showDoneUntil) {
      wrapper.innerHTML = `
        <div class="med-dot med-dot-done"></div>
      `;
      return wrapper;
    }

    // ----- sonst nichts anzeigen -----
    return wrapper;
  },

  // ---------- NOTIFICATIONS ----------
  notificationReceived: function (notification) {
    this.log("NOTIFICATION", notification);

    if (notification === this.config.notificationTrigger) {
      this.handleTaken();
    }

    if (notification === this.config.resetNotification) {
      this.handleReset();
    }
  },

  // ---------- LOGIC ----------
  handleTaken: function () {
    const today = this.getTodayString();

    if (this.state.date === today && this.state.taken) {
      this.log("ALREADY_TAKEN");

      this.sendNotification("SHOW_ALERT", {
        message: this.config.alreadyText,
        timer: 2000
      });
      return;
    }

    const now = new Date();
    const timeStr = now.toTimeString().slice(0, 5);

    this.state = {
      taken: true,
      date: today,
      time: timeStr
    };

    this.showDoneUntil = Date.now() + this.config.showDoneMs;

    this.saveState();
    this.updateDom();

    this.log("SET_TAKEN", this.state);

    this.sendNotification("SHOW_ALERT", {
      message: "genommen um " + timeStr,
      timer: 2000
    });

    // nach Ablauf automatisch wieder ausblenden
    setTimeout(() => this.updateDom(), this.config.showDoneMs + 100);
  },

  handleReset: function () {
    this.state = {
      taken: false,
      date: this.getTodayString(),
      time: null
    };

    this.showDoneUntil = 0;

    this.saveState();
    this.updateDom();

    this.log("RESET", this.state);

    this.sendNotification("SHOW_ALERT", {
      message: "Medikation zurückgesetzt",
      timer: 1500
    });
  },

  // ---------- RESET LOOP ----------
  checkResetLoop: function () {
    setInterval(() => {
      const today = this.getTodayString();

      if (this.state.date !== today) {
        this.log("AUTO_RESET");

        this.state = {
          taken: false,
          date: today,
          time: null
        };

        this.showDoneUntil = 0;

        this.saveState();
        this.updateDom();
      }
    }, 60000);
  },

  // ---------- HELPERS ----------
  getTodayString: function () {
    const now = new Date();

    if (now.getHours() < this.config.resetHour) {
      now.setDate(now.getDate() - 1);
    }

    return now.toISOString().split("T")[0];
  },

  loadState: function () {
    try {
      const raw = localStorage.getItem("MMM-MedReminder");

      if (!raw) {
        return {
          taken: false,
          date: this.getTodayString(),
          time: null
        };
      }

      return JSON.parse(raw);

    } catch (e) {
      return {
        taken: false,
        date: this.getTodayString(),
        time: null
      };
    }
  },

  saveState: function () {
    localStorage.setItem("MMM-MedReminder", JSON.stringify(this.state));
  },

  // ---------- LOGGING ----------
  log: function (msg, obj = null) {
    if (!this.config.debug) return;

    if (obj) {
      console.log("[MMM-MedReminder]", msg, obj);
    } else {
      console.log("[MMM-MedReminder]", msg);
    }
  }
});