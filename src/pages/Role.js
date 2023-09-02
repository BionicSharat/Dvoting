import React from 'react'
import '../style.css';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import AdminDashboard from './AdminDashboard';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../utils/Contract';
import { useMemo, useState, useEffect } from 'react';


const Role = ({account}) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const [owner, setOwner] = useState(false)

  const contract = useMemo(() => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }, [signer])

  const navigate = useNavigate();

  useEffect(() => {
    const checkOwner = async () => {
      try {
        const ownerAdd = await contract.owner()
        setOwner(String(account).toLowerCase() === String(ownerAdd).toLowerCase())

      } catch (error) {
        console.error(error)
      }
    }

    checkOwner()
  }, [contract, account]);


  return (
    <div className='dashboard'>
      {owner ? (
      <AdminDashboard account={AdminDashboard}/>
      ) : (<></>)}
    <motion.div style={{display: "flex", gap: "40px"}}>
          <motion.div onClick={() => {navigate('/vote', {state: {account}})}} whileHover={{scale: 1.1}} className="card" style={{fontSize: "8vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
            <div className="card-content">
              <p>Vote</p>
            </div>
          </motion.div>

          <motion.div onClick={() => {navigate('/register-candidate', {state: {account}})}} whileHover={{scale: 1.1}} className="card" style={{fontSize: "4.5vmin"}} initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: "spring", stiffness: 70 }}>
            <div className="card-content">
            <p>Register as a candidate</p>
            </div>
          </motion.div>
    </motion.div>
    </div>
  )
}

export default Role
