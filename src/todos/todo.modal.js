import React from 'react';
import PropTypes from 'prop-types';

import './todo.modal.css';

function DeleteTodoModal({ visible, machine }) {
  return (
    <div className={`modal ${visible ? 'visible' : ''}`}>
      <div className="modal-content">
        Are you sure you'd like to delete this todo?
        <div>
          <button
            type="button"
            onClick={function () {
              machine.send('CANCEL_DELETE');
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={function () {
              machine.send('CONFIRM_DELETE');
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

DeleteTodoModal.propTypes = {
  visible: PropTypes.bool,
  machine: PropTypes.shape({
    send: PropTypes.func
  })
};

DeleteTodoModal.defaultProps = {
  visible: false,
  machine: {
    send() {}
  }
};

export default DeleteTodoModal;
