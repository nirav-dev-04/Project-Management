import React, { useState } from "react";
import { Form, Input, Button, message } from "antd";
import { Link } from "react-router-dom";
import { ForgotPasswordUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function ForgotPassword() {
  const [emailSent, setEmailSent] = useState(false);
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await ForgotPasswordUser(values);
      dispatch(SetButtonLoading(false));
      if (response.success) {
        setEmailSent(true);
        message.success(response.message);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      dispatch(SetButtonLoading(false));
      message.error(error.message);
    }
  };

  return (
    <div className="login-container">
      <div className="bg-primary h-screen flex flex-col justify-center items-center">
        <div>
          <h1 className="text-7xl text-white">WorkZen</h1>
          <span className="text-white mt-5">Reset your password securely</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="card p-8 w-full max-w-md">
          {!emailSent ? (
            <>
              <h1 className="text-2xl font-bold text-center mb-6 text-primary">
                FORGOT PASSWORD
              </h1>
              <p className="text-secondary text-center mb-6">
                Enter your email address and we'll send you a link to reset your
                password.
              </p>
              <Form layout="vertical" onFinish={onFinish}>
                <Form.Item
                  label="Email"
                  name="email"
                  rules={getAntdFormInputRules}
                >
                  <Input type="email" />
                </Form.Item>

                <Button
                  type="primary"
                  htmlType="submit"
                  block
                  loading={false}
                  className="login-button"
                >
                  Send Reset Link
                </Button>

                <div className="login-link">
                  <span>Remember your password?</span>
                  <Link to="/login">Login</Link>
                </div>
              </Form>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-center mb-6 text-primary">
                CHECK YOUR EMAIL
              </h1>
              <p className="text-secondary text-center mb-6">
                We've sent a password reset link to your email address.
              </p>
              <div className="text-center">
                <Link to="/login" className="btn btn-primary">
                  Back to Login
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
