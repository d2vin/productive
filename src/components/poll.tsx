import React, { useState } from "react";
import axios from "axios";

type PollProps = {
  message: string;
};

const Poll: React.FC<PollProps> = ({ message }) => {
  const [address, setAddress] = useState<string>();

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const electionId = 8000;
    if (!address) return;
    const params = {
      key: "AIzaSyBbNGSQTMQ26iFlBWr_ndxq0FpG6wKbaj8",
      address,
      electionId: electionId,
    };
    axios
      .get("https://www.googleapis.com/civicinfo/v2/voterinfo", { params })
      .then((response) => {
        console.log(response);
      })
      .catch((error) => {
        return error;
      });
  };

  return (
    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
      <div className="flex justify-between">
        <h1>{message}</h1>
        <form onSubmit={onSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={address || ""}
              onChange={(e) => setAddress(e.target.value)}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
      </div>
    </div>
  );
};

export default Poll;
