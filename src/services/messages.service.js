module.exports = (connection) => {
    const send_request = ({ uuid, to }, find) => {
        const { uuid_, to_ } = find({ uuid, to });
        connection.to(uuid_.socket).emit("request", { uuid_, to_ });
    };

    const response_request = ({ status, to, from }, findUUID) => {
        if (status === "success") {
            const to_= findUUID({ uuid: to });
            connection.to(to_.socket).emit("request-success", { to: from })
        }
    };

    const message = ({ to, from, message }, findUUID) => {
        const to_= findUUID({ uuid: to });
        const from_ = findUUID({ uuid: from });

        if (to_ !== undefined) 
            connection.to(to_.socket).emit("system-op-message", `<span>[${from_.username}]</span> ${message}`);
        else
            connection.to(from_.socket).emit("error", { code: 4, message :`The user is not active in this moment` });
    };

    return { send_request, response_request, message }
};