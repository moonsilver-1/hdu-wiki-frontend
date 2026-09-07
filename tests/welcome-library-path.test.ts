import { test } from "node:test";
import assert from "node:assert/strict";
import { libraryRoute } from "../lib/welcome-library-path";
import { spriteRows } from "../lib/welcome-sprites";

test("shelf journey reaches its front and routes around the reading table",()=>{
  for(const x of [17,50,83]){
    const route=libraryRoute({x:50,b:12},{x,b:44});
    assert.deepEqual(route.at(-1),{x,b:44});
    route.slice(1).forEach((p,i)=>{
      const from=route[i];
      assert.ok(p.x===from.x||p.b===from.b);
      for(let step=0;step<=20;step++){
        const t=step/20,px=from.x+(p.x-from.x)*t,pb=from.b+(p.b-from.b)*t;
        assert.ok(!(px>29&&px<71&&pb>14&&pb<33),"path crossed reading table");
      }
    });
  }
});
test("floor retargeting starts from the current position and clamps walls",()=>{
  const route=libraryRoute({x:26,b:25},{x:-20,b:150});
  assert.deepEqual(route[0],{x:26,b:25});
  assert.deepEqual(route.at(-1),{x:8,b:44});
});
test("all sprite rows contain the measured head and shoe bounds without crossing rows",()=>{
  const ink=[[13,133],[143,252],[262,370],[381,492],[503,617],[625,733],[743,850],[858,958]];
  spriteRows.forEach((row,i)=>{
    assert.ok(row.top<=ink[i][0]);
    assert.ok(row.top+row.height>ink[i][1]);
    assert.ok(row.top+row.height<=960);
    if(i)assert.ok(row.top>ink[i-1][1]);
    if(i<7)assert.ok(row.top+row.height<=ink[i+1][0]);
  });
});
