import {Connection, Keypair, Transaction} from "@solana/web3.js";

const connection = new Connection(process.env.PRIVATE_RPC ?? "https://api.devnet.solana.com", "processed");
const keypair = Keypair.fromSecretKey(Buffer.from(process.env.PAYER_SECRET_KEY ?? '', 'base64'));

const acceptablePrograms = [
    "gatem74V238djXdzWnJf94Wo1DcnuGkfijbf3AuBhfs", // Gateway program
    "air4tyw7S12bvdRtgoLgyQXuBfoLrjBS7Fg4r91zLb1", // Airdrop program
    "ComputeBudget111111111111111111111111111111" // Compute budget program
]
const isValidTransaction = (transaction: Transaction):boolean =>
    transaction.instructions.every(instruction =>
        acceptablePrograms.includes(instruction.programId.toString())
    )
/**
 * WARNING: This is a simple demo example. Not to be used in production.
 * In general, you should check that you trust the transaction before signing it.
 */
export const POST = async (request: Request) => {
    // parse the request into a transaction
    const {transaction} = await request.json() as { transaction: string };

    const parsedTransaction = Transaction.from(Buffer.from(transaction, 'base64'));
    parsedTransaction.partialSign(keypair);

    // verify the transaction (only sign transactions for programs we trust)
    if (!isValidTransaction(parsedTransaction)) {
        console.log("Invalid transaction - includes instructions for untrusted programs")
        return new Response("Invalid transaction", { status: 400 });
    }

    // sign and send the transaction
    // WARNING - Do NOT sign arbitrary transactions sent from an unsecured client. Your funds may be at risk.
    // This code is for demonstration purposes only
    const signature = await connection.sendRawTransaction(parsedTransaction.serialize(), {
        preflightCommitment: "processed"
    });

    const blockhash = await connection.getLatestBlockhash();
    console.log("Waiting for confirm...", signature)
    await connection.confirmTransaction({ signature, ...blockhash });
    console.log("Confirmed")

    // serialise the transaction and return it
    return new Response(JSON.stringify({ signature }));
}
