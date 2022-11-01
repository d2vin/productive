import React, { useState, useMemo } from "react";
import axios from "axios";
import { GoogleMap, useLoadScript, InfoWindow } from "@react-google-maps/api";

const Poll: React.FC = () => {
  const [address, setAddress] = useState<string>();
  const [results, setResults] = useState({
    locationName: "",
    line1: "",
    city: "",
    state: "",
    zip: "",
  });
  const [coords, setCoords] = useState<google.maps.LatLngLiteral[]>([]);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_API_KEY as string,
  });

  const center = useMemo(() => ({ lat: 40.7351, lng: -73.9945 }), []);

  const containerStyle = {
    width: "full",
    height: "50vh",
    borderRadius: "10px",
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onSubmit = async (event: any) => {
    event.preventDefault();
    const electionId = 8000;
    setCoords([]);
    if (!address) return;
    const params = {
      key: process.env.NEXT_PUBLIC_GOOGLE_API_KEY,
      address,
      electionId: electionId,
    };
    axios
      .get("https://www.googleapis.com/civicinfo/v2/voterinfo", { params })
      .then((response) => {
        const resAddress = response.data.pollingLocations[0].address;
        setResults({
          locationName: resAddress.locationName,
          line1: resAddress.line1,
          city: resAddress.city,
          state: resAddress.state,
          zip: resAddress.zip,
        });
        const coordsList = [];
        for (let i = 0; i < response.data.pollingLocations.length; i++) {
          coordsList.push({
            lat: response.data.pollingLocations[i].latitude,
            lng: response.data.pollingLocations[i].longitude,
          });
          console.log(i);
        }
        setCoords(coordsList);
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
            Find your polling location
          </label>
          <input
            type="text"
            value={address || ""}
            placeholder="Address"
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-lg border border-gray-300"
          />
          <button
            type="submit"
            className="mt-2 w-full rounded-lg border border-gray-300 px-2"
          >
            Submit
          </button>
        </div>
      </form>
      {isLoaded ? (
        <GoogleMap zoom={10} center={center} mapContainerStyle={containerStyle}>
          {coords.length > 0 &&
            coords.map((coord, k) => (
              <InfoWindow position={coord} key={k}>
                <div className="text-center">
                  <p>{results.locationName}</p>
                  <p>{results.line1}</p>
                  <p>
                    {results.city}, {results.state} {results.zip}
                  </p>
                </div>
              </InfoWindow>
            ))}
        </GoogleMap>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Poll;
