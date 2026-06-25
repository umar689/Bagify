(function () {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    document.querySelectorAll(".premium-btn, button, .icon-pill").forEach((button) => {
        if (button.tagName === "INPUT") return;

        button.addEventListener("pointerdown", (event) => {
            if (reduceMotion || button.querySelector(".ripple-dot")) return;

            const rect = button.getBoundingClientRect();
            const dot = document.createElement("span");
            dot.className = "ripple-dot";
            dot.style.left = `${event.clientX - rect.left}px`;
            dot.style.top = `${event.clientY - rect.top}px`;
            button.appendChild(dot);

            if (window.gsap) {
                gsap.to(dot, {
                    scale: 28,
                    opacity: 0,
                    duration: 0.7,
                    ease: "power3.out",
                    onComplete: () => dot.remove()
                });
            } else {
                setTimeout(() => dot.remove(), 700);
            }
        });
    });

    if (!window.gsap || !window.ScrollTrigger || reduceMotion) return;

    gsap.registerPlugin(ScrollTrigger);

    gsap.timeline({ defaults: { ease: "expo.out" } })
        .from(".glass-nav", { y: -28, opacity: 0, duration: 0.8 })
        .from(".hero-reveal", { y: 42, opacity: 0, filter: "blur(10px)", duration: 0.9, stagger: 0.08 }, "-=0.35");

    gsap.utils.toArray(".reveal").forEach((item) => {
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 88%",
                once: true
            },
            y: 50,
            opacity: 0,
            filter: "blur(8px)",
            duration: 0.95,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray(".stagger-group").forEach((group) => {
        gsap.from(group.querySelectorAll(".stagger-item"), {
            scrollTrigger: {
                trigger: group,
                start: "top 86%",
                once: true
            },
            y: 38,
            opacity: 0,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out"
        });
    });

    gsap.utils.toArray(".float-idle").forEach((item, index) => {
        gsap.to(item, {
            y: index % 2 ? 10 : -10,
            duration: 3.8 + index * 0.25,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut"
        });
    });

    const parallaxArea = document.querySelector("[data-parallax]");
    if (parallaxArea) {
        parallaxArea.addEventListener("mousemove", (event) => {
            const rect = parallaxArea.getBoundingClientRect();
            const x = (event.clientX - rect.left) / rect.width - 0.5;
            const y = (event.clientY - rect.top) / rect.height - 0.5;

            gsap.to(parallaxArea.querySelectorAll("[data-depth]"), {
                x: (_, el) => x * Number(el.dataset.depth),
                y: (_, el) => y * Number(el.dataset.depth),
                duration: 0.55,
                ease: "power3.out"
            });
        });
    }
})();
