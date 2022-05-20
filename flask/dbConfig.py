from flaskext.mysql import MySQL
from app import app
sql = MySQL()
app.config["MYSQL_DATABASE_HOST"] = "localhost"
app.config["MYSQL_DATABASE_USER"] = "root"
app.config["MYSQL_DATABASE_PASSWORD"] = "fuzzy"
app.config["MYSQL_DATABASE_DB"] = "tasks"
sql.init_app(app)
