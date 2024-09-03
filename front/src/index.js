import StrictMode from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import CSVViewer from './CSVViewer';
import { Analytics } from "@vercel/analytics/react"
import Usage from './Usage';
import UsageImportant from './UsageImportant';



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
    <div className="App p-2">
      <UsageImportant/>
      <CSVViewer />
      <Usage/>
      <Analytics/>
    </div>
  </StrictMode>
);
