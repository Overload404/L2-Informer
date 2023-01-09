from flask import Flask
from flask_cors import CORS,cross_origin
from l2tldr.db import conn
app = Flask(__name__)
cors= CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

while conn.closed != 0:
    with conn.cursor() as cur:
        cur.execute('select 1')

import l2tldr.routes.mobs
import l2tldr.routes.mobdrop
import l2tldr.routes.mobskills
import l2tldr.routes.mobspawn
import l2tldr.routes.bossspawn

# @app.route('/mobs', methods=["GET"])
# def getmobs():
#     # set limit
#     limit = 30
#     # store request parameters into variable
#     params = request.json
#     # check if parameter exists if not assign None
#     name = None if "name" not in params else params["name"]
#     mobtype = None if "type" not in params else params["type"]
#     if isinstance(mobtype, list):
#         mobtype = '\'{list}\''.format(list ="','".join(mobtype))
#     weakpoint = None if "weakpoint" not in params else params["weakpoint"]
#     # same as above, but defaults "page" to 0
#     page = 0 if "page" not in params else params["page"]-1

#     # build query based on params
#     query = "SELECT * FROM mobsnpcid INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID" 
#     if mobtype!=None:
#         query += f" WHERE TYPE IN ({mobtype})"
#     if name!=None:
#         query += f" AND NPC_NAME LIKE '%{name}%'"
#     if weakpoint!=None:
#         query += f" AND SKILL_ID = {weakpoint}"
#     if page!=None:
#         query += f" LIMIT {limit} OFFSET {page*limit}"
    
#     # run query
#     with conn.cursor() as cur:
#         cur.execute(query)
#         column_names = [desc[0] for desc in cur.description]
#         data = cur.fetchall()
#     # convert result to json
#     new_data=[]
#     for row in data:
#         new_row = {}
#         for item in row:
#              new_row[column_names[row.index(item)]] = item
#         new_data.append(new_row)
#     return new_data