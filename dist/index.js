"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.IDL = exports.db = void 0;
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const helius_route_1 = __importDefault(require("./src/routes/helius.route"));
const app_1 = require("firebase-admin/app");
const firestore_1 = require("firebase-admin/firestore");
const body_parser_1 = __importDefault(require("body-parser"));
const serviceAccount = {
    type: 'service_account',
    project_id: 'bonkplace',
    private_key_id: 'e048547f884d413525b1900616f2ff5426ed070a',
    private_key: '-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCz+NjPc0gpSRi1\nPoJPeanUhI5/d0ShRCbkDXno7hnaEudKQqRmee6N7FNu0ERcPXxEW1v2ReSdd0QT\n4OSEA8JTWgZ01gERYEXKSXGEFWFEV6mleWj0qI1EQVgPjkpN+w02HDh38mp/SpjL\nYt6eAgOhZ+ZI+7UJqpMQp/l4lRYlN38Njro+B3b6uOFzw3eo8uLyR9S2TKLqTt7u\n4VLBvVgpTbBepbivyatkQLgvWRidUTN9oY9Mbl/5JtikJyQjbEfj7m9YpU8NB3yb\n+cc1zBCnmkEyk43uv2lNBXM+z6N/7SQOQJpImYWMGBI7dQLXsU1vvzd6pPgrAX4S\nHSlqWL8PAgMBAAECggEANL74kChJ3GvDdY8p8vAF4bat6tbCQv9t5IW8lpN9+Sd0\nKRQKCcyvqWG7fC1G87/DdWdPNwj5/VqQlcDiSHyvje1DGigEbRrJqYVH4z2+4aBN\npKVGKPpjWL9L91ctGNi84QB5XlIqez8aM/W4qBeQB9SjLf2za+9VpdqNJ5WORX6V\nGRVpqKdHZmYjYCa4s7eDOvFbX2hhn7F7WuAW/S5fA6uWKnx96EhH85/5VAvf05Ad\nCwXgGFKnJAygkx/I6PC8YQrED6kOLRPazEYzD7pte6cDaKLPkfJWnKqtkYUa32Uw\nuS2eS/sHNPLTVne1iwZSSGh/23gULWfWsXEKWQ0zlQKBgQDygF5d2KaabWwMOMaq\nfiTRluMLohcvVyJebbF8asS6vtHPdm34dnc03in6nR6llYo5LyLspQ49d7Shtn3t\nSOT7aLm5SudAxljSvEzx0u3xaOcTi02fgarLPJyyDhjU5/E0S4pOSeBdIU4ksNG4\nmOeLbmrQ1ZoWGMBu/PbNd9+HWwKBgQC9/XAxWGQUXibANUZtjweUUdzoXPobiPMj\nFvZhqxmjr7BYzlNmyCg6zTxAzmwO7ilRZAppm1ZAoZVW1SHoG6k/dnBtK3ggET/Z\nOF3/9sAC0KEvPn9yNhAxFHa4Kh1Ga5LvnaDyDjTLM1YwdUrPpLQVCwP2UM9B/MTc\nBNHclRUpXQKBgQCt3qZKaUUC4kOe+7JNmcYyVBoURDKVacclp0ajazYEoz5xnns4\ns0/DIys8Gh1YIcEKQSasP6fXIJXtgJgHYsVzEOJg3Tizc8NJzWLp3A9okItlsvKD\n1AeuUpYTABKDzI1frm3KtiNdAr0xh2nHDjKuAQwrEYu6HiMTMOKP7UvikwKBgESD\nqvwAlkbKFUtnaviDhgY052dccE2Ru6zB0SQzodFnwD6mWWlNcUSTUtFEH6/ar0fM\nvfyLqjUwkDx6K/oaT5S1T6Hu9SkLT200aKGwCFp7hkUVUryLRpeMe6u6dEg67wg+\nXhYsjVliMAjVo57yFIcqK8meJr/zOcLmchAMK095AoGAIAZKUweejcqYqRlFLX32\noj6Yj4aBYJ+ZlGASt8dZ3QJVv7kJHgZFwlAM40H0dMYM9JvC/ifXxjG6ejadF65T\nt6nud4Mi5UqRdlgAfjZSCa/CRulDuDSyNeuGoXxpDKpY2wz4bRUxHc5fk+Tt9soI\nzrB8lGtCcsIm5sqFewpNguY=\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-iatkw@bonkplace.iam.gserviceaccount.com',
    client_id: '112671408951319012423',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: 'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-iatkw%40bonkplace.iam.gserviceaccount.com',
};
dotenv_1.default.config();
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
});
exports.db = (0, firestore_1.getFirestore)();
const app = (0, express_1.default)();
const port = process.env.PORT;
app.use(body_parser_1.default.json());
app.use('/helius', helius_route_1.default);
app.listen(port, () => {
    console.log(`listening to ${port}`);
});
exports.IDL = {
    version: '0.1.0',
    name: 'bonkplace',
    instructions: [
        {
            name: 'globalStateInit',
            accounts: [
                {
                    name: 'admin',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'globalState',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [],
        },
        {
            name: 'paint',
            accounts: [
                {
                    name: 'user',
                    isMut: true,
                    isSigner: true,
                },
                {
                    name: 'userTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'globalState',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'feeDestinationTokenAccount',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'boardSlice',
                    isMut: true,
                    isSigner: false,
                },
                {
                    name: 'systemProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'tokenProgram',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'rent',
                    isMut: false,
                    isSigner: false,
                },
                {
                    name: 'clock',
                    isMut: false,
                    isSigner: false,
                },
            ],
            args: [
                {
                    name: 'x',
                    type: 'u64',
                },
                {
                    name: 'y',
                    type: 'u64',
                },
                {
                    name: 'xOffset',
                    type: 'u8',
                },
                {
                    name: 'yOffset',
                    type: 'u8',
                },
                {
                    name: 'color',
                    type: {
                        array: ['u8', 3],
                    },
                },
            ],
        },
    ],
    accounts: [
        {
            name: 'boardSlice',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'initialized',
                        type: 'bool',
                    },
                    {
                        name: 'lastPainted',
                        type: 'i64',
                    },
                    {
                        name: 'multiplier',
                        type: 'u8',
                    },
                    {
                        name: 'position',
                        type: {
                            array: ['u64', 2],
                        },
                    },
                    {
                        name: 'spaces',
                        type: {
                            array: [
                                {
                                    array: [
                                        {
                                            array: ['u8', 3],
                                        },
                                        8,
                                    ],
                                },
                                8,
                            ],
                        },
                    },
                ],
            },
        },
        {
            name: 'globalState',
            type: {
                kind: 'struct',
                fields: [
                    {
                        name: 'admin',
                        type: 'publicKey',
                    },
                    {
                        name: 'paintCost',
                        type: 'u64',
                    },
                ],
            },
        },
    ],
    errors: [
        {
            code: 6000,
            name: 'InvalidBounds',
            msg: 'Invalid board bounds',
        },
        {
            code: 6001,
            name: 'InvalidAuthority',
            msg: 'Invalid authority',
        },
        {
            code: 6002,
            name: 'BoardSliceAlreadyInitialized',
            msg: 'Board slice already initialized',
        },
        {
            code: 6003,
            name: 'BoardSliceNotInitialized',
            msg: 'Board slice not initialized',
        },
        {
            code: 6004,
            name: 'InvalidBoardSlice',
            msg: 'Board slice not found',
        },
        {
            code: 6005,
            name: 'InvalidOffset',
            msg: 'Invalid offset',
        },
    ],
};
