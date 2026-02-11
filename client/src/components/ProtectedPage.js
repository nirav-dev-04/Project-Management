import { message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { GetLoggedInUser } from "../apicalls/users";
import { SetNotifications, SetUser } from "../redux/usersSlice";
import { SetLoading } from "../redux/loadersSlice";
import { GetAllNotifications } from "../apicalls/notifications";
import { Avatar, Badge } from "antd";
import Notifications from "./Notifications";

function ProtectedPage({ children }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, notifications } = useSelector((state) => state.users);

  const getUser = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetLoggedInUser();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetUser(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
      localStorage.removeItem("token");
      navigate("/register");
    }
  };

  const getNotifications = async () => {
    try {
      dispatch(SetLoading(true));
      const response = await GetAllNotifications();
      dispatch(SetLoading(false));
      if (response.success) {
        dispatch(SetNotifications(response.data));
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      getUser();
    } else {
      navigate("/login");
    }
  }, []);

  useEffect(() => {
    if (user) {
      getNotifications();
    }
  }, [user]);

  return (
    user && (
      <div className="app-layout">
        {/* Top Navigation */}
        <div className="topbar">
          <h1 className="logo" onClick={() => navigate("/")}>
            WorkZen
          </h1>

          <div className="topbar-right">
            <span className="user-name" onClick={() => navigate("/profile")}>
              {user?.firstName}
            </span>

            <Badge
              count={notifications.filter((n) => !n.read).length}
              className="notification-icon"
            >
              <Avatar
                shape="square"
                size="large"
                icon={<i className="ri-notification-line"></i>}
                onClick={() => setShowNotifications(true)}
              />
            </Badge>

            <i
              className="ri-logout-box-r-line logout-icon"
              onClick={() => {
                localStorage.removeItem("token");
                navigate("/login");
              }}
            ></i>
          </div>
        </div>

        {/* Page Content */}
        <div className="page-content fade-in">{children}</div>

        {/* Notifications */}
        {showNotifications && (
          <Notifications
            showNotifications={showNotifications}
            setShowNotifications={setShowNotifications}
            reloadNotifications={getNotifications}
          />
        )}
      </div>
    )
  );
}

export default ProtectedPage;
