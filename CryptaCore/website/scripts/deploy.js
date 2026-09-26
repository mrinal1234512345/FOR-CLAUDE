import hre from 'hardhat';

async function main() {
  // Get the first signer from Ganache
  const [signer] = await hre.ethers.getSigners();
  
  const CryptaCoreRegistry = await hre.ethers.getContractFactory('CryptaCoreRegistry', signer);
  const contract = await CryptaCoreRegistry.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log('CryptaCoreRegistry deployed to:', address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
