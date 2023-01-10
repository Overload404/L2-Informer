import psycopg2
from psycopg2.extras import RealDictConnection
# connection config
keepalives = 1
connect_timeout = 3
keepalives_interval = 10
keepalives_idle = 30
keepalives_count = 5
host = "dpg-cerg78pa6gdl0p0m8cn0-a.frankfurt-postgres.render.com"
base = "l2k"
password = "NzgDblg52fBHREw2GxY4Zg8bU"
user = "l2tldr"

# connection defined
conn = psycopg2.connect(
    host=host, 
    dbname=base, 
    user=user, 
    password=password, 
    connection_factory=RealDictConnection, 
    keepalives = keepalives, 
    keepalives_count = keepalives_count, 
    keepalives_idle = keepalives_idle, 
    keepalives_interval = keepalives_interval, 
    connect_timeout = connect_timeout
    )