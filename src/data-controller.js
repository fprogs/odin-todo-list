/* eslint-disable no-restricted-syntax */
/* eslint-disable import/prefer-default-export */
import { Counter } from "./counter";

function DataController() {
  const projectCount = Counter();
  const taskCount = Counter();
  const checklistItemCount = Counter();
  const projects = [];

  function incrementProjectIndex() {
    return projectCount.increment();
  }

  function incrementTaskIndex() {
    return taskCount.increment();
  }

  function incrementChecklistItemIndex() {
    return checklistItemCount.increment();
  }

  function resetProjectCount() {
    projectCount.reset();
  }

  function resetTaskCount() {
    taskCount.reset();
  }

  function resetChecklistItemIndex() {
    return checklistItemCount.reset();
  }

  function getProject(index) {
    return projects.at(index);
  }

  function getProjects() {
    return projects;
  }

  function getTasks(projectIndex) {
    const project = getProject(projectIndex);
    return project.tasks;
  }

  function getTask(projectIndex, taskIndex) {
    const tasks = getTasks(projectIndex);
    return tasks.at(taskIndex);
  }

  function stringifyData() {
    return JSON.stringify(projects);
  }

  function saveDataToLocalStorage() {
    const dataString = stringifyData();
    localStorage.setItem("todo", dataString);
  }

  function getDataFromLocalStorage() {
    /* 
    const parsedProjects = JSON.parse(localStorage.getItem("todo"));
    projects.splice(0, projects.length);
    for (const project of parsedProjects) {
      projects.push(project);
    }
    return projects; 
    */
    return JSON.parse(localStorage.getItem("todo"));
  }

  function addProject(project) {
    projects.push(project);
  }

  function addTask(projectIndex, task) {
    const tasks = getTasks(projectIndex);
    tasks.push(task);
  }

  function deleteProject(index) {
    projects.splice(index, 1);
  }

  function deleteTask(projectIndex, taskIndex) {
    const tasks = getTasks(projectIndex);
    tasks.splice(taskIndex, 1);
  }

  return {
    incrementProjectIndex,
    incrementTaskIndex,
    incrementChecklistItemIndex,
    resetProjectCount,
    resetTaskCount,
    resetChecklistItemIndex,
    getProject,
    getProjects,
    getTask,
    getTasks,
    stringifyData,
    saveDataToLocalStorage,
    getDataFromLocalStorage,
    addProject,
    addTask,
    deleteProject,
    deleteTask,
  };
}

export { DataController };
