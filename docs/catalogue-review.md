# Product catalogue — items to review

The catalogue was imported from the previous website (b-ledtec.com). Where its data was inconsistent the import
made a choice; each one is listed here so the product team can confirm or correct it in `content/catalogue.json`.

218 models, 1008 variants. Dropped: 37 records (duplicates and test entries).

## Photos

The previous site's product photos are small (most about 220 px wide) and 75 models share a photo with another
model. They are shown at their natural size on white cards. New product photography (≥ 1200 px, white background)
is needed for a sharp catalogue: drop files into `public/media/catalogue/` with the same names.

## Models

### PD11 — LED Cylinder Light

- Typo in model text: 'LED Cylinder Ligh' ('Ligh' -> 'Light').

### PD21 — LED Cylinder Light

- Typo in model text: 'LED Cylinder Ligh' ('Ligh' -> 'Light').

### PD31 — LED Cylinder Light

- Typo in model text: 'LED Cylinder Ligh' ('Ligh' -> 'Light').

### PL52 — LED Round Panel Light

- Body & Diffuser differs between variants: 'Extruded Aluminum & PMMA Diffuser', 'Aluminum Body & PMMA Diffuser' (model uses majority).
- Typo in model text: 'LED Round Panel Ligh' ('Ligh' -> 'Light').
- `PL52-IN1-860-01-35`: Old record is a TEST item (attribute 'TEST: YES/NO', long description 'Pla pla…', 4 unrelated images). Specs recovered from its marketing paragraph (35W, 3850 lm, 6000K, aluminium + PMMA, internal driver, IP20) and match its PL52 siblings — please confirm this variant really exists.

### LL11 — LED Linear Light

- `LL11-IN1-860-05-40`: IP conflict: text says IP54 but SKU code '05' suggests IP65 — kept text value.

### PF53 — LED Custom Profile Light

- Variants are listed under 3 different category branches: indoor-lighting > pendant > linear-lights | indoor-lighting > recessed > linear | indoor-lighting > surface > linear-lights-surface.

### PF63 — LED Custom Profile Light

- Variants are listed under 2 different category branches: indoor-lighting > pendant > linear-lights | indoor-lighting > surface > linear-lights-surface.

### TN11 — LED Trunking Light

- 9 variant(s) were listed on the old site under family category LL11 but their SKU prefix is TN11; grouped by SKU prefix.

### DL22 — LED Recessed Downlight

- Body & Diffuser differs between variants: 'Die-Cast Aluminum', 'Die-Cast Aluminum Housing' (model uses majority).

### DL24 — LED Recessed Downlight

- 1 variant(s) were listed on the old site under family category DL25 but their SKU prefix is DL24; grouped by SKU prefix.
- Body & Diffuser differs between variants: 'Die-Cast Aluminum', 'Die-Cast Aluminum Housing' (model uses majority).

### DL25 — LED Recessed Downlight

- Body & Diffuser differs between variants: 'Die-Cast Aluminum', 'Die-Cast Aluminum Housing' (model uses majority).

### DL32 — LED Recessed Downlight

- `DL32-IN1-830-01-14`: Wattage conflict: text 13W vs SKU suffix '14' — kept text value.
- `DL32-IN1-840-01-14`: Wattage conflict: text 13W vs SKU suffix '14' — kept text value.
- `DL32-IN1-860-01-14`: Wattage conflict: text 13W vs SKU suffix '14' — kept text value.

### DL61 — LED Adjustable Downlight

- `DL61-IN1-830-01-11`: IP rating missing/truncated in text ('IP') — inferred IP20 from SKU code '01'.
- `DL61-IN1-830-01-11`: Driver missing (text truncated) — left null.
- `DL61-IN1-840-01-11`: Driver missing (text truncated) — left null.
- `DL61-IN1-860-01-11`: IP rating missing/truncated in text ('') — inferred IP20 from SKU code '01'.
- `DL61-IN1-860-01-11`: Driver missing (text truncated) — left null.
- `DL61-IN1-860-01-24`: IP rating missing/truncated in text ('') — inferred IP20 from SKU code '01'.
- `DL61-IN1-860-01-24`: Driver missing (text truncated) — left null.

### DL95 — LED Recessed Square Downlight

- `DL95-IN1-830-01-8`: IP conflict: text says IP65 but SKU code '01' suggests IP20 — kept text value.
- `DL95-IN1-840-01-8`: IP conflict: text says IP65 but SKU code '01' suggests IP20 — kept text value.
- `DL95-IN1-860-01-8`: IP conflict: text says IP65 but SKU code '01' suggests IP20 — kept text value.

### DLF3 — LED Downlight

- Body & Diffuser differs between variants: 'Die-Cast Aluminum & PC Diffuser', 'Die-Cast Aluminum' (model uses majority).
- `DLF3-IN1-860-04-18`: Driver missing (text truncated) — set to 'Integrated' from siblings.

### DLF5 — LED Downlight

- 2 variant(s) were listed on the old site under family category DLF9 but their SKU prefix is DLF5; grouped by SKU prefix.

### DLF8 — LED Downlight

- 2 variant(s) were listed on the old site under family category DLF9 but their SKU prefix is DLF8; grouped by SKU prefix.

### PL11 — LED Recessed Panel Light

- `PL11-IN1-860-02-40`: CCT conflict: text says 4000K but SKU code '860' = 6000K — using SKU value (text looks copy-pasted from a sibling).
- `PL11-IN1-860-02-40`: IP conflict: text says IP54 but SKU code '02' suggests IP40 — kept text value.

### PL21 — LED Recessed Panel Light

- 2 variant(s) were listed on the old site under family category PL23 but their SKU prefix is PL21; grouped by SKU prefix.
- Body & Diffuser differs between variants: 'Extruded Aluminum & PMMA Diffuser', 'Extruded Aluminum & Opal (Milky) Diffuser' (model uses majority).

### PL31 — LED Recessed Panel Light

- 13 variant(s) were listed on the old site under family category PL21 but their SKU prefix is PL31; grouped by SKU prefix.
- `PL31-IN1-840-02-40`: IP conflict: text says IP54 but SKU code '02' suggests IP40 — kept text value.

### PL51 — LED Recessed Panel Light

- Body & Diffuser differs between variants: 'Aluminum & PC Diffuser', 'PC Housing & PC Diffuser' (model uses majority).

### PL71 — LED Recessed Troffer Panel Light

- Typo 'Troofer' in model text (→ 'Troffer').

### PL72 — LED Recessed Troffer Panel Light

- Typo 'Troofer' in model text (→ 'Troffer').
- `PL72-IN1-840-12-64`: Driver missing (text truncated) — set to 'Internal' from siblings.

### PL73 — LED Recessed Troffer Panel Light

- Typo 'Troofer' in model text (→ 'Troffer').

### PL81 — LED Recessed Back-Lit Panel Light

- `PL81-IN1-830-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-830-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-840-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-840-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-840-13-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-860-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL81-IN1-860-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.

### BL12 — LED Bulb

- `BL-GL-12W-NW`: SKU suffix '-NW' (neutral white) contradicts text CCT 2700K — kept text value.

### BL13 — LED Bulb

- 1 variant(s) were listed on the old site under family category BL12 but their SKU prefix is BL13; grouped by SKU prefix.

### BL14 — LED Bulb

- 1 variant(s) were listed on the old site under family category BL12 but their SKU prefix is BL14; grouped by SKU prefix.

### TL22 — LED T8 Tube Light (AC)

- 1 variant(s) were listed on the old site under family category TL11 but their SKU prefix is TL22; grouped by SKU prefix.

### CL32 — LED Surface-Mounted Ceiling Light

- `CL32-IN1-840-34-25`: Driver missing (text truncated) — set to 'Integrated' from siblings.

### CL33 — LED Surface-Mounted Ceiling Light

- 1 variant(s) were listed on the old site under family category CL32 but their SKU prefix is CL33; grouped by SKU prefix.

### CL51 — LED Ceiling Light

- `CL51-IN1-830-01-40`: Model text contains spreadsheet artefact 'Ceiling+D106:U106 light' (normalised to 'LED Ceiling Light').
- `CL51-IN1-830-01-40`: CCT conflict: text says 4000K but SKU code '830' = 3000K — using SKU value (text looks copy-pasted from a sibling).

### CL71 — LED Surface / Pendant Downlight

- `CL71-IN1-830-04-35`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL71-IN1-830-04-35`: Driver missing (text truncated) — left null.
- `CL71-IN1-830-04-35`: Body & Diffuser missing (text truncated) — left null.
- `CL71-IN1-840-04-35`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL71-IN1-840-04-35`: Driver missing (text truncated) — left null.
- `CL71-IN1-840-04-35`: Body & Diffuser missing (text truncated) — left null.
- `CL71-IN1-860-04-35`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL71-IN1-860-04-35`: Driver missing (text truncated) — left null.
- `CL71-IN1-860-04-35`: Body & Diffuser missing (text truncated) — left null.

### CL73 — LED Surface-Mounted Cylinder Downlight

- `CL73-IN1-830-04-7`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL73-IN1-830-04-7`: Driver missing (text truncated) — left null.
- `CL73-IN1-830-04-7`: Body & Diffuser missing (text truncated) — left null.
- `CL73-IN1-840-04-7`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL73-IN1-840-04-7`: Driver missing (text truncated) — left null.
- `CL73-IN1-840-04-7`: Body & Diffuser missing (text truncated) — left null.
- `CL73-IN1-860-04-7`: IP rating missing/truncated in text ('') — inferred IP54 from SKU code '04'.
- `CL73-IN1-860-04-7`: Driver missing (text truncated) — left null.
- `CL73-IN1-860-04-7`: Body & Diffuser missing (text truncated) — left null.

### BT12 — LED Batten Light

- `BT12-IN1-830-02-42`: Wattage conflict: text 40W vs SKU suffix '42' — kept text value.
- `BT12-IN1-840-02-42`: Wattage conflict: text 40W vs SKU suffix '42' — kept text value.
- `BT12-IN1-860-02-42`: Wattage conflict: text 40W vs SKU suffix '42' — kept text value.

### BT15 — LED Batten Light

- `BT15-IN1-830-02-70`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.
- `BT15-IN1-840-02-70`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.
- `BT15-IN1-860-02-70`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.

### BT18 — LED Batten Light

- `BT18-IN1-830-02-40`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.
- `BT18-IN1-840-02-40`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.
- `BT18-IN1-860-02-40`: IP rating missing/truncated in text ('') — inferred IP40 from SKU code '02'.

### SP12 — LED Strip Light 2835 AC

- Driver differs between variants: No Driver, Included (model uses majority).

### PL13 — LED Surface Panel Light

- 13 variant(s) were listed on the old site under family category PL23 but their SKU prefix is PL13; grouped by SKU prefix.

### PL33 — LED Surface Panel Light

- 12 variant(s) were listed on the old site under family category PL23 but their SKU prefix is PL33; grouped by SKU prefix.

### PL83 — LED Surface Back-Lit Panel Light

- `PL83-IN1-830-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL83-IN1-830-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL83-IN1-840-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL83-IN1-840-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL83-IN1-860-02-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.
- `PL83-IN1-860-03-36`: Wattage conflict: text 40W vs SKU suffix '36' — kept text value.

### UD52 — LED Wall Up-Shine Light

- `UD52-IN1-860-05-20`: CCT conflict: text says 3000K but SKU code '860' = 6000K — using SKU value (text looks copy-pasted from a sibling).
- `UD52-IN1-860-05-20`: Implausible efficacy 300 lm/W (20W, 6000 lm) — check lumens/power.

### UD53 — LED Wall Up-Shine Light

- `UD53-IN1-830-05-30`: Power typo: text says 3W with 3000 lm (impossible 1000 lm/W); SKU says 30W — corrected to 30W.
- `UD53-IN1-840-05-30`: Power typo: text says 3W with 3000 lm (impossible 1000 lm/W); SKU says 30W — corrected to 30W.
- `UD53-IN1-860-05-30`: Power typo: text says 3W with 3000 lm (impossible 1000 lm/W); SKU says 30W — corrected to 30W.

### WB11 — LED Wall-Back Light

- 'Wall Back' is the old site's wording; it may mean the industry term 'Wall Pack' — confirm before publishing.

### WB31 — LED Wall-Back Light

- 'Wall Back' is the old site's wording; it may mean the industry term 'Wall Pack' — confirm before publishing.

### FLA4 — LED SMD Flood Light

- 1 variant(s) were listed on the old site under family category FL24 but their SKU prefix is FLA4; grouped by SKU prefix.

### TP22 — LED Tri-Proof Light

- 1 variant(s) were listed on the old site under family category TP28 but their SKU prefix is TP22; grouped by SKU prefix.

### TP28 — LED Tri-Proof Light

- `TP28-IN1-840-06-50`: Driver missing (text truncated) — set to 'Integrated' from siblings.

### BH11 — LED Surface-Mounted Light

- `BH11-IN1-830-05-18`: Driver missing (text truncated) — left null.
- `BH11-IN1-840-05-18`: Driver missing (text truncated) — left null.
- `BH11-IN1-860-05-18`: Driver missing (text truncated) — left null.
- `BH11-IN1-840-02-30`: Driver missing (text truncated) — left null.

### BH15 — LED Surface-Mounted Light

- `BH15-IN1-840-05-28`: Driver missing (text truncated) — set to 'Integrated' from siblings.
- `BH15-IN1-860-05-28`: Driver missing (text truncated) — set to 'Integrated' from siblings.

### BH23 — LED Surface-Mounted Light

- `BH23-IN1-860-05-18`: Driver text truncated ('In') — set to 'Integrated' (sibling majority).

### BH25 — LED Surface-Mounted Light

- `BH25-IN1-840-05-20`: Driver text truncated ('Int') — set to 'Integrated'.
- `BH25-IN1-840-15-20`: Driver text truncated ('Int') — set to 'Integrated'.
- `BH25-IN1-830-05-28`: Driver text truncated ('Inte') — set to 'Integrated'.
- `BH25-IN1-840-05-28`: Driver text truncated ('Int') — set to 'Integrated'.
- `BH25-IN1-860-05-28`: Driver text truncated ('I') — set to 'Integrated'.

### BH27 — LED Surface-Mounted Light

- `BH27-IN1-830-05-18`: CCT missing from text (truncated) — taken from SKU code '830' = 3000K.
- `BH27-IN1-830-05-18`: IP rating missing/truncated in text ('') — inferred IP65 from SKU code '05'.
- `BH27-IN1-830-05-18`: Driver missing (text truncated) — left null.
- `BH27-IN1-830-05-18`: Body & Diffuser missing (text truncated) — left null.
- `BH27-IN1-840-05-18`: CCT missing from text (truncated) — taken from SKU code '840' = 4000K.
- `BH27-IN1-840-05-18`: IP rating missing/truncated in text ('') — inferred IP65 from SKU code '05'.
- `BH27-IN1-840-05-18`: Driver missing (text truncated) — left null.
- `BH27-IN1-840-05-18`: Body & Diffuser missing (text truncated) — left null.
- `BH27-IN1-860-05-18`: CCT missing from text (truncated) — taken from SKU code '860' = 6000K.
- `BH27-IN1-860-05-18`: IP rating missing/truncated in text ('') — inferred IP65 from SKU code '05'.
- `BH27-IN1-860-05-18`: Driver missing (text truncated) — left null.
- `BH27-IN1-860-05-18`: Body & Diffuser missing (text truncated) — left null.

### BH28 — LED Surface-Mounted Light

- `BH28-IN1-840-05-28`: CCT missing from text (truncated) — taken from SKU code '840' = 4000K.
- `BH28-IN1-840-05-28`: IP rating missing/truncated in text ('') — inferred IP65 from SKU code '05'.
- `BH28-IN1-840-05-28`: Driver missing (text truncated) — set to 'Integrated' from siblings.
- `BH28-IN1-840-05-28`: Body & Diffuser missing (text truncated) — set to 'Polycarobante' from siblings.
- `BH28-IN1-860-05-28`: CCT missing from text (truncated) — taken from SKU code '860' = 6000K.
- `BH28-IN1-860-05-28`: IP rating missing/truncated in text ('') — inferred IP65 from SKU code '05'.
- `BH28-IN1-860-05-28`: Driver missing (text truncated) — set to 'Integrated' from siblings.
- `BH28-IN1-860-05-28`: Body & Diffuser missing (text truncated) — set to 'Polycarobante' from siblings.

### BH2A — LED Surface-Mounted Light

- `BH2A-IN1-830-05-18`: Driver text truncated ('Integr') — set to 'Integrated'.
- `BH2A-IN1-840-05-18`: Driver text truncated ('Integr') — set to 'Integrated'.
- `BH2A-IN1-860-05-18`: Driver text truncated ('Integr') — set to 'Integrated'.

### BH2B — LED Surface-Mounted Light

- 2 variant(s) were listed on the old site under family category BH28 but their SKU prefix is BH2B; grouped by SKU prefix.
- `BH2B-IN1-830-05-28`: Driver text truncated ('Integr') — set to 'Integrated'.
- `BH2B-IN1-840-05-28`: Driver text truncated ('Integr') — set to 'Integrated'.
- `BH2B-IN1-860-05-28`: Driver text truncated ('Integr') — set to 'Integrated'.

### BH31 — LED Surface-Mounted Rectangular Light

- `BH31-IN1-830-05-10`: Driver text truncated ('In') — set to 'Integrated' (sibling majority).
- `BH31-IN1-840-05-10`: Driver text truncated ('Inte') — set to 'Integrated' (sibling majority).

### WW11 — LED Wall Washer Light

- `WW11-IN1-830-06-30`: Wattage conflict: text 20W vs SKU suffix '30' — kept text value.
- `WW11-IN1-840-06-30`: Wattage conflict: text 20W vs SKU suffix '30' — kept text value.
- `WW11-IN1-860-06-30`: Wattage conflict: text 20W vs SKU suffix '30' — kept text value.

### WW63 — LED Wall Washer Light

- `WW63-IN1-830-06-10`: Wattage conflict: text 30W vs SKU suffix '10' — kept text value.
- `WW63-IN1-840-06-10`: Wattage conflict: text 30W vs SKU suffix '10' — kept text value.
- `WW63-IN1-860-06-10`: Wattage conflict: text 30W vs SKU suffix '10' — kept text value.

### BDL1 — LED Bollard Light

- Material text 'PC optinal diffuser' is ambiguous (optical or optional diffuser?) — normalised to 'PC Diffuser'.
- `BDL1-IN1-730-06-27`: Wattage conflict: text 28W vs SKU suffix '27' — kept text value.
- `BDL1-IN1-740-06-27`: Wattage conflict: text 28W vs SKU suffix '27' — kept text value.
- `BDL1-IN1-760-06-27`: Wattage conflict: text 28W vs SKU suffix '27' — kept text value.

### UL22 — LED Recessed In-ground Light

- `UL22-IN1-740-07-25`: CCT conflict: text says 3000K but SKU code '740' = 4000K — using SKU value (text looks copy-pasted from a sibling).
- `UL22-IN1-760-07-25`: CCT conflict: text says 3000K but SKU code '760' = 6000K — using SKU value (text looks copy-pasted from a sibling).

### UL27 — LED Recessed In-ground Light

- `UL27-IN1-830-07-10`: Wattage conflict: text 12W vs SKU suffix '10' — kept text value.
- `UL27-IN1-840-07-10`: Wattage conflict: text 12W vs SKU suffix '10' — kept text value.
- `UL27-IN1-860-07-10`: Wattage conflict: text 12W vs SKU suffix '10' — kept text value.

### FL39 — LED Spike Light

- Body & Diffuser differs between variants: 'Aluminum', 'Aluminum & Tempered Glass' (model uses majority).

### STP4 — LED Recessed Wall Light

- `STP4-IN1-830-04-8`: IP typo 'IP654' in text — SKU code '04' says IP54; using IP54 (note: its 3 siblings with code 05 are IP65, so this may really be a separate IP54 variant).

### SR21 — LED Decorative Street Light

- Typo in model text: 'LED Decorative Street Ligh' ('Ligh' -> 'Light').

### SR44 — LED Decorative Street Light

- 1 variant(s) were listed on the old site under family category SR48 but their SKU prefix is SR44; grouped by SKU prefix.
- `SR44-IN1-760-06-40`: CCT conflict: text says 4000K but SKU code '760' = 6000K — using SKU value (text looks copy-pasted from a sibling).

### ST20E — LED Street Light

- Variant(s) without image on old site: BL-ST20E-160W.

## Dropped records

- `BL-BU-7W`: No spec text in short_description and no family/sub-category (only top-level 'Indoor Lighting'). Long description only says: 'BLED BULB E27 COLD WHITE 7W 650lm 6500K IP20'. Looks like an unfinished/test entry.
- `DL22-IN1-850-04-13`: Probable duplicate of DL22-IN1-860-04-13: identical spec text (says 6000K); '850' appears nowhere else in the catalogue and looks like a SKU typo for '860'.
- `FL38-IN1-860-05-6`: Duplicate SKU of id 6291 (this copy listed under family category 'fl73', kept copy under 'fl38'); identical spec text
- `FL38-IN1-840-05-6`: Duplicate SKU of id 6289 (this copy listed under family category 'fl73', kept copy under 'fl38'); identical spec text
- `FL38-IN1-830-05-6`: Duplicate SKU of id 6287 (this copy listed under family category 'fl73', kept copy under 'fl38'); identical spec text
- `PL21-IN1-860-05-20`: Duplicate SKU of id 5151; identical spec text
- `PL21-IN1-860-05-20`: Duplicate SKU of id 5151 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-840-05-20`: Duplicate SKU of id 5149; identical spec text
- `PL21-IN1-840-05-20`: Duplicate SKU of id 5149 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-830-05-20`: Duplicate SKU of id 5147; identical spec text
- `PL21-IN1-830-05-20`: Duplicate SKU of id 5147 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-860-04-20`: Duplicate SKU of id 5145; identical spec text
- `PL21-IN1-860-04-20`: Duplicate SKU of id 5145 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-840-04-20`: Duplicate SKU of id 5143; identical spec text
- `PL21-IN1-840-04-20`: Duplicate SKU of id 5143 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-830-04-20`: Duplicate SKU of id 5141; identical spec text
- `PL21-IN1-830-04-20`: Duplicate SKU of id 5141 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-860-03-20`: Duplicate SKU of id 5189 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-840-03-20`: Duplicate SKU of id 5137; identical spec text
- `PL21-IN1-840-03-20`: Duplicate SKU of id 5137 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-830-03-20`: Duplicate SKU of id 5185 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-860-01-20`: Duplicate SKU of id 5183 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-840-01-20`: Duplicate SKU of id 5181 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `PL21-IN1-830-01-20`: Duplicate SKU of id 5179 (this copy listed under family category 'pl31', kept copy under 'pl21'); identical spec text
- `DLF3-IN1-840-04-18`: Duplicate SKU of id 4875; CONFLICTING spec text — dropped copy says: "LED Recessed Down Light: – Power: 18W. – Lumens: 1980 lms. – CCT: 4000K. – Body & Diffuser: Die Cast Aluminum. – IP Rating: IP54."
- `DL32-IN1-860-01-14`: Duplicate SKU of id 4689 (this copy listed under family category 'dl35', kept copy under 'dl32'); identical spec text
- `DL32-IN1-840-01-14`: Duplicate SKU of id 4687 (this copy listed under family category 'dl35', kept copy under 'dl32'); identical spec text
- `DL32-IN1-830-01-14`: Duplicate SKU of id 4685 (this copy listed under family category 'dl35', kept copy under 'dl32'); identical spec text
- `DL31-IN1-860-04-7`: Duplicate SKU of id 4683 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-840-04-7`: Duplicate SKU of id 4681 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-830-04-7`: Duplicate SKU of id 4679 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-860-03-7`: Duplicate SKU of id 4677 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-840-03-7`: Duplicate SKU of id 4675 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-830-03-7`: Duplicate SKU of id 4673 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-860-01-7`: Duplicate SKU of id 4671 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-840-01-7`: Duplicate SKU of id 4669 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
- `DL31-IN1-830-01-7`: Duplicate SKU of id 4667 (this copy listed under family category 'dl23', kept copy under 'dl31'); identical spec text
