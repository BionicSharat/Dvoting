import React, { useEffect, useMemo, useState } from 'react'
import '../style.css';
import { motion } from 'framer-motion';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/Contract';
import { ethers } from 'ethers';


const AdminDashboard = () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const [votesOpen, setVotesOpen] = useState()

  const contract = useMemo(() => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }, [signer])

  const openVotes = async () => {
    try {
      await contract.startNewVotingRound()
    } catch (error) {
      console.error("Error starting new voting round:", error)
    }
  }

  const endVotes = async () => {
    try {
      await contract.endVotes()
    } catch (error) {
      console.error("Error ending the votes round:", error)
    }
  }

  useEffect(() => {
    const checkVotes = async () => {
      try {
        const votesOpen = await contract.votesOpen()
        setVotesOpen(votesOpen)

      } catch (error) {
        console.error(error)
      }
    }

    checkVotes()
  }, [contract]);



  return (
    <div style={{display: 'flex'}}>
    <motion.div onClick={() => {endVotes()}} whileHover={{scale: 1.1}} className="cardDashboard" style={{fontSize: "8vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
          <div className="card-content-dashboard">
            <p>End Votes</p>
          </div>
    </motion.div>

    <motion.div onClick={() => {openVotes()}} whileHover={{scale: 1.1}} className="cardDashboard" style={{fontSize: "8vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
          <div className="card-content-dashboard">
            <p>Start Votes</p>
          </div>
    </motion.div>

    <motion.div whileHover={{scale: 1.1}} className="cardDashboard" style={{marginLeft: '5.5vmin', fontSize: "8vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
          <div className="card-content-dashboard">
            <p>The votes are</p>
          </div>
    </motion.div>

    <motion.div whileHover={{scale: 1.1}} className="cardDashboard" style={{marginLeft: votesOpen ? "5.2vmin" : "2vmin", fontSize: "8vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
          <div className="card-content-dashboard">
            <p>{votesOpen ? "open" : "closed"}</p>
          </div>
    </motion.div>

  </div>

  )
}

export default AdminDashboard
