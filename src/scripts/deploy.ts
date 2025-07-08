import { MyContract } from "../contracts/MyContract";

// Use environment variable for security
let DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY || "";
if (!DEPLOYER_PRIVATE_KEY.startsWith("0x")) {
  DEPLOYER_PRIVATE_KEY = "0x" + DEPLOYER_PRIVATE_KEY;
}

async function main() {
  const constructorArgs: unknown[] = ["Hello, Monad!"];
  const contract = await MyContract.deploy(DEPLOYER_PRIVATE_KEY, constructorArgs);
  console.log("Contract deployed at:", contract.address);

  const greeting = await contract.callFunction("greeting", []);
  console.log("Contract greeting:", greeting);
}

main().catch((err) => {
  console.error("Deployment failed:", err);
  process.exit(1);
});


