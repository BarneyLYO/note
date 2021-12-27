# Shell Ninja

## Why

- Shell is everywhere
- It's the least common denominator
- Fast turnarounds

## History

### sh by ken Thomson

- Year: 1971
- CLI
- Input/Output Redirection
- No variables, no pipeline

### Bourne Shell by Stephen Bourne

- Year: 1979
- Advanced control flows
- Vars and envs
- Signal Handling

### csh by Bill Joy

- C-like
- Aliases
- History
- ~ home dir
- Job Control
- year:1979

### bash by Brain Fox

- Year 1989
- CLI completion
- Brace Extension
- Trap
- Here documents

```bash
#!/bin/bash
# kdeploy

# shell will keep executing even if one command fail,
# -e throw exception when return value != 0
# -u throw exception when undefine
set -eu

# ensure one command in pipeline failed, the whole pipeline fails
set -o pipefail

# Save global script args
ARGS=("$@")

hasflag() {
  # declare the local variable flag within function scope
  # ${1:-}, if arg1 not exist, use value behind -, in our case, empty string(undefine)
  # since we have set -u, exception
  # btw ${1} is the first argument pass into the function
  local flag=${1:-}

  for arg in $ARGS; do
    if [ "$flag" = "$arg" ]; then
      echo "true"
    fi
  done
  echo "false"
}

# $(xxx) subshell(eval), return value will replace $(xxxx)
if $(hasflag --devopscon); then
  echo "Yeah !"
fi
```
