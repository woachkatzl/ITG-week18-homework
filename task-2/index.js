//VARIABLES 
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");

const tasksContainer = document.querySelector(".tasks-list");
const noTasksMsg = document.querySelector(".tasks-list p");
const clearBtn = document.querySelector("#clear-btn");

//FUNCTIONS
const createTask = (value, index) => {

    const newTaskElement = document.createElement("div");
    newTaskElement.classList.add("form-check", "form-check-reverse", "d-flex", "flex-row-reverse", "align-items-center", "border", "rounded", "mb-2", "py-2");

    const newTaskInput = document.createElement("input");
    newTaskInput.setAttribute("type", "checkbox");
    newTaskInput.setAttribute("id", `task${index}`); // каждому новому элементу с задачей будет присвоен id с числом на одно больше, чем текущее количество задач в контейнере
    newTaskInput.classList.add("form-check-input", "me-0");

    const newTaskLabel = document.createElement("label");
    newTaskLabel.setAttribute("for", `task${index}`);
    newTaskLabel.classList.add("form-check-label", "flex-grow-1", "ms-3", "text-start");
    newTaskLabel.textContent = value;

    newTaskElement.append(newTaskInput);
    newTaskElement.append(newTaskLabel);

    return newTaskElement;
};

const addNewTask = () => {

    const newTask = taskInput.value;
    if (!newTask) {
        alert('Чтобы добавить задачу, введите её в поле ввода.');
        return;
    }

    if (noTasksMsg)
        noTasksMsg.remove();

    const newTaskIndex = tasksContainer.childElementCount + 1; // Каждому новому элементу с задачей будет присвоен id с числом на одно больше, чем текущее количество задач в контейнере

    const newTaskElement = createTask(newTask, newTaskIndex);
    tasksContainer.append(newTaskElement);

    taskInput.value = null;
    clearBtn.removeAttribute("disabled");
};

const createNoTasksMsg = () => {

    const noTasksMsg = document.createElement("p");
    noTasksMsg.classList.add("my-5", "text-center", "fs-4", "text-body-tertiary");
    noTasksMsg.textContent = "Нет задач";

    return noTasksMsg;
};

const clearTasks = () => {

    const allTasks = tasksContainer.children; //Получаем коллекцию всех элементов с задачами
    const allTasksArray = Array.from(allTasks); //транформируем их в массив, чтобы применять методы массивов с ожидаемым поведением

    for (let task of allTasksArray) {
        task.remove(); //Удаляем каждый элемент полученного массива
    }

    const noTaskMsg = createNoTasksMsg();
    tasksContainer.append(noTaskMsg);

    clearBtn.setAttribute("disabled", "true");
};

// EVENT LISTENERS
addBtn.addEventListener("click", addNewTask);
clearBtn.addEventListener("click", clearTasks);