const contractAddress = "0xD0D6d60401d5c249B6CDB1d13E703cE19cD088FA";
const contractABI = [
    {
        "inputs": [{ "internalType": "address", "name": "", "type": "address" }],
        "name": "balances",
        "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
        "stateMutability": "view",
        "type": "function",
        "constant": true
    },
    {
        "inputs": [],
        "name": "deposit",
        "outputs": [],
        "stateMutability": "payable",
        "type": "function",
        "payable": true
    },
    {
        "inputs": [{ "internalType": "uint256", "name": "amount", "type": "uint256" }],
        "name": "withdraw",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    }
];

let provider;
let signer;
let contract;

async function connectWallet() {
    if (!window.ethereum) {
        alert("Встанови MetaMask");
        return;
    }

    try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        provider = new ethers.providers.Web3Provider(window.ethereum);
        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);
        const address = await signer.getAddress();
        await getBalance(address);
    } catch (e) {
        console.error("Помилка підключення:", e);
    }
}

async function getBalance(address) {
    try {
        const balance = await contract.balances(address);
        const ethBalance = ethers.utils.formatEther(balance);
        document.getElementById("balance").innerText = `Баланс: ${ethBalance} ETH`;
    } catch (e) {
        console.error("Помилка при отриманні балансу:", e);
        document.getElementById("balance").innerText = "Не вдалося отримати баланс";
    }
}

async function deposit() {
    const amountEth = document.getElementById("depositAmount").value;
    if (!amountEth || parseFloat(amountEth) <= 0) {
        alert("Введи коректну суму для депозиту");
        return;
    }

    try {
        const amountWei = ethers.utils.parseEther(amountEth);
        const tx = await contract.deposit({ value: amountWei });
        await tx.wait();
        const address = await signer.getAddress();
        await getBalance(address);
    } catch (e) {
        console.error("Помилка при депозиті:", e);
        alert("Не вдалося внести кошти: " + e.message);
    }
}

async function withdraw() {
    const amountEth = document.getElementById("withdrawAmount").value;
    if (!amountEth || parseFloat(amountEth) <= 0) {
        alert("Введи коректну суму для виводу");
        return;
    }

    try {
        const amountWei = ethers.utils.parseEther(amountEth);
        const tx = await contract.withdraw(amountWei);
        await tx.wait();
        const address = await signer.getAddress();
        await getBalance(address);
    } catch (e) {
        console.error("Помилка при виведенні:", e);
        alert("Не вдалося вивести кошти: " + e.message);
    }
}