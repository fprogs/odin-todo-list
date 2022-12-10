/* eslint-disable radix */
/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import PlusIcon from "./icons/plus.svg";
import DeleteIcon from "./icons/delete.svg";
import EditIcon from "./icons/pencil.svg";
import { DataController } from "./data-controller";

const controller = DataController();

function createHeader(type, text) {
  const header = document.createElement("header");

  const heading = header.appendChild(document.createElement(type));
  heading.textContent = text;

  return header;
}

function isFormVisible() {
  return document.querySelector("form") != null;
}

function closeForm(event) {
  event.target.form.remove();
}

function createFormButtons(formType) {
  const div = document.createElement("div");
  const cancelButton = div.appendChild(document.createElement("button"));
  const addButton = div.appendChild(document.createElement("button"));

  cancelButton.setAttribute("type", "button");
  cancelButton.setAttribute("id", `${formType}-form-cancel`);
  addButton.setAttribute("id", `${formType}-form-add`);

  cancelButton.textContent = "Cancel";
  addButton.textContent = "Add";

  cancelButton.addEventListener("click", closeForm);

  return div;
}

function createNameInput(formType, name) {
  const div = document.createElement("div");
  const label = div.appendChild(document.createElement("label"));
  const input = div.appendChild(document.createElement("input"));

  label.setAttribute("for", `${formType}-name`);
  input.setAttribute("type", "text");
  input.setAttribute("id", `${formType}-name`);
  input.setAttribute("name", "name");
  input.required = true;

  input.classList.add("block");

  label.textContent = "Name";
  if (name != null) {
    input.value = name;
  }

  return div;
}

function createNotesInput(notes) {
  const div = document.createElement("div");
  const label = div.appendChild(document.createElement("label"));
  const textarea = div.appendChild(document.createElement("textarea"));

  label.setAttribute("for", "task-notes");
  textarea.setAttribute("id", "task-notes");
  textarea.setAttribute("rows", "5");
  textarea.setAttribute("name", "notes");

  textarea.classList.add("block");

  label.textContent = "Notes";
  if (notes != null) {
    textarea.value = notes;
  }

  return div;
}

function createTaskFormChecklistItem(value) {
  const div = document.createElement("div");
  const checkbox = div.appendChild(document.createElement("input"));
  const input = div.appendChild(document.createElement("input"));

  checkbox.setAttribute("type", "checkbox");
  checkbox.disabled = true;
  input.setAttribute("type", "text");

  div.classList.add("item");
  div.classList.add("flex-align-center");
  checkbox.classList.add("checkbox");

  input.value = value;

  return div;
}

function addToChecklistOnEvent(value) {
  const items = document.getElementById("items");

  items.appendChild(createTaskFormChecklistItem(value));
}

function addToChecklistOnClick(event) {
  const input = event.target.nextElementSibling;
  if (!input.value) return;
  addToChecklistOnEvent(input.value);
  input.value = "";
}

function addToChecklistOnKeypress(event) {
  if (event.key === "Enter") {
    event.preventDefault();
    const input = event.target;
    if (!input.value) return;
    addToChecklistOnEvent(input.value);
    input.value = "";
  }
}

function createChecklistInput(checklist) {
  const div = document.createElement("div");
  const heading = div.appendChild(document.createElement("h5"));
  const items = div.appendChild(document.createElement("div"));
  if (checklist != null) {
    for (const subtask of checklist) {
      items.appendChild(createTaskFormChecklistItem(subtask));
    }
  }
  const inputDiv = div.appendChild(document.createElement("div"));
  const button = inputDiv.appendChild(document.createElement("button"));
  const input = inputDiv.appendChild(document.createElement("input"));

  items.setAttribute("id", "items");
  inputDiv.setAttribute("id", "subtask-input-container");
  button.setAttribute("type", "button");
  input.setAttribute("type", "text");
  input.setAttribute("id", "subtask");
  input.setAttribute("placeholder", "checklist item");

  inputDiv.classList.add("flex-align-center");
  button.classList.add("task-form", "button");

  button.style.backgroundImage = `url(${PlusIcon})`;

  heading.textContent = "Checklist";

  button.addEventListener("click", addToChecklistOnClick);
  input.addEventListener("keypress", addToChecklistOnKeypress);

  return div;
}

function createPriorityRadio(priority, isSelected) {
  const div = document.createElement("div");
  const radio = div.appendChild(document.createElement("input"));
  const label = div.appendChild(document.createElement("label"));

  radio.setAttribute("type", "radio");
  radio.setAttribute("id", `${priority}-priority`);
  radio.setAttribute("name", "priority");
  radio.setAttribute("value", priority);
  radio.required = true;
  if (isSelected != null && isSelected) {
    radio.checked = true;
  }
  label.setAttribute("for", `${priority}-priority`);

  radio.classList.add("radio");
  label.classList.add("radio-label");

  label.textContent = priority;

  return div;
}

function createPriorityInputs(selectedPriority) {
  const div = document.createElement("div");
  const heading = div.appendChild(document.createElement("h5"));
  const radios = div.appendChild(document.createElement("div"));
  const priorities = ["low", "medium", "high"];
  for (const priority of priorities) {
    radios.appendChild(
      createPriorityRadio(priority, selectedPriority === priority)
    );
  }

  radios.setAttribute("id", "radio-buttons");

  heading.textContent = "Priority";

  return div;
}

function createItem(name) {
  const item = document.createElement("div");
  const checkbox = item.appendChild(document.createElement("input"));
  const label = item.appendChild(document.createElement("label"));
  const id = controller.incrementChecklistItemIndex();

  checkbox.setAttribute("type", "checkbox");
  checkbox.setAttribute("id", `subtask-${id}`);
  label.setAttribute("for", `subtask-${id}`);

  item.classList.add("flex-align-center");
  checkbox.classList.add("checkbox");

  label.textContent = name;

  return item;
}

function createEditTaskForm(event) {
  if (isFormVisible()) return;
  const formType = "task";
  const taskElement = event.target.parentElement.parentElement.parentElement;
  const taskIndex = parseInt(taskElement.dataset.index);
  const projectIndex = parseInt(taskElement.dataset.project);
  const taskObj = controller.getTask(projectIndex, taskIndex);
  const form = document.createElement("form");
  const header = form.appendChild(createHeader("h3", "Edit Task"));
  header.appendChild(createFormButtons(formType));
  form.appendChild(createNameInput(formType, taskObj.name));
  form.appendChild(createNotesInput(taskObj.notes));
  form.appendChild(createChecklistInput(taskObj.checklist));
  form.appendChild(createPriorityInputs(taskObj.priority));

  form.setAttribute("id", "task-form");

  form.classList.add("center-fixed", "form");
  header.classList.add("form-header");

  // eslint-disable-next-line no-shadow
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const name = formData.get("name");
    const notes = formData.get("notes");
    const checklist = [
      ...document.querySelectorAll(".item > input[type='text']"),
    ].map((input) => input.value);
    const priority = formData.get("priority");
    const cancelButton = document.getElementById("task-form-cancel");
    // eslint-disable-next-line no-use-before-define
    const newTaskElement = createTask(
      projectIndex,
      taskIndex,
      name,
      notes,
      checklist
    );
    const children = [...newTaskElement.childNodes];
    taskElement.innerHTML = "";
    for (const child of children) {
      taskElement.appendChild(child);
    }
    taskObj.name = name;
    taskObj.notes = notes;
    taskObj.checklist = checklist;
    taskObj.priority = priority;
    cancelButton.click();
  });

  document.body.appendChild(form);
}

function deleteTask(event) {
  const task = event.target.parentElement.parentElement.parentElement;
  const projectIndex = parseInt(task.dataset.project);
  const taskIndex = parseInt(task.dataset.index);
  task.remove();
  controller.deleteTask(projectIndex, taskIndex);

  const taskNodeList = document.querySelectorAll("#task-grid > .task");
  controller.resetTaskCount();
  for (const node of taskNodeList) {
    node.dataset.index = controller.incrementTaskIndex();
  }
}

function createTask(projectIndex, taskIndex, name, notes, checklist) {
  const div = document.createElement("div");
  const header = div.appendChild(document.createElement("header"));
  const heading = header.appendChild(document.createElement("h4"));
  const buttons = header.appendChild(document.createElement("div"));
  const editButton = buttons.appendChild(document.createElement("button"));
  const deleteButton = buttons.appendChild(document.createElement("button"));

  if (notes) {
    const taskNotes = div.appendChild(document.createElement("div"));

    taskNotes.textContent = notes;
  }

  if (checklist) {
    const items = div.appendChild(document.createElement("div"));
    for (const subtask of checklist) {
      items.appendChild(createItem(subtask));
    }

    items.classList.add("checklist");
  }

  div.dataset.index = taskIndex;
  div.dataset.project = projectIndex;
  editButton.setAttribute("type", "button");
  deleteButton.setAttribute("type", "button");

  div.classList.add("task");
  header.classList.add("header");
  editButton.classList.add("button");
  deleteButton.classList.add("button");

  editButton.style.backgroundImage = `url(${EditIcon})`;
  deleteButton.style.backgroundImage = `url(${DeleteIcon})`;

  heading.textContent = name;

  editButton.addEventListener("click", createEditTaskForm);
  deleteButton.addEventListener("click", deleteTask);

  return div;
}

function addTask(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get("name");
  const notes = formData.get("notes");
  const checklist = [
    ...document.querySelectorAll(".item > input[type='text']"),
  ].map((input) => input.value);
  const priority = formData.get("priority");
  const taskIndex = controller.incrementTaskIndex();
  const activeProject = document.querySelector(".project.active");
  const projectIndex = parseInt(activeProject.dataset.index);
  const tasks = document.getElementById("task-grid");
  const cancelButton = document.getElementById("task-form-cancel");
  tasks.appendChild(
    createTask(projectIndex, taskIndex, name, notes, checklist)
  );
  controller.addTask(projectIndex, { name, notes, checklist, priority });
  cancelButton.click();
}

function createTaskForm() {
  if (isFormVisible()) return;
  if (document.querySelector(".project.active") == null) return;
  const formType = "task";

  const form = document.createElement("form");
  const header = form.appendChild(createHeader("h3", "Add Task"));
  header.appendChild(createFormButtons(formType));
  form.appendChild(createNameInput(formType));
  form.appendChild(createNotesInput());
  form.appendChild(createChecklistInput());
  form.appendChild(createPriorityInputs());

  form.setAttribute("id", "task-form");

  form.classList.add("center-fixed", "form");
  header.classList.add("form-header");

  form.addEventListener("submit", addTask);

  document.body.appendChild(form);
}

function createEditProjectForm(event) {
  if (isFormVisible()) return;
  const projectElement = event.target.parentElement.parentElement;
  const index = parseInt(projectElement.dataset.index);
  const projectObj = controller.getProject(index);
  const formType = "project";

  const form = document.createElement("form");
  const header = form.appendChild(createHeader("h3", "Edit Project"));
  header.appendChild(createFormButtons(formType));
  form.appendChild(createNameInput(formType, projectObj.name));

  form.setAttribute("id", "project-form");

  form.classList.add("center-fixed", "form");
  header.classList.add("form-header");

  // eslint-disable-next-line no-shadow
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const heading = document.querySelector(
      `.project[data-index="${index}"] > .name`
    );
    const cancelButton = document.getElementById("project-form-cancel");
    const name = formData.get("name");

    heading.textContent = name;
    projectObj.name = name;

    cancelButton.click();
  });

  document.body.appendChild(form);
}

function deleteProject(event) {
  const projectElement = event.target.parentElement.parentElement;
  const index = parseInt(projectElement.dataset.index);
  const grid = document.getElementById("task-grid");
  projectElement.remove();
  controller.deleteProject(index);
  grid.innerHTML = "";

  const projects = [...document.querySelectorAll("#projects > .project")];
  controller.resetProjectCount();
  for (const project of projects) {
    project.dataset.index = controller.incrementProjectIndex();
  }
}

function changeActiveProject(event) {
  const project = event.target.parentElement;
  const projectIndex = parseInt(project.dataset.index);
  const activeProject = document.querySelector(".project.active");
  const taskGrid = document.getElementById("task-grid");
  controller.resetTaskCount();
  if (activeProject != null) {
    taskGrid.innerHTML = "";
    const tasks = controller.getTasks(projectIndex);
    controller.resetChecklistItemIndex();
    for (const task of tasks) {
      const taskIndex = controller.incrementTaskIndex();
      taskGrid.appendChild(
        createTask(
          projectIndex,
          taskIndex,
          task.name,
          task.notes,
          task.checklist
        )
      );
    }
    activeProject.classList.remove("active");
  }
  project.classList.add("active");

  event.stopPropagation();
}

function createProject(index, name) {
  const li = document.createElement("li");
  const heading = li.appendChild(document.createElement("h4"));
  const buttons = li.appendChild(document.createElement("div"));
  const editButton = buttons.appendChild(document.createElement("button"));
  const deleteButton = buttons.appendChild(document.createElement("button"));

  li.dataset.index = index;
  editButton.setAttribute("type", "button");
  deleteButton.setAttribute("type", "button");

  li.classList.add("project", "header");
  heading.classList.add("full-width", "name");
  buttons.classList.add("flex-align-center", "project-button-gap");
  editButton.classList.add("button"); // , "project-button");
  deleteButton.classList.add("button"); // , "project-button");

  editButton.style.backgroundImage = `url(${EditIcon})`;
  deleteButton.style.backgroundImage = `url(${DeleteIcon})`;

  heading.textContent = name;

  heading.addEventListener("click", changeActiveProject);
  editButton.addEventListener("click", createEditProjectForm);
  deleteButton.addEventListener("click", deleteProject);

  return li;
}

function addProject(event) {
  event.preventDefault();
  const form = event.target;
  const formData = new FormData(form);
  const name = formData.get("name");
  const index = controller.incrementProjectIndex();
  const projects = document.getElementById("projects");
  const cancelButton = document.getElementById("project-form-cancel");
  projects.appendChild(createProject(index, name));
  controller.addProject({ name, tasks: [] });
  cancelButton.click();
}

function createProjectForm() {
  if (isFormVisible()) return;
  const formType = "project";

  const form = document.createElement("form");
  const header = form.appendChild(createHeader("h3", "Add Project"));
  header.appendChild(createFormButtons(formType));
  form.appendChild(createNameInput(formType));

  form.setAttribute("id", "project-form");

  form.classList.add("center-fixed", "form");
  header.classList.add("form-header");

  form.addEventListener("submit", addProject);

  document.body.appendChild(form);
}

function createContainer() {
  const container = document.createElement("div");

  container.classList.add("container");

  return container;
}

function createSubHeader(text) {
  const header = createHeader("h2", text);
  const button = header.appendChild(document.createElement("button"));

  button.setAttribute("type", "button");

  button.classList.add("button");

  button.style.backgroundImage = `url(${PlusIcon})`;

  return header;
}

function createSection(text) {
  const section = document.createElement("section");
  const header = section.appendChild(createSubHeader(text));

  header.classList.add("sub-header");

  return section;
}

function createSidebar() {
  const section = createSection("Projects");
  const header = section.firstChild;
  const button = header.lastChild;
  const projects = section.appendChild(document.createElement("ul"));

  section.setAttribute("id", "sidebar");
  button.setAttribute("id", "add-project");
  projects.setAttribute("id", "projects");

  projects.classList.add("remove-list-style");

  button.addEventListener("click", createProjectForm);

  return section;
}

function createTaskSection() {
  const section = createSection("Tasks");
  const header = section.firstChild;
  const button = header.lastChild;

  section.setAttribute("id", "task-section");
  button.setAttribute("id", "add-task");

  button.addEventListener("click", createTaskForm);

  return section;
}

function createHomepage() {
  if (document.body.innerHTML) {
    document.body.innerHTML = "";
  }
  const container = createContainer();
  const header = container.appendChild(createHeader("h1", "Todo List"));
  const content = container.appendChild(document.createElement("div"));
  content.appendChild(createSidebar());
  const taskSection = content.appendChild(createTaskSection());
  const grid = taskSection.appendChild(document.createElement("div"));

  content.setAttribute("id", "content");
  header.setAttribute("id", "title");
  grid.setAttribute("id", "task-grid");

  return container;
}

export { createHomepage };
