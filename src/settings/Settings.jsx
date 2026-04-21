import { useState } from "react";

function Settings({ user, onSave }) {
  const [displayName, setDisplayName] = useState(user?.displayName || "");
  const [preferredCurrency, setPreferredCurrency] = useState("USD");
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-theme'));
  const [saved, setSaved] = useState(false);


  const updateSetting = (setter, key, value) => {
    setter(value);
    
    const updatedPrefs = {
      displayName,
      preferredCurrency,
      [key]: value
    };

    onSave?.(updatedPrefs);
    setSaved(true);
    setTimeout(() => setSaved(false), 1000);
  };

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-theme');
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure? This action is permanent.")) {
      console.log("Account deleted");
    }
  };

  return (
    <div className="page">
      <h1 className="text-center mb-4">Settings</h1>
      
      <div className="settings-card">
        <div className="d-flex align-items-center justify-content-between mb-2">
          <span className="fw-bold">Dark Mode</span>
          <div className={`theme-switch ${darkMode ? 'active' : ''}`} onClick={toggleTheme}>
            <div className="switch-handle" />
          </div>
        </div>

        <div className="danger-zone">
          <button className="btn-delete" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;