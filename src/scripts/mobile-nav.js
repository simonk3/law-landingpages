// Mobile navigation functionality - optimized to prevent forced reflow
(function() {
  const toggleMenu = document.querySelector("[data-toggle-nav]");
  const navbar = document.querySelector("[data-navbar]");
  const overlayNav = document.querySelector("[data-nav-overlay]");

  if (toggleMenu && navbar && overlayNav) {
    // Cache the navbar height to avoid repeated calculations
    let navbarHeight = null;
    
    // Use requestAnimationFrame to batch DOM changes
    function batchDOMUpdates(callback) {
      requestAnimationFrame(callback);
    }

    toggleMenu.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = toggleMenu.getAttribute("data-open-nav") === "true";
      
      if (!isOpen) {
        // Cache height on first use
        if (navbarHeight === null) {
          navbarHeight = navbar.scrollHeight;
        }
        
        batchDOMUpdates(() => {
          toggleMenu.setAttribute("data-open-nav", "true");
          overlayNav.setAttribute("data-is-visible", "true");
          document.body.classList.add("!overflow-y-hidden");
          navbar.style.height = `${navbarHeight}px`;
        });
      } else {
        closeNav();
      }
    });

    function closeNav() {
      batchDOMUpdates(() => {
        toggleMenu.setAttribute("data-open-nav", "false");
        overlayNav.setAttribute("data-is-visible", "false");
        document.body.classList.remove("!overflow-y-hidden");
        navbar.style.height = "0px";
      });
    }

    navbar.addEventListener("click", closeNav);
    overlayNav.addEventListener("click", closeNav);
  }
})();
