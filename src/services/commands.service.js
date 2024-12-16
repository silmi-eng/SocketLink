module.exports = (connection) => {
    const { add, list, remove, find } = require("./users.service")(connection);
    const { send_request } = require("./messages.service")(connection);
    const commands = {
        "/connect": {
            func: (username, to) => add({ to, username }, clear),
            description: "[username] :Connect a user."
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
            func: (uuid, from) => send_request({ from, to: uuid }, find),
            description: "[username] :Send request to someone."
        }
    }

    const clear = ({ to }) => connection.to(to).emit("clear");

    const help = ({ to }) => {
        connection.to(to).emit("system-op", `<span>[/command]</span> <span class="green">[parameter]</span> :description`);

        Object.keys(commands).forEach(command => {
            connection.to(to).emit("system-op", `[${command}] ${commands[command].description}`);
        });
    };

    return { commands, remove };
};