import Navigation from "./Navigation";
import Host from "./Host";
import FromSeedPhrase from "./FromSeedPhrase";
import FromBackup from "./FromBackup";
import BackButton from "../../UI/BackButton";

const QuickSync = () => {
  return (
    <div className="mx-4">
      <div className="grid grid-cols-[auto_1fr] mb-4">
        <BackButton title="Back" to={-1} />        
      </div>
      <h1 className="text-2xl">Restore a node</h1>
      <Navigation />

      <Host />
      <FromSeedPhrase />
      <FromBackup />
    </div>
  );
};

export default QuickSync;
