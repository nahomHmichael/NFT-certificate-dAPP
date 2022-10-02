import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import Table from "react-bootstrap/Table";

import { AlgoContext } from "../provider/context";

function optinList() {
  const { transferAsset } = useContext(AlgoContext);
  const [optinList, setOptinList] = useState([]);

  // console.log(optinList)

  useEffect(() => {
    axios
      .get("http://localhost:8000/optin/")
      .then((res) => setOptinList(res.data));
  }, []);

  const handleApprove = (assetId, addr) => {
    transferAsset(addr, assetId);
  };

  return (
    <div className="h-screen w-screen  flex items-center justify-center">
      <div className="w-[800px] ">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Account</th>
              <th>AssetId</th>
            </tr>
          </thead>
          <tbody>
            {optinList.map((req) => {
              return (
                <tr>
                  <td>{req.id}</td>
                  <td>{req.name}</td>
                  <td>{req.email}</td>
                  <td>{req.account}</td>
                  <td>{req.assetId}</td>
                  <td>
                    <button
                      className="m-2 mt-2 text-white bg-transparent hover:bg-white-500 text-black-700 font-semibold hover:text-blue-400 py-2 px-2 border border-white-500 hover:border-blue-300 rounded"
                      onClick={(e) => {
                        handleApprove(req.assetId, req.account);
                      }}
                    >
                      approve
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      </div>
    </div>
  );
}

export default optinList;
