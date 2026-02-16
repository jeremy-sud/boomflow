#!/usr/bin/env python3
"""
Script to update badge SVGs with gem/precious stone design.
Replaces the central icon with a faceted gem that maintains the visual style.
"""

import os
import re

# Assets directory
ASSETS_DIR = '/home/dawnweaber/Workspace/BOOMFLOW/assets'

# Faceted gem pattern (precious stone design)
GEM_ICON = '''  <!-- Icon: Gem/Crystal - Faceted precious stone -->
  <g transform="translate(64, 50)">
    <!-- Top facet (shine) -->
    <polygon points="0,-18 12,-8 0,0 -12,-8" fill="white"/>
    <!-- Left facet -->
    <polygon points="-12,-8 0,0 0,18 -14,4" fill="white" opacity="0.6"/>
    <!-- Right facet -->
    <polygon points="12,-8 14,4 0,18 0,0" fill="white" opacity="0.8"/>
    <!-- Facet lines for gem effect -->
    <line x1="0" y1="-18" x2="0" y2="18" stroke="white" stroke-width="0.5" opacity="0.4"/>
    <line x1="-12" y1="-8" x2="14" y2="4" stroke="white" stroke-width="0.5" opacity="0.3"/>
    <line x1="12" y1="-8" x2="-14" y2="4" stroke="white" stroke-width="0.5" opacity="0.3"/>
    <!-- Top sparkle -->
    <polygon points="0,-18 4,-14 0,-10 -4,-14" fill="white" opacity="0.9"/>
  </g>'''

# Regex pattern to find the current icon (<!-- Icon: ... --> followed by its content up to the text)
# The pattern searches from "<!-- Icon:" to the line before "<text"
ICON_PATTERN = re.compile(
    r'(  <!-- Icon:.*?</g>)',
    re.DOTALL
)

def update_svg_file(filepath):
    """Updates an SVG file with the new gem design."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Find and replace the icon
        if '<!-- Icon:' in content:
            # Use regex to replace the icon block
            new_content = ICON_PATTERN.sub(GEM_ICON, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True, "Updated"
            else:
                return False, "No changes (pattern did not match)"
        else:
            return False, "No icon to replace"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Processes all badge SVG files."""
    # List badge SVG files
    svg_files = [f for f in os.listdir(ASSETS_DIR) 
                 if f.startswith('badge-') and f.endswith('.svg')]
    
    print(f"🔄 Processing {len(svg_files)} SVG files...")
    print("-" * 50)
    
    updated = 0
    errors = 0
    
    for svg_file in sorted(svg_files):
        filepath = os.path.join(ASSETS_DIR, svg_file)
        success, message = update_svg_file(filepath)
        
        if success:
            print(f"✅ {svg_file}")
            updated += 1
        else:
            print(f"⚠️  {svg_file}: {message}")
            if "Error" in message:
                errors += 1
    
    print("-" * 50)
    print(f"📊 Summary: {updated} updated, {errors} errors, {len(svg_files) - updated - errors} unchanged")

if __name__ == '__main__':
    main()
