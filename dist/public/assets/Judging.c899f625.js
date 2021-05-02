var e=Object.defineProperty,i=Object.prototype.hasOwnProperty,t=Object.getOwnPropertySymbols,n=Object.prototype.propertyIsEnumerable,s=(i,t,n)=>t in i?e(i,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):i[t]=n,r=(e,r)=>{for(var o in r||(r={}))i.call(r,o)&&s(e,o,r[o]);if(t)for(var o of t(r))n.call(r,o)&&s(e,o,r[o]);return e};import{S as o,a,m as d,b as g,I as l}from"./index.e7e2ce56.js";import{d as u,o as c,c as m,n as h,A as v,a as b,t as p,i as j,g as y,F as f,e as C,f as J}from"./vendor.9fbad299.js";var S=u({name:"JudgingScoring",computed:{originalJudging(){return this.$store.state.judging.originalJudging},criteria(){var e,i;return null==(i=null==(e=this.originalJudging)?void 0:e.judgingToCriteria)?void 0:i.criteria},submission(){var e,i;return null==(i=null==(e=this.originalJudging)?void 0:e.judging)?void 0:i.submission},newGeneralComment:{get(){var e;return null==(e=this.$store.state.judging.newJudging)?void 0:e.judging.comment},set(e){const i=this.cloneNewJudging();i.judging.comment=e,this.$store.commit("judging/"+o,i)}},newComment:{get(){var e;return null==(e=this.$store.state.judging.newJudging)?void 0:e.judgingToCriteria.comment},set(e){const i=this.cloneNewJudging();i.judgingToCriteria.comment=e,this.$store.commit("judging/"+o,i)}},newScore:{get(){var e;return null==(e=this.$store.state.judging.newJudging)?void 0:e.judgingToCriteria.score},set(e){const i=this.cloneNewJudging();i.judgingToCriteria.score=e,this.$store.commit("judging/"+o,i)}}},methods:{async save(){await this.$store.dispatch("judging/"+a)},cloneNewJudging(){return JSON.parse(JSON.stringify(this.$store.state.judging.newJudging))}}});const w={key:0},x=b("hr",null,null,-1),T={class:"card bg-dark"},k={class:"card-header"},B=y(" Editing "),$=y(" for "),D={class:"card-body"},O={class:"form-group"},I=b("label",{for:"score"},"Score",-1),N={class:"form-group"},U=b("label",{for:"comment"}," Comment ",-1),A={class:"card-footer"},E={key:1,class:"text-muted"};S.render=function(e,i,t,n,s,r){return e.originalJudging&&e.criteria&&e.submission?(c(),m("div",w,[h(b("textarea",{id:"comment","onUpdate:modelValue":i[1]||(i[1]=i=>e.newGeneralComment=i),maxlength:3e3,rows:5,class:"form-control",placeholder:"General comment"},null,512),[[v,e.newGeneralComment]]),x,b("div",T,[b("div",k,[B,b("b",null,p(e.criteria.name),1),$,b("b",null,p(e.submission.anonymisedAs),1)]),b("div",D,[b("div",O,[I,h(b("input",{id:"score","onUpdate:modelValue":i[2]||(i[2]=i=>e.newScore=i),type:"number",step:"1",min:"1",max:e.criteria.maxScore,class:"form-control"},null,8,["max"]),[[v,e.newScore]])]),b("div",N,[U,h(b("textarea",{id:"comment","onUpdate:modelValue":i[3]||(i[3]=i=>e.newComment=i),maxlength:3e3,rows:5,class:"form-control",placeholder:"Criteria specific"},null,512),[[v,e.newComment]])])]),b("div",A,[b("button",{type:"button",class:"btn btn-primary",onClick:i[4]||(i[4]=j((i=>e.save()),["prevent"]))}," Save changes ")])])])):(c(),m("div",E," Select a score to begin... "))};var P=u({name:"JudgingTable",data:()=>({sortBy:"name",sortByCriteria:1,sortDesc:!1}),computed:r(r({},d({round:e=>e.judging.currentRound,criterias:e=>e.judging.criterias,judgingDone:e=>e.judging.judgingDone,originalJudging:e=>e.judging.originalJudging,newJudging:e=>e.judging.newJudging})),{sortedSubmissions(){const e=this.round.submissions||[];return"name"===this.sortBy?e.sort(((e,i)=>{var t,n;const s=null==(t=e.anonymisedAs)?void 0:t.toUpperCase(),r=null==(n=i.anonymisedAs)?void 0:n.toUpperCase();return s<r?this.sortDesc?-1:1:s>r?this.sortDesc?1:-1:0})):"total"===this.sortBy?e.sort(((e,i)=>{const t=this.getTotalScore(e.id),n=this.getTotalScore(i.id);return this.sortDesc?t-n:n-t})):"criteria"===this.sortBy?e.sort(((e,i)=>{const t=this.getScore(e.id,this.sortByCriteria),n=this.getScore(i.id,this.sortByCriteria);return this.sortDesc?t-n:n-t})):"completed"===this.sortBy&&e.sort(((e,i)=>{const t=this.isCompleted(e.id);return t===this.isCompleted(i.id)?0:this.sortDesc?t?1:-1:t?-1:1})),e},maxPossibleScore(){return this.criterias.reduce(((e,i)=>i.maxScore+e),0)}}),methods:{getScore(e,i){const t=this.$store.getters["judging/getJudgingToCriterias"]({submissionId:e,criteriaId:i});return t?t.score:0},getTotalScore(e){const i=this.judgingDone.find((i=>i.submissionId===e));return i?i.judgingToCriterias.reduce(((e,i)=>i.score+e),0):0},isCompleted(e){const i=this.judgingDone.find((i=>i.submissionId===e));return!!i&&i.judgingToCriterias.length===this.criterias.length},sortSubmissionsBy(e,i){this.sortBy=e,this.sortDesc=!this.sortDesc,"criteria"===e&&i&&(this.sortByCriteria=i)},selectForEditing(e,i){var t,n,s,r,o,a;(!this.originalJudging||!this.newJudging||(null==(t=this.originalJudging)?void 0:t.judgingToCriteria.comment)===(null==(n=this.newJudging)?void 0:n.judgingToCriteria.comment)&&(null==(s=this.originalJudging)?void 0:s.judgingToCriteria.score)===(null==(r=this.newJudging)?void 0:r.judgingToCriteria.score)&&(null==(o=this.originalJudging)?void 0:o.judging.comment)===(null==(a=this.newJudging)?void 0:a.judging.comment)||confirm("Changes may be lost, are you sure?"))&&this.$store.dispatch("judging/"+g,{submission:e,criteria:i})}}});const G={class:"card-body p-0"},R={class:"table table-bordered table-sm table-hover table-responsive-sm"},F={class:"text-left"},V={class:"text-left"},q=b("i",{class:"me-1 fas fa-edit"},null,-1);P.render=function(e,i,t,n,s,r){return c(),m("div",G,[b("table",R,[b("thead",null,[b("tr",null,[b("th",F,[b("a",{href:"#",onClick:i[1]||(i[1]=j((i=>e.sortSubmissionsBy("name")),["prevent"]))}," Entry's Name ")]),(c(!0),m(f,null,C(e.criterias,(i=>(c(),m("th",{key:i.id},[b("a",{href:"#",onClick:j((t=>e.sortSubmissionsBy("criteria",i.id)),["prevent"])},p(i.name),9,["onClick"])])))),128)),b("th",null,[b("a",{href:"#",onClick:i[2]||(i[2]=j((i=>e.sortSubmissionsBy("total")),["prevent"]))}," Total ")]),b("th",null,[b("a",{href:"#",onClick:i[3]||(i[3]=j((i=>e.sortSubmissionsBy("completed")),["prevent"]))}," Completed ")])])]),b("tbody",null,[(c(!0),m(f,null,C(e.sortedSubmissions,(i=>(c(),m("tr",{key:i.id},[b("td",V,p(i.anonymisedAs),1),(c(!0),m(f,null,C(e.criterias,(t=>(c(),m("td",{key:t.id},[b("a",{href:"#",class:"d-flex align-items-center justify-content-center",onClick:j((n=>e.selectForEditing(i,t)),["prevent"])},[q,y(" "+p(e.getScore(i.id,t.id)+`/ ${t.maxScore}`),1)],8,["onClick"])])))),128)),b("td",null,p(e.getTotalScore(i.id))+" / "+p(e.maxPossibleScore),1),b("td",null,[b("i",{class:["fa",e.isCompleted(i.id)?"fa-check text-success":"fa-times text-danger"]},null,2)])])))),128))])])])};var z=u({components:{JudgingTable:P,JudgingScoring:S},computed:d({user:e=>e.loggedInUser,currentRound:e=>e.judging.currentRound}),async created(){await this.$store.dispatch("judging/"+l)}});const H={class:"container-fluid"},K={key:0,class:"row"},L={class:"col-md-8"},M={class:"col-md-4"},Q={key:1};z.render=function(e,i,t,n,s,r){const o=J("judging-table"),a=J("judging-scoring");return c(),m("div",H,[e.currentRound?(c(),m("div",K,[b("div",L,[b(o)]),b("div",M,[b(a)])])):(c(),m("div",Q," Judging hasn't started or just ended or i fucked up, ops "))])};export default z;
