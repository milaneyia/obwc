var s=Object.defineProperty,t=Object.defineProperties,e=Object.getOwnPropertyDescriptors,a=Object.getOwnPropertySymbols,i=Object.prototype.hasOwnProperty,n=Object.prototype.propertyIsEnumerable,o=(t,e,a)=>e in t?s(t,e,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[e]=a;import{d as r,m as l,b as d,o as u,c,a as m,f as p,F as h,r as b,e as f,t as v,n as g,D as y}from"./vendor.437caaf2.js";import{_ as w}from"./DataTable.e3358bee.js";import{b as S,D as k,a as D}from"./index.8651ecd1.js";var F,O,R=r({components:{DataTable:w,TimeString:S},data:()=>({submissions:[],eliminationDetails:{mappingEliminated:!0,playerEliminated:!0},oszFile:null,information:"",isSaving:!1,fields:[{key:"round",label:"Round",formatter:s=>s.id},{key:"updatedAt",label:"Update Date",formatter:k.Locale}]}),computed:(F=((s,t)=>{for(var e in t||(t={}))i.call(t,e)&&o(s,e,t[e]);if(a)for(var e of a(t))n.call(t,e)&&o(s,e,t[e]);return s})({},l({user:s=>s.loggedInUser,rounds:s=>s.rounds})),O={currentContest(){return this.$store.getters.currentContest},currentRound(){return this.$store.getters.currentSubmissionRound},currentSubmission(){return this.submissions.find((s=>{var t;return s.round.id===(null==(t=this.currentRound)?void 0:t.id)}))}},t(F,e(O))),async created(){var s;await this.getData(),this.information=(null==(s=this.currentSubmission)?void 0:s.information)||""},methods:{async getData(){const[{data:s},{data:t}]=await Promise.all([this.$http.get("/api/submissions"),this.$http.get("/api/submissions/check")]);this.submissions=s,this.eliminationDetails=t,this.rounds.length||await this.$store.dispatch(D,this.currentContest.id)},async save(s){if(!this.oszFile)return void this.$store.dispatch("addToastMessage","Select an .osz");if(!this.information)return void this.$store.dispatch("addToastMessage","Add details about your entry");this.$store.dispatch("addToastMessage",{type:"info",message:"This may take a couple of minutes"}),(null==s?void 0:s.target).disabled=!0,this.isSaving=!0;const t=new FormData;t.append("oszFile",this.oszFile),t.append("information",this.information),await this.$http.post("/api/submissions",t,{headers:{"Content-Type":"multipart/form-data"}}).finally((()=>{this.isSaving=!1,(null==s?void 0:s.target).disabled=!1})),await this.getData()},uploadFile(s){var t,e;this.oszFile=null==(e=null==(t=s.target)?void 0:t.files)?void 0:e[0]}}});const j={class:"container-fluid"},z={class:"card card-section"},$=m("div",{class:"card-header"},[m("div",{class:"card-header-back"}," Submissions "),m("div",{class:"card-header-sub"},[m("div",{class:"card-header-title"}," SUBMISSIONS ")])],-1),T={class:"card-body"},x={class:"container"},C={class:"row"},E={class:"col-sm"},P=m("hr",null,null,-1),A={class:"row mb-3"},M={class:"col-sm"},I={class:"text-center"},U=f(" You have from "),L=f(" to "),_=f(" to submit your entry "),B=m("hr",null,null,-1),N={key:0,class:"text-center"},V=m("i",{class:"fas fa-file-download"},null,-1),Y=m("hr",null,null,-1),q=m("label",{for:"oszFile",class:"form-label"},".osz File (30Mb max)",-1),G={class:"row"},H={class:"col-sm"},J={key:0,class:"spinner-border spinner-border-sm align-middle",role:"status"},K=m("span",{class:"sr-only"},"Loading...",-1),Q={key:1},W=m("i",{class:"fas fa-save"},null,-1),X=f(" Save ");R.render=function(s,t,e,a,i,n){const o=d("data-table"),r=d("time-string");return u(),c("div",j,[m("div",z,[$,m("div",T,[m("div",x,[m("div",C,[m("div",E,[s.submissions?(u(),c(o,{key:0,fields:s.fields,items:s.submissions},null,8,["fields","items"])):p("",!0)])]),!s.currentRound||s.eliminationDetails.mappingEliminated&&s.eliminationDetails.playerEliminated?p("",!0):(u(),c(h,{key:0},[P,m("div",A,[m("div",M,[m("p",I,[U,m("b",null,[m(r,{timestamp:s.currentRound.submissionsStartedAt},null,8,["timestamp"])]),L,m("b",null,[m(r,{timestamp:s.currentRound.submissionsEndedAt},null,8,["timestamp"])]),_]),B,s.currentRound.songs&&s.currentRound.songs.length?(u(),c("div",N,[(u(!0),c(h,null,b(s.currentRound.songs,(s=>(u(),c("p",{key:s},[m("a",{href:s.link,target:"_blank"},[f(v(s.title)+" ",1),V],8,["href"])])))),128))])):p("",!0),Y,g(m("textarea",{"onUpdate:modelValue":t[1]||(t[1]=t=>s.information=t),class:"form-control mb-2",rows:"5",placeholder:"Add details on how people participated on this entry"},null,512),[[y,s.information]]),m("div",null,[q,m("input",{id:"oszFile",class:"form-control",type:"file",onChange:t[2]||(t[2]=t=>s.uploadFile(t))},null,32)])])]),m("div",G,[m("div",H,[m("button",{class:"btn btn-yellow w-100",onClick:t[3]||(t[3]=t=>s.save(t))},[s.isSaving?(u(),c("div",J,[K])):(u(),c("span",Q,[W,X]))])])])],64))])])])])};export default R;