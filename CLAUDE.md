# cc-web

This project is managed by cc-web (a project configuration management app). It has assigned you ports 4100-4149. When you create any launch files or server configs, DO NOT use any ports outside of that range.

# Catalyst Agent

This project is managed by Catalyst Agent. Your dev server ports are defined in
PORTS.LOCAL (auto-generated per worktree). Start the server with start.local.sh.
If you need to change how the server is started, edit both start.sh (using __PORT_N__
template vars) and start.local.sh (using real port numbers).
If you need additional ports while making changes, add another entry to PORTS
and PORTS.LOCAL.
