const logger = require("elogger");
const uuid = require("uuid");

exports.createBulkEntries = (call) => {
    logger.debug(`gRPC ${call.call.handler.path}`);

    // handle the data stream
    call.on("data", async (payload) => {
        console.log(payload);
        payload.id = uuid.v4();
        payload.created_on = new Date().getTime();
        call.write(payload);
    });

    // if server encouters event request to end the stream
    call.on("end", async (payload) => {
        call.end();
    });
};