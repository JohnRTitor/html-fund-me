import { ethers } from "./ethers-6.7.0-min";

async function connectWallet() {
  if (typeof window.ethereum !== "undefined") {
    // request to connect wallet
    try {
      await ethereum.request({ method: "eth_requestAccounts" });
      // change button text and disable it after connecting successfully
      document.getElementById("connectButton").innerText = "Connected";
      document.getElementById("connectButton").disabled = true;
    } catch (error) {
      console.log(error);
      document.getElementById("connectButton").innerText = "Failed to connect";
    }
  } else {
    document.getElementById("connectButton").innerText =
      "Please install MetaMask!";
  }
}

// fund function

async function fund(ethAmount) {
  console.log(`Funding with ${ethAmount} ETH...`);
  if (typeof window.ethereum !== "undefined") {
    // We need - provider/connection to the blockcahin
    // Signer/wallet/someone with gas
    // contracts that we are gonna interact with
    // ^ ABI & Address
  }
}
