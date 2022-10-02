import algosdk from "algosdk";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export const AlgoContext = React.createContext();

export const AlgoProvider = ({ children }) => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [optinList, setOptinList] = useState([]);

  const optinRequest = (name, address) => {
    setOptinList((optinList) => [
      ...optinList,
      {
        id: 1,
        name: name,
        address: address,
      },
    ]);

    console.log("request successfully sent", optinList);
  };

  const createAccount = function () {
    try {
      // let account1_mnemonic = "goat march toilet hope fan federal around nut drip island tooth mango table deal diesel reform lecture warrior tent volcano able wheel marriage absorb minimum";
      // const myaccount = algosdk.mnemonicToSecretKey(account1_mnemonic);
      const myaccount = algosdk.generateAccount();
      console.log("Account Address = " + myaccount.addr);
      let account_mnemonic = algosdk.secretKeyToMnemonic(myaccount.sk);
      console.log("Account Mnemonic = " + account_mnemonic);
      console.log("Account created. Save off Mnemonic and address");
      console.log("Add funds to account using the TestNet Dispenser: ");
      console.log(
        "https://dispenser.testnet.aws.algodev.network/?account=" +
          myaccount.addr
      );

      return myaccount;
    } catch (err) {
      console.log("err", err);
    }
  };
  const CheckAlgoSigner = () => {
    try {
      if (typeof AlgoSigner !== "undefined") {
        console.log("installed");
      } else {
        return alert("please install algo signer");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const createAsset = async (req) => {
    try {
      // upload asset to IPFS
      const sk = algosdk.mnemonicToSecretKey(process.env.NEXT_PUBLIC_MNEMO1);

      const upfsUrl =
        "https://gateway.pinata.cloud/ipfs/QmaNsbBW2ZVwdvonkwUvYmfBvkX4HZKpgYgTV4iYMsVryw";

      const algod_address = process.env.NEXT_PUBLIC_ALGOD_SERVER;

      const pub_1 = process.env.NEXT_PUBLIC_PUBLIC_KEY1;
      const token = {
        "X-API-Key": process.env.NEXT_PUBLIC_TOKEN,
      };
      // let algodclient = new algosdk.Algod(algod_token, algod_address);
      let algodclient = new algosdk.Algodv2(token, algod_address, "");

      let params = await algodclient.getTransactionParams().do();

      let note = undefined;
      let addr = pub_1;
      // Whether user accounts will need to be unfrozen before transacting
      let defaultFrozen = false;
      // integer number of decimals for asset unit calculation
      let decimals = 0;
      // total number of this asset available for circulation
      let totalIssuance = 1;
      // Used to display asset units to user
      let unitName = "Tenx NFT";
      // Friendly name of the asset
      let assetName = "jer";

      // let assetName = `${req.body.name}'s Asset`;
      // Optional string pointing to a URL relating to the asset
      let assetURL = upfsUrl;
      // Optional hash commitment of some sort relating to the asset. 32 character length.
      let assetMetadataHash = "16efaa3924a6fd9d3a4824799a4ac65d";
      let manager = pub_1;
      let reserve = pub_1;
      // Specified address can freeze or unfreeze user asset holdings
      let freeze = pub_1;
      // Specified address can revoke user asset holdings and send
      // them to other addresses
      let clawback = pub_1;

      // signing and sending "txn" allows "addr" to create an asset
      // makeAssetCreateTxnWithSuggestedParamsFromObject;
      let txn = algosdk.makeAssetCreateTxnWithSuggestedParams(
        addr,
        note,
        totalIssuance,
        decimals,
        defaultFrozen,
        manager,
        reserve,
        freeze,
        clawback,
        unitName,
        assetName,
        assetURL,
        assetMetadataHash,
        params
      );

      let signedTxn = algosdk.signTransaction(txn, sk.sk);
      const sendTx = await algodclient.sendRawTransaction(signedTxn.blob).do();
      console.log("Transaction sent with ID " + sendTx.txId);
      // const ptx = await waitForConfirmation(algodclient, sendTx.txId);
      const ptx = await algosdk.waitForConfirmation(
        algodclient,
        sendTx.txId,
        4
      );
      const assetID = ptx["asset-index"];
      console.log("THE ASSET ID IS: ", assetID);
      // Update the traineeModel by ID and change Mint field to Minted
    } catch (err) {
      console.log("SOME ERROR HAS OCCURED: ", err);
    }
  };

  const transferAsset = async (addr, assetId) => {
    try {
      const sk = algosdk.mnemonicToSecretKey(process.env.NEXT_PUBLIC_MNEMO1);

      const upfsUrl =
        "https://gateway.pinata.cloud/ipfs/QmaNsbBW2ZVwdvonkwUvYmfBvkX4HZKpgYgTV4iYMsVryw";

      const algod_address = process.env.NEXT_PUBLIC_ALGOD_SERVER;

      const pub_1 = process.env.NEXT_PUBLIC_PUBLIC_KEY1;
      const token = {
        "X-API-Key": process.env.NEXT_PUBLIC_TOKEN,
      };

      const pub_2 = addr;

      // let algodclient = new algosdk.Algod(algod_token, algod_address);
      let algodclient = new algosdk.Algodv2(token, algod_address, "");
      let params = await algodclient.getTransactionParams().do();

      let sender = pub_1;
      let recipient = pub_2;
      let revocationTarget = undefined;
      let closeRemainderTo = undefined;
      let note = undefined;
      let assetID = assetId;
      //Amount of the asset to transfer
      let amount = 1;

      // signing and sending "txn" will send "amount" assets from "sender" to "recipient"
      let xtxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        sender,
        recipient,
        closeRemainderTo,
        revocationTarget,
        amount,
        note,
        assetID,
        params
      );
      //Must be signed by the account sending the asset
      let rawSignedTxn = xtxn.signTxn(sk.sk);
      let xtx = await algodclient.sendRawTransaction(rawSignedTxn).do();

      // Wait for confirmation
      let confirmedTxn = await algosdk.waitForConfirmation(
        algodclient,
        xtx.txId,
        4
      );
      //Get the completed Transaction
      console.log(
        "Transaction " +
          xtx.txId +
          " confirmed in round " +
          confirmedTxn["confirmed-round"]
      );

      // You should now see the 1 assets listed in the account information
      console.log("Successfuly transferred asset");
    } catch (err) {
      console.log("SOME ERROR HAS OCCURED: ", err);
    }
  };

  const ConnectAlgoSigner = async () => {
    try {
      if (typeof AlgoSigner == "undefined")
        return alert("please install algo signer");

      AlgoSigner.connect();
      const account = await AlgoSigner.accounts({
        ledger: "TestNet",
      });
      if (account.length) {
        console.log(account);
        console.log(account[0].address);
        const addr = account[0].address;
        setCurrentAccount(addr);
        // window.location.reload();
      } else {
        console.log("no account");
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    CheckAlgoSigner();
    ConnectAlgoSigner();
  }, []);

  return (
    <AlgoContext.Provider
      value={{
        CheckAlgoSigner,
        ConnectAlgoSigner,
        createAsset,
        currentAccount,
        optinList,
        optinRequest,
        setOptinList,
        transferAsset,
      }}
    >
      {children}
    </AlgoContext.Provider>
  );
};
