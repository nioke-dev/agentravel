import React from 'react';

export type ShowDetailsProps = {
  onClick?: () => void;
};

export default function ShowDetails({ onClick }: ShowDetailsProps) {
  return (
    <>
      <button
        onClick={onClick}
        className={`
        relative overflow-hidden
        w-[40px] h-[40px] rounded-[10px]
        bg-[#377DEC] border-none
        flex items-center justify-center
        shadow-md hover:shadow-lg
        transition-all duration-300
        group
      `}
      >
        {/* Background Blur Layer */}
        <span
          className={`
          absolute
          w-[200%] h-[200%]
          bg-[#87B5FF]
          rounded-full
          filter blur-[10px]
          scale-0 group-hover:scale-100
          transition-all duration-300
          z-10
        `}
        />

        {/* Eye Icon with single blink on hover */}
        <svg
          className={`
          relative z-30
          h-[17px]
          fill-white
          group-hover:blink-once
        `}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <path d="M12 4.5C7.305 4.5 3.135 7.36 1 12c2.135 4.64 6.305 7.5 11 7.5s8.865-2.86 11-7.5c-2.135-4.64-6.305-7.5-11-7.5zm0 12c-2.485 0-4.5-2.015-4.5-4.5S9.515 7.5 12 7.5s4.5 2.015 4.5 4.5S14.485 16.5 12 16.5zm0-7.5a3 3 0 100 6 3 3 0 000-6z" />
        </svg>
      </button>

      <style jsx>{`
        @keyframes blink-once {
          0% { transform: scaleY(1); }
          20% { transform: scaleY(0.1); }
          40% { transform: scaleY(1); }
          100% { transform: scaleY(1); }
        }

        .group:hover .group-hover\:blink-once {
          animation: blink-once 0.6s ease-in-out 1;
          transform-origin: center;
        }
      `}</style>
    </>
  );
}
