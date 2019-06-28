let grpc = require("grpc");
var protoLoader = require("@grpc/proto-loader");

const server = new grpc.Server();
const SERVER_ADDRESS = "0.0.0.0:5001";

let proto = grpc.loadPackageDefinition(
    protoLoader.loadSync("protos/chat.proto", {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    })
);

let users = [];

function join(call, callback) {
    users.push(call);
    notifyChat({ user: "Server", text: "New user joined..." });
}

function send(call, callback) {
    notifyChat(call.request);
}

function notifyChat(message) {
    users.forEach(user => {
        user.write(message);
    });
}

server.addService(proto.example.Chat.service, { join: join, send: send });
server.bind(SERVER_ADDRESS, grpc.ServerCredentials.createInsecure());
server.start();