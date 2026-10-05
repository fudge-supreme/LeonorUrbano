import sharp from 'sharp';
const {data,info}=await sharp('reference/collage-original.jpg').resize(300).raw().toBuffer({resolveWithObject:true});
const px=[];for(let i=0;i<data.length;i+=info.channels)px.push([data[i],data[i+1],data[i+2]]);
const K=12;let c=Array.from({length:K},(_,i)=>px[Math.floor(i*px.length/K)].slice());
let a=new Array(px.length);
for(let it=0;it<25;it++){const s=c.map(()=>[0,0,0,0]);
px.forEach((p,j)=>{let b=0,bd=1e9;c.forEach((q,k)=>{const d=(p[0]-q[0])**2+(p[1]-q[1])**2+(p[2]-q[2])**2;if(d<bd){bd=d;b=k}});a[j]=b;s[b][0]+=p[0];s[b][1]+=p[1];s[b][2]+=p[2];s[b][3]++});
c=s.map((x,k)=>x[3]?[x[0]/x[3],x[1]/x[3],x[2]/x[3],x[3]]:c[k]);}
const hex=v=>'#'+v.slice(0,3).map(n=>Math.round(n).toString(16).padStart(2,'0')).join('').toUpperCase();
c.sort((x,y)=>y[3]-x[3]).forEach(x=>console.log(hex(x),(100*x[3]/px.length).toFixed(1)+'%'));
// saturated accents: top saturated pixels by hue bucket
const buckets={};px.forEach(([r,g,b])=>{const mx=Math.max(r,g,b),mn=Math.min(r,g,b);const s=mx?(mx-mn)/mx:0;if(s<.55||mx<120)return;let h;const d=mx-mn;if(mx===r)h=((g-b)/d)%6;else if(mx===g)h=(b-r)/d+2;else h=(r-g)/d+4;h=Math.round(((h*60+360)%360)/30)*30%360;(buckets[h]??=[]).push([r,g,b])});
console.log('--accents by hue');for(const[h,l]of Object.entries(buckets)){const m=[0,1,2].map(i=>l.reduce((s,p)=>s+p[i],0)/l.length);console.log(h,hex(m),l.length)}
// sample logo yellow
const big=await sharp('reference/collage-original.jpg').raw().toBuffer({resolveWithObject:true});
const W=big.info.width;const at=(x,y)=>{const i=(y*W+x)*3;return hex([big.data[i],big.data[i+1],big.data[i+2]])};
console.log('yellow',at(Math.round(965*1.125),Math.round(330*1.125)),'white',at(Math.round(722*1.125),Math.round(560*1.125)));
