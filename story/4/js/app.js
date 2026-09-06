/* -----------------------------------------------
/* How to use? : Check the GitHub README
/* ----------------------------------------------- */

/* To load the Story 4 config file, host the site locally before using this example. */
/*
particlesJS.load('particles-js', 'config/particles.json', function() {
  console.log('particles.js loaded - callback');
});
*/

/* Otherwise just put the config content (json): */

let appearanceWatched = false;
let activeColor = '';

/**
 * Reads the particle colour from the stylesheet.
 *
 * particles.js takes colours as literals, so the splash token cannot reach it
 * through CSS. The computed value is read once per start instead, which keeps
 * the palette in theme.css authoritative and lets the field follow the theme.
 *
 * @returns {string} Resolved CSS colour for the particles and their links
 */
function readParticleColor() {
    const story = document.getElementById('four');
    const fallback = '#ffffff';

    if (!story) {
        return fallback;
    }

    return (
        getComputedStyle(story).getPropertyValue('--story4-splash-particle').trim() ||
        fallback
    );
}

/**
 * Starts the ambient particle field behind the splash.
 *
 * Motion-gated by story4.js: the field is decorative, so it must not run when
 * the visitor has asked for reduced motion.
 *
 * @returns {void}
 */
export function setupParticles() {
const particleColor = readParticleColor();

activeColor = particleColor;

particlesJS('particles-js',
  
  {
    "particles": {
      "number": {
        "value": 80,
        "density": {
          "enable": true,
          "value_area": 800
        }
      },
      "color": {
        "value": particleColor
      },
      "shape": {
        "type": "circle",
        "stroke": {
          "width": 0,
          "color": "#000000"
        },
        "polygon": {
          "nb_sides": 5
        },
        "image": {
          "src": "img/github.svg",
          "width": 100,
          "height": 100
        }
      },
      "opacity": {
        "value": 0.5,
        "random": false,
        "anim": {
          "enable": false,
          "speed": 1,
          "opacity_min": 0.1,
          "sync": false
        }
      },
      "size": {
        "value": 5,
        "random": true,
        "anim": {
          "enable": false,
          "speed": 40,
          "size_min": 0.1,
          "sync": false
        }
      },
      "line_linked": {
        "enable": true,
        "distance": 150,
        "color": particleColor,
        "opacity": 0.4,
        "width": 1
      },
      "move": {
        "enable": true,
        "speed": 6,
        "direction": "none",
        "random": false,
        "straight": false,
        "out_mode": "out",
        "attract": {
          "enable": false,
          "rotateX": 600,
          "rotateY": 1200
        }
      }
    },
    "interactivity": {
      "detect_on": "canvas",
      "events": {
        "onhover": {
          "enable": true,
          "mode": "repulse"
        },
        "onclick": {
          "enable": true,
          "mode": "push"
        },
        "resize": true
      },
      "modes": {
        "grab": {
          "distance": 400,
          "line_linked": {
            "opacity": 1
          }
        },
        "bubble": {
          "distance": 400,
          "size": 40,
          "duration": 2,
          "opacity": 8,
          "speed": 3
        },
        "repulse": {
          "distance": 200
        },
        "push": {
          "particles_nb": 4
        },
        "remove": {
          "particles_nb": 2
        }
      }
    },
    "retina_detect": true
  }

);

watchAppearance();
}

/**
 * Restarts the field when the appearance changes.
 *
 * The colour is baked into the running instance, so a theme change needs a
 * rebuild rather than a repaint.
 *
 * @returns {void}
 */
function watchAppearance() {
    if (appearanceWatched) {
        return;
    }

    appearanceWatched = true;

    const restart = () => {
        if (readParticleColor() === activeColor) {
            return;
        }

        destroyParticles();
        setupParticles();
    };

    new MutationObserver(restart).observe(document.documentElement, {
        attributeFilter: ['data-theme'],
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', restart);
}

/**
 * Tears down the running particle instance before a rebuild.
 *
 * @returns {void}
 */
function destroyParticles() {
    const instances = window.pJSDom;

    if (!Array.isArray(instances)) {
        return;
    }

    instances.forEach((instance) => {
        instance?.pJS?.fn?.vendors?.destroypJS?.();
    });

    window.pJSDom = [];
}
