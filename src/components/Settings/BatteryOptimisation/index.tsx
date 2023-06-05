import * as React from 'react';
import Button from '../../UI/Button';
import SlideScreen from '../../UI/SlideScreen';

export function BatteryOptimisation({ display, dismiss }: any) {
  return (
    <SlideScreen display={display}>
      <div className="flex flex-col h-full mt-14 bg-black">
        <div className="pt-10 px-6 pb-6 flex flex-col h-full">
          <div onClick={dismiss} className="cursor-pointer mb-4 flex items-center">
            <svg
              className="mt-0.5 mr-4"
              width="8"
              height="14"
              viewBox="0 0 8 14"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M6.90017 13.1693L0.730957 7.00009L6.90017 0.830872L7.79631 1.72701L2.52324 7.00009L7.79631 12.2732L6.90017 13.1693Z"
                fill="#F9F9FA"
              />
            </svg>
            Settings
          </div>
          <div className="mt-6 text-2xl mb-8">Battery optimisation</div>
          <div className="core-black-contrast-2 p-4 rounded">
            <div className="mb-6">
              Lorem ipsum dolor sit amet consectetur. Non massa mauris ut ornare dolor amet. Donec accumsan volutpat
              scelerisque aliquet pretium nam egestas proin.
            </div>
            <Button>Optimise battery</Button>
          </div>
        </div>
      </div>
    </SlideScreen>
  );
}

export default BatteryOptimisation;
