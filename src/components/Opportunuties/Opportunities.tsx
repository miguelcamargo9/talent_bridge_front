import React, { useEffect, useState } from "react";
import { deleteOpportunity, fetchOpportunities } from "../../services/opportunitiesService";
import { Opportunity } from "../../models/Opportunity";
import styles from "./Opportunities.module.scss";
import layoutStyles from "../Layout/Layout.module.scss";
import Search from "./Search/Search";
import Pagination from "../Pagination/Pagination";
import { useNavigate } from "react-router-dom";
import ModalConfirm from "../Modal/ModalConfirm";
import Alert from "../Alert/Alert";

const Opportunities: React.FC = () => {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [filteredOpportunities, setFilteredOpportunities] = useState<Opportunity[]>([]);
  const [currentOpportunities, setCurrentOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [opportunityIdToDelete, setOpportunityIdToDelete] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const navigate = useNavigate();

  const loadOpportunities = async () => {
    try {
      const data = await fetchOpportunities();
      setAllOpportunities(data);
      setFilteredOpportunities(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching opportunities");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  useEffect(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredOpportunities.slice(indexOfFirstItem, indexOfLastItem);
    setCurrentOpportunities(currentItems);
  }, [currentPage, itemsPerPage, filteredOpportunities]);

  const filterOpportunities = (query: string) => {
    if (!query) return allOpportunities;
    const lowercasedQuery = query.toLowerCase();
    return allOpportunities.filter((opportunity) => {
      return (
        opportunity.title.toLowerCase().includes(lowercasedQuery) ||
        opportunity.description.toLowerCase().includes(lowercasedQuery) ||
        (opportunity.created_at ?? "").includes(lowercasedQuery) ||
        (opportunity.updatedAt ?? "").includes(lowercasedQuery)
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
    const filtered = filterOpportunities(query);
    setFilteredOpportunities(filtered);
    setCurrentPage(1);
  };

  const handleDeleteOpportunity = async (opportunityId: number) => {
    try {
      await deleteOpportunity(opportunityId);
      await loadOpportunities();
      setAlertInfo({ message: "Opportunity deleted successfully", type: "success" });
    } catch (error) {
      console.error(error);
      setAlertInfo({
        message: "Opportunity could not be deleted",
        type: "error",
      });
    }
  };

  const confirmDelete = (opportunityId: number) => {
    setShowConfirmModal(true);
    setOpportunityIdToDelete(opportunityId);
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const deleteConfirmed = async () => {
    if (opportunityIdToDelete) {
      await handleDeleteOpportunity(opportunityIdToDelete);
    }
    closeConfirmModal();
  };

  const handleCreateOpportunity = () => {
    navigate(`/create`);
  };

  const handleEditOpportunity = (opportunityId: number) => {
    navigate(`/update/${opportunityId}`);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ message: "", type: null });
  };

  if (loading) return <p>Loading Opportunities...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h1>List of Opportunities</h1>
      <div className={styles.header}>
        <Search onSearch={handleSearch} />
        <button className={styles.addButton} onClick={handleCreateOpportunity}>
          Add Opportunity
        </button>
      </div>
      {showConfirmModal && (
        <ModalConfirm
          show={showConfirmModal}
          onClose={closeConfirmModal}
          onConfirm={deleteConfirmed}
        >
          <h2 style={{ textAlign: "center" }}>Confirm</h2>
          <p>¿You really want to delete the opportunity?</p>
        </ModalConfirm>
      )}
      {alertInfo.type && (
        <Alert
          message={alertInfo.message}
          type={alertInfo.type}
          onClose={handleCloseAlert}
        />
      )}
      <table className={styles.opportunitiesTable}>
        <thead>
          <tr>
            <th>Title</th>
            <th>Description</th>
            <th>Creation Date</th>
            <th>Update Date</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentOpportunities.map((opportunity) => (
            <tr key={opportunity.id}>
              <td>{opportunity.title}</td>
              <td>{opportunity.description}</td>
              <td>{opportunity.created_at}</td>
              <td>{opportunity.updatedAt}</td>
              <td>
                <button
                  onClick={() => handleEditOpportunity(opportunity.id)}
                  style={{ marginRight: "5px" }}
                >
                  Editar
                </button>
                <button
                  onClick={() => confirmDelete(opportunity.id)}
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
          totalItems={filteredOpportunities.length}
          currentPage={currentPage}
          onPageChange={handlePageChange}
          onItemsPerPageChange={handleItemsPerPageChange}
        />
      </div>
    </div>
  );
};

export default Opportunities;
