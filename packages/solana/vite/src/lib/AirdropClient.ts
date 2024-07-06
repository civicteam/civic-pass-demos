import { PublicKey, TransactionSignature } from "@solana/web3.js";
import { AnchorProvider, IdlAccounts, Program } from "@coral-xyz/anchor";
import { GatedAirdrop } from "../types/gated_airdrop";
import GatedAirdropIDL from "../types/gated_airdrop.json";
import { getAssociatedTokenAddressSync } from "@solana/spl-token";

const PROGRAM_ID = new PublicKey("air4tyw7S12bvdRtgoLgyQXuBfoLrjBS7Fg4r91zLb1");

export class AirdropClient {
  constructor(
    readonly program: Program<GatedAirdrop>,
    readonly authority: PublicKey,
    readonly airdrop: IdlAccounts<GatedAirdrop>['airdrop'],
    readonly airdropAddress: PublicKey,
    readonly ticket: IdlAccounts<GatedAirdrop>['ticket'] | null,
  ) {
    console.log("Created new client...")
  }

  static async get(provider: AnchorProvider, airdropAddress: PublicKey): Promise<AirdropClient | undefined> {
    const program = new Program<GatedAirdrop>(GatedAirdropIDL as GatedAirdrop, provider);
    const airdrop = await program.account.airdrop.fetchNullable(airdropAddress);

    if (!airdrop) return undefined;

    const [ticketAddress] = PublicKey.findProgramAddressSync([
      airdropAddress.toBuffer(),
      provider.publicKey.toBuffer(),
      Buffer.from("ticket")
    ], PROGRAM_ID);
    const ticket = await program.account.ticket.fetchNullable(ticketAddress)

    return new AirdropClient(program, provider.publicKey, airdrop, airdropAddress, ticket);
  }

  async claim(gatewayToken: PublicKey): Promise<TransactionSignature> {
    if (this.ticket) throw new Error("You already have a ticket");

    return this.program.methods.claim().accounts({
        payer: this.authority,
        airdrop: this.airdropAddress,
        recipient: this.authority,
        gatewayToken
    }).rpc();
  }

  async getBalance(): Promise<number | null> {
    const mint = this.airdrop.mint;
    const accountInfo = await this
      .program
      .provider
      .connection
      .getTokenAccountBalance(
        getAssociatedTokenAddressSync(mint, this.authority)
      );
    return accountInfo.value.uiAmount;
  }
}