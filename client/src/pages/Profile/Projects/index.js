// Projects.js
import { Button, message, Table } from "antd";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { DeleteProject, GetAllProjects } from "../../../apicalls/projects";
import { SetLoading } from "../../../redux/loadersSlice";
import { getDateFormat } from "../../../utils/helpers";
import ProjectForm from "./ProjectForm";

function Projects() {
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [projects, setProjects] = React.useState([]);
  const [show, setShow] = React.useState(false);
  const { user } = useSelector((state) => state.users);
  const dispatch = useDispatch();

  const getData = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllProjects({ owner: user._id });
      if (response.success) {
        setProjects(response.data);
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  const onDelete = async (id) => {
    try {
      dispatch(SetLoading(true));
      const response = await DeleteProject(id);
      if (response.success) {
        message.success(response.message);
        getData();
      } else {
        throw new Error(response.error);
      }
      dispatch(SetLoading(false));
    } catch (error) {
      message.error(error.message);
      dispatch(SetLoading(false));
    }
  };

  React.useEffect(() => {
    getData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => (
        <span className="font-medium text-primary">{text}</span>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (text) => (
        <span className="text-secondary text-sm">
          {text && text.length > 50
            ? `${text.substring(0, 50)}...`
            : text || "No description"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (text) => (
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            text === "active"
              ? "bg-success text-white"
              : text === "completed"
                ? "bg-primary text-white"
                : "bg-warning text-white"
          }`}
        >
          {text.toUpperCase()}
        </span>
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (text) => (
        <span className="text-secondary text-sm">{getDateFormat(text)}</span>
      ),
    },
    {
      title: "Actions",
      dataIndex: "action",
      render: (text, record) => (
        <div className="flex items-center gap-3">
          <button
            className="btn btn-ghost btn-sm text-secondary hover:text-primary"
            onClick={() => {
              setSelectedProject(record);
              setShow(true);
            }}
            title="Edit project"
          >
            <i className="ri-pencil-line"></i>
          </button>
          <button
            className="btn btn-ghost btn-sm text-secondary hover:text-error"
            onClick={() => onDelete(record._id)}
            title="Delete project"
          >
            <i className="ri-delete-bin-line"></i>
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="projects-container">
      <div className="flex justify-end">
        <Button
          type="default"
          className="projects-add-button"
          onClick={() => {
            setSelectedProject(null);
            setShow(true);
          }}
        >
          Add Project
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={projects}
        className="projects-table"
      />
      {show && (
        <ProjectForm
          show={show}
          setShow={setShow}
          reloadData={getData}
          project={selectedProject}
        />
      )}
    </div>
  );
}

export default Projects;
