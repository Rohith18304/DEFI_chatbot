import React, { useState, useEffect } from 'react';
import { AE_AMOUNT_FORMATS } from '@aeternity/aepp-sdk';
import useAeternitySDK from '../hooks/useAeternitySDK';
import Spend from './Spend';
import Chatbot from './ChatbotSample';
import './connectwallet.css'; // Ensure you have appropriate styles for the connect wallet button
import './chatbotbutton.css'; // Ensure you have appropriate styles for the chatbot button

const ConnectWallet = () => {
  const { aeSdk, connectToWallet, address, networkId, getBalance } = useAeternitySDK();
  const [balance, setBalance] = useState(null);
  const [showChatbot, setShowChatbot] = useState(false);

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const balance = await aeSdk.getBalance(address, { format: AE_AMOUNT_FORMATS.AE });
        setBalance(balance);
      } catch (error) {
        console.error(error.message);
      }
    };

    if (address) {
      fetchBalance();
    }
  }, [aeSdk, address, getBalance]);

  const handleConnectClick = async () => {
    try {
      await connectToWallet();
    } catch (error) {
      if (!(error instanceof Error)) throw error;
      console.error(error.message);
    }
  };

  const toggleChatbot = () => {
    setShowChatbot(!showChatbot);
  };

  return (
    <div className="container mx-auto mt-8">
      {address ? (
        <React.Fragment>
          <div className="flex flex-col items-center mb-8">
            <p className="text-2xl font-semibold mb-2 text-black">Connected to wallet on network "{networkId}"</p>
            <p className="text-xl mb-4 text-gray-800">Address: {address}</p>
            {balance && (
              <p className="text-xl mb-4 text-gray-800">Balance: {balance}</p>
            )}
          </div>
          <Spend instance={aeSdk} />
          <div className="flex justify-center">
            <button
              className="chatbot-button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={toggleChatbot}
            >
              Chatbot
            </button>
          </div>
          {showChatbot && <Chatbot closeChatbot={toggleChatbot} instance={aeSdk} address={address} />}
        </React.Fragment>
      ) : (
        <React.Fragment>
          <div className="flex flex-col items-center mb-8">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleConnectClick}
            >
              Connect to Wallet
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  );
};

export default ConnectWallet;