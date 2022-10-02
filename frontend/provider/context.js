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
      // await OptinModel.findOneAndDelete({ asset_id: req.body.asset_id });
      // //  Freeze the asset
      // console.log('Freezing asset...');
      // await freezeAsset(algodclient, sender, recipient, req.body.asset_id, sk);
      // console.log('Asset successfully frozen');
      // const user = {
      //   name: req.body.name,
      //   email: req.body.email,
      // };
      // const assetUrl =
      //   'https://goalseeker.purestake.io/algorand/testnet/asset/' +
      //   req.body.asset_id;
      // await new Email(user, assetUrl).sendAssetConfirmation();
      // res.status(200).json({
      //   status: 'success',
      //   message: 'Asset transferred successfully',
      // });
    } catch (err) {
      console.log("SOME ERROR HAS OCCURED: ", err);
    }
  };

  const ConnectAlgoSigner = async () => {
    try {
      if (typeof AlgoSigner == "undefined")
        return alert("please install algo signer");
      // console.log("conecting.....")
      // let resp = await AlgoSigner.connect()
      // console.log(resp)
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

// const waitForConfirmation = async function (algodClient, txId, timeout) {
//   if (algodClient == null || txId == null || timeout < 0) {
//     throw new Error("Bad arguments");
//   }

//   const status = await algodClient.status().do();
//   if (status === undefined) {
//     throw new Error("Unable to get node status");
//   }

//   const startround = status["last-round"] + 1;
//   let currentround = startround;

//   while (currentround < startround + timeout) {
//     const pendingInfo = await algodClient
//       .pendingTransactionInformation(txId)
//       .do();
//     if (pendingInfo !== undefined) {
//       if (
//         pendingInfo["confirmed-round"] !== null &&
//         pendingInfo["confirmed-round"] > 0
//       ) {
//         //Got the completed Transaction
//         return pendingInfo;
//       } else {
//         if (
//           pendingInfo["pool-error"] != null &&
//           pendingInfo["pool-error"].length > 0
//         ) {
//           // If there was a pool error, then the transaction has been rejected!
//           throw new Error(
//             "Transaction " +
//               txId +
//               " rejected - pool error: " +
//               pendingInfo["pool-error"]
//           );
//         }
//       }
//     }
//     await algodClient.statusAfterBlock(currentround).do();
//     currentround++;
//   }
//   throw new Error(
//     "Transaction " + txId + " not confirmed after " + timeout + " rounds!"
//   );
// };
// const printCreatedAsset = async function (algodClient, account, assetid) {
//   // note: if you have an indexer instance available it is easier to just use this
//   //     let accountInfo = await indexerClient.searchAccounts()
//   //    .assetID(assetIndex).do();
//   // and in the loop below use this to extract the asset for a particular account
//   // accountInfo['accounts'][idx][account]);
//   let accountInfo = await algodClient.accountInformation(account).do();
//   for (idx = 0; idx < accountInfo["created-assets"].length; idx++) {
//     let scrutinizedAsset = accountInfo["created-assets"][idx];
//     if (scrutinizedAsset["index"] == assetid) {
//       console.log("AssetID = " + scrutinizedAsset["index"]);
//       let myparms = JSON.stringify(scrutinizedAsset["params"], undefined, 2);
//       console.log("parms = " + myparms);
//       break;
//     }
//   }
// };
// // Function used to print asset holding for account and assetid
// const printAssetHolding = async function (algodClient, account, assetid) {
//   let accountInfo = await algodClient.accountInformation(account).do();
//   for (idx = 0; idx < accountInfo["assets"].length; idx++) {
//     let scrutinizedAsset = accountInfo["assets"][idx];
//     if (scrutinizedAsset["asset-id"] == assetid) {
//       let myassetholding = JSON.stringify(scrutinizedAsset, undefined, 2);
//       console.log("assetholdinginfo = " + myassetholding);
//       break;
//     }
//   }
// };
// async function createAsset(algodClient, ife) {
//   console.log("");
//   console.log("==> CREATE ASSET");
//   //Check account balance
//   const accountInfo = await algodClient.accountInformation(ife.addr).do();
//   const startingAmount = accountInfo.amount;
//   console.log("Samuel account balance: %d microAlgos", startingAmount);

//   // Construct the transaction
//   const params = await algodClient.getTransactionParams().do();

//   const txn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
//     from: creator.addr,
//     total,
//     decimals,
//     assetName,
//     unitName,
//     assetURL: url,
//     assetMetadataHash: metadata,
//     defaultFrozen,
//     freeze: freezeAddr,
//     manager: managerAddr,
//     clawback: clawbackAddr,
//     reserve: reserveAddr,
//     suggestedParams: params,
//   });

//   const rawSignedTxn = txn.signTxn(creator.sk);
//   const tx = await algodClient.sendRawTransaction(rawSignedTxn).do();
//   let assetID = null;
//   // wait for transaction to be confirmed
//   const confirmedTxn = await waitForConfirmation(algodClient, tx.txId, 4);
//   //Get the completed Transaction
//   console.log(
//     "Transaction " +
//       tx.txId +
//       " confirmed in round " +
//       confirmedTxn["confirmed-round"]
//   );
//   let ptx = await algodClient.pendingTransactionInformation(tx.txId).do();
//   assetID = ptx["asset-index"];
//   // console.log("AssetID = " + assetID);

//   await printCreatedAsset(algodClient, creator.addr, assetID);
//   await printAssetHolding(algodClient, creator.addr, assetID);

//   return { assetID };
// }

// const keypress = async () => {
//   process.stdin.setRawMode(true);
//   return new Promise((resolve) =>
//     process.stdin.once("data", () => {
//       process.stdin.setRawMode(false);
//       resolve();
//     })
//   );
// };

// async function createNFT() {
//   try {
//     let creator = createAccount();
//     console.log("Press any key when the account is funded");
//     await keypress();
//     const algodToken =
//       "2f3203f21e738a1de6110eba6984f9d03e5a95d7a577b34616854064cf2c0e7b";
//     const algodServer = "https://academy-algod.dev.aws.algodev.network";
//     const algodPort = 443;

//     let algodClient = new algosdk.Algodv2(algodToken, algodServer, algodPort);

//     // CREATE ASSET
//     const { assetID } = await createAsset(algodClient, creator);
//     // DESTROY ASSET
//   } catch (err) {
//     console.log("err", err);
//   }
//   process.exit();
// }
// createNFT();
