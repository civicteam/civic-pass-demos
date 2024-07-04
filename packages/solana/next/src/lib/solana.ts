import {Connection, Keypair, PublicKey} from "@solana/web3.js";

export const connection = new Connection(process.env.PRIVATE_RPC ?? "https://api.devnet.solana.com", "processed");
export const keypair = Keypair.fromSecretKey(Buffer.from(process.env.PAYER_SECRET_KEY ?? '', 'base64'));
export const airdropAddress = new PublicKey(process.env.NEXT_AIRDROP_ADDRESS ?? '');