#!flask/bin/python
from flask import Flask, jsonify
import mysql.connector as ms
import random
# from flask_wtf import FlaskForm
from flask import request, make_response
import hashlib
import datetime
from flask_httpauth import HTTPBasicAuth
auth = HTTPBasicAuth()
# conn=''
app = Flask(__name__)
host='localhost'
password='password'
user='root'
db='sport'
conn=ms.connect(host=host, passwd=password, user=user, database=db)
cursor = conn.cursor()
# class DBconnection:
#     def __init__(self,):
#         __conn=''
#     def createConnection(self,):
#     def closeConnection(self):
#         self.__conn.close()

# @app.error_handlers(404)
# def not_found():
#     return make_response(jsonify({'error': 'not found'}), 404)

@auth.get_password
def get_password(email):
    sql1 = 'select userid from user where email='+ascii(email)
    
    try:
        cursor.execute(sql1)
        user_id = cursor.fetchone()[0]
        # print(user_id)

        sql2 = 'select password from credential where userid='+ascii(user_id)
        cursor.execute(sql2)
        print(cursor.fetchone[0])
        return cursor.fetchone()[0]
    except Exception as e:
        print(e)
        return None

@auth.error_handler
def unauthorized():
    return make_response(jsonify({'error': 'Unauthorized access'}), 401)

@app.route('/user/add/', methods=['post'])
# @auth.login_required
def createuser():
    if not request.json:
        # print(request.json)
        print('error')
        # abort(404)
        return make_response({'error': 'no json file found'})
    num = random.randrange(1000000000, 9999999999)
    name = request.json['name']
    user_id =  name[0:3]+str(num)
    age = int(request.json['age'])
    address = request.json['address']
    user_type=request.json['type']
    email=request.json['email']
    mobile=request.json['mobile']
    pic_url=request.json['pic']
    password=request.json['password']
    security_question=request.json['security_question']
    try:
        createCrentials(user_id, password, user_type, security_question)
        sql = 'insert into user values (%s, %s, %s, %s, %s, %s, %s)'
        val = (user_id, name, email, mobile, address, pic_url, age)
        cursor.execute(sql, val)
        conn.commit()
        return make_response(jsonify({'success' : True}))
    except Exception as e:
        print(e)
        conn.rollback()
        return make_response(jsonify({'error': 'insertion error', 'success': False}))
    # address = request.json['planid']


# @app.route('/user/credentials/add/', methods=['post'])
def createCrentials(user_id , password, user_type, security_question):
    time = datetime.datetime.now()
    sql = 'insert into credential values(%s, %s, %s, %s, %s)'
    val = (user_id, password, user_type, time, security_question)
    cursor.execute(sql, val)
    # conn.commit() 
    # except Exception as e:
    #     print(e)
    #     conn.rollback()
    # except Exception as e:
    #     conn.rollback()

@app.route('/user/update/<string:email>/', methods=['put'])
# @auth.login_required
def updateUser(email):
    try:
        
        sql = 'select * from user where email = '+ascii(email)
        result = cursor.execute(sql)
        if len(result) <= 0:
            return make_response(jsonify({
                "found" : False,
                "success": False,
                "Error": 'Email not found'
            }))
        name=''
        mobile=''
        address=''
        # pic_url=''
        age=''
        for row in result:
            name=row[1]
            mobile=row[3]
            address=row[4]
            # pic_url=row[5]
            age=row[6]
        if 'name' in request.json and type(request.json['name']) is unicode:
            name = request.json['name']

        if 'mobile' in request.json:
            mobile = request.json['mobile']

        if 'address' in request.json:
            address = request.json['address']
        
        if 'age' in request.json:
            age = request.json['age']
        
        # if 'pic_url' in request.json:
        #     pic_url = request.json['name']
        
        updatesql = 'update user set name = %s, mobile = %s, address=%s, age=%s where email=%s'
        cursor.execute(updatesql, (name, mobile, address, age, email))
        conn.commit()
    except Exception as e:
        conn.rollback()
        return make_response(jsonify({'success': False}))

@app.route('/user/delete/<string:email>', methods=['delete'])
# @auth.login_required
def deleteUser(email):
    sql = 'select userid from user where email='+ascii(email)
    try:
        cursor.execute(sql)
        res = cursor.fetchone[0]
        sql = 'delete from user where userid='+res[0]
        cursor.execute(sql)
        # res = cursor.fetchone[0]
        sql = 'delete from credential where userid='+res[0]
        conn.commit()
        return make_response(jsonify({'success': True}))
    except Exception as e:
        print(e)
        conn.rollback()
        return make_response(jsonify({'success': False, 'message': 'Error while deletion'}))

@app.route('/user/display/<string:email>', methods=['get'])
# @auth.login_required
def displayUser(email):
    sql = 'select * from user where email = '+ascii(email)
    try:
        cursor.execute(sql)
        ans = {}
        res=cursor.fetchall()
        for row in res:
            ans['userid']=row[0]
            ans['name']=row[1]
            ans['email']=row[2]
            ans['mobile']=row[3]
            ans['address']=row[4]
            ans['pic_url']=row[5]
            ans['age']=row[6]
        ans['success']=True
        return make_response(jsonify(ans))
    except Exception as e:
        print(e)
        return make_response(jsonify({'success': False, 'message':'Can\'t display detail due to internal error'}))

@app.route('/user/login/<string:email>', methods=['get'])
def login(email):
    # email = request.json['email']
    # password = request.json['password']
    try:
        sql = 'select userid from user where email = '+ascii(email)
        cursor.execute(sql)
        res = cursor.fetchone()
        if len(res)<1:
            return make_response(jsonify({'success': False, 'error': 'user name not found'}))
        sql = 'select password from credential where userid = '+ascii(res[0])
        cursor.execute(sql)
        res = cursor.fetchone()
        return make_response(jsonify({'success': True, 'password': res[0]}))
    except Exception as e:
        print(e)
        return make_response(jsonify({'success': False, 'error': 'not found'}))

@app.route('/user/displayall/', methods=['get'])
# @auth.login_required
def displayAllUser():
    sql = 'select * from user'
    try:
        cursor.execute(sql)
        res = cursor.fetchall()
        print(res)
        t=[]
        for row in res:
            ans={}
            ans['userid']=row[0]
            ans['name']=row[1]
            ans['email']=row[2]
            ans['mobile']=row[3]
            ans['address']=row[4]
            ans['pic_url']=row[5]
            ans['age']=row[6]
            t.append(ans)

        t.append({'success': True})
        print(t)
        return make_response(jsonify(t))
    except Exception as e:
        print(e)
        return make_response(jsonify({'success': False, 'message': 'There is an error'}))

@app.route('/sports/add/', methods=['post'])
# @auth.login_required
def createSports():
    if not request.json:
        return make_response(jsonify({'error': 'no json file found'}))
    name = request.json['name']
    sport_type = request.json['type']
    sql = 'insert into sports (name, type) values (%s, %s)'
    val = (name, sport_type)
    try:
        cursor.execute(sql, val)
        conn.commit()
        return make_response(jsonify({'success' : 'true'}))
    except Exception as e:
        conn.rollback()
        print(e)
        return make_response(jsonify({'error': 'insertion error', 'success': 'false',}))


@app.route('/user/updatepassword/<string:email>/', methods=['put'])
# @auth.login_required
def updatePassword(email):
    if not request.json:
        abort(404)
    try:
        sql = 'select userid from user where email = '+ascii(email)
        cursor.execute(sql)
        res=cursor.fetchone()
        sql2 = 'select security_question from credential where user id='+ascii(res[0])
        cursor.execute(sql2)
        res = cursor.fetchone()
    except Exception as e:
        print(e)
        return make_response(jsonify({'error': 'error while select'}))
    if res[0] == request.json['security_question']:
        try:
            newPassword = request.json['new_password']
            sql = 'update credential set password=%s where userid=%s'
            val = (newPassword, sql)
            cursor.execute(sql, val)
            conn.commit()
            return make_response(jsonify({'success': True}))
        except Exception as e:
            print(e)
            conn.rollback()
            return make_response(jsonify({'success': False, 'error':'Error while updation'}))
    else:
        return make_response(jsonify({'success': False, 'error': 'Wrong security question'}))

@app.route('/package/book/', methods=['post'])
# @auth.login_required
def bookPackage():
    email=request.json['email']
    packageid=request.json['package_id']
    # featureId=request.json['featureId']
    timestamp = datetime.datetime.now()
    try:
        sql='insert into booking (email, packageid, timestamp) values(%s, %s, %s)'
        val=(email, packageid, timestamp)
        cursor.execute(sql, val)
        conn.commit()
        return make_response(jsonify({'success':True}))
    except Exception as e:
        print(e)
        cursor.rollback()
        return make_response(jsonify({'success': False}))

@app.route('/package/display/', methods=['get'])
def displayPackage():
    sql = 'select * from package'
    try:
        cursor.execute(sql)
        res = cursor.fetchall()
        ans = []
        for i in res:
            dic = {}
            dic['id'] = i[0] 
            dic['name'] = i[1] 
            dic['sports'] = i[2] 
            dic['price'] = i[3]
            dic['valid_upto'] = i[4]
            ans.append(dic)
            print(i)
        ans.append({'success' : True})
        print(ans)
        return make_response(jsonify(ans))
    except Exception as e:
        print(e)
        return make_response(jsonify({'success': False})) 


# @app.route('/package/add/', methods=['post'])
# @auth.login_required
# def addPackage():
#     packageName = request.json['name']
    
# @app.route('/package/display/', methods=['get'])
# def displayPackage():
#     sql = 'select * from sport_plan'
#     sql1 = ''

if __name__ == '__main__':
    app.run(debug=True)