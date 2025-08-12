document.addEventListener('DOMContentLoaded', () => {

    // --- Parallax Effect ---
    const parallaxLayers = [
        document.querySelector('.parallax-bg-layer-1'),
        document.querySelector('.parallax-bg-layer-2'),
        document.querySelector('.parallax-bg-layer-3')
    ];

    function updateParallax() {
        const scrollPosition = window.pageYOffset;
        if (parallaxLayers[0]) parallaxLayers[0].style.transform = `translateY(${scrollPosition * 0.2}px)`;
        if (parallaxLayers[1]) parallaxLayers[1].style.transform = `translateY(${scrollPosition * 0.4}px)`;
        if (parallaxLayers[2]) parallaxLayers[2].style.transform = `translateY(${scrollPosition * 0.6}px)`;
    }

    window.addEventListener('scroll', () => {
        requestAnimationFrame(updateParallax);
    });


    // --- Typing Effect for Hero Title ---
    const typingTextElement = document.getElementById('typing-text');
    const phrases = ["Explore the Universe.", "Discover New Worlds.", "Join the Mission."];
    let phraseIndex = 0;
    let letterIndex = 0;
    const typingSpeed = 100;
    const deletingSpeed = 50;
    const pauseTime = 1500;

    function type() {
        const currentPhrase = phrases[phraseIndex];
        if (letterIndex < currentPhrase.length) {
            typingTextElement.textContent += currentPhrase.charAt(letterIndex);
            letterIndex++;
            setTimeout(type, typingSpeed);
        } else {
            setTimeout(erase, pauseTime);
        }
    }

    function erase() {
        const currentPhrase = phrases[phraseIndex];
        if (letterIndex > 0) {
            typingTextElement.textContent = currentPhrase.substring(0, letterIndex - 1);
            letterIndex--;
            setTimeout(erase, deletingSpeed);
        } else {
            phraseIndex = (phraseIndex + 1) % phrases.length;
            setTimeout(type, typingSpeed);
        }
    }
    type();

    // --- Theme, Audio, and Language Toggles ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const audioToggleBtn = document.getElementById('audio-toggle');
    const spaceAudio = document.getElementById('space-ambience-audio');
    const languageSelector = document.getElementById('language-selector');

    themeToggleBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggleBtn.querySelector('i');
        icon.classList.toggle('fa-sun');
        icon.classList.toggle('fa-moon');
    });

    audioToggleBtn.addEventListener('click', () => {
        const icon = audioToggleBtn.querySelector('i');
        if (spaceAudio.paused) {
            spaceAudio.play();
            icon.classList.replace('fa-volume-mute', 'fa-volume-up');
        } else {
            spaceAudio.pause();
            icon.classList.replace('fa-volume-up', 'fa-volume-mute');
        }
    });

    languageSelector.addEventListener('change', (e) => {
        // Placeholder for language switching logic
        console.log(`Language changed to: ${e.target.value}`);
    });

    // --- Countdown Timer ---
    const launchDate = new Date("Aug 15, 2026 12:00:00").getTime();
    const countdownInterval = setInterval(() => {
        const now = new Date().getTime();
        const distance = launchDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        document.getElementById('days').textContent = String(days).padStart(2, '0');
        document.getElementById('hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');

        if (distance < 0) {
            clearInterval(countdownInterval);
            document.querySelector('.countdown-timer').innerHTML = "<h2>Launch has occurred!</h2>";
        }
    }, 1000);

    // --- Live Space Data (ISS & Mars Weather) ---
    const issLocationEl = document.getElementById('iss-location').querySelector('p');
    const marsWeatherEl = document.getElementById('mars-weather').querySelector('p');

    async function getISSLocation() {
        try {
            const response = await fetch('http://api.open-notify.org/iss-now.json');
            const data = await response.json();
            issLocationEl.textContent = `Lat: ${parseFloat(data.iss_position.latitude).toFixed(2)}, Lon: ${parseFloat(data.iss_position.longitude).toFixed(2)}`;
        } catch (error) {
            issLocationEl.textContent = 'Failed to fetch ISS data.';
            console.error('Error fetching ISS data:', error);
        }
    }
    getISSLocation();
    setInterval(getISSLocation, 10000); // Update every 10 seconds

    async function getMarsWeather() {
        try {
            const apiKey = 'DEMO_KEY'; // Using DEMO_KEY as a public example
            const response = await fetch(`https://api.nasa.gov/insight_weather/?api_key=${apiKey}&feedtype=json&ver=1.0`);
            const data = await response.json();
            const latestSol = data.sol_keys[data.sol_keys.length - 1];
            const temp = data[latestSol].AT.av;
            marsWeatherEl.textContent = `Temp: ${temp.toFixed(2)}°C`;
        } catch (error) {
            marsWeatherEl.textContent = 'Failed to fetch Mars weather.';
            console.error('Error fetching Mars weather:', error);
        }
    }
    getMarsWeather();

    // --- Rocket Launch Animation ---
    const rocket = document.getElementById('rocket');
    const heroSection = document.getElementById('hero');

    function handleRocketScroll() {
        if (!heroSection || !rocket) return; 
        const heroBottom = heroSection.getBoundingClientRect().bottom;

        if (heroBottom < window.innerHeight / 2) {
            rocket.classList.add('rocket-launching');
        } else {
            rocket.classList.remove('rocket-launching');
        }
    }
    window.addEventListener('scroll', handleRocketScroll);


    // --- Planet Modal and Cards (UPDATED with correct image extensions) ---
    const planetCards = document.querySelectorAll('.planet-card');
    const planetModal = document.getElementById('planet-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalImage = document.getElementById('modal-image');
    const modalDescription = document.getElementById('modal-description');
    const closeModalBtn = document.querySelector('.modal .close-btn');

    const planetsData = {
        mercury: {
            title: "Mercury",
            image: "Assets/mercury.jpeg",
            description: "The smallest planet in our solar system and the closest to the Sun. Its proximity to the Sun means it has a very short orbital period."
        },
        venus: {
            title: "Venus",
            image: "Assets/venus.jpeg",
            description: "Known as Earth's 'sister planet' due to its similar size and mass, but it has a toxic atmosphere and a runaway greenhouse effect."
        },
        earth: {
            title: "Earth",
            image: "Assets/earth.jpeg",
            description: "Our home planet, unique for its vast oceans of liquid water and diverse life. The third planet from the Sun."
        },
        mars: {
            title: "Mars",
            image: "Assets/mars.jpeg",
            description: "The 'Red Planet,' named for the iron oxide on its surface. A prime target for future human colonization due to its thin atmosphere and water ice."
        },
        jupiter: {
            title: "Jupiter",
            image: "Assets/jupiter.jpeg",
            description: "The largest planet in the solar system, a gas giant with a distinctive Great Red Spot—a massive, persistent storm."
        },
        saturn: {
            title: "Saturn",
            image: "Assets/saturn.png",
            description: "Renowned for its breathtaking system of icy rings. It is the second-largest planet in our solar system, a gas giant with a fascinating structure."
        },
        uranus: {
            title: "Uranus",
            image: "Assets/uranus.jpeg",
            description: "An ice giant that rotates on its side, a unique orientation compared to other planets. It has a faint system of rings and numerous moons."
        },
        neptune: {
            title: "Neptune",
            image: "Assets/neptune.jpeg",
            description: "The eighth and most distant planet from the Sun, an ice giant known for its powerful winds and a deep blue color from methane gas in its atmosphere."
        }
    };

    planetCards.forEach(card => {
        card.addEventListener('click', () => {
            const planetName = card.dataset.planet;
            const data = planetsData[planetName];
            if (data) {
                modalTitle.textContent = data.title;
                modalImage.src = data.image;
                modalImage.alt = data.title;
                modalDescription.textContent = data.description;
                planetModal.style.display = 'flex';
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        planetModal.style.display = 'none';
    });

    planetModal.addEventListener('click', (e) => {
        if (e.target === planetModal) {
            planetModal.style.display = 'none';
        }
    });

    // --- Interactive Solar System (Three.js - UPDATED with correct image paths) ---
    const threeJsContainer = document.getElementById('three-js-container');
    const infoPanel = document.getElementById('planet-info-panel');
    const panelTitle = document.getElementById('panel-title');
    const panelImage = document.getElementById('panel-image');
    const panelDescription = document.getElementById('panel-description');
    const closeInfoBtn = document.getElementById('close-info-panel');

    let scene, camera, renderer, controls, sun;
    let planets = [];
    const textureLoader = new THREE.TextureLoader();

    

    function initThreeJS() {
        if (!threeJsContainer) return;

        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(75, threeJsContainer.clientWidth / threeJsContainer.clientHeight, 0.1, 1000);
        camera.position.set(0, 30, 50);

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
        threeJsContainer.appendChild(renderer.domElement);

        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.minDistance = 20;
        controls.maxDistance = 150;
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;

        // Add starfield background
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        for (let i = 0; i < 10000; i++) {
            const x = (Math.random() - 0.5) * 2000;
            const y = (Math.random() - 0.5) * 2000;
            const z = (Math.random() - 0.5) * 2000;
            starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 2 });
        const starfield = new THREE.Points(starGeometry, starMaterial);
        scene.add(starfield);

        // Sun with glowing effect
        const sunTexture = textureLoader.load('Assets/sun.jpeg');
        const sunGeometry = new THREE.SphereGeometry(10, 32, 32);
        const sunMaterial = new THREE.MeshBasicMaterial({ map: sunTexture, transparent: true });
        sun = new THREE.Mesh(sunGeometry, sunMaterial);
        scene.add(sun);

        // Point light at the center for a sun-like effect
        const sunLight = new THREE.PointLight(0xffffff, 1.5, 300);
        sun.add(sunLight);

        // Planets and their orbits
        const planetProps = [
            { name: 'mercury', distance: 15, size: 0.5, speed: 0.005 },
            { name: 'venus', distance: 20, size: 1.2, speed: 0.003 },
            { name: 'earth', distance: 25, size: 1.3, speed: 0.002 },
            { name: 'mars', distance: 30, size: 0.7, speed: 0.0018 },
            { name: 'jupiter', distance: 40, size: 5, speed: 0.001 },
            { name: 'saturn', distance: 55, size: 4.5, speed: 0.0009 },
            { name: 'uranus', distance: 70, size: 3, speed: 0.0007 },
            { name: 'neptune', distance: 85, size: 2.8, speed: 0.0006 },
        ];

        planetProps.forEach(prop => {
            const planetGroup = new THREE.Group();
            scene.add(planetGroup);

            // Create a parent group to hold the planet and its rings (for Saturn)
            const planetMesh = new THREE.Mesh(
                new THREE.SphereGeometry(prop.size, 32, 32),
                new THREE.MeshStandardMaterial({ map: textureLoader.load(planetsData[prop.name].image) })
            );
            planetMesh.name = prop.name;
            planetMesh.position.x = prop.distance;
            planetMesh.userData = { ...prop, info: planetsData[prop.name] };
            planets.push(planetMesh);
            planetGroup.add(planetMesh);

            // Create orbit ring
            const orbitGeometry = new THREE.RingGeometry(prop.distance - 0.1, prop.distance + 0.1, 200);
            const orbitMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.DoubleSide, transparent: true, opacity: 0.1 });
            const orbit = new THREE.Mesh(orbitGeometry, orbitMaterial);
            orbit.rotation.x = Math.PI / 2; // Rotate to lie flat
            scene.add(orbit);

            // Special case for Saturn's rings (FIXED PATH)
            if (prop.name === 'saturn') {
                const saturnRingGeometry = new THREE.RingGeometry(prop.size + 1, prop.size + 3, 64);
                const saturnRingMaterial = new THREE.MeshBasicMaterial({
                    map: textureLoader.load('Assets/saturn.png'), // Corrected to use the .png file
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.8
                });
                const saturnRing = new THREE.Mesh(saturnRingGeometry, saturnRingMaterial);
                saturnRing.rotation.x = Math.PI / 2;
                planetMesh.add(saturnRing);
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            camera.aspect = threeJsContainer.clientWidth / threeJsContainer.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(threeJsContainer.clientWidth, threeJsContainer.clientHeight);
        });

        // Click handler for planets
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        function onPlanetClick(event) {
            const rect = threeJsContainer.getBoundingClientRect();
            mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(planets);

            if (intersects.length > 0) {
                const clickedPlanet = intersects[0].object;
                const info = clickedPlanet.userData.info;
                if (info) {
                    panelTitle.textContent = info.title;
                    panelImage.src = info.image;
                    panelDescription.textContent = info.description;
                    infoPanel.classList.add('visible');
                }
            }
        }
        threeJsContainer.addEventListener('click', onPlanetClick);

        closeInfoBtn.addEventListener('click', () => {
            infoPanel.classList.remove('visible');
        });
    }

    function animateThreeJS() {
        requestAnimationFrame(animateThreeJS);
        
        // Rotate the sun
        if (sun) {
            sun.rotation.y += 0.001;
        }
        
        // Rotate planets on their axes
        planets.forEach(planet => {
            planet.rotation.y += 0.01;
        });

        controls.update();
        renderer.render(scene, camera);
    }
    
    // Call initialization and animation function
    initThreeJS();
    animateThreeJS();

    // --- Testimonials Carousel ---
    const quotes = document.querySelectorAll('.quote-item');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    let currentQuote = 0;

    function showQuote(index) {
        quotes.forEach(quote => quote.classList.remove('active'));
        quotes[index].classList.add('active');
    }

    function nextQuote() {
        currentQuote = (currentQuote + 1) % quotes.length;
        showQuote(currentQuote);
    }

    function prevQuote() {
        currentQuote = (currentQuote - 1 + quotes.length) % quotes.length;
        showQuote(currentQuote);
    }

    nextBtn.addEventListener('click', nextQuote);
    prevBtn.addEventListener('click', prevQuote);

    setInterval(nextQuote, 8000); // Auto-cycle quotes every 8 seconds

    // --- Daily Space Fact ---
    const facts = [
        "A day on Venus is longer than a year on Venus.",
        "There are more stars in the universe than grains of sand on all the beaches on Earth.",
        "The footprints left on the Moon by astronauts will likely remain for millions of years.",
        "The Sun makes up 99.86% of the solar system's mass.",
        "One million Earths could fit inside the Sun.",
        "Saturn’s rings are made of ice and rock particles, mostly the size of a golf ball.",
    ];
    const factWidget = document.getElementById('fact-widget').querySelector('p');
    factWidget.textContent = facts[Math.floor(Math.random() * facts.length)];

    // --- Mission Signup Form ---
    const signupForm = document.getElementById('mission-signup-form');
    const confirmationMessage = document.getElementById('confirmation-message');

    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();
        confirmationMessage.classList.remove('hidden');
        signupForm.reset();
        setTimeout(() => confirmationMessage.classList.add('hidden'), 5000);
    });

    // --- Back to Top Button ---
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.remove('hidden');
        } else {
            backToTopBtn.classList.add('hidden');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});