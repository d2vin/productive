import { Combobox, Transition } from "@headlessui/react";
import { CheckIcon, SearchIcon } from "@heroicons/react/solid";
import {
  SetStateAction,
  Dispatch,
  Fragment,
  useRef,
  useEffect,
  FormEventHandler,
} from "react";
import usePlacesAutocomplete, {
  GeocodeResult,
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";

type PlacesAutocompleteProps = {
  setSelected: Dispatch<SetStateAction<{ lat: number; lng: number }>>;
  setAddress: Dispatch<SetStateAction<string>>;
  onSubmit: FormEventHandler;
  address: string;
};

const PlacesAutocomplete: React.FC<PlacesAutocompleteProps> = ({
  setSelected,
  setAddress,
  address,
  onSubmit,
}) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutocomplete();

  const inputRef =
    useRef<HTMLInputElement>() as React.MutableRefObject<HTMLInputElement>;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSelect = async (address: string) => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    setAddress(address!);
    setValue(address, false);
    clearSuggestions();
    const results = await getGeocode({ address });
    const { lat, lng } = await getLatLng(results[0] as GeocodeResult);
    setSelected({ lat, lng });
  };

  useEffect(() => {
    inputRef?.current?.focus();
  }, [address]);

  return (
    <>
      <div className="absolute left-2.5 top-2 z-10 w-64 transition-all duration-200">
        <Combobox value={address} onChange={handleSelect}>
          <div className="relative mt-1">
            <div className="relative w-full cursor-default overflow-hidden rounded-lg bg-white text-left shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75 focus-visible:ring-offset-2 focus-visible:ring-offset-teal-300 sm:text-sm">
              <Combobox.Input
                type="text"
                ref={inputRef}
                className="w-full border-none py-2 pl-3 pr-10 text-base leading-5 text-gray-900 focus:ring-0"
                placeholder="address"
                onChange={(event) => setValue(event.target.value)}
                value={value}
                disabled={!ready}
                onSubmit={onSubmit}
                autoComplete="off"
              />
              <Combobox.Button className="absolute inset-y-0 right-0 flex items-center pr-2">
                <SearchIcon
                  className="h-5 w-5 text-gray-400 hover:text-gray-900"
                  aria-hidden="true"
                  onClick={onSubmit}
                />
              </Combobox.Button>
            </div>
            {value && (
              <Transition
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
                afterLeave={() => setValue("")}
              >
                <Combobox.Options className="absolute mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {status === "OK" &&
                    data.map(({ place_id, description }) => (
                      <Combobox.Option
                        key={place_id}
                        className={({ active }) =>
                          `relative cursor-default select-none py-2 pl-10 pr-4 ${
                            active ? "bg-gray-300 text-black" : "text-black"
                          }`
                        }
                        value={description}
                      >
                        {({ selected, active }) => (
                          <>
                            <span
                              className={`block truncate ${
                                selected ? "font-medium" : "font-normal"
                              }`}
                            >
                              {description}
                            </span>
                            {selected ? (
                              <span
                                className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                                  active ? "text-white" : "text-teal-600"
                                }`}
                              >
                                <CheckIcon
                                  className="h-5 w-5"
                                  aria-hidden="true"
                                />
                              </span>
                            ) : null}
                          </>
                        )}
                      </Combobox.Option>
                    ))}
                </Combobox.Options>
              </Transition>
            )}
          </div>
        </Combobox>
      </div>
    </>
  );
};

export default PlacesAutocomplete;
