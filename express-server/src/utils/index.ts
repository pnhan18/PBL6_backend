import _ from "lodash";
import crypto from "crypto";
import { s3, GetObjectCommand } from "../config/s3.config";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

const getInforData = (data: Object, pick: string[]) => {
    return _.pick(data, pick);
};

const selectData = (fileds: string[]) => {
    return Object.fromEntries(fileds.map((el) => [el, 1]));
};

const unSelectData = (fileds = []) => {
    return Object.fromEntries(fileds.map((el) => [el, 0]));
};

const replacePlaceHolder = (template: string, params: Map<string , string>) => {
    params.forEach((value, key) => {
        let placeHolder = `{{${key}}}`;
        template = template.replace(new RegExp(placeHolder, "g"), value);
    });
    return template;
};

const randomName = () => crypto.randomBytes(16).toString("hex");

const generateSignedUrl = async (fileName: string) => {
    const signedUrl = new GetObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: fileName,
    });
    const url = await getSignedUrl(s3, signedUrl, {
        expiresIn: process.env.AVATAR_EXPIRY ? parseInt(process.env.AVATAR_EXPIRY, 10) : undefined,
    });
    return url;
};

export  {
    getInforData,
    replacePlaceHolder,
    selectData,
    unSelectData,
    randomName,
    generateSignedUrl
};
