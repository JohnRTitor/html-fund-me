import { ethers } from "./ethers-6.7.0-min.js";
import { abi, contractAddress } from "./constants.js";

const connectButton = document.getElementById("connectButton");
const fundButton = document.getElementById("fundButton");
connectButton.onclick = connectWallet;
fundButton.onclick = fund;

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

// fund function

async function fund() {
  const ethAmount = 0.2;
  if (typeof window.ethereum === "undefined") {
    console.log("Metamask is not installed.");
    return;
  }

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

  return new Promise(async (resolve, reject) => {
    try {
      const receipt = await provider.waitForTransaction(
        transactionResponse.hash,
      );
      const confirmations =
        (await provider.getBlockNumber()) - receipt.blockNumber + 1;
      console.log(`Completed with ${confirmations} confirmations`);
      resolve();
    } catch (error) {
      console.log("Error while waiting for transaction confirmation:", error);
      reject(error);
    }
  });
}
