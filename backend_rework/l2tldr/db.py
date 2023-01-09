import psycopg2
from psycopg2.extras import RealDictConnection

host = "dpg-cerg78pa6gdl0p0m8cn0-a.frankfurt-postgres.render.com"

base = "l2k"

password = "NzgDblg52fBHREw2GxY4Zg8bU"

user = "l2tldr"

conn = psycopg2.connect(host=host, dbname=base, user=user, password=password, connection_factory=RealDictConnection)