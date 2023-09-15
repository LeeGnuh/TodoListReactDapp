import React from 'react';
import { ethers } from 'ethers';
import { useState } from 'react';
import { contractABI, contractAddress, mumbaibyChainId } from './config';
// import Task from './Task';

function App() {

  // const [tasks, setTasks] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);


  var currentTasks = [];

  const connectToMetaMask = async () => {

    try {
      const { ethereum } = window;

      if (!ethereum) { console.log('Metamask not detected'); return; }

      let chainId = await ethereum.request({ method: 'eth_chainId' });
      console.log('Connected to chain:' + chainId);


      if (chainId !== mumbaibyChainId) { alert('You are not connected to the Mumbai Testnet!'); return; }
      else { console.log('Metamask is connected'); }

      const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
      console.log('Found account', accounts[0]);
      setAccount(accounts[0]);


      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Contract is signed');
        setContract(contract);
      }

    } catch (error) { console.log('Error connecting to metamask', error); }

  }

  const addTask = async () => {

    try {
      const transition = await contract.addTask(document.getElementById('taskName').value)
      await transition.wait()
        .then(response => {
          console.log("Adding task is completed, reloading current tasks...");
        })
        .catch(err => {
          console.log("Error occured while adding a new task");
        });

      loadCurrentTasks();
    } catch (error) { console.log("Error adding new task", error); }

  }

  const updateStatus = async () => {
    try {
      const transition = await contract.updateStatus(Number(document.getElementById('taskName').value), true)
      await transition.wait()
        .then(response => {
          console.log("Updating task is Completed, reloading current tasks...");
        })
        .catch(err => {
          console.log("Error occured while adding a new task");
        });

      loadCurrentTasks();
    } catch (error) {
      console.log("Error updating a task", error);
    }
  }

  const deleteTask = async () => {
    try {
      const transition = await contract.deleteTask(Number(document.getElementById('taskName').value))
      await transition.wait()
        .then(response => {
          console.log("Deleting task is Completed, reloading current tasks...");
        })
        .catch(err => {
          console.log("Error occured while adding a new task");
        });

      loadCurrentTasks();
    } catch (error) {
      console.log("Error deleting a task", error);
    }
  }

  const getTask = async (numOfTask) => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Contract is signed');
        const task = await contract.getTask(numOfTask);
        return task;
      }
      else { console.log('Error when getting the contract'); }

    } catch (error) {
      console.log("Error getting a task", error);
    }
  }

  const getTaskCount = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Contract is signed');
        let num = await contract.getTaskCount();
        return Number(num);
      }
      else { console.log('Error when getting the contract'); }

    } catch (error) {
      console.log("Error getting a task", error);
    }
  }

  const loadCurrentTasks = async () => {

    currentTasks = [];
    let n = await getTaskCount();

    for (let i = 0; i < n; i++) {
      let aTask = await getTask(i);
      currentTasks.push(aTask);
    }

    console.log(currentTasks);

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
      )}
      </div>
      <input type='text' id='taskName'></input>
      <button onClick={addTask}>Add Task</button>
      <button onClick={updateStatus}>Completed Task</button>
      <button onClick={getTaskCount}>Get Task Count</button>
      <button onClick={loadCurrentTasks}>Get Task</button>
      <button onClick={deleteTask}>Delete Task</button>

      {/* <ul>
        {tasks.map(item =>
          <Task
            key={item.id}
            taskText={item.taskText}
            onClick={deleteTask(item.id)}
          />)
        }
      </ul> */}
    </div>
  );
}

export default App;