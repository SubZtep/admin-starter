#!/usr/bin/env bash
set -euo pipefail

REPO="${REPO:-subztep/admin-starter}"
INSTALL_DIR="${HOME}/.local/bin"
MANIFEST_URL="https://github.com/${REPO}/releases/latest/download/manifest.json"

usage() {
  cat << 'EOF'
Usage: curl -sL https://raw.githubusercontent.com/subztep/admin-starter/main/install.sh | bash

Or with a specific repo:
  REPO=owner/repo curl -sL https://raw.githubusercontent.com/${REPO}/main/install.sh | bash
EOF
}

detect_platform() {
  local os arch
  os="$(uname -s | tr '[:upper:]' '[:lower:]')"
  arch="$(uname -m)"

  case "$os" in
    linux)  platform="linux-x64" ;;
    darwin)
      case "$arch" in
        arm64)  platform="macos-arm64" ;;
        x86_64) platform="macos-x64" ;;
        *)      echo "Unsupported arch: $arch" >&2; exit 1 ;;
      esac
      ;;
    msys*|mingw*|cygwin|windows)
      os="windows"
      platform="windows-x64"
      ;;
    *)      echo "Unsupported OS: $os" >&2; exit 1 ;;
  esac
  echo "$platform"
}

install() {
  local version="${1:-}"
  local platform="${2:-}"

  if [ -z "$version" ]; then
    echo "Fetching latest release info..."
    MANIFEST_URL="https://github.com/${REPO}/releases/download/latest/manifest.json"
    local manifest
    manifest=$(curl -sL "$MANIFEST_URL")
    version=$(echo "$manifest" | grep -o '"version"[[:space:]]*:[[:space:]]*"[^"]*"' | head -1 | sed 's/.*"\([^"]*\)"/\1/')
    local base_url
    base_url=$(echo "$manifest" | grep -o '"base_url"[[:space:]]*:[[:space:]]*"[^"]*"' | sed 's/.*"\([^"]*\)"/\1/')
    platform="${3:-$(detect_platform)}"

    local checksum
    checksum=$(echo "$manifest" | grep -A2 "\"${platform}\"" | grep checksum | grep -o '"[^"]*"' | tr -d '"' | tr -d ' ')

    local artifact
    case "$platform" in
      linux-x64)   artifact="kaja-linux-x64" ;;
      macos-arm64)  artifact="kaja-macos-arm64" ;;
      macos-x64)    artifact="kaja-macos-x64" ;;
      windows-x64)  artifact="kaja-windows-x64.exe" ;;
    esac

    local download_url="${base_url}/${artifact}"
    echo "Downloading kaja ${version} for ${platform}..."

    mkdir -p "$INSTALL_DIR"

    local tmp_file
    tmp_file=$(mktemp)
    curl -# -L -o "$tmp_file" "$download_url"

    if [ -n "$checksum" ]; then
      echo "Verifying checksum..."
      local file_hash
      file_hash=$(sha256sum "$tmp_file" | awk '{print $1}')
      if [ "$file_hash" != "$checksum" ]; then
        echo "Checksum mismatch! Expected: $checksum, Got: $file_hash" >&2
        rm -f "$tmp_file"
        exit 1
      fi
      echo "Checksum verified."
    fi

    mv "$tmp_file" "${INSTALL_DIR}/kaja"
    chmod +x "${INSTALL_DIR}/kaja"

    echo "Installed kaja ${version} to ${INSTALL_DIR}/kaja"

    if [[ ":$PATH:" != *":${INSTALL_DIR}:"* ]]; then
      echo ""
      echo "IMPORTANT: Add ${INSTALL_DIR} to your PATH if not already present."
      echo ""
      case "${SHELL:-}" in
        */zsh)
          echo '  echo "export PATH=\$HOME/.local/bin:\$PATH" >> ~/.zshrc' ;;
        */bash)
          echo '  echo "export PATH=\$HOME/.local/bin:\$PATH" >> ~/.bashrc' ;;
        *)
          echo '  Add $HOME/.local/bin to your PATH' ;;
      esac
      echo ""
      echo "Then restart your shell or run: source ~/.bashrc (or ~/.zshrc)"
    fi
  else
    echo "Using provided version: $version, platform: $platform"
    MANIFEST_URL="https://github.com/${REPO}/releases/download/${version}/manifest.json"
    install
  fi
}

main() {
  echo "kaja autoinstall"
  echo "================="
  echo ""
  install
}

main
