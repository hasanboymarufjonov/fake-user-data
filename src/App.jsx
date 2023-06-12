import React, { useState, useEffect } from "react";
import { faker } from "@faker-js/faker";
import seedrandom from "seedrandom";

function App() {
  const [region, setRegion] = useState("Poland");
  const [errorRate, setErrorRate] = useState(0);
  const [seed, setSeed] = useState("");

  const [records, setRecords] = useState([]);

  const generateUserData = () => {
    const userData = [];

    for (let i = 0; i < 20; i++) {
      const index = i + 1;
      const identifier = faker.string.uuid();
      const name = faker.person.fullName();
      const address = faker.location.city();
      const phone = faker.phone.number();

      userData.push({ index, identifier, name, address, phone });
    }

    setRecords(userData);
  };

  const introduceErrors = (data) => {
    const errorData = [...data];
    const totalErrors = Math.round((errorRate / 10) * errorData.length);

    const introduceErrorInString = (str) => {
      const errorTypes = ["delete", "add", "swap"];
      const randomIndex = Math.floor(Math.random() * str.length);
      const randomErrorType =
        errorTypes[Math.floor(Math.random() * errorTypes.length)];

      switch (randomErrorType) {
        case "delete":
          return str.slice(0, randomIndex) + str.slice(randomIndex + 1);
        case "add":
          const randomChar = faker.random.alphaNumeric();
          return (
            str.slice(0, randomIndex) + randomChar + str.slice(randomIndex)
          );
        case "swap":
          if (randomIndex + 1 < str.length) {
            const char1 = str[randomIndex];
            const char2 = str[randomIndex + 1];
            return (
              str.slice(0, randomIndex) +
              char2 +
              char1 +
              str.slice(randomIndex + 2)
            );
          }
          return str;
        default:
          return str;
      }
    };

    for (let i = 0; i < totalErrors; i++) {
      const randomIndex = Math.floor(Math.random() * errorData.length);
      const record = errorData[randomIndex];

      record.name = introduceErrorInString(record.name);
      record.address = introduceErrorInString(record.address);
    }

    setRecords(errorData);
  };

  const generateRandomSeed = () => {
    const randomSeed = Math.floor(Math.random() * 1000);
    setSeed(randomSeed.toString());
  };

  const handleRegionChange = (event) => {
    const generateUserData = () => {
      const userData = [];

      for (let i = 0; i < 20; i++) {
        const index = i + 1;
        const identifier = faker.string.uuid();
        const name = faker.person.fullName();
        const address = faker.location.city();
        const phone = faker.phone.number();

        userData.push({ index, identifier, name, address, phone });
      }

      setRecords(userData);
    };
    setRegion(event.target.value);
  };

  const handleErrorRateChange = (event) => {
    setErrorRate(Number(event.target.value));
  };

  const handleRandomClick = () => {
    generateRandomSeed();
  };

  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      const nextRecords = [];

      for (let i = 0; i < 10; i++) {
        const index = records.length + i + 1;
        const identifier = faker.string.uuid();
        const name = faker.person.fullName();
        const address = faker.location.city();
        const phone = faker.phone.number();

        nextRecords.push({ index, identifier, name, address, phone });
      }
      setTimeout(() => {
        setRecords((prevRecords) => [...prevRecords, ...nextRecords]);
        setIsLoading(false);
      }, 500);
      setRecords((prevRecords) => [...prevRecords, ...nextRecords]);
    }
  };

  useEffect(() => {
    generateUserData();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    faker.constructor = region.toLowerCase();
    const random = seedrandom(seed);
    faker.seed(random());

    generateUserData();
  }, [region, errorRate, seed]);

  return (
    <div className="container">
      <h1 className="">Fake User Data Generator</h1>
      <div className="row">
        <div className="col">
          <label htmlFor="region">Region:</label>
          <select
            id="region"
            className="form-select"
            value={region}
            onChange={handleRegionChange}
          >
            <option value="Poland">Poland</option>
            <option value="USA">USA</option>
            <option value="Georgia">Georgia</option>
          </select>
        </div>
        <div className="col">
          <label htmlFor="errorRate">Error Rate:</label>
          <input
            type="range"
            id="errorRate"
            className="form-range"
            min="0"
            max="10"
            value={errorRate}
            onChange={handleErrorRateChange}
          />
          <p>{errorRate} error(s) per record</p>
        </div>
        <div className="col">
          <label htmlFor="seed">Seed:</label>
          <input
            type="text"
            id="seed"
            className="form-control"
            value={seed}
            onChange={(event) => setSeed(event.target.value)}
          />
          <button className="btn btn-primary mt-2" onClick={handleRandomClick}>
            Random
          </button>
        </div>
      </div>
      <table className="table mt-4 border-2 border-black">
        <thead>
          <tr>
            <th>Index</th>
            <th>Random Identifier</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
          </tr>
        </thead>
        <tbody>
          {records.map((record) => (
            <tr key={record.index}>
              <td>{record.index}</td>
              <td>{record.identifier}</td>
              <td>{record.name}</td>
              <td>{record.address}</td>
              <td>{record.phone}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="btn btn-primary mt-4">Export to CSV</button>
    </div>
  );
}

export default App;
