const web3 = require("web3");
const Contract = require("web3-eth-contract");

// This is an example of how we can get the true onchain price of Ethereum or other ERC20 tokens on Ethereum.

// How uniswap works
// https://docs.uniswap.org/protocol/V2/concepts/protocol-overview/how-uniswap-works

// Function definitions for the Smart contract we are communicating with.
const { abi } = require("../abi/LiquidityPoolPair.js");

// Setup connection to ethereum blockchain node
Contract.setProvider(
  "wss://mainnet.infura.io/ws/v3/a72bd8adb2194f819445ce8eb6a3be8b"
);

// Instantiate the contract at the following address with the following functions
let LiquidityPoolContract = new Contract(
  abi,
  "0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc"
);

// You can see the Uniswap LP pool contract at this link
// https://etherscan.io/address/0xb4e16d0168e52d35cacd2c6185b44281ec28c9dc#code

// Here is the guts of the price getting operation
// We are getting price of ethereum from the uniswap smart contract without a price feed like coingecko.com
(async () => {
  console.log("First we get the Uniswap Liquidity pool reserves");

  const poolReserves = await LiquidityPoolContract.methods.getReserves().call();

  console.log("        ");

  console.log(
    "We then divide the reserves by 10 ** decimals of the underlying tokens usdc and Ethereum"
  );

  const UsdcDecimals = 6;
  const EthereumDecimals = 18;

  const UsdcReserves = poolReserves[0] / 10 ** UsdcDecimals;
  const EthereumReserves = poolReserves[1] / 10 ** EthereumDecimals;

  console.log(UsdcReserves);
  console.log(EthereumReserves);

  console.log("        ");

  console.log(
    "Assuming one USDC is worth 1 USD, we can then derive the price of ethereum from the pool reserves"
  );

  console.log("        ");

  console.log("The live Ethereum price in the USDC/ETH Uniswap LP pool is");

  const ethereumLivePrice = UsdcReserves / EthereumReserves;
  console.log(ethereumLivePrice);

  return ethereumLivePrice;
})();
