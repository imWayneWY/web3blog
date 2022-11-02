# WEB3 Learning Pathway for Frontend Developers

As a frontend developer, there's not a huge difference on client side. We just switch our data source from server to some smart contracts and block chain, and there's already great libraries to help us. However, it'll be better if you know how the mechanism works, like you will be benefit a lot if you know server side's knowledge when you were fetching the data you need.

## Solidity
Solidity is the most main stream coding language for implementing smart contracts on various platform. People say if you are javascript master it will be super easy for you, well, it's not 100% true. You can find it is influenced by javascript, C++ and Python, but remember it's running in a totally different way and has it's own temper. A simple example, Solidity doesn't have decimal number. It's because smart contract is handling accurate numbers everyday and need to be stable, and decimal numbers always bring troubles. Anyway, as a WEB3 developer, Solidity is a **MUST HAVE** skill.

## Remix
I bet you will see ALL the solidity tutorial address Remix. It's an online code editor for coding and testing smart contracts. Pretty simple to use. I mean, how hard can a editor be, right?  


## Ethers.js
Ethers.js is a library to help you interact with blockchain's data and also contracts. It's for fetching data and also listen Events on chain.  
There are also some other libraries can work on the same thing, like web3.js, but ethers.js is the most popular one for now (End of 2022). The way to use these kind libraries are pretty much the same, so no need to worry about if your company's project are using different library.

## OpenZeppelin
You can understand OpenZeppelin as a solidity open source library, so please take a look and learn something AFTER you go through Solidity and make some simple contracts.  
OpenZeppelin provides a bunch of ready to use contracts and you can simply import their work and make a couple of lines of changes, and it's working. It also has a high level of security.   
They have a series of "hack games" [here](https://ethernaut.openzeppelin.com/), I strongly recommend you to go through all of these. Don't feel shy to google the answer of how to hack these contracts, it will bring you a basic idea on how to make your smart contract safe.

## Hardhat
You can deploy and maintain your smart contract using Remix, or ethers.js from client side, **for fun** (So actually please don't use these tools to deploy your contracts). I mean, smart contract is the core of your project, it should be simple but solid. Hardhat is a tool to help you testing you smart contract, and deploy your contract, also do some initial stuff.  

---
  

I assume you are already a frontend developer when reading this, so after learning these above skills, you are ready to enjoy your journey of WEB3 now. And as all the developers base skills, we need always learn new things, always practice.