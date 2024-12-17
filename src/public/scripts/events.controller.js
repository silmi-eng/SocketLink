const input = document.querySelector("input");
const error = 'The connection must be established before performing any other operations.';

document.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13 && input.value) {
    e.preventDefault()
    const cmd = input.value.toLocaleLowerCase().split(" ");

    if (cmd[0]?.charAt(0) === "/") sendCommand(cmd);

    input.value = "";
  }
});

const typing = (message) => {
  const commandExit = document.createElement("p");
  commandExit.innerHTML = message;
  document.querySelector(".terminal").appendChild(commandExit);
};