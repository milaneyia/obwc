import{C as e}from"./index.c33de31a.js";import{o as t,c as a,a as o,F as n}from"./vendor.4ebb0e4b.js";var c={props:{contest:{type:Object,required:!0},disabled:{type:Boolean,default:!1},selected:{type:Boolean,required:!0}},emits:["changeSelected"],methods:{getContestIcon(t){let a="btn-mode-radio--";switch(t){case e.Standard:return a+"osu";case e.Taiko:return a+"taiko";case e.Catch:return a+"catch";case e.Mania:return a+"mania"}return"btn-mode-radio"},changeSelected(){this.$emit("changeSelected",this.contest)}}};c.render=function(e,c,d,s,r,i){return t(),a(n,null,[o("input",{id:"mode-"+d.contest.id,type:"radio",class:"btn-check",autocomplete:"off",value:d.contest,disabled:d.disabled,onClick:c[1]||(c[1]=(...e)=>i.changeSelected&&i.changeSelected(...e))},null,8,["id","value","disabled"]),o("label",{class:["btn btn-mode-radio mx-1",[d.selected?"active":"",i.getContestIcon(d.contest.id)]],for:"mode-"+d.contest.id},null,10,["for"])],64)};export{c as _};
