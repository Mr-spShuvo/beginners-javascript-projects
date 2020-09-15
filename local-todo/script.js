const projectContainer = document.querySelector('.project-container');
const projectForm = document.querySelector('.project-form');
const projectInput = document.querySelector('.project-input');
const todoHeaderInfo = document.querySelector('.todo-header__info');
const todoArea = document.querySelector('.todo-area');

/******************
 * Local Storage
 */
const LOCAL_PROJECTS = 'local-todo.projects';
const LOCAL_SELECTED_PROJECT = 'local-todo.selected-project';
const LOCAL_TODOS = 'local-todo.todos';

const getFromLocal = ITEM_KEY => JSON.parse(localStorage.getItem(ITEM_KEY));

const saveToLocal = (ITEM_KEY, item) => {
  localStorage.setItem(ITEM_KEY, JSON.stringify(item));
};

/******************
 * Initial State
 */

let projects = getFromLocal(LOCAL_PROJECTS) || [];
let selectedProjectId = getFromLocal(LOCAL_SELECTED_PROJECT);
const clearElements = element => (element.innerHTML = '');
const getProject = id => projects.find(project => project.id.toString() === id);

const renderProject = () => {
  projects.forEach(project => {
    const element = `
    <li><button class="project ${project.id.toString() === selectedProjectId ? 'project--active' : ''}" 
    data-projectid=${project.id}> ${
      project.id.toString() === selectedProjectId
        ? '<span class="project-delete" onclick="deleteProject()">&#10006;</span>'
        : ''
    } ${project.title} </button></li>`;
    projectContainer.insertAdjacentHTML('afterbegin', element);
  });
};

const render = () => {
  clearElements(projectContainer);
  renderProject();
  const selectedProject = getProject(selectedProjectId);
  if (selectedProject) {
    todoArea.classList.remove('disabled-area');
    todoHeaderInfo.textContent = selectedProject.title;
  } else {
    todoHeaderInfo.textContent = 'Your Project Title';
    todoArea.classList.add('disabled-area');
  }
};
render();

const saveAndRender = (ITEM_KEY, item) => {
  saveToLocal(ITEM_KEY, item);
  render();
};

const createProject = projectTitle => {
  return {
    id: Date.now().toString(),
    title: projectTitle,
    tasks: []
  };
};

const deleteProject = () => {
  projects = projects.filter(project => project.id.toString() !== selectedProjectId);
  saveAndRender(LOCAL_PROJECTS, projects);
};

projectForm.addEventListener('submit', e => {
  e.preventDefault();
  const projectTitle = projectInput.value;
  if (!projectTitle) return;
  const project = createProject(projectTitle);
  projectInput.value = '';
  projectInput.focus();
  projects.push(project);
  saveAndRender(LOCAL_PROJECTS, projects);
});

projectContainer.addEventListener('click', e => {
  if (e.target.tagName.toLowerCase() === 'button') {
    const id = e.target.dataset.projectid;
    selectedProjectId = id;
    saveAndRender(LOCAL_SELECTED_PROJECT, id);
  }
});
