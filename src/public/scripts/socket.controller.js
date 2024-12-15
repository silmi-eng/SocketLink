const socket = io();

const sendCommand = (command) => socket.emit('command', command);

socket.on("error", (error) =>  typing(`Error code: ${error.code} <br/> Message: ${error.message}`));

socket.on("system-op", (message) => typing(message));

socket.on("clear", () => {
    const prompt = document.querySelector(".terminal");
    const lines = prompt.querySelectorAll("p");
    lines.forEach(line => line.remove());
});

socket.on("request", ({ from }) => {
    const accept = confirm(`Aceitar pedido de ${from.username}?`);
    if (accept) {
        socket.emit('accept_request', { from, to: 'username2' });
    }
    else {

    }
})