/** Coupled stochastic agent model. Shared coefficients; never reads numeric character traits. */
const wealthDisplay=w=>.5+Math.atan(w/5)/Math.PI;
const wage=(h,a,o)=>(.55+1.1*o)*(.5+.6*h)*(1+.45*a)/365;
const expense=(h,p)=>(.72+.6*p+.45*(1-h))/365;

/** Direct one-day index-point effects relative to neutral references, not total causal estimates. */
export function couplingEffects(s){
  const wealthPoints=d=>100*(wealthDisplay(s.w+d)-wealthDisplay(s.w));
  return {
    wealthToHealth:100*.022*Math.tanh(s.w/4),
    authorityToHealth:100*.01*(s.a-.5),
    healthToWealth:wealthPoints(wage(s.h,s.a,s.opportunity)-expense(s.h,s.pressure)-wage(.5,s.a,s.opportunity)+expense(.5,s.pressure)),
    authorityToWealth:wealthPoints(wage(s.h,s.a,s.opportunity)-wage(s.h,.5,s.opportunity)+.003*(s.a-.5)*Math.max(0,s.w)),
    healthToAuthority:100*.022*(s.h-.5),
    wealthToAuthority:100*.018*Math.tanh(s.w/5)
  };
}
export function simulate(people,day,scenario="baseline",seed=5282026){
  const N=people.length,limit=365,steps=Math.max(0,Math.min(limit,Math.floor(day))),history=[],snapshots=[];
  let rng=seed>>>0;
  const random=()=>{rng=(rng+0x6d2b79f5)>>>0;let z=rng;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return ((z^(z>>>14))>>>0)/4294967296};
  const clip=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  const noise=()=>Math.sqrt(-2*Math.log(Math.max(random(),1e-12)))*Math.cos(2*Math.PI*random());
  const sigmoid=x=>1/(1+Math.exp(-x));
  const zones=people.map(p=>p.regionEn||"Unspecified");
  const zoneList=[...new Set(zones)],members=zoneList.map(z=>zones.flatMap((v,i)=>v===z?[i]:[])),zoneIndex=zones.map(z=>zoneList.indexOf(z));
  const environment=(z,t,feedback={health:.65,wealth:1,authority:.3})=>{
    const underground=/underground/i.test(z),eros=/Eros-7/i.test(z),market=/Granbell/i.test(z);
    const reform=t>=0&&scenario==="reform"?0.16:0, crisis=t>=0&&scenario==="crisis"?0.24:0;
    const cycle=Math.sin(2*Math.PI*t/197), binary=Math.sin(2*Math.PI*t/(29*365.2425));
    const taxCapacity=Math.tanh(feedback.wealth/4), socialCapacity=feedback.authority-.3;
    const fragility=Math.max(0,.65-feedback.health);
    return {pressure:clip(.19+(underground?.28:0)+(eros?.28:0)+crisis+.04*cycle+.015*binary-reform+.12*fragility-.04*socialCapacity,0,.9),care:clip(.66-(underground?.22:0)+(market?.10:0)+reform-crisis*.5+.07*taxCapacity+.05*socialCapacity-.05*fragility,.1,.95),opportunity:clip(.54-(underground?.25:0)+(market?.16:0)+reform-crisis+.08*taxCapacity+.04*socialCapacity-.06*fragility,.05,.98)};
  };
  if(N===0)return {day:steps,history:[],snapshots:[],current:[],summary:{median:0,topShare:0,negative:0,meanH:0,meanA:0}};
  // Two haplotypes, six hypothetical loci. Anonymous ancestral cohorts, not canon parentage.
  let genomes=Array.from({length:N},()=>[Array.from({length:6},()=>+(random()<.5)),Array.from({length:6},()=>+(random()<.5))]);
  const frequency=g=>Array.from({length:6},(_,l)=>g.reduce((v,p)=>v+p[0][l]+p[1][l],0)/(2*N));
  const ancestry=[frequency(genomes)];
  for(let generation=0;generation<16;generation++){
    // Weak habitat-dependent viability selection in anonymous ancestral cohorts.
    const ancestralEnvironments=zoneList.map(z=>environment(z,-180-(16-generation)*365));
    const viability=genomes.map((g,i)=>{
      const pressure=ancestralEnvironments[zoneIndex[i]].pressure;
      const allele=(g[0][0]+g[1][0])/2;
      return 1+.12*(2*pressure-1)*(2*allele-1);
    });
    const parent=i=>{
      const local=members[zoneIndex[i]];
      const draw=()=>random()<.88?local[Math.floor(random()*local.length)]:Math.floor(random()*N);
      const a=draw(),b=draw();
      return random()<viability[a]/(viability[a]+viability[b])?a:b;
    };
    const gamete=i=>{
      const p=genomes[parent(i)];let strand=+(random()<.5);
      return Array.from({length:6},(_,l)=>{if(random()<.18)strand=1-strand;return random()<.004?1-p[strand][l]:p[strand][l]});
    };
    genomes=Array.from({length:N},(_,i)=>[gamete(i),gamete(i)]);
    ancestry.push(frequency(genomes));
  }
  // All agents start in the same macrostate. Individual differences emerge from interactions.
  let states=people.map(()=>({h:.65,w:1,a:.3,assets:1,debt:0,expression:.5}));
  const graph=people.map((_,i)=>Array.from({length:6},()=>{const local=members[zoneIndex[i]];return random()<.8?local[Math.floor(random()*local.length)]:Math.floor(random()*N)}));
  let learned=[.2,.2,.2],samples=0;
  const snapshot=(t,env)=>{
    const current=states.map((s,i)=>({h:s.h,w:s.w,a:s.a,assets:s.assets,debt:s.debt,expression:s.expression,care:env[zoneIndex[i]].care,pressure:env[zoneIndex[i]].pressure,opportunity:env[zoneIndex[i]].opportunity,alleles:genomes[i].map(x=>x.join("")).join(" / ")}));
    const sorted=current.map(s=>s.w).sort((a,b)=>a-b),positive=sorted.filter(x=>x>0),total=positive.reduce((a,b)=>a+b,0);
    const summary={median:(sorted[Math.floor((N-1)/2)]+sorted[Math.floor(N/2)])/2,topShare:total?positive.slice(-Math.max(1,Math.ceil(N*.01))).reduce((a,b)=>a+b,0)/total:0,negative:sorted.filter(w=>w<0).length/N,meanH:current.reduce((a,s)=>a+s.h,0)/N,meanA:current.reduce((a,s)=>a+s.a,0)/N};
    history.push({day:t,...summary});snapshots.push({day:t,current,summary});
  };
  // A fixed burn-in is shared; real UTC days select a reproducible simulated day.
  for(let t=-180;t<=steps;t++){
    const env=zoneList.map((z,k)=>{
      const local=members[k];let health=0,wealth=0,authority=0;
      for(const i of local){health+=states[i].h;wealth+=states[i].w;authority+=states[i].a}
      return environment(z,t,{health:health/local.length,wealth:wealth/local.length,authority:authority/local.length});
    });
    if(t>=-28&&(t%7===0||t===steps)){snapshot(t,env)}
    if(t===steps)break;
    let residual=[0,0,0];
    const next=states.map((s,i)=>{
      const e=env[zoneIndex[i]],neighbors=graph[i];
      let mh=0,mw=0,ma=0,den=0;
      for(const j of neighbors){const v=states[j],weight=Math.exp(clip(learned[0]*v.h+learned[1]*Math.tanh(v.w/5)+learned[2]*v.a,-4,4));mh+=weight*v.h;mw+=weight*Math.tanh(v.w/5);ma+=weight*v.a;den+=weight}
      mh/=den;mw/=den;ma/=den;
      const gene=genomes[i].reduce((v,p)=>v+p.reduce((a,b)=>a+b,0),0)/12;
      const locus0=(genomes[i][0][0]+genomes[i][1][0])/2;
      const interaction=2*(locus0-.5)*(2*e.pressure-1);
      const expression=sigmoid(interaction+.4*(gene-.5)+1.5*(e.care-e.pressure)+.7*(s.h-.5));
      const health=clip(s.h+.055*(e.care-s.h)+.022*Math.tanh(s.w/4)+.018*(mh-s.h)+.01*s.a+.02*(expression-.5)-.018*e.pressure+.025*noise(),.01,.99);
      // Cash flow in annual essential-basket units; institution/market is the external reservoir.
      const income=wage(s.h,s.a,e.opportunity);
      const cost=expense(s.h,e.pressure);
      const multiplicative=clip(.003*(s.a+.6*e.opportunity)+.012*noise(),-.08,.08)*Math.max(0,s.w);
      const opportunityShock=random()<.004*e.opportunity?Math.exp(3.1*random())*.75:0;
      const adverseShock=random()<.009*(1+e.pressure)?Math.exp(2.0*random())*.45:0;
      const wealth=clip(s.w+income-cost+multiplicative+opportunityShock-adverseShock+.0015*(mw-Math.tanh(s.w/5))-.0005*Math.max(0,s.debt),-100,1e7);
      const liability=clip(Math.max(0,-wealth)+.96*Math.max(0,s.debt-Math.max(0,-s.w))+.001*(wealth>0?wealth:0),0,1e7);
      const authority=clip(s.a+.035*(ma-s.a)+.022*(s.h-.5)+.018*Math.tanh(s.w/5)-.012*e.pressure+.018*noise(),.001,.999);
      residual[0]+=(health-s.h)*mh;residual[1]+=(Math.tanh(wealth/5)-Math.tanh(s.w/5))*mw;residual[2]+=(authority-s.a)*ma;
      return {h:health,w:wealth,a:authority,assets:wealth+liability,debt:liability,expression};
    });
    // Shared online adaptation of graph attention; no per-person learned/fixed coefficients.
    learned=learned.map((x,k)=>clip(x+.04*residual[k]/N,-1.5,1.5));samples++;
    states=next;
  }
  const last=snapshots[snapshots.length-1];
  return {day:steps,history,snapshots,current:last.current,summary:last.summary,ancestry,learned,samples};
}
