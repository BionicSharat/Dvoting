// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Dvoting {

    address public owner;
    bool public votesOpen;

    struct Candidate {
        uint votes;
        uint id;
        string name;
        address candidateAdress;
    }

    mapping(uint => Candidate) public candidates;
    mapping(address => bool) private voters;
    mapping(address => bool) public candidateRegistrations;
    mapping(uint => Candidate) public votesResults;

    uint public n_candidates;
    uint public maxCandidates = 5;
    uint public votingRound = 1;

    event CandidateRegistered(address indexed candidate);
    event VotingEnded(uint round);
    event NewVotingRound(uint round);
    event Vote(uint candidateId);

    constructor() {
        owner = msg.sender;
        votesOpen = false;
        n_candidates = 0;
    }

    modifier onlyOwner() {
        require(owner == msg.sender, "NOT OWNER");
        _;
    }

    function registerCandidate(string memory candidateName) public {
        require(!candidateRegistrations[msg.sender], "Already registered");
        require(n_candidates <= maxCandidates, "Max candidates reached");
        require(!votesOpen, "Voting is open");

        n_candidates++;
        candidates[n_candidates] = Candidate(0, n_candidates, candidateName, msg.sender);
        candidateRegistrations[msg.sender] = true;

        emit CandidateRegistered(msg.sender);
    }

    function vote(uint candidateId) public {
        require(votesOpen, "Voting is closed");
        require(candidateId > 0 && candidateId <= n_candidates, "Not a candidate");

        require(!voters[msg.sender], "Already voted");
        voters[msg.sender] = true;
        candidates[candidateId].votes++;

        emit Vote(candidateId);

    }

    function startNewVotingRound() public onlyOwner {
        require(!votesOpen, "Voting is still open");

        votingRound++;
        votesOpen = true;

        emit NewVotingRound(votingRound);
    }

    function endVotes() public onlyOwner {
        require(votesOpen, "Votes ended");

        for (uint i = 1; i <= n_candidates; i++) {
            votesResults[i] = candidates[i];
        }

        for (uint i = 1; i <= n_candidates; i++) {
            delete candidateRegistrations[candidates[i].candidateAdress];
            delete candidates[i];
        }

        n_candidates = 0;

        votesOpen = false;
    }

    function getCandidates() public view returns (Candidate[] memory) {
        Candidate[] memory allCandidates = new Candidate[](n_candidates);
        for (uint i = 0; i < n_candidates; i++) {
            allCandidates[i] = candidates[i+1];
        }
        return allCandidates;
    }

    function alreadyVoted() public view returns (bool) {
        return voters[msg.sender];
    } 

}