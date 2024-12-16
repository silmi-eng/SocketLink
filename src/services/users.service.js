const { v4: uuidv4 } = require('uuid');

module.exports = (connection) => {
    const usersConnected = {};

    const add = ({ to, username }, clear) => {
        const verify = Object.values(usersConnected).some(user => user.username === username);

        if (verify) {
            connection.to(to).emit("error", { code: 1, message :`The username "${username}" is already in use.` })
            return;
        };

        const uuid = uuidv4();

        usersConnected[uuid] = { uuid, socket: to, username };
        clear({ to });
        connection.to(to).emit("system-op", `User ${username} connected successfully!`);
        return;
    };

    const find = ({ to, from }) => { 
        return {
            to_: Object.values(usersConnected).find(user => user.username === to),
            from_: Object.values(usersConnected).find(user => user.id === from)
        };
    };

    const list = ({ to }) => {
        const copy = { ...usersConnected };
        delete copy[to];
        
        if (Object.keys(copy).length === 0) {
            connection.to(to).emit("system-op", `No users connected.`);
            return;
        } 

        for (const [id, user] of Object.entries(usersConnected)) {
            if (user.id !== to)
                connection.to(to).emit("system-op", `<span class="green-">[Live]</span> (${user.username}) ${user.uuid}`);
        }        
    };

    const remove = ({ to }) => {
        const selected = usersConnected[to];

        if (selected)
            delete usersConnected[to];
    };

    return { add, list, remove, find }
};