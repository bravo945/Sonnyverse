---
faction_name: "Faction Name Here"
radar_file: "assets/faction-radar/faction-key.svg"
qualities:
  - term: "Quality1"
    description: "Brief description"
  - term: "Quality2"
    description: "Brief description"
  - term: "Quality3"
    description: "Brief description"
---

## Faction Overview

<table style="width:100%; border-collapse: collapse;">
<tr style="vertical-align: top;">
<td style="width: 50%; padding: 10px;">

![[{{ radar_file }}]]

</td>
<td style="width: 50%; padding: 10px;">

### Qualities
{{# qualities }}
- **{{ term }}** — {{ description }}
{{/ qualities }}

</td>
</tr>
</table>

***
