#!/usr/bin/env bash
# Instala las librerias del sistema que Chromium necesita para arrancar.
#
# Contexto: la imagen de build de Vercel para Node usa Amazon Linux 2023 (dnf),
# no Debian/Ubuntu. Por eso `npx playwright install --with-deps` / `apt-get`
# no sirven: el error real es
#   error while loading shared libraries: libnspr4.so: cannot open shared object file
# `postinstall` (npx playwright install chromium) baja el binario, pero no las
# librerias nativas.
#
# El script es best-effort a proposito: si un nombre de paquete no existe en la
# imagen, se ignora en vez de tumbar el build. La verificacion real la hace
# scripts/prerender.mjs, que valida cada una de las 48 rutas y falla si Chromium
# no arranca o el HTML sale incompleto.
#
# No-op fuera de Linux (build local en Windows/macOS).

set -uo pipefail

# Debian/Ubuntu -> Amazon Linux 2023
PACKAGES=(
  nspr nss                # libnspr4 / libnss3 (el error que nos trajo aqui)
  atk at-spi2-atk at-spi2-core
  cairo pango
  cups-libs
  dbus-libs
  libdrm expat
  mesa-libgbm glib2
  libX11 libxcb libXext
  libXcomposite libXdamage libXfixes libXrandr
  libxkbcommon
  alsa-lib
  libXtst libXrender libXScrnSaver
)

if [ "$(uname -s)" != "Linux" ]; then
  echo "build-deps: sistema $(uname -s), se omite (no aplica)."
  exit 0
fi

if ! command -v dnf >/dev/null 2>&1; then
  echo "build-deps: 'dnf' no disponible, se omite. Chromium ya debe estar soportado."
  exit 0
fi

echo "build-deps: instalando librerias de Chromium en $(. /etc/os-release 2>/dev/null && echo "$PRETTY_NAME" || echo 'Linux')..."

# Camino feliz: una sola transaccion (rapido).
if dnf install -y "${PACKAGES[@]}" >/dev/null 2>&1; then
  echo "build-deps: ${#PACKAGES[@]} paquetes instalados."
  exit 0
fi

# Respaldo: uno por uno,continueando si un nombre no existe en la imagen.
missing=""
installed=0
for pkg in "${PACKAGES[@]}"; do
  if dnf install -y "$pkg" >/dev/null 2>&1; then
    installed=$((installed + 1))
  else
    missing="${missing} ${pkg}"
  fi
done

echo "build-deps: ${installed}/${#PACKAGES[@]} paquetes instalados."
if [ -n "$missing" ]; then
  echo "build-deps: no disponibles en esta imagen (se ignoran):${missing}"
fi
echo "build-deps: si el prerender falla con 'cannot open shared object file', anadir aqui el paquete AL2023 equivalente."

exit 0
