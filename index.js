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
