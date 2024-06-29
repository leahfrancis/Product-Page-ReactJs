import React, { useState, useCallback, useMemo } from 'react';
import { Table, Button, Alert, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import img1 from './images/img1.jpg';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
import img4 from './images/img4.jpg';
import img5 from './images/img5.jpg';
import img6 from './images/img6.jpg';
import './css/styles.css';

const StateTable = React.memo(() => {
  const initialStates = useMemo(() => [
    { id: '1', img1, img2, img3, img4, img5, img6 },
    { id: '2', img1: img4, img2: img5, img3: img6, img4: img1, img5: img2, img6: img3 },
    { id: '3', img1, img2, img3, img4, img5, img6 },
    { id: '4', img1: img4, img2: img5, img3: img6, img4: img1, img5: img2, img6: img3 },
    { id: '5', img1, img2, img3, img4, img5, img6 },
  ], []);

  const [states, setStates] = useState(initialStates);
  const [additionalColumns, setAdditionalColumns] = useState(["Variant 4"]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCell, setActiveCell] = useState({ rowId: null, columnIndex: null });

  const addState = useCallback(() => {
    setStates(prevStates => [...prevStates, { id: String(prevStates.length + 1) }]);
    setAlertMessage('✅ State added');
    setTimeout(() => setAlertMessage(''), 2000);
  }, [setStates, setAlertMessage]);

  const addColumn = useCallback(() => {
    const newColumn = `Variant ${additionalColumns.length + 4}`;
    setAdditionalColumns(prevColumns => [...prevColumns, newColumn]);
    setAlertMessage('✅ Variant added');
    setTimeout(() => setAlertMessage(''), 2000);
  }, [setAdditionalColumns, setAlertMessage, additionalColumns]);

  const deleteState = useCallback((id) => {
    const updatedStates = states.filter(state => state.id !== id);
    setStates(updatedStates);
    setAlertMessage('✅ State removed');
    setTimeout(() => setAlertMessage(''), 2000);
  }, [states, setStates, setAlertMessage]);

  const deleteColumn = useCallback((index) => {
    const updatedColumns = additionalColumns.filter((_, colIndex) => colIndex !== index);
    setAdditionalColumns(updatedColumns);
    setAlertMessage('✅ Variant removed');
    setTimeout(() => setAlertMessage(''), 2000);
  }, [additionalColumns, setAdditionalColumns, setAlertMessage]);

  const onDragEnd = useCallback((result) => {
    if (!result.destination) {
      return;
    }

    const reorderedStates = Array.from(states);
    const [movedState] = reorderedStates.splice(result.source.index, 1);
    reorderedStates.splice(result.destination.index, 0, movedState);
    setStates(reorderedStates);
  }, [states, setStates]);

  const openModal = useCallback((rowId, columnIndex) => {
    setActiveCell({ rowId, columnIndex: `Variant ${columnIndex + 4}` });
    setShowModal(true);
  }, []);

  const closeModal = useCallback(() => {
    setShowModal(false);
    setSelectedImage(null);
    setActiveCell({ rowId: null, columnIndex: null });
  }, []);

  const selectImage = useCallback((imageSrc) => setSelectedImage(imageSrc), []);

  const insertImage = useCallback(() => {
    const { rowId, columnIndex } = activeCell;
    const updatedStates = states.map(state => {
      if (state.id === rowId) {
        return {
          ...state,
          [columnIndex]: selectedImage
        };
      }
      return state;
    });
    setStates(updatedStates);
    closeModal();
  }, [activeCell, selectedImage, states, setStates, closeModal]);

  return (
    <div className="table-container">
      {alertMessage && <Alert variant="success" className="custom-alert">{alertMessage}</Alert>}
      
      <div className="table-responsive">
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable-rows" type="ROWS">
            {(provided) => (
              <Table striped bordered hover className="table" ref={provided.innerRef} {...provided.droppableProps}>
                <thead>
                  <tr>
                    <th></th>
                    {['Product Filter', 'Primary Variant', 'Variant 2', 'Variant 3'].map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                    {additionalColumns.map((column, index) => (
                      <th key={index + 4}>
                        {column}
                        <FaTrash className="delete-icon" onClick={() => deleteColumn(index)} />
                      </th>
                    ))}
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {states.map((state, index) => (
                    <Draggable key={state.id} draggableId={state.id} index={index}>
                      {(provided) => (
                        <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <td className="row-number-cell">
                            <div className="row-number">
                              {index >= 5 && <FaTrash className="delete-icon" onClick={() => deleteState(state.id)} />}
                              {index + 1}
                            </div>
                          </td>
                          {['img1', 'img2', 'img3'].map((img, colIndex) => (
                            <td key={colIndex}>
                              {index < 5 ? (
                                <>
                                  <img src={state[img]} alt={`${img}`} className="custom-img" />
                                  <div className='imgdes'>Single image product</div>
                                </>
                              ) : (
                                <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                              )}
                            </td>
                          ))}
                          {additionalColumns.map((column, colIndex) => (
                            <td key={colIndex + 4}>
                              <div>
                                {state[column] ? (
                                  <>
                                    <img src={state[column]} alt={column} className="custom-img" />
                                    <div className='imgdes'>Single image product</div>
                                  </>
                                ) : (
                                  <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                                )}
                              </div>
                            </td>
                          ))}
                          <td>
                            <Button variant="link" className="add-column-button" onClick={addColumn}>+</Button>
                          </td>
                        </tr>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  <tr>
                    <td>
                      <Button variant="link" className="add-state-button" onClick={addState}>+</Button>
                    </td>
                    {[...Array(5 + additionalColumns.length)].map((_, index) => (
                      <td key={index}></td>
                    ))}
                  </tr>
                </tbody>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-grid">
            {[img1, img2, img3, img4, img5, img6].map((imgSrc, index) => (
              <Button key={index} variant="link" onClick={() => selectImage(imgSrc)}>
                <img src={imgSrc} alt={`img${index + 1}`} className="modal-img" />
              </Button>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={closeModal}>
            Close
          </Button>
          {selectedImage && (
            <Button variant="primary" onClick={insertImage}>
              Insert
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
});

export default StateTable;
