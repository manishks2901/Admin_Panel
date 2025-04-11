"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.s3Client = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const spacesEndpoint = new aws_sdk_1.default.Endpoint(process.env.DIGITALOCEAN_SPACES_ENDPOINT || "");
const s3Client = new aws_sdk_1.default.S3({
    endpoint: spacesEndpoint,
    region: "blr1",
    credentials: {
        accessKeyId: process.env.DIGITALOCEAN_SPACES_KEY || "",
        secretAccessKey: process.env.DIGITALOCEAN_SPACES_SECRET || ""
    }
});
exports.s3Client = s3Client;
