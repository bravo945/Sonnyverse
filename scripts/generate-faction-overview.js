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

// Faction Nature Index Data
const factions = {
  'sns-union': {
    name: 'Sticks and Stones Union',
    emblem: 'ssu-has-been-here.png',
    radarFile: 'assets/faction-radar/sns-union.svg',
    ambition: 2,
    structure: 4,
    integrity: 6,
    color: '#36a2eb',
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
    ambition: 6,
    structure: 6,
    integrity: 5,
    color: '#4bc0c0',
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
    ambition: 8,
    structure: 1,
    integrity: 2,
    color: '#ff6384',
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
    ambition: 10,
    structure: 9,
    integrity: 9,
    color: '#9966ff',
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
    emblem: null,
    radarFile: 'assets/faction-radar/cdf.svg',
    ambition: 9,
    structure: 8,
    integrity: 8,
    color: '#ff9f40',
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

// Radar chart configuration
const config = {
  width: 280,
  height: 280,
  centerX: 140,
  centerY: 140,
  radius: 90,
  axes: ['Ambition', 'Structure', 'Integrity'],
  maxScore: 10,
  gridLevels: [2, 4, 6, 8, 10]
};

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function generateRadarSVG(faction) {
  const angles = config.axes.map((_, i) => (360 / config.axes.length) * i);
  
  // Generate grid polygons
  const grids = config.gridLevels.map(level => {
    const ratio = level / config.maxScore;
    const points = angles.map(angle => {
      const pos = polarToCartesian(config.centerX, config.centerY, config.radius * ratio, angle);
      return `${pos.x.toFixed(1)},${pos.y.toFixed(1)}`;
    }).join(' ');
    return `<polygon points="${points}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`;
  }).join('\n    ');

  // Generate axes
  const axes = config.axes.map((label, i) => {
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius, angles[i]);
    const labelPos = polarToCartesian(config.centerX, config.centerY, config.radius + 20, angles[i]);
    let textAnchor = 'middle';
    if (angles[i] > 90 && angles[i] < 270) textAnchor = 'end';
    else if (angles[i] > 270 || angles[i] < 90) textAnchor = 'start';
    
    return `<line x1="${config.centerX}" y1="${config.centerY}" x2="${pos.x.toFixed(1)}" y2="${pos.y.toFixed(1)}" stroke="#d0d0d0" stroke-width="1"/>
    <text x="${labelPos.x.toFixed(1)}" y="${labelPos.y.toFixed(1)}" font-size="11" fill="#666" text-anchor="${textAnchor}" dominant-baseline="middle">${label}</text>`;
  }).join('\n    ');

  // Generate data polygon
  const scores = [faction.ambition, faction.structure, faction.integrity];
  const points = angles.map((angle, i) => {
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius * (scores[i] / config.maxScore), angle);
    return `${pos.x.toFixed(1)},${pos.y.toFixed(1)}`;
  }).join(' ');

  // Generate data points
  const dataPoints = angles.map((angle, i) => {
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius * (scores[i] / config.maxScore), angle);
    return `<circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="4" fill="${faction.color}" stroke="white" stroke-width="2"/>`;
  }).join('\n    ');

  return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${config.width}" height="${config.height}" fill="transparent"/>
  ${grids}
  ${axes}
  <polygon points="${points}" fill="${faction.color}22" stroke="${faction.color}" stroke-width="2"/>
  ${dataPoints}
  <text x="${config.centerX}" y="20" font-size="13" font-weight="bold" fill="#333" text-anchor="middle">${faction.name}</text>
  <text x="${config.centerX}" y="${config.height - 5}" font-size="10" fill="#666" text-anchor="middle">A:${faction.ambition} S:${faction.structure} I:${faction.integrity}</text>
</svg>`;
}

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

  // Inline SVG instead of embed
  const radarSvg = generateRadarSVG(data);

  const emblemHtml = data.emblem 
    ? `<tr><td colspan="2" style="padding: 10px; text-align: center;"><img src="${data.emblem}" alt="${data.name} emblem" style="max-width: 200px; max-height: 150px;"/></td></tr>`
    : '';

  return `## Faction Overview

<table style="width:100%; border-collapse: collapse;">
${emblemHtml}<tr style="vertical-align: top;">
<td style="width: 50%; padding: 10px;">

${radarSvg}

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
  const data = factions[factionKey];
  
  if (!data) {
    console.error(`❌ Faction '${factionKey}' not found in data`);
    console.log('Available:', Object.keys(factions).join(', '));
    process.exit(1);
  }
  
  const embed = generateEmbed(factionKey, data);
  console.log(embed);
} else {
  // Generate all faction overview files
  fs.mkdirSync(outputDir, { recursive: true });
  
  Object.entries(factions).forEach(([key, data]) => {
    const embed = generateEmbed(key, data);
    const filePath = path.join(outputDir, `${key}-overview.md`);
    fs.writeFileSync(filePath, embed);
    console.log(`✓ Generated: ${filePath}`);
  });
  
  console.log(`\nGenerated ${Object.keys(factions).length} faction overviews in ${outputDir}`);
  console.log('\nTo use: Copy content from generated files into your faction docs');
}
