# DonaTheta

A project that seeks to enhance the experience of providing donations by integrating the decentralized technology of the Theta blockchain to host donation video pledges and track the accountability of funds donated.

## Table of Contents
- [Overview](#overview)
   - [Idea](#idea)
   - [DonaTheta DApp](#donatheta-dapp)
   - [Donation Project](#donation-project)
   - [DonaTheta Accountability System](#donatheta-accountability-system)
   - [Implementation](#implementation)
      - [Blockchain](#blockchain)
         - [DonaVote](#donavote)
      - [Frontend](#frontend)
- [Building](#building)
   - [Install Blockchain Dependencies](#install-blockchain-dependencies)
   - [Start Frontend Project](#start-frontend-project)
- [Contributions](#contributions)
- [Contact](#contact)

## Overview

### Idea
DonaTheta primarily uses videos to engage the audience and encourage contributions to various projects. Each project can feature multiple videos to captivate and inform potential donors. Additionally, DonaTheta places a strong emphasis on the accountability of donated funds through the DonaTheta Accountability System.

### DonaTheta DApp
The DonaTheta website is a decentralized app powered by smart contracts. You can find the smart contracts in [this]() folder.

### Donation Project
The website is open to individuals, groups of individuals, or organizations to start a donation campaign. Donations are collected in Theta tokens and are stored in a piggy bank. Funds can only be accessed after approval by the Dona Accountability System. To withdraw TFUEL from the piggy bank, users must create a withdrawal request and wait for approval from Dona Accountability Committee members.

Users of DonaTheta can view all donation projects (past, ongoing, and future). The website allows users to donate to a project and track the expenditure of already donated funds.

### DonaTheta Accountability System
Throughout the campaign of a project, a committee is chosen to oversee the utilization of donated funds. The committee consists of:
- Already registered organizers of the project (cannot be changed once donations have started).
- The top 5% of highest contributors (all contributions).
- A random 5% of the contributors to the project.

Each committee member is allocated one DonaVote (organizers have three votes). Each proposal/expenditure requires at least 50% of all DonaVotes for it to be approved.

### Implementation

#### Blockchain

##### DonaVote
The DonaVote is an ERC721 token. The token is awarded to the DonaTheta Approval Committee members at the end of the donation. When a withdrawal proposal is submitted, the committee members use their DonaVotes to approve the proposal.

#### Frontend
The front end is developed using React.js. The app interacts with the blockchain using Ethers.js.

## Building
To build the project, follow these steps:

1. Clone the repository:
    ```shell
    git clone https://github.com/theyolodev/donatheta
    ```

### Install Blockchain Dependencies
1. Navigate to the blockchain directory:
    ```shell
    cd blockchain
    ```
2. Install the dependencies:
    ```shell
    npm install
    ```
3. Compile the smart contracts:
    ```shell
    npx hardhat compile
    ```
4. Start Hardhat node:
    ```shell
    npx hardhat node
    ```

### Start Frontend Project
On a different terminal:

1. Navigate to the frontend directory:
    ```shell
    cd frontend
    ```
2. Install the dependencies:
    ```shell
    npm install
    ```
3. Start the frontend server:
    ```shell
    npm run start
    ```

## Contributions
Currently, the project is not open to contributions.
