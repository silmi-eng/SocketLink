module.exports = (connection) => {
    const { add, list, remove, find, findUsername, reenter, findUUID } = require("./users.service")(connection);
    const { send_request, response_request, message } = require("./messages.service")(connection);
    const commands = {
        "/connect": {
            func: (username, to) => add({ to, username }, clear),
            description: "[username] :Connect a user."
        },
        "/search": {
            func: (username, to) => findUsername({ to, username }),
            description: "[username] :Search user based on username"
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
        "/request": {
            func: (uuid, to) => send_request({ uuid, to }, find),
            description: "[uuid] :Send request to someone."
        }
    }

    const clear = ({ to }) => connection.to(to).emit("clear");

    const help = ({ to }) => {
        connection.to(to).emit("system-op", `<span>[/command]</span> <span class="green">[parameter]</span> :description`);

        Object.keys(commands).forEach(command => {
            connection.to(to).emit("system-op", `[${command}] ${commands[command].description}`);
        });
    };

    return { commands, remove, response_request, reenter, message, findUUID };
};