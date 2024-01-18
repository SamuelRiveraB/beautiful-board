const addBtns = document.querySelectorAll('.add-btn:not(.solid)');
const saveItemBtns = document.querySelectorAll('.solid');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
// Item Lists
const listColumns = document.querySelectorAll('.drag-item-list');
const backlogList = document.getElementById('backlog-list');
const progressList = document.getElementById('progress-list');
const completeList = document.getElementById('complete-list');
const onHoldList = document.getElementById('on-hold-list');

// Items
let updatedOnLoad = false

// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = []

// Drag Functionality
let draggedItem
let currentColumn


// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem('backlogItems')) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ['Release the course', 'Sit back and relax'];
    progressListArray = ['Work on projects', 'Listen to music'];
    completeListArray = ['Being cool', 'Getting stuff done'];
    onHoldListArray = ['Being uncool'];
  }
}

// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [backlogListArray, progressListArray, completeListArray, onHoldListArray]
  const arrayNames = ['backlog', 'progress', 'complete', 'onHold']
  arrayNames.forEach((aName, i) => {
    localStorage.setItem(`${aName}Items`, JSON.stringify(listArrays[i]))
  })
}

// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // List Item
  const listEl = document.createElement('li');
  listEl.classList.add('drag-item');
  listEl.textContent = item
  listEl.draggable = true
  listEl.setAttribute('ondragstart', 'drag(event)')
  columnEl.appendChild(listEl)
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if(!updatedOnLoad) {
    getSavedColumns()
  }
  // Backlog Column
  backlogList.textContent = ''
  backlogListArray.forEach((item, i) => {
    createItemEl(backlogList, 0, item, i)
  })
  // Progress Column
  progressList.textContent = ''
  progressListArray.forEach((item, i) => {
    createItemEl(progressList, 1, item, i)
  })
  // Complete Column
  completeList.textContent = ''
  completeListArray.forEach((item, i) => {
    createItemEl(completeList, 2, item, i)
  })
  // On Hold Column
  onHoldList.textContent = ''
  onHoldListArray.forEach((item, i) => {
    createItemEl(onHoldList, 3, item, i)
  })
  // Run getSavedColumns only once, Update Local Storage
  updatedOnLoad = true
  updateSavedColumns()
}

function addToColumn(column) {
  const itemText = addItems[column].textContent
  const selectedArray = listArrays[column]
  selectedArray.push(itemText)
  addItems[column].textContent = ''
  updateDOM()
}

function showInputBox(column) {
  addBtns[column].style.visibility = 'hidden'
  saveItemBtns[column].style.display = 'flex'
  addItemContainers[column].style.display = 'flex'
}

function hideInputBox(column) {
  addBtns[column].style.visibility = 'visible'
  saveItemBtns[column].style.display = 'none'
  addItemContainers[column].style.display = 'none'
  addToColumn(column)
}

function rebuildArrays() {
  backlogListArray = []
  progressListArray = []
  completeListArray = []
  onHoldListArray = []
  for (let i=0; i<backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent)
  }
  for (let i=0; i<progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent)
  }
  for (let i=0; i<completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent)
  }
  for (let i=0; i<onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent)
  }
  updateDOM()
}

function drag(e) {
  draggedItem = e.target
}

function dragEnter(column) {
  listColumns[column].classList.add('over')
  currentColumn = column
}

function allowDrop(e) {
  e.preventDefault()
}

function drop(e) {
  e.preventDefault()
  listColumns.forEach((col) => {
    col.classList.remove('over')
  })
  const parent = listColumns[currentColumn]
  parent.appendChild(draggedItem)
  rebuildArrays()
}

updateDOM()