const input = document.querySelector("input");
const socket = io();
const user = JSON.parse(localStorage.getItem("uuid"));

if (user !== null) socket.emit("reenter", user);

document.addEventListener("keydown", async (e) => {
  if (e.keyCode === 13 && input.value) {
    e.preventDefault();
    const cmd = input.value.toLocaleLowerCase().split(" ");

    if (cmd[0] === "/exit") {
      socket.emit("exit-chat", { to: uuid });
      window.location.href = `/`;
    }
    else {
      socket.emit("message", {
        to: uuid,
        message: input.value,
      });

      typing(`<span class="green-">[${user.username}]</span> ${input.value}`)
    }

    input.value = "";
  }
});

const typing = (message) => {
  const commandExit = document.createElement("p");
  commandExit.innerHTML = message;
  document.querySelector(".terminal").appendChild(commandExit);
};

socket.on("system-op-message", (message) => typing(message));
socket.on("error", (error) =>  typing(`Error code: ${error.code} <br/> Message: ${error.message}`));
socket.on("exit-session", () => window.location.href = `/`);