import { ethers } from "./ethers-6.7.0-min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.querySelector("#connectButton");
const fundButton = document.querySelector("#fundButton");
const balanceButton = document.querySelector("#balanceButton");
connectButton.onclick = connectWallet;
fundButton.onclick = fund;
balanceButton.onclick = getBalance;

async function connectWallet() {
  if (typeof window.ethereum === "undefined") {
    connectButton.innerText = "Please install MetaMask!";
    return false;
  }
  // request to connect wallet
  try {
    await ethereum.request({ method: "eth_requestAccounts" });
    // change button text and disable it after connecting successfully
    connectButton.innerText = "Connected";
    connectButton.disabled = true;
    return true;
  } catch (error) {
    console.log(error);
    connectButton.innerText = "Failed to connect";
    return false;
  }
}

async function getBalance() {
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask is not installed.");
    return;
  }
  const provider = new ethers.BrowserProvider(window.ethereum);

  const balance = await provider.getBalance(contractAddress);
  console.log(`Balance: ${ethers.formatEther(balance)} ETH`);
}

// fund function

async function fund() {
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask is not installed.");
    return;
  }

  const ethAmount = document.querySelector("#ethAmount").value;

  console.log(`Funding with ${ethAmount} ETH...`);
  // We need - provider/connection to the blockcahin
  // Signer/wallet/someone with gas
  // contracts that we are gonna interact with
  // ^ ABI & Address
  const provider = new ethers.BrowserProvider(window.ethereum);

  const signer = await provider.getSigner();
  const contract = new ethers.Contract(contractAddress, abi, signer);

  try {
    const tx = await contract.fund({
      value: ethers.parseEther(`${ethAmount}`),
    });
    await listenForTransactionMine(tx, provider);
    console.log("Done!");
  } catch (error) {
    console.log(error);
  }
}

async function listenForTransactionMine(transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}...`);

  // wait for transaction to finish
  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await provider.waitForTransaction(
        transactionResponse.hash,
      );
      const confirmations =
        (await provider.getBlockNumber()) - receipt.blockNumber + 1;
      console.log(`Completed with ${confirmations} confirmations`);
      // Got enough confirmations
      resolve();
    } catch (error) {
      // Weird, let's log the error
      console.log("Error while waiting for transaction confirmation:", error);
      reject(error);
    }
  });
}
