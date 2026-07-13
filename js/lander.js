(function () {
  const countdownEl = {
    h: document.getElementById("t-h"),
    m: document.getElementById("t-m"),
    s: document.getElementById("t-s"),
  };

  const stockEl = document.getElementById("stock-left");
  const stockCopy = document.getElementById("stock-copy");
  const sticky = document.getElementById("sticky-cta");
  const orderForm = document.getElementById("order-form");
  const toastWrap = document.getElementById("toast-wrap");

  function setStock(value) {
    const text = String(value);
    if (stockEl) stockEl.textContent = text;
    if (stockCopy) stockCopy.textContent = text;
  }

  // Countdown resets daily — urgency without lying about fixed server time
  function endOfPromo() {
    const now = new Date();
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    if (now > end) end.setDate(end.getDate() + 1);
    return end;
  }

  function pad(n) {
    return String(n).padStart(2, "0");
  }

  function tick() {
    const diff = Math.max(0, endOfPromo() - Date.now());
    const total = Math.floor(diff / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    if (countdownEl.h) countdownEl.h.textContent = pad(h);
    if (countdownEl.m) countdownEl.m.textContent = pad(m);
    if (countdownEl.s) countdownEl.s.textContent = pad(s);
  }

  tick();
  setInterval(tick, 1000);

  // Local stock simulation
  let stock = 17;
  setStock(stock);
  setInterval(function () {
    if (stock > 5 && Math.random() > 0.72) {
      stock -= 1;
      setStock(stock);
    }
  }, 28000);

  // Sticky CTA after leaving hero
  const hero = document.querySelector(".hero");
  if (sticky && hero && "IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          sticky.classList.toggle("is-visible", !entry.isIntersecting);
        });
      },
      { threshold: 0.15 }
    );
    io.observe(hero);
  } else if (sticky) {
    sticky.classList.add("is-visible");
  }

  // Phone mask for UZ +998
  const phoneInput = document.getElementById("phone");
  if (phoneInput) {
    phoneInput.addEventListener("focus", function () {
      if (!phoneInput.value) phoneInput.value = "+998 ";
    });

    phoneInput.addEventListener("input", function () {
      let digits = phoneInput.value.replace(/\D/g, "");
      if (digits.indexOf("998") !== 0) {
        digits = "998" + digits.replace(/^998/, "");
      }
      digits = digits.slice(0, 12);
      let out = "+998";
      if (digits.length > 3) out += " " + digits.slice(3, 5);
      if (digits.length > 5) out += " " + digits.slice(5, 8);
      if (digits.length > 8) out += " " + digits.slice(8, 10);
      if (digits.length > 10) out += " " + digits.slice(10, 12);
      phoneInput.value = out;
    });
  }

  function showError(input, on) {
    if (!input) return;
    input.classList.toggle("error", on);
  }

  if (orderForm) {
    orderForm.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("name");
      const phone = document.getElementById("phone");
      const nameOk = name && name.value.trim().length >= 2;
      const phoneDigits = phone ? phone.value.replace(/\D/g, "") : "";
      const phoneOk = phoneDigits.length === 12;

      showError(name, !nameOk);
      showError(phone, !phoneOk);

      if (!nameOk || !phoneOk) return;

      // Preserve UTMs for affiliate tracking
      const params = new URLSearchParams(window.location.search);
      params.set("name", name.value.trim());
      params.set("phone", phone.value.trim());
      window.location.href = "thanks.html?" + params.toString();
    });
  }

  // Live orders toast
  const cities = [
    "Ташкент",
    "Самарканд",
    "Бухара",
    "Наманган",
    "Андижан",
    "Фергана",
    "Нукус",
    "Карши",
  ];
  const names = ["Алишер", "Жасурр", "Отабек", "Дилшод", "Шохрух", "Бекзод", "Улугбек", "Тимур"];

  function spawnToast() {
    if (!toastWrap) return;
    const el = document.createElement("div");
    el.className = "toast";
    const name = names[Math.floor(Math.random() * names.length)];
    const city = cities[Math.floor(Math.random() * cities.length)];
    const mins = 1 + Math.floor(Math.random() * 14);
    el.textContent = name + " из " + city + " оформил заказ " + mins + " мин. назад";
    toastWrap.appendChild(el);
    requestAnimationFrame(function () {
      el.classList.add("show");
    });
    setTimeout(function () {
      el.classList.remove("show");
      setTimeout(function () {
        el.remove();
      }, 350);
    }, 4200);
  }

  setTimeout(spawnToast, 4500);
  setInterval(spawnToast, 16000);

  // Cookie close
  const cookieBtn = document.querySelector(".close-cookie");
  const cookieBanner = document.querySelector(".cookie-banner");
  if (cookieBtn && cookieBanner) {
    cookieBtn.addEventListener("click", function () {
      cookieBanner.style.display = "none";
    });
  }

  // Reveal on scroll
  const reveals = document.querySelectorAll("[data-reveal]");
  if ("IntersectionObserver" in window) {
    const rio = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.style.animation = "rise 0.8s ease both";
            rio.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    reveals.forEach(function (el) {
      el.style.opacity = "0";
      rio.observe(el);
    });
  }
})();
