const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require ('web3');
const { interface, bytecode } = require ('./compile');


const provider = new HDWalletProvider(
	'video attack crater wool acid secret limb media relief scatter post public',
	'https://rinkeby.infura.io/v3/dcfb09468dd44bc1ac5a5c6ed5d25285'
);

const web3 = new Web3(provider);

const deploy = async () => {
	//get list of accounts
	const accounts = await web3.eth.getAccounts();

	console.log ('Attempting to deploy from account', accounts[0]);
	const result = await new web3.eth.Contract(JSON.parse(interface))
		.deploy( {data: bytecode })
		.send( {gas: '1000000', from: accounts[0]} );
	console.log(result);
	console.log(interface);	
	console.log('Contract deployed to', result.options.address);	

};

deploy();
