from l2tldr import app
from flask import request
from l2tldr.db import conn
from math import ceil
from flask_cors import cross_origin, CORS

@app.route('/bossspawn', methods=["GET"],)
@cross_origin()
def getbossspawn():
    # set limit
    limit = 100
    # store request parameters into variable
    # check if parameter exists if not assign None
    npc_id = None if "npcid" not in request.args else request.args.get("npcid")
    # same as above, but defaults "page" to 0
    page = int(request.args.get("page"))-1 if ("page" in request.args) else 0
    offset = page*limit

    query = "SELECT rsl.id,rsl.loc_x,rsl.loc_y,rsl.loc_z, rsl.respawn_mi,rsl.respawn_ma FROM raidspawn as rsl" 
    if npc_id != None:
        query += f" WHERE rsl.BOSS_ID = {npc_id}"
    if page!=None:
        query += f" LIMIT {limit} OFFSET {offset}"
    
    total_rows_query = "SELECT (rsl.id) FROM raidspawn as rsl" 
    if npc_id != None:
        total_rows_query += f" WHERE rsl.BOSS_ID = {npc_id}"

    with conn.cursor() as cur:
        cur.execute(query)
        data = cur.fetchall()
    with conn.cursor() as cur:
        cur.execute(total_rows_query)
        try:
            total_rows = cur.fetchone()[0]
        except:
            total_rows = 0


    last_page=ceil(total_rows/limit)
    if (page+1) != last_page:
        to = (offset+limit)
    elif total_rows<limit:
        to = total_rows
    else:
        to = (total_rows-last_page*limit)
    pagination_data = {"total":total_rows,"lastPage":last_page,"currentPage":page+1,"from":offset+1, "to":to}
    full_response= {"response":data,"pagination":pagination_data}
    response = full_response

    return response
