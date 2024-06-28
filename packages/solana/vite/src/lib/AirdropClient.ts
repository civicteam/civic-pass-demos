import { Keypair, PublicKey, SystemProgram, TransactionSignature } from "@solana/web3.js";
import { AnchorProvider, IdlAccounts, Program } from "@coral-xyz/anchor";
import { IDL, WorkshopSolanaAirdrop } from "./types/workshop_solana_airdrop";
import BN from "bn.js";
import {
  getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID,
  createInitializeMint2Instruction,
  getMinimumBalanceForRentExemptMint, MINT_SIZE
} from "@solana/spl-token";

const PROGRAM_ID = new PublicKey("air4tyw7S12bvdRtgoLgyQXuBfoLrjBS7Fg4r91zLb1");

export const UNIQUENESS_PASS = new PublicKey("uniqobk8oGh4XBLMqM68K8M2zNu3CdYX7q5go7whQiv")
export const CAPTCHA_PASS = new PublicKey("ignREusXmGrscGNUesoU9mxfds9AiYTezUKex2PsZV6")

export const LIVENESS_PASS = new PublicKey("vaa1QRNEBb1G2XjPohqGWnPsvxWnwwXF67pdjrhDSwM")

const CHOSEN_PASS = UNIQUENESS_PASS;

const AMOUNT = 1;

export class AirdropClient {
  constructor(
    readonly program: Program<WorkshopSolanaAirdrop>,
    readonly authority: PublicKey,
    readonly airdrop: IdlAccounts<WorkshopSolanaAirdrop>['airdrop'],
    readonly airdropAddress: PublicKey,
    readonly ticket: IdlAccounts<WorkshopSolanaAirdrop>['ticket'] | null,
    readonly ticketAddress: PublicKey,
  ) {
    console.log("Created new client...")
  }

  private static calculateMintAuthority(airdropAddress: PublicKey) {
    return PublicKey.findProgramAddressSync([
      airdropAddress.toBuffer(),
      Buffer.from("mint_authority")
    ], PROGRAM_ID)[0];
  }

  get mintAuthority(): PublicKey {
    return AirdropClient.calculateMintAuthority(this.airdropAddress);
  }

  static async get(provider: AnchorProvider, airdropAddress: PublicKey): Promise<AirdropClient | undefined> {
    const program = new Program<WorkshopSolanaAirdrop>(IDL, PROGRAM_ID, provider);
    const airdrop = await program.account.airdrop.fetchNullable(airdropAddress);

    if (!airdrop) return undefined;

    const [ticketAddress] = PublicKey.findProgramAddressSync([
      airdropAddress.toBuffer(),
      provider.publicKey.toBuffer(),
      Buffer.from("ticket")
    ], PROGRAM_ID);
    const ticket = await program.account.ticket.fetchNullable(ticketAddress)

    return new AirdropClient(program, provider.publicKey, airdrop, airdropAddress, ticket, ticketAddress);
  }

  static async create(provider: AnchorProvider):Promise<AirdropClient> {
    const program = new Program<WorkshopSolanaAirdrop>(IDL, PROGRAM_ID, provider);
    const newMint = Keypair.generate();
    const newAirdrop = Keypair.generate();

    // create new mint
    const lamports = await getMinimumBalanceForRentExemptMint(provider.connection);
    const mintIxes = [
      SystemProgram.createAccount({
        fromPubkey: provider.publicKey,
        newAccountPubkey: newMint.publicKey,
        space: MINT_SIZE,
        lamports,
        programId: TOKEN_PROGRAM_ID,
      }),
      createInitializeMint2Instruction(
        newMint.publicKey,
        0,
        AirdropClient.calculateMintAuthority(newAirdrop.publicKey),
        null
      )
    ];

    // create the airdrop instance
    await program.methods.initialize(newMint.publicKey, CHOSEN_PASS, new BN(AMOUNT)).accounts({
      airdrop: newAirdrop.publicKey,
      authority: provider.publicKey,
    }).preInstructions(mintIxes)
      .signers([newAirdrop, newMint])
      .rpc();

    return AirdropClient.get(provider, newAirdrop.publicKey).then((client) => {
      if (!client) throw new Error("Failed to create airdrop");
      return client;
    });
  }

  async claim(gatewayToken: PublicKey): Promise<TransactionSignature> {
    if (this.ticket) throw new Error("You already have a ticket");

    return this.program.methods.claim().accounts({
        payer: this.authority,
        airdrop: this.airdropAddress,
        mint: this.airdrop.mint,
        mintAuthority: this.mintAuthority,
        ticket: this.ticketAddress,
        recipientTokenAccount: getAssociatedTokenAddressSync(this.airdrop.mint, this.authority),
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