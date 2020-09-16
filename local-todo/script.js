const projectList = document.querySelector('.project-list');
const projectForm = document.querySelector('.project-form');
const projectInput = document.querySelector('.project-input');
const todoList = document.querySelector('.todo-list');
const todoForm = document.querySelector('.todo-form');
const todoInput = document.querySelector('.todo-input');
const todoHeaderInfo = document.querySelector('.todo-header__info');
const todoArea = document.querySelector('.todo-area');
const todoCounter = document.querySelector('.todo-counter');
const todoFilter = document.querySelector('.filter-todo');
const broadcastBar = document.querySelector('.broadcast');
const appThemeButton = document.querySelector('.app-theme button');

/******************
 * Local Storage
 */
const LOCAL_PROJECTS = 'local-todo.projects';
const LOCAL_SELECTED_PROJECT = 'local-todo.selected-project';
const LOCAL_TODOS = 'local-todo.todos';
const LOCAL_THEME = 'local-todo.app-theme';

const getFromLocal = ITEM_KEY => JSON.parse(localStorage.getItem(ITEM_KEY));
const saveToLocal = (ITEM_KEY, item) => {
  localStorage.setItem(ITEM_KEY, JSON.stringify(item));
};

/******************
 * Broadcast Alert
 */
const broadcast = (msg, type = 'success') => {
  const broadcastMsg = document.querySelector('.broadcast__msg');
  broadcastMsg.innerText = msg;
  if (type === 'success') broadcastBar.style.backgroundColor = 'var(--color-secondary)';
  else broadcastBar.style.backgroundColor = 'var(--color-primary)';
  broadcastBar.classList.add('fade-in');
  broadcastBar.classList.remove('d-none');
  setTimeout(() => {
    broadcastBar.classList.remove('fade-in');
    broadcastBar.classList.add('d-none');
  }, 1500);
};

/*********************
 * Retrieving Data
 */
let projects = getFromLocal(LOCAL_PROJECTS) || [];
let todos = getFromLocal(LOCAL_TODOS) || [];
let selectedProjectId = getFromLocal(LOCAL_SELECTED_PROJECT);
const getProject = id => projects.find(project => project.id.toString() === id);
const getTodos = id => todos.filter(todo => todo.projectId == id);

/*********************
 * Rendering Projects
 */
const renderProject = () => {
  projects.forEach(project => {
    const element = `
    <li><button class="project ${project.id.toString() === selectedProjectId ? 'project--active' : ''}" 
    data-projectid=${project.id}> ${
      project.id.toString() === selectedProjectId
        ? '<span class="project-delete" onclick="deleteProject()">&#10006;</span>'
        : ''
    } ${project.title} </button></li>`;
    projectList.insertAdjacentHTML('afterbegin', element);
  });
};

/*********************
 * Render Task Counter
 */
const renderTaskCounter = (project, isFiltered) => {
  if (isFiltered) return;
  const incompleteTaskCount = getTodos(project.id).filter(todo => !todo.complete).length;
  let remainingTaskText;
  if (!incompleteTaskCount) {
    remainingTaskText = 'No Tasks Remaining!';
  } else {
    let formatString = incompleteTaskCount === 1 ? 'task' : 'tasks';
    remainingTaskText = `${incompleteTaskCount} ${formatString} remaining!`;
  }
  todoCounter.textContent = remainingTaskText;
};

/*********************
 * Rendering Todos
 */
const renderTodo = project => {
  const selectedTodos = getTodos(project.id);
  if (!selectedTodos.length) {
    todoList.innerHTML = '<li class="todo todo--default">No tasks here!</li>';
    return;
  }
  selectedTodos.forEach(todo => {
    const element = `
    <li data-todoid=${todo.id} class="todo${todo.complete ? ' todo--completed' : ''}">
      <p>${todo.title}</p>
      <div class="todo-action">
          <button onclick="completeTodo(this)" class="checked"><img src="images/check.svg"></button>
          <button onclick="deleteTodo(this)" class="delete"><img src="images/delete.svg"></ button>
      </div>
    </li>`;
    todoList.insertAdjacentHTML('afterbegin', element);
  });
};

/*********************
 * Rendering The App
 */
const render = isFiltered => {
  clearElements(projectList);
  if (!projects.length) {
    projectList.innerHTML = `<li><button class="project" disabled>No Project Found!</button></li>`;
  }

  renderProject();
  const selectedProject = getProject(selectedProjectId);
  if (selectedProject) {
    todoArea.classList.remove('disabled-area');
    todoHeaderInfo.textContent = selectedProject.title;
    renderTaskCounter(selectedProject, isFiltered);
    clearElements(todoList);
    renderTodo(selectedProject);
  } else {
    todoHeaderInfo.textContent = 'Your Project Title';
    todoArea.classList.add('disabled-area');
  }
};

/*********************
 * Utilities Functions
 */
const clearElements = element => (element.innerHTML = '');
const saveAndRender = (ITEM_KEY, item) => {
  saveToLocal(ITEM_KEY, item);
  render();
};

/*********************
 * Project Functionality
 */

// => Create Project
const createProject = projectTitle => {
  return {
    id: Date.now().toString(),
    title: projectTitle
  };
};

// => Delete Project
const deleteProject = () => {
  projects = projects.filter(project => project.id.toString() !== selectedProjectId);
  todos = todos.filter(todo => todo.projectId.toString() !== selectedProjectId);
  saveAndRender(LOCAL_PROJECTS, projects);
  clearElements(todoList);
  saveAndRender(LOCAL_TODOS, todos);
  todoList.innerHTML = '<li class="todo todo--default">No tasks here!</li>';
  broadcast('Project has been deleted!', '');
};

// => Selected Project
projectList.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'button') {
    todoFilter.value = 'all';
    todos = getFromLocal(LOCAL_TODOS) || [];
    selectedProjectId = e.target.dataset.projectid;
    saveAndRender(LOCAL_SELECTED_PROJECT, selectedProjectId);
  }
});

// => Handle Project Input Listening
projectForm.addEventListener('submit', e => {
  e.preventDefault();
  const projectTitle = projectInput.value;
  if (!projectTitle) return;
  const project = createProject(projectTitle);
  projectInput.value = '';
  projectInput.focus();
  projects.push(project);
  saveAndRender(LOCAL_PROJECTS, projects);
  broadcast('Project has been created!');
});

/*********************
 * Todo Functionality
 */

// => Create Todo
const createTodo = (title, projectId) => {
  return {
    id: Date.now().toString(),
    projectId,
    title,
    complete: false
  };
};

// => Delete Todo
const deleteTodo = elem => {
  const todoElem = elem.parentElement.parentElement;
  todos = todos.filter(todo => todo.id.toString() !== todoElem.dataset.todoid);
  todoElem.classList.add('fall-out');
  todoElem.addEventListener('transitionend', () => {
    broadcast('Todo has been deleted!', '');
    saveAndRender(LOCAL_TODOS, todos);
  });
};

// => Complete Todo
const completeTodo = elem => {
  const todoId = elem.parentElement.parentElement.dataset.todoid;
  todos = todos.map(todo => {
    if (todo.id.toString() === todoId) todo.complete = true;
    return todo;
  });
  broadcast("You've completed the task!");
  saveAndRender(LOCAL_TODOS, todos);
};

// =>  Filter Todo
const filterTodo = elem => {
  const value = elem.target.value;
  todos = getFromLocal(LOCAL_TODOS) || [];
  if (value === 'all' || value === '') render();
  else if (value === 'completed') todos = todos.filter(todo => todo.complete);
  else todos = todos.filter(todo => !todo.complete);
  render(true);
};
todoFilter.addEventListener('change', filterTodo);

// => Handle Project Input Listening
todoForm.addEventListener('submit', e => {
  e.preventDefault();
  const todoTitle = todoInput.value;
  if (!todoTitle) return;
  const todo = createTodo(todoTitle, selectedProjectId);
  todoFilter.value = 'all';
  todoInput.value = '';
  todoInput.focus();
  todos = getFromLocal(LOCAL_TODOS) || [];
  todos.push(todo);
  broadcast('New todo has been added!');
  saveAndRender(LOCAL_TODOS, todos);
});

/**************************
 * => App Themes Switcher
 **************************/
let appTheme = localStorage.getItem(LOCAL_THEME);

const appThemeSwitcher = (button, appTheme) => {
  if (appTheme === 'light') {
    document.querySelector('body').classList.add('dark-theme');
    button.innerHTML = '&#9728;';
  } else if (appTheme === 'dark') {
    document.querySelector('body').classList.remove('dark-theme');
    button.innerHTML = '&#9770;';
  }
};
appThemeSwitcher(appThemeButton, appTheme);

appThemeButton.addEventListener('click', e => {
  if (appTheme === 'light') {
    appTheme = 'dark';
    appThemeSwitcher(appThemeButton, appTheme);
    localStorage.setItem(LOCAL_THEME, appTheme);
  } else if (appTheme === 'dark' || appTheme === null) {
    appTheme = 'light';
    appThemeSwitcher(appThemeButton, appTheme);
    localStorage.setItem(LOCAL_THEME, appTheme);
  }
});

// => App Initial Renders
render();
