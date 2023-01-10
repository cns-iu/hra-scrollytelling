//Fade in elements runner  
const scrollElements = document.querySelectorAll(".js-scroll");

const elementInView = (el, dividend = 1) => {
    const elementTop = el.getBoundingClientRect().top;

    return (
        elementTop <=
        (window.innerHeight || document.documentElement.clientHeight) / dividend
    );
};

const elementOutofView = (el) => {
    const elementTop = el.getBoundingClientRect().top;

    return (
        elementTop > (window.innerHeight || document.documentElement.clientHeight)
    );
};

const displayScrollElement = (element) => {
    element.classList.add("scrolled");
};

const hideScrollElement = (element) => {
    element.classList.remove("scrolled");
};

const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
        if (elementInView(el, 2)) {
            displayScrollElement(el);
        } else if (elementOutofView(el)) {
            hideScrollElement(el)
        }
    })
}

window.addEventListener("scroll", () => {
    handleScrollAnimation();
});

//particles
if(document.body.contains(document.getElementById("particles-js"))){
particlesJS("particles-js", {
    "particles": {
        "number": {
            "value": 10,
            "density": {
                "enable": true,
                "value_area": 800
            }
        },
        "color": {
            "value": "#dc231e"
        },
        "shape": {
            "type": "circle",
            "stroke": {
                "width": 0,
                "color": "#000"
            },
            "polygon": {
                "nb_sides": 12
            },
            "image": {
                "src": "img/github.svg",
                "width": 100,
                "height": 100
            }
        },
        "opacity": {
            "value": 0.3,
            "random": true,
            "anim": {
                "enable": false,
                "speed": 1,
                "opacity_min": 0.1,
                "sync": false
            }
        },
        "size": {
            "value": 60.1279522824571,
            "random": false,
            "anim": {
                "enable": true,
                "speed": 10,
                "size_min": 40,
                "sync": false
            }
        },
        "line_linked": {
            "enable": false,
            "distance": 200,
            "color": "#ffffff",
            "opacity": 1,
            "width": 2
        },
        "move": {
            "enable": true,
            "speed": 3,
            "direction": "right",
            "random": false,
            "straight": false,
            "out_mode": "out",
            "bounce": false,
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
                "enable": false,
                "mode": "grab"
            },
            "onclick": {
                "enable": false,
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
                "distance": 200,
                "duration": 0.4
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
})
}

//section count
window.addEventListener("scroll", function() {

    var elementTarget4 = document.getElementById("intro");
    if (window.scrollY < (elementTarget4.offsetTop-10 + elementTarget4.offsetHeight)) {
        document.getElementById("sectionCounter").style.display = "none";
        document.getElementById("sectionCounterdiv").style.backgroundColor = "transparent";
    }else{
        document.getElementById("sectionCounter").style.display = "block";
    }

    var elementTarget3 = document.getElementById("intro");
    if (window.scrollY > (elementTarget3.offsetTop -10 + elementTarget3.offsetHeight)) {
        document.getElementById("sectionCounter").innerHTML="1/3";
        document.getElementById("sectionCounterdiv").style.backgroundColor = "#ff636a60";
    }

    if(document.body.contains(document.getElementById("section1-1"))){
    var elementTarget2 = document.getElementById("section1-1");
    if (window.scrollY > (elementTarget2.offsetTop -10+ elementTarget2.offsetHeight) ) {
        document.getElementById("sectionCounter").innerHTML="2/3";
        document.getElementById("sectionCounterdiv").style.backgroundColor = "#ffffff80";
    }
}

if(document.body.contains(document.getElementById("section1-2"))){
var elementTarget3 = document.getElementById("section1-2");
if (window.scrollY > (elementTarget3.offsetTop -10+ elementTarget3.offsetHeight) ) {
    document.getElementById("sectionCounter").innerHTML="3/3";
    document.getElementById("sectionCounterdiv").style.backgroundColor = "#ffffff80";
}
}
  });