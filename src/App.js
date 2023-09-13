import React from 'react';
import Web3 from 'web3';
import { useState } from 'react';
// import { contractABI, contractAddress } from './config.js';

const contractAddress = '0x52653F634CE709885300f1dCf058a8c6B5cc6956';
const contractABI = [
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_task",
        "type": "string"
      }
    ],
    "name": "addTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskIndex",
        "type": "uint256"
      }
    ],
    "name": "deleteTask",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskIndex",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "_status",
        "type": "bool"
      }
    ],
    "name": "updateStatus",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_taskIndex",
        "type": "uint256"
      }
    ],
    "name": "getTask",
    "outputs": [
      {
        "components": [
          {
            "internalType": "string",
            "name": "task",
            "type": "string"
          },
          {
            "internalType": "bool",
            "name": "isDone",
            "type": "bool"
          }
        ],
        "internalType": "struct TodoApp.Task",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTaskCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

function App() {

  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);


  async function connectToMetaMask() {

    const web3Ins = new Web3(window.ethereum);
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const contract = new web3Ins.eth.Contract(contractABI, contractAddress);

    setWeb3(web3Ins);
    setAccount(accounts[0]);
    setContract(contract);
  }

  async function addTask() {
    const gas = await contract.methods.addTask(document.getElementById('taskName').value).estimateGas();
    console.log('gas: ', gas)

    await contract.methods.addTask(document.getElementById('taskName').value).send({
      from: account, gas
    });
  }

  async function getTask(){

    const task = await contract.methods.getTask(document.getElementById('taskName').value).call({
      from: account
    });

    console.log(task['task'], task['isDone']);

  }

  async function getTaskCount() {

    const num = await contract.methods.getTaskCount().call({
      from: account
    });

    alert(num);

  }


  return (
    <div className="App">
      <h1>Todo-list App</h1>   
      <div>{account ? (
        <div>
          <p>Connected to MetaMask</p>
          <p>Account: {account}</p>
        </div>
      ) : (
          <button onClick={connectToMetaMask}>Connect to MetaMask</button>
      )}</div>
      <input type='text' id='taskName'></input>
      <button onClick={addTask}>Add Task</button>
      <button onClick={getTaskCount}>Get Task Count</button>
      <button onClick={getTask}>Get Task</button>
    </div>
  );
}

export default App;