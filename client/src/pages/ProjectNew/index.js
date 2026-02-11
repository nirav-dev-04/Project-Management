import React from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SetLoading } from "../../redux/loadersSlice";
import { CreateProject } from "../../apicalls/projects";
import { message } from "antd";
import ProjectForm from "../Profile/Projects/ProjectForm";

function ProjectNew() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.users);

  const onFinish = async (values) => {
    try {
      dispatch(SetLoading(true));
      values.owner = user._id;
      values.members = [
        {
          user: user._id,
          role: "owner",
        },
      ];
      const response = await CreateProject(values);
      if (response.success) {
        message.success(response.message);
        navigate(`/project/${response.data._id}`);
      } else {
        throw new Error(response.message);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <button onClick={() => navigate("/")} className="btn btn-ghost mb-4">
            ← Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-primary mb-2">
            Create New Project
          </h1>
          <p className="text-secondary">
            Fill in the details below to create your new project.
          </p>
        </div>

        <div className="card p-6">
          <ProjectForm
            show={true}
            setShow={() => navigate("/")}
            reloadData={() => {}}
            project={null}
            onFinish={onFinish}
          />
        </div>
      </div>
    </div>
  );
}

export default ProjectNew;
