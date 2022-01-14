const logger = require("./../../config/logger")
module.exports = {
    serviceError: function (message, service) {
        logger.error(`Received internal service error with ${service} with message ${message}`)
        /* Error Reporting for internal service errors. */
        return {
            "error": `Internal service error: ${service}`,
            "message": message,
            "status": 500
        }
    },

    generalMessage: function (message, service, status) {
        /* Returns a general message with a message and a status*/
        logger.silly(`Received a message request with ${message} and service ${service} with status ${status}`);
        return {
            "message": message,
            "status": status
        }
    },

    objectReturn: function (message, service, status, object) {
        /* For when an object needs to be returned internally*/
        logger.silly(`Received a object return request with ${message} at service ${service} and status ${status} with object ${object}`)
        return {
            "message": message,
            "status": status,
            "object": object
        }
    }
}