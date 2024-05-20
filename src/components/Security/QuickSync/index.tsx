import Navigation from "./Navigation";
import Host from "./Host";
import FromSeedPhrase from "./FromSeedPhrase";
import FromBackup from "./FromBackup";

const QuickSync = () => {
  return (
    <div className="mx-4">
      <h1 className="text-2xl">Restore a node</h1>
      <Navigation />

      <Host />
      <FromSeedPhrase />
      <FromBackup />
    </div>
  );
};

export default QuickSync;
