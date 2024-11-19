window.App = {
  listManagement: {
    saveData: function(lists, activeListId) {
      try {
        console.log("Saving data: ", lists); // Debug log to check data
        localStorage.setItem("lists", JSON.stringify(lists)); // Save the list to local storage

        const activeList = lists.find(list => list.listId === activeListId);

        if (activeList) {
          localStorage.setItem("lastViewedListId", activeList.listId);
          localStorage.setItem("lastViewedListName", activeList.listName);
          console.log("Last viewed list id saved:", activeList.listId);
        }
        else {
          if (lists.length > 0) {
            const firstList = lists[0];
            localStorage.setItem("lastViewedListId", firstList.listId);
            localStorage.setItem("lastViewedListName", firstList.listName);
            console.warn("Active list not found in the lists array. Defaulting to the first list:", firstList);
          }
        }
      }
      catch (error) {
        console.error("Error saving to localStorage:", error);
      }
    },

    loadData: function() {
      console.log("Loading data...");
      const savedData = localStorage.getItem("lists");
      console.log("Saved Data:", savedData);

      const lastViewedListId = localStorage.getItem("lastViewedListId");
      const lastViewedListName = localStorage.getItem("lastViewedListName");
      console.log("Last viewed list id: ", lastViewedListId);
      console.log("Last viewed list name: ", lastViewedListName);

      // If saved data exists, parse and return it
      if (savedData) {
        const lists = JSON.parse(savedData);

        if (lastViewedListId) {
          const lastList = lists.find(list => list.listId === parseInt(lastViewedListId));
          if (lastList) {
            console.log("Found last viewed list:", lastList);
            return lists;
          }
        }

        if (lastViewedListName) {
          const lastListByName = lists.find(list => list.listName === lastViewedListName);
          if (lastListByName) {
            console.log("Found last viewed list by name:", lastListByName);
            return lists;
          }
        }

        // Fallback if no last viewed list is found
        return lists.length > 0 ? lists : this.getDefaultList();
      }
      else {
        console.log("No saved data found. Returning default list.");
        return this.getDefaultList();
      }
    },

    getDefaultList: function() {
      const defaultList = {
        listId: Date.now(),
        listName: "Sample List",
        listDate: "January 1, 2025",
        tasks: [
          {
            taskId: Date.now() + 1,
            taskName: "Sample Task",
            taskTime: "9:00 am",
            completed: false
          }
        ]
      };
      const lists = [defaultList];
      this.saveData(lists, defaultList.listId); // Save the default list
      console.log("Default List Saved:", lists); // Debugging line
      return lists;
    },

    addList: function(listName, listDate) {
      const lists = this.loadData();

      if (lists.length >= 5) {
        return alert("You have reached the maximum amount of lists. Delete one to create a new one.");
      }

      // Capitalize the first letter of each word in the listName
      listName = listName
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

      const newList = {
        listId: Date.now(),
        listName,
        listDate,
        tasks: []
      };

      lists.push(newList);
      this.saveData(lists, newList.listId);
      this.displayLists();
    },

    validateAddListForm: function() {
      const lists = this.loadData();

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
      else if (lists.some(list => list.listName === title)) {
        titleError.textContent = "You cannot have two lists with the same name";
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
        App.listManagement.addList(title, date);
        addListPopup.style.display = "none";
        addListPopup.reset();
      }
    },

    displayLists: function() {
      const lists = this.loadData();

      // Update header
      document.querySelector("header p").textContent = `${lists.length}/5 Lists Created`;

      // Clear the currently displayed lists
      App.utils.clearLists();

      lists.forEach((list, index) => {
        this.createList(list, index);
      });

      App.listManagement.handleEvents();
    },

    openList: function(listId) {
      const lists = this.loadData();
      const list = lists.find(l => l.listId === listId);

      if (list) {
        // Update the page to show tasks for this list
        document.querySelector("header h1").textContent = list.listName;
        document.querySelector("header p").textContent = list.listDate;

        // Clear existing tasks and lists
        App.utils.clearTasks();
        App.utils.clearLists();

        // Create dropdown button if it does not exist
        const dropdownButton = document.querySelector(".ellipsis-icon");
        if (!dropdownButton) {
          App.utils.createNavbar();
          App.toDoApp.handleEvents();
        }

        // Render the tasks for this list
        list.tasks.forEach(task => {
          App.toDoApp.createTask(task);
        });
      }
    },

    deleteList: function(listId) {
      const lists = this.loadData();

      if (lists.length === 1) {
        return alert("You cannot have less than 1 list.");
      }

      // Remove the list from the data array
      const updatedLists = lists.filter(list => list.listId !== listId);

      const orderedList = document.querySelector(".view-lists");

      const lastViewedListId = localStorage.getItem("lastViewedListId");

      // Check if the deleted list was the active one
      const activeListWasDeleted = lastViewedListId == listId;

      if (activeListWasDeleted && updatedLists.length > 0) {
        const newActiveList = updatedLists[0];
        localStorage.setItem("lastViewedListId", newActiveList.listId);
        localStorage.setItem("lastViewedListName", newActiveList.listName);
        console.log("Active list was deleted. Defaulting to the first list:", newActiveList);
      }

      // Save the updated list data
      this.saveData(updatedLists, lastViewedListId);

      // Find the delete button for this list and remove the corresponding li element.
      const deleteButtons = document.querySelectorAll(".delete-list-btn");
      deleteButtons.forEach(deleteButton => {
        if (parseInt(deleteButton.dataset.listId) === listId) {
          console.log("Found delete button for listId:", listId);

          const listItem = deleteButton.closest("li");
          console.log("List item to remove:", listItem);

          if (listItem) {
            orderedList.removeChild(listItem);
          }
        }
      });

      this.displayLists();
    },

    handleEvents: function() {
      // open list button
      const openListButtons = document.querySelectorAll(".open-list-btn");
      openListButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          const listId = parseInt(e.target.closest(".list").querySelector(".open-list-btn").dataset.listId);
          this.openList(listId);
        });
      });

      // delete list button
      const deleteListButtons = document.querySelectorAll(".delete-list-btn");
      deleteListButtons.forEach(button => {
        button.addEventListener("click", (e) => {
          const listId = parseInt(e.target.closest(".list").querySelector(".open-list-btn").dataset.listId);
          this.deleteList(listId);
        });
      });
    },

    renderListsPage: function() {
      // Update header
      const lists = this.loadData();
      document.querySelector("header h1").textContent = "View Lists";
      document.querySelector("header p").textContent = `${lists.length}/5 Lists Created`;

      // Switch to add-list-btn
      const addTaskButton = document.querySelector(".add-task-btn");
      addTaskButton.classList.replace("add-task-btn", "add-list-btn");

      const addListButton = document.querySelector(".add-list-btn");
      if (addListButton) {
        const title = addListButton.querySelector("svg title");
        const desc = addListButton.querySelector("svg desc");

        title.textContent = "Add a List";
        desc.textContent = "Button to create a new list."
      }

      // Remove menu btn and dropdown
      const navBar = document.querySelector(".navbar");
      const menuButton = document.querySelector(".ellipsis-icon");
      navBar.removeChild(menuButton);

      const dropdownMenu = document.querySelector(".dropdown-menu");
      dropdownMenu.style.display = "none";

      // Change the class of the ordered list
      const orderedList = document.querySelector("ol");
      orderedList.classList.replace("to-do-list", "view-lists");

      this.renderLists(lists);

      this.handleEvents();
    },

    renderLists: function(lists) {
      App.utils.clearTasks();
      App.utils.clearLists();

      lists.forEach((list, index) => {
        this.createList(list, index);
      });
    },

    createList: function(list, index) {
      // SVGs
      const openListSVG = App.utils.createSVG(
        "Open List",
        "Button to open the current list.",
        "M10 6V8H5V19H16V14H18V20C18 20.5523 17.5523 21 17 21H4C3.44772 21 3 20.5523 3 20V7C3 6.44772 3.44772 6 4 6H10ZM21 3V11H19L18.9999 6.413L11.2071 14.2071L9.79289 12.7929L17.5849 5H13V3H21Z",
        "-2.75 -2.75 30 30"
      );
      const deleteListSVG = App.utils.createSVG(
        "Delete List",
        "Button to delete the current list.",
        "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
        "0 0 24 24"
      );

      // Create list item
      const listItem = document.createElement("li");
      listItem.classList.add("list");

      // HTML Structure for the list
      const orderedList = document.querySelector("ol");
      orderedList.appendChild(listItem);

      // h2 and span tag for list name
      const listName = document.createElement("h2");
      listItem.appendChild(listName);
      const spanTag = document.createElement("span");
      spanTag.textContent = `${index + 1}. `
      listName.appendChild(spanTag);
      listName.appendChild(document.createTextNode(list.listName));

      // buttons
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons");
      listItem.appendChild(buttonsDiv);

      // open list button
      const openListButton = document.createElement("button");
      openListButton.classList.add("open-list-btn");
      openListButton.dataset.listId = list.listId;
      buttonsDiv.appendChild(openListButton);
      openListButton.appendChild(openListSVG);

      // delete list button
      const deleteListButton = document.createElement("button");
      deleteListButton.classList.add("delete-list-btn");
      deleteListButton.dataset.listId = list.listId;
      buttonsDiv.appendChild(deleteListButton);
      deleteListButton.appendChild(deleteListSVG);
    }
  },

  toDoApp: {
    addTask: function(listId, taskName, taskTime) {
      const lists = App.listManagement.loadData();

      const list = lists.find(list => list.listId === listId);

      if (list.length >= 20) {
        alert("You cannot have more than 20 lists.");
      }

      // Capitalize the first letter of the first word in taskName
      taskName = taskName.charAt(0).toUpperCase() + taskName.slice(1);

      if (list) {
        const newTask = {
          taskId: Date.now(),
          taskName,
          taskTime,
          completed: false
        };

        list.tasks.push(newTask);
        App.listManagement.saveData(lists, list.listId);
        this.createTask(newTask);
      }
    },

    validateAddTaskForm: function() {
      let isValid = true;

      const title = document.getElementById("addTaskTitle").value.trim();
      const titleError = document.getElementById("addTaskTitleError");
      const maxLength = 47;

      if (title === "") {
        titleError.textContent = "Please give your task a name";
        titleError.style.display = "block";
        isValid = false;
      }
      else if (title.length > maxLength ) {
        titleError.textContent = "Your task name cannot exceed 47 characters";
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
      }
      else if (!timePattern.test(time)) {
        timeError.textContent = "Add a time with am or pm after it";
        timeError.style.display = "block";
        isValid = false;
      }

      const addTaskPopup = document.querySelector(".add-task-form");

      if (isValid) {
        const savedData = localStorage.getItem("lists");
        if (savedData) {
          const lists = JSON.parse(savedData);
          const lastViewedListId = localStorage.getItem("lastViewedListId");

          if (lastViewedListId) {
            const currentList = lists.find(list => list.listId === parseInt(lastViewedListId));

            if (currentList) {
              App.toDoApp.addTask(currentList.listId, title, time);
              addTaskPopup.style.display = "none";
              addTaskPopup.reset();
            }
          }
        }
      }
    },

    createTask: function(task) {
      const toDoList = document.querySelector("ol");
      toDoList.classList.add("to-do-list");

      // Create li for task
      const listItem = document.createElement("li");
      listItem.classList.add("task");

      // SVGs for task buttons
      const checkSVG = App.utils.createSVG(
        "Mark Task as Complete",
        "Button to check off your task as complete. The icon changes to indicate completion.",
        "M9.9997 15.1709L19.1921 5.97852L20.6063 7.39273L9.9997 17.9993L3.63574 11.6354L5.04996 10.2212L9.9997 15.1709Z",
        "-1 0 26 20"
      );
      const pencilSVG = App.utils.createSVG(
        "Edit Task",
        "Button to edit your current task.",
        "M15.7279 9.57627L14.3137 8.16206L5 17.4758V18.89H6.41421L15.7279 9.57627ZM17.1421 8.16206L18.5563 6.74785L17.1421 5.33363L15.7279 6.74785L17.1421 8.16206ZM7.24264 20.89H3V16.6473L16.435 3.21231C16.8256 2.82179 17.4587 2.82179 17.8492 3.21231L20.6777 6.04074C21.0682 6.43126 21.0682 7.06443 20.6777 7.45495L7.24264 20.89Z",
        "-2.65 -2.65 29 29"
      );
      const deleteSVG = App.utils.createSVG(
        "Delete Task",
        "Button to delete your current task.",
        "M11.9997 10.5865L16.9495 5.63672L18.3637 7.05093L13.4139 12.0007L18.3637 16.9504L16.9495 18.3646L11.9997 13.4149L7.04996 18.3646L5.63574 16.9504L10.5855 12.0007L5.63574 7.05093L7.04996 5.63672L11.9997 10.5865Z",
        "0 0 24 24"
      );

      // Add task HTML structure
      const checkMarkDiv = document.createElement("div");
      listItem.appendChild(checkMarkDiv);
      checkMarkDiv.classList.add("check-mark-div");

      const checkMarkButton = document.createElement("button");
      checkMarkDiv.appendChild(checkMarkButton);
      checkMarkButton.classList.add("check-mark-btn");
      checkMarkButton.appendChild(checkSVG);

      // Task info
      const taskInfoDiv = document.createElement("div");
      taskInfoDiv.classList.add("task-info");

      const taskInfoSubheading = document.createElement("h2");
      taskInfoSubheading.textContent = task.taskName;

      const taskInfoParagraph = document.createElement("p");
      taskInfoParagraph.textContent = `at ${task.taskTime}`;

      listItem.appendChild(taskInfoDiv);
      taskInfoDiv.appendChild(taskInfoSubheading);
      taskInfoDiv.appendChild(taskInfoParagraph);

      // buttons
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("buttons");

      const editButton = document.createElement("button");
      const deleteButton = document.createElement("button");

      listItem.appendChild(buttonsDiv);

      buttonsDiv.appendChild(editButton);
      editButton.appendChild(pencilSVG);

      buttonsDiv.appendChild(deleteButton);
      deleteButton.appendChild(deleteSVG);

      toDoList.appendChild(listItem);
    },

    toggleTaskCompletion: function() {

    },

    editTask: function() {

    },

    editCurrentList: function(listId, title, date) {
      const lists = App.listManagement.loadData();
      const list = lists.find(list => list.listId === listId);

      if (list) {
        // Capitalize the first letter of each word in the title
        title = title
        .split(" ")
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ");

        list.listName = title;
        list.listDate = date;

        // Save all lists, with the updated list
        App.listManagement.saveData(lists, list.listId);

        const listTitle = document.querySelector("header h1");
        listTitle.textContent = `${title}`;

        const listDate = document.querySelector("header p");
        listDate.textContent = `${date}`;
      }
      else {
        console.error("List not found for the provided listId", listId);
      }
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
      }
      else if (title.length > maxLength ) {
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
      }
      else if (!datePattern.test(date)) {
        dateError.textContent = "Add a valid date in the format of 1/1/24 or January 1, 2024";
        dateError.style.display = "block";
        isValid = false;
      }

      const editCurrentListPopup = document.querySelector(".edit-list-form");
      if (isValid) {
        const listId = localStorage.getItem("lastViewedListId");

        if (listId) {
          this.editCurrentList(parseInt(listId), title, date);
          editCurrentListPopup.style.display = "none";
          editCurrentListPopup.reset();
        }
        else {
          console.error("No lastViewedListId found in localStorage.");
        }
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
      const tasks = document.querySelectorAll(".task");

      tasks.forEach(task => {
        orderedList.removeChild(task);
      });
    },

    clearLists: function() {
      const orderedList = document.querySelector("ol");
      const lists = document.querySelectorAll(".list");

      lists.forEach(list => {
        orderedList.removeChild(list);
      });
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

    createNavbar: function() {
      // Replace add-list-btn to add-task-btn
      const addListButton = document.querySelector(".add-list-btn");
      addListButton.classList.replace("add-list-btn", "add-task-btn");

      const addTaskButton = document.querySelector(".add-task-btn");
      if (addTaskButton) {
        const title = addListButton.querySelector("svg title");
        const desc = addListButton.querySelector("svg desc");

        title.textContent = "Add a Task";
        desc.textContent = "Button to add a new task to your list."
      }

      // Add dropdown menu button
      const navBar = document.querySelector(".navbar");
      const ellipsisButton = document.createElement("button");
      ellipsisButton.classList.add("nav-icon", "ellipsis-icon");

      const ellipsisSVG = App.utils.createSVG(
        "Open Dropdown Menu",
        "Button to open a dropdown menu with two options: Edit Current List and View Lists.",
        "M12 3C10.9 3 10 3.9 10 5C10 6.1 10.9 7 12 7C13.1 7 14 6.1 14 5C14 3.9 13.1 3 12 3ZM12 17C10.9 17 10 17.9 10 19C10 20.1 10.9 21 12 21C13.1 21 14 20.1 14 19C14 17.9 13.1 17 12 17ZM12 10C10.9 10 10 10.9 10 12C10 13.1 10.9 14 12 14C13.1 14 14 13.1 14 12C14 10.9 13.1 10 12 10Z",
        "2 2 20 20",
        "40",
        "40",
        "rotate(90)"
      );

      ellipsisButton.appendChild(ellipsisSVG);
      navBar.appendChild(ellipsisButton);

      // Switch ordered list class to to-do-lists
      const orderedList = document.querySelector("ol");
      orderedList.classList.replace("view-lists", "to-do-list");
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
  initializeApp: function() {
    App.utils.handleEvents();
    App.toDoApp.handleEvents();

    const lists = App.listManagement.loadData();

    const lastViewedListId = localStorage.getItem("lastViewedListId");
    if (lastViewedListId) {
      App.listManagement.openList(parseInt(lastViewedListId));
    }
    else {
      const defaultList = lists[0] || App.listManagement.getDefaultList();
      App.listManagement.openList(defaultList.listId);
    }
  }
};

window.addEventListener("load", function() {
  App.initializeApp();
});