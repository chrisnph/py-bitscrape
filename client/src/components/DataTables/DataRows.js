import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { setInterval } from "timers";

const Rows = styled.div`
  @import url("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

  & .row {
    min-height: 60px;
    display: flex;
    align-items: center;
  }
  & .row.datarow-header {
    max-height: 60px;
  }
  & .wrapper-datarow.hidden {
    display: none;
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
  & > div:nth-child(odd):not(.datarow-header):not(.actionrow) {
    background-color: #eee;
  }
  & .datarow-info {
    margin: 15px auto;
    box-shadow: 2px -2px 6px #fff;
    position: fixed;
    z-index: 1;
    width: 95%;
    height: 90%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgb(248, 248, 248);
    border-radius: 10px;
    overflow-y: scroll !important;

    & #info-close {
      position: fixed;
      top: 1.5%;
      right: 1.5%;
      color: red;
      background: transparent;
      font-size: 34px;
      box-shadow: none;
      border: none;
      outline: none;
      filter: drop-shadow(-1px 1px 2px #000);
    }
    & #info-close:hover {
      filter: drop-shadow(-1px 1px 1px #000);
    }

    & .userimg {
      max-width: 100%;
    }
  }
`;

const DataRows = props => {
  let dataSorting = (a, b) => {
    return a.props.children[3].props.children.toLowerCase().includes("today") ? -1 : 1;
  };

  const dataDisplay = props.dataRow
    .map((row, index) => {
      return (
        <div
          key={index}
          className={`row wrapper-datarow py-2 ${props.dataHidden.includes(
            row.source
          ) && "hidden"}`}
        >
          <div className="col-md-5">
            <a
              href="#"
              onClick={e =>
                props.toggleInfo({ e, info: row.info, close: false })
              }
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
            <button
              className="btn btn-warning btn-sm rounded-circle"
              onClick={e => props.isVisible(e)}
            >
              <i className="fa fa-eye-slash" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      );
    })
    .sort(dataSorting);

  return (
    <Rows className="container-fluid mb-5">
      <div className="row datarow datarow-header py-2">
        <div className="col-md-5">Thread</div>
        <div className="col-md-1">Source</div>
        <div className="col-md-2">Algo</div>
        <div className="col-md-2">Last Post</div>
        <div className="col-md-1"></div>
      </div>
      {dataDisplay}
    </Rows>
  );
};

export default DataRows;
