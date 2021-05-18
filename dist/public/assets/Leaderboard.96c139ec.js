import{d as e,o as t,c as s,a as r,t as l,F as d,r as i,e as o,f as a,x as n,y as u,b as c,g as m,z as g}from"./vendor.6e598276.js";var y=e({name:"CountryFlag",props:{country:{type:Object,required:!0},title:{type:String,default:null}}});const h={class:"d-flex align-items-center"},p={class:"ms-2"},v={key:0},b={key:1};y.render=function(e,d,i,o,a,n){return t(),s("div",h,[r("div",{class:"country-flag",style:`background-image: url(https://osu.ppy.sh/images/flags/${e.country.code}.png)`},null,4),r("div",p,[e.title?(t(),s("span",v,l(e.title),1)):(t(),s("span",b,l(e.country.name),1))])])};var f=e({name:"JudgingDetail",props:{submission:{type:Object,default:()=>null}},data:()=>({commentsExpanded:[]}),methods:{showComment(e){const t=this.commentsExpanded.findIndex((t=>t===e));-1!==t?this.commentsExpanded.splice(t,1):this.commentsExpanded.push(e)},getCollapseClass(e){return this.commentsExpanded.includes(e)?"fa-chevron-down":"fa-chevron-right"}}});const C={id:"detailModal",class:"modal fade",tabindex:"-1"},k={class:"modal-dialog modal-lg"},S={key:0,class:"modal-content"},j={class:"modal-header"},D={class:"modal-title"},w=r("button",{type:"button",class:"btn-close","data-bs-dismiss":"modal"}," × ",-1),x={class:"modal-body"},B=o(": "),F={style:{"white-space":"pre-line"}},J={key:0};f.render=function(e,n,u,c,m,g){return t(),s("div",C,[r("div",k,[e.submission?(t(),s("div",S,[r("div",j,[r("h5",D,l(e.submission.team.name)+" - "+l(e.submission.team.country.name),1),w]),r("div",x,[(t(!0),s(d,null,i(e.submission.judging,((n,u)=>(t(),s("div",{key:n.id},[r("b",null,l(n.judge.username),1),(t(!0),s(d,null,i(n.judgingToCriterias,(d=>(t(),s("div",{key:d.id,class:"my-1"},[r("a",{"data-bs-toggle":"collapse",href:`#judgingToCriteria${d.id}`,onClick:t=>e.showComment(d.id)},[r("small",null,[r("i",{class:["fas me-2",e.getCollapseClass(d.id)]},null,2)]),o(" "+l(d.criteria.name)+" ",1),r("b",null,"("+l(d.score)+")",1),B],8,["href","onClick"]),r("p",{id:`judgingToCriteria${d.id}`,class:"text-light ms-3 collapse"},[r("span",F,l(d.comment),1)],8,["id"])])))),128)),u<e.submission.judging.length-1?(t(),s("hr",J)):a("",!0)])))),128))])])):a("",!0)])])};var M=e({name:"Leaderboard",components:{CountryFlag:y,JudgingDetail:f},data:()=>({selectedScore:null,displayMode:"criterias",sortDesc:!1,round:null,criterias:[],teamsScores:[],judgesCorrel:[]}),computed:{scoreDetail(){var e,t;if(this.selectedScore)return null==(t=null==(e=this.round)?void 0:e.submissions)?void 0:t.find((e=>{var t;return e.team.id==(null==(t=this.selectedScore)?void 0:t.team.id)}))},judges(){var e;return(null==(e=this.round)?void 0:e.judgeToRounds.map((e=>e.user)))||[]}},async created(){const{data:e}=await this.$http.get(`/api/rounds/${this.$route.params.id}/results`);this.round=e.round,this.criterias=e.criterias,this.teamsScores=e.teamsScores,this.judgesCorrel=e.judgesCorrel},methods:{getCriteriaScore(e,t){var s;return(null==(s=e.criteriaSum.find((e=>e.criteriaId===t)))?void 0:s.sum)||0},getJudgeScore(e,t,s=!1){const r=e.judgingSum.find((e=>e.judgeId===t)),l=(null==r?void 0:r.standardized)||0;return s?`${(null==r?void 0:r.sum)||0} (${l.toFixed(3)})`:(null==r?void 0:r.sum)||0},getJudgeAvg(e){var t;return(null==(t=this.judgesCorrel.find((t=>t.id===e)))?void 0:t.rawAvg.toFixed(4))||0},getJudgeSd(e){var t;return(null==(t=this.judgesCorrel.find((t=>t.id===e)))?void 0:t.sd.toFixed(4))||0},getJudgeCorrel(e){var t;return((null==(t=this.judgesCorrel.find((t=>t.id===e)))?void 0:t.correl)||0).toFixed(4)},getFinalScore:e=>!e||isNaN(e)?"0":e.toFixed(4),sortByCriteria(e){this.sortDesc=!this.sortDesc,this.$store.commit("sortByCriteria",{criteriaId:e,sortDesc:this.sortDesc})},sortByJudge(e){this.sortDesc=!this.sortDesc,this.$store.commit("sortByJudge",{judgeId:e,sortDesc:this.sortDesc})},sortByRawScore(){this.sortDesc=!this.sortDesc,this.$store.commit("sortByRawScore",{sortDesc:this.sortDesc})},sortByStdScore(){this.sortDesc=!this.sortDesc,this.$store.commit("sortByStdScore",{sortDesc:this.sortDesc})}}});const $=g();n("data-v-25a59fbe");const I={class:"container"},R={class:"row my-3"},A={class:"col-sm"},E=o(" | "),T=o(" | "),z=o(" | "),_={class:"row"},L={class:"col-sm"},O={class:"table table-hover"},N=r("th",null,"#",-1),P=r("th",null,"Team",-1),q=r("th",null,null,-1),G={class:"cursor-default"},V=r("td",null,null,-1),H=r("td",null,"AVG",-1),K=r("td",null,null,-1),Q=r("td",null,null,-1),U={class:"cursor-default"},W=r("td",null,null,-1),X=r("td",null,"SD",-1),Y=r("td",null,null,-1),Z=r("td",null,null,-1),ee={class:"cursor-default"},te=r("td",null,null,-1),se=r("td",null,"COR",-1),re=r("td",null,null,-1),le=r("td",null,null,-1);u();const de=$(((e,o,n,u,g,y)=>{const h=c("country-flag"),p=c("judging-detail");return t(),s("div",I,[r("div",R,[r("div",A,[r("a",{href:"#",class:"criterias"===e.displayMode?"border-bottom border-secondary":"",onClick:o[1]||(o[1]=m((t=>e.displayMode="criterias"),["prevent"]))}," Per criteria ",2),E,r("a",{href:"#",class:"judges"===e.displayMode?"border-bottom border-secondary":"",onClick:o[2]||(o[2]=m((t=>e.displayMode="judges"),["prevent"]))}," Per judge ",2),T,r("a",{href:"#",class:"detail"===e.displayMode?"border-bottom border-secondary":"",onClick:o[3]||(o[3]=m((t=>e.displayMode="detail"),["prevent"]))}," Std detail ",2),e.round&&new Date>=new Date(e.round.resultsAt)&&e.round.downloadLink?(t(),s(d,{key:0},[z,r("a",{href:e.round.downloadLink,target:"_blank"}," Download all entries ",8,["href"])],64)):a("",!0)])]),r("div",_,[r("div",L,[r("table",O,[r("thead",null,[r("tr",null,[N,P,"criterias"===e.displayMode?(t(!0),s(d,{key:0},i(e.criterias,(d=>(t(),s("th",{key:d.id},[r("a",{href:"#",onClick:m((t=>e.sortByCriteria(d.id)),["prevent"])},l(d.name),9,["onClick"])])))),128)):(t(!0),s(d,{key:1},i(e.judges,(d=>(t(),s("th",{key:d.id},[r("a",{href:"#",onClick:m((t=>e.sortByJudge(d.id)),["prevent"])},l(d.username),9,["onClick"])])))),128)),r("th",null,[r("a",{href:"#",onClick:o[4]||(o[4]=m(((...t)=>e.sortByRawScore&&e.sortByRawScore(...t)),["prevent"]))}," Final Score (raw) ")]),r("th",null,[r("a",{href:"#",onClick:o[5]||(o[5]=m(((...t)=>e.sortByStdScore&&e.sortByStdScore(...t)),["prevent"]))}," Final Score (standardized) ")]),q])]),r("tbody",null,[(t(!0),s(d,null,i(e.teamsScores,((o,a)=>(t(),s("tr",{key:a},[r("td",null,l(a+1),1),r("td",null,[r(h,{country:o.team.country,title:o.team.name},null,8,["country","title"])]),"criterias"===e.displayMode?(t(!0),s(d,{key:0},i(e.criterias,(r=>(t(),s("td",{key:r.id},l(e.getCriteriaScore(o,r.id)),1)))),128)):(t(!0),s(d,{key:1},i(e.judges,(r=>(t(),s("td",{key:r.id},l(e.getJudgeScore(o,r.id,"detail"===e.displayMode)),1)))),128)),r("td",null,l(o.rawFinalScore),1),r("td",null,l(e.getFinalScore(o.standardizedFinalScore)),1),r("td",null,[r("a",{href:"#","data-bs-toggle":"modal","data-bs-target":"#detailModal",onClick:m((t=>e.selectedScore=o),["prevent"])}," Detail ",8,["onClick"])])])))),128)),"detail"===e.displayMode?(t(),s(d,{key:0},[r("tr",G,[V,H,(t(!0),s(d,null,i(e.judges,(r=>(t(),s("td",{key:r.id},l(e.getJudgeAvg(r.id)),1)))),128)),K,Q]),r("tr",U,[W,X,(t(!0),s(d,null,i(e.judges,(r=>(t(),s("td",{key:r.id},l(e.getJudgeSd(r.id)),1)))),128)),Y,Z]),r("tr",ee,[te,se,(t(!0),s(d,null,i(e.judges,(r=>(t(),s("td",{key:r.id},l(e.getJudgeCorrel(r.id)),1)))),128)),re,le])],64)):a("",!0)])])])]),r(p,{submission:e.scoreDetail},null,8,["submission"])])}));M.render=de,M.__scopeId="data-v-25a59fbe";export{M as _};