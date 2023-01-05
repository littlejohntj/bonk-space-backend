import { Request, Response } from 'express'
import { db } from '../..'
import {
    web3,
    BorshCoder,
    BN,
    Program,
    AnchorProvider,
    Idl,
} from '@project-serum/anchor'
import { Bonkplace, IDL } from '../..'
import { bs58 } from '@project-serum/anchor/dist/cjs/utils/bytes'
import NodeWallet from '@project-serum/anchor/dist/cjs/nodewallet'

type SubstituteType<T, A, B> = T extends A
    ? B
    : T extends {}
    ? { [K in keyof T]: SubstituteType<T[K], A, B> }
    : T
type PubkeyToStringConverter<T> = SubstituteType<T, web3.PublicKey, string>
type FunctionToNeverConverter<T> = SubstituteType<T, Function, never>

export type TransactionResJson = PubkeyToStringConverter<
    FunctionToNeverConverter<web3.TransactionResponse>
>

function getAccountKey(
    idl: Idl,
    accountName: string,
    ixName: string,
    ix: web3.MessageCompiledInstruction | web3.CompiledInstruction,
    accountKeys: web3.PublicKey[]
) {
    return getAccountFromInstruction(idl, accountName, accountKeys, ix, ixName)
}

export function isCompiledInstruction(i: any): i is web3.CompiledInstruction {
    return (
        i.programIdIndex !== undefined &&
        typeof i.programIdIndex === 'number' &&
        i.accounts !== undefined &&
        Array.isArray(i.accounts) &&
        i.data !== undefined &&
        typeof i.data === 'string'
    )
}

export function getAccountFromInstruction(
    idl: Idl,
    accountName: string,
    txAccounts: web3.PublicKey[],
    ix: web3.CompiledInstruction | web3.MessageCompiledInstruction,
    ixName: string
) {
    for (let i = 0; i < idl.instructions.length; i++) {
        const idlIx = idl.instructions[i]

        if (idlIx.name === ixName) {
            const accountIndex = [...idlIx.accounts].findIndex(
                (a) => a.name === accountName
            )

            if (accountIndex >= 0) {
                if (isCompiledInstruction(ix)) {
                    return txAccounts[ix.accounts[accountIndex]]
                } else {
                    return txAccounts[ix.accountKeyIndexes[accountIndex]]
                }
            }
        }
    }

    throw new Error(`Account not found ${accountName}`)
}

export const PROGRAM_ID = new web3.PublicKey(
    'PXLs1iJyVtArNYT9C9Bo7LWAT15gEMX3pLrdLpKLyPL'
)

export const heliusController = async (
    request: Request,
    response: Response
) => {
    const coder = new BorshCoder(IDL)

    const connection = new web3.Connection(
        'https://rpc.helius.xyz/?api-key=e5cdd6b8-d0df-4f16-9658-ac464dde9351'
    )
    const program = new Program(
        IDL,
        PROGRAM_ID,
        new AnchorProvider(
            connection,
            new NodeWallet(web3.Keypair.generate()),
            {}
        )
    )

    const txs: TransactionResJson[] = request.body

    for (const tx of txs) {
        console.log(`Processing tx: ${tx.transaction.signatures[0]}`)

        if (tx.meta && tx.meta.err !== null) {
            continue
        }

        const accountKeys = tx.transaction.message.accountKeys

        for (const ix of tx.transaction.message.instructions) {
            const ixProgram = accountKeys[ix.programIdIndex]

            if (ixProgram !== PROGRAM_ID.toString()) {
                continue
            }

            const accountKey = getAccountKey(
                IDL,
                'boardSlice',
                'paint',
                ix,
                accountKeys.map((pk) => new web3.PublicKey(pk))
            )

            const boardSlice = await program.account.boardSlice.fetch(
                accountKey
            )

            console.log(JSON.stringify(boardSlice))
            const x = boardSlice.position[0].toNumber()
            const y = boardSlice.position[1].toNumber()
            const docRef = db.collection(`bonk-space`).doc(`${x}_${y}`)
            await docRef.set({
                data: JSON.stringify(boardSlice.spaces),
                lastUpdatedSlot: tx.slot,
                lastUpdatedSignature: tx.transaction.signatures[0],
            })
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

    response.send('woop')
}
