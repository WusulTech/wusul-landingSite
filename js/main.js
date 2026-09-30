/* ================================================
  main.js — Wusul Scripts
   ================================================ */

"use strict";

/* AOS — scroll animations */
if (typeof AOS !== "undefined") {
  AOS.init({
    duration: 600,
    once: true,
    offset: 80,
  });
}

/* Marquee — duplicate icons for seamless loop */
(function () {
  document.querySelectorAll(".ws-marquee__track[data-marquee-clone]").forEach(function (track) {
    Array.from(track.children).forEach(function (node) {
      track.appendChild(node.cloneNode(true));
    });
  });
})();

/* Navbar shadow on scroll */
(function () {
  const nav = document.getElementById("mainNav");
  if (!nav) return;
  window.addEventListener(
    "scroll",
    function () {
      if (window.scrollY > 10) {
        nav.style.boxShadow = "0 2px 16px rgba(0,0,0,0.08)";
      } else {
        nav.style.boxShadow = "none";
      }
    },
    { passive: true },
  );
})();
/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function (link) {
  link.addEventListener("click", function (e) {
    var target = document.querySelector(this.getAttribute("href"));
    if (!target) return;
    e.preventDefault();
    var navH = document.getElementById("mainNav").offsetHeight || 70;
    var top = target.getBoundingClientRect().top + window.scrollY - navH;
    window.scrollTo({ top: top, behavior: "smooth" });
  });
});

/* FAQ accordion */
(function () {
  var faqButtons = document.querySelectorAll('.faq-q');
  if (!faqButtons.length) return;

  faqButtons.forEach(function (button) {
    button.addEventListener('click', function () {
      var item = this.closest('.faq-item');
      var isOpen = item.classList.contains('open');

      document.querySelectorAll('.faq-item.open').forEach(function (openItem) {
        if (openItem !== item) {
          openItem.classList.remove('open');
        }
      });

      if (isOpen) {
        item.classList.remove('open');
      } else {
        item.classList.add('open');
      }
    });
  });
})();
  // Start marquees after all resources (images) have loaded,
      // and set animation duration based on track width for smooth motion.
      window.addEventListener('load', function () {
        document.querySelectorAll('.ws-marquee__track').forEach(function (track) {
          // Set animation duration proportional to content width (px per second)
          var pxPerSec = 140; // increase to speed up
          var duration = Math.max(12, Math.round(track.scrollWidth / pxPerSec));
          track.style.animationDuration = duration + 's';
        });

        document.querySelectorAll('.ws-marquee').forEach(function (marquee) {
          marquee.classList.add('loaded');
        });
      });

/* Contact form — send via FormSubmit (AJAX), plain POST if JS is off */
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  var status = document.getElementById("contactFormStatus");
  var btn = form.querySelector('button[type="submit"]');

  function setStatus(msg, type) {
    status.textContent = msg;
    status.className = "ws-form__status" + (type ? " is-" + type : "");
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    btn.disabled = true;
    setStatus("Sending…");

    fetch(form.action.replace("formsubmit.co/", "formsubmit.co/ajax/"), {
      method: "POST",
      headers: { Accept: "application/json" },
      body: new FormData(form),
    })
      .then(function (res) {
        return res.json().then(function (data) {
          if (!res.ok || String(data.success) !== "true") throw new Error(data.message);
        });
      })
      .then(function () {
        form.reset();
        setStatus("Thanks! Your idea reached us — we'll get back to you within 24 hours.", "success");
      })
      .catch(function () {
        setStatus("Something went wrong. Please try again or message us on WhatsApp.", "error");
      })
      .then(function () {
        btn.disabled = false;
      });
  });
})();

/* Stats band — count-up + scroll trigger */
(function () {
  var band = document.querySelector(".ws-stats-band");
  if (!band) return;

  var nums = band.querySelectorAll(".ws-stats-band__num[data-count]");
  if (!nums.length) return;

  function animateCount(el, delay) {
    var target = parseInt(el.getAttribute("data-count"), 10);
    if (isNaN(target)) return;

    var duration = 1400;

    setTimeout(function () {
      var start = performance.now();

      function tick(now) {
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = "+" + Math.round(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    }, delay);
  }

  function startCounters() {
    nums.forEach(function (el, index) {
      animateCount(el, index * 120);
    });
  }

  if ("IntersectionObserver" in window) {
    var observer = new IntersectionObserver(
      function (entries, obs) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          startCounters();
          obs.unobserve(band);
        });
      },
      { threshold: 0.35 },
    );
    observer.observe(band);
  } else {
    startCounters();
  }
})();