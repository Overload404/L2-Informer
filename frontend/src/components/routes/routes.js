const routes = {
  backendServer: "http://127.0.0.1:5000/",
  mobs: "mobs?",
  mobDrop: "mobdrop?",
  mobSkills: "mobskills?",
  mobSpawn: "mobspawn?",
  bossSpawn: "bossspawn?",
  items: "items?",
  name: "&name=",
  page: "page=",
  weakpoint: "&weakpoint=",
  type: "&type=",
  npcid: "&npcid=",
  levelmin: "&levelmin=",
  levelmax: "&levelmax=",
};

const linkBuilder = ({
  page,
  npcid,
  weakpoint,
  type,
  name,
  ep,
  levelmin,
  levelmax,
} = {}) => {
  let pageRequest = !page || page === "" ? "" : `${routes.page}${page}`;
  let typeRequest = !type || type === "" ? "" : `${routes.type}${type}`;
  let weakpointRequest =
    !weakpoint || weakpoint === "" ? "" : `${routes.weakpoint}${weakpoint}`;
  let nameRequest = !name || name === "" ? "" : `${routes.name}${name}`;
  let npcidRequest = !npcid || npcid === "" ? "" : `${routes.npcid}${npcid}`;
  let levelminRequest =
    !levelmin || levelmin === "" ? "" : `${routes.levelmin}${levelmin}`;
  let levelmaxRequest =
    !levelmax || levelmax === "" ? "" : `${routes.levelmax}${levelmax}`;
  let epRequest =
    ep === "mobs"
      ? routes.mobs
      : ep === "mobdrop"
      ? routes.mobDrop
      : ep === "items"
      ? routes.items
      : ep === "mobSpawn"
      ? routes.mobSpawn
      : ep === "bossSpawn"
      ? routes.bossSpawn
      : ep === "mobskills"
      ? routes.mobSkills
      : "";

  let URL = `${routes.backendServer}${epRequest}${pageRequest}${weakpointRequest}${npcidRequest}${nameRequest}${typeRequest}${levelminRequest}${levelmaxRequest}`;
  return URL;
};

export default linkBuilder;
