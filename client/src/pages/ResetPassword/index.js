import React from "react";
import { Form, Input, Button, message } from "antd";
import { Link, useParams, useNavigate } from "react-router-dom";
import { ResetPasswordUser } from "../../apicalls/users";
import { useDispatch } from "react-redux";
import { SetButtonLoading } from "../../redux/loadersSlice";
import { getAntdFormInputRules } from "../../utils/helpers";

function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = async (values) => {
    try {
      dispatch(SetButtonLoading(true));
      const response = await ResetPasswordUser({ ...values, token });
      dispatch(SetButtonLoading(false));
      if (response.success) {
        message.success(response.message);
        navigate("/login");
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
          <span className="text-white mt-5">Set your new password</span>
        </div>
      </div>
      <div className="flex justify-center items-center">
        <div className="card p-8 w-full max-w-md">
          <h1 className="text-2xl font-bold text-center mb-6 text-primary">
            RESET PASSWORD
          </h1>
          <p className="text-secondary text-center mb-6">
            Enter your new password below.
          </p>
          <Form layout="vertical" onFinish={onFinish}>
            <Form.Item
              label="New Password"
              name="password"
              rules={getAntdFormInputRules}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              label="Confirm Password"
              name="confirmPassword"
              dependencies={["password"]}
              rules={[
                ...getAntdFormInputRules,
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error("Passwords do not match!"));
                  },
                }),
              ]}
            >
              <Input.Password />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              loading={false}
              className="login-button"
            >
              Reset Password
            </Button>

            <div className="login-link">
              <span>Remember your password?</span>
              <Link to="/login">Login</Link>
            </div>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default ResetPassword;
