import React from "react";

type PollingLocationProps = {
  pollingLocation: {
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
};

const PollingLocation: React.FC<PollingLocationProps> = ({
  pollingLocation,
}) => {
  return (
    <div className="w-full rounded-lg border border-gray-300 p-4">
      <p>{pollingLocation.address.locationName}</p>
      <p>
        {pollingLocation.address.line1}, {pollingLocation.address.city},{" "}
        {pollingLocation.address.state} {pollingLocation.address.zip}
      </p>
      {pollingLocation.startDate === pollingLocation.endDate ? (
        <>
          {pollingLocation.endDate && (
            <p>Election Day: {pollingLocation.endDate}</p>
          )}
        </>
      ) : (
        <>
          <p>Start Date: {pollingLocation.startDate}</p>
          <p>End Date: {pollingLocation.endDate}</p>
        </>
      )}
      <p>{pollingLocation.pollingHours}</p>
    </div>
  );
};

export default PollingLocation;
