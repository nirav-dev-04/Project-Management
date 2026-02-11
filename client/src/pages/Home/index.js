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
    <div className="fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Welcome back to WorkZen, {user?.firstName}!
          </h1>
          <p className="text-secondary text-lg">
            Manage your projects efficiently
          </p>
        </div>

        <button
          className="btn btn-primary flex items-center gap-2 hover:scale-105 transition-transform"
          onClick={() => navigate("/project/new")}
        >
          <span>+</span>
          Create Project
        </button>
      </div>

      {/* Projects Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <div
              key={project._id}
              className="card cursor-pointer hover:shadow-lg transition-all duration-300"
              onClick={() => navigate(`/project/${project._id}`)}
            >
              <div className="card-header">
                <h3 className="card-title text-xl">{project.name}</h3>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    project.status === "active"
                      ? "bg-success text-white"
                      : project.status === "completed"
                        ? "bg-primary text-white"
                        : "bg-warning text-white"
                  }`}
                >
                  {project.status}
                </span>
              </div>

              <div className="card-content space-y-3">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary">
                    Owner:
                  </span>
                  <span className="text-sm text-primary">
                    {project.owner.firstName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-secondary">
                    Created:
                  </span>
                  <span className="text-sm text-primary">
                    {getDateFormat(project.createdAt)}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
            <div className="text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-2xl font-semibold text-primary mb-2">
                No projects yet
              </h3>
              <p className="text-secondary mb-6 max-w-md">
                Create your first project to get started with project
                management.
              </p>
              <button
                className="btn btn-primary"
                onClick={() => navigate("/project/new")}
              >
                Create Your First Project
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
