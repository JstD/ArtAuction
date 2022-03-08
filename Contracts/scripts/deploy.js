async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    console.log("Account balance:", (await deployer.getBalance()).toString());
  
    const Art = await ethers.getContractFactory("Arts");
    const art = await Art.deploy();
    const Auc = await ethers.getContractFactory("Auctions")
    const auc = await Auc.deploy(art.address);
    console.log("Arts address:", art.address);
    console.log("Auctions address:", auc.address);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });