import React from 'react';
import './App.css';

import { SettingsProvider } from './contents/SettingContext';
import Map from './contents/Map';
import Menu from './contents/Menu';

function App() {
  return (
    <SettingsProvider>
      <div className="App">
        <header className="App-header">
        </header>
        <main>
          <Menu>

          </Menu>
          <Map>

          </Map>
        </main>
      </div>
    </SettingsProvider>
  );
}

export default App;
