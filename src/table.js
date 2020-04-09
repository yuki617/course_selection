import React from "react";
import "antd/dist/antd.css";
import { Table, Select, InputNumber, Button, Divider, Modal  } from "antd";

class Tab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username:this.props.location.state.username,
      data: null,
      program: "",
      sec_value: "",
      selectedCourse: [],
      selectedCourseKeys: [],
      coursesToBeDeleted: [],
      coursesToBeDeletedKeys: [],
      enrolledCourse: [],
      visible: false,
      newCourseRate: null,
      AbleToAdd : 0
    };
  }
  componentDidMount(){
    console.log(this);
    fetch("http://127.0.0.1:5000/")
        .then(res => res.json())
        .then(data => this.setState({ data: data }));
    fetch(`http://127.0.0.1:5000/Courseenroll/${this.state.username}`)
        .then(res => res.json())
        .then(enrolledCourse => this.setState({ enrolledCourse: enrolledCourse }));
  }
  render() {
    const rowSelection = {
        selectedRowKeys: this.state.selectedCourseKeys,
        onChange: (selectedRowKeys, selectedRows) => {
          this.setState({ selectedCourse: selectedRows, selectedCourseKeys: selectedRowKeys });
        }
      };
    const addDeletedCourses = {
        selectedRowKeys: this.state.coursesToBeDeletedKeys,
        onChange: (selectedRowKeys, selectedRows) => {
            this.setState({ coursesToBeDeleted: selectedRows, coursesToBeDeletedKeys: selectedRowKeys });
        }
    };

    const setModalVisible = val => this.setState({visible: val});
    const editCoruseRate = () => setModalVisible(true);
    const updateCourseToBeEdit = val => {
        this.setState({newCourseRate: val})
    }
    const courseToBeEdit = () => {
        return (
            this.state.selectedCourse[0] ?
            <div>
                Course Name: {this.state.selectedCourse[0].coursename}
                <br />
                Rate: {<InputNumber min={0} max={5} precision={0} defaultValue={this.state.selectedCourse[0].rate} onChange={updateCourseToBeEdit}/>}
            </div>
            : null
        )
    }
    const handleOk = () => {
        let course = this.state.selectedCourse[0];
        course.rate = this.state.newCourseRate;
        fetch(`http://127.0.0.1:5000/editRate`, {
          method: "POST",
          body: JSON.stringify(this.state.selectedCourse)
        })
        // .then(res => console.log(res.json()))
        .then(function(response){
            return response.json();
        })
        .then(function(jsonData){
                return JSON.stringify(jsonData);
        })
        .then(SelectedCourse => {
            window.location.reload(true)
        })
        // api call using course, then update selectedCourse
        setModalVisible(false);
    }
    const handleCancel = () => {
        this.setState({newCourseRate: this.state.selectedCourse[0].rate})
        setModalVisible(false);
    }

    const changeRate = val => {
        console.log(val)
    }
    let columns = [
      {
        title: "CourseName",
        dataIndex: "coursename",
        key: "coursename"
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
        title: "Instructor",
        dataIndex: "instructor",
        key: "instructor"
      },
      {
        title: "Rate",
        dataIndex: "rate",
        key: "rate"
      },
      {
        title: "Number_of_Ratings",
        dataIndex: "number_of_ratings",
        key: "number_of_ratings"
      }
    ];

    let handleChange = async value => {
        var lst = value.toString().split(",");
        const group = lst[0];
        const sec_id = lst[1];
        fetch(`http://127.0.0.1:5000/course/${value}`)
        .then(res => res.json())
        .then(data => this.setState({ data: data }));
        this.setState({ program: group });
        this.setState({ sec_value: sec_id });
        // .then(sec_value => this.setState({sec_value: value}));
    };
    
    let handleGroup = async value => {
        fetch(`http://127.0.0.1:5000/courseprogram/${value}`)
        .then(res => res.json())
        .then(data => this.setState({ data: data }));
    };
    
    const addCoursesHandler = () => {
        console.log(this.state.selectedCourse);
        fetch(`http://127.0.0.1:5000/Check/${this.state.username}`,{
            method: "POST",
            body: JSON.stringify(this.state.selectedCourse)
        })
        .then(res => res.json())
        .then(AbleToAdd => this.setState({ AbleToAdd: AbleToAdd }));
        console.log(this.state.AbleToAdd);
        if (this.state.AbleToAdd ==1){
          fetch(`http://127.0.0.1:5000/addCourse/${this.state.username}`, {
            method: "POST",
            body: JSON.stringify(this.state.selectedCourse)
          });
          fetch(`http://127.0.0.1:5000/Courseenroll/${this.state.username}`)
          .then(res => res.json())
          .then(enrolledCourse => this.setState({ enrolledCourse: enrolledCourse }));
          this.setState({selectedCourseKeys: []});
        }
    };

    const deleteCoursesHandler = () => {
        console.log(this.state.coursesToBeDeleted);
        fetch(`http://127.0.0.1:5000/deleteCourse/${this.state.username}`, {
          method: "POST",
          body: JSON.stringify(this.state.coursesToBeDeleted)
        });
        fetch(`http://127.0.0.1:5000/Courseenroll/${this.state.username}`)
        .then(res => res.json())
        .then(enrolledCourse => this.setState({ enrolledCourse: enrolledCourse }));
        this.setState({coursesToBeDeletedKeys: []})
    };

    let handlesort = () =>{
      fetch(`http://127.0.0.1:5000/course/sort/program=${this.state.program}&section=${this.state.sec_value}`)
        .then(res => res.json())
        .then(data => this.setState({ data: data }));
    };

    const { Option } = Select;

    const children = [];
    const cs_courses = ["100","105","106","115","116","135","136","138","146",
                      "200","230","240","240E","241","245","246","251",
                      "330","335","338","341","343","348","349","350","360","365","370","371","383","399",
                      "430","431","436","442","444","445","446","447","448","450","451","452","454","456","458",
                    "462","467","476","480","482","485","486","487","488","489","490","492","494","499R","499T"];
    for (let i = 0; i < cs_courses.length; i++) {
      children.push(<Option key={"CS,"+cs_courses[i]}>{"CS"+cs_courses[i]}</Option>);
    }
    const math_courses = ["97","103","104","106","114","118","119","127","128","135",
                            "136","137","138","146","148","207","213","217","225","228",
                            "235","237","239","247","249"];
    for (let i = 0; i < math_courses.length; i++) {
      children.push(<Option key={"MATH,"+math_courses[i]}>{"Math"+math_courses[i]}</Option>);
    }
    
    return (
      <div className="App">
        <Select
          mode="tags"
          placeholder="Select a course"
          onChange={handleChange}
          style={{ width: 150 }}
        >
          {children}
        </Select>
        <Button
          type = 'Primary'
          onClick={handlesort}
          style={{ width: 150 }}
        >Sort by Rate
        </Button>
        <Select
          mode="tags"
          placeholder="Select a program"
          onChange={handleGroup}
          style={{ width: 150 }}
        >
          <Option key={"MATH"}>{"Math Couse"}</Option>
          <Option key={"CS"}>{"CS Couse"}</Option>
        </Select>
        <Divider style={{opacity: 0}}/>
        <Button
          type="primary"
          htmlType="submit"
          onClick={addCoursesHandler}
        >
          Add courses
        </Button>
        <Button
          type="primary"
          htmlType="submit"
          onClick={editCoruseRate}
          disabled={this.state.selectedCourseKeys.length !== 1}
        >
          Edit courses rate
        </Button>
        <Modal
          title="Edit courses rate"
          visible={this.state.visible}
          onOk={handleOk}
          onCancel={handleCancel}
        >
            {courseToBeEdit()}
        </Modal>
        <Table rowSelection={rowSelection} columns={columns} dataSource={this.state.data} />
        <Divider style={{opacity: 0}}/>
        <Button
          type="primary"
          htmlType="submit"
          onClick={deleteCoursesHandler}
        >
          Delete courses
        </Button>
        <Table rowSelection={addDeletedCourses} columns={columns} dataSource={this.state.enrolledCourse} />
      </div>
    );
  }
}

export default Tab;