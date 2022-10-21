import React from "react";
import Header from "../../components/header";

type OfficialProfileProps = {
  message: string;
};

const OfficialProfile: React.FC<OfficialProfileProps> = ({ message }) => {
  return (
    <>
      <Header message="Productive" />
      <div>{message}</div>
    </>
  );
};

export default OfficialProfile;
