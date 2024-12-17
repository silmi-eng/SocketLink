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

socket.on("request_message", ({ to, from, type }) => {
    const question = confirm(`The user ${to.username} wants to send you a message.`);
    if (to.uuid !== undefined) {
        if (question) {
            socket.emit("response-request", { to, from, type, status: true });
            window.location.href = `/${from.uuid}`;
        } 
        else
            socket.emit("response-request", { to, from, type, status: false });
    }
});

socket.on("request-success", ({ to, type }) => {
    switch (type) {
        case "request_message":
            handleMessageRequest(to);
            break;

        default:
            console.warn(`Unknown request type: ${type}`);
    }
});

const handleMessageRequest = (to) => { window.location.href = `/${to.uuid}` };