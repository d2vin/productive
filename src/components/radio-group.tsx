import React from "react";
import { RadioGroup } from "@headlessui/react";

type RadioGroupOptionsProps = {
  selected: {
    name: string;
  };
  setSelected: React.Dispatch<
    React.SetStateAction<
      | {
          name: string;
        }
      | undefined
    >
  >;
};

const RadioGroupOptions: React.FC<RadioGroupOptionsProps> = ({
  selected,
  setSelected,
}) => {
  const plans = [
    { name: "All" },
    { name: "Agriculture and Food" },
    { name: "Animals" },
    { name: "Arts, Culture, Religion" },
    { name: "Civil Rights and Liberties, Minority Issues" },
    { name: "Commerce" },
    { name: "Congress" },
    { name: "Crime and Law Enforcement" },
    { name: "Economics and Public Finance" },
    { name: "Education" },
    { name: "Emergency Management" },
    { name: "Energy" },
    { name: "Environmental Protection" },
    { name: "Families" },
    { name: "Finance and Financial Sector" },
    { name: "Foreign Trade and International Finance" },
    { name: "Government Operations and Politics" },
    { name: "Health" },
    { name: "Housing and Community Development" },
    { name: "Immigration" },
    { name: "International Affairs" },
    { name: "Labor and Employment" },
    { name: "Law" },
    { name: "Native Americans" },
    { name: "Public Lands and Natural Resources" },
    { name: "Science, Technology, Communications" },
    { name: "Social Sciences and History" },
    { name: "Social Welfare" },
    { name: "Sports and Recreation" },
    { name: "Taxation" },
    { name: "Transportation and Public Works " },
    { name: "Water Resources Development" },
  ];

  return (
    <div className="w-full">
      <div className="w-full">
        <RadioGroup
          value={selected}
          onChange={setSelected}
          className="overflow-hidden"
        >
          <div className="flex space-x-4 overflow-x-scroll p-2">
            {plans.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
                value={plan}
                className={({ active }) =>
                  `${
                    active
                      ? "ring-2 ring-white ring-opacity-60 ring-offset-2 ring-offset-sky-300"
                      : ""
                  }
                    relative w-full cursor-pointer rounded-lg px-4 py-2 shadow-md focus:outline-none`
                }
              >
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center">
                    <div className="truncate text-sm">
                      <RadioGroup.Label>{plan.name}</RadioGroup.Label>
                    </div>
                  </div>
                </div>
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  );
};

export default RadioGroupOptions;
