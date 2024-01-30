import React, { useEffect, useState } from "react";
import { BaseUser } from "../../models/User";
import { fetchUsers, deleteUser } from "../../services/usersService";
import Person from "../../assets/person.png";
import ModalConfirm from "../Modal/ModalConfirm";
import Alert from "../Alert/Alert";

const UsersGrid = () => {
  const [allUsers, setAllUsers] = useState<BaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setAllUsers(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const confirmDelete = (userId: number) => {
    setShowConfirmModal(true);
    setUserIdToDelete(userId);
  };

  const handleDeleteUser = async (userId: number) => {
    try {
      await deleteUser(userId);
      await loadUsers();
      setAlertInfo({ message: "User deleted successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setAlertInfo({
        message: "User could not be deleted",
        type: "error",
      });
    }
  };

  const deleteConfirmed = async () => {
    if (userIdToDelete) {
      await handleDeleteUser(userIdToDelete);
    }
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ message: "", type: null });
  };

  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mt-4 mb-10">
      {showConfirmModal && (
        <ModalConfirm
          show={showConfirmModal}
          onClose={closeConfirmModal}
          onConfirm={deleteConfirmed}
        >
          <h2 style={{ textAlign: "center" }}>Confirm</h2>
          <p>¿You really want to delete the user?</p>
        </ModalConfirm>
      )}
      {alertInfo.type && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={handleCloseAlert}
        />
      )}
      <div className="row">
        {allUsers.map((user, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card">
              <img src={Person} className="card-img-top" alt={user.name} />
              <div className="card-body">
                <h5 className="card-title">{user.email}</h5>
                <p className="card-text">{user.phone}</p>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(user.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UsersGrid;
