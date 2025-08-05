'use client'

import { Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/20/solid'
import { MapPin } from 'lucide-react'
import { useCountry } from '@/contexts/CountryContext'
import { countries } from '@/lib/countries'

export default function CountrySelector() {
  const { country, setCountry } = useCountry()

  return (
    <Listbox value={country} onChange={setCountry}>
      <div className="relative">
        <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-white py-2 pl-3 pr-10 text-left shadow-sm ring-1 ring-inset ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 sm:text-sm">
          <span className="flex items-center">
            <span className="text-lg mr-2">{country.flag}</span>
            <span className="block truncate">{country.name}</span>
            {!country.name.includes(`(${country.currency})`) && (
              <span className="ml-2 text-gray-500">({country.currency})</span>
            )}
          </span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
          </span>
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {countries.map((countryOption) => (
              <Listbox.Option
                key={countryOption.code}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={countryOption}
              >
                {({ selected, active }) => (
                  <>
                    <span className="flex items-center">
                      <span className="text-lg mr-2">{countryOption.flag}</span>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {countryOption.name}
                      </span>
                      {!countryOption.name.includes(`(${countryOption.currency})`) && (
                        <span className="ml-2 text-gray-500">({countryOption.currency})</span>
                      )}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-blue-600' : 'text-blue-600'
                        }`}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}

export function CountrySelectorCompact() {
  const { country, setCountry } = useCountry()

  return (
    <Listbox value={country} onChange={setCountry}>
      <div className="relative">
        <Listbox.Button className="relative flex items-center cursor-pointer rounded-lg bg-transparent hover:bg-gray-100 py-1.5 px-2 text-sm text-gray-700 focus:outline-none">
          <MapPin className="h-4 w-4 mr-1.5 text-gray-500" />
          <span className="text-base mr-1">{country.flag}</span>
          <span className="font-medium">{country.code}</span>
          <ChevronUpDownIcon className="h-4 w-4 ml-1 text-gray-400" aria-hidden="true" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute right-0 z-10 mt-1 max-h-60 w-64 overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {countries.map((countryOption) => (
              <Listbox.Option
                key={countryOption.code}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-blue-100 text-blue-900' : 'text-gray-900'
                  }`
                }
                value={countryOption}
              >
                {({ selected, active }) => (
                  <>
                    <span className="flex items-center">
                      <span className="text-base mr-2">{countryOption.flag}</span>
                      <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                        {countryOption.name}
                      </span>
                      {!countryOption.name.includes(`(${countryOption.currency})`) && (
                        <span className="ml-1 text-xs text-gray-500">({countryOption.currency})</span>
                      )}
                    </span>
                    {selected ? (
                      <span
                        className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                          active ? 'text-blue-600' : 'text-blue-600'
                        }`}
                      >
                        <CheckIcon className="h-4 w-4" aria-hidden="true" />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}