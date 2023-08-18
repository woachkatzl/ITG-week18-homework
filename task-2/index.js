//VARIABLES 
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");

const tasksContainer = document.querySelector(".tasks-list");
const clearBtn = document.querySelector("#clear-btn");

let dataToSave = [];

//CLASSES
class taskItem {
    constructor(index, value) {
        this.index = index;
        this.value = value;
        this.checked = false;
    }
}

//FUNCTIONS

//CALLBACK FUNCTIONS
const createTask = (value, index) => {

    const newTaskElement = document.createElement("div");
    newTaskElement.classList.add("form-check", "form-check-reverse", "d-flex", "flex-row-reverse", "align-items-center", "border", "rounded", "mb-2", "py-2");

    const newTaskInput = document.createElement("input");
    newTaskInput.setAttribute("type", "checkbox");
    newTaskInput.setAttribute("id", index); // каждому новому элементу с задачей будет присвоен id с числом на одно больше, чем текущее количество задач в контейнере
    newTaskInput.classList.add("form-check-input", "me-0");

    const newTaskLabel = document.createElement("label");
    newTaskLabel.setAttribute("for", index);
    newTaskLabel.classList.add("form-check-label", "flex-grow-1", "ms-3", "text-start");
    newTaskLabel.textContent = value;

    newTaskElement.append(newTaskInput);
    newTaskElement.append(newTaskLabel);

    return newTaskElement;
};

const createNoTasksMsg = () => {

    const noTasksMsg = document.createElement("p");
    noTasksMsg.classList.add("my-5", "text-center", "fs-4", "text-body-tertiary");
    noTasksMsg.textContent = "Нет задач";

    return noTasksMsg;
};

const removeAllTasks = () => {
    const allTasks = tasksContainer.children; //Получаем коллекцию всех элементов с задачами
    const allTasksArray = Array.from(allTasks); //транформируем их в массив, чтобы применять методы массивов с ожидаемым поведением

    for (let task of allTasksArray) {
        task.remove(); //Удаляем каждый элемент полученного массива
    }
};

const saveData = (index, value) => {
    const taskInfo = new taskItem(index, value);
    dataToSave.push(taskInfo);
    localStorage.setItem("tasks", JSON.stringify(dataToSave));
};

const saveCheckedStatus = (event) => {
    const task = event.target;
    const taskId = task.getAttribute("id");
    const savedTaskInfo = dataToSave.find(task => task.index === taskId);

    if (task.checked) {
        savedTaskInfo.checked = true;
    } else {
        savedTaskInfo.checked = false;
    }

    localStorage.setItem("tasks", JSON.stringify(dataToSave));
};

//PRIMARY FUNCTIONS
const addNewTask = () => {

    const newTask = taskInput.value;
    if (!newTask) {
        alert('Чтобы добавить задачу, введите её в поле ввода.');
        return;
    }

    const noTasksMsg = document.querySelector(".tasks-list p");
    if (noTasksMsg)
        noTasksMsg.remove();

    const newTaskIndex = "task" + (tasksContainer.childElementCount + 1); // Каждому новому элементу с задачей будет присвоен id с числом на одно больше, чем текущее количество задач в контейнере

    const newTaskElement = createTask(newTask, newTaskIndex);
    tasksContainer.append(newTaskElement);

    saveData(newTaskIndex, newTask);
    newTaskElement.addEventListener("change", saveCheckedStatus);

    taskInput.value = null;
    clearBtn.removeAttribute("disabled");
};

const clearTasks = () => {

    removeAllTasks();

    const noTaskMsg = createNoTasksMsg();
    tasksContainer.append(noTaskMsg);

    clearBtn.setAttribute("disabled", "true");

    localStorage.removeItem("tasks");
    dataToSave = [];
};

const restoreSession = () => {

    const storedData = localStorage.getItem("tasks");

    if (!storedData) {
        const noTaskMsg = createNoTasksMsg();
        tasksContainer.append(noTaskMsg);

        clearBtn.setAttribute("disabled", "true");
    } else {
        dataToSave = JSON.parse(storedData);

        for (let task of dataToSave) {
            const newTaskElement = createTask(task.value, task.index);
            tasksContainer.append(newTaskElement);
            newTaskElement.addEventListener("change", saveCheckedStatus);

            const elementcheckbox = newTaskElement.firstElementChild;
            elementcheckbox.checked = task.checked;
        }

        clearBtn.removeAttribute("disabled");
    }
};

// EVENT LISTENERS
addBtn.addEventListener("click", addNewTask);
clearBtn.addEventListener("click", clearTasks);

window.addEventListener("DOMContentLoaded", restoreSession);