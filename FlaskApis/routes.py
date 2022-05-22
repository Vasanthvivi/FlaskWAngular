from app import app
from flask import jsonify, make_response, request
import jwt
import datetime
from dbConfig import sql

app.config["secret-key"] = "thisisatokensecret"
currentUsers = []


@app.route("/api/auth/login", methods=["POST"])
def login():
    [username, password] = [request.json["username"], request.json["password"]]
    sqlobj = sql.connect()
    cursor = sqlobj.cursor()
    try:
        userData = cursor.execute(
            f"select * from users where username = \"{username}\" and userpassword = \"{password}\"")
        if userData == 0:
            payload = {"message": "Profile not found!"}
            return makeResponse(payload, 400)
        else:
            userId = cursor.fetchall()[0][0]
            generatedToken = jwt.encode(
                {"username": username, "password": password,
                 "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)},
                app.config["secret-key"], algorithm="HS256")
            if username == "admin" or username == "Admin":
                cursor.execute(f"select * from users")
                userData = cursor.fetchall()
                cursor.execute(f"select * from todos")
                todosData = cursor.fetchall()
                payload = {"token": generatedToken, "userId": userId, "users": userData, "todos": todosData,
                           "expiry": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)}
            else:
                payload = {"token": generatedToken, "userId": userId,
                           "expiry": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)}
            return makeResponse(payload, 201)
    except Exception as e:
        payload = {"message": "Internal Server Error!"}
        return makeResponse(payload, 500)
    finally:
        cursor.close()
        sqlobj.close()


@app.route("/api/auth/signup", methods=["POST"])
def signUp():
    [username, password] = [request.json["username"], request.json["password"]]
    sqlobj = sql.connect()
    cursor = sqlobj.cursor()
    try:
        dbRestponse = cursor.execute(f"select * from users where username = \"{username}\"")
    except Exception as e:
        return makeResponse({"message": "Internal Server Error!"}, 500)
    try:
        cursor.execute("select * from users")
        users = cursor.fetchall()
        for user in users:
            if user[1] == username:
                payload = {"message": "user already exist!"}
                return makeResponse(payload, 400)
        dbResponse = cursor.execute(f"insert into users(username, userpassword) values(\"{username}\", \"{password}\")")
        userId = cursor.lastrowid
        sqlobj.commit()
        if dbResponse == 1:
            generatedToken = jwt.encode(
                {"username": username, "password": password,
                 "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)},
                app.config["secret-key"], algorithm="HS256")
            payload = {"token": generatedToken, "message": "user created!", "userId": userId,
                       "expiry": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)}
            return makeResponse(payload, 201)
    except Exception as e:
        payload = {"message": "Internal Server Error!"}
        return makeResponse(payload, 500)
    finally:
        cursor.close()
        sqlobj.close()


def isValidToken(receivedToken):
    try:
        isvalid = jwt.decode(receivedToken, app.config["secret-key"], algorithms=["HS256"])
        return True
    except Exception as e:
        return False


def makeResponse(payload, status):
    res = jsonify(payload)
    res.status_code = status
    return res


@app.route("/api/auth/forgotpassword", methods=["POST"])
def forgotPassword():
    username = request.json["username"]
    sqlobj = sql.connect()
    cursor = sqlobj.cursor()
    try:
        dbResponse = cursor.execute(f"select userpassword from users where username = \"{username}\"")
        if dbResponse == 1:
            payload = {"password": cursor.fetchall()[0][0]}
            return makeResponse(payload, 200)
        else:
            return makeResponse({"message": "no user exist!"}, 404)
    except Exception as e:
        return makeResponse({"message": "Internal Server Error!"}, 500)
    finally:
        cursor.close()
        sqlobj.close()


@app.route("/api/getTodos", methods=["POST"])
def getTodos():
    token = ""
    try:
        token = request.headers["Token"]
    except Exception as e:
        return makeResponse({"message": "unauthorized!"}, 401)
    if isValidToken(token):
        userId = request.json["userId"]
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            cursor.execute(f"select * from todos where fk_userid = \"{userId}\"")
            todos = cursor.fetchall()
            return makeResponse({"todos": todos}, 200)
        except Exception as e:
            return makeResponse({"message": "bad data!"}, 404)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"message": "unauthorized! login again!"}, 401)


@app.route("/api/deleteTodos", methods=["POST"])
def deleteTodos():
    sqlobj = sql.connect()
    cursor = sqlobj.cursor()
    token = ""
    try:
        token = request.headers["Token"]
    except Exception as e:
        return makeResponse({"message": "unauthorized!"}, 401)
    if isValidToken(token):
        try:
            todos = request.json["todos"]
            todosSize = len(todos)
            for todoid in todos:
                cursor.execute(f"delete from todos where todoid = \"{todoid}\"")
                sqlobj.commit()
            return makeResponse({"message": "deleted successfully!", "numberOfDeletedData": todosSize}, 200)
        except Exception as e:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"message": "unauthorized"}, 401)


@app.route("/api/createTodo", methods=["POST"])
def createTodo():
    token = ""
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            [userId, title, description] = [request.json["userId"], request.json["title"], request.json["description"]]
            dbResponse = cursor.execute(
                f"insert into todos(fk_userid, todo, todo_description) values(\"{userId}\", \"{str(title)}\",\"{str(description)}\")")
            todoid = cursor.lastrowid
            sqlobj.commit()
            if dbResponse == 1:
                cursor.execute(f"select * from todos where todoid = \"{todoid}\"")
                currentTodo = cursor.fetchall()
                cursor.execute(f"select count(todoid) from todos")
                return makeResponse({"message": "todo created successfully!", "createdTodo": currentTodo,
                                     "totalTodos": cursor.fetchall()}, 201)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"messsage": "unauthorized"}, 401)


@app.route("/api/edit-user", methods=["POST"])
def editUser():
    token = ""
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            [userId, username, password] = [request.json["userId"], request.json["username"], request.json["password"]]
            dbResponse = cursor.execute(
                f"update users set username = \"{username}\", userpassword = \"{password}\" where userid = \"{userId}\"")
            sqlobj.commit()
            if dbResponse == 1:
                return makeResponse({"message": "Profile updated!", "username": username, "userId": userId}, 201)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"messsage": "unauthorized"}, 401)


@app.route("/api/remove-user", methods=["POST"])
def removeUser():
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            userId = request.json["userId"]
            dbResponse = cursor.execute(f"delete from users where userid = \"{userId}\"")
            sqlobj.commit()
            cursor.execute(f"delete from todos where fk_userid = \"{userId}\"")
            sqlobj.commit()
            if dbResponse == 1:
                return makeResponse({"message": "User removed!", "userId": userId}, 200)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"messsage": "unauthorized"}, 401)


@app.route("/api/add-user", methods=["POST"])
def addUser():
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            [username, password] = [request.json["username"], request.json["password"]]
            dbResponse = cursor.execute(f"select * from users where username = \"{username}\"")
            if dbResponse != 0:
                payload = {"message": "user already exist!"}
                return makeResponse(payload, 400)
            else:
                dbResponse = cursor.execute(
                    f"insert into users(username, userpassword) values(\"{username}\", \"{password}\")")
                userId = cursor.lastrowid
                sqlobj.commit()
                if dbResponse == 1:
                    cursor.execute(f"select * from todos ")
                    payload = {"message": "User Added!", "userId": userId, "username": username}
                    return makeResponse(payload, 201)
                else:
                    return makeResponse({"message": "Internal Server Error!"}, 500)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
    else:
        return makeResponse({"message": "unauthorized"}, 401)


@app.route("/api/auth/admin-login", methods=["POST"])
def adminLogin():
    try:
        [username, password] = [request.json["username"], request.json["password"]]
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        generatedToken = jwt.encode(
            {"username": username, "password": password,
             "exp": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)},
            app.config["secret-key"], algorithm="HS256")
        cursor.execute(f"select * from users")
        userData = cursor.fetchall()
        cursor.execute(f"select * from todos")
        todosData = cursor.fetchall()
        cursor.execute(f"select count(todoid) from todos")
        payload = {"token": generatedToken, "userId": "-1", "users": userData, "todos": todosData,
                   "totalTodos": cursor.fetchall(),
                   "expiry": datetime.datetime.utcnow() + datetime.timedelta(minutes=20)}
        cursor.close()
        sqlobj.close()
        return makeResponse(payload, 200)
    except Exception as e:
        return makeResponse({"message": "Internal Server Error!"}, 500)


@app.route("/api/edit-todo", methods=["POST"])
def editTodo():
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            [todoid, todo, todoDescription] = [request.json["todoId"], request.json["todo"],
                                               request.json["todoDescription"]]
            dbResponse = cursor.execute(
                f"update todos set todo=\"{todo}\", todo_description = \"{todoDescription}\" where todoid = \"{todoid}\"")
            sqlobj.commit()
            if dbResponse == 1:
                return makeResponse({"message": "ToDo updated!"}, 200)
            else:
                return makeResponse({"message": "Internal Server Error!"}, 500)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"message": "unauthorized!"}, 401)


@app.route("/api/edit-todo", methods=["POST"])
def removeTodo():
    try:
        token = request.headers["Token"]
    except:
        return makeResponse({"message": "unauthorized"}, 401)
    if isValidToken(token):
        sqlobj = sql.connect()
        cursor = sqlobj.cursor()
        try:
            todoid = request.json["todoid"]
            dbResponse = cursor.execute(
                f"delete from todos where todoid = \"{todoid}\"")
            sqlobj.commit()
            if dbResponse == 1:
                return makeResponse({"message": "ToDo deleted!"}, 200)
            else:
                return makeResponse({"message": "Internal Server Error!"}, 500)
        except:
            return makeResponse({"message": "Internal Server Error!"}, 500)
        finally:
            cursor.close()
            sqlobj.close()
    else:
        return makeResponse({"message": "unauthorized!"}, 401)
