import * as cheerio from "cheerio";
import { useEffect, useState } from "react";
import React from 'react';
import lampLogo from "./assets/WindowUnl-removebg.png";


async function request(name, setStudents) {
  const response = await fetch(
    "https://directory.unl.edu/?format=partial&q=" + encodeURIComponent(name)
  );
  const htmlText = await response.text();
  //console.log(htmlText);
  const $ = cheerio.load(htmlText);
  const students = [];
  if ($("h2").first().text().includes("error")) {
    //return [];
    setStudents([]);
  } else {
    $("a[class=dcf-txt-decor-hover]").each((idx, ref) => {
      const elem = $(ref);
      students.push([elem.text(), elem[0].attribs.href]);
      //console.log(elem.text());
      //console.log(elem[0].attribs.href);
    });
  }

  setStudents(students);
}

function Header(props) {
  const [searchText, setSearchText] = useState("");
  useEffect(() => {
    request(searchText, props.setStudents);
  }, [searchText, props.setStudents]);
  return (
    <div className="p-4 shadow-lg sticky top-0 bg-white">
      <div className="container mx-auto flex items-center justify-between">
        <div>
          <img src={lampLogo} alt="Logo" className="h-12 w-auto" />
        </div>

        <div className="flex-grow px-4">
          <input
            type="text"
            placeholder="Search First Last..."
            className="w-full px-6 py-3 bg-gray-200 rounded-lg focus:outline-red-400 focus:shadow-outline"
            onChange={(evnt) => setSearchText(evnt.target.value)}
          />
        </div>

        <div className="slate-400">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

export default Header;
