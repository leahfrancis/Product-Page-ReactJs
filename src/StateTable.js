import React, { useState } from 'react';
import { Table, Button, Alert, Modal } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import img1 from './images/img1.jpg';
import img2 from './images/img2.jpg';
import img3 from './images/img3.jpg';
import img4 from './images/img4.jpg';
import img5 from './images/img5.jpg';
import img6 from './images/img6.jpg';
import './css/styles.css'; // Import custom CSS

const StateTable = () => {
  const initialStates = [
    { id: 1, img1: img1, img2: img2, img3: img3, img4: img4, img5: img5, img6: img6 },
    { id: 2, img1: img4, img2: img5, img3: img6, img4: img1, img5: img2, img6: img3 },
    { id: 3, img1: img1, img2: img2, img3: img3, img4: img4, img5: img5, img6: img6 },
    { id: 4, img1: img4, img2: img5, img3: img6, img4: img1, img5: img2, img6: img3 },
    { id: 5, img1: img1, img2: img2, img3: img3, img4: img4, img5: img5, img6: img6 },
  ];

  const [states, setStates] = useState(initialStates);
  const constantColumns = ["Product Filter", "Primary Variant", "Variant 2", "Variant 3"];
  const [additionalColumns, setAdditionalColumns] = useState(["Variant 4"]);
  const [alertMessage, setAlertMessage] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeCell, setActiveCell] = useState({ rowId: null, colIndex: null });

  const addState = () => {
    setStates([...states, { id: states.length + 1 }]);
    setAlertMessage('✅ State added');
    setTimeout(() => setAlertMessage(''), 2000);
  };

  const addColumn = () => {
    const newColumn = `Variant ${additionalColumns.length + 4}`;
    setAdditionalColumns([...additionalColumns, newColumn]);
    setAlertMessage('✅ Variant added');
    setTimeout(() => setAlertMessage(''), 2000);
  };

  const deleteState = (id) => {
    const updatedStates = states.filter(state => state.id !== id);
    setStates(updatedStates);
    setAlertMessage('✅ State removed');
    setTimeout(() => setAlertMessage(''), 2000);
  };

  const deleteColumn = (index) => {
    const updatedColumns = additionalColumns.filter((_, colIndex) => colIndex !== index);
    setAdditionalColumns(updatedColumns);
    setAlertMessage('✅ Variant removed');
    setTimeout(() => setAlertMessage(''), 2000);
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }
    const reorderedStates = Array.from(states);
    const [movedState] = reorderedStates.splice(result.source.index, 1);
    reorderedStates.splice(result.destination.index, 0, movedState);
    setStates(reorderedStates);
  };

  const openModal = (rowId, colIndex) => {
    setActiveCell({ rowId, colIndex }); // Update active cell on modal open
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setActiveCell({ rowId: null, colIndex: null }); // Reset active cell on modal close
  };

  const selectImage = (imageSrc) => setSelectedImage(imageSrc);

  const insertImage = () => {
    const { rowId, colIndex } = activeCell;
    const updatedStates = states.map(state => {
      if (state.id === rowId) {
        return {
          ...state,
          [`Variant ${colIndex + 4}`]: selectedImage // Insert image into correct column based on active cell
        };
      }
      return state;
    });
    setStates(updatedStates);
    closeModal();
  };

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
                    <th></th> {/* Empty header for the numbering column */}
                    {constantColumns.map((column, index) => (
                      <th key={index}>{column}</th>
                    ))}
                    {additionalColumns.map((column, index) => (
                      <th key={index + constantColumns.length}>
                        {column}
                        <FaTrash className="delete-icon" onClick={() => deleteColumn(index)} />
                      </th>
                    ))}
                    <th>
                      <Button variant="link" className="add-column-button" onClick={addColumn}>+</Button>
                    </th>
                  </tr>
                </thead>
                <Droppable droppableId="droppable-body">
                  {(provided) => (
                    <tbody ref={provided.innerRef} {...provided.droppableProps}>
                      {states.map((state, index) => (
                        <Draggable key={state.id} draggableId={String(state.id)} index={index}>
                          {(provided) => (
                            <tr ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                              <td className="row-number-cell">
                                <div className="row-number">
                                  {index >= 5 && <FaTrash className="delete-icon" onClick={() => deleteState(state.id)} />}
                                  {index + 1}
                                </div>
                              </td>
                              {constantColumns.map((column, colIndex) => (
                                <td key={colIndex}>
                                  {column === 'Product Filter' && (
                                    <div>
                                      <div className="imgdes">Product Filter Content</div>
                                    </div>
                                  )}
                                  {column === 'Primary Variant' && (
                                    <div>
                                      {index < 5 ? (
                                        <>
                                          <img src={state.img1} alt="Primary Variant" className="custom-img" />
                                          <div className='imgdes'>Single image product</div>
                                        </>
                                      ) : (
                                        <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                                      )}
                                    </div>
                                  )}
                                  {column === 'Variant 2' && (
                                    <div>
                                      {index < 5 ? (
                                        <>
                                          <img src={state.img2} alt="Variant 2" className="custom-img" />
                                          <div className='imgdes'>Single image product</div>
                                        </>
                                      ) : (
                                        <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                                      )}
                                    </div>
                                  )}
                                  {column === 'Variant 3' && (
                                    <div>
                                      {index < 5 ? (
                                        <>
                                          <img src={state.img3} alt="Variant 3" className="custom-img" />
                                          <div className='imgdes'>Single image product</div>
                                        </>
                                      ) : (
                                        <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                                      )}
                                    </div>
                                  )}
                                </td>
                              ))}
                              {additionalColumns.map((column, colIndex) => (
                                <td key={colIndex + constantColumns.length}>
                                  <div>
                                    {column.startsWith('Variant') && (
                                      <>
                                        {state[`Variant ${colIndex + 4}`] ? (
                                          <>
                                            <img src={state[`Variant ${colIndex + 4}`]} alt={`Variant ${colIndex + 4}`} className="custom-img" />
                                            <div className='imgdes'>Single image product</div>
                                          </>
                                        ) : (
                                          <Button variant="outline-primary" onClick={() => openModal(state.id, colIndex)}>+ Add Design</Button>
                                        )}
                                      </>
                                    )}
                                  </div>
                                </td>
                              ))}
                            </tr>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {/* Additional row for adding new states */}
                      <tr>
                        <td>
                          <Button variant="link" className="add-state-button" onClick={addState}>+</Button>
                        </td>
                        {/* Render empty cells to match the table structure */}
                        {[...Array(constantColumns.length + additionalColumns.length)].map((_, index) => (
                          <td key={index}></td>
                        ))}
                      </tr>
                    </tbody>
                  )}
                </Droppable>
              </Table>
            )}
          </Droppable>
        </DragDropContext>
      </div>

      {/* Modal for selecting and inserting images */}
      <Modal show={showModal} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Select Image</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="image-grid">
            <Button variant="link" onClick={() => selectImage(img1)}>
              <img src={img1} alt="img1" className="modal-img" />
            </Button>
            <Button variant="link" onClick={() => selectImage(img2)}>
              <img src={img2} alt="img2" className="modal-img" />
            </Button>
            <Button variant="link" onClick={() => selectImage(img3)}>
              <img src={img3} alt="img3" className="modal-img" />
            </Button>
            <Button variant="link" onClick={() => selectImage(img4)}>
              <img src={img4} alt="img4" className="modal-img" />
            </Button>
            <Button variant="link" onClick={() => selectImage(img5)}>
              <img src={img5} alt="img5" className="modal-img" />
            </Button>
            <Button variant="link" onClick={() => selectImage(img6)}>
              <img src={img6} alt="img6" className="modal-img" />
            </Button>
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
};

export default StateTable;
