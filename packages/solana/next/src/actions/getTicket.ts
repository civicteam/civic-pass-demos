"use server";

import {PublicKey} from "@solana/web3.js";
import {airdropAddress, connection, keypair} from "@/lib/solana";
import {AnchorProvider, Program} from "@coral-xyz/anchor";
import {GatedAirdrop} from "@/types/gated_airdrop";
import GatedAirdropIDL from "@/types/gated_airdrop.json";
import NodeWallet from "@coral-xyz/anchor/dist/esm/nodewallet";

const provider = new AnchorProvider(connection, new NodeWallet(keypair), {});
const program = new Program<GatedAirdrop>(GatedAirdropIDL as GatedAirdrop, provider);

export const getTicket = async (recipient: string) => {
    const airdrop = await program.account.airdrop.fetchNullable(airdropAddress);

    if (!airdrop) return undefined;

    const [ticketAddress] = PublicKey.findProgramAddressSync([
        airdropAddress.toBuffer(),
        new PublicKey(recipient).toBuffer(),
        Buffer.from("ticket")
    ], program.programId);
    const ticket = await program.account.ticket.fetchNullable(ticketAddress)

    return ticket ?? null;
}