import{_ as e}from"./DataTable.0edba146.js";import{_ as s}from"./Leaderboard.7ff820c1.js";import{d as a,b as t,o as d,c as r,a as n}from"./vendor.8d251a54.js";var o=a({name:"StaffJudging",components:{DataTable:e,Leaderboard:s},data(){return{resultsData:null,fields:[{key:"team",label:"Team",formatter:e=>e.name},{key:"judging",label:"Count",formatter:this.getJudgesInvolvedCount},{key:"judging",label:"Judges",formatter:this.getJudgesInvolved}]}},async created(){const{data:e}=await this.$http.get(`/api/rounds/${this.$route.params.id}/results`);this.resultsData=e},methods:{getJudgesInvolvedCount(e){var s;return e.map((e=>e.judge)).length+" done of "+(null==(s=this.resultsData)?void 0:s.judges.length)},getJudgesInvolved:e=>e.map((e=>e.judge.username)).join(", ")}});const i={class:"container"},l=n("div",{class:"card"},[n("div",{class:"card-title"}," Judging List "),n("div",{class:"card-subtitle"}," Listing of all the judging (scores/comments) done by entries ")],-1),u={class:"card my-2"},g={key:1,class:"card-body"};o.render=function(e,s,a,o,m,c){var v;const f=t("leaderboard"),b=t("data-table");return d(),r("div",i,[l,n(f),n("div",u,[(null==(v=e.resultsData)?void 0:v.round.submissions.length)?(d(),r(b,{key:0,fields:e.fields,items:e.resultsData.round.submissions},null,8,["fields","items"])):(d(),r("div",g," No submissions "))])])};export default o;