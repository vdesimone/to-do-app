# To-Do App

This is a simple, yet powerful to-do list application that allows users to create and manage their tasks efficiently. Users can create up to five distinct lists where they are able to organize their tasks, mark them as completed, and delete or update them as needed.


## Table of Contents

- [Overview](#overview)
  - [About The Project](#about-the-project)
  - [Screenshots](#screenshots)
  - [Links](#links)
- [My Process](#my-process)
  - [Built With](#built-with)
  - [What I Learned](#what-i-learned)
  - [Continued Development](#continued-development)
- [Author](#author)


## Overview

### About The Project

 <strong>Goal:</strong>
- To provide a clean and easy-to-use interface for task management. 

 <strong>Features:</strong>
- __Multiple Lists:__ Create and manage up to five different to-do lists to organize tasks.
- __Task Management:__ Add, update, check off, and remove tasks from your lists.
- __Dark/Light Mode:__ Switch between dark and light themes for a personalized user experience.
- __Responsive Design:__ The app adapts to different screen sizes, making it easy to use on both desktop and mobile devices.

### Screenshots

<p>
  <strong>Laptop View - Light Mode</strong>
  <br />
  <img src="https://github.com/user-attachments/assets/5b475afa-e604-42ef-96b5-10f9089a7643" alt="To-Do App Light Mode Laptop View" />
</p>

<p>
  <strong>Laptop View - Dark Mode</strong>
  <br />
  <img src="https://github.com/user-attachments/assets/6da0e8b1-154c-42d6-b4bc-05a9e6e2b6d6" alt="To-Do App Dark Mode Laptop View" />
</p>

### Links

- __Live Site URL:__ [https://vd-to-do-app.netlify.app](https://vd-to-do-app.netlify.app/)

## My Process

### Built With

* ![Static Badge](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
* ![Static Badge](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
* ![Static Badge](https://img.shields.io/badge/CSS-663399?style=for-the-badge&logo=css&logoColor=white)
* ![Static Badge](https://img.shields.io/badge/Figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white)

### What I Learned

In this project, I learned how to structure and organize my code using a namespace pattern, which greatly improved my code's maintainability and readability. Prior to implementing the namespace, all of my functions were placed in the global scope, which led to unnecessary pollution of the global namespace. This made my code more difficult to manage, and prone to potential conflicts as the project grew.

By creating a global App object to contain all of my project's functionalities (such as `listManagement`, `toDoApp`, and `utils`), I was able to encapsulate related functions and properties into their respective categories. 

For example, the structure looks like this:
```js
window.App = {
  listManagement: {},
  toDoApp: {},
  utils: {},
  initializeApp: function() {}
};
```
This approach laid the foundation for future growth and improvements, as I now have a clear structure to build upon. Moving forward, I plan to further modularize the app by dividing different features into smaller, more focused components.

### Continued Development

As I continue to develop this project and work on future projects, my primary goal is to focus on writing cleaner and more maintainable code. While I have already begun to structure the code using the namespace pattern, I recognize that there are still areas where I can further simplify and modularize my functions. Moving forward, I aim to break down larger, more complex functions into smaller, more focused units that are easier to understand and maintain.

I plan to spend more time improving the overall readability of my code, striving to eliminate redundancy and avoid over-complicating the logic. A key area of focus will be refactoring functions that can potentially be combined or streamlined. Simplifying code not only makes it easier to read and debug, but also ensures that new features can be added without introducing unnecessary complexity.

Additionally, I want to continue exploring ways to increase modularity by separating concerns into even smaller, more reusable components. This will allow for better scalability and adaptability, making future maintenance and additions easier to implement.

By focusing on these principles, I aim to write code that is not only functional, but is also clean, concise, and easy to maintain in the long run.

## Author

- GitHub - [vdesimone](https://github.com/vdesimone)
