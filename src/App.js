import logo from './logo.svg';
import './App.css';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

import Arrows from './ArrowsExample'
import DnD from './dndExample';

function App() {
  return (
    <DndProvider backend={HTML5Backend}>
      
      {/* <Arrows /> */}


      
      <DnD />

    </DndProvider>
  );
}

export default App;
