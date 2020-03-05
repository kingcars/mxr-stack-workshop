import React from 'react';
import PropTypes from 'prop-types';

import './todo.modal.css';

function DeleteTodoModal({ visible, machine, todoName }) {
  return (
    <div className={`modal ${visible ? 'visible' : ''}`}>
      <div className="modal-content">
        {`Are you sure you'd like to delete ${todoName}?`}
        <div className="modal-buttons">
          <button
            className="cancel-button"
            type="button"
            onClick={function () {
              machine.send('CANCEL_DELETE');
            }}
          >
            Cancel
          </button>
          <button
            className="confirm-button"
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
  todoName: PropTypes.string,
  machine: PropTypes.shape({
    send: PropTypes.func
  })
};

DeleteTodoModal.defaultProps = {
  visible: false,
  todoName: 'this todo',
  machine: {
    send() {}
  }
};

export default DeleteTodoModal;
