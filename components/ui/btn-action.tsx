import React from 'react';

export type ShowButtonProps = {
  onClick?: () => void;
};

export function ShowButton({ onClick }: ShowButtonProps) {
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
interface UpdateButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}
export function UpdateButton({ ...props }: UpdateButtonProps) {
  return (
    <button
    {...props}
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
      {/* "Before" layer */}
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

      {/* "After" layer */}
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

export function DeleteButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <>
      <button 
        type='button' 
        className="bin-button" 
        {...props}
      >
        <svg
          className="bin-top"
          viewBox="0 0 39 7"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <line y1="5" x2="39" y2="5" stroke="white" strokeWidth={4} />
          <line
            x1="12"
            y1="1.5"
            x2="26.0357"
            y2="1.5"
            stroke="white"
            strokeWidth={3}
          />
        </svg>
        <svg
          className="bin-bottom"
          viewBox="0 0 33 39"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <mask id="path-1-inside-1_8_19" fill="white">
            <path d="M0 0H33V35C33 37.2091 31.2091 39 29 39H4C1.79086 39 0 37.2091 0 35V0Z" />
          </mask>
          <path
            d="M0 0H33H0ZM37 35C37 39.4183 33.4183 43 29 43H4C-0.418278 43 -4 39.4183 -4 35H4H29H37ZM4 43C-0.418278 43 -4 39.4183 -4 35V0H4V35V43ZM37 0V35C37 39.4183 33.4183 43 29 43V35V0H37Z"
            fill="white"
            mask="url(#path-1-inside-1_8_19)"
          />
          <path d="M12 6L12 29" stroke="white" strokeWidth={4} />
          <path d="M21 6V29" stroke="white" strokeWidth={4} />
        </svg>
      </button>

      <style jsx>{`
        .bin-button {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background-color: #FF3B30;
          cursor: pointer;
          border: none;
          transition-duration: 0.3s;
        }

        .bin-bottom {
          width: 15px;
        }

        .bin-top {
          width: 17px;
          transform-origin: right;
          transition-duration: 0.3s;
        }

        .bin-button:hover .bin-top {
          transform: rotate(45deg);
        }

        .bin-button:hover {
          background-color: #FFA29D;
        }

        .bin-button:active {
          transform: scale(0.9);
        }
      `}</style>
    </>
  );
}
export default DeleteButton;
