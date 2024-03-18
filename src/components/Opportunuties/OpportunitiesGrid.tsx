import React, { useEffect, useState } from "react";
import { Opportunity } from "../../models/Opportunity";
import { fetchOpportunities, deleteOpportunity } from "../../services/opportunitiesService";
import Person from "../../assets/person.png";
import ModalConfirm from "../Modal/ModalConfirm";
import Alert from "../Alert/Alert";

const OpportunitiesGrid = () => {
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const [opportunityIdToDelete, setOpportunityIdToDelete] = useState<number | null>(null);
  const [alertInfo, setAlertInfo] = useState<{
    message: string;
    type: "success" | "error" | null;
  }>({ message: "", type: null });

  const loadOpportunities = async () => {
    try {
      const data = await fetchOpportunities();
      setAllOpportunities(data);
      setLoading(false);
    } catch (error) {
      setError("Error fetching opportunities");
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOpportunities();
  }, []);

  const confirmDelete = (opportunityId: number) => {
    setShowConfirmModal(true);
    setOpportunityIdToDelete(opportunityId);
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

  const deleteConfirmed = async () => {
    if (opportunityIdToDelete) {
      await handleDeleteOpportunity(opportunityIdToDelete);
    }
    closeConfirmModal();
  };

  const closeConfirmModal = () => {
    setShowConfirmModal(false);
  };

  const handleCloseAlert = () => {
    setAlertInfo({ message: "", type: null });
  };

  if (loading) return <p>Loading Opportunities...</p>;
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
      <div className="row">
        {allOpportunities.map((opportunity, index) => (
          <div className="col-md-4 mb-4" key={index}>
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">{opportunity.title}</h5>
                <p className="card-text">{opportunity.description}</p>
                <div className="d-flex justify-content-center">
                  <button
                    className="btn btn-danger"
                    onClick={() => confirmDelete(opportunity.id)}
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

export default OpportunitiesGrid;
