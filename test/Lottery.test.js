const assert = require('assert');
const ganache = require('ganache-cli'); 
const Web3 = require('web3'); //requiring or importing constructor function of web3 lib

const provider = ganache.provider()
const web3 = new Web3(provider); //making instance of web3 with provider for ganache network 

//getting  or requiring objects interface(ABI) and bytecode from compile.js file
const {interface,bytecode} = require('../compile');

//local variables for holding of contract instance and list of accounts from ganache
let lottery;
let accounts;

beforeEach(async () => {
	accounts = await web3.eth.getAccounts();
	lottery = await new web3.eth.Contract(JSON.parse(interface))
		.deploy ( {data: bytecode} )
		.send({ from: accounts[0], gas: '1000000'});
});

describe('lottery Contract', () => {
	it ('deploys a contract', () => {
		assert.ok (lottery.options.address);
	});

	it('allows one account to enter',async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(1, players.length);
	});

	it('allows multiple accounts to enter', async () => {
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('0.02', 'ether')
		});
		await lottery.methods.enter().send({
			from: accounts[2],
			value: web3.utils.toWei('0.02', 'ether')
		});

		const players = await lottery.methods.getPlayers().call({
			from: accounts[0]
		});

		assert.equal(accounts[0], players[0]);
		assert.equal(accounts[1], players[1]);
		assert.equal(accounts[2], players[2]);

		assert.equal(3, players.length);
	});

	it('require a minimum amount of ether to enter', async () => {
		try {
			await lottery.methods.enter().send({
				from: accounts[0],
				value: 0
			});
			assert(false); //if error occured, to fail the test no matter what //should not be run
		} catch (err) {
			assert(err); //if error occured, then assert going to be true
		}
	});

	it('only manager can call pickWinner', async () => {
		try {
			await lottery.methods.pickWinner().send({
				from: accounts[1]
			});
			assert(false);
		} catch (err) {
			assert(err);
		}
	});

	it('sends money to the winner', async () => {
		//test only for one account only for simplify rather than all account
		await lottery.methods.enter().send({
			from: accounts[0],
			value: web3.utils.toWei('2', 'ether')
		})  

		//check initial balance of accounts 0
		const initialBalance = await web3.eth.getBalance(accounts[0]);

		//call pickWinner and send the money to accounts 0
		await lottery.methods.pickWinner().send({
			from: accounts[0]
		}) 

		//wiiner address
		console.log('winner is ', await lottery.methods.winner().call())

		//check final balance of accounts 0
		const finalBalance = await web3.eth.getBalance(accounts[0]);

		const difference = finalBalance - initialBalance;
		console.log(finalBalance - initialBalance);
		assert(difference > web3.utils.toWei('1.8', 'ether'));

	});

	it('reset the players array', async () => {
		//check players array
		const playersArr = await lottery.methods.getPlayers().call();
		console.log (playersArr);
		assert.equal(0, playersArr.length)
	});

	it('has balance of 0 or same as initial balance after winner picked', async () => {
		/**
		const result = await new web3.eth.Contract(JSON.parse(interface))
			.deploy( {data: bytecode })
			.send( {gas: '1000000', from: accounts[0]} );
		**/	
		console.log('Contract deployed to', lottery.options.address);
		//check initial contract Balance
		initialContractBalance = await web3.eth.getBalance(lottery.options.address);
		console.log('Initial Contract Balance',initialContractBalance);

		//check initial balance of accounts 1 before enter
		const initialBalance = await web3.eth.getBalance(accounts[1]);
		console.log ('Account 1 initial balance',initialBalance);


		//account 1 enter lottery
		await lottery.methods.enter().send({
			from: accounts[1],
			value: web3.utils.toWei('2', 'ether')
		})  

		//check  balance of accounts 1 after enter 
		const afterEnterBalance = await web3.eth.getBalance(accounts[1]);
		console.log('Account 1 after enter balance',afterEnterBalance);

		//check contract Balance after account 1 before pickWinner
		contractBalance = await web3.eth.getBalance(lottery.options.address);
		console.log('Contract Balance',contractBalance);

		//check account 0 balance before pickWinner
		account0BeforeBalance = await web3.eth.getBalance(accounts[0]);
		console.log('Accout 0 or Manager balance', account0BeforeBalance);

		//call pickWinner and send the money to accounts 1
		await lottery.methods.pickWinner().send({
			from: accounts[0]
		}) 

		//check account 0 balance before pickWinner
		account0afterBalance = await web3.eth.getBalance(accounts[0]);
		console.log('Accout 0 or Manager balance', account0afterBalance);


		//check final balance of accounts 1 after pickWinner
		const finalBalance = await web3.eth.getBalance(accounts[1]);
		console.log('Account 1 final balance',finalBalance);
		console.log ('Gas to pay by Account 1',  initialBalance - finalBalance);

		finalContractBalance = await web3.eth.getBalance(lottery.options.address);
		console.log('Final Contract Balance',finalContractBalance);
		//assert
		assert.equal(initialContractBalance, finalContractBalance);
	});
});
















































