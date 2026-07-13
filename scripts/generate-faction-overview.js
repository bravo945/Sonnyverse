#!/usr/bin/env node

/**
 * Generate Faction Overview embeds from simple data files
 * Usage: node scripts/generate-faction-overview.js <faction-key>
 * 
 * Or edit the factionData object below and run without arguments
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Edit this data for each faction
const factionData = {
  'sns-union': {
    name: 'Sticks and Stones Union',
    emblem: 'ssu-has-been-here.png',
    radarFile: 'assets/faction-radar/sns-union.svg',
    qualities: [
      { term: 'Tribal', description: 'Pre-Flash homeless community roots' },
      { term: 'Commercial', description: 'Scavenger-trade symbiosis' },
      { term: 'Civil-Service', description: 'Mutual aid for members' },
      { term: 'Opportunistic', description: 'Taxes/robs outsiders' }
    ],
    relationships: {
      allies: [],
      enemies: ['Unamerica']
    }
  },
  'the-market': {
    name: 'The Market',
    emblem: 'market-symbol.png',
    radarFile: 'assets/faction-radar/the-market.svg',
    qualities: [
      { term: 'Commercial', description: 'Trade-first economy' },
      { term: 'Militant', description: 'Arbitrary trade route defense' },
      { term: 'Pragmatic', description: 'Profit over ideology' }
    ],
    relationships: {
      allies: [],
      enemies: ['Raiders', 'Bandits']
    }
  },
  'unamerica': {
    name: 'Unamerica',
    emblem: 'unamerica-flag.png',
    radarFile: 'assets/faction-radar/unamerica.svg',
    qualities: [
      { term: 'Chaotic', description: 'No hierarchy or structure' },
      { term: 'Ideological', description: 'Anti-order philosophy' },
      { term: 'Malevolent', description: 'Meaningless brutality' }
    ],
    relationships: {
      allies: [],
      enemies: ['USCPF', 'CDF', 'All orderly factions']
    }
  },
  'uscpf': {
    name: 'USCPF',
    emblem: 'https://static.wikia.nocookie.net/after-the-flash-official/images/5/52/USCPF.png/revision/latest?cb=20201202043950',
    radarFile: 'assets/faction-radar/uscpf.svg',
    qualities: [
      { term: 'Governmental', description: 'Official US successor state' },
      { term: 'Militant', description: 'Military chain of command' },
      { term: 'Order-focused', description: 'Civilization preservation' }
    ],
    relationships: {
      allies: ['CDF'],
      enemies: ['Unamerica']
    }
  },
  'cdf': {
    name: 'CDF',
    emblem: null, // Add when available
    radarFile: 'assets/faction-radar/cdf.svg',
    qualities: [
      { term: 'Governmental', description: 'Structured civil defense' },
      { term: 'Militant', description: 'Organized military force' },
      { term: 'Civil-Service', description: 'Population protection' }
    ],
    relationships: {
      allies: ['USCPF'],
      enemies: []
    }
  }
};

/**
 * Generate HTML embed for a faction
 */
function generateEmbed(factionKey, data) {
  const qualitiesList = data.qualities
    .map(q => `- **${q.term}** — ${q.description}`)
    .join('\n');

  const alliesList = data.relationships?.allies?.length > 0
    ? data.relationships.allies.map(a => `- ${a}`).join('\n')
    : '- *None documented*';
  
  const enemiesList = data.relationships?.enemies?.length > 0
    ? data.relationships.enemies.map(e => `- ${e}`).join('\n')
    : '- *None documented*';

  const emblemHtml = data.emblem 
    ? `<tr><td colspan="2" style="padding: 10px; text-align: center;"><img src="${data.emblem}" alt="${data.name} emblem" style="max-width: 200px; max-height: 150px;"/></td></tr>`
    : '';

  return `## Faction Overview

<table style="width:100%; border-collapse: collapse;">
${emblemHtml}<tr style="vertical-align: top;">
<td style="width: 50%; padding: 10px;">

![[${data.radarFile}]]

</td>
<td style="width: 50%; padding: 10px;">

### Qualities
${qualitiesList}

### Relationships
**Allies**
${alliesList}

**Enemies**
${enemiesList}

</td>
</tr>
</table>

***
`;
}

// Main execution
const args = process.argv.slice(2);
const outputDir = path.join(__dirname, '..', 'content', 'faction-overviews');

if (args.length > 0) {
  // Generate single faction
  const factionKey = args[0];
  const data = factionData[factionKey];
  
  if (!data) {
    console.error(`❌ Faction '${factionKey}' not found in data`);
    console.log('Available:', Object.keys(factionData).join(', '));
    process.exit(1);
  }
  
  const embed = generateEmbed(factionKey, data);
  console.log(embed);
} else {
  // Generate all faction overview files
  fs.mkdirSync(outputDir, { recursive: true });
  
  Object.entries(factionData).forEach(([key, data]) => {
    const embed = generateEmbed(key, data);
    const filePath = path.join(outputDir, `${key}-overview.md`);
    fs.writeFileSync(filePath, embed);
    console.log(`✓ Generated: ${filePath}`);
  });
  
  console.log(`\nGenerated ${Object.keys(factionData).length} faction overviews in ${outputDir}`);
  console.log('\nTo use: Copy content from generated files into your faction docs');
}
