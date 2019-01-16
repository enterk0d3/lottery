const path = require ('path'); //daripada menuliskan path langsung ke file, menggunakan ini akan mendpaatkan cross platform compability
const fs = require ('fs');
const solc = require('solc');

const lotteryPath = path.resolve(__dirname, 'contracts', 'Lottery.sol');
const source = fs.readFileSync(lotteryPath, 'utf8');


module.exports = solc.compile(source, 1).contracts[':Lottery']; //compile file source dan jumlah contract yang di-compile dan export supaya bisa diimport 
