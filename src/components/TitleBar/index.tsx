const TitleBar = () => {
  return (
    <div className="title-bar py-4 px-6 lg:px-12 z-40">
      <div className="grid grid-cols-12 h-full">
        <div className="svg col-span-6 h-full flex items-center font-bold text-lg">
          <svg
            width="62"
            height="62"
            viewBox="0 0 62 55"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_bd_1253_122)">
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
                id="mask0_1253_122"
                maskUnits="userSpaceOnUse"
                x="21"
                y="17"
                width="20"
                height="20"
              >
                <rect
                  x="21.4004"
                  y="17.4"
                  width="19.2"
                  height="19.2"
                  fill="#D9D9D9"
                />
              </mask>
              <g mask="url(#mask0_1253_122)">
                <path
                  d="M26.2006 35.0001C25.7606 35.0001 25.3839 34.8434 25.0706 34.5301C24.7573 34.2167 24.6006 33.8401 24.6006 33.4001V25.4001C24.6006 24.9601 24.7573 24.5834 25.0706 24.2701C25.3839 23.9567 25.7606 23.8001 26.2006 23.8001H27.0006V22.2001C27.0006 21.0934 27.3906 20.1501 28.1706 19.3701C28.9506 18.5901 29.8939 18.2001 31.0006 18.2001C32.1073 18.2001 33.0506 18.5901 33.8306 19.3701C34.6106 20.1501 35.0006 21.0934 35.0006 22.2001V23.8001H35.8006C36.2406 23.8001 36.6173 23.9567 36.9306 24.2701C37.2439 24.5834 37.4006 24.9601 37.4006 25.4001V33.4001C37.4006 33.8401 37.2439 34.2167 36.9306 34.5301C36.6173 34.8434 36.2406 35.0001 35.8006 35.0001H26.2006ZM31.0006 31.0001C31.4406 31.0001 31.8173 30.8434 32.1306 30.5301C32.4439 30.2167 32.6006 29.8401 32.6006 29.4001C32.6006 28.9601 32.4439 28.5834 32.1306 28.2701C31.8173 27.9567 31.4406 27.8001 31.0006 27.8001C30.5606 27.8001 30.1839 27.9567 29.8706 28.2701C29.5573 28.5834 29.4006 28.9601 29.4006 29.4001C29.4006 29.8401 29.5573 30.2167 29.8706 30.5301C30.1839 30.8434 30.5606 31.0001 31.0006 31.0001ZM28.6006 23.8001H33.4006V22.2001C33.4006 21.5334 33.1673 20.9667 32.7006 20.5001C32.2339 20.0334 31.6673 19.8001 31.0006 19.8001C30.3339 19.8001 29.7673 20.0334 29.3006 20.5001C28.8339 20.9667 28.6006 21.5334 28.6006 22.2001V23.8001Z"
                  fill="#F9F9FA"
                />
              </g>
            </g>
            <defs>
              <filter
                id="filter0_bd_1253_122"
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
                  result="effect1_backgroundBlur_1253_122"
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
                  in2="effect1_backgroundBlur_1253_122"
                  result="effect2_dropShadow_1253_122"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect2_dropShadow_1253_122"
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
