import React, { useState, useEffect } from "react";
import styled from "styled-components";
import jsonData from "./threads.json";
import { setInterval } from "timers";

const Rows = styled.div`
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

  & .row {
    min-height: 60px;
    max-height: 60px;
    display: flex;
    align-items: center;
  }
  & .datarow {
    font-size: 18px;
  }
  & .datarow-header {
    background: #000;
    color: #fff;
    font-weight: 700;
  }
  & .datarow:not(.datarow-header) {
    font-size: 14px;
  }
  & > div:nth-child(odd):not(.datarow-header) {
    background-color: #eee;
  }
`;

const DataRows = props => {
  // json data state
  const [dataRows, updatedataRows] = useState(jsonData);

  let dataDisplay = data => {
    return data.map((row, index) => {
      return (
        <div key={index} className="row py-2">
          <div className="col-md-5">
            <a
              href="#"
              onClick={e => e.preventDefault()}
              className="datarow datarow-title"
            >
              {row.title}
            </a>
          </div>
          <div className="col-md-1">
            <a
              href={row.source}
              target="_blank"
              className="datarow datarow-source"
            >
              BitCoinTalk
            </a>
          </div>
          <div className="col-md-2">{row.algo.join(" | ")}</div>
          <div className="col-md-3">{row["Post Date"]}</div>
          <div className="col-md-1">
            <button className="btn btn-warning btn-sm">
              <i className="fa fa-eye-slash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      );
    });
  };

  // html data row state
  const [displayRows, handleDisplayRows] = useState(dataDisplay(dataRows));

  useEffect(() => {
    setInterval(() => {
      fetch("src/components/DataTables/threads.json", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        }
      })
        .then(res => {
          return res.json();
        })
        .then(newData => {
          dataRows !== newData && handleDisplayRows(dataDisplay(newData));
        });
    }, 2000);
  }, [dataRows]);

  return (
    <Rows className="container-fluid p-3 mt-3">
      <div className="row datarow datarow-header py-2">
        <div className="col-md-5">Thread</div>
        <div className="col-md-1">Source</div>
        <div className="col-md-2">Algo</div>
        <div className="col-md-2">Post Date</div>
        <div className="col-md-1"></div>
      </div>
      {displayRows}
    </Rows>
  );
};

export default DataRows;
