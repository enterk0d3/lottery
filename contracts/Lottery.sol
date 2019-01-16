pragma solidity ^0.4.17; 
contract Lottery {
    address public manager;
    address[] public players;
    function Lottery() public {
        manager = msg.sender;
    }
    
    function enter() public payable {
        require(msg.value > .01 ether);
        
        players.push(msg.sender);
    }
    
    function random() private view returns (uint) {
       return  uint (sha3 (block.difficulty, now, players));
    }
    
    function pickWinner() public restricted {
//        require (msg.sender == manager);
        
        uint index = random() % players.length;
        address winner = players[index];
        winner.transfer(this.balance);
        
        //reset Lottery
        players = new address[](0);
    }
    
    modifier restricted() {
        require (msg.sender == manager);
        _;
    }
    
    function getPlayers() public view returns (address[]) {
        return players;
    }
}