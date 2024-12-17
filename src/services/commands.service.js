module.exports = (connection) => {
    const { add, reenter, list, findConnectedUsers, remove, verify } = require("./users.service")(connection);
    const { send_request, handleRequest } = require('./request.service')(connection);

    const { message, exit } = require("./messages.service")(connection);

    const commands = {
        "/connect": {
            func: (username, to) => add({ to, username }, clear),
            description: "[username] :Connect a user."
        },
        "/request": {
            func: (uuid, socket) => send_request({ uuid, socket, type:"request_message" }, findConnectedUsers),
            description: "[uuid] :Send request to someone."
        },
        "/ls": {
            func: (to) => list({ to }),
            description: ":List users in live."
        },
        "/clear": {
            func: (to) => clear({ to }),
            description: ":Clear the message window."
        },
        "/help": {
            func: (to) => help({ to }),
            description: ":List users in live."
        },
        "/verify": {
            func: (uuid, socket) => verify({ uuid, socket }),
            description: "[uuid] : Verify if user based on id is online"
        }
    }

    const clear = ({ to }) => connection.to(to).emit("clear");

    const help = ({ to }) => {
        connection.to(to).emit("system-op", `<span>[/command]</span> <span class="green">[parameter]</span> :description`);

        Object.keys(commands).forEach(command => {
            connection.to(to).emit("system-op", `[${command}] ${commands[command].description}`);
        });
    };

    return { commands, remove, reenter, message, handleRequest, findConnectedUsers, exit };
};