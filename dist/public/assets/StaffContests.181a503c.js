import{_ as t}from"./DataTable.ab8426c4.js";import{d as e,o as a,c as s,a as n,l as o,A as l,f as d,b as i,w as c,e as r}from"./vendor.6e598276.js";import{D as m}from"./index.793ba953.js";var u=e({name:"StaffContestUpdate",props:{contestProp:{type:Object,default:()=>null}},emits:["update:contest"],data:()=>({contest:null}),watch:{contestProp(t){this.contest=t?{name:t.name,announcementAt:this.$formatDate(t.announcementAt),registrationStartedAt:this.$formatDate(t.registrationStartedAt),registrationEndedAt:this.$formatDate(t.registrationEndedAt)}:null}},methods:{async update(){if(!this.contest)return;const{data:t}=await this.$http.put(`/api/staff/contests/${this.contestProp.id}`,{name:this.contest.name,announcementAt:this.contest.announcementAt,registrationStartedAt:this.contest.registrationStartedAt,registrationEndedAt:this.contest.registrationEndedAt});this.$emit("update:contest",t)}}});const p={class:"modal fade",tabindex:"-1"},f={class:"modal-dialog modal-lg"},b={class:"modal-content"},g=n("div",{class:"modal-header"},[n("h5",{class:"modal-title"}," Update Contest "),n("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),h={key:0,class:"modal-body"},A=n("hr",null,null,-1),v={class:"row mb-2"},y={class:"col-sm-12"},S={class:"form-group"},C=n("label",null,"Announcement Date",-1),k={class:"col-sm-6"},D={class:"form-group"},U=n("label",null,"Registration Start Date",-1),E={class:"col-sm-6"},$={class:"form-group"},w=n("label",null,"Registration End Date",-1),x={class:"modal-footer"},R=n("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ",-1);u.render=function(t,e,i,c,r,m){return a(),s("div",p,[n("div",f,[n("div",b,[g,t.contest?(a(),s("div",h,[o(n("input",{"onUpdate:modelValue":e[1]||(e[1]=e=>t.contest.name=e),type:"text",class:"form-control mb-3",placeholder:"name"},null,512),[[l,t.contest.name]]),A,n("div",v,[n("div",y,[n("div",S,[C,o(n("input",{"onUpdate:modelValue":e[2]||(e[2]=e=>t.contest.announcementAt=e),type:"datetime-local",class:"form-control"},null,512),[[l,t.contest.announcementAt]])])]),n("div",k,[n("div",D,[U,o(n("input",{"onUpdate:modelValue":e[3]||(e[3]=e=>t.contest.registrationStartedAt=e),type:"datetime-local",class:"form-control"},null,512),[[l,t.contest.registrationStartedAt]])])]),n("div",E,[n("div",$,[w,o(n("input",{"onUpdate:modelValue":e[4]||(e[4]=e=>t.contest.registrationEndedAt=e),type:"datetime-local",class:"form-control"},null,512),[[l,t.contest.registrationEndedAt]])])])])])):d("",!0),n("div",x,[R,n("button",{type:"button",class:"btn btn-primary",onClick:e[5]||(e[5]=(...e)=>t.update&&t.update(...e))}," Save changes ")])])])])};var j=e({name:"StaffContests",components:{DataTable:t,StaffContestUpdate:u},data:()=>({contests:[],selectedContest:null,fields:["id","name",{key:"announcementAt",label:"Announcement Date",formatter:m.Locale},{key:"registrationStartedAt",label:"Registration Start",formatter:m.Locale},{key:"registrationEndedAt",label:"Registration Start",formatter:m.Locale}]}),async created(){const{data:t}=await this.$http.get("/api/contests");this.contests=t},methods:{update(t){const e=this.contests.findIndex((e=>e.id===t.id));-1!==e&&(this.contests[e]=t)}}});const V={class:"container"},_={class:"row"},L={class:"col-sm"},P=r(" Rounds "),T=r(" Teams ");j.render=function(t,e,o,l,d,r){const m=i("router-link"),u=i("data-table"),p=i("staff-contest-update");return a(),s("div",V,[n("div",_,[n("div",L,[n(u,{items:t.contests,fields:t.fields},{actions:c((({item:e})=>[n("button",{class:"btn btn-sm btn-primary me-2","data-bs-toggle":"modal","data-bs-target":"#contestUpdate",onClick:a=>t.selectedContest=e}," Edit ",8,["onClick"]),n(m,{class:"btn btn-sm btn-link me-2",to:{name:"staff-rounds",params:{id:e.id}}},{default:c((()=>[P])),_:2},1032,["to"]),n(m,{class:"btn btn-sm btn-link",to:{name:"staff-teams",params:{id:e.id}}},{default:c((()=>[T])),_:2},1032,["to"])])),_:1},8,["items","fields"])])]),n(p,{id:"contestUpdate","contest-prop":t.selectedContest,"onUpdate:contest":e[1]||(e[1]=e=>t.update(e))},null,8,["contest-prop"])])};export default j;
