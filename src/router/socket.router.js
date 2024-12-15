module.exports = (server) => {
    const connection = require("socket.io")(server, { cors: { origin: "*"} });
    const usersConnected = {};
    const commands = {
        "/connect": (username, id) => process({ id, username }),
        "/clear": (id) => clear({ id }),
        "/help": (id) => help({ id }),
        "/request": (to, from) => { send_request({ to, from }) },
        "/list": (id) => list({ to: id })
    };

    const help = ({ id }) => {
        connection.to(id).emit("system-op", "Help commands:<br/>- /help: Request help<br/>- /connect [username]: Connect a user<br/>- /clear: Clear the message window<br/>- /join [id] : Start chatting with someone<br/>- /exit: Leave the conversation")
    };

    const process = ({ id, username }) => {
        const verify = Object.values(usersConnected).some(user => user.username === username);

        if (verify) {
            connection.to(id).emit("error", { code: 1, message :`The username "${username}" is already in use.` })
            return false;
        }

        usersConnected[id] = { username, id };
        clear({ id });
        connection.to(id).emit("system-op", `User ${username} connected successfully`)
        return true;
    };

    const list = ({ to }) => {
        for (const [id, user] of Object.entries(usersConnected)) {
            if (user.id !== to)
                connection.to(to).emit("system-op", `[Live] (${user.username}) ${user.id}`);
        }        
    };

    const send_request = ({ from, to }) => {
        const verify = Object.values(usersConnected).some(user => user.username === to);
        console.log(verify);
        
        console.log(from, to);
        
        const selected = usersConnected[to];

        console.log(selected);
        
        if (selected) {
            connection.to(to).emit("request", { from: usersConnected[from] });
        }
        else
            connection.to(from).emit("error", { code: 2, message :`User not found` });
    };

    connection.on("connection", socket => {
        socket.on("command", command => {
            if (command[0] in commands) {
                if (command.length === 2 ) { commands[command[0]](command[1], socket.id) }
                else if (command.length === 1)
                    commands[command[0]](socket.id)
            }
            else 
                connection.to(socket.id).emit("error", { code: 0, message :`Command not found! `})
        })

        socket.on("disconnect", () => {
            const selected = usersConnected[socket.id];
            if (selected) 
                delete usersConnected[socket.id];
        });
    });

    const clear = ({ id }) => connection.to(id).emit("clear");
};
