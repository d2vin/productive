import React, { useState, useMemo } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";

type PollingLocation = {
  address: {
    locationName: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  endDate: string;
  latitude: number;
  longitude: number;
  pollingHours: string;
  startDate: string;
};

const Poll: React.FC = () => {
  const [address, setAddress] = useState<string>();
  const [pollingLocations, setPollingLocations] = useState<PollingLocation[]>(
    []
  );

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);

  const containerStyle = {
    width: "full",
    height: "50vh",
    borderRadius: "10px",
    marginBottom: "1rem",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const electionId = 8000;
    if (!address) return;
    const params = {
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      address,
      electionId: electionId,
    };
    axios
      .get("https://www.googleapis.com/civicinfo/v2/voterinfo", { params })
      .then((response) => {
        console.log(response);
        if (!response.data) return;
        const data = response.data;
        setPollingLocations(data.pollingLocations);
      })
      .catch((error) => {
        return error;
      });
  };

  return (
    <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
      <form onSubmit={onSubmit}>
        <div className="space-y-2">
          <label className="block text-sm font-medium">
            Find your polling location for the US 2022 Midterm Election
          </label>
          <div className="flex space-x-2">
            <input
              type="text"
              value={address || ""}
              placeholder="Address"
              onChange={(e) => setAddress(e.target.value)}
              className="w-full rounded-lg border border-gray-300"
            />
            <button
              type="submit"
              className="w-44 rounded-lg border border-gray-300 hover:bg-gray-300"
            >
              Search
            </button>
          </div>
        </div>
      </form>
      {isLoaded ? (
        <GoogleMap zoom={10} center={center} mapContainerStyle={containerStyle}>
          {pollingLocations.length > 0 &&
            pollingLocations.map((pollingLocation, k) => (
              <InfoWindow
                position={{
                  lat: pollingLocation.latitude,
                  lng: pollingLocation.longitude,
                }}
                key={k}
              >
                <div className="text-center">
                  <p>{pollingLocation.address.locationName}</p>
                  <p>{pollingLocation.address.line1}</p>
                  <p>
                    {pollingLocation.address.city},{" "}
                    {pollingLocation.address.state}{" "}
                    {pollingLocation.address.zip}
                  </p>
                </div>
              </InfoWindow>
            ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
      <label className="my-7 block text-sm font-medium">
        Your polling locations
      </label>
      <div className="my-7 max-w-2xl space-y-2 rounded-lg border bg-white p-4 sm:max-w-6xl">
        {pollingLocations.length > 0 &&
          pollingLocations.map((pollingLocation, k) => (
            <div className="flex justify-between align-middle" key={k}>
              <div>
                <p>{pollingLocation.address.locationName}</p>
                <p>
                  {pollingLocation.address.line1},{" "}
                  {pollingLocation.address.city},{" "}
                  {pollingLocation.address.state} {pollingLocation.address.zip}
                </p>
                {pollingLocation.startDate === pollingLocation.endDate ? (
                  <>
                    <p>Election Day: {pollingLocation.endDate}</p>
                  </>
                ) : (
                  <>
                    <p>Start Date: {pollingLocation.startDate}</p>
                    <p>End Date: {pollingLocation.endDate}</p>
                  </>
                )}
                <p>{pollingLocation.pollingHours}</p>
              </div>
              <button className="self-start rounded-lg border border-gray-300 px-2 hover:bg-gray-300">
                Save
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Poll;
