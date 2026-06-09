(function () {
  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  var frameOptions = document.querySelectorAll('.frame-option');
  var titleEl = document.querySelector('[data-product-title]');
  var sizeEl = document.querySelector('[data-product-size]');
  var materialEl = document.querySelector('[data-product-material]');
  var sceneEl = document.querySelector('[data-product-scene]');

  function setActiveFrame(frame) {
    if (!frame) {
      return;
    }

    frameOptions.forEach(function (item) {
      item.classList.toggle('active', item === frame);
    });

    if (titleEl) {
      titleEl.textContent = frame.getAttribute('data-title') || '';
    }

    if (sizeEl) {
      sizeEl.textContent = frame.getAttribute('data-size') || '';
    }

    if (materialEl) {
      var color = frame.getAttribute('data-color') || '';
      var material = frame.getAttribute('data-material') || '';
      materialEl.textContent = color && material ? color + ' · ' + material : color + material;
    }

    if (sceneEl) {
      sceneEl.textContent = frame.getAttribute('data-scene') || '';
    }
  }

  frameOptions.forEach(function (frame) {
    frame.addEventListener('mouseenter', function () {
      setActiveFrame(frame);
    });

    frame.addEventListener('focus', function () {
      setActiveFrame(frame);
    });

    frame.addEventListener('click', function () {
      setActiveFrame(frame);
    });
  });

  if (reduceMotion || !finePointer) {
    return;
  }

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function attachTilt(element, options) {
    var maxRotate = options.maxRotate || 10;
    var lift = options.lift || 0;
    var scale = options.scale || 1;
    var base = options.base || '';

    element.addEventListener('mousemove', function (event) {
      var rect = element.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      var rotateY = clamp((x - 0.5) * maxRotate * 2, -maxRotate, maxRotate);
      var rotateX = clamp((0.5 - y) * maxRotate * 2, -maxRotate, maxRotate);

      element.style.setProperty('--mx', Math.round(x * 100) + '%');
      element.style.setProperty('--my', Math.round(y * 100) + '%');
      element.style.transform = base + ' perspective(1200px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg) translateY(' + lift + 'px) scale(' + scale + ')';
    });

    element.addEventListener('mouseleave', function () {
      element.style.removeProperty('--mx');
      element.style.removeProperty('--my');
      element.style.transform = '';
    });
  }

  document.querySelectorAll('[data-tilt="card"]').forEach(function (card) {
    attachTilt(card, {
      maxRotate: 7,
      lift: -8,
      scale: 1.025,
      base: ''
    });
  });

  frameOptions.forEach(function (frame) {
    frame.addEventListener('mousemove', function (event) {
      var rect = frame.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width;
      var y = (event.clientY - rect.top) / rect.height;
      frame.style.setProperty('--mx', Math.round(x * 100) + '%');
      frame.style.setProperty('--my', Math.round(y * 100) + '%');
    });

    frame.addEventListener('mouseleave', function () {
      frame.style.removeProperty('--mx');
      frame.style.removeProperty('--my');
    });
  });

  var productStage = document.querySelector('.product-stage');
  var orbit = document.querySelector('.orbit');
  if (productStage && orbit) {
    productStage.addEventListener('mousemove', function (event) {
      var rect = productStage.getBoundingClientRect();
      var x = (event.clientX - rect.left) / rect.width - 0.5;
      var y = (event.clientY - rect.top) / rect.height - 0.5;
      orbit.style.translate = (x * 22).toFixed(1) + 'px ' + (y * 18).toFixed(1) + 'px';
    });

    productStage.addEventListener('mouseleave', function () {
      orbit.style.translate = '';
    });
  }
})();
