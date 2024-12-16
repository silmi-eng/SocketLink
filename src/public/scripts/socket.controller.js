const socket = io();
const user = JSON.parse(localStorage.getItem("uuid"));

if (user !== null) 
    socket.emit("reenter", user);

const sendCommand = (command) => socket.emit('command', command);

socket.on("error", (error) =>  typing(`Error code: ${error.code} <br/> Message: ${error.message}`));

socket.on("system-op", (message) => typing(message));

socket.on("save-connection", (connection) => localStorage.setItem("uuid", JSON.stringify(connection)));

socket.on("clear", () => {
    const prompt = document.querySelector(".terminal");
    const lines = prompt.querySelectorAll("p");
    lines.forEach(line => line.remove());
});

socket.on("request", (dta) => {
    const accept = confirm(`Aceitar pedido de ${dta.to_.username}?`);
    if (accept) {
        socket.emit('response_request', { to: dta.to_.uuid, from: user.uuid, status: 'success' });
        window.location.href = `/${dta.to_.uuid}`;
    }
    else {
        socket.emit('response_request', { to: dta.to_.uuid, status: 'failure' });
    }
});

socket.on("request-success", (dta) => window.location.href = `/${dta.to}`);