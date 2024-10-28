const menuButton = document.querySelector(".ellipsis-icon");

menuButton.addEventListener("click", () => {
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownMenu.style.display == "flex") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "flex";
  }
});