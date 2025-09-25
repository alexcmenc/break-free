import { useAuthContext } from "../context/auth.context.jsx";

export default function UserProfilePage() {
  const { user, logout } = useAuthContext();

  return (
    <div className="page page-profile">
      <h1 className="title">Profile</h1>

      <div className="card">
        <div className="row">
          <span className="key">Name:</span>
          <span className="val">{user?.name || "-"}</span>
        </div>
        <div className="row">
          <span className="key">Email:</span>
          <span className="val">{user?.email || "-"}</span>
        </div>
      </div>

      <button className="btn btn-danger" onClick={logout}>Log out</button>
    </div>
  );
}
