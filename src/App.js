import Index from "./Routes/Index";

import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="App">
      <Index /> 
      <ToastContainer />   
    </div>
  );
}

export default App;


// // import './App.css';
// import handleSubmit from './handles/handleSubmit';
// import { useRef } from 'react';
 
// function App() {
//   const dataRef = useRef()
 
//   const submithandler = (e) => {
//     e.preventDefault()
//     handleSubmit(dataRef.current.value)
//     dataRef.current.value = ""
//   }
 
//   return (
//     <div className="App">
//       <form onSubmit={submithandler}>
//         <input type= "text" ref={dataRef} />
//         <button type = "submit">Save</button>
//       </form>
//     </div>
//   );
// }
 
// export default App;