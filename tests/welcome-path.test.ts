import { test } from "node:test";
import assert from "node:assert/strict";
import { campusRoute } from "../lib/welcome-path";

test("cross-campus route uses intersections rather than cutting across buildings",()=>{
  const route=campusRoute({x:23,y:48},{x:77,y:78});
  assert.deepEqual(route[0],{x:23,y:48});
  assert.deepEqual(route.at(-1),{x:77,y:78});
  assert.ok(route.some(p=>p.x===50&&p.y===55));
  assert.ok(route.some(p=>p.x===50&&p.y===85));
  route.slice(1).forEach((p,i)=>assert.ok(p.x===route[i].x||p.y===route[i].y));
});
test("mid-walk retarget starts at current position and does not return to spawn",()=>{
  const route=campusRoute({x:38,y:55},{x:40,y:55});
  assert.deepEqual(route,[{x:38,y:55},{x:40,y:55}]);
});
test("off-road clicks project to a reachable path and lake NPC is reachable",()=>{
  const route=campusRoute({x:50,y:82},{x:55,y:29});
  assert.deepEqual(route.at(-1),{x:50,y:29});
  assert.deepEqual(campusRoute({x:50,y:29},{x:50,y:29}),[{x:50,y:29}]);
});

