import React, { useState, useEffect, useMemo } from 'react';
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '../utils/Contract';
import { useNavigate, useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';
import {ReactComponent as BackIcon} from '../utils/backSvg.svg'

const Candidate = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const account = location.state.account;
  const [candidateName, setCandidateName] = useState('')
  const [candidates, setCandidates] = useState([])
  const [load, setLoad] = useState(false)

  const provider = new ethers.providers.Web3Provider(window.ethereum)
  const signer = provider.getSigner()

  const contract = useMemo(() => {
    return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
  }, [signer])

  const registerAsCandidate = async () => {
    try {
      setLoad(true)
      await contract.registerCandidate(candidateName)
    } catch (error) {
      console.error("Error registering as a candidate:", error)
    }
  }

  const backToHome = () => {
    navigate('/')
  }

  const getCandidateData = () => {
    return [candidates[0][candidates.at(1)].name, candidates[0][candidates.at(1)].id, candidates[0][candidates.at(1)].votes]
  }

  useEffect(() => {
    const getCandidates = async () => {
      try {
        const candidates = await contract.getCandidates()
        const votesOpen = await contract.votesOpen()
        const alreadyRegister = await contract.candidateRegistrations(account)
        var you = 0
        if (alreadyRegister === true) {
          for (let i=0; i < candidates.length; i++) {
            if (String(candidates[i].candidateAdress).toLowerCase() === account.toLowerCase()) {
              you = i
            }
          }
        } else {
          you = -1
        }
        setCandidates([candidates, you, votesOpen])
      
      } catch (error) {
        console.error(error)
      }
    }

    getCandidates()
  }, [account, candidates, contract]);

  return (
    <>
      {!(candidates.length === 0) ? (
        <>
          {candidates[2] === false ? (
          <>
          <div className='homeCandidate'>
            {candidates[1] === -1 ? (
              <>
                {candidates[0].length !== 5 ? (
                  <motion.div initial={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 100 }} animate={{ scale: 1.5 }} className="Candidate">
                    <div className="titleCandidate">
                      Welcome,<br />
                      <span style={{ wordWrap: 'break-word' }}>Enter your name to register as a candidate</span>
                    </div>
                    <input onChange={(e) => setCandidateName(e.target.value)} placeholder="Name" name="text" className="inputCandidate" />
                    {!load ? (
                      <motion.button whileHover={{ scale: 1.05 }} transition={{ type: "spring", stiffness: 100 }} onClick={registerAsCandidate} className="button-confirmCandidate">
                        Register
                      </motion.button>
                    ) : (
                      <div className="spinner"></div>
                    )}
                    <motion.div onClick={() => backToHome()} whileHover={{ scale: 1.1 }}>
                      <BackIcon className='svgBack' width={40} height={40} />
                    </motion.div>
                  </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 100 }} animate={{ scale: 1.5 }} className="Candidate">
                    <div className="titleCandidate">
                      Hello, <br />
                      <span style={{ wordWrap: 'break-word' }}>Unfortunately, you cannot join now as we have already reached the maximum number of candidates.</span>
                    </div>
                    <motion.div onClick={() => backToHome()} whileHover={{ scale: 1.1 }}>
                      <BackIcon className='svgBack' width={40} height={40} />
                    </motion.div>
                  </motion.div>
                )}
              </>
            ) : (
              <motion.div initial={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 100 }} animate={{ scale: 1.5 }} className="Candidate">
                <div className="titleCandidate">
                  Hi {getCandidateData().at(0)}<br />
                  <span style={{ wordWrap: 'break-word' }}>
                    You are now registered as a candidate with the ID of {String(getCandidateData().at(1))}, and you currently have {String(getCandidateData().at(2))} votes.
                  </span>
                </div>
                <motion.div onClick={() => backToHome()} whileHover={{ scale: 1.1 }}>
                  <BackIcon className='svgBack' width={40} height={40} />
                </motion.div>
              </motion.div>
            )}
          </div>
          </>) : 
          (<div className='home'>
            <motion.div initial={{ scale: 0.9 }} transition={{ type: "spring", stiffness: 100 }} animate={{ scale: 1.5 }} className="Candidate">
              <div className="titleCandidate">
                Hello, <br />
                <span style={{ wordWrap: 'break-word' }}>Unfortunately, you cannot participate at the moment. Please wait until the next round of voting.</span>
              </div>
              <motion.div onClick={() => backToHome()} whileHover={{ scale: 1.1 }}>
                <BackIcon className='svgBack' width={40} height={40} />
              </motion.div>
            </motion.div>
          </div>)}
        </>
      ) : (
        <div className='home'>
          <div class="spinner"></div>
        </div>
      )}
    </>
  );
}

export default Candidate;
