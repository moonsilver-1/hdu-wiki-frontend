"use client";
import { useId } from "react";

// Each foot follows a planted-contact / swing / opposite-contact cycle.
// Arms use the opposite phase. Shoe direction never changes within a view.
function MotionPath({ values, color, width }: { values: string[]; color: string; width: number }) {
  return <>{["#292b29", color].map((stroke, i) => <path key={i} d={values[0]} fill="none" stroke={stroke} strokeWidth={width + (i ? 0 : 1.4)} strokeLinecap="square" strokeLinejoin="round"><animate attributeName="d" values={[...values, values[0]].join(";")} dur="0.72s" repeatCount="indefinite" calcMode="linear" /></path>)}</>;
}

function View({ direction, girl }: { direction: string; girl: boolean }) {
  const id = useId().replace(/:/g, "");
  const side = direction === "left" || direction === "right";
  const back = direction === "up";
  const jacket = girl ? "#a34632" : "#294d66";
  const sleeve = `url(#${id}-sleeve)`;
  const trousers = `url(#${id}-trousers)`;
  const leather = `url(#${id}-leather)`;
  const legPaths = (offset: number) => Array.from({ length: 4 }, (_, n) => {
    const p = (n + offset) % 4;
    if (side) {
      const knees = [[44, 119], [49, 119], [57, 120], [53, 118]];
      const feet = [[36, 133], [47, 133], [65, 130], [55, 126]];
      return `M50 105 L${knees[p][0]} ${knees[p][1]} L${feet[p][0]} ${feet[p][1]}`;
    }
    const x = offset ? 57 : 43;
    const y = (back ? [127, 132, 137, 128] : [137, 132, 127, 128])[p];
    return `M${x} 105 L${x} ${Math.min(121, y - 8)} L${x} ${y}`;
  });
  const shoePaths = (offset: number) => Array.from({ length: 4 }, (_, n) => {
    const p = (n + offset) % 4;
    if (side) {
      const feet = [[36, 133], [47, 133], [65, 130], [55, 126]];
      const [x, y] = feet[p];
      return `M${x - 6} ${y} L${x + 2} ${y}`;
    }
    const x = offset ? 57 : 43;
    const y = (back ? [127, 132, 137, 128] : [137, 132, 127, 128])[p];
    return `M${x - 3} ${y} L${x + 3} ${y}`;
  });
  const arms = (offset: number, hand = false) => Array.from({ length: 4 }, (_, n) => {
    const p = (n + offset) % 4;
    if (side) {
      const hands = [[64, 100], [55, 103], [36, 98], [45, 101]];
      const [x, y] = hands[p];
      return hand ? `M${x} ${y - 1} L${x} ${y + 2}` : `M50 78 L${(50 + x) / 2} 91 L${x} ${y}`;
    }
    const x = offset ? 68 : 32;
    const y = (back ? [108, 104, 98, 104] : [98, 104, 108, 104])[p];
    return hand ? `M${x} ${y} L${x} ${y + 2}` : `M${offset ? 63 : 37} 78 L${x} 91 L${x} ${y}`;
  });
  return <svg className={"pw-rig-view pw-rig-" + direction} viewBox="0 0 100 145" aria-hidden="true">
    <defs>{[
      { name: "sleeve", box: "133 282 43 140" },
      { name: "trousers", box: "401 262 63 189" },
      { name: "leather", box: "381 480 73 24" },
    ].map(({ name, box }) => <pattern key={name} id={`${id}-${name}`} patternUnits="userSpaceOnUse" width="12" height={name === "leather" ? 7 : 28} viewBox={box} preserveAspectRatio="none"><image href="/welcome/walk-textures.png" width="1254" height="1254" /></pattern>)}
    <clipPath id={`${id}-torso`}><path d="M38 74H62L65 106H35Z" /></clipPath></defs>
    <g transform={direction === "right" ? "translate(100 0) scale(-1 1)" : undefined}>
      <g opacity=".85"><MotionPath values={legPaths(2)} color={trousers} width={9} /><MotionPath values={shoePaths(2)} color={leather} width={7} />
      <MotionPath values={arms(2)} color={sleeve} width={9} /><MotionPath values={arms(2, true)} color="#e9b780" width={7} /></g>
      <MotionPath values={legPaths(0)} color={trousers} width={10} /><MotionPath values={shoePaths(0)} color={leather} width={7} />
      <path d="M44 65H56V78H44Z" fill="#efc38e" />
      <path d="M38 74 H62 L65 106 H35Z" fill={jacket} stroke="#263638" strokeWidth={2} />
      {!back && !side && <><path d="M46 76H54V102H46Z" fill="#f0ead7" /><path d="M40 77V99M60 77V99" stroke="#c2a75e" strokeWidth={3} /></>}
      {side && <path d="M59 77H72V103H61Z" fill="#bf923e" stroke="#69582f" strokeWidth={2} />}
      {side && <><svg x="39" y="75" width="21" height="30" viewBox={`778 ${girl ? 762 : 270} 40 213`} preserveAspectRatio="none"><image href="/welcome/walk-textures.png" width="1254" height="1254" /></svg><svg x="60" y="78" width="12" height="25" viewBox={`1020 ${girl ? 797 : 305} 130 169`} preserveAspectRatio="none"><image href="/welcome/walk-textures.png" width="1254" height="1254" /></svg></>}
      {back && <><path d="M39 77H61L64 100H36Z" fill="#d0a14d" stroke="#72572e" strokeWidth={2} /><path d="M41 91H59V100H41Z" fill="#b88b3d" stroke="#796333" strokeWidth={1.5} /></>}
      {!side && <g clipPath={`url(#${id}-torso)`}><svg x="35" y="73" width="30" height="34" viewBox={`${back ? 1000 : 641} ${girl ? 741 : 249} 183 244`} preserveAspectRatio="none"><image href="/welcome/walk-textures.png" width="1254" height="1254" /></svg></g>}
      <MotionPath values={arms(0)} color={sleeve} width={9} /><MotionPath values={arms(0, true)} color="#f2c48b" width={7} />
    </g>
  </svg>;
}

export default function WalkingRig({ girl }: { girl: boolean }) {
  return <span className="pw-walking-rig" aria-hidden="true">{["down", "left", "right", "up"].map(direction => <View key={direction} direction={direction} girl={girl} />)}</span>;
}
