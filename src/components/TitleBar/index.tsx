const TitleBar = () => {
  return (
    <div className="title-bar py-4 px-6 lg:px-12 z-40">
      <div className="grid grid-cols-12 h-full">
        <div className="svg col-span-6 h-full flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="62"
            height="62"
            viewBox="0 0 62 62"
            fill="none"
          >
            <g filter="url(#filter0_bd_1102_27963)">
              <rect
                x="15"
                y="11"
                width="32"
                height="32"
                rx="4"
                fill="#FF512F"
                shape-rendering="crispEdges"
              />
              <mask
                id="mask0_1102_27963"
                maskUnits="userSpaceOnUse"
                x="21"
                y="17"
                width="20"
                height="20"
              >
                <rect
                  x="21.3999"
                  y="17.3999"
                  width="19.2"
                  height="19.2"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_1102_27963)">
                <path
                  d="M26.2001 34.9997C25.7601 34.9997 25.3834 34.843 25.0701 34.5297C24.7568 34.2164 24.6001 33.8397 24.6001 33.3997V25.3997C24.6001 24.9597 24.7568 24.583 25.0701 24.2697C25.3834 23.9564 25.7601 23.7997 26.2001 23.7997H27.0001V22.1997C27.0001 21.093 27.3901 20.1497 28.1701 19.3697C28.9501 18.5897 29.8934 18.1997 31.0001 18.1997C32.1068 18.1997 33.0501 18.5897 33.8301 19.3697C34.6101 20.1497 35.0001 21.093 35.0001 22.1997V23.7997H35.8001C36.2401 23.7997 36.6168 23.9564 36.9301 24.2697C37.2434 24.583 37.4001 24.9597 37.4001 25.3997V33.3997C37.4001 33.8397 37.2434 34.2164 36.9301 34.5297C36.6168 34.843 36.2401 34.9997 35.8001 34.9997H26.2001ZM31.0001 30.9997C31.4401 30.9997 31.8168 30.843 32.1301 30.5297C32.4434 30.2164 32.6001 29.8397 32.6001 29.3997C32.6001 28.9597 32.4434 28.583 32.1301 28.2697C31.8168 27.9564 31.4401 27.7997 31.0001 27.7997C30.5601 27.7997 30.1834 27.9564 29.8701 28.2697C29.5568 28.583 29.4001 28.9597 29.4001 29.3997C29.4001 29.8397 29.5568 30.2164 29.8701 30.5297C30.1834 30.843 30.5601 30.9997 31.0001 30.9997ZM28.6001 23.7997H33.4001V22.1997C33.4001 21.533 33.1668 20.9664 32.7001 20.4997C32.2334 20.033 31.6668 19.7997 31.0001 19.7997C30.3334 19.7997 29.7668 20.033 29.3001 20.4997C28.8334 20.9664 28.6001 21.533 28.6001 22.1997V23.7997Z"
                  fill="#F9F9FA"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_bd_1102_27963"
                x="-35"
                y="-39"
                width="132"
                height="132"
                filterUnits="userSpaceOnUse"
                color-interpolation-filters="sRGB"
              >
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feGaussianBlur in="BackgroundImageFix" stdDeviation="25" />
                <feComposite
                  in2="SourceAlpha"
                  operator="in"
                  result="effect1_backgroundBlur_1102_27963"
                />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="4" />
                <feGaussianBlur stdDeviation="7.5" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
                />
                <feBlend
                  mode="normal"
                  in2="effect1_backgroundBlur_1102_27963"
                  result="effect2_dropShadow_1102_27963"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1102_27963"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          Security
        </div>
        <div className="svg col-span-6 flex items-center justify-end">
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2.39998 18C1.89998 18 1.47498 17.825 1.12498 17.475C0.774976 17.125 0.599976 16.7 0.599976 16.2V2.3C0.599976 1.8 0.774976 1.375 1.12498 1.025C1.47498 0.675 1.89998 0.5 2.39998 0.5H9.12498V2H2.39998C2.33331 2 2.26664 2.03333 2.19998 2.1C2.13331 2.16667 2.09998 2.23333 2.09998 2.3V16.2C2.09998 16.2667 2.13331 16.3333 2.19998 16.4C2.26664 16.4667 2.33331 16.5 2.39998 16.5H9.12498V18H2.39998ZM13.125 13.525L12.1 12.425L14.525 10H6.12498V8.5H14.525L12.1 6.075L13.125 4.975L17.4 9.25L13.125 13.525Z"
              fill="currentColor"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default TitleBar;
