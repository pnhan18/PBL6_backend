import * as grpc from "@grpc/grpc-js";
import * as protoLoader from '@grpc/proto-loader';
import path from 'path';

const PROTO_PATH = path.join(__dirname, '../protos/sign_language.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

const proto = grpc.loadPackageDefinition(packageDefinition);


export const client = new (proto as any).SignLanguageRecognitionService(
    'localhost:50051',
    grpc.credentials.createInsecure()
);

