/**
 * EDU Triadic State Model, version 4.
 * Coupled Itô SDE (bounded axes in logit coordinates) + compound-Poisson wealth jumps on a
 * sparse social graph, with an exact gradient-flow effective vertex, a closed flow-of-funds
 * ledger and estimator-grade diagnostics. Shared coefficients only; never reads numeric
 * character traits, names or identity.
 */
export const MODEL_VERSION = 4;
const wealthDisplay=w=>.5+Math.atan(w/5)/Math.PI;
const wage=(h,a,o)=>(.55+1.1*o)*(.5+.6*h)*(1+.45*a)/365;
const expense=(h,p)=>(.72+.6*p+.45*(1-h))/365;
const sigmoid=x=>1/(1+Math.exp(-x));
const EPS=1e-12;

/**
 * One tamed, Itô-consistent Euler–Maruyama step (dt = 1 day) for a variable on (0,1).
 * Target SDE: dp = mu dt + 4 sigma p(1-p) dW (noise = sigma at p=1/2, vanishing at the boundary).
 * With u = logit p, Itô's lemma gives du = [mu/(p(1-p)) - 8 sigma^2 (1-2p)] dt + 4 sigma dW.
 * The drift is tamed f/(1+|f|/4) (Hutzenthaler–Jentzen–Kloeden) so the scheme cannot overshoot
 * near the boundary. The state never leaves (0,1); no clipping, no boundary mass.
 */
export function logitStep(p,mu,sigma,z){
  const q=Math.min(1-1e-9,Math.max(1e-9,p)),s=q*(1-q);
  const f=mu/s-8*sigma*sigma*(1-2*q);
  return sigmoid(Math.log(q/(1-q))+f/(1+Math.abs(f)/4)+4*sigma*z);
}

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

/** Mobility tensor Γ = diag(1/4, 5, 1/4) in (h, w, a). */
export const MOBILITY=[.25,5,.25];
/**
 * Real-valued effective triadic vertex. x=2h-1, y=tanh(w/5), z=2a-1,
 * V = g xyz + λ/4 (x⁴+y⁴+z⁴) = g Tr(M³)/6 + λ/4 Σq⁴ for the symmetric zero-diagonal M.
 * The drift is the exact gradient flow  ẋ_k = -Γ_k ∂V/∂x_k  in the physical coordinates (h,w,a),
 * including the tanh pullback for w. Hence dV/dt = -Σ Γ_k (∂_k V)² ≤ 0 for this sub-flow.
 */
export function vertex(h,w,a){
  const x=2*h-1,y=Math.tanh(w/5),z=2*a-1,g=.018,lambda=.008,jw=(1-y*y)/5;
  const gh=2*(g*y*z+lambda*x**3),gw=jw*(g*x*z+lambda*y**3),ga=2*(g*x*y+lambda*z**3);
  return {cubic:g*x*y*z,potential:g*x*y*z+lambda*(x**4+y**4+z**4)/4,
    dh:-MOBILITY[0]*2*g*y*z, dw:-MOBILITY[1]*jw*g*x*z, da:-MOBILITY[2]*2*g*x*y,
    dampH:-MOBILITY[0]*2*lambda*x**3, dampW:-MOBILITY[1]*jw*lambda*y**3, dampA:-MOBILITY[2]*2*lambda*z**3,
    gradient:[gh,gw,ga], dissipation:-(MOBILITY[0]*gh*gh+MOBILITY[1]*gw*gw+MOBILITY[2]*ga*ga)};
}

const entropy=p=>-p.reduce((s,v)=>s+(v>0?v*Math.log(v):0),0);
const relative=(p,q)=>p.reduce((s,v,i)=>s+(v>0?v*Math.log(v/q[i]):0),0);
const normalized=c=>{const sum=c.reduce((a,b)=>a+b,0);return c.map(v=>sum?v/sum:0)};
const octant=s=>4*Number(s.h>=.5)+2*Number(s.w>=0)+Number(s.a>=.5);

/** Hill tail-index estimator on the k largest positive values; k = max(5, ⌊√n₊⌋). SE = α/√k. */
export function hillEstimator(values){
  const x=values.filter(v=>v>0).sort((a,b)=>b-a);
  const k=Math.max(5,Math.floor(Math.sqrt(x.length)));
  if(x.length<k+1)return {alpha:null,se:null,k:0};
  let s=0;for(let i=0;i<k;i++)s+=Math.log(x[i]/x[k]);
  const alpha=s>0?k/s:null;
  return {alpha,se:alpha===null?null:alpha/Math.sqrt(k),k};
}
/** Gini coefficient of nonnegative values (sorted closed form). */
export function gini(values){
  const x=values.map(v=>Math.max(0,v)).sort((a,b)=>a-b),n=x.length,t=x.reduce((a,b)=>a+b,0);
  if(!n||!t)return 0;
  let s=0;for(let i=0;i<n;i++)s+=(2*(i+1)-n-1)*x[i];
  return s/(n*t);
}
const triple=(states,w)=>{
  let n=0;const m=[0,0,0];
  for(let i=0;i<states.length;i++){const s=states[i],c=w?w[i]:1;n+=c;m[0]+=c*s.h;m[1]+=c*Math.tanh(s.w/5);m[2]+=c*s.a}
  if(!n)return 0;m[0]/=n;m[1]/=n;m[2]/=n;let k=0;
  for(let i=0;i<states.length;i++){const s=states[i],c=w?w[i]:1;k+=c*(s.h-m[0])*(Math.tanh(s.w/5)-m[1])*(s.a-m[2])}
  return k/n;
};

/** Equal-population-weight empirical observables. KL uses a uniform reference, not thermal entropy. */
export function observables(states){
  const n=states.length;
  if(!n)return {connected3:0,entropy:0,entropyMM:0,totalCorrelation:0,klFine:0,klCoarse:0,informationLoss:0,counts:Array(8).fill(0),gini:0,hill:null,hillSE:null};
  const counts=Array(8).fill(0);
  for(const s of states)counts[octant(s)]++;
  const p=normalized(counts),marginals=[4,2,1].map(bit=>{const q=p.reduce((v,x,i)=>v+((i&bit)?x:0),0);return [q,1-q]});
  const coarse=Array.from({length:4},(_,i)=>p[2*i]+p[2*i+1]);
  const h=entropy(p),klFine=relative(p,Array(8).fill(1/8)),klCoarse=relative(coarse,Array(4).fill(1/4));
  const tail=hillEstimator(states.map(s=>s.w));
  return {connected3:triple(states),entropy:h,
    // Miller–Madow first-order bias correction of the plug-in entropy.
    entropyMM:h+(counts.filter(c=>c>0).length-1)/(2*n),
    totalCorrelation:Math.max(0,marginals.reduce((v,q)=>v+entropy(q),0)-h),klFine,klCoarse,informationLoss:Math.max(0,klFine-klCoarse),counts,
    gini:gini(states.map(s=>s.assets)),hill:tail.alpha,hillSE:tail.se};
}

/** Empirical one-step vs two-step transition diagnostic, not a Markov assumption or proof. */
export function transitionResidual(one,two){
  const row=p=>p.map(normalized);
  const p=row(one),q=row(two),m=one.length;let total=0,weight=0;
  for(let i=0;i<m;i++){
    const n=two[i].reduce((a,b)=>a+b,0);
    if(!n||!one[i].some(v=>v>0))continue;
    const pred=Array.from({length:m},(_,j)=>p[i].reduce((v,x,k)=>v+x*p[k][j],0));
    if(Math.abs(pred.reduce((a,b)=>a+b,0)-1)>1e-9)continue;
    total+=n*.5*pred.reduce((v,x,j)=>v+Math.abs(x-q[i][j]),0);weight+=n;
  }
  return {residual:weight?total/weight:null,samples:weight};
}

/**
 * Time-reversal asymmetry of consecutive coarse states: KL(p_ij || p_ji) per day (nat),
 * with a Jeffreys pseudocount 1/2 (shrinks toward reversibility). Under stationarity this is a
 * lower bound on the entropy-production rate of the observed process (data processing inequality);
 * nonstationarity can bias it. Also returns the net probability currents J_ij = p_ij - p_ji.
 */
export function irreversibility(one){
  const m=one.length,c=one.map(r=>r.map(v=>v+.5)),t=c.flat().reduce((a,b)=>a+b,0);
  let s=0;const currents=[];
  for(let i=0;i<m;i++)for(let j=0;j<m;j++){const p=c[i][j]/t,q=c[j][i]/t;s+=p*Math.log(p/q);if(i<j)currents.push({from:i,to:j,net:(one[i][j]-one[j][i])/Math.max(1,t)})}
  currents.sort((a,b)=>Math.abs(b.net)-Math.abs(a.net));
  return {rate:Math.max(0,s),currents:currents.slice(0,4)};
}

/**
 * Stationary law and relaxation of the empirical one-step kernel on supported states.
 * ρ = spectral radius of P - 1πᵀ estimated by Gelfand's formula (∞-norm);
 * τ = -1/ln ρ days. The ratio (‖D^{2n}‖/‖D^n‖)^{1/n}, n = 256, removes the O(1/n) prefactor bias. Reducible or unsupported chains return τ = null.
 */
export function relaxation(one){
  const support=one.map((r,i)=>r.reduce((a,b)=>a+b,0)>0?i:-1).filter(i=>i>=0),m=support.length;
  if(m<2)return {tau:null,rho:null,stationary:one.map(()=>0)};
  const P=support.map(i=>{const r=support.map(j=>one[i][j]),s=r.reduce((a,b)=>a+b,0);return s?r.map(v=>v/s):r.map((_,k)=>k===support.indexOf(i)?1:0)});
  let pi=Array(m).fill(1/m);
  for(let it=0;it<4000;it++){const nx=Array(m).fill(0);for(let i=0;i<m;i++)for(let j=0;j<m;j++)nx[j]+=pi[i]*P[i][j];const s=nx.reduce((a,b)=>a+b,0);pi=nx.map(v=>v/s)}
  let D=P.map(r=>r.map((v,j)=>v-pi[j])),log=0,previous=0,dead=false;
  const mul=(A,B)=>A.map(r=>B[0].map((_,j)=>r.reduce((v,x,k)=>v+x*B[k][j],0)));
  // Renormalized repeated squaring: after k squarings ‖D^(2^k)‖ = exp(log).
  for(let k=0;k<9;k++){previous=log;D=mul(D,D);const norm=Math.max(...D.map(r=>r.reduce((a,b)=>a+Math.abs(b),0)));if(norm<1e-280){dead=true;break}D=D.map(r=>r.map(v=>v/norm));log=2*log+Math.log(norm)}
  // Ratio form (‖D^512‖/‖D^256‖)^(1/256) cancels the eigenvector-conditioning prefactor.
  const rho=dead?0:Math.min(1,Math.exp((log-previous)/256));
  const stationary=one.map(()=>0);support.forEach((i,k)=>{stationary[i]=pi[k]});
  return {tau:rho>=1-1e-9?null:rho<=0?0:-1/Math.log(rho),rho,stationary};
}

export function simulate(people,day,scenario="baseline",seed=5282026){
  const N=people.length,limit=365,steps=Math.max(0,Math.min(limit,Math.floor(day))),history=[],snapshots=[];
  let rng=seed>>>0;
  const random=()=>{rng=(rng+0x6d2b79f5)>>>0;let z=rng;z=Math.imul(z^(z>>>15),z|1);z^=z+Math.imul(z^(z>>>7),z|61);return ((z^(z>>>14))>>>0)/4294967296};
  const clip=(v,lo,hi)=>Math.max(lo,Math.min(hi,v));
  const noise=()=>Math.sqrt(-2*Math.log(Math.max(random(),EPS)))*Math.cos(2*Math.PI*random());
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
  const empty={median:0,topShare:0,negative:0,meanH:0,meanA:0};
  if(N===0)return {version:MODEL_VERSION,day:steps,history:[],snapshots:[],current:[],summary:empty};
  // Two phased haplotypes, six hypothetical loci. Anonymous ancestral cohorts, not canon parentage.
  let genomes=Array.from({length:N},()=>[Array.from({length:6},()=>+(random()<.5)),Array.from({length:6},()=>+(random()<.5))]);
  const frequency=g=>Array.from({length:6},(_,l)=>g.reduce((v,p)=>v+p[0][l]+p[1][l],0)/(2*N));
  /** Nei's G_ST (ratio of averages over loci), expected heterozygosity, mean adjacent-locus r². */
  const popgen=g=>{
    let num=0,den=0,he=0,ld=0,ldn=0;
    for(let l=0;l<6;l++){
      let pt=0;const pz=zoneList.map(()=>0);
      for(let i=0;i<N;i++){const c=g[i][0][l]+g[i][1][l];pt+=c;pz[zoneIndex[i]]+=c}
      pt/=2*N;const HT=2*pt*(1-pt);let HS=0;
      members.forEach((m,z)=>{const q=pz[z]/(2*m.length);HS+=m.length/N*2*q*(1-q)});
      num+=HT-HS;den+=HT;he+=HT/6;
    }
    for(let l=0;l<5;l++){
      let A=0,B=0,AB=0;for(const d of g)for(const hap of d){A+=hap[l];B+=hap[l+1];AB+=hap[l]*hap[l+1]}
      A/=2*N;B/=2*N;AB/=2*N;const v=A*(1-A)*B*(1-B);if(v>0){ld+=(AB-A*B)**2/v;ldn++}
    }
    return {gst:den?Math.max(0,num/den):0,heterozygosity:he,ld:ldn?ld/ldn:0};
  };
  const ancestry=[frequency(genomes)],genetics=[popgen(genomes)];
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
    ancestry.push(frequency(genomes));genetics.push(popgen(genomes));
  }
  // Genotype is fixed within a lifetime: precompute its scalar summaries once.
  const alleles=genomes.map(g=>g.map(x=>x.join("")).join(" / "));
  const geneScore=genomes.map(g=>g.reduce((v,p)=>v+p.reduce((a,b)=>a+b,0),0)/12);
  const locus0=genomes.map(g=>(g[0][0]+g[1][0])/2);
  // All agents start in the same macrostate. Individual differences emerge from interactions.
  let states=people.map(()=>({h:.65,w:1,a:.3,assets:1,debt:0,expression:.5}));
  const graph=people.map((_,i)=>Array.from({length:6},()=>{const local=members[zoneIndex[i]];return random()<.8?local[Math.floor(random()*local.length)]:Math.floor(random()*N)}));
  let learned=[.2,.2,.2],samples=0,predictionLoss=0,dissipation=0;
  let prior=null,prior2=null;
  const one=Array.from({length:8},()=>Array(8).fill(0)),two=Array.from({length:8},()=>Array(8).fill(0));
  // Flow-of-funds ledger: per-capita cumulative flows from the first charted day (t = -28).
  const ledgerKeys=["wage","expense","returns","upside","downside","exchange","debtService","vertex","clip"];
  const ledger=Object.fromEntries(ledgerKeys.map(k=>[k,0]));let ledgerStart=null;
  const meanWealth=()=>states.reduce((v,s)=>v+s.w,0)/N;
  const snapshot=(t,env)=>{
    const current=states.map((s,i)=>({h:s.h,w:s.w,a:s.a,assets:s.assets,debt:s.debt,expression:s.expression,care:env[zoneIndex[i]].care,pressure:env[zoneIndex[i]].pressure,opportunity:env[zoneIndex[i]].opportunity,alleles:alleles[i]}));
    const sorted=current.map(s=>s.w).sort((a,b)=>a-b),positive=sorted.filter(x=>x>0),total=positive.reduce((a,b)=>a+b,0);
    const summary={median:(sorted[Math.floor((N-1)/2)]+sorted[Math.floor(N/2)])/2,topShare:total?positive.slice(-Math.max(1,Math.ceil(N*.01))).reduce((a,b)=>a+b,0)/total:0,negative:sorted.filter(w=>w<0).length/N,meanH:current.reduce((a,s)=>a+s.h,0)/N,meanA:current.reduce((a,s)=>a+s.a,0)/N};
    history.push({day:t,...summary,...observables(current),predictionLoss,dissipation});snapshots.push({day:t,current,summary});
  };
  const f=[0,0,0],weights=new Float64Array(6);
  // A fixed burn-in is shared; real UTC days select a reproducible simulated day.
  for(let t=-180;t<=steps;t++){
    const env=zoneList.map((z,k)=>{
      const local=members[k];let health=0,wealth=0,authority=0;
      for(const i of local){health+=states[i].h;wealth+=states[i].w;authority+=states[i].a}
      return environment(z,t,{health:health/local.length,wealth:wealth/local.length,authority:authority/local.length});
    });
    if(t===-28)ledgerStart=meanWealth();
    if(t>=-28){const bins=states.map(octant);if(prior)for(let i=0;i<N;i++)one[prior[i]][bins[i]]++;if(prior2)for(let i=0;i<N;i++)two[prior2[i]][bins[i]]++;prior2=prior;prior=bins;}
    if(t>=-28&&(t%7===0||t===steps)){snapshot(t,env)}
    if(t===steps)break;
    const gradient=[0,0,0],track=t>=-28;let loss=0,diss=0;
    const next=states.map((s,i)=>{
      const e=env[zoneIndex[i]],neighbors=graph[i];
      // Softmax graph attention with shared logits q·f_j.
      let mh=0,mw=0,ma=0,den=0;
      for(let k=0;k<neighbors.length;k++){const v=states[neighbors[k]],yw=Math.tanh(v.w/5),wt=Math.exp(learned[0]*v.h+learned[1]*yw+learned[2]*v.a);weights[k]=wt;mh+=wt*v.h;mw+=wt*yw;ma+=wt*v.a;den+=wt}
      mh/=den;mw/=den;ma/=den;
      const tri=vertex(s.h,s.w,s.a);diss+=tri.dissipation;
      const interaction=2*(locus0[i]-.5)*(2*e.pressure-1);
      const expression=sigmoid(interaction+.4*(geneScore[i]-.5)+1.5*(e.care-e.pressure)+.7*(s.h-.5));
      const muH=.055*(e.care-s.h)+.022*Math.tanh(s.w/4)+.018*(mh-s.h)+.01*s.a+.02*(expression-.5)-.018*e.pressure+tri.dh+tri.dampH;
      const health=logitStep(s.h,muH,.025,noise());
      // Cash flow in annual essential-basket units; institution/market is the external reservoir.
      const income=wage(s.h,s.a,e.opportunity);
      const cost=expense(s.h,e.pressure);
      const returns=clip(.003*(s.a+.6*e.opportunity)+.012*noise(),-.08,.08)*Math.max(0,s.w);
      const upside=random()<.004*e.opportunity?Math.exp(3.1*random())*.75:0;
      const downside=random()<.009*(1+e.pressure)?Math.exp(2.0*random())*.45:0;
      const exchange=.0015*(mw-Math.tanh(s.w/5)),debtService=.0005*Math.max(0,s.debt),vw=tri.dw+tri.dampW;
      const raw=s.w+income-cost+returns+upside-downside+exchange-debtService+vw;
      const wealth=clip(raw,-100,1e7);
      if(track){ledger.wage+=income/N;ledger.expense-=cost/N;ledger.returns+=returns/N;ledger.upside+=upside/N;ledger.downside-=downside/N;ledger.exchange+=exchange/N;ledger.debtService-=debtService/N;ledger.vertex+=vw/N;ledger.clip+=(wealth-raw)/N}
      const liability=clip(Math.max(0,-wealth)+.96*Math.max(0,s.debt-Math.max(0,-s.w))+.001*(wealth>0?wealth:0),0,1e7);
      const muA=.035*(ma-s.a)+.022*(s.h-.5)+.018*Math.tanh(s.w/5)-.012*e.pressure+tri.da+tri.dampA;
      const authority=logitStep(s.a,muA,.018,noise());
      // Shared auxiliary one-step predictor, squared error, exact softmax gradient.
      // Stop-gradient target: the realized next state of the simulator.
      const alpha=.15,yw=Math.tanh(s.w/5);
      const e0=s.h+alpha*(mh-s.h)-health,e1=yw+alpha*(mw-yw)-Math.tanh(wealth/5),e2=s.a+alpha*(ma-s.a)-authority;
      loss+=(e0*e0+e1*e1+e2*e2)/3;
      for(let k=0;k<neighbors.length;k++){
        const v=states[neighbors[k]];f[0]=v.h-mh;f[1]=Math.tanh(v.w/5)-mw;f[2]=v.a-ma;
        const c=(2*alpha/3)*(e0*f[0]+e1*f[1]+e2*f[2])*(weights[k]/den);
        gradient[0]+=c*f[0];gradient[1]+=c*f[1];gradient[2]+=c*f[2];
      }
      return {h:health,w:wealth,a:authority,assets:wealth+liability,debt:liability,expression};
    });
    // Shared online adaptation of graph attention (projected SGD); no per-person coefficients.
    learned=learned.map((x,k)=>clip(x-.4*gradient[k]/N,-1.5,1.5));predictionLoss=loss/N;dissipation=diss/N;samples++;
    states=next;
  }
  const last=snapshots[snapshots.length-1];
  // Nonparametric bootstrap (agents resampled, B = 200) on an independent stream: dynamics untouched.
  let brng=(seed^0x9e3779b9)>>>0;
  const bdraw=()=>{brng=(Math.imul(brng,1664525)+1013904223)>>>0;return brng/4294967296};
  const boots=[],w=new Float64Array(N);
  for(let b=0;b<200;b++){w.fill(0);for(let i=0;i<N;i++)w[Math.floor(bdraw()*N)]++;boots.push(triple(last.current,w))}
  boots.sort((a,b)=>a-b);
  const delta=states.reduce((v,s)=>v+s.w,0)/N-(ledgerStart??meanWealth());
  const flows=ledgerKeys.reduce((v,k)=>v+ledger[k],0);
  const rel=relaxation(one),current=normalized(last.current.map(octant).reduce((c,b)=>{c[b]++;return c},Array(8).fill(0)));
  return {version:MODEL_VERSION,day:steps,history,snapshots,current:last.current,summary:last.summary,ancestry,genetics,learned,samples,
    diagnostics:observables(last.current),transition:transitionResidual(one,two),
    bootstrap:{connected3:[boots[4],boots[195]]},
    ledger:{...ledger,change:delta,closure:delta-flows},
    nonequilibrium:{irreversibility:irreversibility(one),tau:rel.tau,rho:rel.rho,stationary:rel.stationary,stationaryGap:.5*current.reduce((v,p,i)=>v+Math.abs(p-rel.stationary[i]),0)}};
}
