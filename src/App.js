// App.js
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import StateTable from './StateTable';

function App() {
  return (
    <div className="container mt-4">
      <h1><u>Rules Creation</u></h1>
      <StateTable />
    </div>
  );
}

export default App;
