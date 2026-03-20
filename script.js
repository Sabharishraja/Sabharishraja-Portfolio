// ===== 1. Global Three.js Neural Background =====
const initGlobalBackground = () => {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 150;

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        alpha: true,
        antialias: true
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Particles Configuration
    const particleCount = 200;
    const maxDistance = 40; // Max distance to form connection lines
    const particles = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const velocities = [];

    // Colors
    const colorPrimary = new THREE.Color('#6366f1');
    const colorSecondary = new THREE.Color('#22d3ee');
    const vertexColors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 400;     // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 400; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 200; // z

        velocities.push({
            x: (Math.random() - 0.5) * 0.2,
            y: (Math.random() - 0.5) * 0.2,
            z: (Math.random() - 0.5) * 0.2
        });

        const mixedColor = colorPrimary.clone().lerp(colorSecondary, Math.random());
        vertexColors[i * 3] = mixedColor.r;
        vertexColors[i * 3 + 1] = mixedColor.g;
        vertexColors[i * 3 + 2] = mixedColor.b;
    }

    particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(vertexColors, 3));

    const pMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Lines for Neural Network Effect
    const linesMaterial = new THREE.LineBasicMaterial({
        color: 0x4f46e5, // indigo base
        transparent: true,
        opacity: 0.15
    });
    
    // Create max possible lines, update dynamically
    const maxLines = (particleCount * (particleCount - 1)) / 2;
    const linePositions = new Float32Array(maxLines * 6);
    const linesGeometry = new THREE.BufferGeometry();
    linesGeometry.setAttribute('position', new THREE.BufferAttribute(linePositions, 3));
    const linesMesh = new THREE.LineSegments(linesGeometry, linesMaterial);
    scene.add(linesMesh);

    // Interaction
    let mouseX = 0;
    let mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX - window.innerWidth / 2);
        mouseY = (e.clientY - window.innerHeight / 2);
    });

    const clock = new THREE.Clock();

    const animate = () => {
        requestAnimationFrame(animate);
        
        const positions = particleSystem.geometry.attributes.position.array;
        
        // Move particles
        for(let i = 0; i < particleCount; i++) {
            positions[i*3] += velocities[i].x;
            positions[i*3+1] += velocities[i].y;
            positions[i*3+2] += velocities[i].z;

            // Bounce off simple boundary
            if(Math.abs(positions[i*3]) > 200) velocities[i].x *= -1;
            if(Math.abs(positions[i*3+1]) > 200) velocities[i].y *= -1;
            if(Math.abs(positions[i*3+2]) > 100) velocities[i].z *= -1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;

        // Calculate distances and form lines
        let vertexPos = 0;
        let numConnected = 0;

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const distSq = dx * dx + dy * dy + dz * dz;

                if (distSq < maxDistance * maxDistance) {
                    linePositions[vertexPos++] = positions[i * 3];
                    linePositions[vertexPos++] = positions[i * 3 + 1];
                    linePositions[vertexPos++] = positions[i * 3 + 2];

                    linePositions[vertexPos++] = positions[j * 3];
                    linePositions[vertexPos++] = positions[j * 3 + 1];
                    linePositions[vertexPos++] = positions[j * 3 + 2];
                    numConnected++;
                }
            }
        }

        linesMesh.geometry.setDrawRange(0, numConnected * 2);
        linesMesh.geometry.attributes.position.needsUpdate = true;

        // Subtle camera parallax
        camera.position.x += (mouseX * 0.05 - camera.position.x) * 0.02;
        camera.position.y += (-mouseY * 0.05 - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        renderer.render(scene, camera);
    };
    
    animate();

    // Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
};

// ===== 2. Hero 3D Neural Sphere =====
const initHeroSphere = () => {
    const container = document.getElementById('sphere-container');
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 1, 1000);
    camera.position.z = 50;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Group to hold sphere
    const sphereGroup = new THREE.Group();
    scene.add(sphereGroup);

    // Create Base Icosahedron Geometry
    const radius = 18;
    const geometry = new THREE.IcosahedronGeometry(radius, 2); // Detail level 2 for nodes
    
    // Nodes (Points)
    const pointsMaterial = new THREE.PointsMaterial({
        color: 0x22d3ee, /* Cyan */
        size: 0.8,
        transparent: true,
        opacity: 0.9,
    });
    const pointsMesh = new THREE.Points(geometry, pointsMaterial);
    sphereGroup.add(pointsMesh);

    // Connections (Wireframe/Lines)
    const lineMaterial = new THREE.LineBasicMaterial({
        color: 0x6366f1, /* Indigo */
        transparent: true,
        opacity: 0.3
    });
    
    // Wireframe geometry allows connecting nodes explicitly
    const wireframeGeometry = new THREE.WireframeGeometry(geometry);
    const lineMesh = new THREE.LineSegments(wireframeGeometry, lineMaterial);
    sphereGroup.add(lineMesh);

    // Add glowing core
    const coreGeometry = new THREE.SphereGeometry(radius * 0.4, 32, 32);
    const coreMaterial = new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.1,
        blending: THREE.AdditiveBlending
    });
    const coreMesh = new THREE.Mesh(coreGeometry, coreMaterial);
    sphereGroup.add(coreMesh);

    // Mouse Interaction for Sphere
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (e) => {
        // Normalize mouse to -1 to 1 based on window
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    const animate = () => {
        requestAnimationFrame(animate);

        // Constant slow rotation
        sphereGroup.rotation.y -= 0.002;
        sphereGroup.rotation.x += 0.001;
        
        // Mouse tilt
        const targetRotationX = mouseY * 0.5;
        const targetRotationY = mouseX * 0.5;
        
        sphereGroup.rotation.x += (targetRotationX - sphereGroup.rotation.x + sphereGroup.rotation.x) * 0.05; // Smoothing
        sphereGroup.rotation.y += (targetRotationY - sphereGroup.rotation.y + sphereGroup.rotation.y) * 0.05;

        // Dynamic pulsing core
        const scale = 1 + Math.sin(Date.now() * 0.002) * 0.1;
        coreMesh.scale.set(scale, scale, scale);

        renderer.render(scene, camera);
    };
    
    animate();

    // Resize support
    window.addEventListener('resize', () => {
        if(container.clientWidth > 0) {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        }
    });
};

// ===== 3. GSAP Animations & ScrollTriggers =====
const initGSAPAnimations = () => {
    // Register Plugin
    gsap.registerPlugin(ScrollTrigger);

    // Dynamically set initial states so elements are only hidden if JS executes
    gsap.set(".gsap-hero, .gsap-section, .gsap-skill, .gsap-project", { autoAlpha: 0, y: 40 });

    // Hero Section Load Animations
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    heroTl.to(".gsap-hero", {
        y: 0,
        autoAlpha: 1,
        duration: 1,
        stagger: 0.15,
        clearProps: "all" // clear transforms after for normal flow
    });

    // Animate Regular Sections fading in
    gsap.utils.toArray('.gsap-section').forEach(section => {
        gsap.to(section, {
            scrollTrigger: {
                trigger: section,
                start: "top 80%",
                toggleActions: "play none none reverse"
            },
            autoAlpha: 1,
            y: 0,
            duration: 0.8,
            ease: "power2.out",
            clearProps: "all"
        });
    });

    // Special: About Section Counters trigger
    ScrollTrigger.create({
        trigger: "#about",
        start: "top 70%",
        onEnter: () => startCounters()
    });

    // Special: Skills Logic (Staggered Cards & Animated Progress Bars)
    gsap.to(".gsap-skill", {
        scrollTrigger: {
            trigger: "#skills",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        autoAlpha: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: "back.out(1.7)",
        onComplete: () => {
            // Once cards appear, animate the progress bars
            const bars = document.querySelectorAll('.skill-progress');
            bars.forEach(bar => {
                const targetWidth = bar.getAttribute('data-width');
                gsap.to(bar, {
                    width: targetWidth,
                    duration: 1.5,
                    ease: "power3.out",
                    delay: 0.2 // small delay after card load
                });
            });
        }
    });

    // Special: Projects Logic (Staggered Load + slight scale up)
    gsap.to(".gsap-project", {
        scrollTrigger: {
            trigger: "#projects",
            start: "top 75%",
            toggleActions: "play none none reverse"
        },
        autoAlpha: 1,
        y: 0,
        scale: 1,
        duration: 0.7,
        stagger: 0.15,
        ease: "power2.out",
        clearProps: "all"
    });
};

// ===== 4. Animated Counters (Refined) =====
let countersStarted = false;
const startCounters = () => {
    if (countersStarted) return;
    countersStarted = true;

    const counters = document.querySelectorAll('.counter');
    
    counters.forEach(counter => {
        const target = +counter.getAttribute('data-target');
        
        // Use GSAP to tween an object containing the value to get purely smooth numbers
        const counterObj = { val: 0 };
        
        gsap.to(counterObj, {
            val: target,
            duration: 2,
            ease: "power3.out",
            onUpdate: function() {
                counter.innerText = Math.ceil(counterObj.val) + (target === Math.ceil(counterObj.val) ? '+' : '');
            }
        });
    });
};

// ===== 5. Navigation & Utility Scripts =====
const initNavigation = () => {
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links a');

    // Sticky Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
            navbar.style.background = 'rgba(11, 15, 25, 0.9)';
        } else {
            navbar.style.boxShadow = 'none';
            navbar.style.background = 'rgba(11, 15, 25, 0.6)';
        }
    });

    // Mobile Menu Toggle
    if(hamburger) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            hamburger.innerHTML = navLinks.classList.contains('active') 
                ? '<i class="fas fa-times"></i>' 
                : '<i class="fas fa-bars"></i>';
        });
    }

    // Close mobile menu on link click & Handle Active State
    links.forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            if(hamburger) hamburger.innerHTML = '<i class="fas fa-bars"></i>';
        });
    });

    // Scroll active link highlighter
    const sections = document.querySelectorAll('section');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        links.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
};

// Vanilla Tilt logic
const initTilt = () => {
    if (typeof VanillaTilt !== 'undefined') {
        VanillaTilt.init(document.querySelectorAll(".project-card"), {
            max: 15,
            speed: 400,
            glare: true,
            "max-glare": 0.3,
            scale: 1.02,
            perspective: 1000
        });
    }
};

// Simple Typing Effect Logic
const initTyping = () => {
    const roleElement = document.querySelector('.typing-text');
    if (!roleElement) return;

    const text = 'AI & Data Science Engineer';
    roleElement.innerHTML = '';
    
    let i = 0;
    const typeWriter = () => {
        if (i < text.length) {
            roleElement.innerHTML += text.charAt(i);
            i++;
            setTimeout(typeWriter, 100);
        } else {
            // Add blinking cursor
            roleElement.innerHTML += '<span class="cursor" style="animation: blink 1s infinite; margin-left:2px;">|</span>';
        }
    };
    
    // Start slightly after initial load
    setTimeout(typeWriter, 800); 
};


// ===== 6. Custom Advanced Cursor =====
const initCursor = () => {
    const cursor = document.querySelector('.custom-cursor');
    const follower = document.querySelector('.custom-cursor-follower');
    if(!cursor || !follower) return;

    let posX = 0, posY = 0;
    let mouseX = 0, mouseY = 0;

    gsap.to({}, 0.016, {
        repeat: -1,
        onRepeat: function() {
            posX += (mouseX - posX) / 5;
            posY += (mouseY - posY) / 5;
            
            gsap.set(follower, {
                css: {
                    left: posX,
                    top: posY
                }
            });
            
            gsap.set(cursor, {
                css: {
                    left: mouseX,
                    top: mouseY
                }
            });
        }
    });

    document.addEventListener("mousemove", (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Ensure cursor isn't hidden when moving
        document.body.classList.remove('cursor-hidden');
    });

    document.addEventListener("mouseout", () => {
        document.body.classList.add('cursor-hidden');
    });

    // Add hover effect
    const interactiveElements = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-card, .social-icon');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('cursor-hover');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('cursor-hover');
        });
    });
};

// ===== 7. Google Form Submission Integration =====
const initContactForm = () => {
    const form = document.querySelector('.contact-form');
    if (!form) return;

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;
        
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        // Loading State
        submitBtn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
        submitBtn.style.opacity = '0.7';
        submitBtn.style.pointerEvents = 'none';

        // Use no-cors to bypass CORS blocks on Google Forms from fetch
        fetch('https://docs.google.com/forms/d/e/1FAIpQLSdn3jfpQ-ukfTO5RrDEhfDMeP9smNbTjugXrONIpbCVRw6TQg/formResponse', {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                'entry.1980929558': name,
                'entry.1075228691': email,
                'entry.985277106': message
            })
        }).then(() => {
            // Because it's no-cors, we assume success if no hard network error
            submitBtn.innerHTML = 'Sent Successfully! <i class="fas fa-check"></i>';
            submitBtn.style.background = '#10b981'; // Success green
            form.reset();
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }, 3000);
        }).catch(error => {
            console.error('Form submission error:', error);
            submitBtn.innerHTML = 'Error! Try Again <i class="fas fa-times"></i>';
            submitBtn.style.background = '#ef4444'; // Error red
            
            setTimeout(() => {
                submitBtn.innerHTML = originalText;
                submitBtn.style.background = '';
                submitBtn.style.opacity = '1';
                submitBtn.style.pointerEvents = 'auto';
            }, 3000);
        });
    });
};

// Execute everything
document.addEventListener('DOMContentLoaded', () => {
    // 1. Three.js Backgrounds
    initGlobalBackground();
    initHeroSphere();
    
    // 2. DOM/UI Actions
    initNavigation();
    initTilt();
    initTyping();
    initCursor();
    initContactForm();
    
    // 3. GSAP (Needs slightly delayed to ensure DOM painted)
    setTimeout(() => {
        initGSAPAnimations();
    }, 100);
});


//Form submission 
const form = document.getElementById("contactForm");
const btn = document.getElementById("submitBtn");
const btnText = document.getElementById("btnText");
const loader = document.getElementById("loader");
const successMsg = document.getElementById("successMsg");

form.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;

    // 🔥 START loading (MOVE INSIDE submit)
    btn.classList.add("loading");
    btnText.style.display = "none";
    loader.style.display = "inline";

    fetch("https://docs.google.com/forms/d/e/1FAIpQLSdn3jfpQ-ukfTO5RrDEhfDMeP9smNbTjugXrONIpbCVRw6TQg/formResponse", {
        method: "POST",
        mode: "no-cors",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body:
        "entry.1980929558=" + encodeURIComponent(name) +
        "&entry.1075228691=" + encodeURIComponent(email) +
        "&entry.985277106=" + encodeURIComponent(message)
    })
    .then(() => {
        // ✅ Reset form
        form.reset();

        // 🔥 Show success (fade style)
        successMsg.classList.add("show");

        // 🔥 Hide after 2 sec
        setTimeout(() => {
            successMsg.classList.remove("show");
        }, 1000);
        btn.classList.remove("loading");
        btnText.style.display = "inline";
        loader.style.display = "none";
    })
});