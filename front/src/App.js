import React from 'react';
import CSVViewer from './CSVViewer';

const App = () => {
  return (
    <div className="App">
      <header className="bg-blue-600 text-white p-4">
        <h1 className="text-2xl font-bold">佐渡トライアスロン 2024 速報 検索くん</h1>
      </header>
      <main className="p-4">
        <CSVViewer />
      </main>
      <footer className="bg-gray-200 p-4 mt-8">
        <p className="text-center text-gray-600">&copy; 2024 <a href="https://x.com/matsubokkuri">matsubokkuri</a></p>
      </footer>
    </div>
  );
};

export default App;
