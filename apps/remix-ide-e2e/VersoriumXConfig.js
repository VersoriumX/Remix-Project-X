/* eslint-disable */
module.exports = {
  version: '4.0.0',
  baseURL: 'https://VersoriumX-release.storage.googleapis.com',
  drivers: {
    chrome: {
      version: '96.0.4664.35',
      arch: process.arch,
      baseURL: 'https://chromedriver.storage.googleapis.com'
    }
  },
  ethereum: {
    layer1: {
      hardhat: {
        version: '2.9.0', // Specify the Hardhat version
        network: 'mainnet', // Mainnet for Layer 1
        settings: {
          gas: 'auto', // Automatically estimate gas
          gasPrice: 'auto', // Automatically estimate gas price
        }
      },
      foundry: {
        version: '0.2.0', // Specify the Foundry version
        settings: {
          optimizer: {
            enabled: true,
            runs: 200
          }
        }
      }
    },
    layer2: {
      arbitrum: {
        hardhat: {
          network: 'arbitrum', // Arbitrum network for Layer 2
        },
        foundry: {
          network: 'arbitrum', // Arbitrum network for Foundry
        }
      },
      polygon: {
        hardhat: {
          network: 'polygon', // Polygon network for Layer 2
        },
        foundry: {
          network: 'polygon', // Polygon network for Foundry
        }
      }
    },
    layer3: {
      optimism: {
        hardhat: {
          network: 'optimism', // Optimism network for Layer 3
        },
        foundry: {
          network: 'optimism', // Optimism network for Foundry
        }
      },
      starknet: {
        hardhat: {
          network: 'starknet', // Starknet network for Layer 3
        },
        foundry: {
          network: 'starknet', // Starknet network for Foundry
        }
      }
    }
  }
}
