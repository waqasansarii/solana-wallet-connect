import logo from './logo.svg'
import './App.css'
import {
  Cluster,
  clusterApiUrl,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { useState } from 'react'

function App() {
  let [address, setAddress] = useState(null)

  const solanaConnect = async () => {
    if (window.solana && window.solana.isPhantom) {
      const resp = await window.solana.connect()
      
      setAddress(resp.publicKey.toString())

    } else {
      console.log('install solana')
    }
  }

  const disConnect = async ()=>{
    const {solana} = window;
    if(address){
      await solana.disconnect()
      setAddress(null)
    }
  }

  const transaction = async ()=>{


    let conn = new Connection(clusterApiUrl('mainnet-beta'), 'processed')
    const recieveWallet = new PublicKey(
      'JA9hZPS4zZ6Sc7pfUFbUA4MEgkrBwKqUvSChTBwuA8uz',
    )
      var trans = new Transaction().add(
        SystemProgram.transfer({
          from: address,
          toPubKey: recieveWallet,
          lamports: 10000000 * 50,
        }),
      )
      trans.feePayer = address
      let blockchain =await conn.getRecentBlockhash()
      trans.recentBlockhash = await blockchain.blockhash

      const {signature} = await window.solana.signAndSendTransaction(trans)
      await conn.confirmTransaction(signature)

  }

  return (
    <div className="App">
      {address === null ? (
        <button onClick={solanaConnect}>solana connect</button>
      ) : (
        <>
          <button onClick={disConnect}>Disconnect</button>
          <p>Connected : {address} </p>
          <button onClick={transaction}>Transaction</button>
        </>
      )}
    </div>
  )
}

export default App
