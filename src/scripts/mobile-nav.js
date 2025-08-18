// Mobile navigation functionality
(function() {
  const toggleMenu = document.querySelector("[data-toggle-nav]");
  const navbar = document.querySelector("[data-navbar]");
  const overlayNav = document.querySelector("[data-nav-overlay]");

  if (toggleMenu && navbar && overlayNav) {
    toggleMenu.addEventListener("click", (e) => {
      e.preventDefault();
      const isOpen = toggleMenu.getAttribute("data-open-nav") === "true";
      
      if (!isOpen) {
        toggleMenu.setAttribute("data-open-nav", "true");
        overlayNav.setAttribute("data-is-visible", "true");
        document.body.classList.add("!overflow-y-hidden");
        navbar.style.height = `${navbar.scrollHeight}px`;
      } else {
        closeNav();
      }
    });

    function closeNav() {
      toggleMenu.setAttribute("data-open-nav", "false");
      overlayNav.setAttribute("data-is-visible", "false");
      document.body.classList.remove("!overflow-y-hidden");
      navbar.style.height = "0px";
    }

    navbar.addEventListener("click", closeNav);
    overlayNav.addEventListener("click", closeNav);
  }
})();
