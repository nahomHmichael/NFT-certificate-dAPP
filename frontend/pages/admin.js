import Router from "next/router";
import React, { useContext } from "react";
import { AiFillPlayCircle } from "react-icons/ai";
import { AlgoContext } from "../provider/context";

function Admin() {
  const { CheckAlgoSigner, ConnectAlgoSigner, currentAccount } =
    useContext(AlgoContext);

  console.log("account =", currentAccount);

  return (
    <div className="bg-bg-img w-screen h-screen">
      <button onClick={() => {}}></button>
      <div className="flex w-full justify-center items-center h-full">
        <div className="flex mf:flex-row flex-col items-start justify-center h-full  ">
          {currentAccount ? (
            <div></div>
          ) : (
            <button
              type="button"
              onClick={ConnectAlgoSigner}
              className="flex flex-row justify-center items-center  px-6 my-5 bg-[#c8cec8] p-3 rounded-full cursor-pointer hover:bg-[#2e3036] hover:text-white"
            >
              <AiFillPlayCircle className="text-black mr-2" />
              <p className="text-black hover:text-white  text-base font-bold">
                Connect Wallet
              </p>
            </button>
          )}

          <button
            onClick={() => Router.push("/createAsset")}
            className="flex flex-row justify-center items-center font-bold my-5 bg-[#c8cec8] px-6 p-3 rounded-full cursor-pointer  hover:bg-[#2e3036] hover:text-white text-black"
          >
            {" "}
            <AiFillPlayCircle className="text-black mr-2" />
            <p>Create an Asset</p>
          </button>
          <button
            onClick={() => Router.push("/register")}
            className="flex flex-row justify-center items-center font-bold my-5 bg-[#c8cec8]  px-6 p-3 rounded-full cursor-pointer hover:bg-[#2e3036] hover:text-white text-black"
          >
            {" "}
            <AiFillPlayCircle className="text-black mr-2" />
            Register Student
          </button>
          <button
            onClick={() => Router.push("/optinList")}
            className="flex flex-row justify-center items-center font-bold my-5 bg-[#c8cec8]  px-6 p-3 rounded-full cursor-pointer hover:bg-[#2e3036] hover:text-white text-black"
          >
            {" "}
            <AiFillPlayCircle className="text-black mr-2" />
            Optin List
          </button>
        </div>

        <div className="flex mt-10"></div>
      </div>
    </div>
  );
}

export default Admin;
