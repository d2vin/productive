import React from "react";
import { trpc } from "../../utils/trpc";

type IndexProps = {
  message: string;
};

const Index: React.FC<IndexProps> = ({}) => {
  const { data, status } = trpc.example.getAll.useQuery();
  if (status === "loading") {
    return <p>Loading...</p>;
  }
  if (status === "error") {
    return <p>Loading...</p>;
  }
  return <div>{JSON.stringify(data)}</div>;
};

export default Index;
