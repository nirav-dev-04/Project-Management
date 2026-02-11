import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GetProjectsByRole } from "../../apicalls/projects";
import { SetLoading } from "../../redux/loadersSlice";
import { message } from "antd";
import { getDateFormat } from "../../utils/helpers";
import Divider from "../../components/Divider";
import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const [projects, setProjects] = useState([]);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetProjectsByRole();
      dispatch(SetLoading(false));
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div>
          <h2>
            Welcome, {user?.firstName} {user?.lastName}
          </h2>
          <p className="dashboard-subtitle">Manage your projects efficiently</p>
        </div>

        <button
          className="create-project-btn"
          onClick={() => navigate("/project/new")}
        >
          + Create Project
        </button>
      </div>

      {/* Projects Section */}
      <div className="project-grid">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="project-card"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="project-card-header">
                <h3>{project.name}</h3>
                <span className={`status ${project.status}`}>
                  {project.status}
                </span>
              </div>

              <Divider />

              <div className="project-info">
                <p>
                  <strong>Owner:</strong> {project.owner.firstName}
                </p>
                <p>
                  <strong>Created:</strong> {getDateFormat(project.createdAt)}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <h3>No projects yet</h3>
            <p>Create your first project to get started.</p>
            <button
              className="create-project-btn"
              onClick={() => navigate("/project/new")}
            >
              Create Project
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
