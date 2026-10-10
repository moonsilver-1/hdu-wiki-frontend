export type RoomPoint = { x: number; b: number };
const obstacle = { left: 29, right: 71, bottom: 14, top: 33 };
const inside = (p: RoomPoint) => p.x > obstacle.left && p.x < obstacle.right && p.b > obstacle.bottom && p.b < obstacle.top;
const distance = (a: RoomPoint, b: RoomPoint) => Math.abs(a.x-b.x)+Math.abs(a.b-b.b);

/** Walkable floor ends in front of the shelves; keep a margin around the table. */
export function libraryRoute(from: RoomPoint, requested: RoomPoint): RoomPoint[] {
  let target = {x:Math.max(8,Math.min(92,requested.x)),b:Math.max(8,Math.min(44,requested.b))};
  if(inside(target)) {
    target = [{x:26,b:target.b},{x:74,b:target.b},{x:target.x,b:11},{x:target.x,b:36}]
      .sort((a,b)=>distance(a,target)-distance(b,target))[0];
  }
  const xs=[...new Set([from.x,target.x,26,74])],bs=[...new Set([from.b,target.b,11,36])];
  const points=xs.flatMap(x=>bs.map(b=>({x,b}))).filter(p=>!inside(p));
  const start=points.findIndex(p=>p.x===from.x&&p.b===from.b),end=points.findIndex(p=>p.x===target.x&&p.b===target.b);
  if(start<0||end<0)return [from];
  function clear(a:RoomPoint,b:RoomPoint) {
    if(a.x===b.x)return !(a.x>29&&a.x<71&&Math.max(a.b,b.b)>14&&Math.min(a.b,b.b)<33);
    if(a.b===b.b)return !(a.b>14&&a.b<33&&Math.max(a.x,b.x)>29&&Math.min(a.x,b.x)<71);
    return false;
  }
  const costs=points.map(()=>Infinity),previous=points.map(()=>-1),visited=new Set<number>();costs[start]=0;
  while(!visited.has(end)) {
    let current=-1;
    costs.forEach((c,i)=>{if(!visited.has(i)&&(current<0||c<costs[current]))current=i;});
    if(current<0||!Number.isFinite(costs[current]))return [from];
    visited.add(current);
    points.forEach((p,i)=>{if(i===current||!clear(points[current],p))return;const cost=costs[current]+distance(points[current],p);if(cost<costs[i]){costs[i]=cost;previous[i]=current;}});
  }
  const route:RoomPoint[]=[];
  for(let i=end;i>=0;i=previous[i])route.unshift(points[i]);
  return route;
}
