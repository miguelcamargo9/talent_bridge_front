import React, { useEffect, useState } from "react";
import { deleteUser, fetchUsers } from "../../services/usersService";
import { BaseUser } from "../../models/User";
import styles from "./Users.module.scss";
import layoutStyles from "../Layout/Layout.module.scss";
import { formatDate } from "../../helpers/dateHelpers";
import Search from "./Search/Search";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../Modal/ModalConfirm";
import Alert from "../Alert/Alert";

const Users: React.FC = () => {
  const [allUsers, setAllUsers] = useState<BaseUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<BaseUser[]>([]);
  const [currentUsers, setCurrentUsers] = useState<BaseUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [userIdToDelete, setUserIdToDelete] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const navigate = useNavigate();

  const loadUsers = async () => {
    try {
      const data = await fetchUsers();
      setAllUsers(data);
      setFilteredUsers(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentUsers(currentItems);
  }, [currentPage, itemsPerPage, filteredUsers]);

  const filterUsers = (query: string) => {
    if (!query) return allUsers;
    const lowercasedQuery = query.toLowerCase();
    return allUsers.filter((user) => {
      return (
        user.name.toLowerCase().includes(lowercasedQuery) ||
        user.email.toLowerCase().includes(lowercasedQuery) ||
        user.phone.toLowerCase().includes(lowercasedQuery) ||
        formatDate(user.created_at).includes(lowercasedQuery) ||
        formatDate(user.updated_at).includes(lowercasedQuery)
      );
    });
  };

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (numberOfItems: number) => {
    setItemsPerPage(numberOfItems);
    setCurrentPage(1);
  };

  const handleSearch = (query: string) => {
    const filtered = filterUsers(query);
    setFilteredUsers(filtered);
    setCurrentPage(1);
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

  const confirmDelete = (userId: number) => {
    setShowConfirmModal(true);
    setUserIdToDelete(userId);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const deleteConfirmed = async () => {
    if (userIdToDelete) {
      await handleDeleteUser(userIdToDelete);
    }
    closeConfirmModal();
  };

  const handleCreateUser = () => {
    navigate(`/create`);
  };

  const handleEditUser = (userId: number) => {
    navigate(`/update/${userId}`);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ message: "", type: null });
  };

  if (loading) return <p>Loading Users...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>List of Users</h1>
      <div className={styles.header}>
        <Search onSearch={handleSearch} />
        <button className={styles.addButton} onClick={handleCreateUser}>
          Add User
        </button>
      </div>
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
      <table className={styles.usersTable}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Creation Date</th>
            <th>Update Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentUsers.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>{formatDate(user.created_at)}</td>
              <td>{formatDate(user.updated_at)}</td>
              <td>
                <button
                  onClick={() => handleEditUser(user.id)}
                  style={{ marginRight: "5px" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDelete(user.id)}
                  className={`${layoutStyles.button} ${layoutStyles.secondary}`}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        <Pagination
          itemsPerPage={itemsPerPage}
          totalItems={filteredUsers.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Users;
