"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.heliusController = exports.PROGRAM_ID = exports.getAccountFromInstruction = exports.isCompiledInstruction = void 0;
const __1 = require("../..");
const anchor_1 = require("@project-serum/anchor");
const __2 = require("../..");
const nodewallet_1 = __importDefault(require("@project-serum/anchor/dist/cjs/nodewallet"));
function getAccountKey(idl, accountName, ixName, ix, accountKeys) {
    return getAccountFromInstruction(idl, accountName, accountKeys, ix, ixName);
}
function isCompiledInstruction(i) {
    return (i.programIdIndex !== undefined &&
        typeof i.programIdIndex === 'number' &&
        i.accounts !== undefined &&
        Array.isArray(i.accounts) &&
        i.data !== undefined &&
        typeof i.data === 'string');
}
exports.isCompiledInstruction = isCompiledInstruction;
function getAccountFromInstruction(idl, accountName, txAccounts, ix, ixName) {
    for (let i = 0; i < idl.instructions.length; i++) {
        const idlIx = idl.instructions[i];
        if (idlIx.name === ixName) {
            const accountIndex = [...idlIx.accounts].findIndex((a) => a.name === accountName);
            if (accountIndex >= 0) {
                if (isCompiledInstruction(ix)) {
                    return txAccounts[ix.accounts[accountIndex]];
                }
                else {
                    return txAccounts[ix.accountKeyIndexes[accountIndex]];
                }
            }
        }
    }
    throw new Error(`Account not found ${accountName}`);
}
exports.getAccountFromInstruction = getAccountFromInstruction;
exports.PROGRAM_ID = new anchor_1.web3.PublicKey('PXLs1iJyVtArNYT9C9Bo7LWAT15gEMX3pLrdLpKLyPL');
const heliusController = (request, response) => __awaiter(void 0, void 0, void 0, function* () {
    const coder = new anchor_1.BorshCoder(__2.IDL);
    const connection = new anchor_1.web3.Connection('https://rpc.helius.xyz/?api-key=e5cdd6b8-d0df-4f16-9658-ac464dde9351');
    const program = new anchor_1.Program(__2.IDL, exports.PROGRAM_ID, new anchor_1.AnchorProvider(connection, new nodewallet_1.default(anchor_1.web3.Keypair.generate()), {}));
    const txs = request.body;
    for (const tx of txs) {
        console.log(`Processing tx: ${tx.transaction.signatures[0]}`);
        if (tx.meta && tx.meta.err !== null) {
            continue;
        }
        const accountKeys = tx.transaction.message.accountKeys;
        for (const ix of tx.transaction.message.instructions) {
            const ixProgram = accountKeys[ix.programIdIndex];
            if (ixProgram !== exports.PROGRAM_ID.toString()) {
                continue;
            }
            const accountKey = getAccountKey(__2.IDL, 'boardSlice', 'paint', ix, accountKeys.map((pk) => new anchor_1.web3.PublicKey(pk)));
            const boardSlice = yield program.account.boardSlice.fetch(accountKey);
            console.log(JSON.stringify(boardSlice));
            const x = boardSlice.position[0].toNumber();
            const y = boardSlice.position[1].toNumber();
            const docRef = __1.db.collection(`bonk-space`).doc(`${x}_${y}`);
            yield docRef.set({
                data: JSON.stringify(boardSlice.spaces),
                lastUpdatedSlot: tx.slot,
                lastUpdatedSignature: tx.transaction.signatures[0],
            });
        }
    }
    /*
    for (const instruction of instructions) {
        const data = instruction.data as string
        const ix = coder.instruction.decode(bs58.decode(data))
        const ixData: {
            x: BN
            y: BN
            xOffset: number
            yOffset: number
            color: number[]
        } = ix!.data as {
            x: BN
            y: BN
            xOffset: number
            yOffset: number
            color: number[]
        }
        console.log(ixData)
        const x = ixData.x.toNumber()
        const y = ixData.y.toNumber()
        const xOffset = ixData.xOffset
        const yOffset = ixData.yOffset
        const color = ixData.color
        const docRef = db.collection(`bonk-space`).doc(`${x}_${y}`)
        await db.runTransaction(async (tx) => {
            const bonkSpace = await tx.get(docRef)
        })
        await docRef.set({
            first: 'TJ',
            last: 'Lovelace',
            born: 1815,
        })
    }
    */
    response.send('woop');
});
exports.heliusController = heliusController;
