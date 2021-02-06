import React from 'react';
import AppRouter from './components/routing/AppRouter';
import CssBaseline from '@material-ui/core/CssBaseline';

function App() {
  return (
   <React.Fragment>
      <CssBaseline />
        <div className="main" style={{minHeight:"100vh"}}>
          <AppRouter/>
        </div>
    </React.Fragment>
  );
}

export default App;
