module.exports = (connection) => {

    const message = ({ uuid, socket, message }, find) => {
        const { to, from } = find({ uuid, socket });

        if (to !== undefined)
            connection.to(to.socket).emit("system-op-message", `<span>[${from.username}]</span> ${message}`);
        else
            connection.to(from.socket).emit("error", { code: 4, message :`The user is not active in this moment` });
    };

    const exit = ({ uuid, socket }, find) => {
        const { to, from } = find({ uuid, socket });

        if (to !== undefined) {
            connection.to(to.socket).emit("system-op-message", `<span>[${from.username}]</span> Disconnected.`);
            connection.to(to.socket).emit("system-op-message", `You will be removed from the session shortly.`);
            var int = 0;

            const interval = setInterval(() => {
                connection.to(to.socket).emit("system-op-message", `${int}`);
                int++;
            }, 1000);

            setTimeout(() => {
                clearInterval(interval);
                connection.to(to.socket).emit("exit-session");
            }, 5000);
        }
            
    };

    return { message, exit }
};