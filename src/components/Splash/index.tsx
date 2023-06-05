import Grid from "../UI/Grid";

const Splash = () => {
  return (
    <Grid
      header={<></>}
      content={
        <div className="grid h-full">
          <div className="align-middle">
            <img alt="app-icon" src="./assets/icon.svg" />
            <h6>Welcome to Security</h6>
            <p>Lorem ipsum dolor sit amet consectetur.</p>
          </div>
          <button className="align-bottom">Continue</button>
        </div>
      }
      footer={<></>}
    />
  );
};

export default Splash;
