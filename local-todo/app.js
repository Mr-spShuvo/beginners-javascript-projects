const todoInput = document.querySelector('.todo-input');
const todoButton = document.querySelector('.todo-button');
const todoList = document.querySelector('.todo-list');
const defaultTodo = document.querySelector('.todo--default');
const broadcastBar = document.querySelector('.broadcast');
const filterOption = document.querySelector('.filter-todos');


function todoElem(title, status) {
    let itemChecked = status === 'completed' ? 'checked-item' : '';
    return (`
        <li class="todo ${itemChecked}">
            <p>${title}</p>
            <div class="todo-action">
                <button class="checked"><img src="images/check.svg"></button>
                <button class="delete"><img src="images/delete.svg"></button>
            </div>
        </li>
    `);
}


todoButton.addEventListener('click', (e) => addTodo(e));

function addTodo(e) {
    e.preventDefault();
    if (todoInput.value == "" || todoInput.value == " ") {
        broadcast('Cannot be Empty!');
    } else {
        let todoText = todoInput.value;
        defaultTodo.style.display = 'none';
        todoList.insertAdjacentHTML(`beforeend`, todoElem(todoText));
        broadcast("Todo Added Successfully!", 'success');
        saveToLocal(todoText);
        todoInput.value = "";
        todoInput.focus();
    }
};


todoList.addEventListener('click', (e) => checkedDeleteTodo(e));

function checkedDeleteTodo(e) {
    let elem = e.target;
    if (elem.classList[0] === 'delete') {
        let parentElem = elem.parentElement.parentElement;
        let todoText = parentElem.children[0].innerText;
        deleteFromLocal(todoText);
        parentElem.classList.add('fall-out');
        parentElem.addEventListener("transitionend", () => {
            parentElem.remove();
            broadcast("Deleted Successfully.");
        });
        if (localTodo.length == 0) {
            defaultTodo.style.display = 'flex';
        }
    } else if (elem.classList[0] === 'checked') {
        elem.parentElement.parentElement.classList.add('checked-item');
        let todoText = elem.parentElement.parentElement.children[0].innerText;
        updateStatusToLocal(todoText);
        broadcast("Task Completed!", 'success');
    } else {
        elem.classList.add('checked-item');
        let todoText = elem.children[0].innerText;
        updateStatusToLocal(todoText);
        broadcast("Task Completed!", 'success');
    }
}


filterOption.addEventListener('click', (e) => filterTodo(e));

function filterTodo(e) {
    const todos = document.querySelectorAll('.todo');
    todos.forEach((todo) => {
        switch (e.target.value) {
            case "completed":
                if (!todo.classList.contains('checked-item'))
                    todo.style.display = 'none';
                break;
            case "uncompleted":
                if (todo.classList.contains('checked-item'))
                    todo.style.display = 'none';
                else todo.style.display = 'flex';
                break;
            default:
                todo.style.display = 'flex';
        }
        if (localTodo.length == 0) {
            defaultTodo.style.display = 'flex';
        } else {
            defaultTodo.style.display = 'none';
        }
    })
}


function broadcast(msg, type) {
    let broadcastMsg = document.querySelector('.broadcast__msg');
    broadcastMsg.innerText = msg;
    if (type === 'success') broadcastBar.style.backgroundColor = 'var(--color-secondary)';
    else broadcastBar.style.backgroundColor = 'var(--color-primary)';
    broadcastBar.classList.add('fade-in');
    broadcastBar.classList.remove('d-none');
    setTimeout(() => {
        broadcastBar.classList.remove('fade-in');
        broadcastBar.classList.add('d-none');
    }, 1500)
}


// Local Storage Functionality
let localTodo;

function checkLocalStorage() {
    if (localStorage.getItem('todos') === null) {
        localTodo = [];
    } else {
        localTodo = JSON.parse(localStorage.getItem('todos'));
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkLocalStorage();
    getFromLocal();
    if (localTodo.length != 0) {
        defaultTodo.style.display = 'none';
    }
});


function saveToLocal(title, status = 'uncompleted') {
    let todoItem = {};
    todoItem.title = title;
    todoItem.status = status;
    localTodo.push(todoItem);
    localStorage.setItem('todos', JSON.stringify(localTodo));
}


function updateStatusToLocal(title) {
    let index = localTodo.findIndex((x) => x.title === title);
    localTodo[index].status = 'completed';
    localStorage.setItem('todos', JSON.stringify(localTodo));
}


function getFromLocal() {
    localTodo.forEach((todo) => {
        todoList.insertAdjacentHTML(`beforeend`, todoElem(todo.title, todo.status));
    });
}


function deleteFromLocal(todo) {
    localTodo.splice(localTodo.indexOf(todo), 1);
    localStorage.setItem('todos', JSON.stringify(localTodo));
}


//Theme Switcher
const switcher = document.querySelector('.switch');
switcher.addEventListener('click', themeSwitcher);

function themeSwitcher() {
    let body = document.querySelector('body');
    body.classList.toggle('dark-theme');
}