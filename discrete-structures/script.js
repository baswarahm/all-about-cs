/* CKC111 Discrete Structures: study site
   Part 1: Week 1 (Propositional Logic)
   Part 2: Week 3 (Basic Algorithms)
   Part 3: Weeks 2, 4, 5 and the Exam Lab (Equivalences, Relations, practice)
   Part 4: App (week switcher, theme, nav highlight)
   Element ids are prefixed w1- / w3- so the weeks never collide. */

/* ===== PART 0: one-time move of saved answers when Week 1 was split into Weeks 1 and 2 ===== */
(function(){
  if(typeof localStorage==="undefined")return;
  try{
    if(localStorage.getItem("ckc111-split-w2"))return;
    var s1=JSON.parse(localStorage.getItem("ckc111-week1")||"null");
    if(s1&&!localStorage.getItem("ckc111-week2")){
      var m={attempts:{},hints:{},revealed:{},errors:{},recall:{},recallDone:{},ratings:{}};
      ["p7","p8","p9"].forEach(function(id){["attempts","hints","revealed","errors"].forEach(function(f){if(s1[f]&&s1[f][id]!==undefined){m[f][id]=s1[f][id];delete s1[f][id];}});});
      ["recall","recallDone"].forEach(function(f){if(s1[f]&&s1[f].r4!==undefined){m[f].r2=s1[f].r4;delete s1[f].r4;}});
      if(s1.ratings&&s1.ratings["4"]!==undefined){m.ratings["3"]=s1.ratings["4"];delete s1.ratings["4"];}
      localStorage.setItem("ckc111-week1",JSON.stringify(s1));
      localStorage.setItem("ckc111-week2",JSON.stringify(m));
    }
    localStorage.setItem("ckc111-split-w2","1");
  }catch(e){}
})();

/* ===== PART 1: WEEK 1 ===== */
(function(){
"use strict";
if(typeof document==="undefined"||!document.getElementById){return;}

/* ---------- storage (guarded) ---------- */
var KEY="ckc111-week1";
var state={attempts:{},hints:{},revealed:{},errors:{},recall:{},recallDone:{},ratings:{}};
function load(){try{var s=localStorage.getItem(KEY);if(s){var o=JSON.parse(s);for(var k in state){if(o&&o[k])state[k]=o[k];}}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
load();


/* ---------- helpers ---------- */
function $(id){return document.getElementById("w1-"+id);}
function tf(v){return v?"T":"F";}
function cell(v,extra){return '<td class="v-'+tf(v)+(extra?" "+extra:"")+'">'+tf(v)+'</td>';}

/* ---------- hero ---------- */
var hp=true,hq=true;
function heroRender(){
  var imp=!hp||hq;
  $("h-p").setAttribute("aria-pressed",hp);$("h-p").innerHTML="p: you got 100% <b>"+tf(hp)+"</b>";
  $("h-q").setAttribute("aria-pressed",hq);$("h-q").innerHTML="q: you got an A <b>"+tf(hq)+"</b>";
  var m;
  if(hp&&hq)m="You got 100% and an A. The promise is kept.";
  else if(hp&&!hq)m="You got 100% but no A. The promise is broken. This is the only row where p → q is false.";
  else m="You did not get 100%, so the promise says nothing. It cannot be broken, so p → q is true (vacuously).";
  $("h-msg").textContent=m;
  var b=$("h-big");b.textContent=tf(imp);b.className="big "+(imp?"v-T":"v-F");
  b.style.borderRadius="14px";b.style.padding="12px 18px";
  $("h-res").textContent=imp?"p → q is true":"p → q is false";
}
$("h-p").addEventListener("click",function(){hp=!hp;heroRender();});
$("h-q").addEventListener("click",function(){hq=!hq;heroRender();});
heroRender();

/* ---------- proposition sorter ---------- */
var sorts=[
 ["Snow is green.",true,"A proposition. It is false, but it has a truth value."],
 ["1 + 0 = 1",true,"A proposition. It is true."],
 ["I am hungry.",true,"A proposition. It is true or false for the speaker."],
 ["Sit down!",false,"Not a proposition. It is a command."],
 ["What time is it?",false,"Not a proposition. It is a question."],
 ["x + 1 = 2",false,"Not a proposition. Its truth depends on x, so it has no fixed value."],
 ["Let us go for dinner tonight.",false,"Not a proposition. It is a proposal."]
];
var sorter=$("sorter");
sorts.forEach(function(s){
  var b=document.createElement("button");b.type="button";b.textContent=s[0];
  b.addEventListener("click",function(){
    if(b.querySelector(".verdict"))return;
    var v=document.createElement("span");v.className="verdict";v.textContent=s[2];
    b.appendChild(v);b.classList.add(s[1]?"yes":"no");
  });
  sorter.appendChild(b);
});

/* ---------- connective explorer ---------- */
var ops={
 "∧":{f:function(p,q){return p&&q;},m:"Conjunction (and). True only when both are true."},
 "∨":{f:function(p,q){return p||q;},m:"Disjunction (inclusive or). True when at least one is true."},
 "⊕":{f:function(p,q){return p!==q;},m:"Exclusive or. True when exactly one is true."},
 "→":{f:function(p,q){return !p||q;},m:"Implication. False only when p is true and q is false."},
 "↔":{f:function(p,q){return p===q;},m:"Biconditional. True when p and q have the same truth value."}
};
var cop="→",cp=true,cq=true;
var ctabs=$("ctabs");
Object.keys(ops).forEach(function(k){
  var b=document.createElement("button");b.type="button";b.className="tab";b.setAttribute("role","tab");b.textContent=k;b.setAttribute("aria-label",ops[k].m.split(".")[0]);
  b.addEventListener("click",function(){cop=k;connRender();});
  ctabs.appendChild(b);
});
function connRender(){
  Array.prototype.forEach.call(ctabs.children,function(b){b.setAttribute("aria-selected",b.textContent===cop);});
  $("c-p").setAttribute("aria-pressed",cp);$("c-p").innerHTML="p <b>"+tf(cp)+"</b>";
  $("c-q").setAttribute("aria-pressed",cq);$("c-q").innerHTML="q <b>"+tf(cq)+"</b>";
  var h='<tr><th>p</th><th>q</th><th class="final">p '+cop+' q</th></tr>';
  [[true,true],[true,false],[false,true],[false,false]].forEach(function(r){
    var hit=(r[0]===cp&&r[1]===cq);
    h+='<tr class="'+(hit?"hit":"")+'">'+cell(r[0])+cell(r[1])+cell(ops[cop].f(r[0],r[1]),"final")+'</tr>';
  });
  $("ctable").innerHTML=h;
  $("cmean").textContent=ops[cop].m;
}
$("c-p").addEventListener("click",function(){cp=!cp;connRender();});
$("c-q").addEventListener("click",function(){cq=!cq;connRender();});
connRender();

/* ---------- converse table ---------- */
(function(){
  var h='<tr><th>p</th><th>q</th><th>p → q</th><th>q → p<br><small>converse</small></th><th>¬p → ¬q<br><small>inverse</small></th><th>¬q → ¬p<br><small>contrapositive</small></th></tr>';
  [[true,true],[true,false],[false,true],[false,false]].forEach(function(r){
    var p=r[0],q=r[1];
    h+='<tr>'+cell(p)+cell(q)+cell(!p||q)+cell(!q||p)+cell(p||!q)+cell(q||!p)+'</tr>';
  });
  $("cvtable").innerHTML=h;
})();

/* ---------- logic parser ---------- */
function normalize(s){
  return s.replace(/<->|<=>/g,"↔").replace(/->|=>/g,"→").replace(/xor/gi,"⊕")
          .replace(/[~!]/g,"¬").replace(/&|\/\\/g,"∧").replace(/\||\\\//g,"∨");
}
function tokenize(s){
  var out=[],i=0;
  while(i<s.length){
    var c=s[i];
    if(/\s/.test(c)){i++;continue;}
    if(/[a-z]/.test(c)){out.push({t:"var",v:c});i++;continue;}
    if(c==="T"||c==="F"){out.push({t:"const",v:c==="T"});i++;continue;}
    if("¬∧∨⊕→↔()".indexOf(c)>=0){out.push({t:c});i++;continue;}
    throw new Error('I do not recognise "'+c+'". Use lowercase letters for variables, T or F, and the symbol buttons.');
  }
  return out;
}
function parse(src){
  var toks=tokenize(normalize(src)),pos=0;
  if(!toks.length)throw new Error("Type an expression first.");
  function peek(){return toks[pos]&&toks[pos].t;}
  function eat(t){if(peek()!==t)throw new Error("Expected "+t+" but found "+(toks[pos]?toks[pos].t:"the end")+".");pos++;}
  function iff(){var l=imp();while(peek()==="↔"){pos++;l={t:"bin",op:"↔",l:l,r:imp()};}return l;}
  function imp(){var l=or();if(peek()==="→"){pos++;return {t:"bin",op:"→",l:l,r:imp()};}return l;}
  function or(){var l=and();while(peek()==="∨"||peek()==="⊕"){var op=peek();pos++;l={t:"bin",op:op,l:l,r:and()};}return l;}
  function and(){var l=not();while(peek()==="∧"){pos++;l={t:"bin",op:"∧",l:l,r:not()};}return l;}
  function not(){if(peek()==="¬"){pos++;return {t:"not",a:not()};}return atom();}
  function atom(){
    var tk=toks[pos];
    if(!tk)throw new Error("The expression ends too early.");
    if(tk.t==="var"){pos++;return {t:"var",n:tk.v};}
    if(tk.t==="const"){pos++;return {t:"const",v:tk.v};}
    if(tk.t==="("){pos++;var e=iff();eat(")");return e;}
    throw new Error("Unexpected "+tk.t+".");
  }
  var ast=iff();
  if(pos<toks.length)throw new Error("Unexpected "+toks[pos].t+". Check your brackets.");
  return ast;
}
function str(a,top){
  if(a.t==="var")return a.n;
  if(a.t==="const")return a.v?"T":"F";
  if(a.t==="not")return "¬"+str(a.a);
  var s=str(a.l)+" "+a.op+" "+str(a.r);
  return top?s:"("+s+")";
}
function evalA(a,env){
  switch(a.t){
    case "var":return env[a.n];
    case "const":return a.v;
    case "not":return !evalA(a.a,env);
    default:
      var l=evalA(a.l,env),r=evalA(a.r,env);
      if(a.op==="∧")return l&&r;
      if(a.op==="∨")return l||r;
      if(a.op==="⊕")return l!==r;
      if(a.op==="→")return !l||r;
      return l===r;
  }
}
function vars(a,set){
  if(a.t==="var")set[a.n]=1;
  else if(a.t==="not")vars(a.a,set);
  else if(a.t==="bin"){vars(a.l,set);vars(a.r,set);}
  return set;
}
function subs(a,list,seen){
  if(a.t==="not")subs(a.a,list,seen);
  else if(a.t==="bin"){subs(a.l,list,seen);subs(a.r,list,seen);}
  if(a.t==="var"||a.t==="const")return;
  var k=str(a);
  if(!seen[k]){seen[k]=1;list.push(a);}
}
function envFor(vs,i){
  var n=vs.length,e={};
  vs.forEach(function(v,k){e[v]=((i>>(n-1-k))&1)===0;});
  return e;
}
function insertAt(input,sym){
  var s=input.selectionStart,e=input.selectionEnd,v=input.value;
  if(s==null){input.value+=sym;}else{input.value=v.slice(0,s)+sym+v.slice(e);input.selectionStart=input.selectionEnd=s+sym.length;}
  input.focus();input.dispatchEvent(new Event("input"));
}

/* ---------- lab 1: single expression ---------- */
function renderLab1(){
  var out=$("out1"),src=$("expr1").value;
  try{
    var ast=parse(src),vs=Object.keys(vars(ast,{})).sort();
    if(vs.length>5)throw new Error("Please use at most 5 variables (that is already 32 rows).");
    var list=[];subs(ast,list,{});
    var cols=list.length?list:[ast];
    var h='<div class="parsed">Fully bracketed: '+str(ast,true)+'</div><div class="scroll"><table><tr>';
    vs.forEach(function(v){h+="<th>"+v+"</th>";});
    cols.forEach(function(c,i){h+='<th class="'+(i===cols.length-1?"final":"")+'">'+str(c,true)+"</th>";});
    h+="</tr>";
    var all=true,none=true;
    for(var i=0;i<Math.pow(2,vs.length);i++){
      var env=envFor(vs,i);h+="<tr>";
      vs.forEach(function(v){h+=cell(env[v]);});
      cols.forEach(function(c,k){var val=evalA(c,env);if(k===cols.length-1){if(val)none=false;else all=false;}h+=cell(val,k===cols.length-1?"final":"");});
      h+="</tr>";
    }
    h+="</table></div>";
    var kind=all?["Tautology: always true","v-T"]:none?["Contradiction: always false","v-F"]:["Contingency: sometimes true, sometimes false","sym"];
    h+='<div class="verdict-box '+(kind[1]==="sym"?"":kind[1])+'" '+(kind[1]==="sym"?'style="background:var(--soft)"':"")+">"+kind[0]+"</div>";
    out.innerHTML=h;
  }catch(e){out.innerHTML='<div class="err">'+e.message+"</div>";}
}
$("expr1").addEventListener("input",renderLab1);

/* symbol keys */
Array.prototype.forEach.call(document.querySelectorAll("#week1 .keys"),function(k){
  ["¬","∧","∨","⊕","→","↔","(",")","T","F"].forEach(function(s){
    var b=document.createElement("button");b.type="button";b.textContent=s;b.setAttribute("aria-label","Insert "+s);
    b.addEventListener("click",function(){insertAt($("expr1"),s);});
    k.appendChild(b);
  });
});
renderLab1();

/* ---------- recall ---------- */
var recall=[
 ["What are the two conditions for a sentence to be a proposition?","It must be a declarative sentence, and it must be either true or false (it has a truth value)."],
 ["In which single row is p → q false?","When p is true and q is false."],
 ["Write the contrapositive of p → q.","¬q → ¬p."],
 ["Which is equivalent to p → q: the converse, the inverse, or neither?","Neither. Only the contrapositive is equivalent. (The converse and the inverse are equivalent to each other.)"],
 ["List the five connectives from highest precedence to lowest.","¬, then ∧, then ∨, then →, then ↔. So p ∨ q → ¬r means (p ∨ q) → ¬r."],
 ["How many rows does a truth table with 5 variables have?","2⁵ = 32 rows."],
 ["\"p only if q\": which direction is the arrow?","p → q. The statement p can only be true when q is true."]
];
(function(){
  var box=$("recall-list");
  recall.forEach(function(r,i){
    var id="r"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">Recall '+(i+1)+'</span></div><p class="txt">'+r[0]+
      '</p><textarea id="w1-ta-'+id+'" aria-label="Your answer to recall question '+(i+1)+'"></textarea>'+
      '<div class="row"><button class="btn" type="button" id="w1-chk-'+id+'" disabled>Check my answer</button><span class="small" id="w1-note-'+id+'">Type an answer to unlock.</span></div>'+
      '<div id="w1-ans-'+id+'"></div>';
    box.appendChild(d);
    var ta=d.querySelector("textarea"),btn=d.querySelector("button"),ans=d.querySelector("#w1-ans-"+id);
    ta.value=state.recall[id]||"";
    btn.disabled=ta.value.trim().length<2;
    function show(){ans.innerHTML='<div class="sol"><b>Answer.</b> <span class="e">'+r[1]+'</span></div>';btn.disabled=true;$("note-"+id).textContent="Compare with yours. If it differs, note what you missed.";}
    if(state.recallDone[id])show();
    ta.addEventListener("input",function(){state.recall[id]=ta.value;save();if(!state.recallDone[id])btn.disabled=ta.value.trim().length<2;});
    btn.addEventListener("click",function(){state.recallDone[id]=true;save();show();});
  });
})();

/* ---------- practice ---------- */
var errTypes=["I got it right","Concept misunderstanding","Wrong law or formula","Calculation error","Logical reasoning error","Misread the question","Incomplete solution","Notation issue"];
var P=[
 {l:"Easy",q:'Which of these are propositions? (a) "Close the door." (b) 2 + 3 = 6 (c) x &gt; 5 (d) "Is it raining?" (e) "Penang is in Malaysia."',
  h:["For each one, ask: can I say it is true or false right now?","Commands and questions never have a truth value. Look at (c): what would you need to know before deciding?","(b) and (e) both have a definite truth value. One is false, and that still counts."],
  s:'(a) No, it is a command. (b) Yes, it is false. (c) No, its truth depends on x. (d) No, it is a question. (e) Yes, it is true.'},
 {l:"Easy",q:'Build the truth table for <span class="e">p ∧ ¬q</span>.',
  h:["You need 4 rows and a column for ¬q before the final column.","First fill in ¬q by flipping the q column.","∧ is true only when both sides are true. Which row has p true and ¬q true?"],
  s:'Only the row p = T, q = F gives T. The rows are TT → F, TF → T, FT → F, FF → F.'},
 {l:"Easy",q:'Let p = "I study" and q = "I pass". Write in symbols: (a) If I study, I pass. (b) I pass only if I study. (c) I study or I do not pass.',
  h:["(a) is the plain form of if-then.","(b) uses \"only if\". Which statement forces which? Passing forces studying.","(c) has a negation on the second part only."],
  s:'(a) <span class="e">p → q</span> (b) <span class="e">q → p</span> (c) <span class="e">p ∨ ¬q</span>'},
 {l:"Medium",q:'Write the converse, inverse and contrapositive of: "If it is a public holiday, then the library is closed."',
  h:["Let h = public holiday and c = library closed, so the statement is h → c.","Converse swaps the two sides. Inverse negates both sides. Contrapositive does both.","Be careful with the English: ¬c is \"the library is not closed\", which you can phrase as \"the library is open\"."],
  s:'Converse: if the library is closed, then it is a public holiday. Inverse: if it is not a public holiday, then the library is not closed. Contrapositive: if the library is not closed, then it is not a public holiday.'},
 {l:"Medium",q:'Build the truth table for <span class="e">(p → q) ∧ (q → p)</span>. Which connective\'s table does it match?',
  h:["Make columns for p → q, then q → p, then the ∧ of the two.","p → q is false only at TF. q → p is false only at FT.","The final column should be true in exactly two rows. Compare it with the tables in section 2."],
  s:'Final column: TT → T, TF → F, FT → F, FF → T. This matches the biconditional <span class="e">p ↔ q</span>.'},
 {l:"Medium",q:'Build the truth table for <span class="e">(p ∧ q) → r</span>.',
  h:["Three variables means 8 rows. List them systematically from TTT down to FFF.","Add a column for p ∧ q first.","An implication is false only when the hypothesis (p ∧ q) is true and r is false. How many rows is that?"],
  s:'The result is false only in the row p = T, q = T, r = F. It is true in the other 7 rows.'},
 {l:"Medium",q:'Let r = "you can ride", h = "you are at least 120 cm tall", a = "you are with an adult". Translate: "You can ride only if you are at least 120 cm tall or you are with an adult."',
  h:["Find the \"only if\" word. It splits the sentence.","\"r only if (something)\" means r → (something).","The something is \"h or a\". Remember the precedence, so bracket it."],
  s:'<span class="e">r → (h ∨ a)</span>'},
 {l:"Challenging",q:'Translate into logic: "You can access the Internet from campus only if you are a computer science major or you are not a freshman." Use a, c, f as on the slide (a: you can access the Internet from campus, c: you are a CS major, f: you are a freshman). Then write the converse and the contrapositive of your answer in symbols (no need to simplify).',
  h:["Find the \"only if\". The part before it is the hypothesis.","\"a only if (something)\" means a → (something). Here the something is \"c or not f\". Bracket it.","Converse: swap the two sides. Contrapositive: swap the two sides and negate each. Keep the brackets around (c ∨ ¬f)."],
  s:'<span class="e">a → (c ∨ ¬f)</span><br>Converse: <span class="e">(c ∨ ¬f) → a</span><br>Contrapositive: <span class="e">¬(c ∨ ¬f) → ¬a</span>'},
 {l:"Challenging",q:'Build the truth table for <span class="e">(p ⊕ q) → (p ∨ q)</span>. What do you notice about the final column, and what does that tell you about the statement?',
  h:["Four rows. Make columns for p ⊕ q and p ∨ q first.","p ⊕ q is true when exactly one of p, q is true. p ∨ q is true when at least one is true.","An implication is false only when the hypothesis is true and the conclusion is false. Does that ever happen here?"],
  s:'<pre>p q | p ⊕ q | p ∨ q | (p ⊕ q) → (p ∨ q)\nT T |   F   |   T   |         T\nT F |   T   |   T   |         T\nF T |   T   |   T   |         T\nF F |   F   |   F   |         T</pre>The final column is all T, so the statement is always true. Next week this has a name: a <b>tautology</b>.'},
 {l:"Challenging",q:'Is "if p then q" the same as "p if and only if q"? Find a row of the truth table where <span class="e">p → q</span> and <span class="e">p ↔ q</span> have different values, and say what that row means in words.',
  h:["Write both truth tables side by side. Four rows each.","They agree in three rows. Find the one where they differ.","Look at the row where p is false and q is true."],
  s:'They differ when p = F and q = T: <span class="e">p → q</span> is T (the promise cannot be broken when p is false) but <span class="e">p ↔ q</span> is F (p and q do not have the same value). In words: with p = "I am at home" and q = "it is raining", on a day when I am out and it is raining, "if I am at home then it is raining" is true, but "I am at home if and only if it is raining" is false. So the two statements are <b>not</b> the same.'}
];
function updateProg(){
  var n=0;P.forEach(function(_,i){if((state.attempts["p"+i]||"").trim().length>=4)n++;});
  $("prog-txt").textContent="Practice: "+n+" of 10 attempted";
  $("prog-bar").style.width=(n*10)+"%";
}
(function(){
  var box=$("practice-list");
  P.forEach(function(p,i){
    var id="p"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">'+p.l+'</span><b>Question '+(i+1)+'</b></div>'+
     '<p class="txt">'+p.q+'</p>'+
     '<textarea id="w1-ta-'+id+'" aria-label="Your attempt for question '+(i+1)+'" placeholder="Write your attempt here."></textarea>'+
     '<div class="row"><button class="btn" type="button" data-h="1">Hint 1</button><button class="btn" type="button" data-h="2" disabled>Hint 2</button><button class="btn" type="button" data-h="3" disabled>Hint 3</button>'+
     '<button class="btn primary" type="button" data-sol disabled>Show solution</button><span class="small" data-note>Write an attempt to unlock the solution.</span></div>'+
     '<div data-hints></div><div data-sol-box></div>';
    box.appendChild(d);
    var ta=d.querySelector("textarea"),hb=d.querySelector("[data-hints]"),sb=d.querySelector("[data-sol-box]"),sol=d.querySelector("[data-sol]"),note=d.querySelector("[data-note]");
    var hbtn=d.querySelectorAll("[data-h]");
    ta.value=state.attempts[id]||"";
    function gate(){var ok=ta.value.trim().length>=4;sol.disabled=!ok||!!state.revealed[id];if(ok&&!state.revealed[id])note.textContent="You can reveal the solution now.";else if(!state.revealed[id])note.textContent="Write an attempt to unlock the solution.";}
    function renderHints(){
      var n=state.hints[id]||0,h="";
      for(var k=0;k<n;k++)h+='<div class="hint"><b>Hint '+(k+1)+'.</b> '+p.h[k]+'</div>';
      hb.innerHTML=h;
      hbtn.forEach(function(b,k){b.disabled=(k+1)!==n+1;});
    }
    function renderSol(){
      var opts=errTypes.map(function(t){return '<option'+((state.errors[id]===t)?' selected':'')+'>'+t+'</option>';}).join("");
      sb.innerHTML='<div class="sol"><b>Solution.</b><br>'+p.s+'</div><p class="small" style="margin-top:10px"><label>How did your attempt go? <select data-err><option value="">Choose one</option>'+opts+'</select></label></p>';
      sb.querySelector("[data-err]").addEventListener("change",function(e){state.errors[id]=e.target.value;save();});
      note.textContent="Compare with your attempt, then classify it.";sol.disabled=true;
    }
    ta.addEventListener("input",function(){state.attempts[id]=ta.value;save();gate();updateProg();});
    hbtn.forEach(function(b){b.addEventListener("click",function(){var k=+b.getAttribute("data-h");state.hints[id]=Math.max(state.hints[id]||0,k);save();renderHints();});});
    sol.addEventListener("click",function(){state.revealed[id]=true;save();renderSol();});
    renderHints();gate();if(state.revealed[id])renderSol();
  });
  updateProg();
})();

/* ---------- checkpoint ---------- */
var objectives=["Deciding whether a sentence is a proposition","Truth tables for ¬ ∧ ∨ ⊕ → ↔","Translating English into logic","Converse, inverse and contrapositive","Using precedence and brackets correctly"];
(function(){
  var box=$("objs");
  objectives.forEach(function(o,i){
    var d=document.createElement("div");d.className="o";
    d.innerHTML='<span>'+o+'</span><select aria-label="Rating for '+o+'"><option value="">Rate it</option><option>Confident</option><option>Needs review</option><option>Weak</option></select>';
    var sel=d.querySelector("select");sel.value=state.ratings[i]||"";
    sel.addEventListener("change",function(){state.ratings[i]=sel.value;save();});
    box.appendChild(d);
  });
})();
$("cp-build").addEventListener("click",function(){
  var att=0,rec=0,tally={};
  P.forEach(function(_,i){if((state.attempts["p"+i]||"").trim().length>=4)att++;var e=state.errors["p"+i];if(e&&e!=="I got it right")tally[e]=(tally[e]||0)+1;});
  recall.forEach(function(_,i){if(state.recallDone["r"+i])rec++;});
  var conf=[],rev=[],weak=[];
  objectives.forEach(function(o,i){var r=state.ratings[i];if(r==="Confident")conf.push(o);else if(r==="Needs review")rev.push(o);else if(r==="Weak")weak.push(o);});
  var next=weak.concat(rev).slice(0,3);
  var h="<h3>Your checkpoint</h3><ul>"+
   "<li>Active recall checked: "+rec+" of 7.</li><li>Practice attempted: "+att+" of 10.</li>";
  var tk=Object.keys(tally);
  h+="<li>Mistake types you logged: "+(tk.length?tk.map(function(k){return k+" ("+tally[k]+")";}).join(", "):"none yet")+".</li></ul>";
  h+="<p><b>Confident:</b> "+(conf.length?conf.join("; "):"none rated yet")+".</p>";
  h+="<p><b>Needs review:</b> "+(rev.length?rev.join("; "):"none")+".</p>";
  h+="<p><b>Weak:</b> "+(weak.length?weak.join("; "):"none")+".</p>";
  h+="<p><b>Revisit next:</b> "+(next.length?next.join("; "):"rate your objectives to get a list")+".</p>";
  h+='<p class="small">Bring this summary back to me and we will plan the next session around it.</p>';
  $("cp-out").innerHTML=h;
});
$("cp-reset").addEventListener("click",function(){
  if(!window.confirm("Clear all your answers, hints and ratings on this page?"))return;
  try{localStorage.removeItem(KEY);}catch(e){}
  location.reload();
});

window.CKCLogic={parse:parse,str:str,evalA:evalA,vars:vars,subs:subs,envFor:envFor,insertAt:insertAt};

})();

/* ===== PART 2: WEEK 3 ===== */
/* CKC111 Week 3: Basic Algorithms - behaviour
   Sections in this file:
   1. Step generators (pure functions: one per algorithm)
   2. Pseudocode text for each algorithm
   3. Greedy change helpers
   4. Page wiring (player, lab, detective, recall, practice, checkpoint)
*/
(function(){
"use strict";

/* =====================================================
   1. STEP GENERATORS
   Each returns a list of steps:
   { line, vars, arr, marks, note }
   line  = index of the highlighted pseudocode line
   marks = { active, best, mid, found, sorted, dim } (lists of 0-based indexes)
   ===================================================== */
function S(line,vars,arr,marks,note){return {line:line,vars:vars,arr:arr.slice(),marks:marks||{},note:note};}
function rng(a,b){var r=[];for(var k=a;k<=b;k++)r.push(k);return r;}

function genMax(a){
  var n=a.length,st=[],max=a[0],mi=0;
  st.push(S(0,{n:n},a,{},"Input: a sequence of "+n+" integers. We want the largest one."));
  st.push(S(1,{max:max},a,{best:[0]},"max := a1 = "+max+". The first number is our best so far."));
  for(var i=2;i<=n;i++){
    st.push(S(2,{i:i,max:max},a,{best:[mi],active:[i-1]},"for i := "+i+". Now look at a"+i+" = "+a[i-1]+"."));
    if(max<a[i-1]){
      st.push(S(3,{i:i,max:max},a,{best:[mi],active:[i-1]},"Is max < a"+i+"? "+max+" < "+a[i-1]+" is true, so we replace max."));
      max=a[i-1];mi=i-1;
      st.push(S(3,{i:i,max:max},a,{best:[mi]},"max := a"+i+" = "+max+". New best so far."));
    }else{
      st.push(S(3,{i:i,max:max},a,{best:[mi],active:[i-1]},"Is max < a"+i+"? "+max+" < "+a[i-1]+" is false, so no change."));
    }
  }
  if(n>=2)st.push(S(2,{i:n+1,max:max},a,{best:[mi]},"i := "+(n+1)+" is bigger than n, so the loop stops."));
  st.push(S(4,{max:max},a,{found:[mi]},"return "+max+". It is the largest element."));
  return st;
}

function genLinear(a,x){
  var n=a.length,st=[],i=1,loc;
  st.push(S(0,{x:x,n:n},a,{},"We look for x = "+x+" by checking elements one at a time from the left."));
  st.push(S(1,{i:i,x:x},a,{active:[0]},"i := 1. Start at the first element."));
  while(true){
    var inside=i<=n;
    var go=inside&&x!==a[i-1];
    st.push(S(2,{i:i,x:x},a,{active:inside?[i-1]:[]},
      inside?("Check: i ≤ n is true, and x ≠ a"+i+" means "+x+" ≠ "+a[i-1]+", which is "+(x!==a[i-1])+". "+(go?"Keep going.":"Stop: we found it."))
            :("Check: i ≤ n is false. We ran past the end of the list.")));
    if(go){i++;st.push(S(3,{i:i,x:x},a,{active:i<=n?[i-1]:[]},"i := i + 1 = "+i+"."));}
    else break;
  }
  if(i<=n){loc=i;st.push(S(4,{i:i,x:x,location:loc},a,{found:[i-1]},"i ≤ n, so location := i = "+loc+"."));}
  else{loc=0;st.push(S(5,{i:i,x:x,location:loc},a,{},"i > n, so x is not in the list: location := 0."));}
  st.push(S(6,{location:loc},a,loc?{found:[loc-1]}:{},"return "+loc+(loc?". x is at position "+loc+".":". 0 means not found.")));
  return st;
}

function genBinary(a,x){
  var n=a.length,st=[],i=1,j=n,m;
  function range(){return {dim:rng(0,i-2).concat(rng(j,n-1))};}
  st.push(S(0,{x:x,n:n},a,{},"We look for x = "+x+" in an increasing list by repeatedly halving the search interval."));
  st.push(S(1,{i:i,x:x},a,range(),"i := 1. The left end of the interval."));
  st.push(S(2,{i:i,j:j,x:x},a,range(),"j := n = "+n+". The right end of the interval."));
  while(i<j){
    st.push(S(3,{i:i,j:j,x:x},a,range(),"while i < j: "+i+" < "+j+" is true, so more than one candidate remains."));
    m=Math.floor((i+j)/2);
    var mk=range();mk.mid=[m-1];
    st.push(S(4,{i:i,j:j,m:m,x:x},a,mk,"m := ⌊("+i+" + "+j+")/2⌋ = "+m+". The middle element is a"+m+" = "+a[m-1]+"."));
    if(x>a[m-1]){
      i=m+1;mk=range();
      st.push(S(5,{i:i,j:j,m:m,x:x},a,mk,x+" > a"+m+" ("+a[m-1]+") is true, so x must be to the right. i := m + 1 = "+i+"."));
    }else{
      j=m;mk=range();
      st.push(S(6,{i:i,j:j,m:m,x:x},a,mk,x+" > a"+m+" ("+a[m-1]+") is false, so x is at m or to its left. j := m = "+j+"."));
    }
  }
  st.push(S(3,{i:i,j:j,x:x},a,range(),"while i < j: "+i+" < "+j+" is false. One candidate left: a"+i+" = "+a[i-1]+"."));
  var loc;
  if(x===a[i-1]){loc=i;st.push(S(7,{i:i,j:j,x:x,location:loc},a,{found:[i-1]},"x = a"+i+" is true, so location := "+loc+"."));}
  else{loc=0;st.push(S(8,{i:i,j:j,x:x,location:loc},a,range(),"x = a"+i+" is false, so location := 0."));}
  st.push(S(9,{location:loc},a,loc?{found:[loc-1]}:{},"return "+loc+"."));
  return st;
}

function genBubble(a){
  var arr=a.slice(),n=arr.length,st=[];
  function tail(i){return rng(n-i+1,n-1);} /* already in final place before pass i */
  st.push(S(0,{n:n},arr,{},"Bubble sort makes several passes. Each pass swaps neighbours that are out of order."));
  for(var i=1;i<=n-1;i++){
    st.push(S(1,{i:i},arr,{sorted:tail(i)},"Pass "+i+". The inner loop will compare neighbours up to position "+(n-i+1)+"."));
    for(var j=1;j<=n-i;j++){
      st.push(S(2,{i:i,j:j},arr,{sorted:tail(i),active:[j-1,j]},"j := "+j+". Compare a"+j+" and a"+(j+1)+"."));
      if(arr[j-1]>arr[j]){
        var u=arr[j-1],v=arr[j];
        arr[j-1]=v;arr[j]=u;
        st.push(S(3,{i:i,j:j},arr,{sorted:tail(i),active:[j-1,j]},u+" > "+v+" is true, so interchange them."));
      }else{
        st.push(S(3,{i:i,j:j},arr,{sorted:tail(i),active:[j-1,j]},arr[j-1]+" > "+arr[j]+" is false, so leave them."));
      }
    }
    st.push(S(1,{i:i},arr,{sorted:tail(i+1)},"End of pass "+i+". The value "+arr[n-i]+" is now in its final place at position "+(n-i+1)+"."));
  }
  st.push(S(4,{},arr,{sorted:rng(0,n-1)},"Done. The list is in increasing order."));
  return st;
}

function genInsertion(a){
  var arr=a.slice(),n=arr.length,st=[];
  function A(k){return arr[k-1];}
  st.push(S(0,{n:n},arr,{sorted:[0]},"Insertion sort grows a sorted section on the left, like sorting playing cards in your hand."));
  for(var j=2;j<=n;j++){
    var pre=rng(0,j-2);
    st.push(S(1,{j:j},arr,{sorted:pre,active:[j-1]},"for j := "+j+". Insert a"+j+" = "+A(j)+" into the sorted section (the first "+(j-1)+" items)."));
    var i=1;
    st.push(S(2,{j:j,i:i},arr,{sorted:pre,active:[j-1]},"i := 1. Scan from the left of the sorted section to find where it belongs."));
    while(A(j)>A(i)){
      st.push(S(3,{j:j,i:i},arr,{sorted:pre,active:[j-1,i-1]},"a"+j+" > a"+i+" means "+A(j)+" > "+A(i)+", which is true. Move right."));
      i++;
      st.push(S(4,{j:j,i:i},arr,{sorted:pre,active:[j-1,i-1]},"i := "+i+"."));
    }
    st.push(S(3,{j:j,i:i},arr,{sorted:pre,active:[j-1,i-1]},"a"+j+" > a"+i+" means "+A(j)+" > "+A(i)+", which is false. Stop. The place is position "+i+"."));
    var m=A(j);
    st.push(S(5,{j:j,i:i,m:m},arr,{sorted:pre,active:[j-1]},"m := a"+j+" = "+m+". Save it before we shift things."));
    var cnt=j-i;
    st.push(S(6,{j:j,i:i,m:m},arr,{sorted:pre,active:[j-1]},cnt>0?("for k := 0 to j − i − 1 = "+(cnt-1)+". We shift "+cnt+" element(s) one place right."):("j − i − 1 = "+(cnt-1)+", so there is nothing to shift.")));
    for(var k=0;k<=j-i-1;k++){
      arr[j-k-1]=arr[j-k-2];
      st.push(S(7,{j:j,i:i,m:m,k:k},arr,{sorted:pre,active:[j-k-1]},"k = "+k+": a"+(j-k)+" := a"+(j-k-1)+". Shift right to make room."));
    }
    arr[i-1]=m;
    st.push(S(8,{j:j,i:i,m:m},arr,{sorted:rng(0,j-1),found:[i-1]},"a"+i+" := m = "+m+". The first "+j+" items are now sorted."));
  }
  st.push(S(0,{},arr,{sorted:rng(0,n-1)},"Done. The list is in increasing order."));
  return st;
}

/* =====================================================
   2. PSEUDOCODE (indent level, html)
   ===================================================== */
var LINES={
  max:[
    [0,'<b>procedure</b> max(a<sub>1</sub>, a<sub>2</sub>, …, a<sub>n</sub>: integers)'],
    [1,'max := a<sub>1</sub>'],
    [1,'<b>for</b> i := 2 <b>to</b> n'],
    [2,'<b>if</b> max &lt; a<sub>i</sub> <b>then</b> max := a<sub>i</sub>'],
    [1,'<b>return</b> max']
  ],
  linear:[
    [0,'<b>procedure</b> linear search(x: integer, a<sub>1</sub>, …, a<sub>n</sub>: distinct integers)'],
    [1,'i := 1'],
    [1,'<b>while</b> (i ≤ n <b>and</b> x ≠ a<sub>i</sub>)'],
    [2,'i := i + 1'],
    [1,'<b>if</b> i ≤ n <b>then</b> location := i'],
    [1,'<b>else</b> location := 0'],
    [1,'<b>return</b> location']
  ],
  binary:[
    [0,'<b>procedure</b> binary search(x: integer, a<sub>1</sub>, …, a<sub>n</sub>: increasing integers)'],
    [1,'i := 1'],
    [1,'j := n'],
    [1,'<b>while</b> i &lt; j'],
    [2,'m := ⌊(i + j)/2⌋'],
    [2,'<b>if</b> x &gt; a<sub>m</sub> <b>then</b> i := m + 1'],
    [2,'<b>else</b> j := m'],
    [1,'<b>if</b> x = a<sub>i</sub> <b>then</b> location := i'],
    [1,'<b>else</b> location := 0'],
    [1,'<b>return</b> location']
  ],
  bubble:[
    [0,'<b>procedure</b> bubblesort(a<sub>1</sub>, …, a<sub>n</sub>: real numbers, n ≥ 2)'],
    [1,'<b>for</b> i := 1 <b>to</b> n − 1'],
    [2,'<b>for</b> j := 1 <b>to</b> n − i'],
    [3,'<b>if</b> a<sub>j</sub> &gt; a<sub>j+1</sub> <b>then</b> interchange a<sub>j</sub> and a<sub>j+1</sub>'],
    [1,'{a<sub>1</sub>, …, a<sub>n</sub> is now in increasing order}']
  ],
  insertion:[
    [0,'<b>procedure</b> insertion sort(a<sub>1</sub>, …, a<sub>n</sub>: real numbers, n ≥ 2)'],
    [1,'<b>for</b> j := 2 <b>to</b> n'],
    [2,'i := 1'],
    [2,'<b>while</b> a<sub>j</sub> &gt; a<sub>i</sub>'],
    [3,'i := i + 1'],
    [2,'m := a<sub>j</sub>'],
    [2,'<b>for</b> k := 0 <b>to</b> j − i − 1'],
    [3,'a<sub>j−k</sub> := a<sub>j−k−1</sub>'],
    [2,'a<sub>i</sub> := m']
  ]
};

var ALGOS={
  max:      {gen:genMax,      def:"10, 6, 8, 20, 2",             min:1},
  linear:   {gen:genLinear,   def:"10, 50, 30, 70", defX:"30",   min:1, needsX:true},
  binary:   {gen:genBinary,   def:"1, 2, 3, 5, 6, 7, 8, 10, 12, 13, 15, 16, 18, 19, 20, 22", defX:"19", min:1, needsX:true, sorted:true, sortBtn:true},
  bubble:   {gen:genBubble,   def:"3, 2, 4, 1, 5",              min:2},
  insertion:{gen:genInsertion,def:"3, 2, 4, 1, 5",              min:2}
};

/* =====================================================
   3. GREEDY CHANGE HELPERS
   ===================================================== */
function greedyChange(coins,n){
  var c=coins.slice().sort(function(a,b){return b-a;}),left=n,rows=[],total=0;
  c.forEach(function(v){var d=0;while(left>=v){d++;left-=v;}rows.push({c:v,d:d,left:left});total+=d;});
  return {rows:rows,left:left,total:total};
}
function optimalChange(coins,n){
  var best=[0],from=[0],v,k;
  for(v=1;v<=n;v++){
    best[v]=Infinity;from[v]=0;
    for(k=0;k<coins.length;k++){
      if(v>=coins[k]&&best[v-coins[k]]+1<best[v]){best[v]=best[v-coins[k]]+1;from[v]=coins[k];}
    }
  }
  if(best[n]===Infinity)return null;
  var used={},r=n;
  while(r>0){used[from[r]]=(used[from[r]]||0)+1;r-=from[r];}
  return {count:best[n],used:used};
}

/* allow tests to reach the pure functions */
if(typeof module!=="undefined"&&module.exports){
  module.exports={genMax:genMax,genLinear:genLinear,genBinary:genBinary,genBubble:genBubble,genInsertion:genInsertion,greedyChange:greedyChange,optimalChange:optimalChange};
}
if(typeof document==="undefined"||!document.getElementById){return;}

/* =====================================================
   4. PAGE WIRING
   ===================================================== */
var KEY="ckc111-week3";
var state={attempts:{},hints:{},revealed:{},errors:{},recall:{},recallDone:{},ratings:{}};
function load(){try{var s=localStorage.getItem(KEY);if(s){var o=JSON.parse(s);for(var k in state){if(o&&o[k])state[k]=o[k];}}}catch(e){}}
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch(e){}}
function $(id){return document.getElementById("w3-"+id);}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}

/* ---------- list parsing ---------- */
function parseList(str,cfg){
  var parts=str.split(/[\s,]+/).filter(function(p){return p.length;});
  if(!parts.length)throw new Error("Type some whole numbers, separated by commas.");
  var out=parts.map(function(p){
    if(!/^-?\d+$/.test(p))throw new Error('"'+p+'" is not a whole number. Use whole numbers separated by commas.');
    return parseInt(p,10);
  });
  if(out.length>16)throw new Error("Please use at most 16 numbers so everything fits on screen.");
  if(out.length<cfg.min)throw new Error("This algorithm needs at least "+cfg.min+" numbers.");
  return out;
}

/* ---------- step player ---------- */
var pid=0;
function makePlayer(root){
  var key=root.getAttribute("data-algo"),cfg=ALGOS[key],id="pl"+(pid++);
  var steps=[],idx=0,timer=null;
  var h='<div class="pl-in"><label for="'+id+'a">List</label><input class="list" id="'+id+'a" type="text" value="'+cfg.def+'" autocomplete="off" spellcheck="false">';
  if(cfg.needsX)h+='<label for="'+id+'x">x</label><input class="xin" id="'+id+'x" type="text" value="'+cfg.defX+'" autocomplete="off" spellcheck="false">';
  h+='<button class="btn" type="button" data-load>Load</button>';
  if(cfg.sortBtn)h+='<button class="btn" type="button" data-sort>Sort the list</button>';
  h+='</div><div class="pl-err" role="alert"></div>';
  h+='<div class="pl-ctl"><button class="btn" type="button" data-reset>Reset</button><button class="btn" type="button" data-back>Back</button><button class="btn primary" type="button" data-next>Next step</button><button class="btn" type="button" data-play>Play</button><span class="pl-count"></span></div>';
  h+='<div class="pl-body"><div class="pl-code" role="group" aria-label="Pseudocode"></div><div><div class="cells"></div><div class="vars"></div><p class="note" aria-live="polite"></p></div></div>';
  root.classList.add("player");root.innerHTML=h;
  var code=root.querySelector(".pl-code");
  LINES[key].forEach(function(l){var d=document.createElement("div");d.style.setProperty("--ind",l[0]);d.innerHTML=l[1];code.appendChild(d);});
  var codeLines=code.children,errEl=root.querySelector(".pl-err"),cellsEl=root.querySelector(".cells"),varsEl=root.querySelector(".vars"),noteEl=root.querySelector(".note"),countEl=root.querySelector(".pl-count");
  var bBack=root.querySelector("[data-back]"),bNext=root.querySelector("[data-next]"),bPlay=root.querySelector("[data-play]");
  var tagNames={active:"now",best:"best",mid:"mid",found:"found",sorted:"sorted"};

  function stop(){if(timer){clearInterval(timer);timer=null;}bPlay.textContent="Play";}
  function render(){
    var s=steps[idx];
    Array.prototype.forEach.call(codeLines,function(d,k){d.classList.toggle("on",k===s.line);});
    var m=s.marks||{},h2="";
    s.arr.forEach(function(v,k){
      var cls=["cell"],tag="";
      ["dim","sorted","best","active","mid","found"].forEach(function(t){
        if(m[t]&&m[t].indexOf(k)>=0){cls.push(t);if(tagNames[t])tag=tagNames[t];}
      });
      h2+='<div class="'+cls.join(" ")+'"><div class="box">'+v+'</div><div class="ix">'+(k+1)+'</div><div class="tag">'+tag+'</div></div>';
    });
    cellsEl.innerHTML=h2;
    var vh="";for(var k in s.vars){vh+="<span>"+k+" = "+s.vars[k]+"</span>";}
    varsEl.innerHTML=vh;
    noteEl.textContent=s.note;
    countEl.textContent="Step "+(idx+1)+" of "+steps.length;
    bBack.disabled=idx===0;bNext.disabled=idx===steps.length-1;
    if(idx===steps.length-1)stop();
  }
  function loadIt(){
    stop();errEl.textContent="";
    try{
      var a=parseList(root.querySelector(".list").value,cfg),x;
      if(cfg.needsX){
        var xs=root.querySelector(".xin").value.trim();
        if(!/^-?\d+$/.test(xs))throw new Error("x must be a whole number.");
        x=parseInt(xs,10);
      }
      if(cfg.sorted){
        for(var k=1;k<a.length;k++){if(!(a[k]>a[k-1]))throw new Error("Binary search needs the list in increasing order with no repeats. Fix the list, or press “Sort the list”.");}
      }
      steps=cfg.gen(a,x);idx=0;render();
    }catch(e){errEl.textContent=e.message;}
  }
  root.querySelector("[data-load]").addEventListener("click",loadIt);
  root.querySelector(".list").addEventListener("keydown",function(e){if(e.key==="Enter")loadIt();});
  var xin=root.querySelector(".xin");if(xin)xin.addEventListener("keydown",function(e){if(e.key==="Enter")loadIt();});
  var sb=root.querySelector("[data-sort]");
  if(sb)sb.addEventListener("click",function(){
    try{
      var a=parseList(root.querySelector(".list").value,cfg);
      a=a.filter(function(v,i,arr){return arr.indexOf(v)===i;}).sort(function(p,q){return p-q;});
      root.querySelector(".list").value=a.join(", ");loadIt();
    }catch(e){errEl.textContent=e.message;}
  });
  root.querySelector("[data-reset]").addEventListener("click",function(){stop();idx=0;if(steps.length)render();});
  bBack.addEventListener("click",function(){stop();if(idx>0){idx--;render();}});
  bNext.addEventListener("click",function(){stop();if(idx<steps.length-1){idx++;render();}});
  bPlay.addEventListener("click",function(){
    if(timer){stop();return;}
    if(idx===steps.length-1){idx=0;render();}
    bPlay.textContent="Pause";
    timer=setInterval(function(){if(idx<steps.length-1){idx++;render();}else stop();},1100);
  });
  loadIt();
}

/* ---------- greedy lab ---------- */
function runGreedy(){
  var out=$("g-out");
  try{
    var coins=$("g-coins").value.split(/[\s,]+/).filter(Boolean).map(function(p){
      if(!/^\d+$/.test(p)||parseInt(p,10)<1)throw new Error("Coins must be positive whole numbers, like 25, 10, 5, 1.");
      return parseInt(p,10);
    });
    var ns=$("g-n").value.trim();
    if(!/^\d+$/.test(ns))throw new Error("The amount n must be a whole number.");
    var n=parseInt(ns,10);
    if(!coins.length)throw new Error("Enter at least one coin value.");
    if(coins.length>8)throw new Error("Please use at most 8 coin values.");
    if(n>5000)throw new Error("Please use an amount up to 5000.");
    coins=coins.filter(function(v,i,a){return a.indexOf(v)===i;});
    var g=greedyChange(coins,n),o=optimalChange(coins,n);
    var h='<div class="scroll"><table><tr><th>Coin</th><th>How many (d<sub>i</sub>)</th><th>Left after this coin</th></tr><tr><td>start</td><td></td><td>'+n+'</td></tr>';
    g.rows.forEach(function(r){h+="<tr><td>"+r.c+"</td><td>"+r.d+"</td><td>"+r.left+"</td></tr>";});
    h+="</table></div>";
    if(g.left>0){
      h+='<div class="verdict-box v-F">Greedy is stuck with '+g.left+' left over: these coins cannot make exactly '+n+' this way.</div>';
      if(o)h+='<p>An exact answer does exist ('+o.count+' coins), so greedy missed it.</p>';
    }else{
      h+='<p>Greedy uses <b>'+g.total+'</b> coin'+(g.total===1?"":"s")+'.</p>';
      if(o&&o.count<g.total){
        var parts=Object.keys(o.used).sort(function(a,b){return b-a;}).map(function(k){return o.used[k]+" × "+k;}).join(" + ");
        h+='<div class="verdict-box v-F">Greedy is not optimal here. Only '+o.count+' coins are needed: '+parts+'.</div>';
        h+='<p>That is a <b>counterexample</b>: one input where the “best choice each step” idea fails.</p>';
      }else{
        h+='<div class="verdict-box v-T">Greedy is optimal for this input.</div>';
        h+='<p class="small">Optimal for this input does not mean optimal for every input. Try the counterexample buttons.</p>';
      }
    }
    out.innerHTML=h;
  }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+'</div>';}
}

/* ---------- property detective ---------- */
var PROPS=["Input","Output","Correctness","Finiteness","Effectiveness","Definiteness","Generality"];
var DET=[
  {code:"procedure double(n: positive integer)\nwhile n > 0\n    n := 2n",
   ans:"Finiteness",
   ask:"Trace n = 3. What does n become each time round the loop? Will n > 0 ever be false?",
   why:"n only gets bigger, so n > 0 stays true forever. The while loop never ends, so it is not finite."},
  {code:"procedure divide(n: positive integer)\nwhile n ≥ 0\n    m := 1/n\n    n := n − 1",
   ans:"Effectiveness",
   ask:"Trace n = 2, then 1, then 0. What happens to the step m := 1/n when n = 0?",
   why:"The loop condition is n ≥ 0, so n eventually reaches 0, and then m := 1/n cannot be performed. A step that cannot be carried out means it is not effective."},
  {code:"procedure sum(n: positive integer)\nsum := 0\nwhile i < 10\n    sum := sum + i",
   ans:"Definiteness",
   ask:"Look at the while condition. Which variable does it use, and where did that variable get its first value?",
   why:"The variable i is never given a value, so the instruction “while i < 10” has no precise meaning. It lacks definiteness. (It also never changes i inside the loop.)"},
  {code:"procedure choose(a, b: integers)\nx := either a or b",
   ans:"Definiteness",
   ask:"Could two different people follow “either a or b” and get different answers? Is every step precisely defined?",
   why:"The statement does not say whether x is set to a or to b. A step that leaves the choice open is not precisely defined, so it lacks definiteness."}
];
function buildDetective(){
  var box=$("det-list"),tries=[];
  DET.forEach(function(d,i){
    tries[i]=0;
    var el=document.createElement("div");el.className="det";
    el.innerHTML='<b>'+"abcd"[i]+')</b><pre class="code">'+esc(d.code)+'</pre>'+
      '<div class="row"><label for="det'+i+'">Which property is missing?</label><select id="det'+i+'"><option value="">Choose one</option>'+
      PROPS.map(function(p){return "<option>"+p+"</option>";}).join("")+'</select><button class="btn primary" type="button">Check</button></div><div class="out"></div>';
    box.appendChild(el);
    var sel=el.querySelector("select"),out=el.querySelector(".out");
    el.querySelector("button").addEventListener("click",function(){
      if(!sel.value){out.innerHTML='<div class="fb ask">Pick a property first. Make a guess; it is the fastest way to learn.</div>';return;}
      if(sel.value===d.ans){out.innerHTML='<div class="fb ok"><b>Yes: '+d.ans+'.</b> '+d.why+'</div>';return;}
      tries[i]++;
      if(tries[i]<2){out.innerHTML='<div class="fb ask"><b>Not quite.</b> Try this smaller question first: '+d.ask+'</div>';}
      else{out.innerHTML='<div class="fb ask"><b>Still not it.</b> '+d.ask+'<br><button class="btn" type="button" style="margin-top:8px">Show the answer</button></div>';
        out.querySelector("button").addEventListener("click",function(){out.innerHTML='<div class="fb ok"><b>'+d.ans+'.</b> '+d.why+'</div>';});}
    });
  });
}

/* ---------- active recall ---------- */
var recall=[
  ["What is an algorithm?","A finite set of precise instructions for performing a computation or solving a problem."],
  ["Name the six properties listed on your slide.","Input, Output, Correctness, Finiteness, Effectiveness, Generality. (The max example also uses Definiteness: every step is precisely defined.)"],
  ["What does linear search return when x is not in the list?","0. Positions start at 1, so 0 can never be a real position."],
  ["What must be true of the list before you use binary search?","It must be in increasing (sorted) order."],
  ["After the first pass of bubble sort, where is the largest element?","At the end of the list, in its final position."],
  ["Which simpler search does insertion sort use to find where an element goes?","A linear search through the sorted part on the left."],
  ["What is the greedy idea, and does it always give the best answer?","At each step take the best-looking choice (for change: the largest coin that does not exceed what is left). No, it does not always give an optimal answer. Sometimes you must prove it works or find a counterexample."],
  ["Name the three classes of problems in this section.","Searching problems, sorting problems and optimization problems."]
];
function buildRecall(){
  var box=$("recall-list");
  recall.forEach(function(r,i){
    var id="r"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">Recall '+(i+1)+'</span></div><p class="txt">'+r[0]+
      '</p><textarea id="w3-ta-'+id+'" aria-label="Your answer to recall question '+(i+1)+'"></textarea>'+
      '<div class="row"><button class="btn" type="button" disabled>Check my answer</button><span class="small note-r">Type an answer to unlock.</span></div><div class="ans"></div>';
    box.appendChild(d);
    var ta=d.querySelector("textarea"),btn=d.querySelector("button"),ans=d.querySelector(".ans"),nt=d.querySelector(".note-r");
    ta.value=state.recall[id]||"";btn.disabled=ta.value.trim().length<2;
    function show(){ans.innerHTML='<div class="sol"><b>Answer.</b> '+esc(r[1])+'</div>';btn.disabled=true;nt.textContent="Compare with yours. Note anything you missed.";}
    if(state.recallDone[id])show();
    ta.addEventListener("input",function(){state.recall[id]=ta.value;save();if(!state.recallDone[id])btn.disabled=ta.value.trim().length<2;});
    btn.addEventListener("click",function(){state.recallDone[id]=true;save();show();});
  });
}

/* ---------- practice set ---------- */
var errTypes=["I got it right","Concept misunderstanding","Wrong formula or rule","Calculation error","Logical reasoning error","Misread the question","Incomplete solution","Notation issue"];
var P=[
 {l:"Easy",
  q:'Trace the <b>max</b> procedure on the list (4, 9, 2, 7). Write the value of <span class="e">max</span> after each value of <span class="e">i</span>, and the value returned.',
  h:["max starts as a1 = 4. For each i from 2 to 4, ask: is max < ai?","i = 2: is 4 < 9? If true, max becomes 9. Carry the new max forward.","After i = 2 the max is 9. Is 9 < 2? Is 9 < 7?"],
  s:'<pre>start: max = 4\ni = 2: 4 &lt; 9 true  → max = 9\ni = 3: 9 &lt; 2 false → max = 9\ni = 4: 9 &lt; 7 false → max = 9\nreturn 9</pre>'},
 {l:"Easy",
  q:'Run <b>linear search</b> for x = 5 in the list (3, 7, 1, 9). Write the value of <span class="e">i</span> at each loop check and the final <span class="e">location</span>.',
  h:["The loop continues while i ≤ n and x ≠ ai. Here n = 4.","Check i = 1, then 2, then 3, then 4. Does 5 equal any of 3, 7, 1, 9?","After i = 4 the loop adds 1 more. What is i then, and is i ≤ n?"],
  s:'<pre>i = 1: 5 ≠ 3 → i := 2\ni = 2: 5 ≠ 7 → i := 3\ni = 3: 5 ≠ 1 → i := 4\ni = 4: 5 ≠ 9 → i := 5\ni = 5: i ≤ n is false → loop ends\ni ≤ n is false, so location := 0\nreturn 0 (not found)</pre>'},
 {l:"Easy",
  q:'Write pseudocode for a procedure <b>min</b>(a<sub>1</sub>, …, a<sub>n</sub>: integers) that finds the smallest element, using a <b>for</b> loop.',
  h:["Start from the max procedure. What do you assign to min at the start?","The structure is identical. Only one thing flips: the comparison.","Use: if min > ai then min := ai."],
  s:'<pre><b>procedure</b> min(a1, a2, …, an: integers)\nmin := a1\n<b>for</b> i := 2 <b>to</b> n\n    <b>if</b> min &gt; ai <b>then</b> min := ai\n<b>return</b> min {min is the smallest element}</pre>'},
 {l:"Medium",
  q:'Class activity from your slides: list all the steps used to search for <b>9</b> in the sequence 1, 3, 4, 5, 6, 8, 9, 11 using (a) a linear search and (b) a binary search. For (b) write i, j and m each time round the loop.',
  h:["(a) Check 1, 3, 4, 5, 6, 8 (all not equal to 9), then 9. What position is that?","(b) n = 8, so start with i = 1, j = 8 and m = ⌊(1 + 8)/2⌋ = 4. What is a4? Compare 9 with it.","(b) a4 = 5 and 9 > 5, so i := 5. Now m = ⌊(5 + 8)/2⌋. Continue until i = j."],
  s:'<pre>(a) i = 1 … 7: x ≠ ai is true for 1,3,4,5,6,8; at i = 7, a7 = 9 so the loop stops.\n    location = 7 (7 comparisons)\n\n(b) i = 1, j = 8: m = 4, a4 = 5, 9 &gt; 5 true  → i = 5\n    i = 5, j = 8: m = 6, a6 = 8, 9 &gt; 8 true  → i = 7\n    i = 7, j = 8: m = 7, a7 = 9, 9 &gt; 9 false → j = 7\n    i = j = 7: loop ends; x = a7 so location = 7</pre>Binary search needed 3 rounds; linear search needed 7 comparisons.'},
 {l:"Medium",
  q:'Use <b>bubble sort</b> on (5, 1, 4, 2). Write the list after each of the passes i = 1, 2, 3. Mark every interchange in pass 1.',
  h:["n = 4, so there are 3 passes. In pass i the inner loop compares j = 1 up to n − i.","Pass 1 compares (5,1), (5,4), (5,2). The 5 swaps all the way right.","After pass 1: 1 4 2 5. Now do pass 2 on the first three elements only."],
  s:'<pre>Pass 1: (5,1) swap → 1 5 4 2\n        (5,4) swap → 1 4 5 2\n        (5,2) swap → 1 4 2 5\nPass 2: (1,4) ok; (4,2) swap → 1 2 4 5\nPass 3: (1,2) ok → 1 2 4 5</pre>The list was already sorted after pass 2, but the algorithm still performs pass 3.'},
 {l:"Medium",
  q:'Use <b>insertion sort</b> on (4, 3, 2, 10). Write the list after each value of j = 2, 3, 4, and say which values of j needed no shifting.',
  h:["The sorted section starts as just a1. For j = 2 insert a2 = 3 into (4).","After j = 2: 3 4 2 10. Now insert a3 = 2 into (3, 4).","For j = 4, compare 10 with each sorted element. Is 10 bigger than all of them?"],
  s:'<pre>j = 2: insert 3 → 3 4 2 10\nj = 3: insert 2 → 2 3 4 10\nj = 4: 10 is bigger than 2, 3 and 4 → 2 3 4 10 (no shifting)</pre>'},
 {l:"Medium",
  q:'Use the <b>greedy change-making algorithm</b> with quarters (25), dimes (10), nickels (5) and pennies (1) to make 89 cents. Give d<sub>1</sub>, d<sub>2</sub>, d<sub>3</sub>, d<sub>4</sub> and the total number of coins.',
  h:["Take as many 25s as you can first. How many fit in 89, and what is left?","3 quarters = 75, leaving 14. How many dimes fit in 14?","One dime leaves 4. How many nickels fit in 4? Then pennies."],
  s:'<pre>89 → 3 quarters (75), left 14\n14 → 1 dime (10),     left 4\n 4 → 0 nickels,        left 4\n 4 → 4 pennies,        left 0\n(d1, d2, d3, d4) = (3, 1, 0, 4); total = 8 coins</pre>'},
 {l:"Challenging",
  q:'Change the <b>max</b> procedure so that it returns the <b>position</b> of the largest element (the first position if it appears more than once). Write the pseudocode and trace it on (3, 9, 2, 9).',
  h:["You need a second variable that remembers where the best value is. Call it pos.","Whenever you update max, also update pos. Start with pos := 1.","The comparison uses strict <. What does that mean for the second 9?"],
  s:'<pre><b>procedure</b> maxpos(a1, …, an: integers)\nmax := a1\npos := 1\n<b>for</b> i := 2 <b>to</b> n\n    <b>if</b> max &lt; ai <b>then</b>\n        max := ai\n        pos := i\n<b>return</b> pos\n\nTrace (3, 9, 2, 9):\ni = 2: 3 &lt; 9 true  → max = 9, pos = 2\ni = 3: 9 &lt; 2 false\ni = 4: 9 &lt; 9 false (strict) → pos stays 2\nreturn 2</pre>'},
 {l:"Challenging",
  q:'Greedy change with coins 4, 3 and 1, making n = 6. What does greedy give? Is there a better answer? What does this tell you about greedy algorithms?',
  h:["First run greedy: take the largest coin that fits, repeat.","Greedy takes 4, leaving 2, then pennies. Count the coins.","Can you make 6 using only 3s? Compare the coin counts."],
  s:'Greedy: 4 + 1 + 1 = <b>3 coins</b>. But 3 + 3 = <b>2 coins</b>. So greedy is not optimal here: this input is a <b>counterexample</b>. Greedy often works (for example with the US coins), but you cannot assume it. You must prove it works or find a counterexample.'},
 {l:"Challenging",
  q:'The slide example searched a sorted list of 16 elements with binary search and the loop ran 4 times. Explain in your own words why a sorted list of 1,000 elements needs only about 10 rounds, and compare with linear search.',
  h:["What happens to the size of the search interval each time round the loop?","The interval is cut roughly in half each round. How many halvings take 1000 down to 1?","2 to the power 10 is 1024. Linear search could need up to 1000 comparisons."],
  s:'Each round of binary search throws away about half of the remaining candidates (1000 → 500 → 250 → … → 1). Because 2<sup>10</sup> = 1024 ≥ 1000, about 10 rounds are enough. Linear search may have to check all 1000 elements. The price of binary search: the list must already be sorted.'}
];
function updateProg(){
  var n=0;P.forEach(function(_,i){if((state.attempts["p"+i]||"").trim().length>=4)n++;});
  $("prog-txt").textContent="Practice: "+n+" of 10 attempted";
  $("prog-bar").style.width=(n*10)+"%";
}
function buildPractice(){
  var box=$("practice-list");
  P.forEach(function(p,i){
    var id="p"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">'+p.l+'</span><b>Question '+(i+1)+'</b></div>'+
     '<p class="txt">'+p.q+'</p>'+
     '<textarea id="w3-ta-'+id+'" aria-label="Your attempt for question '+(i+1)+'" placeholder="Write your attempt here."></textarea>'+
     '<div class="row"><button class="btn" type="button" data-h="1">Hint 1</button><button class="btn" type="button" data-h="2" disabled>Hint 2</button><button class="btn" type="button" data-h="3" disabled>Hint 3</button>'+
     '<button class="btn primary" type="button" data-sol disabled>Show solution</button><span class="small" data-note>Write an attempt to unlock the solution.</span></div>'+
     '<div data-hints></div><div data-sol-box></div>';
    box.appendChild(d);
    var ta=d.querySelector("textarea"),hb=d.querySelector("[data-hints]"),sb=d.querySelector("[data-sol-box]"),sol=d.querySelector("[data-sol]"),note=d.querySelector("[data-note]"),hbtn=d.querySelectorAll("[data-h]");
    ta.value=state.attempts[id]||"";
    function gate(){var ok=ta.value.trim().length>=4;sol.disabled=!ok||!!state.revealed[id];if(!state.revealed[id])note.textContent=ok?"You can reveal the solution now.":"Write an attempt to unlock the solution.";}
    function renderHints(){
      var n=state.hints[id]||0,h="";
      for(var k=0;k<n;k++)h+='<div class="hint"><b>Hint '+(k+1)+'.</b> '+p.h[k]+'</div>';
      hb.innerHTML=h;hbtn.forEach(function(b,k){b.disabled=(k+1)!==n+1;});
    }
    function renderSol(){
      var opts=errTypes.map(function(t){return "<option"+(state.errors[id]===t?" selected":"")+">"+t+"</option>";}).join("");
      sb.innerHTML='<div class="sol"><b>Solution.</b><br>'+p.s+'</div><p class="small" style="margin-top:10px"><label>How did your attempt go? <select data-err><option value="">Choose one</option>'+opts+'</select></label></p>';
      sb.querySelector("[data-err]").addEventListener("change",function(e){state.errors[id]=e.target.value;save();});
      note.textContent="Compare with your attempt, then classify it.";sol.disabled=true;
    }
    ta.addEventListener("input",function(){state.attempts[id]=ta.value;save();gate();updateProg();});
    hbtn.forEach(function(b){b.addEventListener("click",function(){var k=+b.getAttribute("data-h");state.hints[id]=Math.max(state.hints[id]||0,k);save();renderHints();});});
    sol.addEventListener("click",function(){state.revealed[id]=true;save();renderSol();});
    renderHints();gate();if(state.revealed[id])renderSol();
  });
  updateProg();
}

/* ---------- checkpoint ---------- */
var objectives=[
  "Defining an algorithm and listing its properties",
  "Reading and writing pseudocode (for, while, if)",
  "Tracing max, linear search and binary search",
  "Tracing bubble sort and insertion sort",
  "Greedy change-making, and when greedy fails",
  "Checking which property a procedure lacks"
];
function buildCheckpoint(){
  var box=$("objs");
  objectives.forEach(function(o,i){
    var d=document.createElement("div");d.className="o";
    d.innerHTML='<span>'+o+'</span><select aria-label="Rating for '+o+'"><option value="">Rate it</option><option>Confident</option><option>Needs review</option><option>Weak</option></select>';
    var sel=d.querySelector("select");sel.value=state.ratings[i]||"";
    sel.addEventListener("change",function(){state.ratings[i]=sel.value;save();});
    box.appendChild(d);
  });
  $("cp-build").addEventListener("click",function(){
    var att=0,rec=0,tally={};
    P.forEach(function(_,i){if((state.attempts["p"+i]||"").trim().length>=4)att++;var e=state.errors["p"+i];if(e&&e!=="I got it right")tally[e]=(tally[e]||0)+1;});
    recall.forEach(function(_,i){if(state.recallDone["r"+i])rec++;});
    var conf=[],rev=[],weak=[];
    objectives.forEach(function(o,i){var r=state.ratings[i];if(r==="Confident")conf.push(o);else if(r==="Needs review")rev.push(o);else if(r==="Weak")weak.push(o);});
    var next=weak.concat(rev).slice(0,3),tk=Object.keys(tally);
    var h="<h3>Your checkpoint</h3><ul><li>Active recall checked: "+rec+" of "+recall.length+".</li><li>Practice attempted: "+att+" of 10.</li><li>Mistake types you logged: "+(tk.length?tk.map(function(k){return k+" ("+tally[k]+")";}).join(", "):"none yet")+".</li></ul>";
    h+="<p><b>Confident:</b> "+(conf.length?conf.join("; "):"none rated yet")+".</p><p><b>Needs review:</b> "+(rev.length?rev.join("; "):"none")+".</p><p><b>Weak:</b> "+(weak.length?weak.join("; "):"none")+".</p>";
    h+="<p><b>Revisit next:</b> "+(next.length?next.join("; "):"rate your objectives to get a list")+".</p><p class=\"small\">Bring this summary back to me and we will plan the next session around it.</p>";
    $("cp-out").innerHTML=h;
  });
  $("cp-reset").addEventListener("click",function(){
    if(!window.confirm("Clear all your answers, hints and ratings on this page?"))return;
    try{localStorage.removeItem(KEY);}catch(e){}
    location.reload();
  });
}

/* ---------- start ---------- */
function init(){
  load();
  Array.prototype.forEach.call(document.querySelectorAll("[data-algo]"),makePlayer);
  $("g-run").addEventListener("click",runGreedy);
  Array.prototype.forEach.call(document.querySelectorAll("[data-gpreset]"),function(b){
    b.addEventListener("click",function(){var p=b.getAttribute("data-gpreset").split("|");$("g-coins").value=p[0];$("g-n").value=p[1];runGreedy();});
  });
  runGreedy();
  buildDetective();buildRecall();buildPractice();buildCheckpoint();
}
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",init);else init();

})();


/* =====================================================
   PART 3: WEEKS 4 AND 5 (RELATIONS)
   Helpers, Week 4 tools, Week 5 tools, shared study kit
   ===================================================== */
(function(){
"use strict";

/* ---------- pure helpers ---------- */
function uniq(a){var s={},o=[];a.forEach(function(x){if(!s[x]){s[x]=1;o.push(x);}});return o;}
function parseElems(str){return uniq(str.split(/[\s,{}]+/).filter(Boolean));}
function parsePairs(str){
  var re=/\(\s*([^,()\s]+)\s*,\s*([^,()\s]+)\s*\)/g,m,out=[],seen={};
  while((m=re.exec(str))){var k=m[1]+"\u0001"+m[2];if(!seen[k]){seen[k]=1;out.push([m[1],m[2]]);}}
  var rest=str.replace(re,"").replace(/[\s,{}]/g,"");
  if(rest.length)throw new Error('I could not read "'+rest.slice(0,12)+'". Write pairs like (1,2), (2,3).');
  return out;
}
function pset(R){var s={};R.forEach(function(p){s[p[0]+"\u0001"+p[1]]=1;});return s;}
function fmt(p){return "("+p[0]+", "+p[1]+")";}
function fmtSet(R){return R.length?"{"+R.map(fmt).join(", ")+"}":"∅";}
function esc(s){return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function checkInside(A,R){
  var inA={};A.forEach(function(a){inA[a]=1;});
  R.forEach(function(p){
    [p[0],p[1]].forEach(function(x){if(!inA[x])throw new Error('The element "'+x+'" in '+fmt(p)+' is not in the set A. Add it to A, or remove the pair.');});
  });
}
function relProps(A,R){
  var s=pset(R),has=function(x,y){return !!s[x+"\u0001"+y];};
  var missing=A.filter(function(a){return !has(a,a);});
  var symW=null,antiW=null,trW=null;
  R.some(function(p){if(!has(p[1],p[0])){symW=p;return true;}return false;});
  R.some(function(p){if(p[0]!==p[1]&&has(p[1],p[0])){antiW=p;return true;}return false;});
  R.some(function(p){return R.some(function(q){if(p[1]===q[0]&&!has(p[0],q[1])){trW=[p[0],p[1],q[1]];return true;}return false;});});
  return {refl:{ok:missing.length===0,missing:missing},sym:{ok:!symW,w:symW},anti:{ok:!antiW,w:antiW},trans:{ok:!trW,w:trW}};
}
function classesOf(A,R){
  var s=pset(R),seen={},out=[];
  A.forEach(function(a){
    var c=A.filter(function(x){return !!s[a+"\u0001"+x];}),k=c.join("\u0002");
    if(!seen[k]){seen[k]=1;out.push({rep:a,set:c});}
  });
  return out;
}
function combine(R1,R2){
  var s1=pset(R1),s2=pset(R2);
  return {
    union:uniq(R1.concat(R2).map(function(p){return p.join("\u0001");})).map(function(k){return k.split("\u0001");}),
    inter:R1.filter(function(p){return s2[p.join("\u0001")];}),
    d12:R1.filter(function(p){return !s2[p.join("\u0001")];}),
    d21:R2.filter(function(p){return !s1[p.join("\u0001")];})
  };
}
function compose(R1,R2){
  var out=[],seen={},steps=[];
  R1.forEach(function(p){R2.forEach(function(q){
    if(p[1]===q[0]){
      steps.push({p:p,q:q,r:[p[0],q[1]]});
      var k=p[0]+"\u0001"+q[1];if(!seen[k]){seen[k]=1;out.push([p[0],q[1]]);}
    }
  });});
  return {pairs:out,steps:steps};
}
function checkPartition(S,blocks){
  var inS={};S.forEach(function(x){inS[x]=1;});
  var empty=blocks.some(function(b){return b.length===0;});
  var outside=uniq([].concat.apply([],blocks).filter(function(x){return !inS[x];}));
  var count={},overlap=[];
  blocks.forEach(function(b){b.forEach(function(x){count[x]=(count[x]||0)+1;});});
  Object.keys(count).forEach(function(x){if(count[x]>1)overlap.push(x);});
  var missing=S.filter(function(x){return !count[x];});
  return {nonempty:!empty,disjoint:overlap.length===0,overlap:overlap,union:missing.length===0&&outside.length===0,missing:missing,outside:outside,
          ok:!empty&&overlap.length===0&&missing.length===0&&outside.length===0};
}

/* test hook */
if(typeof module!=="undefined"&&module.exports){
  module.exports.rel={parseElems:parseElems,parsePairs:parsePairs,relProps:relProps,classesOf:classesOf,combine:combine,compose:compose,checkPartition:checkPartition};
}
if(typeof document==="undefined"||!document.getElementById){return;}

function $(id){return document.getElementById(id);}

/* ---------- property panel (shared by weeks 4 and 5) ---------- */
function row(name,ok,why){
  return '<div class="prow"><span class="pname">'+name+'</span><span class="ptag '+(ok?"v-T":"v-F")+'">'+(ok?"yes":"no")+'</span><span class="pwhy">'+why+'</span></div>';
}
function propsHtml(A,R){
  var P=relProps(A,R),h="",w;
  h+=row("Reflexive",P.refl.ok,P.refl.ok?"Every element has a loop: "+esc(A.map(function(a){return fmt([a,a]);}).join(", "))+".":"Missing "+esc(P.refl.missing.map(function(a){return fmt([a,a]);}).join(", "))+".");
  w=P.sym.w;
  h+=row("Symmetric",P.sym.ok,P.sym.ok?(R.length?"Every pair has its reverse.":"There are no pairs, so nothing can break it (vacuously true)."):esc(fmt(w))+" is in R but "+esc(fmt([w[1],w[0]]))+" is not.");
  w=P.anti.w;
  h+=row("Antisymmetric",P.anti.ok,P.anti.ok?"No pair with x ≠ y has its reverse in R.":esc(fmt(w))+" and "+esc(fmt([w[1],w[0]]))+" are both in R, and "+esc(w[0])+" ≠ "+esc(w[1])+".");
  w=P.trans.w;
  h+=row("Transitive",P.trans.ok,P.trans.ok?(R.length?"Every chain (x, y), (y, z) has its shortcut (x, z).":"There are no chains, so nothing can break it (vacuously true)."):esc(fmt([w[0],w[1]]))+" and "+esc(fmt([w[1],w[2]]))+" are in R, but "+esc(fmt([w[0],w[2]]))+" is not.");
  return h;
}

/* ===================== WEEK 4 ===================== */
function initWeek4(){
  var n=4,cells={},grid=$("w4-ex-grid");
  function elems(){var a=[];for(var i=1;i<=n;i++)a.push(String(i));return a;}
  function listPairs(){
    var out=[],A=elems();
    A.forEach(function(x){A.forEach(function(y){if(cells[x+"\u0001"+y])out.push([x,y]);});});
    return out;
  }
  function build(){
    var A=elems(),h="<tr><th></th>"+A.map(function(y){return "<th>"+y+"</th>";}).join("")+"</tr>";
    A.forEach(function(x){
      h+="<tr><th>"+x+"</th>"+A.map(function(y){
        var on=!!cells[x+"\u0001"+y];
        return '<td class="'+(x===y?"diag":"")+'"><button type="button" class="gcell" data-x="'+x+'" data-y="'+y+'" aria-pressed="'+on+'" aria-label="Pair ('+x+', '+y+')">'+(on?"×":"")+'</button></td>';
      }).join("")+"</tr>";
    });
    grid.innerHTML=h;
    var R=listPairs();
    $("w4-ex-pairs").textContent=fmtSet(R);
    $("w4-ex-props").innerHTML=propsHtml(A,R);
    Array.prototype.forEach.call(document.querySelectorAll("[data-w4n]"),function(b){b.setAttribute("aria-pressed",b.getAttribute("data-w4n")===String(n));});
  }
  function setPreset(name){
    var A,f;
    if(name==="symm"){n=3;cells={};[[1,2],[2,1],[3,2],[2,3]].forEach(function(p){cells[p[0]+"\u0001"+p[1]]=true;});build();return;}
    if(name==="empty"){cells={};build();return;}
    f={divides:function(a,b){return b%a===0;},leq:function(a,b){return a<=b;},lt:function(a,b){return a<b;},eq:function(a,b){return a===b;}}[name];
    cells={};
    for(var a=1;a<=n;a++)for(var b=1;b<=n;b++)if(f(a,b))cells[a+"\u0001"+b]=true;
    build();
  }
  grid.addEventListener("click",function(e){
    var b=e.target.closest(".gcell");if(!b)return;
    var k=b.getAttribute("data-x")+"\u0001"+b.getAttribute("data-y");
    if(cells[k])delete cells[k];else cells[k]=true;
    build();
    var again=grid.querySelector('[data-x="'+b.getAttribute("data-x")+'"][data-y="'+b.getAttribute("data-y")+'"]');if(again)again.focus();
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-w4n]"),function(b){
    b.addEventListener("click",function(){
      n=parseInt(b.getAttribute("data-w4n"),10);
      Object.keys(cells).forEach(function(k){var p=k.split("\u0001");if(+p[0]>n||+p[1]>n)delete cells[k];});
      build();
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-w4preset]"),function(b){
    b.addEventListener("click",function(){setPreset(b.getAttribute("data-w4preset"));});
  });
  setPreset("divides");

  /* combine */
  function renderCombine(){
    var out=$("w4-combine-out");
    try{
      var R1=parsePairs($("w4-c1").value),R2=parsePairs($("w4-c2").value),c=combine(R1,R2);
      out.innerHTML='<div class="calc"><div><b>R<sub>1</sub> ∪ R<sub>2</sub></b> = '+esc(fmtSet(c.union))+'</div><div><b>R<sub>1</sub> ∩ R<sub>2</sub></b> = '+esc(fmtSet(c.inter))+'</div><div><b>R<sub>1</sub> − R<sub>2</sub></b> = '+esc(fmtSet(c.d12))+'</div><div><b>R<sub>2</sub> − R<sub>1</sub></b> = '+esc(fmtSet(c.d21))+'</div></div>';
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+'</div>';}
  }
  $("w4-c1").addEventListener("input",renderCombine);$("w4-c2").addEventListener("input",renderCombine);renderCombine();

  /* compose */
  function renderCompose(){
    var out=$("w4-compose-out");
    try{
      var R1=parsePairs($("w4-k1").value),R2=parsePairs($("w4-k2").value),c=compose(R1,R2);
      var h='<div class="calc"><div><b>R<sub>2</sub> ∘ R<sub>1</sub></b> = '+esc(fmtSet(c.pairs))+'</div></div>';
      if(c.steps.length){
        h+='<div class="scroll"><table><tr><th>Pair in R<sub>1</sub></th><th>Pair in R<sub>2</sub></th><th>Gives (x, z)</th></tr>'+
          c.steps.map(function(s){return "<tr><td>"+esc(fmt(s.p))+"</td><td>"+esc(fmt(s.q))+"</td><td>"+esc(fmt(s.r))+"</td></tr>";}).join("")+"</table></div>";
      }else h+='<p class="small">No pair of R<sub>1</sub> ends where a pair of R<sub>2</sub> begins, so the composition is empty.</p>';
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+'</div>';}
  }
  $("w4-k1").addEventListener("input",renderCompose);$("w4-k2").addEventListener("input",renderCompose);renderCompose();
}

/* ===================== WEEK 5 ===================== */
function matrixHtml(A,R){
  var s=pset(R);
  var h='<table class="mx"><tr><th>M<sub>R</sub></th>'+A.map(function(b){return "<th>"+esc(b)+"</th>";}).join("")+"</tr>";
  A.forEach(function(a){h+="<tr><th>"+esc(a)+"</th>"+A.map(function(b){var one=s[a+"\u0001"+b];return '<td class="'+(one?"one":"zero")+'">'+(one?1:0)+"</td>";}).join("")+"</tr>";});
  return h+"</table>";
}
function f1(v){return Math.round(v*10)/10;}
function arrowHead(x,y,dx,dy){
  var len=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/len,uy=dy/len,L=10,Wd=4.2;
  return '<polygon points="'+f1(x)+","+f1(y)+" "+f1(x-ux*L+uy*Wd)+","+f1(y-uy*L-ux*Wd)+" "+f1(x-ux*L-uy*Wd)+","+f1(y-uy*L+ux*Wd)+'" class="dg-arrowhead"/>';
}

function digraphSvg(V,E){
  var W=340,H=300,cx=W/2,cy=H/2,n=V.length,NR=16,pos={};
  var Rad=n<=1?0:Math.min(112,34+n*20);
  V.forEach(function(v,i){var ang=-Math.PI/2+2*Math.PI*i/Math.max(n,1);pos[v]={x:cx+Rad*Math.cos(ang),y:cy+Rad*Math.sin(ang),ux:n===1?0:Math.cos(ang),uy:n===1?-1:Math.sin(ang)};});
  var s=pset(E);
  var h='<svg class="dg" viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Digraph of the relation">';
  E.forEach(function(e){
    var a=pos[e[0]],b=pos[e[1]];
    if(e[0]===e[1]){h+='<circle cx="'+f1(a.x+a.ux*(NR+5))+'" cy="'+f1(a.y+a.uy*(NR+5))+'" r="10" class="dg-edge"/>';return;}
    var dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/len,uy=dy/len,x1,y1,x2,y2;
    if(s[e[1]+"\u0001"+e[0]]){
      var mx=(a.x+b.x)/2-uy*26,my=(a.y+b.y)/2+ux*26;
      var sx=mx-a.x,sy=my-a.y,sl=Math.sqrt(sx*sx+sy*sy)||1,ex=mx-b.x,ey=my-b.y,el=Math.sqrt(ex*ex+ey*ey)||1;
      x1=a.x+sx/sl*NR;y1=a.y+sy/sl*NR;x2=b.x+ex/el*(NR+2);y2=b.y+ey/el*(NR+2);
      h+='<path d="M'+f1(x1)+' '+f1(y1)+' Q'+f1(mx)+' '+f1(my)+' '+f1(x2)+' '+f1(y2)+'" class="dg-edge"/>'+arrowHead(x2,y2,x2-mx,y2-my);
    }else{
      x1=a.x+ux*NR;y1=a.y+uy*NR;x2=b.x-ux*(NR+2);y2=b.y-uy*(NR+2);
      h+='<path d="M'+f1(x1)+' '+f1(y1)+' L'+f1(x2)+' '+f1(y2)+'" class="dg-edge"/>'+arrowHead(x2,y2,x2-x1,y2-y1);
    }
  });
  V.forEach(function(v){var p=pos[v];h+='<circle cx="'+f1(p.x)+'" cy="'+f1(p.y)+'" r="'+NR+'" class="dg-node"/><text x="'+f1(p.x)+'" y="'+f1(p.y+5)+'" text-anchor="middle" class="dg-label">'+esc(v)+'</text>';});
  return h+"</svg>";
}

function initWeek5(){
  var PRESETS={
    slide1:{A:"a, b, c, d",R:"(a,b), (a,d), (b,b), (b,d), (c,a), (c,b), (d,b)"},
    slide2:{A:"1, 2, 3, 4",R:"(1,3), (1,4), (2,1), (2,2), (2,3), (3,1), (3,3), (4,1), (4,3)"},
    slide3:{A:"1, 2, 3",R:"(1,1), (1,2), (2,1), (2,2), (2,3), (3,2), (3,3)"},
    mod3:{A:"1, 2, 3, 4, 5, 6",R:"(1,1), (1,4), (4,1), (4,4), (2,2), (2,5), (5,2), (5,5), (3,3), (3,6), (6,3), (6,6)"},
    divides:{A:"1, 2, 3, 4",R:"(1,1), (1,2), (1,3), (1,4), (2,2), (2,4), (3,3), (4,4)"}
  };
  function renderViews(){
    var err=$("w5-tv-err");err.textContent="";
    try{
      var A=parseElems($("w5-tv-set").value);
      if(!A.length)throw new Error("Type the elements of the set A first.");
      if(A.length>8)throw new Error("Please use at most 8 elements so the drawing stays readable.");
      var R=parsePairs($("w5-tv-pairs").value);checkInside(A,R);
      $("w5-tv-matrix").innerHTML=matrixHtml(A,R);
      $("w5-tv-graph").innerHTML=digraphSvg(A,R);
      $("w5-tv-props").innerHTML=propsHtml(A,R);
      var P=relProps(A,R),eq=$("w5-tv-equiv");
      if(P.refl.ok&&P.sym.ok&&P.trans.ok){
        var cl=classesOf(A,R);
        eq.innerHTML='<div class="verdict-box v-T">Equivalence relation: reflexive, symmetric and transitive.</div><p>Equivalence classes: '+cl.map(function(c){return "<span class=\"e\">["+esc(c.rep)+"] = {"+c.set.map(esc).join(", ")+"}</span>";}).join("; ")+".</p>";
      }else{
        var bad=[];if(!P.refl.ok)bad.push("reflexive");if(!P.sym.ok)bad.push("symmetric");if(!P.trans.ok)bad.push("transitive");
        eq.innerHTML='<div class="verdict-box v-F">Not an equivalence relation. Fails: '+bad.join(", ")+".</div>";
      }
    }catch(e){err.textContent=e.message;}
  }
  $("w5-tv-set").addEventListener("input",renderViews);$("w5-tv-pairs").addEventListener("input",renderViews);
  Array.prototype.forEach.call(document.querySelectorAll("[data-w5preset]"),function(b){
    b.addEventListener("click",function(){var p=PRESETS[b.getAttribute("data-w5preset")];$("w5-tv-set").value=p.A;$("w5-tv-pairs").value=p.R;renderViews();});
  });
  renderViews();

  /* matrix to pairs */
  function renderMx(){
    var out=$("w5-mx-out");
    try{
      var A=parseElems($("w5-mx-a").value),B=parseElems($("w5-mx-b").value);
      var rows=$("w5-mx-text").value.split(/\n|\//).map(function(r){return r.trim();}).filter(Boolean).map(function(r){return r.split(/[\s,]+/).filter(Boolean);});
      if(rows.length!==A.length)throw new Error("The matrix has "+rows.length+" row(s) but A has "+A.length+" element(s). They must match.");
      var pairs=[];
      rows.forEach(function(r,i){
        if(r.length!==B.length)throw new Error("Row "+(i+1)+" has "+r.length+" entries but B has "+B.length+" element(s).");
        r.forEach(function(v,j){
          if(v!=="0"&&v!=="1")throw new Error('Entries must be 0 or 1, but row '+(i+1)+' has "'+v+'".');
          if(v==="1")pairs.push([A[i],B[j]]);
        });
      });
      out.innerHTML='<div class="calc"><div><b>R</b> = '+esc(fmtSet(pairs))+'</div></div><p class="small">Each 1 in row i, column j gives the pair (a<sub>i</sub>, b<sub>j</sub>).</p>';
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+'</div>';}
  }
  ["w5-mx-a","w5-mx-b","w5-mx-text"].forEach(function(id){$(id).addEventListener("input",renderMx);});
  renderMx();

  /* partition checker */
  function renderPt(){
    var out=$("w5-pt-out");
    try{
      var S=parseElems($("w5-pt-set").value);
      var txt=$("w5-pt-blocks").value,blocks=[],re=/\{([^{}]*)\}/g,m;
      while((m=re.exec(txt)))blocks.push(parseElems(m[1]));
      var rest=txt.replace(re,"").replace(/[\s,]/g,"");
      if(rest.length)throw new Error('I could not read "'+rest.slice(0,10)+'". Write the collection like {1, 2}, {3, 4}.');
      if(!S.length)throw new Error("Type the elements of S first.");
      if(!blocks.length)throw new Error("Type at least one subset in braces, like {1, 2}.");
      var c=checkPartition(S,blocks),h="";
      function line(ok,t){return '<div class="prow"><span class="ptag '+(ok?"v-T":"v-F")+'">'+(ok?"pass":"fail")+'</span><span class="pwhy">'+t+'</span></div>';}
      h+=line(c.nonempty,c.nonempty?"Every subset is nonempty.":"One of the subsets is empty (∅). A partition needs nonempty subsets.");
      h+=line(c.disjoint,c.disjoint?"The subsets are pairwise disjoint.":"These elements appear in more than one subset: "+esc(c.overlap.join(", "))+".");
      var ut=[];if(c.missing.length)ut.push("missing from the union: "+esc(c.missing.join(", ")));if(c.outside.length)ut.push("not in S: "+esc(c.outside.join(", ")));
      h+=line(c.union,c.union?"The union of the subsets is exactly S.":"The union is not S ("+ut.join("; ")+").");
      h+=c.ok?'<div class="verdict-box v-T">This collection is a partition of S.</div>':'<div class="verdict-box v-F">This collection is not a partition of S.</div>';
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+'</div>';}
  }
  $("w5-pt-set").addEventListener("input",renderPt);$("w5-pt-blocks").addEventListener("input",renderPt);renderPt();
}

/* ===================== STUDY KIT (recall, practice, checkpoint) ===================== */
var errTypes=["I got it right","Concept misunderstanding","Wrong formula or rule","Calculation error","Logical reasoning error","Misread the question","Incomplete solution","Notation issue"];
function buildKit(n,cfg){
  var P="w"+n+"-",st={attempts:{},hints:{},revealed:{},errors:{},recall:{},recallDone:{},ratings:{}};
  try{var sv=localStorage.getItem(cfg.key);if(sv){var o=JSON.parse(sv);for(var k in st){if(o&&o[k])st[k]=o[k];}}}catch(e){}
  function save(){try{localStorage.setItem(cfg.key,JSON.stringify(st));}catch(e){}}
  function prog(){
    var c=0;cfg.practice.forEach(function(_,i){if((st.attempts["p"+i]||"").trim().length>=4)c++;});
    $(P+"prog-txt").textContent="Practice: "+c+" of "+cfg.practice.length+" attempted";
    $(P+"prog-bar").style.width=(c*100/cfg.practice.length)+"%";
  }
  /* recall */
  cfg.recall.forEach(function(r,i){
    var id="r"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">Recall '+(i+1)+'</span></div><p class="txt">'+r[0]+'</p><textarea id="'+P+'ta-'+id+'" aria-label="Your answer to recall question '+(i+1)+'"></textarea><div class="row"><button class="btn" type="button" disabled>Check my answer</button><span class="small note-r">Type an answer to unlock.</span></div><div class="ans"></div>';
    $(P+"recall-list").appendChild(d);
    var ta=d.querySelector("textarea"),btn=d.querySelector("button"),ans=d.querySelector(".ans"),nt=d.querySelector(".note-r");
    ta.value=st.recall[id]||"";btn.disabled=ta.value.trim().length<2;
    function show(){ans.innerHTML='<div class="sol"><b>Answer.</b> '+r[1]+'</div>';btn.disabled=true;nt.textContent="Compare with yours. Note anything you missed.";}
    if(st.recallDone[id])show();
    ta.addEventListener("input",function(){st.recall[id]=ta.value;save();if(!st.recallDone[id])btn.disabled=ta.value.trim().length<2;});
    btn.addEventListener("click",function(){st.recallDone[id]=true;save();show();});
  });
  /* practice */
  cfg.practice.forEach(function(p,i){
    var id="p"+i,d=document.createElement("div");d.className="q";
    d.innerHTML='<div class="top"><span class="lvl">'+p.l+'</span><b>Question '+(i+1)+'</b></div><p class="txt">'+p.q+'</p><textarea id="'+P+'ta-'+id+'" aria-label="Your attempt for question '+(i+1)+'" placeholder="Write your attempt here."></textarea><div class="row"><button class="btn" type="button" data-h="1">Hint 1</button><button class="btn" type="button" data-h="2" disabled>Hint 2</button><button class="btn" type="button" data-h="3" disabled>Hint 3</button><button class="btn primary" type="button" data-sol disabled>Show solution</button><span class="small" data-note>Write an attempt to unlock the solution.</span></div><div data-hints></div><div data-sol-box></div>';
    $(P+"practice-list").appendChild(d);
    var ta=d.querySelector("textarea"),hb=d.querySelector("[data-hints]"),sb=d.querySelector("[data-sol-box]"),sol=d.querySelector("[data-sol]"),note=d.querySelector("[data-note]"),hbtn=d.querySelectorAll("[data-h]");
    ta.value=st.attempts[id]||"";
    function gate(){var ok=ta.value.trim().length>=4;sol.disabled=!ok||!!st.revealed[id];if(!st.revealed[id])note.textContent=ok?"You can reveal the solution now.":"Write an attempt to unlock the solution.";}
    function renderHints(){var c=st.hints[id]||0,h="";for(var k=0;k<c;k++)h+='<div class="hint"><b>Hint '+(k+1)+'.</b> '+p.h[k]+'</div>';hb.innerHTML=h;hbtn.forEach(function(b,k){b.disabled=(k+1)!==c+1;});}
    function renderSol(){
      var opts=errTypes.map(function(t){return "<option"+(st.errors[id]===t?" selected":"")+">"+t+"</option>";}).join("");
      sb.innerHTML='<div class="sol"><b>Solution.</b><br>'+p.s+'</div><p class="small" style="margin-top:10px"><label>How did your attempt go? <select data-err><option value="">Choose one</option>'+opts+'</select></label></p>';
      sb.querySelector("[data-err]").addEventListener("change",function(e){st.errors[id]=e.target.value;save();});
      note.textContent="Compare with your attempt, then classify it.";sol.disabled=true;
    }
    ta.addEventListener("input",function(){st.attempts[id]=ta.value;save();gate();prog();});
    hbtn.forEach(function(b){b.addEventListener("click",function(){var k=+b.getAttribute("data-h");st.hints[id]=Math.max(st.hints[id]||0,k);save();renderHints();});});
    sol.addEventListener("click",function(){st.revealed[id]=true;save();renderSol();});
    renderHints();gate();if(st.revealed[id])renderSol();
  });
  prog();
  /* checkpoint */
  cfg.objectives.forEach(function(o,i){
    var d=document.createElement("div");d.className="o";
    d.innerHTML='<span>'+o+'</span><select aria-label="Rating for '+o+'"><option value="">Rate it</option><option>Confident</option><option>Needs review</option><option>Weak</option></select>';
    var sel=d.querySelector("select");sel.value=st.ratings[i]||"";
    sel.addEventListener("change",function(){st.ratings[i]=sel.value;save();});
    $(P+"objs").appendChild(d);
  });
  $(P+"cp-build").addEventListener("click",function(){
    var att=0,rec=0,tally={};
    cfg.practice.forEach(function(_,i){if((st.attempts["p"+i]||"").trim().length>=4)att++;var e=st.errors["p"+i];if(e&&e!=="I got it right")tally[e]=(tally[e]||0)+1;});
    cfg.recall.forEach(function(_,i){if(st.recallDone["r"+i])rec++;});
    var conf=[],rev=[],weak=[];
    cfg.objectives.forEach(function(o,i){var r=st.ratings[i];if(r==="Confident")conf.push(o);else if(r==="Needs review")rev.push(o);else if(r==="Weak")weak.push(o);});
    var next=weak.concat(rev).slice(0,3),tk=Object.keys(tally);
    var h="<h3>Your checkpoint</h3><ul><li>Active recall checked: "+rec+" of "+cfg.recall.length+".</li><li>Practice attempted: "+att+" of "+cfg.practice.length+".</li><li>Mistake types you logged: "+(tk.length?tk.map(function(k){return k+" ("+tally[k]+")";}).join(", "):"none yet")+".</li></ul>";
    h+="<p><b>Confident:</b> "+(conf.length?conf.join("; "):"none rated yet")+".</p><p><b>Needs review:</b> "+(rev.length?rev.join("; "):"none")+".</p><p><b>Weak:</b> "+(weak.length?weak.join("; "):"none")+".</p>";
    h+="<p><b>Revisit next:</b> "+(next.length?next.join("; "):"rate your objectives to get a list")+".</p><p class=\"small\">Bring this summary back to me and we will plan the next session around it.</p>";
    $(P+"cp-out").innerHTML=h;
  });
  $(P+"cp-reset").addEventListener("click",function(){
    if(!window.confirm("Clear all your answers, hints and ratings for this week?"))return;
    try{localStorage.removeItem(cfg.key);}catch(e){}
    location.reload();
  });
}

/* ===================== WEEK 4 CONTENT ===================== */
var W4={
 key:"ckc111-week4",
 objectives:["Defining a binary relation and listing its pairs","Testing reflexive and symmetric","Testing antisymmetric and transitive","Combining relations with ∪, ∩ and −","Computing a composition R2 ∘ R1"],
 recall:[
  ["A binary relation R from a set A to a set B is a ____ of A × B. What goes in the blank?","A subset: R ⊆ A × B."],
  ["What must be in R for a relation on A to be reflexive?","The pair (a, a) for every element a of A."],
  ["State the symmetric property in words and in symbols.","Whenever (a, b) is in R, so is (b, a). Symbolically: ∀x∀y [(x, y) ∈ R → (y, x) ∈ R]."],
  ["State the antisymmetric property. Does a loop (a, a) break it?","If (a, b) and (b, a) are both in R, then a = b. Symbolically: ∀x∀y [((x, y) ∈ R ∧ (y, x) ∈ R) → x = y]. A loop does not break it, because a = a."],
  ["State the transitive property.","Whenever (a, b) and (b, c) are in R, then (a, c) is in R, for all a, b, c in A."],
  ["Is \"antisymmetric\" the opposite of \"symmetric\"? Give an example that is both.","No. A relation can be both (for example {(1,1), (2,2)}), neither, or just one of them."],
  ["Define the composition R2 ∘ R1 and say which relation acts first.","If (x, y) is in R1 (from A to B) and (y, z) is in R2 (from B to C), then (x, z) is in R2 ∘ R1. R1 acts first."],
  ["Name the four ways of combining R1 and R2 as sets.","R1 ∪ R2 (in either), R1 ∩ R2 (in both), R1 − R2 (in R1 only) and R2 − R1 (in R2 only)."]
 ],
 practice:[
  {l:"Easy",q:'Slide Exercise 1. Are these relations on {1, 2, 3, 4} reflexive?<br>(a) {(1,1), (1,2), (2,3), (3,3), (4,4)}<br>(b) {(1,2), (2,3), (3,1)}<br>(c) {(1,1), (2,2), (2,3), (3,3), (4,4)}<br>(d) {(1,1), (2,2), (3,3)}',
   h:["Reflexive on {1, 2, 3, 4} needs four specific pairs. Which four?","Write them down: (1,1), (2,2), (3,3), (4,4). Tick each one off in the relation.","One missing pair is enough to fail. Extra pairs never hurt reflexivity."],
   s:'(a) No: (2,2) is missing. (b) No: there are no loops at all. (c) Yes: (1,1), (2,2), (3,3), (4,4) are all present, and the extra pair (2,3) does not matter. (d) No: (4,4) is missing.'},
  {l:"Easy",q:'Slide Exercise 2. Are these relations on {1, 2, 3, 4} symmetric?<br>(a) {(1,1), (1,2), (2,3), (3,4), (4,4)}<br>(b) {(1,2), (2,2), (3,1)}<br>(c) {(1,2), (2,1), (2,3), (3,2), (4,4)}',
   h:["For each pair (x, y), look for its reverse (y, x).","(a): take the pair (1,2). Is (2,1) in the relation?","A loop such as (4,4) is its own reverse, so it never breaks symmetry."],
   s:'(a) No: (1,2) is in R but (2,1) is not. (b) No: (1,2) is in R but (2,1) is not (also (3,1) without (1,3)). (c) Yes: (1,2)&(2,1), (2,3)&(3,2) are paired, and (4,4) is its own reverse.'},
  {l:"Easy",q:'Slide Exercise 3. Are these relations on {1, 2, 3} antisymmetric?<br>(a) {(1,1), (1,2), (2,3)}<br>(b) {(1,3), (1,2), (3,1)}<br>(c) {(1,1), (1,2), (1,3), (2,2), (2,3)}',
   h:["Ignore the loops. Look only at pairs (x, y) with x ≠ y.","For each such pair, is the reverse also in R? If so (and x ≠ y), antisymmetry fails.","In (b), look at the pairs involving 1 and 3."],
   s:'(a) Yes: no pair with x ≠ y has its reverse. (b) No: (1,3) and (3,1) are both in R and 1 ≠ 3. (c) Yes: apart from loops, the pairs (1,2), (1,3), (2,3) are all one-way.'},
  {l:"Medium",q:'Slide Exercise 4. Are these relations on {1, 2, 3, 4} transitive?<br>(a) {(1,1), (1,2), (2,3), (3,4), (4,4)}<br>(b) {(1,2), (2,3), (3,1)}<br>(c) {(1,1), (1,2), (1,3), (2,1), (2,2), (2,3), (4,4)}',
   h:["List every pair (a, b), then every pair that starts with b. Each such pair (b, c) demands the shortcut (a, c).","(a): (1,2) and (2,3) are both in R. What pair does transitivity then demand? Is it there?","(c) needs patience. No pair starts with 3, and (4,4) only chains with itself. Check the pairs starting with 1 and with 2."],
   s:'(a) No: (1,2), (2,3) ∈ R but (1,3) ∉ R. (b) No: (1,2), (2,3) ∈ R but (1,3) ∉ R. (c) Yes: every chain has its shortcut. For example (1,2),(2,1) → (1,1) ✓; (1,2),(2,3) → (1,3) ✓; (2,1),(1,3) → (2,3) ✓; (2,1),(1,2) → (2,2) ✓. Nothing starts with 3, and (4,4) only chains with itself.'},
  {l:"Medium",q:'Slide Exercise 5. R is a relation from {1, 2, 3} to {1, 2, 3, 4} with R = {(1,1), (1,4), (2,3), (3,1), (3,4)}. S is a relation from {1, 2, 3, 4} to {0, 1, 2} with S = {(1,0), (2,0), (3,1), (3,2), (4,1)}. What is the composite S ∘ R?',
   h:["R acts first, then S. For each pair (x, y) in R, look for pairs in S that start with y.","(1,1) in R matches (1,0) in S, giving (1,0). Now do (1,4).","Make a table: pair in R, matching pair(s) in S, resulting pair. Remove duplicates at the end."],
   s:'<pre>(1,1) with (1,0) → (1,0)\n(1,4) with (4,1) → (1,1)\n(2,3) with (3,1) → (2,1)\n(2,3) with (3,2) → (2,2)\n(3,1) with (1,0) → (3,0)\n(3,4) with (4,1) → (3,1)\n\nS ∘ R = {(1,0), (1,1), (2,1), (2,2), (3,0), (3,1)}</pre>'},
  {l:"Medium",q:'Let R<sub>1</sub> = {(1,2), (2,3), (3,3)} and R<sub>2</sub> = {(1,2), (2,2), (3,1)}. Find R<sub>1</sub> ∪ R<sub>2</sub>, R<sub>1</sub> ∩ R<sub>2</sub>, R<sub>1</sub> − R<sub>2</sub> and R<sub>2</sub> − R<sub>1</sub>.',
   h:["Treat each relation as a set of pairs and use ordinary set operations.","Which pairs appear in both lists? That is the intersection.","Union = everything in either (no repeats). Differences = in one list but not the other."],
   s:'<pre>R1 ∪ R2 = {(1,2), (2,3), (3,3), (2,2), (3,1)}\nR1 ∩ R2 = {(1,2)}\nR1 − R2 = {(2,3), (3,3)}\nR2 − R1 = {(2,2), (3,1)}</pre>'},
  {l:"Medium",q:'Decide whether the relation "a divides b" on {1, 2, 3, 4} is reflexive, symmetric, antisymmetric and transitive. Give a reason for each answer.',
   h:["The pairs are listed in the slides: (1,1), (1,2), (1,3), (1,4), (2,2), (2,4), (3,3), (4,4).","Reflexive: does every a divide itself? Symmetric: does 1 divide 2 imply 2 divides 1?","Antisymmetric: if a divides b and b divides a, what must be true for positive integers? Transitive: if a|b and b|c, what about a and c?"],
   s:'Reflexive: yes, every a divides itself, so (a, a) is in R for each a. Symmetric: no, (1,2) is in R but (2,1) is not. Antisymmetric: yes, if a divides b and b divides a (positive integers) then a = b. Transitive: yes, if a divides b and b divides c, then a divides c. (The explorer confirms all four.)'},
  {l:"Challenging",q:'On A = {1, 2, 3}: (a) give a relation that is both symmetric and antisymmetric, and (b) give a relation that is neither symmetric nor antisymmetric. Check each against the definitions.',
   h:["For (a), loops are their own reverses. Which relation uses only loops?","For (b) you need two things: a pair without its reverse (to break symmetric) and a two-way pair with different elements (to break antisymmetric).","Try {(1,2), (2,1)} for the antisymmetric breaker, then add one more pair with no reverse."],
   s:'(a) R = {(1,1), (2,2)}: every pair is its own reverse (symmetric), and no pair has x ≠ y (antisymmetric). (The empty relation also works.) (b) R = {(1,2), (2,1), (1,3)}: (1,3) has no reverse (not symmetric), and (1,2),(2,1) are both in R with 1 ≠ 2 (not antisymmetric). Other answers are possible.'},
  {l:"Challenging",q:'Consider the empty relation R = ∅ on A = {1, 2, 3}. Is it reflexive? Symmetric? Antisymmetric? Transitive? Explain, and connect your answer to the truth table of an implication from Week 1.',
   h:["Reflexive needs (1,1), (2,2) and (3,3). Are they in ∅?","Symmetric says: if (a, b) is in R then (b, a) is in R. How many pairs are there to check?","When the hypothesis of an implication is false, the whole implication is true. That is vacuous truth."],
   s:'Reflexive: no, (1,1), (2,2), (3,3) are missing. Symmetric: yes, vacuously: there is no pair (a, b) in R, so the "if" part is never true and the implication holds. Antisymmetric: yes, vacuously. Transitive: yes, vacuously. This is exactly the Week 1 fact that p → q is true whenever p is false.'},
  {l:"Challenging",q:'Proof construction. Let R be a relation on a set A that is symmetric and transitive, and suppose every element a of A is related to at least one element (for every a there is some b with (a, b) in R). Show that R is reflexive.',
   h:["Reflexive means: for an arbitrary a in A, you must show (a, a) is in R. Start your proof with \"Let a be any element of A.\"","The extra assumption gives you a b with (a, b) in R. Use symmetry on that pair.","You now have (a, b) and (b, a). Apply transitivity to this chain."],
   s:'Let a be any element of A. By the assumption there is some b with (a, b) ∈ R. Since R is symmetric, (b, a) ∈ R. Now (a, b) ∈ R and (b, a) ∈ R, so by transitivity (a, a) ∈ R. Since a was arbitrary, (a, a) ∈ R for every a ∈ A, so R is reflexive. ∎ (Notice that the extra assumption is needed: ∅ is symmetric and transitive but not reflexive.)'}
 ]
};

/* ===================== WEEK 5 CONTENT ===================== */
var W5={
 key:"ckc111-week5",
 objectives:["Building the zero-one matrix of a relation, and reading pairs back","Drawing and reading a digraph","Reading reflexive, symmetric and antisymmetric from a matrix or digraph","Defining equivalence relations and finding equivalence classes","Deciding whether a collection of sets is a partition"],
 recall:[
  ["How does the zero-one matrix M_R of a relation from A to B record R?","m_ij = 1 if (a_i, b_j) is in R, and m_ij = 0 if it is not. Row i is the first element, column j the second."],
  ["How can you tell from M_R that R is reflexive?","All entries on the main diagonal are 1."],
  ["Give the matrix tests for symmetric and antisymmetric.","Symmetric: m_ij = 1 whenever m_ji = 1 (mirror image across the diagonal). Antisymmetric: m_ij = 0 or m_ji = 0 whenever i ≠ j."],
  ["What is a digraph? Name initial vertex, terminal vertex and loop.","A set V of vertices with a set E of ordered pairs of vertices called edges. For the edge (a, b), a is the initial vertex and b the terminal vertex. An edge (a, a) is a loop."],
  ["How do you see reflexive and symmetric on a digraph?","Reflexive: a loop at every vertex. Symmetric: whenever (x, y) is an edge, so is (y, x)."],
  ["What makes a relation an equivalence relation?","It is reflexive, symmetric and transitive."],
  ["What does [a] mean, and which three facts hold?","[a] is the equivalence class of a: all elements equivalent to a. (1) a ∈ [a]; (2) a ∼ b if and only if [a] = [b]; (3) [a] = [b] or [a] ∩ [b] = ∅."],
  ["State the three conditions for a collection of subsets to be a partition of S.","Each subset is nonempty; different subsets are disjoint (A_i ∩ A_j = ∅ when i ≠ j); and the union of all the subsets is S."]
 ],
 practice:[
  {l:"Easy",q:'Slide Exercise 6. Represent each relation on {1, 2, 3} with a matrix.<br>(a) {(1,1), (1,2), (1,3)}<br>(b) {(1,2), (2,1), (2,2), (2,3)}<br>(c) {(1,1), (1,2), (1,3), (2,2), (2,3), (3,3)}<br>(d) {(1,3), (3,1)}',
   h:["The matrix has 3 rows and 3 columns. Row = first element, column = second element.","Put a 1 in row i, column j exactly when (i, j) is in R. Every other entry is 0.","In (a), all three pairs have first element 1, so they all fill row 1."],
   s:'<pre>(a) 1 1 1     (b) 0 1 0     (c) 1 1 1     (d) 0 0 1\n    0 0 0         1 1 1         0 1 1         0 0 0\n    0 0 0         0 0 0         0 0 1         1 0 0</pre>'},
  {l:"Easy",q:'A = B = {1, 2, 3}. The matrix of R is<br><span class="e">[ 1 0 1 ]<br>[ 0 1 0 ]<br>[ 1 0 0 ]</span><br>List the ordered pairs in R.',
   h:["Each 1 gives one pair. The pair is (row number, column number).","Row 1 has 1s in columns 1 and 3. What pairs is that?","Rows 2 and 3 give one pair each."],
   s:'R = {(1,1), (1,3), (2,2), (3,1)}.'},
  {l:"Easy",q:'Slide Exercise 7. A digraph has vertices a, b, c. The arrows are: a → b, a → c, b → c and c → b. List the ordered pairs in the relation.',
   h:["Each arrow from x to y is the ordered pair (x, y). The tail is the first entry.","There is one arrow starting at a for each of b and c.","b → c and c → b are two different arrows, so they give two different pairs."],
   s:'R = {(a,b), (a,c), (b,c), (c,b)}. (The picture on the slide has an arrow from a to each of b and c, and a pair of opposite arrows between b and c.)'},
  {l:"Medium",q:'For each matrix on {1, 2, 3}, decide whether the relation is reflexive, symmetric, antisymmetric.<br><span class="e">M<sub>1</sub> = [[1,1,0],[0,1,1],[0,0,1]]  and  M<sub>2</sub> = [[1,0,1],[0,0,1],[1,1,1]]</span>',
   h:["Reflexive: look at the diagonal only (m11, m22, m33).","Symmetric: compare each entry with its mirror image across the diagonal (m12 with m21, m13 with m31, m23 with m32).","Antisymmetric: is there any off-diagonal position where m_ij and its mirror m_ji are both 1?"],
   s:'M1: diagonal 1,1,1, so reflexive. m12 = 1 but m21 = 0, so not symmetric. No mirrored pair of 1s off the diagonal, so antisymmetric. M2: m22 = 0, so not reflexive. m13 = m31 = 1 and m23 = m32 = 1 and m12 = m21 = 0, so symmetric. m13 and m31 are both 1, so not antisymmetric.'},
  {l:"Medium",q:'Let R = {(1,1), (1,2), (2,3), (3,3)} on {1, 2, 3}. Describe its digraph (which loops and arrows), then decide the four properties: reflexive, symmetric, antisymmetric, transitive.',
   h:["Loops come from pairs (a, a). Arrows come from pairs (a, b) with a ≠ b.","Reflexive needs a loop at every vertex. Which vertex has no loop?","Transitive: follow the path 1 → 2 → 3. Is there a direct arrow 1 → 3?"],
   s:'Digraph: loops at 1 and 3; arrows 1 → 2 and 2 → 3. Reflexive: no (no loop at 2). Symmetric: no ((1,2) has no (2,1)). Antisymmetric: yes (no two-way arrows between different vertices). Transitive: no ((1,2) and (2,3) are in R but (1,3) is not). You can check it in the tool at the top of Week 5.'},
  {l:"Medium",q:'Let R = {(1,1), (2,2), (3,3), (4,4), (1,2), (2,1), (3,4), (4,3)} on {1, 2, 3, 4}. Show that R is an equivalence relation, then find its equivalence classes.',
   h:["Check the three properties one at a time. Reflexive: are all four loops there?","Symmetric: does every pair have its reverse? Transitive: check each chain, for example (1,2),(2,1).","Class of 1: collect every element x with (1, x) in R. Then do the same for 3."],
   s:'Reflexive: (1,1), (2,2), (3,3), (4,4) are all in R. Symmetric: (1,2)&(2,1) and (3,4)&(4,3) are paired, and loops are their own reverse. Transitive: every chain has its shortcut, for example (1,2),(2,1) → (1,1) and (3,4),(4,3) → (3,3). So R is an equivalence relation. Classes: [1] = [2] = {1, 2} and [3] = [4] = {3, 4}. They form the partition {{1, 2}, {3, 4}}.'},
  {l:"Medium",q:'Slide Exercise 8. Let S = {u, m, b, r, o, c, k, s}. Which of these collections are partitions of S?<br>(a) {{m, o, c, k}, {r, u, b, s}}<br>(b) {{c, o, m, b}, {u, s}, {r}}<br>(c) {{b, r, o, c, k}, {m, u, s, t}}<br>(d) {{u, m, b, r, o, c, k, s}}<br>(e) {{b, o, o, k}, {r, u, m}, {c, s}}<br>(f) {{u, m, b}, {r, o, c, k, s}, ∅}',
   h:["Test three conditions for each: every subset nonempty, no element in two subsets, and the union is exactly S.","(b): list all the letters that appear in the three subsets. Is every letter of S there? (c): is every letter in S?","(e): a set does not record repeats, so {b, o, o, k} is the same set as {b, o, k}. (f): is ∅ allowed?"],
   s:'(a) Yes. (b) No: k is missing from the union. (c) No: t is not in S (the union is not S). (d) Yes: one subset equal to S is a valid partition. (e) Yes: {b, o, o, k} = {b, o, k}, the subsets are disjoint, and their union is S. (f) No: ∅ is an empty subset, and partition blocks must be nonempty. (Check them in the partition checker.)'},
  {l:"Challenging",q:'Beyond the slides. On {1, 2, …, 8} define a ∼ b if 4 divides a − b. (a) Show that ∼ is an equivalence relation. (b) List the equivalence classes.',
   h:["Reflexive: what is a − a, and does 4 divide it?","Symmetric: if 4 divides a − b, what about b − a? Transitive: if 4 divides a − b and b − c, what happens when you add the two differences?","The class of 1 is all x with 4 | (1 − x). Which numbers from 1 to 8 are those?"],
   s:'(a) Reflexive: a − a = 0, which 4 divides. Symmetric: if 4 | (a − b) then 4 | −(a − b) = (b − a). Transitive: if 4 | (a − b) and 4 | (b − c), then 4 divides their sum (a − b) + (b − c) = a − c. (b) [1] = {1, 5}, [2] = {2, 6}, [3] = {3, 7}, [4] = {4, 8}. Four classes, pairwise disjoint, with union {1, …, 8}: a partition.'},
  {l:"Challenging",q:'Design a relation on {1, 2, 3} that is reflexive and symmetric but not transitive. Draw its digraph in words, and name the chain that breaks transitivity.',
   h:["Start with the three loops to make it reflexive.","Add pairs in both directions (to stay symmetric), such as 1 ↔ 2.","Add another two-way pair that shares a vertex, such as 2 ↔ 3. Now follow 1 → 2 → 3."],
   s:'R = {(1,1), (2,2), (3,3), (1,2), (2,1), (2,3), (3,2)}. Reflexive: all three loops. Symmetric: each non-loop pair comes with its reverse. Not transitive: (1,2) and (2,3) are in R but (1,3) is not. Digraph: a loop at each vertex, two-way arrows 1 ↔ 2 and 2 ↔ 3, and no arrow between 1 and 3.'},
  {l:"Challenging",q:'Proof construction. Let ∼ be an equivalence relation on A and suppose a ∼ b. Show that [a] = [b]. (This is one half of the slide fact "a ∼ b if and only if [a] = [b]".)',
   h:["To show two sets are equal, show each is a subset of the other. Start with [a] ⊆ [b]: take any x in [a].","x in [a] means a ∼ x. You also know a ∼ b. Use symmetry to turn a ∼ b into b ∼ a.","Now b ∼ a and a ∼ x. Use transitivity to get b ∼ x, so x is in [b]. For [b] ⊆ [a] repeat the argument with the roles swapped."],
   s:'Take any x ∈ [a]. Then a ∼ x. Since ∼ is symmetric and a ∼ b, we have b ∼ a. By transitivity, b ∼ a and a ∼ x give b ∼ x, so x ∈ [b]. Hence [a] ⊆ [b]. For the other direction take y ∈ [b]; then b ∼ y, and with a ∼ b transitivity gives a ∼ y, so y ∈ [a]. Hence [b] ⊆ [a]. Therefore [a] = [b]. ∎'}
 ]
};

/* ===================== WEEK 2 (uses the logic engine exposed by Week 1) ===================== */
function initWeek2(){
  var L=window.CKCLogic;
  if(!L){return;}
  function tf(v){return v?"T":"F";}
  function cell(v,extra){return '<td class="v-'+tf(v)+(extra?" "+extra:"")+'">'+tf(v)+"</td>";}

  /* classifier: truth table plus a name */
  function renderTaut(){
    var out=$("w2-tout");
    try{
      var ast=L.parse($("w2-ta").value),vs=Object.keys(L.vars(ast,{})).sort();
      if(vs.length>5)throw new Error("Please use at most 5 variables (that is already 32 rows).");
      var list=[];L.subs(ast,list,{});
      var cols=list.length?list:[ast];
      var h='<div class="parsed">Fully bracketed: '+esc(L.str(ast,true))+'</div><div class="scroll"><table><tr>';
      vs.forEach(function(v){h+="<th>"+v+"</th>";});
      cols.forEach(function(c,i){h+='<th class="'+(i===cols.length-1?"final":"")+'">'+esc(L.str(c,true))+"</th>";});
      h+="</tr>";
      var all=true,none=true;
      for(var i=0;i<Math.pow(2,vs.length);i++){
        var env=L.envFor(vs,i);h+="<tr>";
        vs.forEach(function(v){h+=cell(env[v]);});
        cols.forEach(function(c,k){var val=L.evalA(c,env);if(k===cols.length-1){if(val)none=false;else all=false;}h+=cell(val,k===cols.length-1?"final":"");});
        h+="</tr>";
      }
      h+="</table></div>";
      var kind=all?["Tautology: always true","v-T"]:none?["Contradiction: always false","v-F"]:["Contingency: sometimes true, sometimes false",""];
      h+='<div class="verdict-box '+kind[1]+'"'+(kind[1]?"":' style="background:var(--soft)"')+">"+kind[0]+"</div>";
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+"</div>";}
  }
  $("w2-ta").addEventListener("input",renderTaut);

  /* equivalence checker */
  function renderEq(){
    var out=$("w2-eout");
    try{
      var A=L.parse($("w2-ea").value),B=L.parse($("w2-eb").value);
      var set={};L.vars(A,set);L.vars(B,set);var vs=Object.keys(set).sort();
      if(vs.length>5)throw new Error("Please use at most 5 variables.");
      var h='<div class="scroll"><table><tr>';
      vs.forEach(function(v){h+="<th>"+v+"</th>";});
      h+="<th>A: "+esc(L.str(A,true))+"</th><th>B: "+esc(L.str(B,true))+"</th><th>Same?</th></tr>";
      var same=true,bad=null;
      for(var i=0;i<Math.pow(2,vs.length);i++){
        var env=L.envFor(vs,i),a=L.evalA(A,env),b=L.evalA(B,env),eq=a===b;
        if(!eq){same=false;if(!bad)bad=env;}
        h+='<tr class="'+(eq?"":"diff")+'">';
        vs.forEach(function(v){h+=cell(env[v]);});
        h+=cell(a)+cell(b)+"<td>"+(eq?"yes":"no")+"</td></tr>";
      }
      h+="</table></div>";
      if(same)h+='<div class="verdict-box v-T">Logically equivalent: the columns agree in every row.</div>';
      else h+='<div class="verdict-box v-F">Not equivalent. They differ when '+esc(vs.map(function(v){return v+" = "+tf(bad[v]);}).join(", "))+".</div>";
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+"</div>";}
  }
  $("w2-ea").addEventListener("input",renderEq);$("w2-eb").addEventListener("input",renderEq);

  /* symbol keys */
  var lastEq=$("w2-ea");
  ["w2-ea","w2-eb"].forEach(function(id){$(id).addEventListener("focus",function(){lastEq=$(id);});});
  Array.prototype.forEach.call(document.querySelectorAll("#week2 .keys"),function(k){
    ["¬","∧","∨","⊕","→","↔","(",")","T","F"].forEach(function(s){
      var b=document.createElement("button");b.type="button";b.textContent=s;b.setAttribute("aria-label","Insert "+s);
      b.addEventListener("click",function(){var t=k.getAttribute("data-target");L.insertAt(t==="eq"?lastEq:$(t),s);});
      k.appendChild(b);
    });
  });
  Array.prototype.forEach.call(document.querySelectorAll("[data-w2ex]"),function(b){
    b.addEventListener("click",function(){var p=b.getAttribute("data-w2ex").split("|");$("w2-ea").value=p[0];$("w2-eb").value=p[1];renderEq();});
  });
  $("w2-load1").addEventListener("click",function(){
    $("w2-ea").value="¬(p ∨ (¬p ∧ q))";$("w2-eb").value="¬p ∧ ¬q";renderEq();$("w2-top").scrollIntoView();
  });
  $("w2-load2").addEventListener("click",function(){
    $("w2-ta").value="(p ∧ q) → (p ∨ q)";renderTaut();$("w2-taut").scrollIntoView();
  });
  renderTaut();renderEq();
}

var W2={
 key:"ckc111-week2",
 objectives:["Classifying tautology, contradiction and contingency","Showing equivalence or non-equivalence with truth tables","Stating De Morgan's Laws and naming the key laws","Proving equivalences with a chain of named laws","Rewriting conditionals: p → q, ¬p ∨ q and the contrapositive"],
 recall:[
  ["Define tautology, contradiction and contingency, with an example of each.","Tautology: always true (p ∨ ¬p). Contradiction: always false (p ∧ ¬p). Contingency: neither, sometimes true and sometimes false (p)."],
  ["When are two compound propositions logically equivalent? Give two ways to say it.","When they always have the same truth value: their truth-table columns agree in every row. Equivalently, p ↔ q is a tautology. We write p ≡ q."],
  ["State both De Morgan's Laws.","¬(p ∧ q) ≡ ¬p ∨ ¬q, and ¬(p ∨ q) ≡ ¬p ∧ ¬q. The ¬ moves inside and the connective flips."],
  ["Write p → q using only ¬ and ∨, and write its contrapositive.","p → q ≡ ¬p ∨ q, and the contrapositive is ¬q → ¬p, which is equivalent to it."],
  ["What do the domination laws and the negation laws say?","Domination: p ∨ T ≡ T and p ∧ F ≡ F. Negation: p ∨ ¬p ≡ T and p ∧ ¬p ≡ F."],
  ["Is the converse of p → q equivalent to it? The inverse? The contrapositive?","The converse: no. The inverse: no. The contrapositive: yes."],
  ["A proof by laws goes from A to B. What is a good strategy for choosing the steps?","Rewrite → and ↔ using ¬ and ∨; push negations inward with De Morgan; regroup so pairs like p and ¬p sit together; finish with the negation, identity and domination laws."],
  ["How many rows disprove an equivalence, and how many does a truth table need to prove one?","One row where the columns differ disproves it. Proving it with a truth table needs all 2^n rows to agree (or a chain of named laws)."]
 ],
 practice:[
  {l:"Easy",q:'Classify each statement as a tautology, a contradiction or a contingency.<br>(a) <span class="e">p ∨ ¬p</span> (b) <span class="e">p ∧ ¬p</span> (c) <span class="e">p → q</span> (d) <span class="e">(p ∧ q) → p</span>',
   h:["Look at the final column of the truth table. Can the statement ever be false? Can it ever be true?","(a) and (b) are on your slides. For (c), find the row where p is true and q is false.","(d): p ∧ q is true only when p is true. So when the hypothesis is true, is the conclusion true?"],
   s:'(a) Tautology: always true. (b) Contradiction: always false. (c) Contingency: it is false when p = T and q = F, and true in the other three rows. (d) Tautology: whenever p ∧ q is true, p is true, so the implication can never be false.'},
  {l:"Easy",q:'Use a truth table to show the first De Morgan law: <span class="e">¬(p ∧ q) ≡ ¬p ∨ ¬q</span>. (Your slide shows the second law, so do this one yourself.)',
   h:["You need columns p, q, p ∧ q, ¬(p ∧ q), ¬p, ¬q, ¬p ∨ ¬q.","Fill in p ∧ q first, then flip it to get ¬(p ∧ q).","Compare the ¬(p ∧ q) column with the ¬p ∨ ¬q column. They must match in all four rows."],
   s:'<pre>p q | p∧q | ¬(p∧q) | ¬p | ¬q | ¬p∨¬q\nT T |  T  |    F    | F  | F  |   F\nT F |  F  |    T    | F  | T  |   T\nF T |  F  |    T    | T  | F  |   T\nF F |  F  |    T    | T  | T  |   T</pre>The ¬(p ∧ q) column and the ¬p ∨ ¬q column match in every row, so the two statements are equivalent.'},
  {l:"Easy",q:'Name the law used in each equivalence.<br>(a) <span class="e">p ∧ T ≡ p</span> (b) <span class="e">p ∨ T ≡ T</span> (c) <span class="e">p ∨ p ≡ p</span> (d) <span class="e">p ∨ (p ∧ q) ≡ p</span> (e) <span class="e">(p ∨ q) ∨ r ≡ p ∨ (q ∨ r)</span>',
   h:["Use the law table in section 4. Match the shape of each line.","(a) has T in an \"and\". (b) has T in an \"or\". They are two different laws.","(c) repeats p. (d) has p appearing twice with q hanging on. (e) only moves brackets."],
   s:'(a) Identity law. (b) Domination law. (c) Idempotent law. (d) Absorption law. (e) Associative law.'},
  {l:"Medium",q:'Use a truth table to show that <span class="e">¬p → q ≡ p ∨ q</span>.',
   h:["Four rows. Columns: p, q, ¬p, ¬p → q, p ∨ q.","Remember an implication is false only when the hypothesis is true and the conclusion is false.","¬p → q has hypothesis ¬p. Find the one row where ¬p is true and q is false."],
   s:'<pre>p q | ¬p | ¬p → q | p ∨ q\nT T |  F |    T    |   T\nT F |  F |    T    |   T\nF T |  T |    T    |   T\nF F |  T |    F    |   F</pre>The last two columns match in every row, so ¬p → q ≡ p ∨ q.'},
  {l:"Medium",q:'Use a truth table (8 rows) to show that <span class="e">(p → q) ∧ (p → r) ≡ p → (q ∧ r)</span>.',
   h:["Three variables means 8 rows. List them from TTT down to FFF.","Columns: p → q, p → r, their ∧, then q ∧ r, then p → (q ∧ r).","When p is false, every implication with hypothesis p is true. That settles the last four rows."],
   s:'<pre>p q r | p→q | p→r | (p→q)∧(p→r) | q∧r | p→(q∧r)\nT T T |  T  |  T  |      T       |  T  |    T\nT T F |  T  |  F  |      F       |  F  |    F\nT F T |  F  |  T  |      F       |  F  |    F\nT F F |  F  |  F  |      F       |  F  |    F\nF T T |  T  |  T  |      T       |  T  |    T\nF T F |  T  |  T  |      T       |  F  |    T\nF F T |  T  |  T  |      T       |  F  |    T\nF F F |  T  |  T  |      T       |  F  |    T</pre>The two final columns agree in all 8 rows, so the statements are equivalent.'},
  {l:"Medium",q:'Use laws to simplify <span class="e">¬(p ∨ q) ∨ (¬p ∧ q)</span> to a single literal. Name each law you use.',
   h:["Start with the first part. ¬(p ∨ q) has a negation outside brackets: use De Morgan.","You should then have (¬p ∧ ¬q) ∨ (¬p ∧ q). Notice ¬p appears in both parts.","Use the distributive law backwards to pull ¬p out, then use the negation and identity laws."],
   s:'<span class="e">¬(p ∨ q) ∨ (¬p ∧ q)</span><br><span class="e">≡ (¬p ∧ ¬q) ∨ (¬p ∧ q)</span> (second De Morgan law)<br><span class="e">≡ ¬p ∧ (¬q ∨ q)</span> (second distributive law, read right to left)<br><span class="e">≡ ¬p ∧ T</span> (negation law)<br><span class="e">≡ ¬p</span> (identity law)'},
  {l:"Medium",q:'Use laws to show that <span class="e">(p ∧ q) ∨ (p ∧ ¬q) ≡ p</span>. Name each law.',
   h:["Both parts contain p ∧ something. Can you pull p out?","Use the distributive law backwards: (p ∧ q) ∨ (p ∧ ¬q) ≡ p ∧ (q ∨ ¬q).","What does q ∨ ¬q equal? Then p ∧ T."],
   s:'<span class="e">(p ∧ q) ∨ (p ∧ ¬q)</span><br><span class="e">≡ p ∧ (q ∨ ¬q)</span> (second distributive law, read right to left)<br><span class="e">≡ p ∧ T</span> (negation law)<br><span class="e">≡ p</span> (identity law)'},
  {l:"Challenging",q:'Using only laws (not a truth table), show <span class="e">¬(p → q) ≡ p ∧ ¬q</span>. Name every law you use.',
   h:["Start from the left side. The ¬ is stuck outside an implication, so rewrite the implication.","Use p → q ≡ ¬p ∨ q inside the brackets.","Then apply De Morgan to the negated disjunction, and finish with double negation."],
   s:'<span class="e">¬(p → q)</span><br><span class="e">≡ ¬(¬p ∨ q)</span> (p → q ≡ ¬p ∨ q)<br><span class="e">≡ ¬¬p ∧ ¬q</span> (second De Morgan law)<br><span class="e">≡ p ∧ ¬q</span> (double negation law)'},
  {l:"Challenging",q:'Using laws, show <span class="e">(p ∧ q) → p</span> is a tautology.',
   h:["Rewrite the implication as ¬(something) ∨ something.","Apply De Morgan to ¬(p ∧ q), then regroup so ¬p and p sit together.","Use the negation law, then the domination law."],
   s:'<span class="e">(p ∧ q) → p</span><br><span class="e">≡ ¬(p ∧ q) ∨ p</span> (conditional rewrite)<br><span class="e">≡ (¬p ∨ ¬q) ∨ p</span> (first De Morgan law)<br><span class="e">≡ (¬p ∨ p) ∨ ¬q</span> (associative and commutative laws)<br><span class="e">≡ T ∨ ¬q</span> (negation law)<br><span class="e">≡ T</span> (domination law)'},
  {l:"Challenging",q:'Is <span class="e">(p → q) → r</span> equivalent to <span class="e">p → (q → r)</span>? Prove or disprove, and explain your method.',
   h:["To disprove equivalence you only need one row where the two sides differ. To prove it you would need all 8.","Try to make the outer implication false on one side. For (p → q) → r to be false you need p → q true and r false.","Try p = F, q = F, r = F and evaluate both sides. The equivalence checker can confirm your answer."],
   s:'Not equivalent. Counterexample: p = F, q = F, r = F. Then (p → q) is T, so (p → q) → r is T → F = <b>F</b>. On the other side, q → r is T, so p → (q → r) is F → T = <b>T</b>. The values differ, so they are not logically equivalent. One counterexample row is enough to disprove equivalence.'}
 ]
};

/* ===================== EXAM LAB: question generators ===================== */
function mulberry32(a){return function(){a|=0;a=a+0x6D2B79F5|0;var t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}
function RNG(seed){
  var f=mulberry32(seed);
  var o={
    f:f,
    int:function(a,b){return a+Math.floor(f()*(b-a+1));},
    pick:function(arr){return arr[Math.floor(f()*arr.length)];},
    chance:function(p){return f()<p;},
    shuffle:function(arr){var a=arr.slice(),i,j,t;for(i=a.length-1;i>0;i--){j=Math.floor(f()*(i+1));t=a[i];a[i]=a[j];a[j]=t;}return a;},
    sample:function(arr,n){return o.shuffle(arr).slice(0,n);}
  };
  return o;
}
function LG(){return window.CKCLogic;}
function tfc(v){return v?"T":"F";}
function stripOuter(s){
  if(s.charAt(0)!=="("||s.charAt(s.length-1)!==")")return s;
  var d=0;
  for(var i=0;i<s.length;i++){if(s.charAt(i)==="(")d++;else if(s.charAt(i)===")"){d--;if(d===0&&i<s.length-1)return s;}}
  return s.slice(1,-1);
}
function eqCompare(a,b){
  var A=LG().parse(a),B=LG().parse(b),s={};LG().vars(A,s);LG().vars(B,s);
  var vs=Object.keys(s).sort(),i,e;
  for(i=0;i<Math.pow(2,vs.length);i++){
    e=LG().envFor(vs,i);
    var x=LG().evalA(A,e),y=LG().evalA(B,e);
    if(x!==y)return {ok:false,env:e,vs:vs,a:x,b:y};
  }
  return {ok:true};
}
function envText(vs,env){return vs.map(function(v){return v+" = "+tfc(env[v]);}).join(", ");}
function truthCol(expr,vs){
  var A=LG().parse(expr),out="",i;
  for(i=0;i<Math.pow(2,vs.length);i++)out+=tfc(LG().evalA(A,LG().envFor(vs,i)));
  return out;
}
function rowLabels(n){var out=[],i,j;for(i=0;i<Math.pow(2,n);i++){var s="";for(j=0;j<n;j++)s+=((i>>(n-1-j))&1)===0?"T":"F";out.push(s);}return out;}
function varsIn(expr){return Object.keys(LG().vars(LG().parse(expr),{})).sort();}
function parseNums(str){
  var parts=str.split(/[\s,;]+/).filter(Boolean);
  return parts.map(function(p){if(!/^-?\d+$/.test(p))throw new Error('"'+p+'" is not a whole number. Write numbers separated by commas.');return parseInt(p,10);});
}
function intVal(s,name){
  s=String(s).trim();
  if(!/^-?\d+$/.test(s))throw new Error("Type a whole number for "+name+".");
  return parseInt(s,10);
}
function readPairs(str){return parsePairs(String(str).replace(/∅/g,"").replace(/\bempty\b/gi,""));}
function pairKeys(R){return uniq(R.map(function(p){return p[0]+"\u0001"+p[1];})).sort();}
function pairsFeedback(user,target){
  var ku=pset(user),kt=pset(target);
  var miss=target.filter(function(p){return !ku[p[0]+"\u0001"+p[1]];});
  var extra=user.filter(function(p){return !kt[p[0]+"\u0001"+p[1]];});
  if(!miss.length&&!extra.length)return null;
  var m=[];
  if(miss.length)m.push("missing "+miss.map(fmt).join(", "));
  if(extra.length)m.push("should not be there: "+extra.map(fmt).join(", "));
  return "Not quite: "+m.join("; ")+".";
}
function pairsCheck(str,target){
  var u;
  try{u=readPairs(str);}catch(e){return {ok:false,msg:e.message};}
  var fb=pairsFeedback(u,target);
  return fb?{ok:false,msg:fb}:{ok:true,msg:"Correct."};
}
function parseMatrix(str,rows,cols){
  var lines=String(str).split(/\n|\//).map(function(r){return r.trim();}).filter(Boolean);
  if(lines.length!==rows)throw new Error("The matrix should have "+rows+" rows, but you typed "+lines.length+".");
  return lines.map(function(l,i){
    var c=l.split(/[\s,]+/).filter(Boolean);
    if(c.length!==cols)throw new Error("Row "+(i+1)+" should have "+cols+" entries, but has "+c.length+".");
    return c.map(function(x){if(!/^\d+$/.test(x))throw new Error('Entries must be whole numbers, but row '+(i+1)+' has "'+x+'".');return parseInt(x,10);});
  });
}
function matrixCheck(str,M){
  var U;
  try{U=parseMatrix(str,M.length,M[0].length);}catch(e){return {ok:false,msg:e.message};}
  var bad=[];
  M.forEach(function(r,i){r.forEach(function(v,j){if(U[i][j]!==v)bad.push("("+(i+1)+","+(j+1)+")");});});
  return bad.length?{ok:false,msg:"Not quite. Check row, column "+bad.slice(0,4).join(", ")+(bad.length>4?", …":"")+"."}:{ok:true,msg:"Correct."};
}
function matTable(M,rl,cl,corner){
  var h='<div class="scroll"><table class="mx"><tr><th>'+(corner||"")+"</th>"+cl.map(function(c){return "<th>"+esc(c)+"</th>";}).join("")+"</tr>";
  M.forEach(function(r,i){h+="<tr><th>"+esc(rl[i])+"</th>"+r.map(function(v){return '<td class="'+(v?"one":"zero")+'">'+v+"</td>";}).join("")+"</tr>";});
  return h+"</table></div>";
}
function matMono(M){return M.map(function(r){return r.join(" ");}).join("\n");}
function relMatrix(A,B,R){var s=pset(R);return A.map(function(a){return B.map(function(b){return s[a+"\u0001"+b]?1:0;});});}
function allPairs(A,B){var o=[];A.forEach(function(a){B.forEach(function(b){o.push([a,b]);});});return o;}
function setStr(arr){return "{"+arr.join(", ")+"}";}
var LETTERS="abcdefghijklmnopqrstuvwxyz".split("");

/* ---- extra drawing: multigraphs and weighted graphs ---- */
function circlePos(V,cx,cy,Rad){
  var pos={},n=V.length;
  V.forEach(function(v,i){var ang=-Math.PI/2+2*Math.PI*i/Math.max(n,1);pos[v]={x:cx+Rad*Math.cos(ang),y:cy+Rad*Math.sin(ang),ux:n===1?0:Math.cos(ang),uy:n===1?-1:Math.sin(ang)};});
  return pos;
}
function multiSvg(V,E,directed,mid){
  var W=340,H=300,NR=16,pos=circlePos(V,W/2,H/2,V.length<=1?0:Math.min(112,34+V.length*20)),groups={},loops={};
  E.forEach(function(e){
    if(e[0]===e[1]){loops[e[0]]=(loops[e[0]]||0)+1;return;}
    var k=[e[0],e[1]].sort().join("|");(groups[k]=groups[k]||[]).push(e);
  });
  var h='<svg class="dg" viewBox="0 0 '+W+" "+H+'" role="img" aria-label="Graph drawing">';
  Object.keys(groups).forEach(function(k){
    var g=groups[k],p=k.split("|"),a=pos[p[0]],b=pos[p[1]];
    var dx=b.x-a.x,dy=b.y-a.y,len=Math.sqrt(dx*dx+dy*dy)||1,ux=dx/len,uy=dy/len,nx=-uy,ny=ux;
    g.forEach(function(e,j){
      var off=(j-(g.length-1)/2)*34,cx=(a.x+b.x)/2+nx*off,cy=(a.y+b.y)/2+ny*off;
      var f=pos[e[0]],t=pos[e[1]];
      var sx=cx-f.x,sy=cy-f.y,sl=Math.sqrt(sx*sx+sy*sy)||1,ex=cx-t.x,ey=cy-t.y,el=Math.sqrt(ex*ex+ey*ey)||1;
      var x1=f.x+sx/sl*NR,y1=f.y+sy/sl*NR,x2=t.x+ex/el*(NR+(directed?2:0)),y2=t.y+ey/el*(NR+(directed?2:0));
      h+='<path d="M'+f1(x1)+" "+f1(y1)+" Q"+f1(cx)+" "+f1(cy)+" "+f1(x2)+" "+f1(y2)+'" class="dg-edge"/>'+(directed?arrowHead(x2,y2,x2-cx,y2-cy):"");
    });
  });
  Object.keys(loops).forEach(function(v){
    var p=pos[v];
    for(var j=0;j<loops[v];j++){h+='<circle cx="'+f1(p.x+p.ux*(NR+5+j*9))+'" cy="'+f1(p.y+p.uy*(NR+5+j*9))+'" r="'+(10+j*9)+'" class="dg-edge"/>';}
  });
  V.forEach(function(v){var p=pos[v];h+='<circle cx="'+f1(p.x)+'" cy="'+f1(p.y)+'" r="'+NR+'" class="dg-node"/><text x="'+f1(p.x)+'" y="'+f1(p.y+5)+'" text-anchor="middle" class="dg-label">'+esc(v)+"</text>";});
  return h+"</svg>";
}
function chordCrossings(order,E){
  var p={},c=0,i,j;order.forEach(function(v,k){p[v]=k;});
  for(i=0;i<E.length;i++)for(j=i+1;j<E.length;j++){
    var a=E[i],b=E[j];
    if(a.a===b.a||a.a===b.b||a.b===b.a||a.b===b.b)continue;
    var lo=Math.min(p[a.a],p[a.b]),hi=Math.max(p[a.a],p[a.b]),x=p[b.a],y=p[b.b];
    if((x>lo&&x<hi)!==(y>lo&&y<hi))c++;
  }
  return c;
}
function bestOrder(V,E){
  var best=V.slice(),bc=chordCrossings(best,E),s=7919,t,k,cur,j,tmp,c;
  for(t=0;t<400&&bc>0;t++){
    cur=V.slice();
    for(k=cur.length-1;k>0;k--){s=(s*1103515245+12345)%2147483648;j=s%(k+1);tmp=cur[k];cur[k]=cur[j];cur[j]=tmp;}
    c=chordCrossings(cur,E);if(c<bc){bc=c;best=cur;}
  }
  return best;
}
function weightedSvg(V,E){
  V=bestOrder(V,E);
  var W=360,H=300,NR=16,pos=circlePos(V,W/2,H/2,V.length<=1?0:112);
  var h='<svg class="dg" viewBox="0 0 '+W+" "+H+'" role="img" aria-label="Weighted graph">';
  E.forEach(function(e){
    var a=pos[e.a],b=pos[e.b];
    h+='<line x1="'+f1(a.x)+'" y1="'+f1(a.y)+'" x2="'+f1(b.x)+'" y2="'+f1(b.y)+'" class="dg-edge"/>';
  });
  var placed=[];
  function segDist(px,py,s){
    var ax=pos[s.a].x,ay=pos[s.a].y,bx=pos[s.b].x,by=pos[s.b].y,dx=bx-ax,dy=by-ay,l2=dx*dx+dy*dy||1,u=Math.max(0,Math.min(1,((px-ax)*dx+(py-ay)*dy)/l2));
    return Math.sqrt(Math.pow(px-(ax+u*dx),2)+Math.pow(py-(ay+u*dy),2));
  }
  E.forEach(function(e,idx){
    var a=pos[e.a],b=pos[e.b],t=0.5,bestScore=-1,cands=[0.5,0.38,0.62,0.3,0.7,0.24,0.76];
    cands.forEach(function(c){
      var x=a.x+(b.x-a.x)*c,y=a.y+(b.y-a.y)*c,sc=1e9;
      E.forEach(function(o){if(o!==e)sc=Math.min(sc,segDist(x,y,o));});
      placed.forEach(function(q){sc=Math.min(sc,Math.sqrt(Math.pow(x-q[0],2)+Math.pow(y-q[1],2)));});
      if(sc>bestScore+0.5){bestScore=sc;t=c;}
    });
    var lx=a.x+(b.x-a.x)*t,ly=a.y+(b.y-a.y)*t;placed.push([lx,ly]);
    h+='<circle cx="'+f1(lx)+'" cy="'+f1(ly)+'" r="9" class="dg-wbg"/><text x="'+f1(lx)+'" y="'+f1(ly+4)+'" text-anchor="middle" class="dg-w">'+e.w+"</text>";
  });
  V.forEach(function(v){var p=pos[v];h+='<circle cx="'+f1(p.x)+'" cy="'+f1(p.y)+'" r="'+NR+'" class="dg-node"/><text x="'+f1(p.x)+'" y="'+f1(p.y+5)+'" text-anchor="middle" class="dg-label">'+esc(v)+"</text>";});
  return h+"</svg>";
}
function dijkstra(V,E,src){
  var adj={},dist={},prev={},done={},steps=[],k;
  V.forEach(function(v){adj[v]=[];dist[v]=Infinity;});
  E.forEach(function(e){adj[e.a].push([e.b,e.w]);adj[e.b].push([e.a,e.w]);});
  dist[src]=0;
  for(k=0;k<V.length;k++){
    var u=null;
    V.forEach(function(v){if(!done[v]&&dist[v]<Infinity&&(u===null||dist[v]<dist[u]))u=v;});
    if(u===null)break;
    done[u]=true;
    var upd=[];
    adj[u].forEach(function(p){if(!done[p[0]]&&dist[u]+p[1]<dist[p[0]]){dist[p[0]]=dist[u]+p[1];prev[p[0]]=u;upd.push(p[0]);}});
    steps.push({u:u,dist:JSON.parse(JSON.stringify(dist,function(key,val){return val===Infinity?"inf":val;})),upd:upd});
  }
  return {dist:dist,prev:prev,steps:steps};
}
function pathOf(prev,src,t){var p=[t];while(p[0]!==src&&prev[p[0]]!==undefined)p.unshift(prev[p[0]]);return p;}

/* ---- logic generators ---- */
var CONTEXTS=[["I revise every week","I pass the exam"],["the server is online","users can log in"],["it rains","the match is cancelled"],["you finish the lab","you get the marks"],["the battery is charged","the laptop starts"],["the file is saved","the data is safe"],["I study discrete structures","I understand relations"],["the user is logged in","the page shows the dashboard"]];
var TEMPL=[
 [1,"{P} only if {Q}","p → q"],[1,"{P} if {Q}","q → p"],[1,"{Q} is necessary for {P}","p → q"],[1,"{P} is sufficient for {Q}","p → q"],
 [1,"{P} is necessary and sufficient for {Q}","p ↔ q"],[1,"Whenever {P}, {Q}","p → q"],[1,"{Q} whenever {P}","p → q"],[1,"{P} if and only if {Q}","p ↔ q"],
 [2,"{P} unless {Q}","¬q → p"],[2,"{P}, but it is not true that {Q}","p ∧ ¬q"],[2,"Either it is not true that {P}, or it is not true that {Q}","¬p ∨ ¬q"],
 [2,"It is not true that {P}, and it is not true that {Q}","¬p ∧ ¬q"],[2,"{P} or {Q}, but not both","p ⊕ q"],[2,"If {P} then it is not true that {Q}","p → ¬q"],
 [2,"It is not the case that both {P} and {Q}","¬(p ∧ q)"],[2,"{Q} follows from {P}","p → q"],[3,"If it is not true that {P} then it is not true that {Q}","¬p → ¬q"],
 [3,"{P} only if it is not true that {Q}","p → ¬q"],[3,"It is not true that {P} unless {Q}","¬(¬q → p)"]
];
function cap(s){return s.charAt(0).toUpperCase()+s.slice(1);}
function genTranslate(seed,level){
  var r=RNG(seed),ctx=r.pick(CONTEXTS),pool=TEMPL.filter(function(t){return level===0?true:t[0]===level;});
  var t=r.pick(pool),sentence=cap(t[1].replace(/\{P\}/g,ctx[0]).replace(/\{Q\}/g,ctx[1]));
  var target=t[2];
  return {topic:"Logic",kind:"translate",level:t[0],
    prompt:'Let <span class="e">p</span> be "'+esc(ctx[0])+'" and <span class="e">q</span> be "'+esc(ctx[1])+'". Write this sentence as a formula in p and q:<br><b>'+esc(sentence)+'.</b>',
    inputs:[{id:"f",type:"formula",label:"Your formula (you may use any equivalent form)",placeholder:"for example p → ¬q"}],
    ans:{f:target},
    check:function(v){
      var s=String(v.f||"").trim();
      if(!s)return {ok:false,msg:"Type a formula first."};
      try{
        var e=eqCompare(s,target);
        if(e.ok)return {ok:true,msg:"Correct."+(stripOuter(s.replace(/\s+/g,""))!==target.replace(/\s+/g,"")?" Your formula is equivalent to "+target+".":"")};
        return {ok:false,msg:"Not quite. Your formula and the correct statement disagree when "+envText(e.vs,e.env)+": yours is "+tfc(e.a)+", the sentence needs "+tfc(e.b)+"."};
      }catch(err){return {ok:false,msg:err.message};}
    },
    hints:["First write the sentence in the form \"if … then …\" or \"… and …\", and say which part is p and which is q.","Key words: \"P only if Q\" is p → q. \"P if Q\" is q → p. \"necessary\" is the conclusion side, \"sufficient\" is the hypothesis side. \"unless\" means \"if not\".","Check by testing the row p = T, q = F: does the sentence say that situation is false or true? Your formula must agree."],
    solution:'Answer: <span class="e">'+esc(target)+'</span>. Pattern used: <i>'+esc(t[1].replace(/\{P\}/g,"P").replace(/\{Q\}/g,"Q"))+"</i>."};
}
function randFormula(r,vars,depth){
  if(depth===0||r.chance(0.2)){var v=r.pick(vars);return r.chance(0.3)?"¬"+v:v;}
  var op=r.pick(["∧","∨","→","→","↔","⊕"]);
  return "("+randFormula(r,vars,depth-1)+" "+op+" "+randFormula(r,vars,depth-1)+")";
}
function genTruthCol(seed,level){
  var r=RNG(seed),vars=level===3||(level===0&&r.chance(0.35))?["p","q","r"]:["p","q"],f,col,tries=0,vs;
  do{
    f=randFormula(r,vars,level===3?3:2);
    try{vs=varsIn(f);}catch(e){continue;}
    col=truthCol(f,vs);tries++;
  }while((vs.length!==vars.length||/^(T+|F+)$/.test(col))&&tries<200);
  var shown=stripOuter(f),rows=rowLabels(vs.length);
  return {topic:"Logic",kind:"truthcol",level:vars.length===3?3:(f.length>14?2:1),
    prompt:'Build the truth table of <b class="e">'+esc(shown)+'</b> and write its final column. List the rows in the usual order ('+rows.join(", ")+') and write the answer as one string of T and F, for example <span class="e">TFFT</span>.',
    inputs:[{id:"c",type:"text",label:"Final column",placeholder:"T/F string"}],
    ans:{c:col},
    check:function(v){
      var s=String(v.c||"").toUpperCase().replace(/[\s,]/g,"");
      if(!/^[TF]+$/.test(s))return {ok:false,msg:"Write only the letters T and F."};
      if(s.length!==col.length)return {ok:false,msg:"The table has "+col.length+" rows, so the answer needs "+col.length+" letters."};
      if(s===col)return {ok:true,msg:"Correct."};
      var bad=[];for(var i=0;i<col.length;i++)if(s.charAt(i)!==col.charAt(i))bad.push(rows[i]);
      return {ok:false,msg:"Not quite. Recheck the row"+(bad.length>1?"s ":" ")+bad.join(", ")+"."};
    },
    hints:["Make one column for every sub-expression, from the inside out, and list all "+rows.length+" rows.","Remember: p → q is false only on T then F. p ⊕ q is true when exactly one is true. p ↔ q is true when both match.","Fill the table column by column, not row by row, so each step uses one connective."],
    solution:'Final column (rows '+rows.join(", ")+'): <b class="e">'+col+"</b>."};
}
var LAWS=[
 ["Identity","p ∧ T","p"],["Identity","p ∨ F","p"],["Domination","p ∨ T","T"],["Domination","p ∧ F","F"],["Idempotent","p ∨ p","p"],["Idempotent","p ∧ p","p"],
 ["Double negation","¬(¬p)","p"],["Negation","p ∨ ¬p","T"],["Negation","p ∧ ¬p","F"],["Commutative","p ∨ q","q ∨ p"],["Commutative","p ∧ q","q ∧ p"],
 ["Associative","(p ∧ q) ∧ r","p ∧ (q ∧ r)"],["Associative","(p ∨ q) ∨ r","p ∨ (q ∨ r)"],["Distributive","p ∨ (q ∧ r)","(p ∨ q) ∧ (p ∨ r)"],["Distributive","p ∧ (q ∨ r)","(p ∧ q) ∨ (p ∧ r)"],
 ["Absorption","p ∨ (p ∧ q)","p"],["Absorption","p ∧ (p ∨ q)","p"],["De Morgan","¬(p ∧ q)","¬p ∨ ¬q"],["De Morgan","¬(p ∨ q)","¬p ∧ ¬q"]
];
var LAWNAMES=["Identity","Domination","Idempotent","Double negation","Negation","Commutative","Associative","Distributive","Absorption","De Morgan"];
var EQEXTRA=[["p → q","¬p ∨ q"],["p → q","¬q → ¬p"],["¬(p → q)","p ∧ ¬q"],["p ↔ q","(p → q) ∧ (q → p)"],["p ∨ q","¬p → q"],["(p → q) ∧ (p → r)","p → (q ∧ r)"],["(p → r) ∧ (q → r)","(p ∨ q) → r"],["p ↔ q","¬p ↔ ¬q"],["¬(p ↔ q)","p ↔ ¬q"]];
function permute(expr,r){
  var perm=r.shuffle(["p","q","r"]),m={p:perm[0],q:perm[1],r:perm[2]};
  return expr.replace(/[pqr]/g,function(c){return m[c];});
}
function genLawName(seed){
  var r=RNG(seed),L1=r.pick(LAWS),a=permute(L1[1],r),b;
  var m={};/* keep the same renaming for both sides */
  var r2=RNG(seed+7);
  var perm=r2.shuffle(["p","q","r"]);m={p:perm[0],q:perm[1],r:perm[2]};
  a=L1[1].replace(/[pqr]/g,function(c){return m[c];});b=L1[2].replace(/[pqr]/g,function(c){return m[c];});
  if(r.chance(0.5)){var t=a;a=b;b=t;}
  return {topic:"Logic",kind:"lawname",level:1,
    prompt:'Which law justifies this equivalence?<br><b class="e">'+esc(a)+" ≡ "+esc(b)+"</b>",
    inputs:[{id:"c",type:"choice",options:LAWNAMES}],
    ans:{c:L1[0]},
    check:function(v){return v.c===L1[0]?{ok:true,msg:"Correct: "+L1[0]+" law."}:{ok:false,msg:v.c?"Not that one. Look at the shape: where do the constants, the repeated variable, the brackets or the ¬ sit?":"Choose a law first."};},
    hints:["Look at what changes between the two sides: a constant T or F, a repeated variable, moved brackets, a swapped order, or a ¬ pushed inside?","T or F in an ∧/∨: identity or domination. Same variable twice: idempotent or absorption. Brackets moved only: associative. Order swapped: commutative.","¬ pushed inside with ∧ and ∨ flipping: De Morgan. ¬¬: double negation. p with ¬p: negation."],
    solution:"It is the <b>"+L1[0]+" law</b>."};
}
function genEquiv(seed){
  var r=RNG(seed),yes=r.chance(0.5),base,a,b,tries=0,res;
  var pool=LAWS.map(function(x){return [x[1],x[2]];}).concat(EQEXTRA);
  do{
    base=r.pick(pool);a=permute(base[0],r);
    var rr=RNG(seed);rr.f();/* only used for consistent renaming below */
    var perm=r.shuffle(["p","q","r"]),m={p:perm[0],q:perm[1],r:perm[2]};
    a=base[0].replace(/[pqr]/g,function(c){return m[c];});b=base[1].replace(/[pqr]/g,function(c){return m[c];});
    if(!yes){
      var swaps=[["∧","∨"],["∨","∧"],["→","↔"],["↔","→"],["→","∧"]];
      var sw=r.pick(swaps);
      if(b.indexOf(sw[0])>=0)b=b.replace(sw[0],sw[1]);
      else b="¬"+(b.length>1&&b.indexOf(" ")>=0?"("+b+")":b);
    }
    try{res=eqCompare(a,b);}catch(e){res={ok:yes};}
    tries++;
  }while(res.ok!==yes&&tries<100);
  var ok=res.ok;
  return {topic:"Logic",kind:"equiv",level:2,
    prompt:'Are these two statements logically equivalent?<br><b class="e">'+esc(a)+"</b><br>and<br><b class=\"e\">"+esc(b)+"</b>",
    inputs:[{id:"c",type:"choice",options:["Yes, equivalent","No, not equivalent"]}],
    ans:{c:ok?"Yes, equivalent":"No, not equivalent"},
    check:function(v){
      if(!v.c)return {ok:false,msg:"Choose yes or no."};
      var said=v.c.charAt(0)==="Y";
      return said===ok?{ok:true,msg:"Correct."}:{ok:false,msg:ok?"They do agree in every row. Try the truth table, or look for a named law.":"They differ in at least one row. Find it: when "+envText(res.vs,res.env)+" one is "+tfc(res.a)+" and the other is "+tfc(res.b)+"."};
    },
    hints:["Equivalent means the final columns agree in every row. One differing row proves they are not equivalent.","Try the rows T/F combinations that treat the connectives most differently, such as p = T, q = F.","If you suspect a known law (De Morgan, distributive, contrapositive), check whether the ∧/∨ flipped correctly."],
    solution:ok?"Yes: the truth-table columns agree in every row, so they are equivalent.":"No: for example when "+envText(res.vs,res.env)+" the first is "+tfc(res.a)+" and the second is "+tfc(res.b)+"."};
}
function genClassify(seed){
  var r=RNG(seed),target=r.pick(["tautology","contradiction","contingency"]),f,tries=0,kind;
  function classOf(s){var c=truthCol(s,varsIn(s));return /^T+$/.test(c)?"tautology":/^F+$/.test(c)?"contradiction":"contingency";}
  do{
    if(target==="tautology"){
      var x=r.pick(LAWS.concat([["","p → q","¬p ∨ q"]]));
      f=r.chance(0.5)?"("+x[1]+") ↔ ("+x[2]+")":r.pick(["(p ∧ q) → p","p → (p ∨ q)","¬p → (p → q)","(p ∧ (p → q)) → q","(p → q) ∨ (q → p)","¬(p ∧ ¬p)","((p → q) ∧ (q → r)) → (p → r)"]);
    }else if(target==="contradiction"){
      var z=randFormula(r,["p","q"],1);
      f=r.chance(0.5)?"("+z+") ∧ ¬("+z+")":r.pick(["p ∧ (p → ¬p)","(p ∨ q) ∧ ¬p ∧ ¬q","¬(p ∨ ¬p)","(p ↔ q) ∧ (p ⊕ q)","p ∧ ¬(p ∨ q)"]);
    }else{
      f=randFormula(r,["p","q","r"].slice(0,r.int(2,3)),2);
    }
    try{kind=classOf(f);}catch(e){kind=null;}
    tries++;
  }while(kind!==target&&tries<200);
  var shown=stripOuter(f);
  return {topic:"Logic",kind:"classify",level:2,
    prompt:'Is <b class="e">'+esc(shown)+'</b> a tautology, a contradiction or a contingency?',
    inputs:[{id:"c",type:"choice",options:["tautology","contradiction","contingency"]}],
    ans:{c:target},
    check:function(v){return v.c===target?{ok:true,msg:"Correct."}:{ok:false,msg:v.c?"Not quite. Look at the final column of the truth table: all T, all F, or a mixture?":"Choose one."};},
    hints:["Build the truth table (or reason about when it could be false).","All T in the final column: tautology. All F: contradiction. A mixture: contingency.","To show it is a contingency you only need one row giving T and one row giving F."],
    solution:"It is a <b>"+target+"</b> (final column: <span class=\"e\">"+truthCol(f,varsIn(f))+"</span>)."};
}

/* ---- algorithm generators ---- */
function distinctInts(r,n,lo,hi){var pool=[],i;for(i=lo;i<=hi;i++)pool.push(i);return r.sample(pool,n);}
function genLinear(seed){
  var r=RNG(seed),n=r.int(6,8),a=distinctInts(r,n,1,60),present=r.chance(0.7),x;
  if(present)x=r.pick(a);else{do{x=r.int(1,60);}while(a.indexOf(x)>=0);}
  var loc=a.indexOf(x)+1,cmp=loc?loc:n;
  return {topic:"Algorithms",kind:"linear",level:1,
    prompt:'Run the <b>linear search</b> algorithm for <span class="e">x = '+x+'</span> on the list <span class="e">'+a.join(", ")+'</span>. Give the returned <b>location</b> (0 if not found) and the number of list elements compared with x.',
    inputs:[{id:"loc",type:"text",label:"location",placeholder:"number"},{id:"cmp",type:"text",label:"elements compared with x",placeholder:"number"}],
    ans:{loc:String(loc),cmp:String(cmp)},
    check:function(v){
      try{var l=intVal(v.loc,"location"),c=intVal(v.cmp,"the number of comparisons");
        if(l!==loc)return {ok:false,msg:"The location is not right. Scan from the left; positions start at 1, and 0 means x is not in the list."};
        if(c!==cmp)return {ok:false,msg:"The location is right, but recount: each element you compare with x counts once, up to and including the match (or all "+n+" if x is absent)."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Start with i = 1 and compare x with a1, then a2, and so on.","Stop at the first element that equals x. The position of that element is the location.","If you reach the end without a match, the location is 0 and you compared all "+n+" elements."],
    solution:(loc?"x is at position "+loc+", after "+cmp+" comparisons.":"x is not in the list, so location = 0 after comparing all "+n+" elements.")};
}
function binTrace(a,x){
  var i=1,j=a.length,ms=[];
  while(i<j){var m=Math.floor((i+j)/2);ms.push(m);if(x>a[m-1])i=m+1;else j=m;}
  return {ms:ms,loc:(x===a[i-1])?i:0};
}
function genBinary(seed){
  var r=RNG(seed),n=r.int(8,16),a=distinctInts(r,n,1,70).sort(function(p,q){return p-q;}),present=r.chance(0.65),x;
  if(present)x=r.pick(a);else{do{x=r.int(1,70);}while(a.indexOf(x)>=0);}
  var t=binTrace(a,x);
  return {topic:"Algorithms",kind:"binary",level:2,
    prompt:'Run the <b>binary search</b> algorithm for <span class="e">x = '+x+'</span> on the sorted list <span class="e">'+a.join(", ")+'</span> (n = '+n+'). Use <span class="e">m := ⌊(i + j)/2⌋</span>, <span class="e">if x &gt; a<sub>m</sub> then i := m + 1 else j := m</span>. List the values of <b>m</b> in order, and give the final location (0 if not found).',
    inputs:[{id:"ms",type:"text",label:"values of m (comma separated)",placeholder:"for example 8, 12, 14"},{id:"loc",type:"text",label:"location",placeholder:"number"}],
    ans:{ms:t.ms.join(", "),loc:String(t.loc)},
    check:function(v){
      try{
        var u=parseNums(v.ms||""),l=intVal(v.loc,"location");
        if(u.join()!==t.ms.join())return {ok:false,msg:"The sequence of m values is not right. Start with i = 1, j = "+n+", and update i or j after each comparison. (The loop ends when i = j.)"};
        if(l!==t.loc)return {ok:false,msg:"The m values are right, but the final location is not. After the loop, compare x with a_i."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Start with i = 1 and j = "+n+". Then m = ⌊(1 + "+n+")/2⌋.","Compare x with a_m. If x is bigger, set i := m + 1; otherwise set j := m. Repeat while i < j.","When i = j, compare x with a_i. If equal, that i is the location; otherwise the location is 0."],
    solution:"m values: "+t.ms.join(", ")+". Final location: "+t.loc+(t.loc?"":" (x is not in the list)")+"."};
}
function bubblePasses(a,k){
  var arr=a.slice(),n=arr.length,i,j,t;
  for(i=1;i<=k;i++)for(j=0;j<n-i;j++)if(arr[j]>arr[j+1]){t=arr[j];arr[j]=arr[j+1];arr[j+1]=t;}
  return arr;
}
function genBubble(seed){
  var r=RNG(seed),n=r.int(5,6),a=distinctInts(r,n,1,9),k=r.int(1,n-2),res=bubblePasses(a,k);
  return {topic:"Algorithms",kind:"bubble",level:1,
    prompt:'Use <b>bubble sort</b> (increasing order) on <span class="e">'+a.join(", ")+'</span>. Write the list after <b>pass '+k+'</b> (after the inner loop for i = '+k+' has finished).',
    inputs:[{id:"l",type:"text",label:"list after pass "+k,placeholder:"numbers separated by commas"}],
    ans:{l:res.join(", ")},
    check:function(v){
      try{var u=parseNums(v.l||"");
        if(u.length!==n)return {ok:false,msg:"The list should still have "+n+" numbers."};
        return u.join()===res.join()?{ok:true,msg:"Correct."}:{ok:false,msg:"Not quite. In each pass compare neighbours from the left and swap when the left one is bigger. After pass "+k+" the largest "+k+" number"+(k>1?"s are":" is")+" at the right end."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["In pass 1 compare (a1,a2), then (a2,a3), and so on, swapping when the left value is larger.","After pass 1 the largest number is at the right end. Pass 2 does the same on all but the last position.","Do the passes one at a time and write the whole list after each."],
    solution:"After pass "+k+": <span class=\"e\">"+res.join(", ")+"</span>."};
}
function insertionAfter(a,j){
  var arr=a.slice(),jj,i,m,k;
  for(jj=2;jj<=j;jj++){
    i=1;while(arr[jj-1]>arr[i-1])i++;
    m=arr[jj-1];
    for(k=0;k<=jj-i-1;k++)arr[jj-k-1]=arr[jj-k-2];
    arr[i-1]=m;
  }
  return arr;
}
function genInsertion(seed){
  var r=RNG(seed),n=r.int(5,6),a=distinctInts(r,n,1,9),j=r.int(2,n-1),res=insertionAfter(a,j);
  return {topic:"Algorithms",kind:"insertion",level:1,
    prompt:'Use <b>insertion sort</b> on <span class="e">'+a.join(", ")+'</span>. Write the list after the element in position <b>j = '+j+'</b> has been inserted (so the first '+j+' items are sorted).',
    inputs:[{id:"l",type:"text",label:"list after j = "+j,placeholder:"numbers separated by commas"}],
    ans:{l:res.join(", ")},
    check:function(v){
      try{var u=parseNums(v.l||"");
        if(u.length!==n)return {ok:false,msg:"The list should still have "+n+" numbers."};
        return u.join()===res.join()?{ok:true,msg:"Correct."}:{ok:false,msg:"Not quite. Insertion sort keeps the first j items sorted: take the next item and slide it left into its correct place among them. The items after position "+j+" have not been touched yet."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["The first item alone is already sorted. Start by inserting a2 into it.","For each j, take a_j and place it in the correct position among the sorted first j − 1 items.","Items after position j stay exactly where they were."],
    solution:"After inserting the item in position "+j+": <span class=\"e\">"+res.join(", ")+"</span>."};
}
var COINSETS=[[25,10,5,1],[25,10,5,1],[50,20,10,5],[10,6,1],[4,3,1],[20,15,1]];
function greedyCounts(c,n){var left=n,d=[];c.forEach(function(v){var k=0;while(left>=v){k++;left-=v;}d.push(k);});return {d:d,left:left,total:d.reduce(function(a,b){return a+b;},0)};}
function minCoins(c,n){var best=[0],v,k;for(v=1;v<=n;v++){best[v]=Infinity;for(k=0;k<c.length;k++)if(v>=c[k]&&best[v-c[k]]+1<best[v])best[v]=best[v-c[k]]+1;}return best[n];}
function genGreedy(seed){
  var r=RNG(seed),c=r.pick(COINSETS),n,g,tries=0,opt;
  do{
    n=c[c.length-1]===5?5*r.int(6,30):r.int(9,70);
    g=greedyCounts(c,n);opt=minCoins(c,n);tries++;
  }while((g.left>0||(c.length===3&&c[1]!==10&&tries<60&&g.total===opt&&r.chance(0.7))));
  var optimal=g.total===opt;
  return {topic:"Algorithms",kind:"greedy",level:2,
    prompt:'Use the greedy change-making algorithm with coins <span class="e">'+c.join(", ")+'</span> to make <span class="e">n = '+n+'</span>. Give the number of each coin used (in the order of the coins) and the total number of coins, then say whether greedy gave the fewest possible coins.',
    inputs:[{id:"d",type:"text",label:"coins used, in order ("+c.join(", ")+")",placeholder:"d1, d2, …"},{id:"t",type:"text",label:"total coins",placeholder:"number"},{id:"o",type:"choice",options:["Greedy is optimal here","Greedy is not optimal here"]}],
    ans:{d:g.d.join(", "),t:String(g.total),o:optimal?"Greedy is optimal here":"Greedy is not optimal here"},
    check:function(v){
      try{
        var d=parseNums(v.d||""),t=intVal(v.t,"the total");
        if(d.length!==c.length)return {ok:false,msg:"Give one number for each of the "+c.length+" coins (write 0 if a coin is not used)."};
        if(d.join()!==g.d.join())return {ok:false,msg:"Not quite. Greedy takes as many of the largest coin as fit, then moves to the next coin with what is left."};
        if(t!==g.total)return {ok:false,msg:"The counts are right; add them up again for the total."};
        if(!v.o)return {ok:false,msg:"Now decide whether greedy was optimal: is there a way to use fewer coins?"};
        if((v.o.indexOf("not")<0)!==optimal)return {ok:false,msg:optimal?"Greedy really is optimal here: no other combination uses fewer coins.":"Look for a better combination: the fewest possible is "+opt+" coin"+(opt>1?"s":"")+"."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Start with the largest coin: how many times does it fit in "+n+"? What is left?","Move to the next coin with the amount left, and repeat until nothing is left.","To test optimality, try replacing the largest coin by smaller ones and see if the total can drop."],
    solution:"Greedy: "+c.map(function(v,i){return g.d[i]+" × "+v;}).join(", ")+" = "+g.total+" coins. The true minimum is "+opt+" coin"+(opt>1?"s":"")+", so greedy is "+(optimal?"":"<b>not</b> ")+"optimal here."};
}
var PROCS=[
  {code:"procedure f(n: positive integer)\nwhile n > 0\n    n := n + 1",ans:"Finiteness",why:"n only grows, so n > 0 is always true and the loop never stops."},
  {code:"procedure g(n: positive integer)\nwhile n ≥ 0\n    m := 10/n\n    n := n − 1",ans:"Effectiveness",why:"When n reaches 0, the step m := 10/n cannot be performed."},
  {code:"procedure h(n: positive integer)\ntotal := 0\nwhile k < n\n    total := total + k\n    k := k + 1",ans:"Definiteness",why:"k is never given a starting value, so the test k < n is not precisely defined."},
  {code:"procedure pick(a, b: integers)\nx := either a or b",ans:"Definiteness",why:"The step does not say which of a or b to use, so it is not precisely defined."},
  {code:"procedure big(a1, …, an: integers)\nmax := a1\nfor i := 2 to n\n    if max > ai then max := ai\nreturn max",ans:"Correctness",why:"It terminates and every step is clear, but it returns the smallest element, not the largest."},
  {code:"procedure first3(a1, …, an: integers)\nmax := a1\nif a2 > max then max := a2\nif a3 > max then max := a3\nreturn max",ans:"Generality",why:"It only looks at the first three elements, so it does not solve the problem for every list."},
  {code:"procedure half(n: positive integer)\nwhile n ≠ 1\n    n := n/2",ans:"Finiteness",why:"For n = 3 the value goes 3 → 1.5 → 0.75 → … and never equals 1, so the loop does not stop."}
];
function genProps(seed){
  var r=RNG(seed),p=r.pick(PROCS);
  return {topic:"Algorithms",kind:"props",level:2,
    prompt:'Which property of an algorithm does this procedure lack?<pre class="code">'+esc(p.code)+"</pre>",
    inputs:[{id:"c",type:"choice",options:["Input","Output","Correctness","Finiteness","Effectiveness","Definiteness","Generality"]}],
    ans:{c:p.ans},
    check:function(v){return v.c===p.ans?{ok:true,msg:"Correct. "+p.why}:{ok:false,msg:v.c?"Not that one. Trace a small input and ask what goes wrong: does it stop? can every step be done? is every step precise? does it give the right answer for every input?":"Choose a property."};},
    hints:["Trace the procedure on a small input such as n = 3 or a short list.","Does it ever stop (finiteness)? Can every step actually be carried out (effectiveness)? Is every step precisely defined (definiteness)?","Does it give the right answer for every valid input (correctness) and work for every input of the right form (generality)?"],
    solution:"<b>"+p.ans+".</b> "+p.why};
}

/* ---- relation generators ---- */
var A4=["1","2","3","4"];
function randSubset(r,pairs,k){return r.sample(pairs,k);}
function genRel(r,A){
  var all=allPairs(A,A),kind=r.int(0,5),R=[],i,j;
  if(kind===0)R=randSubset(r,all,r.int(4,8));
  else if(kind===1){A.forEach(function(a){R.push([a,a]);});R=R.concat(randSubset(r,all,r.int(1,4)));}
  else if(kind===2){randSubset(r,all,r.int(2,4)).forEach(function(p){R.push(p);R.push([p[1],p[0]]);});}
  else if(kind===3){var f=r.pick([function(a,b){return +a<=+b;},function(a,b){return +a>=+b;},function(a,b){return +b%+a===0;}]);all.forEach(function(p){if(f(p[0],p[1])&&r.chance(0.8))R.push(p);});}
  else if(kind===4){
    var blocks=[],pool=r.shuffle(A),cut=r.int(1,A.length-1);
    blocks=[pool.slice(0,cut),pool.slice(cut)];
    blocks.forEach(function(b){b.forEach(function(x){b.forEach(function(y){R.push([x,y]);});});});
  }else{for(i=0;i<A.length-1;i++)if(r.chance(0.8))R.push([A[i],A[i+1]]);if(r.chance(0.5))R.push([A[0],A[A.length-1]]);}
  if(r.chance(0.3)&&R.length>2)R.splice(r.int(0,R.length-1),1);
  if(r.chance(0.25))R.push(r.pick(all));
  var u=uniq(R.map(function(p){return p.join("\u0001");})).map(function(k){return k.split("\u0001");});
  return u.length>=2?u:genRel(r,A);
}
function genCombine(seed){
  var r=RNG(seed),all=allPairs(A4,A4),R1,R2,op=r.pick(["∪","∩","1−2","2−1"]),res,tries=0,c;
  do{
    R1=r.sample(all,r.int(5,8));R2=r.sample(all,r.int(4,7));
    c=combine(R1,R2);res=op==="∪"?c.union:op==="∩"?c.inter:op==="1−2"?c.d12:c.d21;tries++;
  }while((c.inter.length<1||res.length<1)&&tries<50);
  var name=op==="∪"?"R<sub>1</sub> ∪ R<sub>2</sub>":op==="∩"?"R<sub>1</sub> ∩ R<sub>2</sub>":op==="1−2"?"R<sub>1</sub> − R<sub>2</sub>":"R<sub>2</sub> − R<sub>1</sub>";
  return {topic:"Relations",kind:"combine",level:1,
    prompt:'Let <span class="e">R<sub>1</sub> = '+esc(fmtSet(R1))+'</span> and <span class="e">R<sub>2</sub> = '+esc(fmtSet(R2))+'</span>. Find <b>'+name+'</b>.',
    inputs:[{id:"s",type:"area",label:"Your answer as pairs",placeholder:"(1,2), (2,3), …",rows:2}],
    ans:{s:fmtSet(res)},
    check:function(v){return pairsCheck(v.s||"",res);},
    hints:["Relations are sets of pairs, so use set operations on the pairs.","∪: everything in either. ∩: only pairs in both. R1 − R2: pairs in R1 that are not in R2.","Go through R1 pair by pair and tick whether it is also in R2."],
    solution:name+" = <span class=\"e\">"+esc(fmtSet(res))+"</span>."};
}
function genCompose(seed){
  var r=RNG(seed),A=["1","2","3"],B=["1","2","3","4"],C=["a","b","c"],R,S,c,tries=0;
  do{R=r.sample(allPairs(A,B),r.int(4,6));S=r.sample(allPairs(B,C),r.int(4,6));c=compose(R,S);tries++;}while(c.pairs.length<2&&tries<50);
  return {topic:"Relations",kind:"compose",level:2,
    prompt:'Let <span class="e">R = '+esc(fmtSet(R))+'</span> be a relation from {1,2,3} to {1,2,3,4}, and <span class="e">S = '+esc(fmtSet(S))+'</span> a relation from {1,2,3,4} to {a,b,c}. Find <b>S ∘ R</b>.',
    inputs:[{id:"s",type:"area",label:"S ∘ R as pairs",placeholder:"(1,a), …",rows:2}],
    ans:{s:fmtSet(c.pairs)},
    check:function(v){return pairsCheck(v.s||"",c.pairs);},
    hints:["R acts first, then S. For each pair (x, y) in R, look for pairs in S that start with that same y.","Each match (x, y) in R and (y, z) in S gives (x, z) in S ∘ R. The middle element y disappears.","Make a table: pair in R, matching pairs in S, resulting pair. Remove duplicates."],
    solution:"Chains: "+c.steps.map(function(s){return fmt(s.p)+" and "+fmt(s.q)+" give "+fmt(s.r);}).join("; ")+".<br>S ∘ R = <span class=\"e\">"+esc(fmtSet(c.pairs))+"</span>."};
}
var PROPNAMES=["Reflexive","Symmetric","Antisymmetric","Transitive"];
function trueProps(A,R){var P=relProps(A,R),o=[];if(P.refl.ok)o.push("Reflexive");if(P.sym.ok)o.push("Symmetric");if(P.anti.ok)o.push("Antisymmetric");if(P.trans.ok)o.push("Transitive");return o;}
function genRelProps(seed){
  var r=RNG(seed),A=r.chance(0.5)?A4:["1","2","3"],R=genRel(r,A),t=trueProps(A,R);
  return {topic:"Relations",kind:"relprops",level:2,
    prompt:'Let <span class="e">R = '+esc(fmtSet(R))+'</span> be a relation on <span class="e">'+setStr(A)+'</span>. Tick every property that R has.',
    inputs:[{id:"c",type:"checks",options:PROPNAMES}],
    ans:{c:t},
    check:function(v){
      var got=(v.c||[]).slice().sort().join(),want=t.slice().sort().join();
      if(got===want)return {ok:true,msg:"Correct."};
      var P=relProps(A,R),bad=[];
      if((v.c||[]).indexOf("Reflexive")>=0!==P.refl.ok)bad.push("Reflexive");
      if((v.c||[]).indexOf("Symmetric")>=0!==P.sym.ok)bad.push("Symmetric");
      if((v.c||[]).indexOf("Antisymmetric")>=0!==P.anti.ok)bad.push("Antisymmetric");
      if((v.c||[]).indexOf("Transitive")>=0!==P.trans.ok)bad.push("Transitive");
      return {ok:false,msg:"Not quite. Recheck: "+bad.join(", ")+"."};
    },
    hints:["Reflexive: is (a, a) present for every a in the set? Symmetric: does every (x, y) have (y, x)?","Antisymmetric: for x ≠ y, is there ever both (x, y) and (y, x)? Transitive: for each chain (x, y), (y, z) is (x, z) present?","Remember: loops never break symmetric or antisymmetric. No chains means transitive."],
    solution:"R has: <b>"+(t.length?t.join(", "):"none of the four properties")+"</b>.<div class=\"props-sol\">"+propsHtml(A,R)+"</div>"};
}
function genMatrixOf(seed){
  var r=RNG(seed),A=r.chance(0.6)?["1","2","3"]:A4,R=genRel(r,A),M=relMatrix(A,A,R);
  return {topic:"Relations",kind:"matrixof",level:1,
    prompt:'Write the zero-one matrix of the relation <span class="e">R = '+esc(fmtSet(R))+'</span> on <span class="e">'+setStr(A)+'</span> (rows and columns in increasing order). Type one row per line, with spaces between the entries.',
    inputs:[{id:"m",type:"area",label:"Matrix M_R",placeholder:"1 0 1\n0 1 0\n…",rows:A.length}],
    ans:{m:matMono(M)},
    check:function(v){return matrixCheck(v.m||"",M);},
    hints:["The matrix has "+A.length+" rows and "+A.length+" columns. Row = first element, column = second element.","Put 1 in row i, column j exactly when the pair (i, j) is in R. Everything else is 0.","Go through the pairs one at a time and mark each in the matrix."],
    solution:"<pre>"+matMono(M)+"</pre>"};
}
function genPairsOfMatrix(seed){
  var r=RNG(seed),A=["1","2","3"],R=genRel(r,A),M=relMatrix(A,A,R);
  return {topic:"Relations",kind:"matrixpairs",level:1,
    prompt:'The matrix of a relation R on {1,2,3} (rows and columns in increasing order) is shown. List the ordered pairs in R.'+matTable(M,A,A,"M<sub>R</sub>"),
    inputs:[{id:"s",type:"area",label:"Ordered pairs of R",placeholder:"(1,1), …",rows:2}],
    ans:{s:fmtSet(R)},
    check:function(v){return pairsCheck(v.s||"",R);},
    hints:["Each 1 gives one pair.","The pair is (row number, column number).","Read row 1 first, then row 2, then row 3."],
    solution:"R = <span class=\"e\">"+esc(fmtSet(R))+"</span>."};
}
function genMatrixProps(seed){
  var r=RNG(seed),A=r.chance(0.5)?["1","2","3"]:A4,R=genRel(r,A),M=relMatrix(A,A,R),P=relProps(A,R),t=[];
  if(P.refl.ok)t.push("Reflexive");if(P.sym.ok)t.push("Symmetric");if(P.anti.ok)t.push("Antisymmetric");
  return {topic:"Relations",kind:"matrixprops",level:2,
    prompt:'The zero-one matrix of a relation on '+setStr(A)+' is shown. Tick every property that the relation has.'+matTable(M,A,A,"M<sub>R</sub>"),
    inputs:[{id:"c",type:"checks",options:["Reflexive","Symmetric","Antisymmetric"]}],
    ans:{c:t},
    check:function(v){return (v.c||[]).slice().sort().join()===t.slice().sort().join()?{ok:true,msg:"Correct."}:{ok:false,msg:"Not quite. Reflexive: whole diagonal is 1. Symmetric: the matrix equals its mirror image. Antisymmetric: no mirrored pair of 1s off the diagonal."};},
    hints:["Reflexive: look only at the main diagonal. Are all entries 1?","Symmetric: compare each entry with its mirror image across the diagonal (m_ij with m_ji).","Antisymmetric: is there any off-diagonal position where m_ij and m_ji are both 1?"],
    solution:"The relation is: <b>"+(t.length?t.join(", "):"none of these")+"</b>."};
}
function genPartition(seed){
  var r=RNG(seed),S=r.sample(LETTERS,r.int(5,6)),flaw=r.int(0,5),cut=r.int(2,S.length-2);
  var blocks=[S.slice(0,cut),S.slice(cut)];
  if(S.length>=6&&r.chance(0.5)){blocks=[S.slice(0,2),S.slice(2,4),S.slice(4)];}
  blocks=blocks.filter(function(b){return b.length;});
  var shown;
  var big=blocks.map(function(b,i){return {i:i,n:b.length};}).sort(function(a,b){return b.n-a.n;})[0].i;
  if(flaw===1){blocks[big]=blocks[big].slice(1);}
  else if(flaw===2){var other=(big+1)%blocks.length;blocks[other]=blocks[other].concat([blocks[big][0]]);}
  else if(flaw===3){blocks.push([]);}
  else if(flaw===4){var out;do{out=r.pick(LETTERS);}while(S.indexOf(out)>=0);blocks[big]=blocks[big].concat([out]);}
  shown=blocks.map(function(b){return b.length?(flaw===5&&b===blocks[big]?"{"+b.concat([b[0]]).join(", ")+"}":"{"+b.join(", ")+"}"):"∅";}).join(", ");
  var c=checkPartition(S,blocks);
  var reason=c.ok?"It is a partition":!c.nonempty?"Not a partition: a subset is empty":c.outside.length?"Not a partition: it contains an element outside the set":c.overlap.length?"Not a partition: two subsets overlap":"Not a partition: an element is missing";
  var why=c.ok?"The subsets are nonempty, disjoint, and their union is S. (Repeating a letter inside one subset changes nothing, because a set ignores repeats.)":reason.replace("Not a partition: ","Not a partition because ");
  return {topic:"Relations",kind:"partition",level:1,
    prompt:'Is the collection <span class="e">'+esc(shown)+'</span> a partition of <span class="e">'+esc(setStr(S))+'</span>?',
    inputs:[{id:"c",type:"choice",options:["It is a partition","Not a partition: an element is missing","Not a partition: two subsets overlap","Not a partition: a subset is empty","Not a partition: it contains an element outside the set"]}],
    ans:{c:reason},
    check:function(v){
      if(!v.c)return {ok:false,msg:"Choose one."};
      if(v.c===reason)return {ok:true,msg:"Correct. "+why};
      return {ok:false,msg:"Not quite. Test the three conditions: every subset nonempty, no element in two subsets, and the union is exactly the whole set."};
    },
    hints:["A partition needs three things: nonempty subsets, subsets that do not overlap, and a union equal to the whole set.","List every letter that appears in the collection. Is every letter of the set there? Is any extra letter there?","Check whether any letter appears in two different subsets, and whether any subset is ∅."],
    solution:why+"."};
}
function genEquivCount(seed){
  var r=RNG(seed),S=["0","1","2","3","4","5"],k=r.int(2,4),cuts=r.sample([1,2,3,4,5],k-1).sort(function(a,b){return a-b;}),pool=r.shuffle(S),blocks=[],prev=0;
  cuts.concat([6]).forEach(function(c){blocks.push(pool.slice(prev,c).sort());prev=c;});
  blocks.sort(function(a,b){return +a[0]-+b[0];});
  var total=0,loop=S.length,off;blocks.forEach(function(b){total+=b.length*b.length;});off=total-loop;
  return {topic:"Relations",kind:"equivcount",level:2,
    prompt:'The partition <span class="e">'+blocks.map(function(b){return "{"+b.join(", ")+"}";}).join(", ")+'</span> of {0,1,2,3,4,5} defines an equivalence relation (a ∼ b when a and b are in the same subset). How many <b>ordered pairs</b> are in the relation, and how many of them have a ≠ b?',
    inputs:[{id:"t",type:"text",label:"total ordered pairs",placeholder:"number"},{id:"o",type:"text",label:"pairs with a ≠ b",placeholder:"number"}],
    ans:{t:String(total),o:String(off)},
    check:function(v){
      try{var t=intVal(v.t,"the total"),o=intVal(v.o,"the number with a ≠ b");
        if(t!==total)return {ok:false,msg:"Not quite. Inside a subset with k elements every element is related to every element (including itself): k × k ordered pairs."};
        if(o!==off)return {ok:false,msg:"The total is right. The pairs (a, a) are the 6 loops, one for each element. Take them away."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Two elements are related exactly when they sit in the same subset.","A subset with k elements gives k × k ordered pairs (every element with every element, including itself).","Add the k × k values for all subsets. The loops (a, a) number 6, one per element."],
    solution:"Subset sizes give "+blocks.map(function(b){return b.length+"² = "+b.length*b.length;}).join(" + ")+" = <b>"+total+"</b> ordered pairs. Removing the 6 loops leaves <b>"+off+"</b> pairs with a ≠ b."};
}
function genReadDigraph(seed){
  var r=RNG(seed),R=genRel(r,A4);
  while(R.length>8)R.pop();
  return {topic:"Relations",kind:"readgraph",level:1,
    prompt:'Write the ordered pairs of the relation shown by this digraph.'+multiSvg(A4,R,true,"x-arrow-"+seed),
    inputs:[{id:"s",type:"area",label:"Ordered pairs",placeholder:"(1,2), …",rows:2}],
    ans:{s:fmtSet(R)},
    check:function(v){return pairsCheck(v.s||"",R);},
    hints:["Each arrow from x to y is the ordered pair (x, y). The tail is the first entry.","A loop at x is (x, x). Two opposite arrows between x and y give two pairs: (x, y) and (y, x).","Go vertex by vertex: list every arrow that leaves vertex 1, then vertex 2, and so on."],
    solution:"R = <span class=\"e\">"+esc(fmtSet(R))+"</span>."};
}

/* ---- graph generators ---- */
var GL=["a","b","c","d","e","f","g"];
function degreesOf(V,E){
  var inn={},out={};V.forEach(function(v){inn[v]=0;out[v]=0;});
  E.forEach(function(e){out[e[0]]++;inn[e[1]]++;});
  return {inn:inn,out:out};
}
function randMulti(r,core,m,allowLoops){
  var E=[],i,a,b;
  for(i=0;i<m;i++){
    a=r.pick(core);b=(allowLoops&&r.chance(0.12))?a:r.pick(core);
    E.push([a,b]);
  }
  if(r.chance(0.7)&&E.length>2){E.push(E[r.int(0,E.length-1)].slice());}
  return E;
}
function genDegrees(seed){
  var r=RNG(seed),iso=r.chance(0.4),V=iso?["a","b","c","d","e"]:["a","b","c","d"],core=V.slice(0,4),E=randMulti(r,core,r.int(6,9),true),D=degreesOf(V,E);
  var gridAns=V.map(function(v){return [String(D.inn[v]),String(D.out[v])];});
  return {topic:"Graphs",kind:"degrees",level:2,
    prompt:'Find the <b>in-degree</b> and <b>out-degree</b> of every vertex of this directed multigraph (a loop adds 1 to the in-degree and 1 to the out-degree of its vertex). Then give the sum of all in-degrees and the sum of all out-degrees.'+multiSvg(V,E,true,"x-arrow-"+seed),
    inputs:[{id:"g",type:"grid",rows:V,cols:["in-degree","out-degree"]},{id:"si",type:"text",label:"sum of in-degrees",placeholder:"number"},{id:"so",type:"text",label:"sum of out-degrees",placeholder:"number"}],
    ans:{g:gridAns,si:String(E.length),so:String(E.length)},
    check:function(v){
      try{
        var bad=[];
        V.forEach(function(x,i){var a=intVal((v.g[i]||[])[0],"the in-degree of "+x),b=intVal((v.g[i]||[])[1],"the out-degree of "+x);if(a!==D.inn[x]||b!==D.out[x])bad.push(x);});
        if(bad.length)return {ok:false,msg:"Recheck vertex "+bad.join(", ")+". In-degree counts arrows arriving at the vertex, out-degree counts arrows leaving it. Count every parallel arrow."};
        var si=intVal(v.si,"the sum of in-degrees"),so=intVal(v.so,"the sum of out-degrees");
        if(si!==E.length||so!==E.length)return {ok:false,msg:"The degrees are right. The sums are each equal to the number of edges, because every edge leaves one vertex and enters one vertex."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["For each vertex, count arrows arriving (in) and arrows leaving (out). Parallel arrows each count.","A loop counts once as in and once as out for its vertex.","Check yourself: the sum of the in-degrees and the sum of the out-degrees must both equal the number of edges."],
    solution:"<div class=\"scroll\"><table><tr><th>vertex</th><th>in</th><th>out</th></tr>"+V.map(function(x){return "<tr><td>"+x+"</td><td>"+D.inn[x]+"</td><td>"+D.out[x]+"</td></tr>";}).join("")+"</table></div>Both sums equal the number of edges: <b>"+E.length+"</b>."};
}
function adjMatrixDirected(V,E){var idx={},M=V.map(function(){return V.map(function(){return 0;});});V.forEach(function(v,i){idx[v]=i;});E.forEach(function(e){M[idx[e[0]]][idx[e[1]]]++;});return M;}
function genAdjMatrix(seed){
  var r=RNG(seed),V=["a","b","c","d"],E=randMulti(r,V,r.int(6,9),true),M=adjMatrixDirected(V,E);
  return {topic:"Graphs",kind:"admatrix",level:2,
    prompt:'Write the adjacency matrix of this directed multigraph, with the vertices in alphabetical order (the entry in row i, column j is the number of edges from vertex i to vertex j). Type one row per line.'+multiSvg(V,E,true,"x-arrow-"+seed),
    inputs:[{id:"m",type:"area",label:"Adjacency matrix",placeholder:"0 1 0 0\n…",rows:4}],
    ans:{m:matMono(M)},
    check:function(v){return matrixCheck(v.m||"",M);},
    hints:["Rows and columns are the vertices a, b, c, d in order. Row = where the edge starts, column = where it ends.","The entry counts parallel edges: two arrows from b to c give a 2 in row b, column c.","A loop at a vertex gives a 1 on the diagonal."],
    solution:"<pre>"+matMono(M)+"</pre>"};
}
function genAdjList(seed){
  var r=RNG(seed),V=r.chance(0.4)?["a","b","c","d","e"]:["a","b","c","d"],core=V.slice(0,4),all=allPairs(core,core).filter(function(p){return p[0]!==p[1]||r.chance(0.2);}),E=r.sample(all,r.int(5,8)),L={};
  V.forEach(function(v){L[v]=[];});E.forEach(function(e){L[e[0]].push(e[1]);});V.forEach(function(v){L[v].sort();});
  return {topic:"Graphs",kind:"adjlist",level:2,
    prompt:'Write the adjacency list of this directed graph: for each vertex, list the vertices it points to. Type one line per vertex, like <span class="e">a: b, c</span> (leave the list empty if the vertex points to nothing).'+multiSvg(V,E,true,"x-arrow-"+seed),
    inputs:[{id:"l",type:"area",label:"Adjacency list",placeholder:"a: b, c\nb: …",rows:V.length}],
    ans:{l:V.map(function(v){return v+": "+L[v].join(", ");}).join("\n")},
    check:function(v){
      var got={},lines=String(v.l||"").split(/\n/).map(function(x){return x.trim();}).filter(Boolean),bad=[];
      lines.forEach(function(ln){var m=/^([A-Za-z0-9]+)\s*(?::|->|→|-)?\s*(.*)$/.exec(ln);if(m)got[m[1]]=uniq(m[2].split(/[\s,;]+/).filter(Boolean)).sort();});
      V.forEach(function(x){if((got[x]||[]).join()!==L[x].join())bad.push(x);});
      return bad.length?{ok:false,msg:"Recheck the line for vertex "+bad.join(", ")+". List every vertex that this vertex has an arrow to."}:{ok:true,msg:"Correct."};
    },
    hints:["For each vertex, find all arrows that leave it. Their targets form its list.","A loop at a vertex means the vertex appears in its own list.","Do every vertex, including ones with no outgoing arrows (their list is empty)."],
    solution:"<pre>"+V.map(function(v){return v+": "+(L[v].join(", ")||"(none)");}).join("\n")+"</pre>"};
}
function genMatrixFacts(seed){
  var r=RNG(seed),V=["a","b","c","d"],n=4,M=V.map(function(){return V.map(function(){return 0;});}),i,j;
  for(i=0;i<n;i++)for(j=i;j<n;j++){
    if(i===j){M[i][i]=r.chance(0.35)?1:0;}
    else{var w=r.chance(0.5)?0:r.int(1,2);M[i][j]=w;M[j][i]=w;}
  }
  var edges=0,loops=0;
  for(i=0;i<n;i++)for(j=i;j<n;j++){edges+=M[i][j];if(i===j)loops+=M[i][i];}
  var vi=r.int(0,3),deg=0;for(j=0;j<n;j++)deg+=(j===vi)?2*M[vi][vi]:M[vi][j];
  return {topic:"Graphs",kind:"matfacts",level:3,
    prompt:'This is the adjacency matrix of an <b>undirected</b> multigraph with vertices a, b, c, d in order (a 1 on the diagonal is a loop).'+matTable(M,V,V,"A")+'How many edges does the graph have, how many of them are loops, and what is the degree of vertex <b>'+V[vi]+'</b>? (A loop adds 2 to the degree of its vertex.)',
    inputs:[{id:"e",type:"text",label:"number of edges",placeholder:"number"},{id:"l",type:"text",label:"number of loops",placeholder:"number"},{id:"d",type:"text",label:"degree of "+V[vi],placeholder:"number"}],
    ans:{e:String(edges),l:String(loops),d:String(deg)},
    check:function(v){
      try{
        var e=intVal(v.e,"edges"),l=intVal(v.l,"loops"),d=intVal(v.d,"the degree");
        if(l!==loops)return {ok:false,msg:"Loops are the 1s on the diagonal. Count them."};
        if(e!==edges)return {ok:false,msg:"Each edge between two different vertices shows up twice in a symmetric matrix (above and below the diagonal), so count it once. Add the loops."};
        if(d!==deg)return {ok:false,msg:"Degree of "+V[vi]+": add the entries in its row, but remember a loop on the diagonal counts 2."};
        return {ok:true,msg:"Correct."};
      }catch(er){return {ok:false,msg:er.message};}
    },
    hints:["Because the graph is undirected, the matrix is symmetric. An edge between two different vertices appears twice.","Number of edges = (sum of entries above the diagonal) + (sum of diagonal entries).","Degree of a vertex = sum of its row entries off the diagonal, plus 2 for each loop."],
    solution:"Edges = "+edges+" (above the diagonal plus the loops), loops = "+loops+", degree of "+V[vi]+" = "+deg+"."};
}
function genHandshake(seed){
  var r=RNG(seed),m=r.int(6,15),k=r.int(6,15);
  return {topic:"Graphs",kind:"handshake",level:1,
    prompt:'An undirected graph (loops allowed, a loop counts 2 towards the degree) has <b>'+m+' edges</b>. A directed multigraph has <b>'+k+' edges</b>. What is (i) the sum of the degrees of the undirected graph, and (ii) the sum of the in-degrees of the directed multigraph?',
    inputs:[{id:"a",type:"text",label:"(i) sum of degrees",placeholder:"number"},{id:"b",type:"text",label:"(ii) sum of in-degrees",placeholder:"number"}],
    ans:{a:String(2*m),b:String(k)},
    check:function(v){
      try{var a=intVal(v.a,"(i)"),b=intVal(v.b,"(ii)");
        if(a!==2*m)return {ok:false,msg:"Every edge has two ends, and each end adds 1 to a degree. So the degrees add up to twice the number of edges."};
        if(b!==k)return {ok:false,msg:"Every directed edge enters exactly one vertex, so the in-degrees add up to the number of edges."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Think about what one edge contributes to the degree total.","An undirected edge has two ends: it adds 2 to the sum of degrees.","A directed edge enters exactly one vertex: it adds 1 to the sum of in-degrees."],
    solution:"(i) 2 × "+m+" = <b>"+2*m+"</b>. (ii) <b>"+k+"</b>, the number of edges."};
}
function genDijkstra(seed){
  var r=RNG(seed),n=r.int(6,7),V="ABCDEFG".split("").slice(0,n),E=[],have={},i,k;
  function addEdge(a,b){var key=[a,b].sort().join("");if(have[key]||a===b)return false;have[key]=1;E.push({a:a,b:b,w:r.int(1,9)});return true;}
  for(i=1;i<n;i++)addEdge(V[i],V[r.int(0,i-1)]);
  k=r.int(3,5);var tries=0;while(k>0&&tries<60){if(addEdge(r.pick(V),r.pick(V)))k--;tries++;}
  var res=dijkstra(V,E,"A"),others=V.slice(1),far=others.slice().sort(function(a,b){return res.dist[b]-res.dist[a]||(a<b?-1:1);})[0];
  var wmap={};E.forEach(function(e){wmap[e.a+e.b]=e.w;wmap[e.b+e.a]=e.w;});
  var ansGrid=others.map(function(v){return [String(res.dist[v])];});
  return {topic:"Graphs",kind:"dijkstra",level:3,
    prompt:'Use <b>Dijkstra\'s algorithm</b> from vertex <b>A</b> on this weighted graph (numbers are edge weights). Give the shortest distance from A to every other vertex, and write one shortest path from A to <b>'+far+'</b> using hyphens, like <span class="e">A-C-F</span>.'+weightedSvg(V,E),
    inputs:[{id:"g",type:"grid",rows:others,cols:["distance from A"]},{id:"p",type:"text",label:"a shortest path from A to "+far,placeholder:"A-…-"+far}],
    ans:{g:ansGrid,p:pathOf(res.prev,"A",far).join("-")},
    check:function(v){
      try{
        var bad=[];others.forEach(function(x,i){var d=intVal((v.g[i]||[])[0],"the distance to "+x);if(d!==res.dist[x])bad.push(x);});
        if(bad.length)return {ok:false,msg:"Recheck the distance to "+bad.join(", ")+". Always finalise the unvisited vertex with the smallest current distance, then update its neighbours (a new distance only replaces an old one if it is smaller)."};
        var p=String(v.p||"").toUpperCase().split(/[^A-Z0-9]+/).filter(Boolean);
        if(!p.length||p[0]!=="A"||p[p.length-1]!==far)return {ok:false,msg:"The distances are right. Now write a path that starts at A and ends at "+far+"."};
        var tot=0;for(var i=0;i+1<p.length;i++){var w=wmap[p[i]+p[i+1]];if(w===undefined)return {ok:false,msg:"The distances are right, but "+p[i]+" and "+p[i+1]+" are not joined by an edge."};tot+=w;}
        if(tot!==res.dist[far])return {ok:false,msg:"Your path uses valid edges but has total weight "+tot+", not the shortest "+res.dist[far]+"."};
        return {ok:true,msg:"Correct."};
      }catch(e){return {ok:false,msg:e.message};}
    },
    hints:["Start with distance 0 at A and infinity everywhere else. Finalise A, then update each neighbour of A with its edge weight.","Next finalise the unvisited vertex with the smallest current distance, and update its neighbours: new distance = (distance of this vertex) + (edge weight), keep it only if it is smaller.","Repeat until every vertex is finalised. To get the path, remember from which vertex each final distance came."],
    solution:"Distances from A: "+others.map(function(v){return v+" = "+res.dist[v];}).join(", ")+". One shortest path to "+far+": <b>"+pathOf(res.prev,"A",far).join("-")+"</b> (length "+res.dist[far]+")."};
}

/* ---- registry ---- */
var KINDS=[
  {id:"translate",topic:"Logic",name:"Translate a sentence into logic",gen:genTranslate},
  {id:"truthcol",topic:"Logic",name:"Truth table: final column",gen:genTruthCol},
  {id:"classify",topic:"Logic",name:"Tautology, contradiction or contingency",gen:genClassify},
  {id:"equiv",topic:"Logic",name:"Are two statements equivalent?",gen:genEquiv},
  {id:"lawname",topic:"Logic",name:"Name the law",gen:genLawName},
  {id:"props",topic:"Algorithms",name:"Which property is missing?",gen:genProps},
  {id:"linear",topic:"Algorithms",name:"Linear search trace",gen:genLinear},
  {id:"binary",topic:"Algorithms",name:"Binary search trace",gen:genBinary},
  {id:"bubble",topic:"Algorithms",name:"Bubble sort passes",gen:genBubble},
  {id:"insertion",topic:"Algorithms",name:"Insertion sort steps",gen:genInsertion},
  {id:"greedy",topic:"Algorithms",name:"Greedy change-making",gen:genGreedy},
  {id:"combine",topic:"Relations",name:"Union, intersection, difference",gen:genCombine},
  {id:"compose",topic:"Relations",name:"Composition S ∘ R",gen:genCompose},
  {id:"relprops",topic:"Relations",name:"Properties of a relation",gen:genRelProps},
  {id:"matrixof",topic:"Relations",name:"Relation to matrix",gen:genMatrixOf},
  {id:"matrixpairs",topic:"Relations",name:"Matrix to ordered pairs",gen:genPairsOfMatrix},
  {id:"matrixprops",topic:"Relations",name:"Properties from a matrix",gen:genMatrixProps},
  {id:"readgraph",topic:"Relations",name:"Read a digraph",gen:genReadDigraph},
  {id:"partition",topic:"Relations",name:"Is it a partition?",gen:genPartition},
  {id:"equivcount",topic:"Relations",name:"Equivalence relation from a partition",gen:genEquivCount},
  {id:"handshake",topic:"Graphs",name:"Degree sums",gen:genHandshake},
  {id:"degrees",topic:"Graphs",name:"In-degree and out-degree",gen:genDegrees},
  {id:"admatrix",topic:"Graphs",name:"Adjacency matrix of a digraph",gen:genAdjMatrix},
  {id:"adjlist",topic:"Graphs",name:"Adjacency list",gen:genAdjList},
  {id:"matfacts",topic:"Graphs",name:"Facts from an adjacency matrix",gen:genMatrixFacts},
  {id:"dijkstra",topic:"Graphs",name:"Dijkstra's algorithm",gen:genDijkstra}
];
var TOPICS=["Logic","Algorithms","Relations","Graphs"];
function kindById(id){for(var i=0;i<KINDS.length;i++)if(KINDS[i].id===id)return KINDS[i];return null;}
function makeQuestion(id,seed,level){
  var k=kindById(id),q=k.gen(seed,level||0);
  q.id=k.id;q.name=k.name;q.seed=seed;q.code=k.id+"-"+seed;q.topic=k.topic;
  return q;
}

/* ===================== EXAM LAB: interface ===================== */
var XKEY="ckc111-exam",xstate={kinds:{}},xid=0;
function xload(){try{var s=localStorage.getItem(XKEY);if(s){var o=JSON.parse(s);if(o&&o.kinds)xstate=o;}}catch(e){}}
function xsave(){try{localStorage.setItem(XKEY,JSON.stringify(xstate));}catch(e){}}
function grade(q,vals){
  try{var r=q.check(vals);return r||{ok:false,msg:"Could not check that answer."};}
  catch(e){return {ok:false,msg:e.message};}
}
function record(q,ok){
  var k=xstate.kinds[q.id]||(xstate.kinds[q.id]={att:0,ok:0});
  k.att++;if(ok)k.ok++;xsave();renderProgress();
}
function buildInputs(q,host,uid){
  var getters=[];
  q.inputs.forEach(function(inp){
    var wrap=document.createElement("div");wrap.className="xfield";var lid=uid+"-"+inp.id,get;
    if(inp.type==="text"||inp.type==="formula"){
      wrap.innerHTML='<label for="'+lid+'">'+esc(inp.label||"Answer")+'</label><input type="text" id="'+lid+'" placeholder="'+esc(inp.placeholder||"")+'" autocomplete="off" spellcheck="false">';
      var el=wrap.querySelector("input");get=function(){return el.value;};
      if(inp.type==="formula"){
        var keys=document.createElement("div");keys.className="keys";
        ["¬","∧","∨","⊕","→","↔","(",")"].forEach(function(s){
          var b=document.createElement("button");b.type="button";b.textContent=s;b.setAttribute("aria-label","Insert "+s);
          b.addEventListener("click",function(){window.CKCLogic.insertAt(el,s);});keys.appendChild(b);
        });
        wrap.appendChild(keys);
      }
    }else if(inp.type==="area"){
      wrap.innerHTML='<label for="'+lid+'">'+esc(inp.label||"Answer")+'</label><textarea id="'+lid+'" class="mxarea" rows="'+(inp.rows||3)+'" placeholder="'+esc(inp.placeholder||"")+'" spellcheck="false"></textarea>';
      var ta=wrap.querySelector("textarea");get=function(){return ta.value;};
    }else if(inp.type==="choice"){
      var h='<div role="radiogroup" aria-label="Choose one" class="xchoices">';
      inp.options.forEach(function(o,i){h+='<label class="xopt"><input type="radio" name="'+lid+'" value="'+i+'"> <span>'+esc(o)+"</span></label>";});
      wrap.innerHTML=h+"</div>";
      get=function(){var c=wrap.querySelector("input:checked");return c?inp.options[+c.value]:"";};
    }else if(inp.type==="checks"){
      var h2='<div class="xchoices">';
      inp.options.forEach(function(o,i){h2+='<label class="xopt"><input type="checkbox" value="'+i+'"> <span>'+esc(o)+"</span></label>";});
      wrap.innerHTML=h2+"</div>";
      get=function(){return Array.prototype.slice.call(wrap.querySelectorAll("input:checked")).map(function(c){return inp.options[+c.value];});};
    }else if(inp.type==="grid"){
      var h3='<div class="scroll"><table class="xgrid"><tr><th></th>'+inp.cols.map(function(c){return "<th>"+esc(c)+"</th>";}).join("")+"</tr>";
      inp.rows.forEach(function(rw,i){h3+="<tr><th>"+esc(rw)+"</th>"+inp.cols.map(function(c,j){return '<td><input type="text" inputmode="numeric" size="3" data-i="'+i+'" data-j="'+j+'" aria-label="'+esc(rw+" "+c)+'" autocomplete="off"></td>';}).join("")+"</tr>";});
      wrap.innerHTML=h3+"</table></div>";
      get=function(){var g=inp.rows.map(function(){return inp.cols.map(function(){return "";});});Array.prototype.forEach.call(wrap.querySelectorAll("input"),function(x){g[+x.getAttribute("data-i")][+x.getAttribute("data-j")]=x.value;});return g;};
    }
    getters.push({id:inp.id,get:get});host.appendChild(wrap);
  });
  return function(){var vals={};getters.forEach(function(g){vals[g.id]=g.get();});return vals;};
}
var LVL=["","Easy","Medium","Hard"];
function qHeader(q){return '<div class="top"><span class="lvl">'+q.topic+" · "+(LVL[q.level]||"")+"</span><b>"+esc(q.name)+'</b><span class="small xcode">Code '+esc(q.code)+"</span></div>";}

/* ---- practice runner ---- */
function initRunner(){
  var sel=$("w6-topic"),lvl=$("w6-level"),box=$("w6-qbox"),cur=null;
  var h='<option value="all">Any topic</option>';
  TOPICS.forEach(function(t){
    h+='<optgroup label="'+t+'"><option value="topic:'+t+'">All '+t.toLowerCase()+" questions</option>"+KINDS.filter(function(k){return k.topic===t;}).map(function(k){return '<option value="kind:'+k.id+'">'+esc(k.name)+"</option>";}).join("")+"</optgroup>";
  });
  sel.innerHTML=h;
  function pool(){
    var v=sel.value;
    if(v==="all")return KINDS;
    if(v.indexOf("topic:")===0)return KINDS.filter(function(k){return k.topic===v.slice(6);});
    return KINDS.filter(function(k){return k.id===v.slice(5);});
  }
  function randomSeed(){return 100000+Math.floor(Math.random()*900000);}
  function pick(){
    var p=pool(),want=+lvl.value,q,tries=0;
    do{q=makeQuestion(p[Math.floor(Math.random()*p.length)].id,randomSeed(),want);tries++;}while(want&&q.level!==want&&tries<40);
    return q;
  }
  function show(q){
    cur=q;
    var uid="xq"+(++xid),counted=false,hints=0,checked=false;
    box.innerHTML='<div class="xq">'+qHeader(q)+'<div class="xprompt">'+q.prompt+'</div><div class="xinputs"></div><div class="row"><button class="btn primary" type="button" data-check>Check answer</button><button class="btn" type="button" data-hint>Hint</button><button class="btn" type="button" data-sol disabled>Show solution</button><button class="btn" type="button" data-next>Next question</button></div><div class="fb-host" aria-live="polite"></div><div class="hint-host"></div><div class="sol-host"></div></div>';
    var get=buildInputs(q,box.querySelector(".xinputs"),uid),fb=box.querySelector(".fb-host"),hh=box.querySelector(".hint-host"),sh=box.querySelector(".sol-host"),bs=box.querySelector("[data-sol]"),bh=box.querySelector("[data-hint]");
    box.querySelector("[data-check]").addEventListener("click",function(){
      var r=grade(q,get());checked=true;bs.disabled=false;
      fb.innerHTML='<div class="fb '+(r.ok?"ok":"ask")+'"><b>'+(r.ok?"Correct.":"Not yet.")+"</b> "+esc(r.msg.replace(/^Correct\.\s*/,""))+"</div>";
      if(!counted){counted=true;record(q,r.ok);}
    });
    bh.addEventListener("click",function(){
      if(hints<q.hints.length){hints++;hh.innerHTML=q.hints.slice(0,hints).map(function(t,i){return '<div class="hint"><b>Hint '+(i+1)+".</b> "+t+"</div>";}).join("");}
      if(hints>=q.hints.length)bh.disabled=true;
    });
    bs.addEventListener("click",function(){sh.innerHTML='<div class="sol"><b>Solution.</b><br>'+q.solution+"</div>";bs.disabled=true;if(!counted){counted=true;record(q,false);}});
    box.querySelector("[data-next]").addEventListener("click",function(){show(pick());});
  }
  $("w6-new").addEventListener("click",function(){show(pick());});
  sel.addEventListener("change",function(){show(pick());});lvl.addEventListener("change",function(){show(pick());});
  $("w6-loadcode").addEventListener("click",function(){
    var m=/^\s*([a-z]+)-(\d+)\s*$/.exec($("w6-code").value);
    if(!m||!kindById(m[1])){$("w6-codeerr").textContent="That code is not valid. It looks like dijkstra-482913.";return;}
    $("w6-codeerr").textContent="";show(makeQuestion(m[1],parseInt(m[2],10),0));
  });
  show(pick());
}

/* ---- mock exam ---- */
function initMock(){
  var host=$("w6-mock-box"),timer=null;
  function stopTimer(){if(timer){clearInterval(timer);timer=null;}}
  $("w6-mock-start").addEventListener("click",function(){
    stopTimer();
    var n=+$("w6-mock-n").value,qs=[],order=[],i,used={};
    var tp=TOPICS.slice();
    for(i=0;i<n;i++){
      var t=tp[i%tp.length],ks=KINDS.filter(function(k){return k.topic===t&&!used[k.id];});
      if(!ks.length){used={};ks=KINDS.filter(function(k){return k.topic===t;});}
      var k=ks[Math.floor(Math.random()*ks.length)];used[k.id]=1;order.push(k.id);
    }
    order=order.sort(function(a,b){return TOPICS.indexOf(kindById(a).topic)-TOPICS.indexOf(kindById(b).topic);});
    qs=order.map(function(id){return makeQuestion(id,100000+Math.floor(Math.random()*900000),0);});
    var t0=Date.now(),h='<div class="xtimer" aria-live="off">Time: <b id="w6-clock">0:00</b> · '+n+' questions · one mark each</div>';
    host.innerHTML=h;
    var cards=qs.map(function(q,idx){
      var d=document.createElement("div"),uid="xm"+(++xid);d.className="xq";
      d.innerHTML='<div class="top"><span class="lvl">Question '+(idx+1)+" · "+q.topic+"</span><b>"+esc(q.name)+'</b></div><div class="xprompt">'+q.prompt+'</div><div class="xinputs"></div><div class="fb-host"></div><div class="sol-host"></div>';
      var get=buildInputs(q,d.querySelector(".xinputs"),uid);host.appendChild(d);
      return {q:q,get:get,el:d};
    });
    var sub=document.createElement("div");sub.className="row";sub.innerHTML='<button class="btn primary" type="button">Submit exam</button><span class="small">You cannot change answers after submitting.</span>';host.appendChild(sub);
    var clock=$("w6-clock");timer=setInterval(function(){var s=Math.floor((Date.now()-t0)/1000);clock.textContent=Math.floor(s/60)+":"+("0"+(s%60)).slice(-2);},1000);
    sub.querySelector("button").addEventListener("click",function(){
      stopTimer();var secs=Math.floor((Date.now()-t0)/1000),score=0,per={};
      cards.forEach(function(c){
        var r=grade(c.q,c.get());if(r.ok)score++;
        var p=per[c.q.topic]||(per[c.q.topic]={n:0,ok:0});p.n++;if(r.ok)p.ok++;
        record(c.q,r.ok);
        c.el.querySelector(".fb-host").innerHTML='<div class="fb '+(r.ok?"ok":"ask")+'"><b>'+(r.ok?"Correct.":"Not correct.")+"</b> "+esc(r.msg.replace(/^Correct\.\s*/,""))+"</div>";
        c.el.querySelector(".sol-host").innerHTML='<div class="sol"><b>Solution.</b><br>'+c.q.solution+"</div>";
        Array.prototype.forEach.call(c.el.querySelectorAll("input,textarea"),function(x){x.disabled=true;});
      });
      sub.remove();
      var weak=null,wr=2;Object.keys(per).forEach(function(t){var f=per[t].ok/per[t].n;if(f<wr){wr=f;weak=t;}});
      var s='<div class="card"><h3 style="margin-top:0">Your result: '+score+" / "+cards.length+" ("+Math.round(100*score/cards.length)+"%)</h3><p>Time taken: "+Math.floor(secs/60)+" min "+secs%60+' s.</p><div class="scroll"><table><tr><th class="l">Topic</th><th>Marks</th></tr>'+Object.keys(per).map(function(t){return "<tr><td class=\"l\">"+t+"</td><td>"+per[t].ok+" / "+per[t].n+"</td></tr>";}).join("")+"</table></div>"+(weak&&wr<1?'<p>Weakest topic: <b>'+weak+'</b>.</p><button class="btn primary" type="button" id="w6-practice-weak">Practice '+weak.toLowerCase()+" now</button>":"<p>Every topic was perfect. Try again for a new set.</p>")+"</div>";
      var res=document.createElement("div");res.innerHTML=s;host.insertBefore(res,host.children[1]);
      var pw=$("w6-practice-weak");if(pw)pw.addEventListener("click",function(){$("w6-topic").value="topic:"+weak;$("w6-topic").dispatchEvent(new Event("change"));$("w6-top").scrollIntoView();});
      res.scrollIntoView();
    });
  });
}

/* ---- progress ---- */
function renderProgress(){
  var tot=0,okc=0,h='<div class="scroll"><table><tr><th class="l">Question type</th><th>Tried</th><th>Right first time</th><th>Accuracy</th><th></th></tr>';
  var byTopic={};
  KINDS.forEach(function(k){
    var s=xstate.kinds[k.id]||{att:0,ok:0};tot+=s.att;okc+=s.ok;
    var t=byTopic[k.topic]||(byTopic[k.topic]={att:0,ok:0});t.att+=s.att;t.ok+=s.ok;
    h+="<tr><td class=\"l\">"+esc(k.name)+" <span class=\"small\">("+k.topic+")</span></td><td>"+s.att+"</td><td>"+s.ok+"</td><td>"+(s.att?Math.round(100*s.ok/s.att)+"%":"-")+'</td><td><button class="btn" type="button" data-prac="'+k.id+'">Practice</button></td></tr>';
  });
  h+="</table></div>";
  var bars=TOPICS.map(function(t){var s=byTopic[t]||{att:0,ok:0},pct=s.att?Math.round(100*s.ok/s.att):0;return '<div class="xbar"><span>'+t+'</span><div class="bar"><i style="width:'+pct+'%"></i></div><span class="small">'+(s.att?pct+"% of "+s.att:"not started")+"</span></div>";}).join("");
  var host=$("w6-progress-box");
  if(host){
    host.innerHTML=bars+h;
    Array.prototype.forEach.call(host.querySelectorAll("[data-prac]"),function(b){b.addEventListener("click",function(){var s=$("w6-topic");s.value="kind:"+b.getAttribute("data-prac");s.dispatchEvent(new Event("change"));$("w6-top").scrollIntoView();});});
  }
  var pt=$("w6-prog-txt"),pb=$("w6-prog-bar");
  if(pt)pt.textContent="Answered: "+tot+(tot?" ("+Math.round(100*okc/tot)+"% right first time)":"");
  if(pb)pb.style.width=Math.min(100,tot*2)+"%";
}

/* ---- graph lab and Dijkstra tool ---- */
function parseEdgeList(str){
  var re=/([A-Za-z0-9]+)\s*(?:->|-|>|→)\s*([A-Za-z0-9]+)/g,m,out=[];
  while((m=re.exec(str)))out.push([m[1],m[2]]);
  var rest=str.replace(re,"").replace(/[\s,;]/g,"");
  if(rest.length)throw new Error('I could not read "'+rest.slice(0,10)+'". Write edges like a-b, b-c, c-c.');
  return out;
}
function initGraphLab(){
  function render(){
    var out=$("w6-gl-out");
    try{
      var dir=$("w6-gl-dir").checked,E=parseEdgeList($("w6-gl-e").value),V=uniq(parseElems($("w6-gl-v").value).concat([].concat.apply([],E)));
      if(!V.length)throw new Error("Type some edges first.");
      if(V.length>8)throw new Error("Please use at most 8 vertices.");
      var idx={},M=V.map(function(){return V.map(function(){return 0;});}),L={},deg={},inn={},outd={};
      V.forEach(function(v,i){idx[v]=i;L[v]=[];deg[v]=0;inn[v]=0;outd[v]=0;});
      E.forEach(function(e){
        var u=e[0],v=e[1];
        if(dir){M[idx[u]][idx[v]]++;L[u].push(v);outd[u]++;inn[v]++;}
        else if(u===v){M[idx[u]][idx[u]]++;L[u].push(u);deg[u]+=2;}
        else{M[idx[u]][idx[v]]++;M[idx[v]][idx[u]]++;L[u].push(v);L[v].push(u);deg[u]++;deg[v]++;}
      });
      var h='<div class="tv-body"><div>'+multiSvg(V,E,dir,"w6-gl-arrow")+"</div><div>";
      h+='<div class="scroll"><table><tr><th>vertex</th>'+(dir?"<th>in</th><th>out</th>":"<th>degree</th>")+"</tr>"+V.map(function(v){return "<tr><th>"+esc(v)+"</th>"+(dir?"<td>"+inn[v]+"</td><td>"+outd[v]+"</td>":"<td>"+deg[v]+"</td>")+"</tr>";}).join("")+"</table></div>";
      var sumD=V.reduce(function(a,v){return a+(dir?inn[v]:deg[v]);},0);
      h+='<p class="small">'+(dir?"Sum of in-degrees = sum of out-degrees = number of edges = "+E.length+".":"Sum of degrees = "+sumD+" = 2 × "+E.length+" edges.")+"</p></div></div>";
      h+="<h3 class=\"tv-h\">Adjacency list</h3><pre class=\"code\">"+V.map(function(v){return esc(v)+": "+(L[v].length?L[v].join(", "):"(none)");}).join("\n")+"</pre>";
      h+="<h3 class=\"tv-h\">Adjacency matrix</h3>"+matTable(M,V,V,"A");
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+"</div>";}
  }
  ["w6-gl-v","w6-gl-e"].forEach(function(id){$(id).addEventListener("input",render);});
  $("w6-gl-dir").addEventListener("change",render);
  render();
}
function initDijkstraTool(){
  function render(){
    var out=$("w6-dj-out");
    try{
      var str=$("w6-dj-e").value,re=/([A-Za-z0-9]+)\s*-\s*([A-Za-z0-9]+)\s*:\s*(\d+)/g,m,E=[],V=[];
      while((m=re.exec(str))){E.push({a:m[1],b:m[2],w:parseInt(m[3],10)});V.push(m[1],m[2]);}
      var rest=str.replace(re,"").replace(/[\s,;]/g,"");
      if(rest.length)throw new Error('I could not read "'+rest.slice(0,10)+'". Write weighted edges like A-B:4, B-C:2.');
      V=uniq(V).sort();
      if(!E.length)throw new Error("Type some weighted edges first.");
      if(V.length>8)throw new Error("Please use at most 8 vertices.");
      var src=$("w6-dj-s").value.trim()||V[0];
      if(V.indexOf(src)<0)throw new Error('The start vertex "'+src+'" is not in the graph.');
      var res=dijkstra(V,E,src);
      var h='<div class="tv-body"><div>'+weightedSvg(V,E)+'</div><div><div class="scroll"><table><tr><th>vertex</th><th>shortest distance</th><th>path</th></tr>'+V.map(function(v){
        return "<tr><th>"+esc(v)+"</th><td>"+(res.dist[v]===Infinity?"unreachable":res.dist[v])+"</td><td>"+(res.dist[v]===Infinity?"-":pathOf(res.prev,src,v).join("-"))+"</td></tr>";}).join("")+"</table></div></div></div>";
      h+='<h3 class="tv-h">Step by step</h3><div class="scroll"><table><tr><th>Step</th><th>Finalise</th>'+V.map(function(v){return "<th>"+esc(v)+"</th>";}).join("")+"</tr>";
      var done={};
      res.steps.forEach(function(s,i){
        done[s.u]=true;
        h+="<tr><td>"+(i+1)+"</td><td><b>"+esc(s.u)+"</b></td>"+V.map(function(v){
          var d=s.dist[v],txt=d==="inf"?"∞":d,cls=done[v]?"v-T":(s.upd.indexOf(v)>=0?"v-F":"");
          return '<td class="'+cls+'">'+txt+"</td>";}).join("")+"</tr>";
      });
      h+='</table></div><p class="small">Green: finalised (shortest distance known). Orange: improved in this step.</p>';
      out.innerHTML=h;
    }catch(e){out.innerHTML='<div class="err">'+esc(e.message)+"</div>";}
  }
  ["w6-dj-e","w6-dj-s"].forEach(function(id){$(id).addEventListener("input",render);});
  render();
}
function initExamLab(){
  xload();
  initRunner();initMock();initGraphLab();initDijkstraTool();renderProgress();
  $("w6-reset").addEventListener("click",function(){if(window.confirm("Clear your exam-lab progress?")){xstate={kinds:{}};xsave();renderProgress();}});
}
window.CKCExam={KINDS:KINDS,TOPICS:TOPICS,makeQuestion:makeQuestion,dijkstra:dijkstra,greedyCounts:greedyCounts,minCoins:minCoins,binTrace:binTrace,bubblePasses:bubblePasses,insertionAfter:insertionAfter};

/* ===================== TEST 1 MOCK PAPER ===================== */
var MOCK_KEY="ckc111-test1";
function mockData(){
  var S=[];
  function tab(rows,head){return '<div class="scroll"><table class="mocktab"><tr>'+head.map(function(h){return "<th>"+h+"</th>";}).join("")+"</tr>"+rows.map(function(r){return "<tr>"+r.map(function(c){return "<td>"+c+"</td>";}).join("")+"</tr>";}).join("")+"</table></div>";}
  function lines(arr){return '<div class="proofkey">'+arr.map(function(l,i){return '<div class="pl"><span class="e">'+(i?"≡ ":"")+esc(l[0])+'</span><span class="why">'+esc(l[1])+"</span></div>";}).join("")+"</div>";}

  /* ---------- Section A ---------- */
  var A=[];
  A.push({id:"A1",topic:"Logic",marks:5,
    prompt:'<p><b>Logic laws.</b> Name the law that justifies each equivalence (1 mark each).</p><ol type="a" class="mq-list"><li><span class="e">p → q ≡ ¬p ∨ q</span></li><li><span class="e">¬(¬p ∨ q) ≡ ¬(¬p) ∧ ¬q</span></li><li><span class="e">¬(¬p) ≡ p</span></li><li><span class="e">(p ∧ q) ∨ (p ∧ r) ≡ p ∧ (q ∨ r)</span></li><li><span class="e">p ∨ (p ∧ q) ≡ p</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li><b>Conditional (implication) law</b>: it removes → using ¬ and ∨.</li><li><b>De Morgan\'s law</b> (¬ moves inside and ∨ becomes ∧).</li><li><b>Double negation law</b>.</li><li><b>Distributive law</b> (read right to left).</li><li><b>Absorption law</b>.</li></ol>',
    scheme:[["(a) Conditional / implication law",1],["(b) De Morgan's law",1],["(c) Double negation law",1],["(d) Distributive law",1],["(e) Absorption law",1]]});
  var R2=[["1","1"],["1","2"],["2","2"],["2","3"],["3","3"],["4","4"],["4","1"]];
  A.push({id:"A2",topic:"Relations",marks:5,
    prompt:'<p><b>Digraph to relation.</b> The digraph below represents a relation R on {1, 2, 3, 4}.</p><div class="mfig">'+digraphSvg(["1","2","3","4"],R2)+'</div><ol type="a" class="mq-list"><li>Write down all the ordered pairs in R. <span class="mk">[3 marks]</span></li><li>State, with a reason, whether R is (i) reflexive, (ii) symmetric. <span class="mk">[2 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>R = <span class="e">{(1,1), (1,2), (2,2), (2,3), (3,3), (4,4), (4,1)}</span>. Each arrow from x to y is the pair (x, y), and each loop at x is (x, x).</li><li>(i) <b>Reflexive: yes</b>, there is a loop at every vertex: (1,1), (2,2), (3,3), (4,4). (ii) <b>Symmetric: no</b>, for example (1,2) is in R but (2,1) is not.</li></ol>',
    scheme:[["(a) All 7 pairs correct (5 or 6 correct = 2 marks, 3 or 4 correct = 1 mark)",3],["(b)(i) Reflexive: yes, with the reason (a loop at every vertex)",1],["(b)(ii) Symmetric: no, with a counterexample such as (1,2) without (2,1)",1]]});
  var R3=[["a","b"],["b","a"],["b","c"],["c","c"],["c","d"],["d","a"]];
  A.push({id:"A3",topic:"Relations",marks:5,
    prompt:'<p><b>Relation to digraph.</b> Let R = {(a,b), (b,a), (b,c), (c,c), (c,d), (d,a)} be a relation on {a, b, c, d}.</p><ol type="a" class="mq-list"><li>Draw the digraph that represents R. <span class="mk">[4 marks]</span></li><li>State the in-degree and the out-degree of vertex c. <span class="mk">[1 mark]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>Four vertices a, b, c, d. One arrow for each pair, pointing from the first element to the second: a→b, b→a, b→c, d→a, c→d, and a <b>loop at c</b>. The two arrows between a and b point in opposite directions.<div class="mfig">'+digraphSvg(["a","b","c","d"],R3)+'</div></li><li>Arrows into c: (b,c) and the loop (c,c), so <b>in-degree 2</b>. Arrows out of c: the loop (c,c) and (c,d), so <b>out-degree 2</b>.</li></ol>',
    scheme:[["(a) All four vertices drawn and labelled",1],["(a) Arrows: 6 edges with the correct direction (5 correct = 2 marks, 3 or 4 correct = 1 mark); the loop at c must be a loop",3],["(b) In-degree 2 and out-degree 2",1]]});
  var R4=[["1","2"],["1","4"],["2","2"],["2","3"],["3","1"],["4","4"]],M4=relMatrix(["1","2","3","4"],["1","2","3","4"],R4);
  A.push({id:"A4",topic:"Relations",marks:5,
    prompt:'<p><b>Matrix.</b> Let R = {(1,2), (1,4), (2,2), (2,3), (3,1), (4,4)} be a relation on {1, 2, 3, 4}.</p><ol type="a" class="mq-list"><li>Write the zero-one matrix M<sub>R</sub> (rows and columns in increasing order). <span class="mk">[2 marks]</span></li><li>Use M<sub>R</sub> to decide whether R is reflexive, symmetric, antisymmetric. Give a reason for each. <span class="mk">[3 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>Row = first element, column = second element:'+matTable(M4,["1","2","3","4"],["1","2","3","4"],"M<sub>R</sub>")+'</li><li><b>Reflexive: no</b>, the diagonal is not all 1 (m<sub>11</sub> = 0). <b>Symmetric: no</b>, m<sub>12</sub> = 1 but m<sub>21</sub> = 0. <b>Antisymmetric: yes</b>, there is no pair of 1s in mirror positions off the diagonal (m<sub>12</sub>/m<sub>21</sub>, m<sub>14</sub>/m<sub>41</sub>, m<sub>23</sub>/m<sub>32</sub>, m<sub>13</sub>/m<sub>31</sub>, m<sub>24</sub>/m<sub>42</sub>, m<sub>34</sub>/m<sub>43</sub> never both 1).</li></ol>',
    scheme:[["(a) Matrix correct (one wrong entry = 1 mark)",2],["(b) Reflexive: no, with the reason",1],["(b) Symmetric: no, with the reason",1],["(b) Antisymmetric: yes, with the reason",1]]});
  A.push({id:"A5",topic:"Relations",marks:5,
    prompt:'<p><b>Partitions and equivalence classes.</b> Let S = {a, b, c, d, e, f}.</p><ol type="a" class="mq-list"><li>Which of these collections of subsets are partitions of S? Give a reason for each. <span class="mk">[3 marks]</span><br>(i) {a, b}, {c, d}, {e, f}<br>(ii) {a, b, c}, {c, d}, {e, f}<br>(iii) {a, b, c}, {d, e}</li><li>The partition P = {{a, c, e}, {b, d}, {f}} defines an equivalence relation on S (two elements are related when they are in the same subset). Write the equivalence class [b], and find how many ordered pairs the relation contains. <span class="mk">[2 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>(i) <b>Partition</b>: the subsets are nonempty, disjoint, and their union is S. (ii) <b>Not a partition</b>: c is in two subsets, so they are not disjoint (and the union is also not S). (iii) <b>Not a partition</b>: f is missing, so the union is not S.</li><li>[b] = <b>{b, d}</b>. A subset with k elements gives k × k ordered pairs: 3² + 2² + 1² = 9 + 4 + 1 = <b>14</b> ordered pairs.</li></ol>',
    scheme:[["(a)(i) Partition, with the reason",1],["(a)(ii) Not a partition, because c is in two subsets",1],["(a)(iii) Not a partition, because f is missing",1],["(b) [b] = {b, d}",1],["(b) 14 ordered pairs (9 + 4 + 1)",1]]});
  A.push({id:"A6",topic:"Algorithms",marks:5,
    prompt:'<p><b>Searching: location and calculation.</b> Use the <b>linear search</b> algorithm to find 40 in the list 8, 3, 25, 17, 40, 12.</p><ol type="a" class="mq-list"><li>Show every step (the value of i and the comparison made), and state the location of 40. <span class="mk">[4 marks]</span></li><li>How many comparisons would be needed to search for 99 in this list, and what location is returned? <span class="mk">[1 mark]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li><div class="scroll"><table class="mocktab"><tr><th>i</th><th>a<sub>i</sub></th><th>40 ≠ a<sub>i</sub> ?</th></tr><tr><td>1</td><td>8</td><td>true, so i := 2</td></tr><tr><td>2</td><td>3</td><td>true, so i := 3</td></tr><tr><td>3</td><td>25</td><td>true, so i := 4</td></tr><tr><td>4</td><td>17</td><td>true, so i := 5</td></tr><tr><td>5</td><td>40</td><td>false: stop</td></tr></table></div>Since i = 5 ≤ n, location := 5. <b>40 is at location 5.</b></li><li>99 is not in the list, so every element is compared: <b>6 comparisons</b>, and the returned location is <b>0</b>.</li></ol>',
    scheme:[["(a) Steps shown with i and the comparison (i = 1 to 5)",3],["(a) Final answer: 40 is at location 5",1],["(b) 6 comparisons and location 0",1]]});
  S.push({id:"A",title:"Section A",rule:"Answer ALL 6 questions. 30 marks. Suggested time: about 18 minutes.",qs:A});

  /* ---------- Section B ---------- */
  var B=[];
  B.push({id:"B1",topic:"Logic",marks:12,
    prompt:'<p><b>Proofs with logic laws.</b> Do NOT use truth tables. Write the name of the law beside every step.</p><ol type="a" class="mq-list"><li>Show that <span class="e">¬(p ∨ q) ∨ (¬p ∧ q) ≡ ¬p</span>. <span class="mk">[5 marks]</span></li><li>Show that <span class="e">(p ∧ q) → (p ↔ q)</span> is a tautology. <span class="mk">[7 marks]</span></li></ol>',
    key:'<p><b>(a)</b></p>'+lines([["¬(p ∨ q) ∨ (¬p ∧ q)","start"],["(¬p ∧ ¬q) ∨ (¬p ∧ q)","second De Morgan law"],["¬p ∧ (¬q ∨ q)","distributive law (factor out ¬p)"],["¬p ∧ (q ∨ ¬q)","commutative law"],["¬p ∧ T","negation law"],["¬p","identity law"]])+'<p><b>(b)</b></p>'+lines([["(p ∧ q) → (p ↔ q)","start"],["¬(p ∧ q) ∨ (p ↔ q)","conditional law"],["¬(p ∧ q) ∨ ((p ∧ q) ∨ (¬p ∧ ¬q))","biconditional law: p ↔ q ≡ (p ∧ q) ∨ (¬p ∧ ¬q)"],["(¬(p ∧ q) ∨ (p ∧ q)) ∨ (¬p ∧ ¬q)","associative law"],["((p ∧ q) ∨ ¬(p ∧ q)) ∨ (¬p ∧ ¬q)","commutative law"],["T ∨ (¬p ∧ ¬q)","negation law"],["T","domination law"]])+'<p class="small">Other orders of steps are fine, as long as every step is a valid law and is named.</p>',
    scheme:[["(a) De Morgan applied, law named",1],["(a) Distributive law used to factor out ¬p, law named",2],["(a) Negation law (¬q ∨ q ≡ T, with commutative if used), law named",1],["(a) Identity law and a final conclusion",1],["(b) Conditional law used to remove →",1],["(b) Biconditional law used to replace ↔, law named",2],["(b) Associative law to regroup",1],["(b) Commutative and negation laws to get T",2],["(b) Domination law to reach T",1]]});

  var bubbleList=[9,4,7,2,6],bd=bubbleDetail(bubbleList),firstSorted=0,np=bd.passes.length;
  bd.passes.forEach(function(p,i){if(!firstSorted&&p.list.join()===bubbleList.slice().sort(function(x,y){return x-y;}).join())firstSorted=i+1;});
  B.push({id:"B2",topic:"Algorithms",marks:12,
    prompt:'<p><b>Bubble sort, step by step.</b> Use the bubble sort algorithm to put the list <span class="e">'+bubbleList.join(", ")+'</span> into increasing order.</p><ol type="a" class="mq-list"><li>Write the list after each pass (pass 1 to pass '+np+'). Show each comparison and mark every interchange. <span class="mk">['+2*np+' marks]</span></li><li>How many interchanges (swaps) are made altogether? <span class="mk">[2 marks]</span></li><li>How many comparisons are made altogether, and after which pass is the list first fully sorted? <span class="mk">[2 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>'+tab(bd.passes.map(function(p){return ["Pass "+p.i,p.steps.map(function(s){return (s.sw?"<b>":"")+"("+s.a+", "+s.b+")"+(s.sw?" swap</b>":" ok");}).join("; "),'<span class="e">'+p.list.join(", ")+"</span>"];}),["Pass","Comparisons (left, right)","List after the pass"])+'</li><li>Interchanges: <b>'+bd.swaps+'</b>.</li><li>Comparisons: (n − 1) + (n − 2) + … + 1 = '+(np)+' + '+(np-1)+(np>2?' + …':'')+' + 1 = <b>'+bd.comps+'</b>. The list is fully sorted <b>after pass '+firstSorted+'</b>'+(firstSorted<np?' (the remaining passes make no interchange, but the algorithm still performs them).':".")+'</li></ol>',
    scheme:bd.passes.map(function(p){return ["(a) Pass "+p.i+" correct (comparisons and list)",2];}).concat([["(b) Total interchanges = "+bd.swaps,2],["(c) Total comparisons = "+bd.comps,1],["(c) Sorted after pass "+firstSorted,1]])});

  B.push({id:"B3",topic:"Algorithms",marks:12,
    prompt:'<p><b>Algorithm coding: max, min and sum.</b></p><ol type="a" class="mq-list"><li>Write pseudocode for a procedure <span class="e">maxmin(a<sub>1</sub>, …, a<sub>n</sub>: integers)</span> that returns both the largest and the smallest element, using one <b>for</b> loop. <span class="mk">[5 marks]</span></li><li>Trace your procedure on the list 5, 2, 9, 1, 7. Show the values of max and min after each value of i. <span class="mk">[4 marks]</span></li><li>Write pseudocode for a procedure <span class="e">sum(a<sub>1</sub>, …, a<sub>n</sub>)</span> that returns the sum of the integers, using a <b>while</b> loop. <span class="mk">[3 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li><pre class="code"><b>procedure</b> maxmin(a1, a2, …, an: integers)\nmax := a1\nmin := a1\n<b>for</b> i := 2 <b>to</b> n\n    <b>if</b> ai &gt; max <b>then</b> max := ai\n    <b>if</b> ai &lt; min <b>then</b> min := ai\n<b>return</b> (max, min)</pre></li><li>'+tab([["start","5","5"],["i = 2 (a₂ = 2)","5","2"],["i = 3 (a₃ = 9)","9","2"],["i = 4 (a₄ = 1)","9","1"],["i = 5 (a₅ = 7)","9","1"]],["Step","max","min"])+'Result: max = 9, min = 1.</li><li><pre class="code"><b>procedure</b> sum(a1, a2, …, an: integers)\nsum := a1\ni := 2\n<b>while</b> i ≤ n\n    sum := sum + ai\n    i := i + 1\n<b>return</b> sum</pre><p class="small">Remember i := i + 1 inside the loop: without it the loop never ends (finiteness fails).</p></li></ol>',
    scheme:[["(a) Procedure heading and both max and min set to a1",1],["(a) for i := 2 to n",1],["(a) Correct test and update for max",1],["(a) Correct test and update for min",1],["(a) Returns both values",1],["(b) Trace table with correct values at each step",4],["(c) Initialises sum and i correctly",1],["(c) while i ≤ n with the sum update and i := i + 1",1],["(c) return sum",1]]});

  var L12=[3,8,12,17,21,25,29,34,40,46,51,60];
  function btab(x){var t=binTable(L12,x);return tab(t.rows.map(function(r){return [r.i,r.j,r.m,r.am,x+" > "+r.am+" is "+(r.gt?"true":"false"),r.gt?"i := "+(r.m+1):"j := "+r.m];}),["i","j","m","a<sub>m</sub>","comparison","update"])+"<p>When i = j = "+t.end.i+": a<sub>"+t.end.i+"</sub> = "+L12[t.end.i-1]+(L12[t.end.i-1]===x?" = "+x+", so location := "+t.loc+".":" ≠ "+x+", so location := 0.")+"</p>";}
  B.push({id:"B4",topic:"Algorithms",marks:12,
    prompt:'<p><b>Binary search: location and calculation.</b> The list is <span class="e">'+L12.join(", ")+'</span> (n = 12). Use the binary search algorithm with <span class="e">m := ⌊(i + j)/2⌋</span>, <span class="e">if x &gt; a<sub>m</sub> then i := m + 1 else j := m</span>.</p><ol type="a" class="mq-list"><li>Search for <b>34</b>. Show i, j, m, a<sub>m</sub> and the comparison at every step, and state the location of 34. <span class="mk">[7 marks]</span></li><li>Search for <b>30</b>. Show every step and state the value returned. <span class="mk">[5 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>Start: i = 1, j = 12.'+btab(34)+'<b>34 is at location 8.</b></li><li>Start: i = 1, j = 12.'+btab(30)+'<b>The value returned is 0</b> (30 is not in the list).</li></ol>',
    scheme:[["(a) Start values i = 1, j = 12 and first m = 6",1],["(a) Each of the 4 rows correct (m, a_m, comparison, update)",4],["(a) i = j = 8 and location 8",2],["(b) Steps correct (same path as (a) until the last row)",3],["(b) a_8 ≠ 30 and location 0",2]]});

  var P5=[["1","3","4"],["2","5"]],R5=[];
  P5.forEach(function(b){b.forEach(function(x){b.forEach(function(y){R5.push([x,y]);});});});
  var E5=["1","2","3","4","5"],M5=relMatrix(E5,E5,R5);
  B.push({id:"B5",topic:"Relations",marks:12,
    prompt:'<p><b>Equivalence relation, classes and partition.</b> Let A = {1, 2, 3, 4, 5}. The partition P = {{1, 3, 4}, {2, 5}} defines a relation R on A: (x, y) ∈ R exactly when x and y are in the same subset of P.</p><ol type="a" class="mq-list"><li>List all the ordered pairs of R. <span class="mk">[3 marks]</span></li><li>Show that R is an equivalence relation: check reflexive, symmetric and transitive, with a reason for each. <span class="mk">[3 marks]</span></li><li>Write the equivalence classes [1] and [2]. <span class="mk">[1 mark]</span></li><li>Write the zero-one matrix M<sub>R</sub> (rows and columns 1 to 5). <span class="mk">[3 marks]</span></li><li>Now add (2, 3) and (3, 2) to R. Is the new relation still an equivalence relation? Explain. <span class="mk">[2 marks]</span></li></ol>',
    key:'<ol type="a" class="mq-list"><li>A subset with k elements gives k × k pairs: 9 + 4 = 13.<br><span class="e">R = {(1,1), (1,3), (1,4), (3,1), (3,3), (3,4), (4,1), (4,3), (4,4), (2,2), (2,5), (5,2), (5,5)}</span></li><li><b>Reflexive:</b> every element is in the same subset as itself, and (1,1), (2,2), (3,3), (4,4), (5,5) are all in R. <b>Symmetric:</b> if x and y are in the same subset, so are y and x; every pair has its reverse. <b>Transitive:</b> if x, y share a subset and y, z share a subset, that subset is the same, so x and z share it too; for example (1,3) and (3,4) give (1,4). So R is an equivalence relation.</li><li>[1] = <b>{1, 3, 4}</b> and [2] = <b>{2, 5}</b>.</li><li>'+matTable(M5,E5,E5,"M<sub>R</sub>")+'</li><li><b>No.</b> It is still reflexive and symmetric, but it is <b>not transitive</b>: (2,3) and (3,1) are in the new relation, but (2,1) is not.</li></ol>',
    scheme:[["(a) All 13 pairs (10 to 12 correct = 2 marks, 5 to 9 correct = 1 mark)",3],["(b) Reflexive with reason",1],["(b) Symmetric with reason",1],["(b) Transitive with reason or an example chain",1],["(c) [1] = {1,3,4} and [2] = {2,5}",1],["(d) Matrix correct (up to 2 wrong entries = 2 marks, up to 5 wrong = 1 mark)",3],["(e) Not an equivalence relation, because it is not transitive, with a counterexample such as (2,3),(3,1) without (2,1)",2]]});
  S.push({id:"B",title:"Section B",rule:"Answer ALL 5 questions. 60 marks. Suggested time: about 32 minutes. Show all working.",qs:B});
  return S;
}
function bubbleDetail(a){
  var arr=a.slice(),n=arr.length,passes=[],swaps=0,comps=0,i,j,t;
  for(i=1;i<=n-1;i++){
    var steps=[];
    for(j=0;j<n-i;j++){
      comps++;var sw=arr[j]>arr[j+1];steps.push({a:arr[j],b:arr[j+1],sw:sw});
      if(sw){t=arr[j];arr[j]=arr[j+1];arr[j+1]=t;swaps++;}
    }
    passes.push({i:i,steps:steps,list:arr.slice()});
  }
  return {passes:passes,swaps:swaps,comps:comps};
}
function binTable(a,x){
  var i=1,j=a.length,rows=[];
  while(i<j){var m=Math.floor((i+j)/2),gt=x>a[m-1];rows.push({i:i,j:j,m:m,am:a[m-1],gt:gt});if(gt)i=m+1;else j=m;}
  return {rows:rows,end:{i:i,j:j},loc:a[i-1]===x?i:0};
}

function initMock1(){
  var SECTIONS=mockData(),paper=$("w7-paper"),LIMIT=3600,left=LIMIT,timer=null,started=false,finished=false,t0=0;
  /* build the paper */
  var h='<div class="mhead"><b>CKC111 Discrete Structures · Test 1 (mock paper)</b><span>Time allowed: 1 hour · Total: 90 marks · Chapters 1, 2 and 3</span><span>Name: ______________________ Matric no: ______________</span><span class="small">Write your answers by hand on paper. Name every logic law you use. Calculators are not needed.</span></div>';
  SECTIONS.forEach(function(sec){
    h+='<section class="msec"><h3>'+sec.title+'</h3><p class="mrule">'+sec.rule+"</p>";
    sec.qs.forEach(function(q){h+='<article class="mq" id="w7-q-'+q.id+'" data-q="'+q.id+'"><div class="mqh"><b>'+q.id+'</b><span class="mmarks">['+q.marks+" marks]</span></div>"+q.prompt+'<div class="mkey" hidden></div></article>';});
    h+="</section>";
  });
  h+='<div class="mfoot"><button class="btn primary big" type="button" id="w7-finish">Finish and show the marking scheme</button></div>';
  paper.innerHTML=h;paper.hidden=true;
  var all=[];SECTIONS.forEach(function(s){s.qs.forEach(function(q){all.push(q);});});
  var total=all.reduce(function(a,q){return a+q.marks;},0);

  function fmtTime(s){var neg=s<0;s=Math.abs(s);return (neg?"+":"")+Math.floor(s/60)+":"+("0"+(s%60)).slice(-2);}
  function tick(){
    left=LIMIT-Math.floor((Date.now()-t0)/1000);
    var c=$("w7-clock");c.textContent=fmtTime(left);
    var bar=$("w7-timerbar");bar.classList.toggle("warn",left<=600&&left>0);bar.classList.toggle("over",left<=0);
    $("w7-timernote").textContent=left>0?(left<=600?"Less than 10 minutes left":"Time left"):"Time is up. Finish your answer, then mark yourself.";
  }
  $("w7-start").addEventListener("click",function(){
    if(started&&!finished&&!window.confirm("Restart the clock from the beginning? The time used so far will be lost."))return;
    LIMIT=+$("w7-limit").value||3600;started=true;finished=false;t0=Date.now();left=LIMIT;$("w7-timerfinish").hidden=false;$("w7-clock").textContent=fmtTime(LIMIT);
    $("w7-timerbar").hidden=false;paper.hidden=false;$("w7-paperhint").hidden=true;
    Array.prototype.forEach.call(paper.querySelectorAll(".mkey"),function(k){k.hidden=true;k.innerHTML="";});
    $("w7-result").hidden=true;$("w7-result").innerHTML="";$("w7-finish").hidden=false;
    clearInterval(timer);tick();timer=setInterval(tick,1000);$("w7-start").textContent="Restart the timer";paper.scrollIntoView();
  });
  $("w7-print").addEventListener("click",function(){
    var wasHidden=paper.hidden;paper.hidden=false;$("w7-paperhint").hidden=true;document.body.classList.add("printing-paper");
    var done=function(){document.body.classList.remove("printing-paper");if(wasHidden&&!started){paper.hidden=true;$("w7-paperhint").hidden=false;}window.removeEventListener("afterprint",done);};
    window.addEventListener("afterprint",done);
    if(window.print){window.print();}
    setTimeout(function(){if(document.body.classList.contains("printing-paper"))done();},4000);
  });

  /* marking */
  function scoreSummary(){
    var secs={},topics={},sum=0,tot={};
    all.forEach(function(q){
      var got=0;Array.prototype.forEach.call(document.querySelectorAll('#w7-q-'+q.id+" .mscore"),function(s){got+=+s.value;});
      sum+=got;
      var sid=q.id.charAt(0);secs[sid]=(secs[sid]||0)+got;topics[q.topic]=topics[q.topic]||{got:0,max:0};topics[q.topic].got+=got;topics[q.topic].max+=q.marks;
      var qs=document.querySelector("#w7-q-"+q.id+" .mqtotal");if(qs)qs.textContent=got+" / "+q.marks;
    });
    return {sum:sum,secs:secs,topics:topics};
  }
  function renderResult(save){
    var r=scoreSummary(),pct=Math.round(100*r.sum/total),secs=Math.max(0,LIMIT-left),used=Math.floor((Date.now()-t0)/1000);
    var band=pct>=80?"Excellent: you are ready.":pct>=65?"Good: a few gaps to close.":pct>=50?"A pass, but revise the weak topics below.":"Not yet: revise the topics below and try again.";
    var weak=Object.keys(r.topics).filter(function(t){return r.topics[t].got/r.topics[t].max<0.6;});
    var link={Logic:2,Algorithms:3,Relations:4};
    var h='<h3 style="margin-top:0">Your mark: '+r.sum+" / "+total+" ("+pct+"%)</h3><p><b>"+band+'</b> Time used: '+fmtTime(used)+(used>LIMIT?" (over the "+(LIMIT/60)+" minutes)":"")+".</p>";
    h+='<div class="scroll"><table><tr><th class="l">Part</th><th>Mark</th></tr><tr><td class="l">Section A</td><td>'+(r.secs.A||0)+" / 30</td></tr><tr><td class=\"l\">Section B</td><td>"+(r.secs.B||0)+" / 60</td></tr>"+Object.keys(r.topics).map(function(t){return '<tr><td class="l">'+t+"</td><td>"+r.topics[t].got+" / "+r.topics[t].max+"</td></tr>";}).join("")+"</table></div>";
    h+=weak.length?'<p>Revise next: '+weak.map(function(t){return '<button class="btn" type="button" data-open-week="'+link[t]+'">'+t+"</button>";}).join(" ")+"</p>":"<p>Every topic is above 60%. Try the Exam Lab mock exam for more practice.</p>";
    var res=$("w7-result");res.innerHTML=h;
    if(save){try{localStorage.setItem(MOCK_KEY,JSON.stringify({score:r.sum,total:total,pct:pct,when:Date.now(),used:used}));}catch(e){}}
  }
  function finish(){
    if(finished)return;
    if(!window.confirm("Finish now and show the marking scheme? You cannot go back to the timed attempt."))return;
    finished=true;clearInterval(timer);timer=null;
    var usedNow=Math.floor((Date.now()-t0)/1000);$("w7-timerbar").classList.remove("warn","over");$("w7-timernote").textContent="Finished. Time used (mark yourself honestly):";$("w7-clock").textContent=fmtTime(usedNow);$("w7-timerfinish").hidden=true;
    all.forEach(function(q){
      var k=document.querySelector("#w7-q-"+q.id+" .mkey");
      var sh='<div class="keybox"><h4>Model answer</h4>'+q.key+'<h4>Marking scheme</h4><p class="small">For each line, choose how many marks you earned.</p><div class="scheme">'+
        q.scheme.map(function(it,i){var opts="";for(var m=0;m<=it[1];m++)opts+="<option value=\""+m+"\">"+m+"</option>";return '<label class="srow"><span>'+it[0]+' <span class="small">(max '+it[1]+')</span></span><select class="mscore" aria-label="Marks for line '+(i+1)+' of '+q.id+'">'+opts+"</select></label>";}).join("")+
        '</div><p class="mqsum">Question total: <b class="mqtotal">0 / '+q.marks+"</b></p></div>";
      k.innerHTML=sh;k.hidden=false;
    });
    $("w7-finish").hidden=true;var res=$("w7-result");res.hidden=false;renderResult(false);
    res.scrollIntoView();
  }
  paper.addEventListener("change",function(e){if(finished&&e.target.classList.contains("mscore"))renderResult(true);});
  $("w7-finish").addEventListener("click",finish);
  $("w7-timerfinish").addEventListener("click",finish);
  /* show the previous attempt, if any */
  try{var last=JSON.parse(localStorage.getItem(MOCK_KEY)||"null");if(last){$("w7-last").hidden=false;$("w7-last").textContent="Your last attempt: "+last.score+" / "+last.total+" ("+last.pct+"%).";}}catch(e){}
}

initWeek2();initWeek4();initWeek5();initExamLab();initMock1();
buildKit(2,W2);buildKit(4,W4);buildKit(5,W5);
if(typeof module!=="undefined"&&module.exports){module.exports.data={W4:W4,W5:W5};}
})();


/* ===== PART 4: APP ===== */
/* Top tab bar, section rail / mobile sheet, previous-next buttons, home progress, theme */
(function(){
"use strict";
if(typeof document==="undefined"||!document.getElementById){return;}
var AKEY="ckc111-active-week";
var NAMES={0:"Home",1:"Week 1",2:"Week 2",3:"Week 3",4:"Week 4",5:"Week 5",6:"Exam Lab",7:"Test 1"};
var SUBS={0:"Overview",1:"Logic I",2:"Equivalences",3:"Algorithms",4:"Relations I",5:"Relations II",6:"Practice",7:"Mock paper"};
var TITLES={0:"CKC111 Discrete Structures: Study Guide",1:"Week 1: Propositional Logic",2:"Week 2: Logical Equivalences",3:"Week 3: Basic Algorithms",4:"Week 4: Relations I",5:"Week 5: Relations II",6:"Exam Lab: Practice",7:"Test 1: Mock Paper"};
function qa(s){return Array.prototype.slice.call(document.querySelectorAll(s));}
function $(id){return document.getElementById(id);}
var panels=qa(".week"),groups=qa(".navgroup"),tabs=qa("[data-weekbtn]"),rail=$("nav"),fab=$("fab"),backdrop=$("backdrop");

/* ---- progress read from the saved answers ---- */
function readJSON(k){try{var s=localStorage.getItem(k);return s?JSON.parse(s):null;}catch(e){return null;}}
function progress(n){
  if(n>=1&&n<=5){
    var s=readJSON("ckc111-week"+n),c=0,i;
    if(s&&s.attempts){for(i=0;i<10;i++){if(String(s.attempts["p"+i]||"").trim().length>=4)c++;}}
    return {frac:c/10,text:c+" of 10 practice questions tried"};
  }
  if(n===6){
    var x=readJSON("ckc111-exam"),att=0,ok=0;
    if(x&&x.kinds){Object.keys(x.kinds).forEach(function(k){att+=x.kinds[k].att||0;ok+=x.kinds[k].ok||0;});}
    return {frac:Math.min(1,att/40),text:att?(att+" answered, "+Math.round(100*ok/att)+"% right first time"):"No questions answered yet"};
  }
  if(n===7){
    var m=readJSON("ckc111-test1");
    return m?{frac:m.pct/100,text:"Last attempt: "+m.score+" / "+m.total+" ("+m.pct+"%)"}:{frac:0,text:"Not tried yet"};
  }
  return {frac:0,text:""};
}
function paint(){
  tabs.forEach(function(b){var n=+b.getAttribute("data-weekbtn");if(n>=1)b.style.setProperty("--p",progress(n).frac);});
  qa(".wcard").forEach(function(c){
    var n=+c.getAttribute("data-open-week"),p=progress(n);
    c.querySelector(".wprog i").style.width=Math.round(p.frac*100)+"%";
    c.querySelector(".wptxt").textContent=p.text;
  });
  var rp=$("w7-prog-txt");
  if(rp){var p7=progress(7);rp.textContent=p7.text==="Not tried yet"?"Mock paper: not tried yet":p7.text;$("w7-prog-bar").style.width=Math.round(p7.frac*100)+"%";}
  var last=lastWeek(),btn=$("w0-continue");
  if(btn)btn.textContent=last?("Continue: "+NAMES[last]+" · "+SUBS[last]):"Start Week 1";
}
function lastWeek(){try{var s=parseInt(localStorage.getItem(AKEY),10);return s>=1&&s<=7?s:0;}catch(e){return 0;}}

/* ---- tabs ---- */
function show(n,keepScroll,focus){
  n=String(n);
  panels.forEach(function(p){p.hidden=p.getAttribute("data-week")!==n;});
  groups.forEach(function(g){g.hidden=g.getAttribute("data-week")!==n;});
  tabs.forEach(function(b){
    var on=b.getAttribute("data-weekbtn")===n;
    b.setAttribute("aria-selected",on);b.tabIndex=on?0:-1;
    if(on){if(focus)b.focus();if(b.scrollIntoView)b.scrollIntoView({inline:"center",block:"nearest"});}
  });
  var rt=$("rail-title");if(rt)rt.textContent=(+n===0)?"On this page":NAMES[n]+" · "+SUBS[n];
  document.title=TITLES[n]||"CKC111";
  if(+n>=1){try{localStorage.setItem(AKEY,n);}catch(e){}}
  closeSheet();
  if(!keepScroll)window.scrollTo(0,0);
  paint();
}
function goTo(id){
  var el=$(id);if(!el)return;
  var p=el.closest(".week");if(p)show(p.getAttribute("data-week"),true);
  el.scrollIntoView();
}
tabs.forEach(function(b,i){
  b.addEventListener("click",function(){show(b.getAttribute("data-weekbtn"));});
  b.addEventListener("keydown",function(e){
    var k=e.key,j=null;
    if(k==="ArrowRight")j=(i+1)%tabs.length;else if(k==="ArrowLeft")j=(i-1+tabs.length)%tabs.length;else if(k==="Home")j=0;else if(k==="End")j=tabs.length-1;
    if(j!==null){e.preventDefault();show(tabs[j].getAttribute("data-weekbtn"),false,true);}
  });
});
panels.forEach(function(p){
  var n=+p.getAttribute("data-week");p.setAttribute("aria-labelledby","tab"+n);
  var t=$("tab"+n);if(t)t.setAttribute("aria-controls",p.id);
});
document.addEventListener("click",function(e){
  var o=e.target.closest("[data-open-week]");
  if(o){if(o.tagName==="A")e.preventDefault();show(o.getAttribute("data-open-week"));return;}
  var g=e.target.closest("[data-goto]");
  if(g){goTo(g.getAttribute("data-goto"));}
});

var cont=$("w0-continue");
if(cont)cont.addEventListener("click",function(){show(lastWeek()||1);});

/* ---- previous / next buttons at the end of every week ---- */
panels.forEach(function(p){
  var n=+p.getAttribute("data-week");if(n===0)return;
  var h='<nav class="pager" aria-label="Previous and next">';
  var prev=n-1,next=n+1;
  h+='<button type="button" class="prev" data-open-week="'+prev+'"><small>Previous</small><b>'+(prev===0?"Home":NAMES[prev]+" · "+SUBS[prev])+"</b></button>";
  if(next<=7)h+='<button type="button" class="next" data-open-week="'+next+'"><small>Next</small><b>'+NAMES[next]+" · "+SUBS[next]+"</b></button>";
  p.insertAdjacentHTML("beforeend",h+"</nav>");
});

/* ---- mobile sections sheet ---- */
function openSheet(){rail.classList.add("open");backdrop.hidden=false;fab.setAttribute("aria-expanded","true");}
function closeSheet(){if(!rail)return;rail.classList.remove("open");if(backdrop)backdrop.hidden=true;if(fab)fab.setAttribute("aria-expanded","false");}
if(fab){
  fab.addEventListener("click",function(){rail.classList.contains("open")?closeSheet():openSheet();});
  backdrop.addEventListener("click",closeSheet);
  rail.addEventListener("click",function(e){if(e.target.closest("a"))closeSheet();});
  document.addEventListener("keydown",function(e){if(e.key==="Escape")closeSheet();});
}

/* ---- compact header while scrolling on phones ---- */
window.addEventListener("scroll",function(){document.body.classList.toggle("scrolled",window.scrollY>60);},{passive:true});

/* ---- theme ---- */
$("theme").addEventListener("click",function(){
  var r=document.documentElement,cur=r.getAttribute("data-theme");
  var dark=cur?cur==="dark":window.matchMedia("(prefers-color-scheme: dark)").matches;
  r.setAttribute("data-theme",dark?"light":"dark");
});

/* ---- highlight the section in view ---- */
if("IntersectionObserver" in window){
  var links=qa("#nav .navgroup a"),map={};
  links.forEach(function(a){map[a.getAttribute("href").slice(1)]=a;});
  var io=new IntersectionObserver(function(es){
    es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove("on");});if(map[e.target.id])map[e.target.id].classList.add("on");}
    });
  },{rootMargin:"-20% 0px -70% 0px"});
  Object.keys(map).forEach(function(id){var el=$(id);if(el)io.observe(el);});
}

/* ---- refresh progress after any interaction ---- */
var timer=null;
function later(){clearTimeout(timer);timer=setTimeout(paint,300);}
["input","change","click"].forEach(function(t){document.addEventListener(t,later);});

/* ---- start: URL hash, then the last week you visited, then Home ---- */
var start=lastWeek()||0,hash=(location.hash||"").slice(1),hm=/^w([0-7])-/.exec(hash);
if(hm)start=+hm[1];
show(start,true);
if(hash&&$(hash))goTo(hash);
})();
