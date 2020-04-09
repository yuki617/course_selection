# Copyright 2016 Google Inc.
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.

# [START app]
import datetime
import logging
import os
import json

from flask import Flask, render_template, request, Response, json
from flask_cors import CORS
import sqlalchemy

# db_user = os.environ.get("DB_USER")
# db_pass = os.environ.get("DB_PASS")
# db_name = os.environ.get("DB_NAME")
# cloud_sql_connection_name = os.environ.get("CLOUD_SQL_CONNECTION_NAME")
cloud_sql_connection_name='constant-012920:us-central1:cs348demo-db'


app = Flask(__name__)
CORS(app)

logger = logging.getLogger()
addedCourse = []
# [START cloud_sql_mysql_sqlalchemy_create]
# The SQLAlchemy engine will help manage interactions, including automatically
# managing a pool of connections to your database
db = sqlalchemy.create_engine(
    # Equivalent URL:
    # mysql+pymysql://<db_user>:<db_pass>@/<db_name>?unix_socket=/cloudsql/<cloud_sql_instance_name>
    sqlalchemy.engine.url.URL(
        drivername="mysql+pymysql",
        username='root',
        password='password',
        database='random',
        query={"unix_socket": "/cloudsql/{}".format(cloud_sql_connection_name)},
    ),
    # ... Specify additional properties here.
    # [START_EXCLUDE]
    # [START cloud_sql_mysql_sqlalchemy_limit]
    # Pool size is the maximum number of permanent connections to keep.
    pool_size=5,
    # Temporarily exceeds the set pool_size if no connections are available.
    max_overflow=2,
    pool_timeout=30,  # 30 seconds
    pool_recycle=1800,  # 30 minutes
    # [END cloud_sql_mysql_sqlalchemy_lifetime]
    # [END_EXCLUDE]
)

#View All Course
@app.route('/', methods=['GET','POST'])
def get_companies():
    error = None    
    #select = request.form.get('comp_select')   
    with db.connect() as conn:
        stmt = sqlalchemy.text(
            "Select CONCAT(Program,CN) as coursename,section,time,location,instructor,rate,number_of_ratings from(Select *from enroll as T1 Left Outer join instructor as I1 ON T1.instructor = I1.name Left Outer join course as C1 ON T1.key_number = C1.key_num) AS K order by Program,CN,SUBSTRING(section, 1, 3),SUBSTRING(section, 5, 5);"
        )
        #data = conn.execute(stmt)
        data = conn.execute(stmt).fetchall()   
        #convert sql to json
        classes_as_dict = []
        #print(data)
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[0],
                'section': class_data[1],
                'time': class_data[2],
                'location': class_data[3],
                'instructor': class_data[4],
                'rate': class_data[5],
                'number_of_ratings':class_data[6],
                }
            classes_as_dict.append(class_as_dict)
        return json.dumps(classes_as_dict)

#Select by Course Name
@app.route('/course/<course_name>', methods=['GET'])
def get_courses(course_name):
    error = None  
    lst =  course_name.split(",") 
    group = lst[0]
    sec_id = lst[1]
    #select = request.form.get('comp_select')   
    with db.connect() as conn:
        stmt = sqlalchemy.text(
            "Select CONCAT(Program,CN) as coursename,section,time,location,instructor,rate,number_of_ratings from(Select *from enroll as T1 Left Outer join instructor as I1 ON T1.instructor = I1.name Left Outer join course as C1 ON T1.key_number = C1.key_num) AS K where Program =:Program and CN =:CN order by Program,CN,SUBSTRING(section, 1, 3),SUBSTRING(section, 5, 5);"
        )
        #data = conn.execute(stmt)
        data = conn.execute(stmt,Program = group,CN =sec_id).fetchall()   
        #convert sql to json
        classes_as_dict = []
        print(data)
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[0],
                'section': class_data[1],
                'time': class_data[2],
                'location': class_data[3],
                'instructor': class_data[4],
                'rate': class_data[5],
                'number_of_ratings':class_data[6],
                }
            classes_as_dict.append(class_as_dict)
        return json.dumps(classes_as_dict)

#Select by Program Name

@app.route('/courseprogram/<program>', methods=['GET'])
def get_program(program):
    error = None  
    #select = request.form.get('comp_select')   
    with db.connect() as conn:
        stmt = sqlalchemy.text(
            "Select CONCAT(Program,CN) as coursename,section,time,location,instructor,rate,number_of_ratings from(Select *from enroll as T1 Left Outer join instructor as I1 ON T1.instructor = I1.name Left Outer join course as C1 ON T1.key_number = C1.key_num) AS K where Program =:Program order by Program,CN,SUBSTRING(section, 1, 3),SUBSTRING(section, 5, 5);"
        )
        #data = conn.execute(stmt)
        data = conn.execute(stmt,Program = program).fetchall()   
        #convert sql to json
        classes_as_dict = []
        #print(data)
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[0],
                'section': class_data[1],
                'time': class_data[2],
                'location': class_data[3],
                'instructor': class_data[4],
                'rate': class_data[5],
                'number_of_ratings':class_data[6],
                }
            classes_as_dict.append(class_as_dict)
        return json.dumps(classes_as_dict)

#Sort by Rate

@app.route('/course/sort/program=<program>&section=<sec_value>', methods=['GET'])
def get_sort_courses(program,sec_value):
    error = None    
    group = program
    sec_id = sec_value
    #select = request.form.get('comp_select')   
    with db.connect() as conn:
        stmt = sqlalchemy.text(
            "Select CONCAT(Program,CN) as coursename,section,time,location,instructor,rate,number_of_ratings from(Select *from enroll as T1 Left Outer join instructor as I1 ON T1.instructor = I1.name Left Outer join course as C1 ON T1.key_number = C1.key_num) AS K where Program=:Program and CN =:CN order by Program,CN,SUBSTRING(section, 1, 3),rate DESC;"
        )
        #data = conn.execute(stmt)
        data = conn.execute(stmt,Program=group,CN =sec_id).fetchall() 
        #convert sql to json
        classes_as_dict = []
        # print(sec_id)
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[0],
                'section': class_data[1],
                'time': class_data[2],
                'location': class_data[3],
                'instructor': class_data[4],
                'rate': class_data[5],
                'number_of_ratings':class_data[6],
                }
            classes_as_dict.append(class_as_dict)
        # print(json.dumps(classes_as_dict))
        return json.dumps(classes_as_dict)

addedCourse = []

#Login

@app.route('/login', methods=['GET','POST'])
def login():
 username = request.args.get('username')
 password = request.args.get('password')
 classes_as_dict = []
 with db.connect() as conn:
     stmt = sqlalchemy.text("Select * from student;")
     data = conn.execute(stmt).fetchall() 
     for class_data in data:
        if class_data[0] == username and class_data[1] == password:
            classes_as_dict.append(True)
            return json.dumps(True)
 classes_as_dict.append(False)
 return json.dumps(False)

#Check the ability to add course

@app.route('/Check/<username>', methods=['GET','POST'])
def CheckCourse(username):
    arr = request.data.decode("utf-8")
    arr = json.loads(arr)
    print(arr)
    res = 1
    with db.connect() as conn:
            stmt = sqlalchemy.text(
                "Select Count(distinct coursename,section) from shoppingchart where user=:user")
            for class_data in arr:
                data = conn.execute(stmt,user=username).fetchall() 
                print(data)
                if (data[0][0] > 4):
                    res = 0
            stmt = sqlalchemy.text(
                "select count(class) from (select * from antireq where (class =:coursename  and anti in (select coursename from shoppingchart where user =:user)) OR (anti =:coursename and class in (select coursename from shoppingchart where user =:user ))) as T1;")
            for class_data in arr:
                data = conn.execute(stmt,user=username,coursename=class_data['coursename']).fetchall() 
                if (data[0][0] > 0):
                    res = 0
    print(res)
    return json.dumps(res)

#Add Course

@app.route('/addCourse/<username>', methods=['GET','POST'])
def addCourse(username):
    arr = request.data.decode("utf-8")
    arr = json.loads(arr)
    print(arr)
    with db.connect() as conn:
            stmt = sqlalchemy.text(
                "INSERT INTO shoppingchart (user, coursename, section, time,location,instructor,rate,number_of_ratings)" "VALUES (:user, :coursename, :section, :time,:location,:instructor,:rate,:number_of_ratings)")
            for class_data in arr:
                conn.execute(stmt,user=username,coursename=class_data['coursename'],section=class_data['section'],time=class_data['time'],location=class_data['location'],instructor=class_data['instructor'],rate=class_data['rate'],number_of_ratings=class_data['number_of_ratings'])
    return arr

#Delete Course

@app.route('/deleteCourse/<username>', methods=['GET','POST'])
def deleteCourse(username):
    arr = request.data.decode("utf-8")
    arr = json.loads(arr)
    print(arr)
    with db.connect() as conn:
            stmt = sqlalchemy.text(
                "DELETE FROM shoppingchart WHERE user=:user and coursename =:coursename and section=:section and time=:time and location=:location")
            for class_data in arr:
                conn.execute(stmt,user=username,coursename=class_data['coursename'],section=class_data['section'],time=class_data['time'],location=class_data['location'])
    return arr

#Edit Rate

@app.route('/editRate', methods=['GET','POST'])
def editRate():
    arr = request.data.decode("utf-8")
    arr = json.loads(arr)
    arr_list = arr[0]['coursename'].split()
    with db.connect() as conn:
        stmt = sqlalchemy.text(
               "UPDATE instructor SET rate = (((rate*number_of_ratings)+:rate)/(number_of_ratings +1)),number_of_ratings = number_of_ratings+1 WHERE name=:instructor;")
        for class_data in arr:
            conn.execute(stmt,rate=class_data['rate'],instructor=class_data['instructor'])  
        stmt = sqlalchemy.text(
               "UPDATE shoppingchart SET rate = (((rate*number_of_ratings)+:rate)/(number_of_ratings +1)),number_of_ratings = number_of_ratings+1 WHERE instructor=:instructor;")
        for class_data in arr:
            conn.execute(stmt,rate=class_data['rate'],instructor=class_data['instructor'])

        stmt1 = sqlalchemy.text(
            "Select CONCAT(Program,CN) as coursename,section,time,location,instructor,rate,number_of_ratings from(Select *from enroll as T1 Left Outer join instructor as I1 ON T1.instructor = I1.name Left Outer join course as C1 ON T1.key_number = C1.key_num) AS K WHERE Program =:Program and CN=:CN and section=:section and time=:time and location=:location;")
        data = conn.execute(stmt1,Program=arr_list[0],CN = arr_list[1],section=class_data['section'],time=class_data['time'],location=class_data['location']).fetchall()
        #convert sql to json
        classes_as_dict = []
        # print(sec_id)
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[0],
                'section': class_data[1],
                'time': class_data[2],
                'location': class_data[3],
                'instructor': class_data[4],
                'rate': class_data[5],
                'number_of_ratings':class_data[6],
                }
            classes_as_dict.append(class_as_dict)
        print(json.dumps(classes_as_dict))
        return json.dumps(classes_as_dict)

#View ShoppingChart

@app.route('/Courseenroll/<username>', methods=['GET'])
def get_selected_courses(username):
    error = None    
    #select = request.form.get('comp_select')   
    with db.connect() as conn:
        stmt = sqlalchemy.text(
            "Select * from shoppingchart where user=:username;"
        )
        #data = conn.execute(stmt)
        data = conn.execute(stmt,username =username).fetchall() 
        #convert sql to json
        classes_as_dict = []
        for class_data in data:
            class_as_dict = {
                'coursename': class_data[1],
                'section': class_data[2],
                'time': class_data[3],
                'location': class_data[4],
                'instructor': class_data[5],
                'rate': class_data[6],
                'number_of_ratings':class_data[7],
                }
            classes_as_dict.append(class_as_dict)
        # print(json.dumps(classes_as_dict))
        return json.dumps(classes_as_dict)



@app.route('/register', methods=['GET','POST'])
def register():
    username = request.args.get('username')
    password = request.args.get('password')
    print(username)
    with db.connect() as conn:
            stmt = sqlalchemy.text(
                "INSERT INTO student (username, password)"  "VALUES (:username, :password)")
            conn.execute(stmt,username=username,password=password)
    return json.dumps(True)


if __name__=='__main__':    
    app.run(debug=True)

@app.errorhandler(500)
def server_error(e):
    # Log the error and stacktrace.
    logging.exception('An error occurred during a request.')
    return 'An internal error occurred.', 500
