const socket = io();

const sendCommand = (command) => socket.emit('command', command);

socket.on("error", (error) =>  typing(`Error code: ${error.code} <br/> Message: ${error.message}`));

socket.on("system-op", (message) => typing(message));

socket.on("clear", () => {
    const prompt = document.querySelector(".terminal");
    const lines = prompt.querySelectorAll("p");
    lines.forEach(line => line.remove());
});

socket.on("request", (from) => {
    console.log(from);
    
    const accept = confirm(`Aceitar pedido de ${from.username}?`);
    if (accept) {
        localStorage.setItem('to', JSON.stringify(from));
        socket.emit('accept_request');
    }
    else {

    }
})