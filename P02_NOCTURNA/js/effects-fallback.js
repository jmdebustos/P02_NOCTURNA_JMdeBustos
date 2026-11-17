
  if (!window.AOS) {
    window.AOS = {
      init: function () {
        document.querySelectorAll('[data-aos]').forEach(function (element) {
          element.classList.add('aos-animate');
        });
      },
      refresh: function () {
        document.querySelectorAll('[data-aos]').forEach(function (element) {
          element.classList.add('aos-animate');
        });
      }
    };
  }
  if (!window.Typed) {
    window.Typed = function (target, options) {
      var element = document.querySelector(target);
      var strings = options && options.strings || [];
      if (!element || !strings.length) return;
      var index = 0;
      element.textContent = strings[0];
      if (options.loop) {
        window.setInterval(function () {
          index = (index + 1) % strings.length;
          element.textContent = strings[index];
        }, 2800);
      }
    };
  }
