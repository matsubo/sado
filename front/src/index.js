import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CSVViewer from './CSVViewer';
import { Analytics } from "@vercel/analytics/react"
import UsageImportant from './UsageImportant';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <div className="App p-2">
      <UsageImportant/>
      <CSVViewer />
      <Analytics/>
    </div>
  </React.StrictMode>
);
