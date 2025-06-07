import { ethers } from "hardhat"
import { saveDeployment } from "../hardhat.config"

async function main() {
  const [deployer] = await ethers.getSigners()
  console.log(`Deploying contracts with the account: ${deployer.address}`)

  const network = process.env.HARDHAT_NETWORK || "localhost"
  console.log(`Network: ${network}`)

  // Deploy EthereumX token
  const EthereumX = await ethers.getContractFactory("EthereumX")
  const ethx = await EthereumX.deploy()
  await ethx.deployed()
  console.log(`EthereumX deployed to: ${ethx.address}`)

  // Deploy WrappedEthereumX
  const WrappedEthereumX = await ethers.getContractFactory("WrappedEthereumX")
  const wethx = await WrappedEthereumX.deploy(ethx.address)
  await wethx.deployed()
  console.log(`WrappedEthereumX deployed to: ${wethx.address}`)

  // Get WETH address based on the network
  let wethAddress: string
  if (network === "ethereum" || network === "goerli") {
    wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2" // Ethereum Mainnet WETH
  } else if (network === "polygon" || network === "polygon") {
    wethAddress = "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619" // Polygon WETH
  } else if (network === "optimism" || network === "optimism") {
    wethAddress = "0x4200000000000000000000000000000000000006" // Optimism WETH
  } else {
    // Local development - deploy a mock WETH
    const WETH9 = await ethers.getContractFactory("WETH9")
    const weth = await WETH9.deploy()
    await weth.deployed()
    wethAddress = weth.address
    console.log(`Mock WETH deployed to: ${wethAddress}`)
  }

  // Deploy Federal Reserve contract
  const EthereumXFederalReserve = await ethers.getContractFactory("EthereumXFederalReserve")
  const federalReserve = await EthereumXFederalReserve.deploy(ethx.address, wethx.address, wethAddress)
  await federalReserve.deployed()
  console.log(`EthereumXFederalReserve deployed to: ${federalReserve.0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266}`)

  // Initialize the Federal Reserve with initial liquidity
  // This would typically be done with real funds in production
  if (network === "localhost" || network === "hardhat") {
    // Mint some ETHX tokens to the deployer
    const mintAmount = ethers.utils.parseEther("10000") // 10,000 ETHX
    await ethx.mint(deployer.address, mintAmount)
    console.log(`Minted ${ethers.utils.formatEther(mintAmount)} ETHX to the deployer`)

    // Approve and deposit ETHX to the Federal Reserve
    await ethx.approve(federalReserve.address, mintAmount)
    await federalReserve.depositTokens(ethx.address, mintAmount)
    console.log(`Successfully deposited ${ethers.utils.formatEther(mintAmount)} ETHX to the Federal Reserve`)

    // Deposit ETH to the Federal Reserve
    const ethAmount = ethers.utils.parseEther("10000") // 10,000 ETH
    await federalReserve.depositETH({ value: ethAmount })
    console.log(`Deposited ${ethers.utils.formatEther(ethAmount)} ETH to Federal Reserve`)
  }

  // Save deployment addresses
  const deployments = {
    ETHX: ethx.address,
    WETHX: wethx.address,
    WETH: wethAddress,
    FederalReserve: federalReserve.address,
  }

  saveDeployment(network, deployments)

  console.log("Deployment complete!")
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
