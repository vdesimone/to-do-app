// ADD TASK BUTTON
const addTaskButton = document.querySelector(".plus-icon");
const addTaskPopup = document.querySelector(".add-task");

addTaskButton.addEventListener("click", () => {
  addTaskPopup.style.display = "flex";
});

// ADD TASK POPUP CANCEL FORM
const addTaskCancelButton = document.getElementById("add-task-cancel-btn");

addTaskCancelButton.addEventListener("click", () => {
  clearPreviousErrors();
  addTaskPopup.reset();
  addTaskPopup.style.display = "none";
});

// ADD TASK POPUP SUBMIT FORM
addTaskPopup.addEventListener("submit", function(event) {
  event.preventDefault();

  clearPreviousErrors();
  validateAddTaskForm();
});

// ADD TASK FORM VALIDATION
function validateAddTaskForm() {
  let isValid = true;

  const title = document.getElementById("addTaskTitle").value.trim();
  const maxLength = 47;
  const titleError = document.getElementById("addTaskTitleError");
  if (title === "") {
    titleError.textContent = "Please give your task a name";
    titleError.style.display = "block";
    isValid = false;
  } else if (title.length > maxLength ) {
    titleError.textContent = "Your task name cannot exceed 48 characters";
    titleError.style.display = "block";
    isValid = false;
  }

  const time = document.getElementById("time").value.trim();
  const timePattern = /^(0?[1-9]|1[0-2])(:[0-5][0-9])? ?(am|AM|pm|PM)$/;
  const timeError = document.getElementById("timeError");
  if (time === "") {
    timeError.textContent = "Please add a start time for your task";
    timeError.style.display = "block";
    isValid = false;
  } else if (!timePattern.test(time)) {
    timeError.textContent = "Add a time with am or pm after it";
    timeError.style.display = "block";
    isValid = false;
  }

  if (isValid) {
    createTask(title, time);
    addTaskPopup.style.display = "none";
    addTaskPopup.reset();
  }
}

function clearPreviousErrors() {
  const errorMessages = document.querySelectorAll(".error-message");

  errorMessages.forEach(msg => msg.style.display = "none");
}

// CREATE TASK
function createTask(title, time) {
  const toDoList = document.querySelector(".to-do-list");

  // Create li
  const listItem = document.createElement("li");
  listItem.classList.add("task");

  // SVGs
  const checkSVG = createSVG(
    "Check Icon",
    "Button to check a task as complete",
    "M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z",
    "-1 0 26 20"
  );
  const pencilSVG = createSVG(
    "Pencil Icon",
    "Button to edit current task",
    "M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z",
    "-2.65 -2.65 29 29"
  );
  const xSVG = createSVG(
    "X Icon",
    "Button to delete current task",
    "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
    "0 0 24 24"
  );


  // HTML Structure
  toDoList.appendChild(listItem);

  // check-mark-div
  const checkMarkDiv = document.createElement("div");
  listItem.appendChild(checkMarkDiv);
  checkMarkDiv.classList.add("check-mark-div");

  // check-mark-button
  const checkMarkButton = document.createElement("button");
  checkMarkDiv.appendChild(checkMarkButton);
  checkMarkButton.classList.add("check-mark-button");
  checkMarkButton.appendChild(checkSVG);

  // task-info
  const taskInfoDiv = document.createElement("div");
  taskInfoDiv.classList.add("task-info");

  const taskInfoSubheading = document.createElement("h2");
  taskInfoSubheading.textContent = `${title}`;

  const taskInfoParagraph = document.createElement("p");
  taskInfoParagraph.textContent = `at ${time}`;

  listItem.appendChild(taskInfoDiv);
  taskInfoDiv.appendChild(taskInfoSubheading);
  taskInfoDiv.appendChild(taskInfoParagraph);

  // buttons
  const buttonsDiv = document.createElement("div");
  buttonsDiv.classList.add("buttons");

  const pencilIconButton = document.createElement("button");
  const xIconButton = document.createElement("button");

  listItem.appendChild(buttonsDiv);

  buttonsDiv.appendChild(pencilIconButton);
  pencilIconButton.appendChild(pencilSVG);

  buttonsDiv.appendChild(xIconButton);
  xIconButton.appendChild(xSVG);
}

// CREATE SVG
function createSVG(title, desc, path, viewBox) {
  const svgNamespace = "http://www.w3.org/2000/svg";

  const svg = document.createElementNS(svgNamespace, "svg");
  svg.classList.add("icon");
  svg.setAttribute("xmlns", svgNamespace);
  svg.setAttribute("viewBox", viewBox);
  svg.setAttribute("fill", "currentColor");

  const svgTitle = document.createElementNS(svgNamespace, "title");
  svgTitle.textContent = title;

  const svgDesc = document.createElementNS(svgNamespace, "desc");
  svgDesc.textContent = desc;

  const svgPath = document.createElementNS(svgNamespace, "path");
  svgPath.setAttribute("d", path);

  svg.appendChild(svgTitle);
  svg.appendChild(svgDesc);
  svg.appendChild(svgPath);

  return svg;
}

// MENU BUTTON
const menuButton = document.querySelector(".ellipsis-icon");

menuButton.addEventListener("click", () => {
  const dropdownMenu = document.querySelector(".dropdown-menu");

  if (dropdownMenu.style.display == "flex") {
    dropdownMenu.style.display = "none";
  } else {
    dropdownMenu.style.display = "flex";
  }
});

// EDIT CURRENT LIST BUTTON
const editCurrentListButton = document.querySelector(".edit-current-list");
const editCurrentListPopup = document.querySelector(".edit-list");

editCurrentListButton.addEventListener("click", () => {
  editCurrentListPopup.style.display = "flex";
});

// EDIT CURRENT LIST POPUP CANCEL FORM
const editListCancelButton = document.getElementById("edit-list-cancel-btn");

editListCancelButton.addEventListener("click", () => {
  clearPreviousErrors();
  editCurrentListPopup.reset();
  editCurrentListPopup.style.display = "none";
});

// EDIT CURRENT LIST POPUP SUBMIT FORM
editCurrentListPopup.addEventListener("submit", function(event) {
  event.preventDefault();

  clearPreviousErrors();
  validateEditCurrentListForm();
});

// EDIT CURRENT LIST FORM VALIDATION
function validateEditCurrentListForm() {
  let isValid = true;

  const title = document.getElementById("editListTitle").value.trim();
  const maxLength = 20;
  const titleError = document.getElementById("editListTitleError");
  if (title === "") {
    titleError.textContent = "Please give your list a name";
    titleError.style.display = "block";
    isValid = false;
  } else if (title.length > maxLength ) {
    titleError.textContent = "Your list name cannot exceed 20 characters";
    titleError.style.display = "block";
    isValid = false;
  }

  const date = document.getElementById("date").value.trim();
  const datePattern = /^((0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{2}|\d{4})|([A-Za-z]+) (0?[1-9]|[12][0-9]|3[01]), (\d{4}))$/;
  const dateError = document.getElementById("dateError");
  if (date === "") {
    dateError.textContent = "Please give your list a date";
    dateError.style.display = "block";
    isValid = false;
  } else if (!datePattern.test(date)) {
    dateError.textContent = "Add a valid date in the format of 1/1/24 or January 1, 2024";
    dateError.style.display = "block";
    isValid = false;
  }

  if (isValid) {
    editList(title, date);
    editCurrentListPopup.style.display = "none";
    editCurrentListPopup.reset();
  }
}

// EDIT LIST
function editList(title, date) {
  const listTitle = document.querySelector("header h1");
  listTitle.textContent = `${title}`;

  const listDate = document.querySelector("header p");
  listDate.textContent = `${date}`;
}