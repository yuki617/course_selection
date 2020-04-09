import React from "react";
import "antd/dist/antd.css";
import { Table, Select, Form, Input, Button, Icon } from "antd";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      successLogin: false,
      data: [],
      selectedCourse: []
    };
  }
  render() {
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        console.log(selectedRows);
        this.setState({ selectedCourse: selectedRows });
      }
    };
    let columns = [
      {
        title: "",
        dataIndex: "menu",
        render: () => <Icon type="plus" />
      },
      {
        title: "CourseName",
        dataIndex: "courseName",
        key: "courseName"
      },
      {
        title: "Section",
        dataIndex: "section",
        key: "section"
      },
      {
        title: "Time",
        dataIndex: "time",
        key: "time"
      },
      {
        title: "Location",
        dataIndex: "location",
        key: "location"
      },
      {
        title: "Professor",
        dataIndex: "professor",
        key: "professor"
      },
      {
        title: "CourseId",
        dataIndex: "courseId",
        key: "courseId"
      }
    ];

    let handleChange = async value => {
      fetch(`http://127.0.0.1:5000/${value}`)
        .then(res => res.json())
        .then(data => this.setState({ data: [data] }));
    };
    const { Option } = Select;
    const onSubmitHandler = e => {
      e.preventDefault();
      this.props.form.validateFields((err, values) => {
        if (!err) {
          fetch(
            `http://127.0.0.1:5000/login?username=${values.username}&password=${values.password}`
          )
            .then(res => res.json())
            .then(successLogin =>
              this.setState({ successLogin: successLogin })
            );
        }
      });
    };
    const addCoursesHandler = () => {
      console.log(this.state.selectedCourse);
      fetch(`http://127.0.0.1:5000/addCourse`, {
        method: "POST",
        body: this.state.selectedCourse
      });
    };
    const { getFieldDecorator } = this.props.form;
    return (
      <div className="App">
        <Form onSubmit={onSubmitHandler} className="login-form">
          <Form.Item>
            {getFieldDecorator("username", {
              rules: [
                { required: true, message: "Please enter your username!" }
              ]
            })(
              <Input
                placeholder="Username"
                disabled={this.state.successLogin}
              />
            )}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator("password", {
              rules: [
                { required: true, message: "Please enter your Password!" }
              ]
            })(
              <Input
                type="password"
                placeholder="Password"
                disabled={this.state.successLogin}
              />
            )}
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              disabled={this.state.successLogin}
            >
              Submit
            </Button>
          </Form.Item>
        </Form>
        <Select
          placeholder="Select a section"
          onChange={handleChange}
          style={{ width: 150 }}
          disabled={!this.state.successLogin}
        >
          <Option value="0">sec1</Option>
          <Option value="1">sec2</Option>
        </Select>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={this.state.data}
        />

        <Button
          type="primary"
          htmlType="submit"
          disabled={!this.state.successLogin}
          onClick={addCoursesHandler}
        >
          Add courses
        </Button>
      </div>
    );
  }
}

export default Form.create({ name: "App" })(App);
