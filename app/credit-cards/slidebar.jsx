import React, { useEffect, useRef, useState } from "react";

const DoubleRangeSlider = ({ onRangeChange }) => {
  const [minValue, setMinValue] = useState(0);
  const [maxValue, setMaxValue] = useState(100);
  const rangeTrackRef = useRef(null);
  const minBubbleRef = useRef(null);
  const maxBubbleRef = useRef(null);

  // Update track and bubbles on value change
  useEffect(() => {
    const minPercent = (minValue / 100) * 100;
    const maxPercent = (maxValue / 100) * 100;

    if (rangeTrackRef.current) {
      rangeTrackRef.current.style.left = `${minPercent}%`;
      rangeTrackRef.current.style.right = `${100 - maxPercent}%`;
    }

    if (minBubbleRef.current) {
      minBubbleRef.current.style.left = `calc(${minPercent}% - 1rem)`;
    }
    if (maxBubbleRef.current) {
      maxBubbleRef.current.style.right = `calc(${100 - maxPercent}% - .8rem)`;
    }
    onRangeChange(minValue, maxValue);
  }, [minValue, maxValue]);

  return (
    <div className="flex items-center justify-center">
      <div className="relative w-[500px] rounded-[20px] flex items-center justify-center">
        <div className="relative w-[90%] h-[8px] bg-gray-300 rounded-[20px]">
          {/* Range track */}
          <span
            ref={rangeTrackRef}
            className="absolute h-full bg-[#7ebdcb] rounded-[20px]"
            id="range_track"
          ></span>

          {/* Min Range Input */}
          <input
            type="range"
            className="absolute w-[100%] h-[5px] bg-transparent appearance-none pointer-events-none top-1/2 -translate-y-1/2"
            min="0"
            max="100"
            value={minValue}
            step="1"
            onChange={(e) => {
              const val = Math.min(Number(e.target.value), maxValue - 1);
              setMinValue(val);
            }}
            style={{
              WebkitAppearance: "none",
            }}
          />
          {/* Max Range Input */}
          <input
            type="range"
            className="absolute w-[100%] h-[5px] bg-transparent appearance-none pointer-events-none top-1/2 -translate-y-1/2"
            min="0"
            max="100"
            value={maxValue}
            step="1"
            onChange={(e) => {
              const val = Math.max(Number(e.target.value), minValue + 1);
              setMaxValue(val);
            }}
            style={{
              WebkitAppearance: "none",
            }}
          />

          {/* Custom Thumb Styling */}
         

          {/* Min Value Bubble */}
          <div
            ref={minBubbleRef}
            className="absolute bottom-0 px-[.8rem] py-1 text-[11px] mr-[-5px] text-white  bg-[#5d5c58] rounded-full transform translate-y-[-100%] transition-all duration-300"
          >
            {minValue}
          </div>

          {/* Max Value Bubble */}
          <div
            ref={maxBubbleRef}
            className="absolute bottom-0 px-[.8rem] py-1 mr-[5px] text-[11px] text-white  bg-[#5d5c58] rounded-full transform translate-y-[-100%] transition-all duration-300"
          >
            {maxValue}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoubleRangeSlider;
