import{_ as s}from"./DataTable.6f1803aa.js";import{d as a,o as t,c as i,a as o,l as n,E as e,f as d,b as m,w as l}from"./vendor.28fcb284.js";import{D as b}from"./index.4e7e3aaa.js";var u=a({name:"StaffSubmissionUpdate",props:{submissionProp:{type:Object,default:()=>null}},emits:["update:submission"],data:()=>({anonymisedAs:"",isSaving:!1}),watch:{submissionProp(s){this.anonymisedAs=(null==s?void 0:s.anonymisedAs)||""}},methods:{async update(){const{data:s}=await this.$http.put(`/api/staff/submissions/${this.submissionProp.id}`,{anonymisedAs:this.anonymisedAs});this.$emit("update:submission",s)}}});const r={class:"modal fade",tabindex:"-1"},c={class:"modal-dialog modal-xl"},p={class:"modal-content"},f=o("div",{class:"modal-header"},[o("h5",{class:"modal-title"}," Update submission "),o("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal","aria-label":"Close"})],-1),y={key:0,class:"modal-body"},h={class:"container"},v={class:"row"},S={class:"col-sm"},A={class:"modal-footer"},k=o("button",{type:"button",class:"btn btn-secondary","data-bs-dismiss":"modal"}," Close ",-1);u.render=function(s,a,m,l,b,u){return t(),i("div",r,[o("div",c,[o("div",p,[f,s.submissionProp?(t(),i("div",y,[o("div",h,[o("div",v,[o("div",S,[n(o("input",{"onUpdate:modelValue":a[1]||(a[1]=a=>s.anonymisedAs=a),type:"text",class:"form-control",placeholder:"Anonymised as..."},null,512),[[e,s.anonymisedAs]])])])])])):d("",!0),o("div",A,[k,o("button",{type:"button",class:"btn btn-primary",onClick:a[2]||(a[2]=(...a)=>s.update&&s.update(...a))}," Save changes ")])])])])};var g=a({name:"StaffSubmissions",components:{DataTable:s,StaffSubmissionUpdate:u},data:()=>({fields:[{key:"team",label:"Country",formatter:s=>s.country.name},{key:"team",label:"Team",formatter:s=>s.name},{key:"updatedAt",label:"Submission Last Update",formatter:b.Locale},{key:"information",label:"Information"},{key:"anonymisedAs",label:"Anonymised As"}],selectedSubmission:null,submissions:[]}),async created(){const{data:s}=await this.$http.get(`/api/staff/rounds/${this.$route.params.id}/submissions`);this.submissions=s},methods:{update(s){const a=this.submissions.findIndex((a=>a.id===s.id));-1!==a&&(this.submissions[a]=s)}}});const w={class:"container"},U={class:"card"},$=o("div",{class:"card-title"}," Submissions ",-1),x=o("div",{class:"card-subtitle"}," Listing of submissions by round, you NEED to set an anonymised name, otherwise it'll not show up for the judges ",-1),C={class:"card-body"},j={key:1};g.render=function(s,a,n,e,d,b){const u=m("data-table"),r=m("staff-submission-update");return t(),i("div",w,[o("div",U,[$,x,o("div",C,[s.submissions.length?(t(),i(u,{key:0,fields:s.fields,items:s.submissions},{actions:l((({item:a})=>[o("button",{class:"btn btn-sm btn-primary me-2 mb-2","data-bs-toggle":"modal","data-bs-target":"#submissionUpdate",onClick:t=>s.selectedSubmission=a}," Edit ",8,["onClick"]),o("a",{class:"btn btn-sm btn-primary me-2 mb-2",href:`/api/staff/submissions/${a.id}/download`}," Download ",8,["href"])])),_:1},8,["fields","items"])):(t(),i("span",j," No submissions "))])]),o(r,{id:"submissionUpdate","submission-prop":s.selectedSubmission,"onUpdate:submission":a[1]||(a[1]=a=>s.update(a))},null,8,["submission-prop"])])};export default g;