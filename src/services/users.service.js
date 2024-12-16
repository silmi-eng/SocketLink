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
        connection.to(to).emit("save-connection", { uuid, username })
        return;
    };

    const reenter = (ctn, to) => {
        usersConnected[ctn.uuid] = { uuid: ctn.uuid, socket: to, username: ctn.username };
        connection.to(to).emit("system-op", `User ${ctn.username} connected successfully!`);
    }

    const findUsername = ({ to, username }) => { 
        const selected = Object.values(usersConnected).find(user => user.username === username);

        if (selected === undefined) {
            connection.to(to).emit("system-op", `This ${username} is not connected to the service.`);
            return;
        };

        connection.to(to).emit("system-op", `<span class="green-">[Live]</span> (${selected.username}) ${selected.uuid}`);
    };

    const findUUID = ({ uuid }) => { return Object.values(usersConnected).find(user => user.uuid === uuid); };

    const find = ({ uuid, to }) => { 
        return {
            uuid_: Object.values(usersConnected).find(user => user.uuid === uuid),
            to_: Object.values(usersConnected).find(user => user.socket === to)
        };
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

    return { add, list, remove, find, findUsername, reenter, findUUID }
};