const { v4: uuidv4 } = require('uuid');

module.exports = (connection) => {
    const usersConnected = {};

    const add = ({ to, username }, clear) => {
        const uuid = uuidv4();

        usersConnected[uuid] = { uuid, socket: to, username };
        clear({ to });

        connection.to(to).emit("system-op", `User ${username} connected successfully!`);
        connection.to(to).emit("save-connection", { uuid, username });
    };

    const reenter = (ctn, to) => {
        usersConnected[ctn.uuid] = { uuid: ctn.uuid, socket: to, username: ctn.username };
        connection.to(to).emit("system-op", `User ${ctn.username} connected successfully!`);
    }

    const findConnectedUsers = ({ uuid, socket }) => {
        return {
            to: Object.values(usersConnected).find(dta => dta.uuid === uuid),
            from: Object.values(usersConnected).find(dta => dta.socket === socket)
        };
    }

    const verify = ({ uuid, socket }) => {
        const selected = Object.values(usersConnected).find(dta => dta.uuid === uuid);

        if (selected === undefined) {
            connection.to(socket).emit("system-op", `The user you search for is not available.`);
            return;
        }

        connection.to(socket).emit("system-op", `<span class="green-">[Live]</span> (${selected.username}) ${selected.uuid}`);
    };

    const list = ({ to }) => {
        const copy = { ...usersConnected };
        const mine = Object.values(copy).find(dta => dta.socket === to);

        if (mine !== undefined)
            delete copy[mine.uuid];
        
        if (Object.keys(copy).length === 0) {
            connection.to(to).emit("system-op", `No users connected.`);
            return;
        } 

        for (const [id, user] of Object.entries(copy)) {
            connection.to(to).emit("system-op", `<span class="green-">[Live]</span> (${user.username}) ${user.uuid}`);
        }        
    };

    const remove = ({ to }) => {
        const selected = Object.values(usersConnected).find(dta => dta.socket === to);

        if (selected !== undefined)
            delete usersConnected[selected.uuid];
    };

    return { add, list, remove, findConnectedUsers, reenter, verify }
};