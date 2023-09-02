import React, { useState, useEffect, useMemo } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/Contract';
import { useLocation, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import {ReactComponent as BackIcon} from '../utils/backSvg.svg'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Vote = () => {
  const [candidates, setCandidates] = useState(-1)
  const [blur, setBlur] = useState(-1)
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state.account;
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()
  const [load, setLoad] = useState(-1)

  const contract = useMemo(() => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }, [signer])


  useEffect(() => {
    const getCandidates = async () => {
      try {
        const candidates = await contract.getCandidates()
        const alreadyVoted = await contract.alreadyVoted()
        const votesOpen = await contract.votesOpen()
        setCandidates([candidates, alreadyVoted, votesOpen])
      
      } catch (error) {
        console.error(error)
      }
    }

    getCandidates()
  }, [account, candidates, contract]);

  const backToHome = () => {
    navigate('/')
  }

  const getStyleBlur = (i) => {
    if (blur !== i && blur !== -1) {
    return {
      filter: 'blur(4px)',
      transition: 'filter 0.3s ease-in-out'
    }
    } else {
      return {
      filter: 'blur(0px)',
      transition: 'filter 0.3s ease-in-out'
      }
    }
  }

  const voteFunc = async (candidateId) => {
    if (!candidates[1] && candidates[2]) {
    try {
      setLoad(candidateId)
      await contract.vote(candidateId)
      setLoad(-1)
    } catch (error) {
      console.error("Error registering as a candidate:", error)
    }
    } else if (candidates[1]) {
      const notify = () => toast("Already voted");
      notify()
    } else if (!candidates[2]) {
      const notify = () => toast("Votes are closed");
      notify()
    }
  }

  return (
    <motion.div initial={{ scale: 0.7 }} transition={{ type: "spring", stiffness: 100 }} animate={{ scale: 1 }} className='homeVotes'>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />

      {candidates !== -1 ? (
        <div>
          {candidates[0].length > 0 ? (
            <div>
              <div className='titleDiv'>
              <motion.div onClick={() => (backToHome())} whileHover={{scale: 1.1}}><BackIcon className='svgBack' width={40} height={40}/></motion.div>
              <h1 className='titleVotes'>Candidates</h1>
              </div>
              <div style={candidates[1] ? {filter: "saturate(0%)"} : {}} className="cardsCandidate">
                {candidates[0].map((index, i) => (
                  <motion.div onClick={() => {voteFunc(i+1)}} onMouseLeave={() => {setBlur(-1)}} onMouseOver={() => {setBlur(i)}} style={getStyleBlur(i)} whileHover={{scale: 1.1}} transition={{ type: "spring", stiffness: 100 }} className="cardCandidate" key={i}>
                    {!(load === i+1) ? (<>
                    <h1 className='text2'>{String(index.name)}</h1>
                    <div className='cardCandidateTexts'>
                    <p>number of votes: {String(index.votes)}</p>
                    <p>id: {String(index.id)}</p>
                    </div>
                    </>) : (
                      <div className='home'><div class="spinner"></div></div>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>
          ) : (
            <div className='card2'>
              <h1 className='titleVotes2'>There are currently no candidates. You have the opportunity to be the pioneer by registering and becoming the first candidate.</h1>
              <motion.div onClick={() => (backToHome())} whileHover={{scale: 1.1}}><BackIcon className='svgBack' width={40} height={40}/></motion.div>
            </div>
          )}
        </div>
      ) : (
        <div className='home'><div class="spinner up"></div></div>
      )}
    </motion.div>
  )
}

export default Vote;
