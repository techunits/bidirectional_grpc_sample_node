// load required packages
const logger = require("elogger");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const handlerObj = require("./handler");

// load article.proto to load the gRPC data contract
const packageDefinition = protoLoader.loadSync("./article.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const articleManagerProto = grpc.loadPackageDefinition(packageDefinition).ArticleManagerPackage;

// initialize server and register handlers for the respective RPC methods
const server = new grpc.Server();        
server.addService(articleManagerProto.ArticleService.service, {
    createBulkEntries: handlerObj.createBulkEntries,
    streamEntries: handlerObj.streamEntries
});

// bind & start the server process to port: 9111
const bindEndpoint = `0.0.0.0:9111`;
server.bindAsync(bindEndpoint, grpc.ServerCredentials.createInsecure(), (err, response) => {
    if(err) {
        logger.error(err);
    }
    else {
        server.start();
        logger.info(`Article manager gRPC service started on grpc://${bindEndpoint}`);
        
    }
});