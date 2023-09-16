import React, { useState } from 'react';
import { ethers } from 'ethers';
import { contractABI, contractAddress, mumbaibyChainId } from './config';
import { TextField, Button, List, Checkbox, ListItem, ListItemAvatar, ListItemText } from '@mui/material';

function App() {

  const [tasks, setTasks] = useState([]);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [provider, getProvider] = useState(null);

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
        getProvider(provider);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(contractAddress, contractABI, signer);
        console.log('Contract is signed');
        setContract(contract);

        loadCurrentTasks();
      }

    } catch (error) { console.log('Error connecting to metamask', error); }

  }

  const disConnectToMetaMark = async () => {
    setAccount(null);
    setContract(null);
    setTasks([]);
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
  const updateTaskUI = (e) => {
    const checkboxId = e.target.id;
    const statesOfBox = e.target.checked;
    console.log({ checkboxId, statesOfBox });
    updateStatus(checkboxId, statesOfBox);
  }
  const updateStatus = async (numOfTask, statusTask) => {
    try {
      const transition = await contract.updateStatus(numOfTask, statusTask);
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

  const deleteTaskUI = (e) => {
    const buttonId = e.target.id;
    console.log(buttonId);
    deleteTask(buttonId);
  }
  const deleteTask = async (numOfTask) => {
    try {
      const transition = await contract.deleteTask(Number(numOfTask))
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

  // const reloadTasks = () => {
  //   console.log(tasks);
  //   tasks.map((item, index) => { console.log(item.isDone); return item; })
  // }
  const loadCurrentTasks = async () => {

    currentTasks = [];
    let n = await getTaskCount();

    for (let i = 0; i < n; i++) {
      let aTask = await getTask(i);
      currentTasks.push(aTask);
    }

    // console.log(currentTasks);
    setTasks(currentTasks);
  }

  return (
    <div className="App">
      
    </div>
  );
}

export default App;