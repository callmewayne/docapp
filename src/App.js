import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import FileSearch from './components/FileSearch'
import FilesList from './components/FileList'


let defaultFiles = [
  {
      id:'1',
      title:'first poo',
      body:'should be',
      createdAt:123456
  },
  {
      id:'2',
      title:'secend poo',
      body:'## should be',
      createdAt:123456
  },
]

function App() {
  return (
    <div className="App container-fluid">
      <div className="row">
         <div className="col-4 bg-light left-panel">
              <FileSearch title='My Document' onFileSearch={(value)=>{console.log(value)}}/>
              <FilesList 
               files={defaultFiles}
              />
          </div>
          <div className="col-8 bg-primary right-panel">
               <h1>
                 this is the right
               </h1>
          </div>
       </div>
      
    </div>
  );
}
export default App;
