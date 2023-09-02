import './style.css';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Role from './pages/Role';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [account, setAccount] = useState(null);

  useEffect(() => {
    checkWalletConnection();
  }, []);

  const checkWalletConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setIsConnected(true);
          setAccount(accounts[0]);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    }
  };

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        setAccount(accounts[0]);
      } catch (error) {
        console.error("Wallet connection error:", error);
      }
    }
  };

  return (
    <div className=''>
      <div className="home">
        {!isConnected ? (
          <motion.div exit={{ scale: 0 }}>
            <motion.button 
              whileHover={{ scale: 1.1 }}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: "spring", stiffness: 100 }}
              className="circle-button" onClick={connectWallet}>Connect Wallet
            </motion.button>
          </motion.div>
        ) : (
          <Role account={account} />
        )}
      </div>
    </div>
  );
}

export default App;
