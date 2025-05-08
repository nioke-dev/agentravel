import React from "react";

export default function EditButton() {
  return (
    <button
      className="
        relative overflow-hidden
        w-[40px] h-[40px] rounded-[10px]
        bg-[#FFCC00] border-none
        flex items-center justify-center
        shadow-md hover:shadow-lg
        transition-all duration-300
        group
      "
    >
      {/* “Before” layer */}
      <span
        className="
          absolute
          w-[200%] h-[200%]
          bg-[#FFEC41]
          rounded-full
          filter blur-[10px]
          scale-0 group-hover:scale-100
          transition-all duration-300
          z-10
        "
      />

      {/* “After” layer */}
      <span
        className="
          absolute
          bottom-[10px] left-[-5px]
          w-[25px] h-[1.5px]
          bg-white rounded
          origin-left
          scale-x-0 group-hover:scale-x-100 group-hover:left-0
          transition-transform duration-500 ease-out
          z-20
        "
      />

      {/* Icon */}
      <svg
        className="
          relative z-30
          h-[17px]
          fill-white
          transition-transform duration-200
          transform origin-bottom
          group-hover:-rotate-[15deg] group-hover:translate-x-[5px]
        "
        viewBox="0 0 512 512"
      >
        <path d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"/>
      </svg>
    </button>
  );
}
