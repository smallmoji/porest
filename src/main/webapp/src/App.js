import React from 'react';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';
import AppRouter from './components/routing/AppRouter';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
   <React.Fragment>
      <CssBaseline />
      <div>
         <div className="main" style={{minHeight:"100vh"}}>
          <AppRouter/>
        </div>
        {/* <div>
          <Footer />
        </div> */}
        
      </div>
     
    </React.Fragment>
  );
}

export default App;
