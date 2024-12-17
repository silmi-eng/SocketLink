// uuid _> who to send the request to
// socket _> who requested the request

module.exports = (connection) => {
    const send_request = ({ uuid, socket, type}, find) => {
        if (!uuid || !socket || !type) {
            console.error("Invalid arguments: uuid, socket, and type are required.");
            return;
        }

        const { to, from } = find({ uuid, socket });

        if (from !== undefined) {
            if (to !== undefined) 
                connection.to(to.socket).emit(type, { to, from, type });
            else
                connection.to(socket).emit("error", { code: 7, message: "The user selected by you doesn't active in this moment" })
        }
        else {
            connection.to(socket).emit("error", { code: 6, message: "You don't have session active refresh the page to active session!" })
        }
    };
    
    const handleRequest = ({ to, from, type, status }) => {
        if (status) {
            connection.to(from.socket).emit("request-success", { to, type });
        }
        else {
            connection.to(from.socket).emit("error", { code: 5, message : `The requested user did not accept the request.` });
        }
        
    };

    return { send_request, handleRequest };
};