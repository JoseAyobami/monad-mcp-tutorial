import { privateKeyToAccount } from "viem/accounts";
import { getContract, createPublicClient, http, createWalletClient } from "viem";
import { monadTestnet } from "viem/chains";

const publicClient = createPublicClient({
  chain: monadTestnet,
  transport: http(),
});

// Greeter contract ABI
const GREETER_ABI = [
  {
    "inputs": [
      { "internalType": "string", "name": "_greeting", "type": "string" }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [],
    "name": "greeting",
    "outputs": [
      { "internalType": "string", "name": "", "type": "string" }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      { "internalType": "string", "name": "_greeting", "type": "string" }
    ],
    "name": "setGreeting",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

// Greeter contract bytecode
const GREETER_BYTECODE =  "";

export class MyContract {
  public address: `0x${string}`;
  private contract: any;

  constructor(address: `0x${string}`) {
    this.address = address;
    this.contract = getContract({
      address: this.address,
      abi: GREETER_ABI,
      client: publicClient,
    });
  }

  static async deploy(deployerPrivateKey: string, constructorArgs: any[]): Promise<MyContract> {
    const account = privateKeyToAccount(deployerPrivateKey as `0x${string}`);

    const walletClient = createWalletClient({
      account,
      chain: monadTestnet,
      transport: http(),
    });


    // ...inside deploy method...
    const bytecode = GREETER_BYTECODE.startsWith("0x")
  ? GREETER_BYTECODE
  : "0x" + GREETER_BYTECODE;

const hash = await walletClient.deployContract({
  abi: GREETER_ABI,
  bytecode: bytecode as `0x${string}`, // use the fixed bytecode
  args: constructorArgs,
  maxFeePerGas: BigInt(52_000_000_000),
  maxPriorityFeePerGas: BigInt(52_000_000_000),
  gas: BigInt(5_000_000),
});




    

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    const contractAddress = receipt.contractAddress as `0x${string}`;

    return new MyContract(contractAddress);
  }

  async callFunction(functionName: string, args: any[]): Promise<any> {
    return await this.contract.read[functionName](...args);
  }

  async sendTransaction(functionName: string, args: any[], from: string): Promise<any> {
    if (!this.contract?.write?.[functionName]) {
      throw new Error(`Function ${functionName} does not exist on contract.`);
    }
    return await this.contract.write[functionName](...args, { account: from as `0x${string}` });
  }
}

