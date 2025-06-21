import { useState } from "react";
import { AUTO_SELECT_NODE } from "../../../../constants";

type AutoSelectNodeProps = {
  ip: string;
  setValues: (values: { ip: string }) => void;
};

const AutoSelectNode: React.FC<AutoSelectNodeProps> = ({ ip, setValues }) => {
  const [autoSelected, setAutoSelected] = useState(false);

  const autoSelectNode = (ip: string, setValues: (values: { ip: string }) => void) => {
    const node = AUTO_SELECT_NODE[Math.floor(Math.random() * AUTO_SELECT_NODE.length)];
    
    // reselect if the node is the same as the one already selected
    if (ip === node) {
      return autoSelectNode(ip, setValues);
    }
    
    setAutoSelected(true);
    setValues({ ip: node });
  };

  return (
    <button
      onClick={() => autoSelectNode(ip, setValues)}
      type="button"
      className="bg-[#a7a7af] text-black w-full mt-4 font-bold hover:bg-opacity-80"
    >
      {!autoSelected ? "Auto-select a megammr node" : "Select a different megammr node"}
    </button>
  );
};

export default AutoSelectNode;
