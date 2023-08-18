//VARIABLES 
const taskInput = document.querySelector("#task-input");
const addBtn = document.querySelector("#add-btn");

const tasksContainer = document.querySelector(".tasks-list");
const clearBtn = document.querySelector("#clear-btn");

let dataToSave = []; // Массив, в который сохраняются объекты, содержащие информацию о добавленных задачах

//CLASSES
// Класс для создания объектов с информацией
class taskItem {
    constructor(index, value) {
        this.index = index; // зачения с порядковыми числами, с таким же форматом, как id input-элементов: "task1"
        this.value = value; // текстовое значение элемента с задачей
        this.checked = false; // статус чекбокса элемента с задачей
    }
}

//FUNCTIONS

//CALLBACK FUNCTIONS
// функция для создания нового элемента задачи
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

// Функция для создания параграфа с сообщением об отсутсвии задач
const createNoTasksMsg = () => {

    const noTasksMsg = document.createElement("p");
    noTasksMsg.classList.add("my-5", "text-center", "fs-4", "text-body-tertiary");
    noTasksMsg.textContent = "Нет задач";

    return noTasksMsg;
};

// функция для удаления всех элементов задач
const removeAllTasks = () => {
    const allTasks = tasksContainer.children; //Получаем коллекцию всех элементов с задачами
    const allTasksArray = Array.from(allTasks); //транформируем их в массив, чтобы применять методы массивов с ожидаемым поведением

    for (let task of allTasksArray) {
        task.remove(); //Удаляем каждый элемент полученного массива
    }
};

// функция для сохранения информации об элементах с задачами в локальное хранилище. Принимает индекс и значение элемента задачи.
const saveData = (index, value) => {
    const taskInfo = new taskItem(index, value); // создаём объект с информацией
    dataToSave.push(taskInfo); // добавлем его в массив dataToSave
    localStorage.setItem("tasks", JSON.stringify(dataToSave)); // сохраняем массив в хранилище под ключом "tasks"
};

// функция для сохранения информации о статусе чекбоксов задач
const saveCheckedStatus = (event) => {
    const taskElement = event.target; // срабатывает на чекбокс элемент, который кликают
    const taskElementId = taskElement.getAttribute("id"); // определяем id выбранного чекбокса элемента задачи
    const savedTaskInfo = dataToSave.find(task => task.index === taskElementId); // находим объект с его информацией в массиве объектов dataToSave по индексу (id элементов и индексы идентичны)

    // Смотрим какой стал статус и сохраняем значение в выбранный объект
    if (task.checked) {
        savedTaskInfo.checked = true;
    } else {
        savedTaskInfo.checked = false;
    }

    localStorage.setItem("tasks", JSON.stringify(dataToSave)); // перезаписываем массив объектов в хранилище
};

//PRIMARY FUNCTIONS
// функция для создания и добавления элементов задач на страницу
const addNewTask = () => {

    // Проверяем заполненность поля
    const newTask = taskInput.value;
    if (!newTask) {
        alert('Чтобы добавить задачу, введите её в поле ввода.');
        return;
    }

    // проверяем есть ли уже задачи или только сообщение об их отсутствии
    const noTasksMsg = document.querySelector(".tasks-list p");
    if (noTasksMsg)
        noTasksMsg.remove();

    const newTaskIndex = "task" + (tasksContainer.childElementCount + 1); // Каждому новому элементу с задачей будет присвоен id с числом на одно больше, чем текущее количество задач в контейнере

    // создаём и добавляем новый элемент с задачей
    const newTaskElement = createTask(newTask, newTaskIndex);
    tasksContainer.append(newTaskElement);

    // сохраняем информацию о нём в хранилище
    saveData(newTaskIndex, newTask);

    // добаляем новому элементу слушатель события для чекбокса, чтобы определять и сохранять изменения его статуса
    newTaskElement.addEventListener("change", saveCheckedStatus);

    // очищаем поле ввода и активируем кнопку очистки задач
    taskInput.value = null;
    clearBtn.removeAttribute("disabled");
};

// функция для очищения списка задач
const clearTasks = () => {

    //удаляем все задачи
    removeAllTasks();

    // добавляем сообщение об отсутствии задач
    const noTaskMsg = createNoTasksMsg();
    tasksContainer.append(noTaskMsg);

    // деактивируем кнопку очистки задач
    clearBtn.setAttribute("disabled", "true");

    // очищаем хранилище и массив объектов dataToSave
    localStorage.removeItem("tasks");
    dataToSave = [];
};

// функция для восстановления информации о задачах предыдущей локальной сесссии
const restoreSession = () => {

    // находим информацию в хранилище
    const storedData = localStorage.getItem("tasks");

    // проверяем наличие массива объектов с информацией о ранее добавленных задачах. Если его нет, оформляем страницу по умолчанию
    if (!storedData) {
        const noTaskMsg = createNoTasksMsg();
        tasksContainer.append(noTaskMsg);

        clearBtn.setAttribute("disabled", "true");
    }
    // если есть массив, наполяем контейнер задачами на его основе
    else {
        dataToSave = JSON.parse(storedData); //парсим массив объектов в рабочий формат

        for (let task of dataToSave) {
            // добавляем созданные ранее элементы с задачами
            const newTaskElement = createTask(task.value, task.index);
            tasksContainer.append(newTaskElement);

            // добавляем каждому элементу слушатель события об изменеии статуса чекбокса
            newTaskElement.addEventListener("change", saveCheckedStatus);

            // устанавливаем сохраненное значение статуса чекбокса
            const elementCheckbox = newTaskElement.firstElementChild; // находим input-элемент (чекбокс), он всегда первый в элементе-контейнере
            elementCheckbox.checked = task.checked; // устанавливаем статус чекбокса на основе свойства соответствующего сохраненного объекта
        }

        clearBtn.removeAttribute("disabled"); // активируем кнопку очистки задач
    }
};

// EVENT LISTENERS
addBtn.addEventListener("click", addNewTask);
clearBtn.addEventListener("click", clearTasks);

window.addEventListener("DOMContentLoaded", restoreSession);