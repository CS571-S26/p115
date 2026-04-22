import { deleteAccount } from '../firebase.js'
import { useNavigate } from "react-router-dom";
import './settings.css'

function Settings({ onLogout }) {
  const navigate = useNavigate()

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
    <div className="settings-page">
      <h1 className="text-center mb-4">Settings</h1>
      <div className="settings-card">
        <div className="danger-zone" style={{ marginTop: 0, paddingTop: 0, borderTop: 'none' }}>
          <button className="btn-delete" onClick={handleDeleteAccount}>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;