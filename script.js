let addBtn = document.querySelector(".add");
let body = document.querySelector("body");
let gridDiv = document.querySelector(".grid");
let allColorClasses = ["pink", "blue", "green", "black"];

let allFiltersChildren = document.querySelectorAll(".filter div");
for (let i = 0; i < allFiltersChildren.length; i++) {
  console.log(allFiltersChildren[i]);
  allFiltersChildren[i].addEventListener("click", function (e) {
    let filterColor = e.currentTarget.classList[0];
    loadTasks(filterColor);
  });
}

if (localStorage.getItem("allTickets") == undefined) {
  let allTickets = {};
  allTickets = JSON.stringify(allTickets);
  localStorage.setItem("allTickets", allTickets);
}

loadTasks();

addBtn.addEventListener("click", function () {
  let modalCheck = document.querySelector(".modal");
  if (modalCheck != null) {
    return;
  }

  delBtn.classList.remove("delete-selected");
  deleteMode = false;

  let div = document.createElement("div");
  div.classList.add("modal");
  div.innerHTML = `<div class="task-section">
  <div class="task-inner-container" contenteditable="true"></div>
</div>
<div class="modal-priority-section">
  <div class="priority-inner-container">
    <div class="modal-priority pink"></div>
    <div class="modal-priority blue"></div>
    <div class="modal-priority green"></div>
    <div class="modal-priority black selected"></div>
  </div>
</div>`;

  let ticketColor = "black";

  let allModalPriority = div.querySelectorAll(".modal-priority");

  for (let i = 0; i < allModalPriority.length; i++) {
    allModalPriority[i].addEventListener("click", function (e) {
      for (let j = 0; j < allModalPriority.length; j++) {
        allModalPriority[j].classList.remove("selected");
      }

      e.currentTarget.classList.add("selected");
      ticketColor = e.currentTarget.classList[1];
    });
  }

  let taskInnerContainer = div.querySelector(".task-inner-container");

  taskInnerContainer.addEventListener("keypress", function (e) {
    if (e.key == "Enter") {
      createNewTicket(ticketColor, e.currentTarget.innerText);
      div.remove();
    }
  });

  body.append(div);
});

function createNewTicket(color, text) {
  let ticketDiv = document.createElement("div");
  ticketDiv.classList.add("ticket");

  let id = uid();

  // step 1: get data from local storage
  let allTickets = JSON.parse(localStorage.getItem("allTickets"));
  // step 2: update that new data
  let ticketObj = {
    color: color,
    taskValue: text,
  };
  // step 3: save that data again
  allTickets[id] = ticketObj;
  localStorage.setItem("allTickets", JSON.stringify(allTickets));

  ticketDiv.innerHTML = ` <div class="ticket-color ${color}"></div>
  <div class="ticket-id">#${id}</div>
  <div class="actual-task">${text}</div>
</div>`;

  let ticketColor = ticketDiv.querySelector(".ticket-color");
  ticketColor.addEventListener("click", function (e) {
    let currentColor = e.currentTarget.classList[1];
    let idx = -1;
    for (let i = 0; i < allColorClasses.length; i++) {
      if (currentColor == allColorClasses[i]) {
        idx = i;
        break;
      }
    }
    let newColor = allColorClasses[(idx + 1) % 4];
    e.currentTarget.classList.remove(currentColor);
    e.currentTarget.classList.add(newColor);

    // updating this ticket color in local storage
    // step 1: get Data
    allTickets = JSON.parse(localStorage.getItem("allTickets"));
    // step 2: update to new color
    let currTicketObj = allTickets[id];
    currTicketObj.color = newColor;
    // step 3: save it again
    allTickets[id] = currTicketObj;
    localStorage.setItem("allTickets", JSON.stringify(allTickets));
  });

  addDeleteEvent(ticketDiv, id);

  gridDiv.append(ticketDiv);
}

// functionality for delete button
let delBtn = document.querySelector(".delete");

let deleteMode = false;

delBtn.addEventListener("click", function (e) {
  if (e.currentTarget.classList.contains("delete-selected")) {
    e.currentTarget.classList.remove("delete-selected");
    deleteMode = false;
  } else {
    e.currentTarget.classList.add("delete-selected");
    deleteMode = true;
  }
});

function addDeleteEvent(ticketDiv, id) {
  ticketDiv.addEventListener("click", function (e) {
    if (deleteMode == true) {
      let allTickets = JSON.parse(localStorage.getItem("allTickets"));

      delete allTickets[id];

      localStorage.setItem("allTickets", JSON.stringify(allTickets));
      ticketDiv.remove();
    }
  });
}

function loadTasks(filerColor) {
  let ticketOnUi = document.querySelectorAll(".ticket");
  for (let i = 0; i < ticketOnUi.length; i++) {
    ticketOnUi[i].remove();
  }

  // on start (refresh tab/new tab/browser reopen) of the app
  // it will have the data if you dint delete before

  // 1 - fetch all tickets data

  let allTickets = JSON.parse(localStorage.getItem("allTickets"));

  // 2 - create UI for each ticket obj
  for (id in allTickets) {
    let singleTicketObj = allTickets[id];

    // passed color was undefined

    if (filerColor && filerColor != singleTicketObj.color) {
      continue;
    }

    let ticketDiv = document.createElement("div");
    ticketDiv.classList.add("ticket");

    ticketDiv.innerHTML = ` <div class="ticket-color ${singleTicketObj.color}"></div>
    <div class="ticket-id">#${id}</div>
    <div class="actual-task">${singleTicketObj.taskValue}</div>
    </div>`;
    // 3 - attach required listeners
    let ticketColor = ticketDiv.querySelector(".ticket-color");
    ticketColor.addEventListener("click", function (e) {
      let currentColor = e.currentTarget.classList[1];
      let idx = -1;
      for (let i = 0; i < allColorClasses.length; i++) {
        if (currentColor == allColorClasses[i]) {
          idx = i;
          break;
        }
      }
      let newColor = allColorClasses[(idx + 1) % 4];
      e.currentTarget.classList.remove(currentColor);
      e.currentTarget.classList.add(newColor);

      // updating this ticket color in local storage
      // step 1: get Data
      allTickets = JSON.parse(localStorage.getItem("allTickets"));
      // step 2: update to new color
      let currTicketObj = allTickets[id];
      currTicketObj.color = newColor;
      // step 3: save it again
      allTickets[id] = currTicketObj;
      localStorage.setItem("allTickets", JSON.stringify(allTickets));
      addDeleteEvent(ticketDiv, id);
      // 4 - add tickets in the grid section
    });
    gridDiv = document.querySelector(".grid");
    gridDiv.appendChild(ticketDiv);
  }
}
