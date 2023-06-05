import Modal from '../../UI/Modal';
import Button from '../../UI/Button';
import { quit } from '../../../lib';
import { useState } from 'react';

export function ShutdownNode({ display, dismiss }) {
  const [shutdown, setShutdown] = useState(false);

  const confirm = async () => {
    await quit();
    setShutdown(true);
  };

  if (shutdown) {
    return (
      <Modal display={display} frosted>
        <div>
          <div className="text-center">
            <h1 className="text-xl mb-6">Your node has been shutdown</h1>
            <p className="text-core-grey mb-1">Lorem ipsum dolor sit amet consectetur. At faucibus nunc neque vitae integer id sem blandit magna.</p>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal display={display} frosted closeAtBottom={dismiss}>
      <div>
        <div className="text-center">
          <p className="mb-12">
            Lorem ipsum dolor sit amet consectetur. At faucibus nunc neque vitae integer id sem blandit magna.
          </p>
          <Button onClick={confirm}>Shutdown node</Button>
        </div>
      </div>
    </Modal>
  );
}

export default ShutdownNode;
