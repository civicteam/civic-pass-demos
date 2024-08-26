import {JsonRpcProvider, TransactionRequest, Wallet} from 'ethers';

// The Civic Pass Forwarder Contract is an ERC-2771-compliant contract that allows
// transactions signed by Civic to be sent by any wallet, abstracting the gas payer.
const CIVIC_PASS_FORWARDER_CONTRACT = "0x8419F704CD6520E2C3EF477ef9BFA3159Ea1ACA7";

const provider = new JsonRpcProvider(process.env.PRIVATE_RPC);
const wallet = new Wallet(process.env.PAYER_SECRET_KEY ?? "").connect(provider);

/**
 * Ensure the transaction is a call to the civic pass contract
 */
const isValidTransaction = (transactionRequest: TransactionRequest): boolean => transactionRequest.to === CIVIC_PASS_FORWARDER_CONTRACT

export const POST = async (request: Request) => {
    const transactionRequest = await request.json() as TransactionRequest;

    console.log(transactionRequest)

    console.log(wallet.address)
    // get current wallet balance
    const balance = await wallet.provider?.getBalance(wallet.address);
    console.log(wallet.address, "balance:", balance);

    console.log("Gas", {
        maxFee: transactionRequest.maxFeePerGas,
        maxPrioFee: transactionRequest.maxPriorityFeePerGas,
        gasPrice: transactionRequest.gasPrice,
        gasLimit: transactionRequest.gasLimit
    })

    const feeData = await wallet.provider?.getFeeData();
    console.log("feeData", feeData)

    const minGasRequired = BigInt(transactionRequest.gasLimit as string) * BigInt(feeData?.maxFeePerGas ?? 0) + BigInt(transactionRequest.gasLimit as string) * BigInt(feeData?.maxPriorityFeePerGas ?? 0)
    console.log("min gas required:", minGasRequired);
    console.log("current excess gas:", BigInt(balance ?? 0) - minGasRequired)

    // verify the transaction (only sign transactions for programs we trust)
    if (!isValidTransaction(transactionRequest)) return new Response("Invalid transaction", { status: 400 });

    // fail if the fee data is invalid for some reason
    if (!feeData) return new Response("Unable to get fee information", { status: 500 })

    // Sign and send the transaction
    const transactionResponse = await wallet.sendTransaction({
        ...transactionRequest,
        maxFeePerGas: feeData.maxFeePerGas,
        maxPriorityFeePerGas: feeData.maxPriorityFeePerGas
    });

    // Send back the transaction response
    return new Response(JSON.stringify(transactionResponse));
};