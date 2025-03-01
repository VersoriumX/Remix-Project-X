// script.js

// Replace with your contract's ABI and address
const contractABI = [
    // Your contract ABI goes here
];

const contractAddress = '0xYourContractAddress'; // Replace with your contract address

let provider;
let signer;
let contract;

document.getElementById('register').addEventListener('click', async () => {
    if ('serviceWorker' in navigator) {
        try {
            const registration = await navigator.serviceWorker.register('service-worker.js');
            console.log('Service Worker registered with scope:', registration.scope);
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    } else {
        console.log('Service workers are not supported in this browser.');
    }
});

document.getElementById('fetch-data').addEventListener('click', async () => {
    if (navigator.serviceWorker.controller) {
        const response = await fetch('/data');
        const data = await response.json();
        document.getElementById('output').innerText = JSON.stringify(data);
    } else {
        console.log('No active service worker found.');
    }
});

document.getElementById('interact-contract').addEventListener('click', async () => {
    if (typeof window.ethereum !== 'undefined') {
        provider = new ethers.providers.Web3Provider(window.ethereum);
        await provider.send("eth_requestAccounts", []); // Request account access

        signer = provider.getSigner();
        contract = new ethers.Contract(contractAddress, contractABI, signer);

        // Example: Call a function from your contract
        try {
            const result = await contract.yourFunction(); // Replace with your contract function
            document.getElementById('output').innerText = `Result: ${result}`;
        } catch (error) {
            console.error('Error interacting with contract:', error);
        }
    } else {
        console.log('Ethereum provider not found. Install MetaMask.');
    }
});
