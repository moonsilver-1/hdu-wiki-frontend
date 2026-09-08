# Welcome image assets — 2026-09-08

Generated with the built-in image generation tool.

## noticeboard.png
Prompt: Single premium pixel-art RPG campus map noticeboard, transparent background, slight top-down front view, sage tiled roof, walnut frame, two short legs, pinned cream campus map, blank label strip, crisp pixel clusters, no text or scenery.

## xiasha-map-v2.png
Edit source: user-provided campus map. Move running label ① to 西北田径场; keep 体育馆旁②; move ③ to 东操场; remove ④ and old ①③ locations. Preserve other labels, buildings, layout and illustration style.

## gift.png
Built-in image generation prompt: isolated exquisite pixel-art cream parchment gift box, dusty-red ribbon and bow, tiny gold star seal and sage leaf, transparent background, crisp edges, readable at small game-item scale, no text or scenery.

## Walking motion
Generated replacement sheets were rejected because of repeated same-side contact poses, extra hands, or changed proportions. Moving characters now retain the original atlas head and use WalkingRig SVG limb paths. Each arm is opposite its same-side leg, the two sides have a half-cycle offset, and shoes retain their heading. One cycle lasts 0.72 seconds. The player display box stays unchanged. Static characters retain the full original sprite.

## 2026-09-08 corrections
- xiasha-map-v3.png (built-in image edit): correct dorms to top18/16/15/14/13, add west21/22, preserve central12/11/10,8/6/5,4/3/2 and east32..27; move gym label from 五六餐厅 to 清真餐厅楼上; preserve running points①②③.
- walk-atlas-v2.png (built-in image edit): original character style, measured output1023x1537 with calibrated crops. The current implementation uses it for static sprites and moving heads; earlier alternating full-frame and mirrored-leg approaches are superseded by WalkingRig.
- xiasha-map-v4.png (built-in image edit): remove the erroneous lower-left garden label and restore both complete bottom banners, preserving the dorm, gym and running-point corrections. Used by the map dialog and noticeboard thumbnail.
- Sign labels now scale inside the artwork SVG viewBox; removed overlapping corner note and moved bottom trees outward.
`n## Shaoxing and textured gait`n- shaoxing-map.png: built-in image generation from the supplied aerial campus map, using xiasha-map-v4.png as style reference only. Preserve nine numbered buildings, waterways, named bridges, roads and address; warm cartoon buildings, green trees and cream paths. Both dialog and noticeboard use this asset.`n- walk-textures.png: built-in image generation of separate cream sleeves, navy trousers and brown shoes, front varsity jackets and backpack torsos for both characters, matching walk-atlas-v2. Runtime SVG samples the painted interiors and retains the accepted opposing limb cycle and existing character scale. The generated full-frame alternative was rejected for repeated side contacts. No new whole-frame gait sheet is used.
`n## Final user correction`n- shaoxing-map-v2.png: built-in image edit, replace only building 9 label with 学生公寓, preserve the remaining map. Both consumers updated.`n- User requested restoring intact pixel characters with translation only. WalkingRig is no longer rendered; the original complete directional sprite stays visible while moving.
