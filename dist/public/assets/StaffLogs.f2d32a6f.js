import{_ as a}from"./DataTable.6f1803aa.js";import{D as s}from"./index.4e7e3aaa.js";import{d as t,b as e,o,c as i,a as l}from"./vendor.28fcb284.js";var r=t({name:"StaffLogs",components:{DataTable:a},data:()=>({logs:[],page:1,fields:["text","type",{key:"createdAt",label:"Date",formatter:s.Locale}]}),async created(){const{data:a}=await this.$http.get("/api/staff/logs");this.logs=a},methods:{async showMore(){this.page++;const{data:a}=await this.$http.get("/api/staff/logs?page="+this.page);a.length?this.logs.push(...a):this.$store.dispatch("addToastMessage",{type:"info",message:"No more data"})}}});const d={class:"container"},c={class:"row mb-2"},n={class:"col-sm"},f={class:"row"},m={class:"col"};r.render=function(a,s,t,r,p,h){const g=e("data-table");return o(),i("div",d,[l("div",c,[l("div",n,[l(g,{items:a.logs,fields:a.fields},null,8,["items","fields"])])]),l("div",f,[l("div",m,[l("button",{class:"btn btn-primary w-100",onClick:s[1]||(s[1]=(...s)=>a.showMore&&a.showMore(...s))}," show more ")])])])};export default r;