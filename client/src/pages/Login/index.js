import React, { useEffect } from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import Divider from "../../components/Divider";
import { LoginUser } from "../../apicalls/users";
import { useDispatch, useSelector } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";
import "./Login.css";

function Login() {
  const { buttonLoading } = useSelector((state) => state.loaders);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await LoginUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        localStorage.setItem("token", response.data);
        message.success(response.message);
        window.location.href = "/dashboard";
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) {
      window.location.href = "/dashboard";
    }
  }, []);

  return (
    <div className="login-container">
      <div className="left-side">
        <div className="content">
          <h1 className="title">WorkZen</h1>
          <span className="subtitle">
            Streamline your workflow and boost productivity
          </span>
        </div>
      </div>
      <div className="right-side">
        <div className="card">
          <h1 className="card-title">LOGIN TO YOUR ACCOUNT</h1>
          <Divider className="divider" />
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item label="Email" name="email" rules={getAntdFormInputRules}>
              <Input />
            </Form.Item>
            <Form.Item
              label="Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input type="password" />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={buttonLoading}
              className="login-button"
            >
              {buttonLoading ? "Loading" : "Login"}
            </Button>

            <div className="login-link">
              <span>Don't have an account?</span>
              <Link to="/register">Register</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default Login;
