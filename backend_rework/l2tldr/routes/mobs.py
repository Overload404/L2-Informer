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
    isundead = None if "isundead" not in request.args or request.args.get("isundead")=="" else request.args.get("isundead")
    notonmap = None if "notonmap" not in request.args or request.args.get("notonmap")=="" else request.args.get("notonmap")
    namesort = None if "namesort" not in request.args or request.args.get("namesort")=="" else request.args.get("namesort")
    levelsort = None if "levelsort" not in request.args or request.args.get("levelsort")=="" else request.args.get("levelsort")
    expsort = None if "expsort" not in request.args or request.args.get("expsort")=="" else request.args.get("expsort")


    # build query based on params
    query = "SELECT * FROM mobsnpcid" 
    if weakpoint!=None:
        query+= f" INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID"
    if mobtype!=None:
        query += f" WHERE TYPE IN ({mobtype})"
    if notonmap==None:
        query += f"AND (exists (select 1 from mobsspawnlist where mobsnpcid.npc_id = mobsspawnlist.npc_templa) or EXISTS (select 1 from raidspawn where mobsnpcid.npc_id = raidspawn.boss_id ))"
    if name!=None:
        query += f" AND LOWER(NPC_NAME) LIKE LOWER('%{name}%')"
    if weakpoint!=None:
        query += f" AND SKILL_ID = {weakpoint}"
    if level_min!=None:
        query += f" AND (npc_level >= {level_min})"
    if level_max!=None:
        query += f" AND (npc_level <= {level_max})"
    if isundead == "1":
        query += f" AND (isundead = 1)"


    if namesort != None or levelsort != None or expsort != None:
        query+= f" ORDER BY "

    if namesort == "1":
        query += f" npc_name ASC"
    if namesort == "2":
        query += f" npc_name DESC"
    
    if (namesort !=None and levelsort != None) or (namesort != None and expsort != None):
        query += ", "
    
    if levelsort == "1":
        query += f" npc_level ASC"
    if levelsort == "2":
        query += f" npc_level DESC"

    if (levelsort != None and expsort != None):
        query += ", "

    if expsort == "1":
        query += f" mobsnpcid.exp/mobsnpcid.hp ASC"
    if expsort == "2":
        query += f" mobsnpcid.exp/mobsnpcid.hp DESC"

    if page!=None:
        query += f" LIMIT {limit} OFFSET {offset}"
    
    total_rows_query = "SELECT COUNT('id') FROM mobsnpcid" 
    if weakpoint!=None:
        total_rows_query+= f" INNER JOIN npcskills ON mobsnpcid.NPC_ID = npcskills.NPC_ID"
    if mobtype!=None:
        total_rows_query += f" WHERE TYPE IN ({mobtype})"
    if notonmap==None:
        total_rows_query += f"AND (exists (select 1 from mobsspawnlist where mobsnpcid.npc_id = mobsspawnlist.npc_templa) or EXISTS (select 1 from raidspawn where mobsnpcid.npc_id = raidspawn.boss_id ))"
    if name!=None:
        total_rows_query += f" AND LOWER(NPC_NAME) LIKE LOWER('%{name}%')"
    if weakpoint!=None:
        total_rows_query += f" AND SKILL_ID = {weakpoint}"
    if level_min!=None:
        total_rows_query += f" AND npc_level >= {level_min}"
    if level_max!=None:
        total_rows_query += f" AND npc_level <= {level_max}"
    if isundead=="1":
        total_rows_query += f" AND (isundead = 1)"
    
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