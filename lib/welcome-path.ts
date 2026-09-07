export type MapPoint = { x: number; y: number };
const nodes: MapPoint[] = [
  {x:50,y:23},{x:50,y:55},{x:50,y:85},{x:50,y:100},
  {x:23,y:55},{x:77,y:55},{x:23,y:85},{x:77,y:85},
  {x:23,y:48},{x:77,y:48},{x:23,y:78},{x:77,y:78},

];
const edges = [[0,1],[1,2],[2,3],[1,4],[1,5],[2,6],[2,7],[4,8],[5,9],[6,10],[7,11]];
const distance=(a:MapPoint,b:MapPoint)=>Math.hypot(a.x-b.x,a.y-b.y);
function project(point:MapPoint) {
  let best={point:nodes[0],edge:0,distance:Infinity};
  edges.forEach(([a,b],edge)=>{
    const start=nodes[a],end=nodes[b];
    const t=Math.max(0,Math.min(1,((point.x-start.x)*(end.x-start.x)+(point.y-start.y)*(end.y-start.y))/distance(start,end)**2));
    const candidate={x:start.x+(end.x-start.x)*t,y:start.y+(end.y-start.y)*t};
    if(distance(point,candidate)<best.distance) best={point:candidate,edge,distance:distance(point,candidate)};
  });
  return best;
}
/** Project clicks to the road, then find a route without crossing lawns or buildings. */
export function campusRoute(from:MapPoint,to:MapPoint):MapPoint[] {
  const start=project(from),end=project(to),points=[...nodes,start.point,end.point];
  const startIndex=nodes.length,endIndex=nodes.length+1;
  const links=edges.map(([a,b])=>[a,b]);
  edges[start.edge].forEach(n=>links.push([startIndex,n]));
  edges[end.edge].forEach(n=>links.push([endIndex,n]));
  if(start.edge===end.edge)links.push([startIndex,endIndex]);
  const costs=points.map(()=>Infinity),previous=points.map(()=>-1),visited=new Set<number>();
  costs[startIndex]=0;
  while(!visited.has(endIndex)){
    let current=-1;
    costs.forEach((cost,i)=>{if(!visited.has(i)&&(current===-1||cost<costs[current]))current=i;});
    if(current===-1||!Number.isFinite(costs[current]))break;
    visited.add(current);
    links.forEach(([a,b])=>{
      const next=a===current?b:b===current?a:-1;
      if(next<0)return;
      const cost=costs[current]+distance(points[current],points[next]);
      if(cost<costs[next]){costs[next]=cost;previous[next]=current;}
    });
  }
  const result:MapPoint[]=[];
  for(let i=endIndex;i!==-1;i=previous[i])result.unshift(points[i]);
  return result.filter((point,i)=>i===0||distance(point,result[i-1])>.001);
}



