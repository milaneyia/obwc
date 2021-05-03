var t=Object.defineProperty,e=Object.prototype.hasOwnProperty,a=Object.getOwnPropertySymbols,s=Object.prototype.propertyIsEnumerable,n=(e,a,s)=>a in e?t(e,a,{enumerable:!0,configurable:!0,writable:!0,value:s}):e[a]=s,m=(t,m)=>{for(var i in m||(m={}))e.call(m,i)&&n(t,i,m[i]);if(a)for(var i of a(m))s.call(m,i)&&n(t,i,m[i]);return t};import{_ as i}from"./DataTable.3bd407d9.js";import{d as o,o as r,c as d,a as l,n as c,A as p,F as u,e as b,t as f,h,f as v,b as y}from"./vendor.9fbad299.js";var w=o({name:"StaffTeamUpdate",props:{teamProp:{type:Object,default:()=>null}},emits:["update:team","remove:team"],data:()=>({name:"",users:[]}),watch:{teamProp(t){this.name=(null==t?void 0:t.name)||"",this.users=(null==t?void 0:t.users)||[]}},methods:{async update(){const{data:t}=await this.$http.put(`/api/staff/teams/${this.teamProp.id}`,{name:this.name});this.$emit("update:team",t),this.name=t.name},async removeUser(t){if(!confirm("Remove user from the team?"))return;const{data:e}=await this.$http.put(`/api/staff/teams/${this.teamProp.id}/removeUser`,{userId:t});this.$emit("update:team",e),this.users=e.users},async removeTeam(){confirm("This will delete all team related data (name, users, invitations), are you sure?")&&(await this.$http.delete(`/api/staff/teams/${this.teamProp.id}`),this.$emit("remove:team",this.teamProp.id))}}});const C={class:"modal fade",tabindex:"-1"},k={class:"modal-dialog modal-xl"},$={class:"modal-content"},T=l("div",{class:"modal-header"},[l("h5",{class:"modal-title"}," Update team "),l("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),g={key:0,class:"modal-body"},U={class:"container"},P={class:"row mb-2"},j={class:"col-sm"},x=l("hr",null,null,-1),O={class:"row"},I=l("hr",null,null,-1),N={class:"row"},D={class:"col-sm"},S={class:"modal-footer"},R=l("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ",-1);w.render=function(t,e,a,s,n,m){return r(),d("div",C,[l("div",k,[l("div",$,[T,t.teamProp?(r(),d("div",g,[l("div",U,[l("div",P,[l("div",j,[c(l("input",{"onUpdate:modelValue":e[1]||(e[1]=e=>t.name=e),type:"text",class:"form-control",placeholder:"Name..."},null,512),[[p,t.name]]),l("button",{class:"btn btn-sm btn-primary mt-2",onClick:e[2]||(e[2]=(...e)=>t.update&&t.update(...e))}," Update name ")])]),x,l("div",O,[(r(!0),d(u,null,b(t.users,(e=>(r(),d("button",{key:e.id,class:"btn btn-sm btn-danger mr-2 mb-2",onClick:a=>t.removeUser(e.id)}," Remove "+f(e.username),9,["onClick"])))),128))]),I,l("div",N,[l("div",D,[l("button",{class:"btn btn-sm btn-danger",onClick:e[3]||(e[3]=(...e)=>t.removeTeam&&t.removeTeam(...e))}," Delete everything ")])])])])):h("",!0),l("div",S,[R,l("button",{type:"button",class:"btn btn-primary",onClick:e[4]||(e[4]=(...e)=>t.update&&t.update(...e))}," Save changes ")])])])])};var E=o({components:{DataTable:i,StaffTeamUpdate:w},data:()=>({teams:[],selectedTeam:null}),computed:{formattedTeams(){return this.teams.map((t=>m(m({},t),{name:t.name,country:t.country.name,captain:t.captain.username,usersNames:t.users.map((t=>t.username)).join(", "),invitationsNames:t.invitations.map((t=>t.username)).join(", ")})))}},async created(){const{data:t}=await this.$http.get("/api/staff/teams");this.teams=t},methods:{async confirm(t){await this.$http.put(`/api/staff/teams/${t}/confirm`);const e=this.teams.findIndex((e=>e.id===t));-1!==e&&(this.teams[e].wasConfirmed=!0)},async deny(t){await this.$http.put(`/api/staff/teams/${t}/deny`);const e=this.teams.findIndex((e=>e.id===t));-1!==e&&(this.teams[e].wasConfirmed=!1)},update(t){const e=this.teams.findIndex((e=>e.id===t.id));-1!==e&&(this.teams[e]=t)},remove(t){const e=this.teams.findIndex((e=>e.id===t));-1!==e&&this.teams.splice(e,1)}}});const _={class:"container"},A={class:"row"},F={class:"col-sm"};E.render=function(t,e,a,s,n,m){const i=v("data-table"),o=v("staff-team-update");return r(),d("div",_,[l("div",A,[l("div",F,[l(i,{items:t.formattedTeams,fields:["name","country","captain","usersNames","invitationsNames"]},{actions:y((({item:e})=>[l("button",{class:"btn btn-sm btn-primary me-2","data-bs-toggle":"modal","data-bs-target":"#teamUpdate",onClick:a=>t.selectedTeam=e}," Edit ",8,["onClick"]),e.wasConfirmed?(r(),d("button",{key:1,class:"btn btn-sm btn-danger",onClick:a=>t.deny(e.id)}," Deny ",8,["onClick"])):(r(),d("button",{key:0,class:"btn btn-sm btn-success",onClick:a=>t.confirm(e.id)}," Confirm ",8,["onClick"]))])),_:1},8,["items"])])]),l(o,{id:"teamUpdate","team-prop":t.selectedTeam,"onUpdate:team":e[1]||(e[1]=e=>t.update(e)),"onRemove:team":e[2]||(e[2]=e=>t.remove(e))},null,8,["team-prop"])])};export default E;