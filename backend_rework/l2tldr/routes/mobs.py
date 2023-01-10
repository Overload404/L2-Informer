from l2tldr import app
from flask import request
from l2tldr.db import conn
from math import ceil
from flask_cors import cross_origin, CORS

@app.route('/mobs', methods=["GET"],)
@cross_origin()
def getmobs():
    # set limit
    limit = 30
    # store request parameters into variable
    # check if parameter exists if not assign None
    name = None if "name" not in request.args else request.args.get("name")
    mobtype = None if "type" not in request.args else request.args.get("type")
    if isinstance(mobtype, list):
        mobtype = '\'{list}\''.format(list ="','".join(mobtype))
    weakpoint = None if "weakpoint" not in request.args or request.args.get("weakpoint")=="" else request.args.get("weakpoint")
    # same as above, but defaults "page" to 0
    page = int(request.args.get("page"))-1 if ("page" in request.args) else 0
    offset = page*limit
    level_min = None if "levelmin" not in request.args or request.args.get("levelmin")=="" else request.args.get("levelmin")
    level_max = None if "levelmax" not in request.args or request.args.get("levelmax")=="" else request.args.get("levelmax")

    # build query based on params
    query = "SELECT * FROM mobsnpcid" 
    if weakpoint!=None:
        query+= f" INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID"
    if mobtype!=None:
        query += f" WHERE TYPE IN ({mobtype})"
    if name!=None:
        query += f" AND LOWER(NPC_NAME) LIKE LOWER('%{name}%')"
    if weakpoint!=None:
        query += f" AND SKILL_ID = {weakpoint}"
    if level_min!=None:
        query += f" AND (npc_level >= {level_min})"
    if level_max!=None:
        query += f" AND (npc_level <= {level_max})"
    
    if page!=None:
        query += f" LIMIT {limit} OFFSET {offset}"

    print(query)
    
    total_rows_query = "SELECT COUNT('id') FROM mobsnpcid INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID" 
    if mobtype!=None:
        total_rows_query += f" WHERE TYPE IN ({mobtype})"
    if name!=None:
        total_rows_query += f" AND LOWER(NPC_NAME) LIKE LOWER('%{name}%')"
    if weakpoint!=None:
        total_rows_query += f" AND SKILL_ID = {weakpoint}"
    if level_min!=None:
        total_rows_query += f" AND npc_level >= {level_min}"
    if level_max!=None:
        total_rows_query += f" AND npc_level <= {level_max}"
    
    # run query
    with conn.cursor() as cur:
        cur.execute(query)
        data = cur.fetchall()
    with conn.cursor() as cur:
        cur.execute(total_rows_query)
        total_rows = cur.fetchone()["count"]
    # convert result to json

    last_page=ceil(total_rows/limit)
    if (page+1) != last_page:
        to = (offset+limit)
    elif total_rows<limit:
        to = total_rows
    else:
        to = (total_rows-last_page*limit)
    pagination_data = {"total":total_rows,"lastPage":last_page,"currentPage":page+1,"from":offset+1, "to":to}
    full_response= {"response":data,"pagination":pagination_data}
    return full_response