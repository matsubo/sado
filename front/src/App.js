import React from 'react';
import CSVViewer from './CSVViewer';
import { Analytics } from "@vercel/analytics/react"
import Usage from './Usage';

const App = () => {
  return (
    <div className="App p-2">
      <CSVViewer />
      <Usage/>
      <Analytics/>
    </div>
  );
};

export default App;
