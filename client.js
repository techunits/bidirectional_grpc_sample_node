const logger = require("elogger");
const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const faker = require("faker");
const slugify = require("slugify");

const packageDefinition = protoLoader.loadSync("./article.proto", {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});
const articleManagerProto = grpc.loadPackageDefinition(packageDefinition).ArticleManagerPackage;

const endpoint = "localhost:9111";
const serviceStub = new articleManagerProto.ArticleService(endpoint, grpc.credentials.createInsecure());
const serviceCall = serviceStub.createBulkEntries();

serviceCall.on("data", function(response) {
    console.log(response);
});

serviceCall.on('error', function(error) {
    logger.error(error.code, " -> ", error.details);
});

serviceCall.on('status', function(status) {
    logger.debug(status.code, " -> ", status.details);
});

serviceCall.on('end', function() {
    logger.debug(`Closed`);
});

(async () => {
    const idxList = [1,2,3,4,5];
    for await (let i of idxList) {
        logger.debug(`Creating stream #${i}`);
        serviceCall.write({
            title: faker.lorem.sentence(),
            code: slugify(faker.lorem.words(2)),
            description: faker.lorem.paragraph()
        });
    }
    // serviceCall.end();
})();