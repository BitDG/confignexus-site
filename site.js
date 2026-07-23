/* ===== ConfigNexus 官网 · 通用交互 ===== */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  if (finePointer) {
    var cards = document.querySelectorAll('.card,.feat-row,.step,.dl-card');
    for (var n = 0; n < cards.length; n++) {
      cards[n].addEventListener('pointermove', function (e) {
        var rc = this.getBoundingClientRect();
        this.style.setProperty('--cx', (e.clientX - rc.left) + 'px');
        this.style.setProperty('--cy', (e.clientY - rc.top) + 'px');
      });
    }
  }

  var revealTargets = document.querySelectorAll(
    '.sec-head,.workflow-item,.cards>.card,.ai-demo,.media-pair>*,.endcta'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var revealObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (!entries[i].isIntersecting) continue;
        entries[i].target.classList.add('show');
        revealObserver.unobserve(entries[i].target);
      }
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    for (var r = 0; r < revealTargets.length; r++) {
      revealTargets[r].classList.add('inview');
      revealObserver.observe(revealTargets[r]);
    }
  }

  var autoplayVideos = document.querySelectorAll('video[autoplay]');
  for (var v = 0; v < autoplayVideos.length; v++) autoplayVideos[v].pause();

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var videoObserver = new IntersectionObserver(function (entries) {
      for (var i = 0; i < entries.length; i++) {
        if (entries[i].isIntersecting) {
          entries[i].target.play().catch(function () {});
        } else {
          entries[i].target.pause();
        }
      }
    }, { threshold: 0.35 });

    for (var a = 0; a < autoplayVideos.length; a++) {
      videoObserver.observe(autoplayVideos[a]);
    }
  } else if (!reduceMotion) {
    for (var p = 0; p < autoplayVideos.length; p++) {
      autoplayVideos[p].play().catch(function () {});
    }
  }
})();
