#!/usr/bin/env python3
"""
Script para actualizar los SVGs de badges con diseño de gema/piedra preciosa.
Reemplaza el ícono central con una gema facetada que mantiene el estilo visual.
"""

import os
import re

# Directorio de assets
ASSETS_DIR = '/home/dawnweaber/Workspace/BOOMFLOW/assets'

# Patrón de la gema facetada (diseño de piedra preciosa)
GEM_ICON = '''  <!-- Icon: Gem/Crystal - Piedra preciosa facetada -->
  <g transform="translate(64, 50)">
    <!-- Faceta superior (brillo) -->
    <polygon points="0,-18 12,-8 0,0 -12,-8" fill="white"/>
    <!-- Faceta izquierda -->
    <polygon points="-12,-8 0,0 0,18 -14,4" fill="white" opacity="0.6"/>
    <!-- Faceta derecha -->
    <polygon points="12,-8 14,4 0,18 0,0" fill="white" opacity="0.8"/>
    <!-- Líneas de facetado para efecto de gema -->
    <line x1="0" y1="-18" x2="0" y2="18" stroke="white" stroke-width="0.5" opacity="0.4"/>
    <line x1="-12" y1="-8" x2="14" y2="4" stroke="white" stroke-width="0.5" opacity="0.3"/>
    <line x1="12" y1="-8" x2="-14" y2="4" stroke="white" stroke-width="0.5" opacity="0.3"/>
    <!-- Destello superior -->
    <polygon points="0,-18 4,-14 0,-10 -4,-14" fill="white" opacity="0.9"/>
  </g>'''

# Patrón regex para encontrar el ícono actual (<!-- Icon: ... --> seguido de su contenido hasta el texto)
# El patrón busca desde "<!-- Icon:" hasta la línea antes de "<text"
ICON_PATTERN = re.compile(
    r'(  <!-- Icon:.*?</g>)',
    re.DOTALL
)

def update_svg_file(filepath):
    """Actualiza un archivo SVG con el nuevo diseño de gema."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Buscar y reemplazar el ícono
        if '<!-- Icon:' in content:
            # Usar regex para reemplazar el bloque del ícono
            new_content = ICON_PATTERN.sub(GEM_ICON, content)
            
            if new_content != content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                return True, "Actualizado"
            else:
                return False, "Sin cambios (patrón no coincidió)"
        else:
            return False, "Sin ícono para reemplazar"
            
    except Exception as e:
        return False, f"Error: {str(e)}"

def main():
    """Procesa todos los archivos SVG de badges."""
    # Listar archivos SVG de badges
    svg_files = [f for f in os.listdir(ASSETS_DIR) 
                 if f.startswith('badge-') and f.endswith('.svg')]
    
    print(f"🔄 Procesando {len(svg_files)} archivos SVG...")
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
    print(f"📊 Resumen: {updated} actualizados, {errors} errores, {len(svg_files) - updated - errors} sin cambios")

if __name__ == '__main__':
    main()
