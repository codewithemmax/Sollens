import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Solscore } from "../target/types/solscore";
import { PublicKey, Keypair, SystemProgram } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { expect } from "chai";

describe("solscore", () => {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.Solscore as Program<Solscore>;
  const wallet = provider.wallet as anchor.Wallet;

  let scoreAccountPda: PublicKey;
  let scoreAccountBump: number;
  let mintKeypair: Keypair;

  before(async () => {
    [scoreAccountPda, scoreAccountBump] = PublicKey.findProgramAddressSync(
      [Buffer.from("score"), wallet.publicKey.toBuffer()],
      program.programId
    );
    mintKeypair = Keypair.generate();
  });

  it("Initializes score account", async () => {
    await program.methods
      .initializeScoreAccount()
      .accounts({
        scoreAccount: scoreAccountPda,
        wallet: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();

    const scoreAccount = await program.account.scoreAccount.fetch(scoreAccountPda);
    expect(scoreAccount.wallet.toString()).to.equal(wallet.publicKey.toString());
    expect(scoreAccount.score).to.equal(0);
  });

  it("Mints score NFT", async () => {
    const breakdown = {
      repaymentHistory: 340,
      defiActivity: 170,
      walletAge: 128,
      tokenDiversity: 85,
      daoParticipation: 128,
    };

    const [tokenAccount] = PublicKey.findProgramAddressSync(
      [
        wallet.publicKey.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    const [metadata] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    const [masterEdition] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s").toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s")
    );

    await program.methods
      .mintScoreNft(750, breakdown, "https://arweave.net/score-metadata")
      .accounts({
        scoreAccount: scoreAccountPda,
        mint: mintKeypair.publicKey,
        tokenAccount,
        metadata,
        masterEdition,
        wallet: wallet.publicKey,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        systemProgram: SystemProgram.programId,
        rent: anchor.web3.SYSVAR_RENT_PUBKEY,
        tokenMetadataProgram: new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"),
      })
      .signers([mintKeypair])
      .rpc();

    const scoreAccount = await program.account.scoreAccount.fetch(scoreAccountPda);
    expect(scoreAccount.score).to.equal(750);
    expect(scoreAccount.mint.toString()).to.equal(mintKeypair.publicKey.toString());
  });

  it("Queries score", async () => {
    const scoreData = await program.methods
      .queryScore(wallet.publicKey)
      .accounts({
        scoreAccount: scoreAccountPda,
      })
      .view();

    expect(scoreData.score).to.equal(750);
    expect(scoreData.wallet.toString()).to.equal(wallet.publicKey.toString());
  });
});
