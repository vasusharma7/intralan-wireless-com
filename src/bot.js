const electron = require("electron");
const { ipcRenderer: ipc } = electron;
var ast = document.getElementById("ast");
var chat = document.getElementById("chat");
var close = document.getElementById("close");
var min = document.getElementById("min");
var text = document.getElementById("text");

ast.addEventListener("click", (_) => {
  if (ast.classList.contains("active")) {
    ast.classList.remove("active");
    chat.classList.add("active");
  } else {
    ast.classList.add("active");
    chat.classList.remove("active");
  }
  ipc.send("startAsst");
});
chat.addEventListener("click", (_) => {
  if (chat.classList.contains("active")) {
    chat.classList.remove("active");
    ast.classList.add("active");
  } else {
    chat.classList.add("active");
    ast.classList.remove("active");
  }
  ipc.send("startChat");
});

close.addEventListener("click", (_) => {
  alert("Sad to See you go ! Come back again !");
  ipc.send("close");
});
min.addEventListener("click", (_) => {
  ipc.send("min");
});
ipc.on("displayResponse", (evt, response) => {
  console.log(response);
  document.getElementById("reply").innerText = response[3];
});
