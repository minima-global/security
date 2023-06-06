import Button from "../../UI/Button";
import SlideScreen from "../../UI/SlideScreen";

interface IProps {
  display: any;
  dismiss: any;
}
const ManageSeedPhrase = ({ display, dismiss }: IProps) => {
  return (
    <SlideScreen display={display}>
      <div className="flex flex-col h-full bg-black">
        <div className="pt-10 px-6 pb-6 flex flex-col h-full">
          <div
            onClick={dismiss}
            className="cursor-pointer mb-4 flex items-center"
          >
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
          <div className="mt-6 text-2xl mb-8">Peer list</div>
          <div className="flex flex-col gap-5">
            <div className="core-black-contrast p-4 rounded">
              <div>
                <div className="mb-3">What are peers?</div>
                <p className="text-core-grey">
                  Lorem ipsum dolor sit amet consectetur. In diam sem cras
                  pellentesque luctus leo faucibus ullamcorper venenatis.
                </p>
              </div>
            </div>
            <div className="core-black-contrast-2 p-4 rounded">
              <div className="mb-6">
                Lorem ipsum dolor sit amet consectetur. Ipsum leo sagittis
                mattis egestas mattis pulvinar pulvinar in tempor.
              </div>
              <Button>Share peers</Button>
            </div>
            <div className="core-black-contrast-2 p-4 rounded">
              <div className="mb-6">
                Lorem ipsum dolor sit amet consectetur. Ipsum leo sagittis
                mattis egestas mattis pulvinar pulvinar in tempor.
              </div>
              <Button>Import peers</Button>
            </div>
          </div>
        </div>
      </div>
    </SlideScreen>
  );
};

export default ManageSeedPhrase;
