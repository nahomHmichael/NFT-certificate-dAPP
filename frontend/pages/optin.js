import { useState, useEffect, useContext, useRef } from "react";

// reactstrap components
import { Input, DropdownItem } from "reactstrap";

import algosdk from "algosdk";
import { AlgoContext } from "../provider/context";
import { Dropdown, DropdownButton } from "react-bootstrap";
import axios from "axios";

function Trainee() {
  const { optinRequest, optinList, setOptinList } = useContext(AlgoContext);

  const name = useRef();
  const email = useRef();
  const assetID = useRef();
  const [accounts, setAccounts] = useState([]);
  const [account, setAccount] = useState("");

  useEffect(() => {
    getAccounts();
  }, []);
  const AccountList = () => {
    return accounts.map((account) => {
      return (
        <DropdownItem
          key={account.address}
          onClick={(e) => {
            setAccount(e.target.innerHTML);
          }}
        >
          {account.address}
        </DropdownItem>
      );
    });
  };
  const getAccounts = async () => {
    await AlgoSigner.connect();
    await AlgoSigner.accounts({
      ledger: "TestNet",
    })
      .then((d) => {
        setAccounts(d);
      })
      .catch((e) => {
        console.error(e);
      });
  };

  //   const optinTx = async (txId) => {
  //     let txConf = await fetch('https://tenxdapp.herokuapp.com/api/v2/nft/opt', {
  //       // Adding method type
  //       method: 'POST',

  //       // Adding body or contents to send
  //       body: JSON.stringify({
  //         txId,
  //         name,
  //         email,
  //         address: account,
  //         asset_id: assetID,
  //       }),

  //       // Adding headers to the request
  //       headers: {
  //         'Content-type': 'application/json; charset=UTF-8',
  //       },
  //     });

  // txConf = await txConf.json();
  // console.log(txConf);
  //   };
  const handleOptin = async () => {
    if (account === "") {
      alert("Please select an account before opting in for an asset!");
      return;
    }

    // optinRequest(name.current,account.current)

    const data = {
      name: name.current,
      email: email.current,
      assetId: parseInt(assetID.current),
      account: account,
    };
    console.log(data);
    await axios
      .post("http://localhost:8000/optin/add", data)
      .then((res) => console.log(res.data));

    // let res = await fetch('https://tenxdapp.herokuapp.com/api/v2/nft/optin', {
    //   // Adding method type
    //   method: 'POST',

    //   // Adding body or contents to send
    //   body: JSON.stringify({
    //     name,
    //     email,
    //     address: account,
    //     asset_id: parseInt(assetID),
    //   }),

    //   // Adding headers to the request
    //   headers: {
    //     'Content-type': 'application/json; charset=UTF-8',
    //   },
    // });
    // res = await res.json();
    // if (res.status === 'fail') {
    //   alert('something happened...');
    //   return;
    // }

    // const txn = new algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    //   from:account,
    //   to:account,
    //   assetIndex:assetID,
    //   note:name,
    // });
    // // Use the AlgoSigner encoding library to make the transactions base64
    // const txn_b64 = await AlgoSigner.encoding.msgpackToBase64(txn.toByte());
    // const signedTxs = await AlgoSigner.signTxn([{ txn: txn_b64 }]);
    // // alert(JSON.stringify(signedTxs, null, 2));
    // alert('successfully signed transaction!');
    // const tx = await AlgoSigner.send({
    //   ledger: 'TestNet',
    //   tx: signedTxs[0].blob,
    // });

    // await optinTx(tx.txId);
    // // .then((res) => res.json())
    // // .then((res) => {
    // //   if (res.status === 'fail') {
    // //     console.log(res);
    // //     alert(res.message);
    // //   } else {
    // //     alert('Request Sent to Admin!');
    // //     window.location.reload(true);
    // //   }
    // // });
  };

  return (
    <div className="h-screen w-screen bg-bg-img flex  justify-center items-center ">
      <div className="flex flex-col w-[600px] ">
        <label>Full Name</label>
        <Input
          placeholder="your-full-name"
          type="text"
          onChange={(e) => (name.current = e.target.value)}
        />

        <label>Email</label>

        <Input
          placeholder="email"
          type="text"
          onChange={(e) => (email.current = e.target.value)}
        />

        <label>Public Address</label>
        <DropdownButton
          id="dropdown-button-dark-example2"
          variant="secondary"
          menuVariant="dark"
          title="Dropdown button"
          className="mt-2"
        >
          {accounts.map((acc) => {
            return (
              <Dropdown.Item
                key={acc.address}
                onClick={(e) => setAccount(e.target.innerHTML)}
              >
                {acc.address}
              </Dropdown.Item>
            );
          })}
        </DropdownButton>

        <label>Asset-ID</label>

        <Input
          placeholder="8594322"
          type="text"
          onChange={(e) => (assetID.current = e.target.value)}
        />

        <button
          className="flex flex-row justify-center items-center font-bold my-5 bg-[#c8cec8]  px-6 p-3 rounded-full cursor-pointer hover:bg-[#2e3036] hover:text-white text-black"
          type="submit"
          onClick={handleOptin}
        >
          Opt-in
        </button>
      </div>
    </div>
  );
}

export default Trainee;
