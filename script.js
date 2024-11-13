window.App = {
  listManagement: {
    saveData: function(lists) {
      localStorage.setItem("lists", JSON.stringify(lists));
    },

    loadData: function() {
      const savedData = localStorage.getItem("lists");
      return savedData ? JSON.parse(savedData) : [];
    },

    addList(listName, listDate) {
      const lists = this.loadData();

      if (lists.length >= 5) {
        return alert("You have reached the maximum amount of lists. Delete one to create a new one.");
      }

      const newList = {
        listId: Date.now(),
        listName,
        listDate,
        tasks: []
      };

      lists.push(newList);
      this.saveData(lists);
    },

    validateAddListForm: function() {
      let isValid = true;

      const title = document.getElementById("addListTitle").value.trim();
      const titleError = document.getElementById("addListTitleError");
      const maxLength = 20;

      if (title === "") {
        titleError.textContent = "Please give your list a name";
        titleError.style.display = "block";
        isValid = false;
      }
      else if (title.length > maxLength ) {
        titleError.textContent = "Your list name cannot exceed 20 characters";
        titleError.style.display = "block";
        isValid = false;
      }

      const date = document.getElementById("addListDate").value.trim();
      const dateError = document.getElementById("addListDateError");
      const datePattern = /^((0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{2}|\d{4})|([A-Za-z]+) (0?[1-9]|[12][0-9]|3[01]), (\d{4}))$/;

      if (date === "") {
        dateError.textContent = "Please give your list a date";
        dateError.style.display = "block";
        isValid = false;
      }
      else if (!datePattern.test(date)) {
        dateError.textContent = "Add a valid date in the format of 1/1/24 or January 1, 2024";
        dateError.style.display = "block";
        isValid = false;
      }

      const addListPopup = document.querySelector(".add-list-form");
      if (isValid) {
        this.createList(title, date);
        addListPopup.style.display = "none";
        addListPopup.reset();
      }
    },

    openList: function() {
      console.log("clicked the open list btn");
    },

    deleteList: function() {
      console.log("clicked the delete list btn");
    },

    handleEvents: function() {
      // open list button
      const openListButtons = document.querySelectorAll(".open-list-btn");
      openListButtons.forEach(button => {
        button.addEventListener("click", () => {
          this.openList();
        });
      });

      // delete list button
      const deleteListButtons = document.querySelectorAll(".delete-list-btn");
      deleteListButtons.forEach(button => {
        button.addEventListener("click", () => {
          this.deleteList();
        });
      });

    },

    renderList: function() {
      App.utils.clearTasks();
      this.createList();
    },

    createList: function() {
      const orderedList = document.querySelector("ol");
      orderedList.classList.replace("to-do-list", "view-lists");

      // SVGs
      const openListSVG = App.utils.createSVG(
        "Open List",
        "Button to open the current list",
        "M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z",
        "-2.75 -2.75 30 30"
      );
      const deleteListSVG = App.utils.createSVG(
        "Delete List",
        "Button to delete the current list",
        "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
        "0 0 24 24"
      );

      // Create list item
      const listItem = document.createElement("li");
      listItem.classList.add("list");

      // HTML Structure
      orderedList.appendChild(listItem);

      // h2 and span tag
      const listName = document.createElement("h2");
      listItem.appendChild(listName);

      const spanTag = document.createElement("span");
      spanTag.textContent = "#. "
      listName.appendChild(spanTag);

      listName.appendChild(document.createTextNode(" List Name"));

      // buttons
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons");

      listItem.appendChild(buttonsDiv);

      // open list button
      const openListButton = document.createElement("button");
      openListButton.classList.add("open-list-btn");

      buttonsDiv.appendChild(openListButton);
      openListButton.appendChild(openListSVG);

      // delete list button
      const deleteListButton = document.createElement("button");
      deleteListButton.classList.add("delete-list-btn");

      buttonsDiv.appendChild(deleteListButton);
      deleteListButton.appendChild(deleteListSVG);
    },

    renderListsPage: function() {
    // update header
    document.querySelector("header h1").textContent = "View Lists";
    document.querySelector("header p").textContent = `4/5 Lists Created`;

    // switch to add-list-btn
    const addTaskButton = document.querySelector(".add-task-btn");
    addTaskButton.classList.replace("add-task-btn", "add-list-btn");

    // remove menu btn and dropdown
    const navBar = document.querySelector(".navbar");
    const menuButton = document.querySelector(".ellipsis-icon");
    navBar.removeChild(menuButton);

    const dropdownMenu = document.querySelector(".dropdown-menu");
    dropdownMenu.style.display = "none";

    this.renderList();
    }
  },
  toDoApp: {
    addTask: function(listId, taskName, taskTime) {
      const lists = App.listManagement.loadData();

      const list = lists.find(list => list.listId === listId);

      if (list) {
        const newTask = {
          taskId: Date.now(),
          taskName,
          taskTime,
          completed: false
        };

        lists.tasks.push(newTask);
        App.listManagement.saveData(lists);
        this.createTask(title, time);
      }

    },

    validateAddTaskForm: function() {
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

      const addTaskPopup = document.querySelector(".add-task-form");

      if (isValid) {
        this.createTask(title, time);
        addTaskPopup.style.display = "none";
        addTaskPopup.reset();
      }
    },

    createTask: function(title, time) {
      const toDoList = document.querySelector("ol");
      toDoList.classList.add("to-do-list");

      // Create li
      const listItem = document.createElement("li");
      listItem.classList.add("task");

      // SVGs
      const checkSVG = App.utils.createSVG(
        "Mark Task as Complete",
        "Button to check off your task as complete. The icon changes to indicate completion.",
        "M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z",
        "-1 0 26 20"
      );
      const pencilSVG = App.utils.createSVG(
        "Edit Task",
        "Button to edit your current task",
        "M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z",
        "-2.65 -2.65 29 29"
      );
      const xSVG = App.utils.createSVG(
        "Delete Task",
        "Button to delete your current task",
        "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
        "0 0 24 24"
      );

      // HTML Structure
      toDoList.appendChild(listItem);

      // check-mark-div
      const checkMarkDiv = document.createElement("div");
      listItem.appendChild(checkMarkDiv);
      checkMarkDiv.classList.add("check-mark-div");

      // check-mark-btn
      const checkMarkButton = document.createElement("button");
      checkMarkDiv.appendChild(checkMarkButton);
      checkMarkButton.classList.add("check-mark-btn");
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
    },

    toggleTaskCompletion: function() {

    },

    editTask: function() {

    },

    editCurrentList: function(title, date) {
      const listTitle = document.querySelector("header h1");
      listTitle.textContent = `${title}`;

      const listDate = document.querySelector("header p");
      listDate.textContent = `${date}`;
    },

    validateEditCurrentListForm: function() {
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

      const date = document.getElementById("editListDate").value.trim();
      const datePattern = /^((0?[1-9]|1[0-2])\/(0?[1-9]|[12][0-9]|3[01])\/(\d{2}|\d{4})|([A-Za-z]+) (0?[1-9]|[12][0-9]|3[01]), (\d{4}))$/;
      const dateError = document.getElementById("editListDateError");
      if (date === "") {
        dateError.textContent = "Please give your list a date";
        dateError.style.display = "block";
        isValid = false;
      } else if (!datePattern.test(date)) {
        dateError.textContent = "Add a valid date in the format of 1/1/24 or January 1, 2024";
        dateError.style.display = "block";
        isValid = false;
      }

      const editCurrentListPopup = document.querySelector(".edit-list-form");
      if (isValid) {
        this.editCurrentList(title, date);
        editCurrentListPopup.style.display = "none";
        editCurrentListPopup.reset();
      }
    },

    deleteTask: function() {

    },

    handleEvents: function() {
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
      const editCurrentListPopup = document.querySelector(".edit-list-form");

      editCurrentListButton.addEventListener("click", () => {
        editCurrentListPopup.style.display = "flex";
      });

      // EDIT CURRENT LIST POPUP CANCEL FORM
      const editListCancelButton = document.getElementById("edit-list-cancel-btn");

      editListCancelButton.addEventListener("click", () => {
        App.utils.clearPreviousFormErrors();
        editCurrentListPopup.reset();
        editCurrentListPopup.style.display = "none";
      });

      // EDIT CURRENT LIST POPUP SUBMIT FORM
      editCurrentListPopup.addEventListener("submit", function(event) {
        event.preventDefault();

        App.utils.clearPreviousFormErrors();
        App.toDoApp.validateEditCurrentListForm();
      });

      // VIEW LISTS
      const viewListsButton = document.querySelector(".view-lists-btn");
      viewListsButton.addEventListener("click", () => {
        App.listManagement.renderListsPage();
      });
    }
  },
  utils: {
    clearPreviousFormErrors: function() {
      const errorMessages = document.querySelectorAll(".error-message");
      errorMessages.forEach(msg => msg.style.display = "none");
    },

    clearTasks: function() {
      const orderedList = document.querySelector("ol");
      const task = document.querySelector(".task");

      orderedList.removeChild(task);
    },

    clearLists: function() {
      const orderedList = document.querySelector("ol");
      const list = document.querySelector(".list");

      orderedList.removeChild(list);
    },

    createSVG: function(title, desc, path, viewBox, width, height, transform) {
      const svgNamespace = "http://www.w3.org/2000/svg";

      const svg = document.createElementNS(svgNamespace, "svg");
      svg.classList.add("icon");
      svg.setAttribute("xmlns", svgNamespace);
      svg.setAttribute("viewBox", viewBox);
      svg.setAttribute("fill", "currentColor");

      if (width) {
        svg.setAttribute("width", width);
      }

      if (height) {
        svg.setAttribute("height", height);
      }

      if (transform) {
        svg.setAttribute("transform", transform);
      }

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
    },

    // Handle add button event and form events
    handleEvents: function() {
      // Add Task Button and Add List Button Click Events
      const addButton = document.querySelector(".plus-icon");

      addButton.addEventListener("click", () => {
        if (addButton.classList.contains("add-task-btn")) {
          document.querySelector(".add-task-form").style.display = "flex";
        }
        else if (addButton.classList.contains("add-list-btn")) {
          document.querySelector(".add-list-form").style.display = "flex";
        }
      });

      // Form Cancel Button Click Event
      const formCancelButton = document.querySelectorAll(".cancel-btn");

      formCancelButton.forEach(cancelButton => {
        cancelButton.addEventListener("click", function() {
          App.utils.clearPreviousFormErrors();

          const form = this.closest("form");

          form.reset();
          form.style.display = "none";
        });
      });

      // Form Submit Button Submit Event
      const addTaskForm = document.querySelector(".add-task-form");
      addTaskForm.addEventListener("submit", function(event) {
        event.preventDefault();
        App.utils.clearPreviousFormErrors();

        App.toDoApp.validateAddTaskForm();
      });

      const addListForm = document.querySelector(".add-list-form");
      addListForm.addEventListener("submit", function(event) {
        event.preventDefault();
        App.utils.clearPreviousFormErrors();

        App.listManagement.validateAddListForm();
      });

      const editListForm = document.querySelector(".edit-list-form");
      editListForm.addEventListener("submit", function(event) {
        event.preventDefault();
        App.utils.clearPreviousFormErrors();

        App.toDoApp.validateEditCurrentListForm();
      });

      // Dark/Light Mode
      const darkLightModeButton = document.querySelector(".dark-light-mode");
      darkLightModeButton.addEventListener("click", function() {
        App.utils.displayDarkOrLightMode();
      });
    },

    displayDarkOrLightMode: function() {
      const darkLightModeButton = document.querySelector(".dark-light-mode");
      const icon = darkLightModeButton.querySelector(".icon");
      if (darkLightModeButton.classList.contains("moon-icon")) {
        const newIcon = this.createSVG(
          "Toggle Light Mode",
          "Button to toggle on light mode for the website.",
          "M12 18C8.68629 18 6 15.3137 6 12C6 8.68629 8.68629 6 12 6C15.3137 6 18 8.68629 18 12C18 15.3137 15.3137 18 12 18ZM11 1H13V4H11V1ZM11 20H13V23H11V20ZM3.51472 4.92893L4.92893 3.51472L7.05025 5.63604L5.63604 7.05025L3.51472 4.92893ZM16.9497 18.364L18.364 16.9497L20.4853 19.0711L19.0711 20.4853L16.9497 18.364ZM19.0711 3.51472L20.4853 4.92893L18.364 7.05025L16.9497 5.63604L19.0711 3.51472ZM5.63604 16.9497L7.05025 18.364L4.92893 20.4853L3.51472 19.0711L5.63604 16.9497ZM23 11V13H20V11H23ZM4 11V13H1V11H4Z",
          "0 0 24 24",
          "40",
          "40"
        );
        icon.remove();
        darkLightModeButton.appendChild(newIcon);
        darkLightModeButton.classList.replace("moon-icon", "sun-icon");
        document.body.classList.toggle("dark-mode");
      }
      else if (darkLightModeButton.classList.contains("sun-icon")) {
        const newIcon = this.createSVG(
          "Toggle Dark Mode",
          "Button to toggle on dark mode for the website.",
          "M11.3807 2.01886C9.91573 3.38768 9 5.3369 9 7.49999C9 11.6421 12.3579 15 16.5 15C18.6631 15 20.6123 14.0843 21.9811 12.6193C21.6613 17.8537 17.3149 22 12 22C6.47715 22 2 17.5228 2 12C2 6.68514 6.14629 2.33869 11.3807 2.01886Z",
          "0.3 0.3 22.83 22.83",
          "40",
          "40",
          "rotate(15)"
        );
        icon.remove();
        darkLightModeButton.appendChild(newIcon);
        darkLightModeButton.classList.replace("sun-icon", "moon-icon");
        document.body.classList.toggle("dark-mode");
      }
    }
  },
  init: function() {
    App.utils.handleEvents();
    App.toDoApp.handleEvents();
    App.listManagement.handleEvents();
  }
};

App.init();