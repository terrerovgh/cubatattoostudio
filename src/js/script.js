gsap.registerPlugin(ScrollTrigger);
gsap.registerPlugin(SplitText);
const view = document.querySelector("#homepage");
const DOM = {
  homeHeroContainer: view.querySelector(".c-hm-hero .o-container"),
  homeHeroHead: view.querySelector(".c-hm-hero_head"),
  homeTickerTitle: view.querySelector(".c-ticker_title"),
  homeTickerTitleChars: view.querySelectorAll(".ticker-line:first-child .char"),
  homePlayer: view.querySelector(".c-hm-hero_media"),
  homePlayerReel: view.querySelector(".hm-reel"),
  misc: [".c-header", ".c-hm-hero_top", ".c-ticker_side"],
  // Actualizar referencia al logo
  logo: document.querySelector("#logo-container"),
  logoImg: document.querySelector("#logo-img")
};
const MO = {
  offsetIn: function (t, e) {
    return gsap.to(t, {
      yPercent: 0,
      duration: 1,
      ease: "expo.inOut",
      stagger: e || 0
    });
  },
  offsetFadeIn: function (t, e) {
    return gsap.to(t, {
      yPercent: 0,
      autoAlpha: 1,
      duration: 1,
      ease: "expo.inOut",
      stagger: e || 0
    });
  },
  fadeIn: function (t, e) {
    return gsap.to(t, {
      autoAlpha: 1,
      duration: 1,
      ease: "expo.inOut",
      stagger: e || 0
    });
  },
  splitText: function (t) {
    return new SplitText(t, {
      type: "words,chars",
      charsClass: "char",
      wordsClass: "word"
    });
  },
  cursor: function (t, e, r) {
    if (isDesktop()) {
      var n = r.getBoundingClientRect();
      var windowWidth = window.innerWidth;
      var width = n.width;
      r.classList.add("has-cursor");
      gsap.to(e, {
        x: t.clientX - n.left - e.clientWidth / 2,
        y: t.clientY - n.top - e.clientHeight / 2,
        duration: 1,
        ease: "expo.out"
      });
    }
  },
  destroy: function (t) {
    t.forEach(function (t) {
      t.kill();
      t = null;
    });
    ScrollTrigger.refresh();
    ScrollTrigger.update();
  }
};

// Animación inicial del logo - ahora es lo primero que se ve
gsap.set(DOM.logo, { scale: 1.5, opacity: 0, y: -50 });

// Animación de entrada del logo al cargar la página
gsap.to(DOM.logo, {
  scale: 1,
  opacity: 1,
  y: 0,
  duration: 1.5,
  ease: "elastic.out(1, 0.5)",
  delay: 0.5
});

// Animación del logo al hacer scroll
const logoAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.5
  }
});

// Animación al hacer scroll - después de la entrada inicial
logoAnimation
  .to(DOM.logo, {
    scale: 0.8,
    yPercent: 30,
    duration: 1,
    ease: "power2.out"
  })
  .to(DOM.logo, {
    scale: 1.2,
    yPercent: 60,
    rotation: 360,
    duration: 2,
    ease: "power2.inOut"
  })
  .to(DOM.logo, {
    scale: 1,
    yPercent: 0,
    rotation: 720,
    duration: 1,
    ease: "power2.in"
  });

// Cambiar color del logo al hacer hover
DOM.logo.addEventListener("mouseenter", () => {
  gsap.to(DOM.logoSvg, { fill: "#ffffff", duration: 0.3 });
});

DOM.logo.addEventListener("mouseleave", () => {
  gsap.to(DOM.logoSvg, { fill: "var(--accent-color, #ff3c31)", duration: 0.3 });
});

const homeHeroHead = document.querySelector(".c-hm-hero_head");
const animation = gsap.to(homeHeroHead, {
  transformOrigin: "center bottom",
  opacity: 0,
  yPercent: 150,
  scrollTrigger: {
    trigger: homeHeroHead,
    scrub: 0.3,
    start: "top top+=30"
  }
});

var timeline = gsap.timeline({});

// Configuración inicial - ocultamos elementos para animarlos después, pero dejamos el video visible como fondo
timeline
  .set(view, { opacity: 1 })
  .set(DOM.misc, { opacity: 0 })
  .set(DOM.homeHeroContainer, { perspective: 300, webkitPerspective: 300 })
  .set(DOM.homeTickerTitle, { scale: 2, transformOrigin: "center bottom", opacity: 0 })
  .set(DOM.homePlayer, {
    transformOrigin: "center bottom",
    opacity: 1 // El video está visible desde el principio como fondo de superhéroe
  })
  .set(DOM.homeTickerTitleChars, { yPercent: 0 })
  .set(DOM.homeHeroContainer, { clearProps: "all" });

// Creamos animación de subtítulos basada en scroll
const subtitlesAnimation = gsap.timeline({
  scrollTrigger: {
    trigger: ".c-ticker",
    start: "top bottom-=100",
    end: "center center",
    scrub: 0.5,
    toggleActions: "play none none reverse"
  }
});

subtitlesAnimation
  .to(DOM.homeTickerTitle, { opacity: 1, scale: 1, duration: 0.75, ease: "expo.inOut" })
  .to(DOM.misc, { opacity: 1, duration: 0.5 }, "-=0.25");

// El video ahora es un fondo de superhéroe siempre visible, no necesita animación de scroll
// La animación del video se ha eliminado para que esté siempre presente como fondo
// console.log(DOM.homeTickerTitleChars);
// WORKING CODE

//********TEXT START**************

// Define Ticker function constructor
function Ticker() {
  // Store reference to `this`
  var self = this;

  this.init = function () {
    // Split ticker title text
    MO.splitText(".c-ticker_title .t-d1-fluid");

    // Set initial CSS for all ticker lines
    self.lines.forEach(function (line) {
      var chars = line.querySelectorAll(".char");
      gsap.set(chars, { yPercent: -100 });
    });
  };

  // Destroy method
  this.destroy = function () {
    // Kill animation if it exists
    if (self.animation) {
      self.animation.kill();
      self.animation = null;
    }
  };

  // Animate method
  this.animate = function () {
    // Get char elements for each ticker line
    var line1Chars = self.lines[0].querySelectorAll(".char");
    var line2Chars = self.lines[1].querySelectorAll(".char");
    var line3Chars = self.lines[2].querySelectorAll(".char");

    // Create timeline animation
    self.animation = gsap.timeline({
      repeat: -1,
      repeatDelay: 1,
      defaults: { duration: 1, ease: "expo.inOut" }
    });

    // Animate each line in sequence
    self.animation
      .fromTo(line1Chars, { yPercent: 0 }, { yPercent: 100, stagger: 0.01 })
      .to(line2Chars, { yPercent: 0, stagger: 0.01 }, "-=1")
      .to(line2Chars, { yPercent: 100, stagger: 0.01, delay: 1 })
      .to(line3Chars, { yPercent: 0, stagger: 0.01 }, "-=1")
      .to(line3Chars, { yPercent: 100, stagger: 0.01, delay: 1 }, "A")
      .set(line1Chars, { yPercent: -100 }, "A")
      .to(line1Chars, { yPercent: 0, stagger: 0.01 }, "-=1");
  };

  // Get DOM elements and initialize ticker
  this.view = document.querySelector("#homepage");
  this.el = this.view.querySelector(".c-ticker");
  this.lines = this.el.querySelectorAll(".ticker-line");
  this.animation = null;
  this.init();
}

// Instantiate Ticker and start animation
var ticker = new Ticker();
ticker.animate();

//********TEXT END**************//

//********CURSOR START**************
function cursorHandler(event, cursorEl, wrapperEl) {
  if (isDesktop()) {
    const wrapperRect = wrapperEl.getBoundingClientRect();
    const x = event.clientX - wrapperRect.left - cursorEl.clientWidth / 2;
    const y = event.clientY - wrapperRect.top - cursorEl.clientHeight / 2;
    cursorEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
  }
}

function isDesktop() {
  return window.innerWidth > 768;
}

// const view = document.querySelector("#homepage");
const el = view.querySelector(".c-hm-hero_media");
const cursorWrapper = el;
const cursorTarget = el.querySelector(".c-md-cursor");

cursorWrapper.addEventListener("mousemove", (event) => {
  cursorHandler(event, cursorTarget, cursorWrapper);
});

//********CURSOR END**************
// Store a reference to the correct `this`
// Define DOM object
// var DOM = {
//   homePlayer: document.querySelector("#home-player"),
//   homePlayerReel: document.querySelector("#home-player-reel")
// };

// Define scroll trigger timeline para el video
var t = gsap.timeline({
  scrollTrigger: {
    trigger: DOM.homePlayer,
    scrub: true,
    start: "top top+=30",
    pin: true,
    pinType: "transform",
    pinSpacing: false
  }
});

// Define animations para el video
t.to(DOM.homePlayerReel, { paddingTop: 100 }, "A").to(
  DOM.homePlayer,
  { height: 100 },
  "A"
);

// Sección para los artistas (a implementar)
// Creamos un contenedor para los artistas si no existe
if (!document.querySelector('.artists-section')) {
  const artistsSection = document.createElement('div');
  artistsSection.className = 'artists-section';
  artistsSection.innerHTML = `
    <div class="o-container">
      <h2 class="t-d2-fluid">Our Artists</h2>
      <div class="artists-grid">
        <div class="artist" id="artist-david">
          <h3>David</h3>
          <div class="artist-portfolio"></div>
          <p class="artist-bio">Specializing in traditional Cuban style tattoos with a modern twist.</p>
        </div>
        <div class="artist" id="artist-karli">
          <h3>Karli</h3>
          <div class="artist-portfolio"></div>
          <p class="artist-bio">Known for detailed black and grey realism and portrait work.</p>
        </div>
        <div class="artist" id="artist-goodnina">
          <h3>goodnina.ink</h3>
          <div class="artist-portfolio"></div>
          <p class="artist-bio">Creates vibrant colorful designs inspired by Cuban art and culture.</p>
        </div>
      </div>
    </div>
  `;
  document.querySelector('#homepage').appendChild(artistsSection);

  // Animación para la sección de artistas
  const artistsAnimation = gsap.timeline({
    scrollTrigger: {
      trigger: '.artists-section',
      start: "top bottom-=100",
      end: "center center",
      scrub: 0.5,
      toggleActions: "play none none reverse"
    }
  });

  artistsAnimation
    .from('.artists-section h2', { opacity: 0, y: 50, duration: 0.8 })
    .from('.artist', { 
      opacity: 0, 
      y: 30, 
      stagger: 0.2, 
      duration: 0.6,
      ease: "back.out(1.7)" 
    }, "-=0.4");
}