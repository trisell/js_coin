const { json } = require('body-parser');
const { response } = require('express');

const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function* asyncGenerator() {
  let i = 0;
  while (i < 1000000) {
    yield i++;
  }
}

async function transact() {
  const getSecondNode = await fetch('http:localhost:3002/public-key');
  const pubkey = await getSecondNode.json()
  console.log(`Sending Transaction to ${pubkey.publicKey}`);
  const response = await fetch('http://localhost:3001/transact', {method: 'POST', body: JSON.stringify({recipient: pubkey.publicKey, amount: 10}),headers: { 'Content-Type': 'application/json' }});
  const data = await response.json();
  console.log(data[0].outputs);
}

async function mine(num) {
  console.log(num)
  const response = await fetch('http://localhost:3001/mine-transactions');
  const data = await response.json();
  console.log('Mined another block');
}

async function getBalance() {
  console.log('huh');
  const res = await fetch('http://localhost:3001/wallet-balance');
  const data = await response.json();
  console.log(`Miner Coin Balance ${data.balance}`);
}
(async () => {for await(num of asyncGenerator()){

  await mine(num);
  if(num%2===0){
    await transact();
  }
}})()

//while(i > 0){
//  setTimeout(() => {
//    transact();
//  }, 20000)
//}