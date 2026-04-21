import { useState } from "react";
import { deleteAccount } from '../firebase.js'
import { useNavigate } from "react-router-dom";


function Settings({ onLogout }) {
  const [darkMode, setDarkMode] = useState(document.body.classList.contains('dark-theme'));
  const navigate = useNavigate()

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.body.classList.toggle('dark-theme');
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is permanent.")) {
      try {
        await deleteAccount()
        onLogout()
        navigate('/login')
      } catch (error) {
        alert(error?.message || 'Failed to delete account. Please try again.')
      }
    }
  }

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