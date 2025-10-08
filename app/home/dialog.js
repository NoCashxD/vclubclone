import { Modal, Button } from 'flowbite-react';
import { HiOutlineExclamationCircle } from "react-icons/hi";

import './dialog.css';

const Dialog = ({ isOpen, onClose }) =>  {
  return (
    <Modal
    show={isOpen}
    size="md"
    onClose={onClose}
    popup
    className='rounded-lg '
  >
    <Modal.Header className="bg-white hidden" />
    <Modal.Body className="custom-modal-content">
      <div className="text-center">
        <HiOutlineExclamationCircle className="mx-auto mb-4 h-14 w-14 text-blue-400" />
        <h3 className="mb-5 text-lg font-regular text-slate-950">
          Coming Soon
        </h3>
        <p className="mb-5 text-gray-600 dark:text-gray-400">
        </p>
        <div className="flex justify-center">
          <Button color="gray" onClick={onClose}>
            OK
          </Button>
        </div>
      </div>
    </Modal.Body>
  </Modal>
  );
}
export default Dialog;
