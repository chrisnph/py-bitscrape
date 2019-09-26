import React, { useState, useEffect, useLayoutEffect } from "react";
import jsonData from "./threads.json";
import DataRows from "./DataRows";
import styled from "styled-components";

const Table = styled.div`
  margin: 30px 0;
  max-width: 100%;
  overflow-x: hidden;

  & > .actionrow {
    padding: 0 0 20px 20px;
  }

  & .action-hidden {
    visibility: hidden;
  }
`;

const DataTables = () => {
  const [rows, setRows] = useState(jsonData);
  const [rowsHidden, setRowsHidden] = useState(() => {
    return !localStorage.hiddenThreads
      ? []
      : localStorage.hiddenThreads.split(",");
  });

  const handleSorting = newData => {
    return newData;
  };

  useEffect(() => {
    setInterval(() => {
      fetch("src/components/DataTables/threads.json")
        .then(res => {
          return res.json();
        })
        .then(newData => {
          newData = handleSorting(newData);
          rows !== newData && setRows(newData);
        });
    }, 2000);
  }, []);

  const handleThread = (e, clearHidden) => {
    if (clearHidden) {
      document.querySelectorAll(".wrapper-datarow").forEach(el => {
        el.classList.remove("hidden");
      });
      setRowsHidden([]);
      localStorage.removeItem("hiddenThreads");
      return;
    }

    let threadURL = e.target
      .closest(".wrapper-datarow")
      .querySelector(".datarow-source")
      .getAttribute("href");

    e.target.closest(".wrapper-datarow").classList.toggle("hidden");

    setRowsHidden(() => [...rowsHidden, threadURL]);

    localStorage.setItem("hiddenThreads", [...rowsHidden, threadURL]);
  };

  // removes URL no longer in json file list
  useLayoutEffect(() => {
    if (localStorage.hiddenThreads) {
      rowsHidden.forEach(rowHidden => {
        if (!rows.map(row => row.source == rowHidden).includes(true)) {
          let updateHiddeRows = rowsHidden;
          updateHiddeRows.splice(rowsHidden.indexOf(rowHidden), 1);
          setRowsHidden(updateHiddeRows);
          localStorage.setItem("hiddenThreads", [rowsHidden]);
        }
      });
    }
  }, [rows]);

  // toggle info div
  const toggleInfo = row => {
    document.querySelectorAll(".datarow-info").forEach(info => {
      info.remove();
      document.querySelector("body").style.overflow = "auto";
    });

    if (row.close) {
      document.querySelector(".overlay").remove();
      document.querySelector("body").style.backgroundColor = "#fff";
      return;
    } else {
      document.querySelector("body").style.overflow = "hidden";

      let overlayStyle =
        "background: rgba(0, 0, 0, 0.5); position: absolute; min-width: 100vw; min-height: 100vh; top: 0; z-index: 1";

      let overlay = `<div class="overlay" style="${overlayStyle}"></div>`;

      document.querySelector("body").insertAdjacentHTML("afterbegin", overlay);
    }

    row.e.target.closest(".wrapper-datarow").insertAdjacentHTML(
      "afterend",
      `
      <div class="container-fluid datarow-info py-5">
        <button id="info-close">
          <i class="fa fa-times-circle" aria-hidden="true"></i>
        </button>
        ${row.info}
      </div>
    `
    );

    document.querySelector("#info-close").addEventListener("click", () => {
      toggleInfo({ close: true });
    });
  };

  return (
    <Table>
      <div className="row actionrow">
        <small className={`col-3 ${rowsHidden.length < 1 && "action-hidden"}`}>
          <a href="#" onClick={e => handleThread(e, true)}>
            Show all hidden threads [{!rowsHidden ? "0" : rowsHidden.length}]
          </a>
        </small>
      </div>
      <DataRows
        dataRow={rows}
        dataHidden={rowsHidden}
        isVisible={e => handleThread(e)}
        toggleInfo={e => toggleInfo(e)}
      />
    </Table>
  );
};

export default DataTables;
