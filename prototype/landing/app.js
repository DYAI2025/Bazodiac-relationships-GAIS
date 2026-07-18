/* Bazodiac Relationships - Application Interactive Functions */

document.addEventListener("DOMContentLoaded", () => {
  // 1. MOTION PREFERENCE HANDLING (In-Memory Session Only)
  const motionToggleBtn = document.getElementById("motion-toggle-btn");
  let localReducedMotion = false;

  function updateMotionState(enableReduced) {
    localReducedMotion = enableReduced;
    if (enableReduced) {
      document.documentElement.classList.add("reduced-motion");
      if (motionToggleBtn) motionToggleBtn.textContent = "Enable motion";
    } else {
      document.documentElement.classList.remove("reduced-motion");
      if (motionToggleBtn) motionToggleBtn.textContent = "Reduce motion";
    }
  }

  // Detect OS system preference
  const osMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  updateMotionState(osMotionQuery.matches);
  
  // Listen for OS changes
  osMotionQuery.addEventListener("change", (e) => {
    updateMotionState(e.matches);
  });

  // Toggle button
  if (motionToggleBtn) {
    motionToggleBtn.addEventListener("click", () => {
      updateMotionState(!localReducedMotion);
    });
  }


  // 2. HEADER SCROLL EFFECT
  const header = document.querySelector("header.global-header");
  if (header) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 20) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    });
  }


  // 3. MOBILE MENU TRIGGER
  const menuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuOverlay = document.getElementById("mobile-menu-overlay");

  if (menuBtn && mobileMenuOverlay) {
    function openMobileMenu() {
      menuBtn.setAttribute("aria-expanded", "true");
      menuBtn.setAttribute("aria-label", "Close menu");
      mobileMenuOverlay.classList.add("open");
    }

    function closeMobileMenu() {
      menuBtn.setAttribute("aria-expanded", "false");
      menuBtn.setAttribute("aria-label", "Open menu");
      mobileMenuOverlay.classList.remove("open");
      menuBtn.focus();
    }

    menuBtn.addEventListener("click", () => {
      const isOpen = mobileMenuOverlay.classList.contains("open");
      if (isOpen) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    // Close on Escape key press
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileMenuOverlay.classList.contains("open")) {
        closeMobileMenu();
      }
    });

    // Close mobile menu when links inside are clicked
    const mobileLinks = mobileMenuOverlay.querySelectorAll("a");
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });
  }


  // 4. ACCESSIBLE ARIA TABS (Person A, Shared Dynamic, Person B)
  const tabList = document.querySelector('[role="tablist"]');
  let currentPerspective = "sharedDynamic"; // Defaults to Shared Dynamic

  if (tabList) {
    const tabs = tabList.querySelectorAll('[role="tab"]');
    const panels = document.querySelectorAll('[role="tabpanel"]');

    function activateTab(targetTab) {
      // Set all tabs to unselected
      tabs.forEach(tab => {
        tab.setAttribute("aria-selected", "false");
        tab.setAttribute("tabindex", "-1");
      });

      // Set target tab as selected
      targetTab.setAttribute("aria-selected", "true");
      targetTab.setAttribute("tabindex", "0");
      targetTab.focus();

      // Show associated panel, hide others
      const panelId = targetTab.getAttribute("aria-controls");
      panels.forEach(panel => {
        if (panel.id === panelId) {
          panel.setAttribute("aria-hidden", "false");
          panel.removeAttribute("style"); // Ensure default display
        } else {
          panel.setAttribute("aria-hidden", "true");
          panel.style.display = "none";
        }
      });

      // Map active tab to currentPerspective
      if (targetTab.id === "tab-person-a") {
        currentPerspective = "personA";
      } else if (targetTab.id === "tab-person-b") {
        currentPerspective = "personB";
      } else {
        currentPerspective = "sharedDynamic";
      }

      // Redraw SVG with active perspective highlighted!
      renderRelationshipSVG();
    }

    // Keyboard navigation
    tabList.addEventListener("keydown", (e) => {
      const activeElement = document.activeElement;
      if (activeElement.getAttribute("role") !== "tab") return;

      const tabIndex = Array.prototype.indexOf.call(tabs, activeElement);
      let targetTab = null;

      if (e.key === "ArrowRight") {
        targetTab = tabs[tabIndex + 1] || tabs[0];
      } else if (e.key === "ArrowLeft") {
        targetTab = tabs[tabIndex - 1] || tabs[tabs.length - 1];
      } else if (e.key === "Home") {
        targetTab = tabs[0];
      } else if (e.key === "End") {
        targetTab = tabs[tabs.length - 1];
      }

      if (targetTab) {
        e.preventDefault();
        activateTab(targetTab);
      }
    });

    // Click events
    tabs.forEach(tab => {
      tab.addEventListener("click", () => {
        activateTab(tab);
      });
    });

    // Initialize state
    const defaultTab = tabList.querySelector('[aria-selected="true"]');
    if (defaultTab) {
      // Force hide panels that aren't the default active one
      const activePanelId = defaultTab.getAttribute("aria-controls");
      panels.forEach(panel => {
        if (panel.id !== activePanelId) {
          panel.setAttribute("aria-hidden", "true");
          panel.style.display = "none";
        } else {
          panel.setAttribute("aria-hidden", "false");
        }
      });
    }
  }


  // 5. CONDITIONS ACCORDION (View/Hide conditions)
  const accordionBtn = document.getElementById("accordion-toggle-btn");
  const accordionContent = document.getElementById("accordion-content");
  if (accordionBtn && accordionContent) {
    accordionBtn.addEventListener("click", () => {
      const isExpanded = accordionBtn.getAttribute("aria-expanded") === "true";
      accordionBtn.setAttribute("aria-expanded", !isExpanded);
      if (isExpanded) {
        accordionContent.classList.remove("expanded");
        accordionBtn.querySelector(".btn-text").textContent = "View conditions";
      } else {
        accordionContent.classList.add("expanded");
        accordionBtn.querySelector(".btn-text").textContent = "Hide conditions";
      }
    });
  }


  // 6. OPPORTUNITY AND SHADOW SPLIT CIRCLE INTERACTIVE WIDGET
  const oppHalf = document.getElementById("opp-half");
  const shadowHalf = document.getElementById("shadow-half");
  const oppCard = document.getElementById("opp-card");
  const shadowCard = document.getElementById("shadow-card");
  const btnShowAll = document.getElementById("btn-show-all");
  const btnShowOpp = document.getElementById("btn-show-opp");
  const btnShowShadow = document.getElementById("btn-show-shadow");

  if (oppHalf && shadowHalf && oppCard && shadowCard) {
    function showBoth() {
      oppCard.style.display = "block";
      oppCard.style.opacity = "1";
      shadowCard.style.display = "block";
      shadowCard.style.opacity = "1";
      oppHalf.classList.remove("inactive");
      shadowHalf.classList.remove("inactive");

      updateBtnActive(btnShowAll);
    }

    function showOpportunityOnly() {
      oppCard.style.display = "block";
      oppCard.style.opacity = "1";
      shadowCard.style.display = "none";
      shadowCard.style.opacity = "0";
      oppHalf.classList.remove("inactive");
      shadowHalf.classList.add("inactive");

      updateBtnActive(btnShowOpp);
    }

    function showShadowOnly() {
      oppCard.style.display = "none";
      oppCard.style.opacity = "0";
      shadowCard.style.display = "block";
      shadowCard.style.opacity = "1";
      oppHalf.classList.add("inactive");
      shadowHalf.classList.remove("inactive");

      updateBtnActive(btnShowShadow);
    }

    function updateBtnActive(activeBtn) {
      [btnShowAll, btnShowOpp, btnShowShadow].forEach(btn => {
        if (btn) btn.classList.remove("active");
      });
      if (activeBtn) activeBtn.classList.add("active");
    }

    // Connect SVG halves
    oppHalf.addEventListener("click", showOpportunityOnly);
    shadowHalf.addEventListener("click", showShadowOnly);

    // Connect buttons
    if (btnShowAll) btnShowAll.addEventListener("click", showBoth);
    if (btnShowOpp) btnShowOpp.addEventListener("click", showOpportunityOnly);
    if (btnShowShadow) btnShowShadow.addEventListener("click", showShadowOnly);

    // Initial state: show both
    showBoth();
  }


  // 7. ACCESSIBLE MODAL DIALOG (Evidence Dialog)
  const openDialogBtn = document.getElementById("open-evidence-btn");
  const modalOverlay = document.getElementById("modal-overlay");
  const closeDialogBtn = document.getElementById("close-evidence-btn");
  const closeDialogHeaderBtn = document.getElementById("close-evidence-btn-header");

  if (modalOverlay && openDialogBtn) {
    let previouslyFocusedElement = null;

    function openModal() {
      previouslyFocusedElement = document.activeElement;
      modalOverlay.classList.add("open");
      document.body.style.overflow = "hidden"; // Prevent scrolling behind
      
      // Focus the modal or the first interactive element inside it
      const closeBtn = document.getElementById("close-evidence-btn-header");
      if (closeBtn) closeBtn.focus();

      document.addEventListener("keydown", trapFocus);
    }

    function closeModal() {
      modalOverlay.classList.remove("open");
      document.body.style.overflow = ""; // Restore scroll
      
      document.removeEventListener("keydown", trapFocus);

      // Restore focus to button that opened modal
      if (previouslyFocusedElement) {
        previouslyFocusedElement.focus();
      }
    }

    // Focus trapping inside the modal dialog
    function trapFocus(e) {
      if (e.key !== "Tab") {
        if (e.key === "Escape") {
          closeModal();
        }
        return;
      }

      const focusableEls = modalOverlay.querySelectorAll('button, [href], input, select, textarea, [tabindex="0"]');
      const firstFocusable = focusableEls[0];
      const lastFocusable = focusableEls[focusableEls.length - 1];

      if (e.shiftKey) { // Shift + Tab
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else { // Tab
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }

    // Attach listeners
    openDialogBtn.addEventListener("click", openModal);
    if (closeDialogBtn) closeDialogBtn.addEventListener("click", closeModal);
    if (closeDialogHeaderBtn) closeDialogHeaderBtn.addEventListener("click", closeModal);

    // Close on overlay overlay click
    modalOverlay.addEventListener("click", (e) => {
      if (e.target === modalOverlay) {
        closeModal();
      }
    });
  }


  // 8. LINK INTERACTION - HOW-001 (Explore sample dynamic triggers tab change)
  const sampleDynamicBtn = document.getElementById("explore-sample-btn");
  if (sampleDynamicBtn) {
    sampleDynamicBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const insideReportSection = document.getElementById("inside-report");
      if (insideReportSection) {
        // Scroll to section
        insideReportSection.scrollIntoView({ behavior: "smooth" });
        
        // Find Shared Dynamic tab and select it
        const sharedDynamicTab = document.querySelector('[aria-controls="shared-dynamic-panel"]');
        if (sharedDynamicTab) {
          // Programmatic trigger
          sharedDynamicTab.click();
          sharedDynamicTab.focus();
        }
      }
    });
  }

  // HERO-002 - See how it works button scrolls to how it works and moves focus
  const seeHowItWorksBtn = document.getElementById("hero-see-how-btn");
  if (seeHowItWorksBtn) {
    seeHowItWorksBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const howItWorksSection = document.getElementById("how-it-works");
      if (howItWorksSection) {
        howItWorksSection.scrollIntoView({ behavior: "smooth" });
        // Set focus to the section heading safely
        const heading = howItWorksSection.querySelector("h2");
        if (heading) {
          heading.setAttribute("tabindex", "-1");
          heading.focus();
        }
      }
    });
  }


  // --------------------------------------------------------------------------
  // 9. HIGH-FIDELITY INTERACTIVE WALKTHROUGH PLAYER (01-02-03)
  // --------------------------------------------------------------------------
  const stepCards = document.querySelectorAll(".walkthrough-step-card");
  const stageElements = document.querySelectorAll(".walkthrough-stage");
  const indicatorDots = document.querySelectorAll(".step-indicator-dot");
  const playPauseBtn = document.getElementById("walkthrough-play-btn");
  const playIcon = document.getElementById("walkthrough-play-icon");
  const playText = document.getElementById("walkthrough-play-text");

  let currentStep = 1;
  let autoplayActive = true;
  let stepProgress = 0;
  let progressTimer = null;
  const stepDurationMs = 6000; // 6 seconds per step
  const intervalTickMs = 50; // Update progress bar every 50ms for smoothness

  function setStepActive(stepNum) {
    currentStep = parseInt(stepNum);
    stepProgress = 0; // Reset progress count

    // Update active state on playlist cards
    stepCards.forEach(card => {
      const cardStep = parseInt(card.getAttribute("data-step"));
      const pBar = card.querySelector(".walkthrough-progress-bar");
      if (cardStep === currentStep) {
        card.classList.add("active");
        if (pBar) pBar.style.width = "0%";
      } else {
        card.classList.remove("active");
        if (pBar) pBar.style.width = "0%";
      }
    });

    // Update stages in viewport
    stageElements.forEach(stage => {
      const stageNum = parseInt(stage.id.replace("stage-", ""));
      if (stageNum === currentStep) {
        stage.classList.add("active");
      } else {
        stage.classList.remove("active");
      }
    });

    // Update dots
    indicatorDots.forEach(dot => {
      const dotStep = parseInt(dot.getAttribute("data-step"));
      if (dotStep === currentStep) {
        dot.classList.add("active");
      } else {
        dot.classList.remove("active");
      }
    });

    // Add specific stage animations or triggers if needed
    triggerStageActions(currentStep);
  }

  function advanceStep() {
    let nextStep = currentStep + 1;
    if (nextStep > 3) nextStep = 1;
    setStepActive(nextStep);
  }

  // Interactive typing or animation resets on stage activation
  function triggerStageActions(step) {
    if (step === 1) {
      // Simulate typing animation
      const inputA = document.getElementById("mock-input-a");
      const inputB = document.getElementById("mock-input-b");
      if (inputA && inputB) {
        inputA.textContent = "";
        inputB.textContent = "";
        let nameA = "Emma";
        let nameB = "Liam";
        
        let i = 0;
        function typeA() {
          if (i < nameA.length) {
            inputA.textContent += nameA.charAt(i);
            i++;
            setTimeout(typeA, 150);
          } else {
            // Start typing B after A finished
            let j = 0;
            function typeB() {
              if (j < nameB.length) {
                inputB.textContent += nameB.charAt(j);
                j++;
                setTimeout(typeB, 150);
              }
            }
            setTimeout(typeB, 400);
          }
        }
        setTimeout(typeA, 300);
      }
    }
  }

  // Set up the high resolution timer tick
  function startProgressTimer() {
    if (progressTimer) clearInterval(progressTimer);
    progressTimer = setInterval(() => {
      if (autoplayActive && !localReducedMotion) {
        stepProgress += (intervalTickMs / stepDurationMs) * 100;
        
        // Update active card's progress bar
        const activeCard = document.querySelector(`.walkthrough-step-card[data-step="${currentStep}"]`);
        if (activeCard) {
          const pBar = activeCard.querySelector(".walkthrough-progress-bar");
          if (pBar) {
            pBar.style.width = `${Math.min(stepProgress, 100)}%`;
          }
        }

        if (stepProgress >= 100) {
          stepProgress = 0;
          advanceStep();
        }
      }
    }, intervalTickMs);
  }

  function pauseAutoplay() {
    autoplayActive = false;
    if (playIcon) playIcon.textContent = "▶";
    if (playText) playText.textContent = "Resume Autoplay";
    if (playPauseBtn) playPauseBtn.setAttribute("aria-label", "Resume walkthrough autoplay");
    
    // Clear current active progress bar display
    const activeCard = document.querySelector(`.walkthrough-step-card[data-step="${currentStep}"]`);
    if (activeCard) {
      const pBar = activeCard.querySelector(".walkthrough-progress-bar");
      if (pBar) pBar.style.width = "0%";
    }
  }

  function resumeAutoplay() {
    autoplayActive = true;
    stepProgress = 0; // restart step progress
    if (playIcon) playIcon.textContent = "⏸";
    if (playText) playText.textContent = "Pause Autoplay";
    if (playPauseBtn) playPauseBtn.setAttribute("aria-label", "Pause walkthrough autoplay");
  }

  // Playback control button click
  if (playPauseBtn) {
    playPauseBtn.addEventListener("click", () => {
      if (autoplayActive) {
        pauseAutoplay();
      } else {
        resumeAutoplay();
      }
    });
  }

  // Card click bindings
  stepCards.forEach(card => {
    card.addEventListener("click", () => {
      pauseAutoplay(); // Manual interaction pauses autoplay
      setStepActive(card.getAttribute("data-step"));
    });

    // Accessibility keyboard support
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pauseAutoplay();
        setStepActive(card.getAttribute("data-step"));
      }
    });
  });

  // Dot indicators click bindings
  indicatorDots.forEach(dot => {
    dot.addEventListener("click", () => {
      pauseAutoplay();
      setStepActive(dot.getAttribute("data-step"));
    });
  });

  // Initial setup
  setStepActive(1);
  startProgressTimer();


  // --------------------------------------------------------------------------
  // 10. RELATIONSHIP REPORT SELECTOR & SWAPPER
  // --------------------------------------------------------------------------
  const archetypePills = document.querySelectorAll(".archetype-pill");
  let activeArchetypeId = "tempo"; // Defaults to Tempo Differences

  // State configurations for interactive sliders based on selected archetype
  const sliderConfigs = {
    tempo: {
      label1: "Person A processing tempo:",
      label2: "Person B processing tempo:",
      min1: 1, max1: 10, val1: 8,
      min2: 1, max2: 10, val2: 2,
      val1Text: (v) => v > 7 ? "Rapid verbalization" : (v > 4 ? "Moderate tempo" : "Slow processing"),
      val2Text: (v) => v > 7 ? "Rapid verbalization" : (v > 4 ? "Moderate tempo" : "Deliberate reflection")
    },
    autonomy: {
      label1: "Person A closeness needs:",
      label2: "Person B autonomy boundaries:",
      min1: 30, max1: 120, val1: 85,
      min2: 30, max2: 120, val2: 50,
      val1Text: (v) => v > 90 ? "High intimacy desire" : (v > 60 ? "Interdependent" : "Self-contained"),
      val2Text: (v) => v > 90 ? "Wide open boundary" : (v > 60 ? "Selective integration" : "Highly private space")
    },
    conflict: {
      label1: "Person A reactivity speed:",
      label2: "Person B withdrawal duration:",
      min1: 5, max1: 50, val1: 45,
      min2: 5, max2: 50, val2: 15,
      val1Text: (v) => v > 35 ? "Immediate defense" : (v > 20 ? "Responsive" : "Calm and observant"),
      val2Text: (v) => v > 35 ? "Prolonged exit" : (v > 20 ? "Temporary step-back" : "Immediate return")
    },
    structure: {
      label1: "Person A predictability preference:",
      label2: "Person B spontaneity variance:",
      min1: 3, max1: 15, val1: 12,
      min2: 5, max2: 45, val2: 20,
      val1Text: (v) => v > 10 ? "Strict structural lines" : (v > 6 ? "General routines" : "Highly flexible structure"),
      val2Text: (v) => v > 30 ? "High chaos / novelty" : (v > 15 ? "Healthy variation" : "Prefers rhythm")
    }
  };

  function swapReportArchetype(archetypeId) {
    if (!window.bazodiacContent || !window.bazodiacContent.archetypes) return;
    const archData = window.bazodiacContent.archetypes[archetypeId];
    if (!archData) return;

    activeArchetypeId = archetypeId;

    // Fade effect on panels
    const displayContainer = document.getElementById("report-display-container");
    if (displayContainer) {
      displayContainer.style.opacity = "0.4";
      displayContainer.style.transition = "opacity 0.25s ease";
    }

    setTimeout(() => {
      // 1. Swap tabs titles and text content
      document.getElementById("person-a-title").textContent = archData.personA.title;
      document.getElementById("person-a-body").textContent = archData.personA.description;

      document.getElementById("shared-dynamic-title").textContent = archData.sharedDynamic.title;
      document.getElementById("shared-dynamic-body").textContent = archData.sharedDynamic.description;

      document.getElementById("person-b-title").textContent = archData.personB.title;
      document.getElementById("person-b-body").textContent = archData.personB.description;

      // 2. Swap Conditions lists
      const intensifyingList = document.getElementById("intensifying-list");
      intensifyingList.innerHTML = "";
      archData.conditions.intensifying.forEach(cond => {
        const li = document.createElement("li");
        li.textContent = cond;
        intensifyingList.appendChild(li);
      });

      const moderatingList = document.getElementById("moderating-list");
      moderatingList.innerHTML = "";
      archData.conditions.moderating.forEach(cond => {
        const li = document.createElement("li");
        li.textContent = cond;
        moderatingList.appendChild(li);
      });

      document.getElementById("counter-hypothesis-body").textContent = archData.conditions.counterHypothesis;

      // 3. Swap Shadow & Opportunity text panels (Section 6)
      document.getElementById("shadow-body-card").textContent = archData.possibleShadow.description;
      document.getElementById("opp-body-card").textContent = archData.possibleOpportunity.description;

      // Update small visual card header
      document.getElementById("visual-title-small").textContent = archData.sharedDynamic.title;

      // 4. Update the interactive sliders boundaries and default values
      const cfg = sliderConfigs[archetypeId];
      const s1 = document.getElementById("param-slider-1");
      const s2 = document.getElementById("param-slider-2");
      const l1 = document.getElementById("slider-1-label");
      const l2 = document.getElementById("slider-2-label");

      if (s1 && s2 && cfg) {
        s1.min = cfg.min1;
        s1.max = cfg.max1;
        s1.value = cfg.val1;

        s2.min = cfg.min2;
        s2.max = cfg.max2;
        s2.value = cfg.val2;

        l1.childNodes[0].textContent = cfg.label1 + " ";
        l2.childNodes[0].textContent = cfg.label2 + " ";

        // Update slider value text labels
        document.getElementById("val-1-text").textContent = cfg.val1Text(cfg.val1);
        document.getElementById("val-2-text").textContent = cfg.val2Text(cfg.val2);
      }

      // Restore opacity and redraw
      if (displayContainer) {
        displayContainer.style.opacity = "1";
      }

      renderRelationshipSVG();
    }, 250);
  }

  // Attach swapper pills listeners
  archetypePills.forEach(pill => {
    pill.addEventListener("click", () => {
      archetypePills.forEach(p => {
        p.classList.remove("active");
        p.setAttribute("aria-checked", "false");
      });
      pill.classList.add("active");
      pill.setAttribute("aria-checked", "true");

      swapReportArchetype(pill.getAttribute("data-archetype"));
    });
  });


  // --------------------------------------------------------------------------
  // 11. HIGH-FIDELITY DYNAMIC SVG VISUALIZER
  // --------------------------------------------------------------------------
  const slider1 = document.getElementById("param-slider-1");
  const slider2 = document.getElementById("param-slider-2");
  const svgCanvas = document.getElementById("live-dynamic-svg");

  const btnNormal = document.getElementById("btn-toggle-normal");
  const btnShadow = document.getElementById("btn-toggle-shadow");
  const btnOpportunity = document.getElementById("btn-toggle-opportunity");
  let currentVisualMode = "normal"; // normal, shadow, opportunity

  // Connect visual mode toggles
  if (btnNormal) {
    btnNormal.addEventListener("click", () => {
      updateVisualMode("normal", btnNormal);
    });
  }
  if (btnShadow) {
    btnShadow.addEventListener("click", () => {
      updateVisualMode("shadow", btnShadow);
    });
  }
  if (btnOpportunity) {
    btnOpportunity.addEventListener("click", () => {
      updateVisualMode("opportunity", btnOpportunity);
    });
  }

  function updateVisualMode(mode, btnElement) {
    currentVisualMode = mode;
    [btnNormal, btnShadow, btnOpportunity].forEach(btn => {
      if (btn) btn.classList.remove("active");
    });
    if (btnElement) btnElement.classList.add("active");

    const statusText = document.getElementById("visual-status-text");
    if (statusText) {
      if (mode === "normal") statusText.textContent = "Dynamic Mode: Interactive Sliders";
      if (mode === "shadow") statusText.textContent = "Dynamic Mode: Possible Shadow expression";
      if (mode === "opportunity") statusText.textContent = "Dynamic Mode: Possible Opportunity expression";
    }

    renderRelationshipSVG();
  }

  // Listen to slider changes in real-time
  if (slider1) {
    slider1.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      const textEl = document.getElementById("val-1-text");
      const cfg = sliderConfigs[activeArchetypeId];
      if (textEl && cfg) textEl.textContent = cfg.val1Text(val);

      renderRelationshipSVG();
    });
  }

  if (slider2) {
    slider2.addEventListener("input", (e) => {
      const val = parseInt(e.target.value);
      const textEl = document.getElementById("val-2-text");
      const cfg = sliderConfigs[activeArchetypeId];
      if (textEl && cfg) textEl.textContent = cfg.val2Text(val);

      renderRelationshipSVG();
    });
  }

  // MAIN DRAWING ENGINE FOR DYNAMIC RELATIONSHIP SVG
  function renderRelationshipSVG() {
    if (!svgCanvas) return;

    // Clear canvas
    svgCanvas.innerHTML = "";

    const val1 = slider1 ? parseInt(slider1.value) : 50;
    const val2 = slider2 ? parseInt(slider2.value) : 50;

    // Core Colors based on design tokens
    const cCobaltDeep = "#3c352a"; // Deep warm bronze
    const cCobaltSoft = "#827565"; // Elegant soft bronze/taupe
    const cGoldMuted = "#c2aa70";  // Golden metallic
    const cSageMuted = "#8da8a1";  // Soft sage green
    const cRoseMuted = "#a49596";  // Muted dusty rose
    const cCinnabar = "#bf4c34";   // Vibrant terracotta/cinnabar
    const cEmerald = "#507d6a";    // Muted historical forest sage

    // Setup defs for glowing filters
    let defsHtml = `
      <defs>
        <filter id="glow-sage" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-rose" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-cinnabar" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
    `;
    svgCanvas.innerHTML = defsHtml;

    // Draw background grids or soft frames
    const bgFrame = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bgFrame.setAttribute("width", "400");
    bgFrame.setAttribute("height", "300");
    bgFrame.setAttribute("fill", "transparent");
    svgCanvas.appendChild(bgFrame);

    // Setup active perspective highlight states
    const highlightA = currentPerspective === "personA";
    const highlightB = currentPerspective === "personB";
    const highlightShared = currentPerspective === "sharedDynamic";

    // Draw active perspective ambient aura background
    if (highlightA) {
      drawAura(100, 150, cSageMuted, "glow-sage");
    } else if (highlightB) {
      drawAura(300, 150, cRoseMuted, "glow-rose");
    } else if (highlightShared) {
      drawAura(200, 150, currentVisualMode === "shadow" ? cCinnabar : (currentVisualMode === "opportunity" ? cEmerald : cGoldMuted), currentVisualMode === "shadow" ? "glow-cinnabar" : "glow-gold");
    }

    // --------------------------------------------------
    // ARCHETYPE 1: TEMPO DIFFERENCES
    // --------------------------------------------------
    if (activeArchetypeId === "tempo") {
      // Node coordinates
      const ax = 80, ay = 150;
      const bx = 320, by = 150;

      // Draw the shared dynamic wave link
      const wavePath = document.createElementNS("http://www.w3.org/2000/svg", "path");
      wavePath.setAttribute("class", "svg-wave-path");

      let d = `M ${ax} ${ay}`;
      const steps = 60;
      
      // Calculate amplitude and noise depending on Stress/Shadow mode
      let amp = 30;
      if (currentVisualMode === "shadow") amp = 55;
      if (currentVisualMode === "opportunity") amp = 16;

      const f1 = val1; // Tempo A
      const f2 = val2; // Tempo B

      for (let i = 0; i <= steps; i++) {
        const x = ax + (i / steps) * (bx - ax);
        const t = i / steps;

        // Smooth transition of frequencies between A and B
        const currentFreq = (f1 / 2) * (1 - t) + (f2 / 2) * t;
        
        let yNoise = 0;
        if (currentVisualMode === "shadow") {
          // Add jagged tension noise to represent friction
          yNoise = Math.sin(t * Math.PI * 18) * 8 * Math.cos(t * Math.PI * 12);
        }

        const y = 150 + Math.sin(t * Math.PI * 2 * currentFreq) * amp + yNoise;
        d += ` L ${x} ${y}`;
      }

      wavePath.setAttribute("d", d);
      
      // Set coloring depending on the mode
      if (currentVisualMode === "shadow") {
        wavePath.setAttribute("stroke", cCinnabar);
        wavePath.setAttribute("stroke-dasharray", "3 3");
      } else if (currentVisualMode === "opportunity") {
        wavePath.setAttribute("stroke", cEmerald);
        wavePath.setAttribute("stroke-width", "2.5");
      } else {
        wavePath.setAttribute("stroke", cGoldMuted);
      }
      svgCanvas.appendChild(wavePath);

      // Draw nodes
      drawNode(ax, ay, cSageMuted, "A", highlightA);
      drawNode(bx, by, cRoseMuted, "B", highlightB);

      // Add speed indicator orbits
      drawSpeedOrbit(ax, ay, val1, cSageMuted);
      drawSpeedOrbit(bx, by, val2, cRoseMuted);
    }

    // --------------------------------------------------
    // ARCHETYPE 2: AUTONOMY & CLOSENESS
    // --------------------------------------------------
    else if (activeArchetypeId === "autonomy") {
      // In autonomy mode, slider 1 controls Person A orbit distance, slider 2 controls B
      const rA = val1; // Left circle radius size
      const rB = val2; // Right circle radius size

      // Circle centers
      let cxA = 150, cyA = 150;
      let cxB = 250, cyB = 150;

      if (currentVisualMode === "shadow") {
        // Enmeshed (colliding) or fully alienated
        cxA = 110;
        cxB = 290;
      } else if (currentVisualMode === "opportunity") {
        // Safe golden overlap
        cxA = 160;
        cxB = 240;
      }

      // Draw circle boundaries
      const circA = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circA.setAttribute("cx", cxA.toString());
      circA.setAttribute("cy", cyA.toString());
      circA.setAttribute("r", rA.toString());
      circA.setAttribute("fill", "none");
      circA.setAttribute("stroke", cSageMuted);
      circA.setAttribute("stroke-width", highlightA ? "2.5" : "1.5");
      circA.setAttribute("stroke-dasharray", "4 4");
      svgCanvas.appendChild(circA);

      const circB = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circB.setAttribute("cx", cxB.toString());
      circB.setAttribute("cy", cyB.toString());
      circB.setAttribute("r", rB.toString());
      circB.setAttribute("fill", "none");
      circB.setAttribute("stroke", cRoseMuted);
      circB.setAttribute("stroke-width", highlightB ? "2.5" : "1.5");
      circB.setAttribute("stroke-dasharray", "4 4");
      svgCanvas.appendChild(circB);

      // If opportunity, shade the overlapping area (Vesica Piscis)
      if (currentVisualMode === "opportunity") {
        // Draw elegant decorative central core node representing safety in closeness
        const intersectionNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        intersectionNode.setAttribute("cx", "200");
        intersectionNode.setAttribute("cy", "150");
        intersectionNode.setAttribute("r", "16");
        intersectionNode.setAttribute("fill", cEmerald);
        intersectionNode.setAttribute("fill-opacity", "0.25");
        intersectionNode.setAttribute("stroke", cEmerald);
        intersectionNode.setAttribute("filter", "url(#glow-gold)");
        svgCanvas.appendChild(intersectionNode);
      }

      // Draw connection lines representing mutual pull
      const tensionLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
      tensionLine.setAttribute("x1", cxA.toString());
      tensionLine.setAttribute("y1", cyA.toString());
      tensionLine.setAttribute("x2", cxB.toString());
      tensionLine.setAttribute("y2", cyB.toString());
      
      if (currentVisualMode === "shadow") {
        tensionLine.setAttribute("stroke", cCinnabar);
        tensionLine.setAttribute("stroke-width", "2");
        tensionLine.setAttribute("stroke-dasharray", "2 6");
      } else if (currentVisualMode === "opportunity") {
        tensionLine.setAttribute("stroke", cEmerald);
        tensionLine.setAttribute("stroke-width", "2.5");
      } else {
        tensionLine.setAttribute("stroke", cGoldMuted);
        tensionLine.setAttribute("stroke-width", "1.5");
      }
      svgCanvas.appendChild(tensionLine);

      // Draw center core actors
      drawNode(cxA, cyA, cSageMuted, "A", highlightA);
      drawNode(cxB, cyB, cRoseMuted, "B", highlightB);
    }

    // --------------------------------------------------
    // ARCHETYPE 3: CONFLICT STYLES (Cycle / Feedback loop)
    // --------------------------------------------------
    else if (activeArchetypeId === "conflict") {
      // Loop amplitude and reactivities
      const speedA = val1; // Reactivity level A
      const withdrawB = val2; // Withdrawal level B

      const ax = 100, ay = 150;
      const bx = 300, by = 150;

      // Draw feedback loop pathway
      const topArc = document.createElementNS("http://www.w3.org/2000/svg", "path");
      const bottomArc = document.createElementNS("http://www.w3.org/2000/svg", "path");

      // Draw curves
      let topYOffset = 40 + (speedA / 2);
      let bottomYOffset = 40 + (withdrawB / 2);

      if (currentVisualMode === "shadow") {
        topYOffset += 25;
        bottomYOffset += 25;
      } else if (currentVisualMode === "opportunity") {
        topYOffset = 25;
        bottomYOffset = 25;
      }

      const topD = `M ${ax} ${ay} Q 200 ${150 - topYOffset} ${bx} ${by}`;
      const bottomD = `M ${bx} ${by} Q 200 ${150 + bottomYOffset} ${ax} ${ay}`;

      topArc.setAttribute("d", topD);
      topArc.setAttribute("fill", "none");
      bottomArc.setAttribute("d", bottomD);
      bottomArc.setAttribute("fill", "none");

      if (currentVisualMode === "shadow") {
        topArc.setAttribute("stroke", cCinnabar);
        topArc.setAttribute("stroke-width", "2");
        topArc.setAttribute("stroke-dasharray", "5 3");
        bottomArc.setAttribute("stroke", cCinnabar);
        bottomArc.setAttribute("stroke-width", "2");
        bottomArc.setAttribute("stroke-dasharray", "5 3");
      } else if (currentVisualMode === "opportunity") {
        topArc.setAttribute("stroke", cEmerald);
        topArc.setAttribute("stroke-width", "2.5");
        bottomArc.setAttribute("stroke", cEmerald);
        bottomArc.setAttribute("stroke-width", "2.5");
      } else {
        topArc.setAttribute("stroke", cSageMuted);
        topArc.setAttribute("stroke-width", "1.5");
        bottomArc.setAttribute("stroke", cRoseMuted);
        bottomArc.setAttribute("stroke-width", "1.5");
      }

      svgCanvas.appendChild(topArc);
      svgCanvas.appendChild(bottomArc);

      // Draw direction arrows on the arcs
      drawArrowHead(205, 150 - topYOffset/2, currentVisualMode === "shadow" ? cCinnabar : (currentVisualMode === "opportunity" ? cEmerald : cSageMuted), true);
      drawArrowHead(195, 150 + bottomYOffset/2, currentVisualMode === "shadow" ? cCinnabar : (currentVisualMode === "opportunity" ? cEmerald : cRoseMuted), false);

      // Draw anchor point for opportunity
      if (currentVisualMode === "opportunity") {
        const anchorNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        anchorNode.setAttribute("cx", "200");
        anchorNode.setAttribute("cy", "150");
        anchorNode.setAttribute("r", "12");
        anchorNode.setAttribute("fill", cGoldMuted);
        anchorNode.setAttribute("stroke", cGoldMuted);
        anchorNode.setAttribute("fill-opacity", "0.3");
        svgCanvas.appendChild(anchorNode);
      }

      // Core nodes
      drawNode(ax, ay, cSageMuted, "A", highlightA);
      drawNode(bx, by, cRoseMuted, "B", highlightB);
    }

    // --------------------------------------------------
    // ARCHETYPE 4: STRUCTURE & SPONTANEITY (Grid vs Freeform)
    // --------------------------------------------------
    else if (activeArchetypeId === "structure") {
      const gridCount = val1; // Number of structured vertical gridlines
      const waviness = val2; // Chaos flow wave of spontaneous B

      // Draw structural gridlines on the left
      const gridGroup = document.createElementNS("http://www.w3.org/2000/svg", "g");
      for (let i = 0; i <= gridCount; i++) {
        const lineX = 40 + (i / gridCount) * 160;
        const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
        line.setAttribute("x1", lineX.toString());
        line.setAttribute("y1", "60");
        line.setAttribute("x2", lineX.toString());
        line.setAttribute("y2", "240");
        
        if (currentVisualMode === "shadow") {
          line.setAttribute("stroke", cCinnabar);
          line.setAttribute("stroke-opacity", "0.25");
        } else if (currentVisualMode === "opportunity") {
          line.setAttribute("stroke", cGoldMuted);
          line.setAttribute("stroke-opacity", "0.35");
        } else {
          line.setAttribute("stroke", cSageMuted);
          line.setAttribute("stroke-opacity", "0.2");
        }
        gridGroup.appendChild(line);
      }
      svgCanvas.appendChild(gridGroup);

      // Draw organic fluid curve on the right
      const fluidCurve = document.createElementNS("http://www.w3.org/2000/svg", "path");
      fluidCurve.setAttribute("fill", "none");

      let d = "M 180 150";
      const steps = 40;
      for (let i = 0; i <= steps; i++) {
        const x = 180 + (i / steps) * 180;
        const t = i / steps;
        
        let curveY = 150 + Math.sin(t * Math.PI * 4) * waviness * Math.cos(t * Math.PI * 2);
        if (currentVisualMode === "shadow") {
          // Sharp jagged clashing waves
          curveY = 150 + Math.sign(Math.sin(t * Math.PI * 10)) * waviness * 0.8;
        }

        d += ` L ${x} ${curveY}`;
      }
      fluidCurve.setAttribute("d", d);

      if (currentVisualMode === "shadow") {
        fluidCurve.setAttribute("stroke", cCinnabar);
        fluidCurve.setAttribute("stroke-width", "2");
      } else if (currentVisualMode === "opportunity") {
        fluidCurve.setAttribute("stroke", cEmerald);
        fluidCurve.setAttribute("stroke-width", "2.5");
      } else {
        fluidCurve.setAttribute("stroke", cRoseMuted);
        fluidCurve.setAttribute("stroke-width", "1.5");
      }
      svgCanvas.appendChild(fluidCurve);

      // Joint connection point representing interaction
      const jointNode = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      jointNode.setAttribute("cx", "180");
      jointNode.setAttribute("cy", "150");
      jointNode.setAttribute("r", "8");
      
      if (currentVisualMode === "shadow") {
        jointNode.setAttribute("fill", cCinnabar);
      } else if (currentVisualMode === "opportunity") {
        jointNode.setAttribute("fill", cEmerald);
        jointNode.setAttribute("filter", "url(#glow-gold)");
      } else {
        jointNode.setAttribute("fill", cGoldMuted);
      }
      svgCanvas.appendChild(jointNode);

      // End Anchor nodes
      drawNode(80, 150, cSageMuted, "A", highlightA);
      drawNode(320, 150, cRoseMuted, "B", highlightB);
    }
  }

  // Draw background glowing radial auroras for current focus
  function drawAura(cx, cy, color, filterId) {
    const aura = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    aura.setAttribute("cx", cx.toString());
    aura.setAttribute("cy", cy.toString());
    aura.setAttribute("r", "55");
    aura.setAttribute("fill", color);
    aura.setAttribute("fill-opacity", "0.08");
    aura.setAttribute("filter", `url(#${filterId})`);
    svgCanvas.appendChild(aura);
  }

  // Draw standard node actor (Circle + initial letter + outer halo)
  function drawNode(cx, cy, color, textLabel, isHighlighted) {
    // Outer halo ring
    const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    halo.setAttribute("cx", cx.toString());
    halo.setAttribute("cy", cy.toString());
    halo.setAttribute("r", isHighlighted ? "24" : "18");
    halo.setAttribute("fill", "none");
    halo.setAttribute("stroke", color);
    halo.setAttribute("stroke-opacity", isHighlighted ? "0.8" : "0.2");
    halo.setAttribute("stroke-width", isHighlighted ? "2" : "1");
    if (isHighlighted) {
      halo.setAttribute("stroke-dasharray", "2 2");
      halo.setAttribute("filter", color === "#8da8a1" ? "url(#glow-sage)" : "url(#glow-rose)");
    }
    svgCanvas.appendChild(halo);

    // Inner filled circle node
    const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circle.setAttribute("cx", cx.toString());
    circle.setAttribute("cy", cy.toString());
    circle.setAttribute("r", "13");
    circle.setAttribute("fill", color);
    circle.setAttribute("stroke", "#f4f1ea");
    circle.setAttribute("stroke-width", "1.5");
    svgCanvas.appendChild(circle);

    // Text letter
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", cx.toString());
    txt.setAttribute("y", (cy + 4).toString());
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", "#ffffff");
    txt.setAttribute("font-family", "Georgia, serif");
    txt.setAttribute("font-weight", "bold");
    txt.setAttribute("font-size", "11");
    txt.textContent = textLabel;
    svgCanvas.appendChild(txt);
  }

  // Draw fine dashed speed dials/indicators around a node to indicate activity
  function drawSpeedOrbit(cx, cy, val, color) {
    const speedOrbit = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    speedOrbit.setAttribute("cx", cx.toString());
    speedOrbit.setAttribute("cy", cy.toString());
    speedOrbit.setAttribute("r", (26 + val * 1.5).toString());
    speedOrbit.setAttribute("fill", "none");
    speedOrbit.setAttribute("stroke", color);
    speedOrbit.setAttribute("stroke-opacity", "0.15");
    speedOrbit.setAttribute("stroke-width", "1");
    speedOrbit.setAttribute("stroke-dasharray", "2 5");
    svgCanvas.appendChild(speedOrbit);
  }

  // Draw arrowheads on directional feedback arcs
  function drawArrowHead(x, y, color, isForward) {
    const arrow = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
    let points = "";
    if (isForward) {
      points = `${x},${y-4} ${x+6},${y} ${x},${y+4}`;
    } else {
      points = `${x},${y-4} ${x-6},${y} ${x},${y+4}`;
    }
    arrow.setAttribute("points", points);
    arrow.setAttribute("fill", color);
    svgCanvas.appendChild(arrow);
  }

  // Render first default layout
  renderRelationshipSVG();


  // --------------------------------------------------------------------------
  // 12. GENERAL NAVIGATION & SMOOTH ANCHORS
  // --------------------------------------------------------------------------
  // Handled in block HERO-002 above
});
