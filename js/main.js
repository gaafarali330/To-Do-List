// to do list App with Local storage

// get HTML elements
let inputField = document.querySelector('.input');
let addTaskButton = document.querySelector('.addTask');
let tasksContainer = document.querySelector('.tasks');

// control buttons
let finishAll = document.getElementById('finishAll');
let deleteAll = document.getElementById('deleteAll');

deleteAll.addEventListener('click', () => {
    deleteAllTasks();
})
finishAll.addEventListener('click', () => {
    finishAllTasks();
    for (let i = 0; i < tasksContainer.children.length; i++) {
        tasksContainer.children[i].classList.add('done');
    }
})

getTasksFromLocalStorage();

// an empty array to add tasks later - at start
let tasks = [];
// check if there are any tasks in LS to add them into tasks array
if (window.localStorage.getItem('tasks')) {
    tasks = JSON.parse(window.localStorage.getItem('tasks'))
}


// update and delete tasks
tasksContainer.addEventListener("click", (e) => {
    // check if we press the delete button
    if (e.target.classList.contains("del")) {
        //  we need to remove the task from local storage
        // we depend on task id to remove the task
        deletSpecificTask(e.target.parentElement.getAttribute("data-id"));
        // then we need to remove element from the page
        e.target.parentElement.remove();
    }
    // check if we press on the task bar
    if (e.target.classList.contains('task')) {
        e.target.classList.toggle('done');
        convertStateToDone(e.target.getAttribute("data-id"))
    }
});

// create function to add new task's title to the tasks array
function addTask(taskTitle) {
    // each task is an object that had the followed attributes
    const task = {
        id: Date.now(),
        title: taskTitle,
        finished: false,
    };
    // add task to the tasks array
    tasks.push(task);
    // show tasks on page
    createElementInPage(tasks);
    // add tasks to local storage
    sendTasksToLocalStorage(tasks);
}


// actions when the user clicks submit button
addTaskButton.onclick = function() {
    // check if the input field has an input or not
    if (inputField.value !== '') {
        // add the task title into the tasks array
        addTask(inputField.value);
        // set the input field to empty value
        inputField.value = ''
    }
}


// we need a function that takes tasks array as an argument 
//then it will create Html element on the page to show the tasks
function createElementInPage(myArrOfTasks) {
    // first step, we need to empty the tasks container
    tasksContainer.innerHTML = '';
    // loop over all tasks, and for each task we create Html element to display task
    myArrOfTasks.forEach(element => {
        // create inner div to put each task in it
        let innerDiv = document.createElement('div');
        innerDiv.className = 'task';
        // 
        if (element.finished) {
            innerDiv.className = 'task done';
        }
        // we know each task has an unique id, lets add that
        innerDiv.setAttribute('data-id', element.id);
        // now lets add the task title (text node)
        innerDiv.appendChild(document.createTextNode(element.title));
        // create span for delete purpose
        let deleteSpan = document.createElement('span');
        deleteSpan.className = 'del';
        deleteSpan.appendChild(document.createTextNode('delete'))
        innerDiv.appendChild(deleteSpan);
        // add inner div (the task) to tasks container
        tasksContainer.appendChild(innerDiv)


    });
}


// create the function that takes all tasks and save them in local storage
function sendTasksToLocalStorage(arrOfTasks) {
    window.localStorage.setItem('tasks', JSON.stringify(tasks));
}

function getTasksFromLocalStorage() {
    let lsData = window.localStorage.getItem('tasks');
    //check if there are any data in LS
    if (lsData) {
        // to JS Object
        let tasks = JSON.parse(lsData);
        // show element here
        createElementInPage(tasks);
    }
}


function deletSpecificTask(taskId) {
    // loop over tasks array 
    // then apply filter to return all task except task that have 
    // the same taskId value
    tasks = tasks.filter((task) => task.id != taskId);
    // now we add the new data to localStorage
    sendTasksToLocalStorage(tasks)

}

function convertStateToDone(taskId) {
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].id == taskId) {
            tasks[i].finished === false ? (tasks[i].finished = true) : (tasks[i].finished = false);
        }
    }
    sendTasksToLocalStorage(tasks)
}

function deleteAllTasks() {
    tasksContainer.innerHTML = 'There are No Tasks';
    window.localStorage.removeItem('tasks');
}


function finishAllTasks() {
    for (let i = 0; i < tasks.length; i++) {
        tasks[i].finished = true;
    }
    sendTasksToLocalStorage(tasks)
}