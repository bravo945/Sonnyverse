#!/usr/bin/env node

/**
 * Generate SVG radar charts for Sonnyverse factions
 * Usage: node scripts/generate-faction-radar.js
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
    ambition: 2,
    structure: 4,
    integrity: 6,
    qualities: ['Tribal', 'Commercial', 'Civil-Service', 'Opportunistic'],
    color: '#36a2eb'
  },
  'the-market': {
    name: 'The Market',
    ambition: 6,
    structure: 6,
    integrity: 5,
    qualities: ['Commercial', 'Militant', 'Pragmatic'],
    color: '#4bc0c0'
  },
  'unamerica': {
    name: 'Unamerica',
    ambition: 8,
    structure: 1,
    integrity: 2,
    qualities: ['Chaotic', 'Ideological', 'Malevolent'],
    color: '#ff6384'
  },
  'uscpf': {
    name: 'USCPF',
    ambition: 10,
    structure: 9,
    integrity: 9,
    qualities: ['Governmental', 'Militant', 'Order-focused'],
    color: '#9966ff'
  },
  'cdf': {
    name: 'CDF',
    ambition: 9,
    structure: 8,
    integrity: 8,
    qualities: ['Governmental', 'Militant', 'Civil-Service'],
    color: '#ff9f40'
  }
};

// Radar chart configuration
const config = {
  width: 300,
  height: 300,
  centerX: 150,
  centerY: 150,
  radius: 100,
  axes: ['Ambition', 'Structure', 'Integrity'],
  maxScore: 10,
  gridLevels: [2, 4, 6, 8, 10]
};

/**
 * Convert polar coordinates to Cartesian
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

/**
 * Generate polygon points for a faction's scores
 */
function generatePolygonPoints(faction) {
  const angles = config.axes.map((_, i) => (360 / config.axes.length) * i);
  const points = angles.map((angle, i) => {
    const score = i === 0 ? faction.ambition : i === 1 ? faction.structure : faction.integrity;
    const ratio = score / config.maxScore;
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius * ratio, angle);
    return `${pos.x.toFixed(1)},${pos.y.toFixed(1)}`;
  });
  return points.join(' ');
}

/**
 * Generate grid polygons (background rings)
 */
function generateGrid() {
  const grids = [];
  config.gridLevels.forEach(level => {
    const ratio = level / config.maxScore;
    const angles = config.axes.map((_, i) => (360 / config.axes.length) * i);
    const points = angles.map(angle => {
      const pos = polarToCartesian(config.centerX, config.centerY, config.radius * ratio, angle);
      return `${pos.x.toFixed(1)},${pos.y.toFixed(1)}`;
    }).join(' ');
    
    grids.push(`<polygon points="${points}" fill="none" stroke="#e0e0e0" stroke-width="1"/>`);
  });
  return grids.join('\n    ');
}

/**
 * Generate axis lines
 */
function generateAxes() {
  const axes = [];
  const angles = config.axes.map((_, i) => (360 / config.axes.length) * i);
  
  config.axes.forEach((label, i) => {
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius, angles[i]);
    axes.push(`<line x1="${config.centerX}" y1="${config.centerY}" x2="${pos.x.toFixed(1)}" y2="${pos.y.toFixed(1)}" stroke="#d0d0d0" stroke-width="1"/>`);
    
    // Axis labels
    const labelPos = polarToCartesian(config.centerX, config.centerY, config.radius + 20, angles[i]);
    let textAnchor = 'middle';
    if (angles[i] > 90 && angles[i] < 270) textAnchor = 'end';
    else if (angles[i] > 270 || angles[i] < 90) textAnchor = 'start';
    
    axes.push(`<text x="${labelPos.x.toFixed(1)}" y="${labelPos.y.toFixed(1)}" font-size="12" fill="#666" text-anchor="${textAnchor}" dominant-baseline="middle">${label}</text>`);
  });
  
  return axes.join('\n    ');
}

/**
 * Generate complete SVG for a faction
 */
function generateFactionSVG(factionKey, faction) {
  const points = generatePolygonPoints(faction);
  const grid = generateGrid();
  const axes = generateAxes();
  
  return `<svg width="${config.width}" height="${config.height}" viewBox="0 0 ${config.width} ${config.height}" xmlns="http://www.w3.org/2000/svg">
  <!-- Background -->
  <rect width="${config.width}" height="${config.height}" fill="transparent"/>
  
  <!-- Grid -->
  ${grid}
  
  <!-- Axes -->
  ${axes}
  
  <!-- Data Polygon -->
  <polygon points="${points}" fill="${faction.color}22" stroke="${faction.color}" stroke-width="2"/>
  
  <!-- Data Points -->
  ${config.axes.map((_, i) => {
    const score = i === 0 ? faction.ambition : i === 1 ? faction.structure : faction.integrity;
    const angle = (360 / config.axes.length) * i;
    const pos = polarToCartesian(config.centerX, config.centerY, config.radius * (score / config.maxScore), angle);
    return `<circle cx="${pos.x.toFixed(1)}" cy="${pos.y.toFixed(1)}" r="4" fill="${faction.color}" stroke="white" stroke-width="2"/>`;
  }).join('\n  ')}
  
  <!-- Title -->
  <text x="${config.centerX}" y="20" font-size="14" font-weight="bold" fill="#333" text-anchor="middle">${faction.name}</text>
  
  <!-- Score Legend -->
  <text x="${config.centerX}" y="${config.height - 10}" font-size="11" fill="#666" text-anchor="middle">A:${faction.ambition} S:${faction.structure} I:${faction.integrity}</text>
</svg>`;
}

// Main execution
const outputDir = path.join(__dirname, '..', 'content', 'assets', 'faction-radar');
fs.mkdirSync(outputDir, { recursive: true });

Object.entries(factions).forEach(([key, faction]) => {
  const svg = generateFactionSVG(key, faction);
  const filePath = path.join(outputDir, `${key}.svg`);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Generated: ${filePath}`);
});

console.log(`\nGenerated ${Object.keys(factions).length} faction radar charts in ${outputDir}`);
