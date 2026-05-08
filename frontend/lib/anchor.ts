import { AnchorProvider, Program, Idl } from "@coral-xyz/anchor";
import { Connection, PublicKey } from "@solana/web3.js";
import { AnchorWallet } from "@solana/wallet-adapter-react";

const PROGRAM_ID = new PublicKey("ScoREJVqH9K3F7RqvhQxZ8yYxJxZ8yYxJxZ8yYxJxZ8");
const RPC_URL = process.env.NEXT_PUBLIC_SOLANA_RPC_URL || "https://api.devnet.solana.com";

export function getProgram(wallet: AnchorWallet) {
  const connection = new Connection(RPC_URL, "confirmed");
  const provider = new AnchorProvider(connection, wallet, {
    commitment: "confirmed",
  });

  // Load IDL (you'll need to import the generated IDL)
  const idl = {} as Idl; // Replace with actual IDL
  return new Program(idl, PROGRAM_ID, provider);
}

export function getScoreAccountPDA(wallet: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("score"), wallet.toBuffer()],
    PROGRAM_ID
  );
}

export { PROGRAM_ID, RPC_URL };
