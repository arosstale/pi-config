---
name: create-cli
description: Create command-line interface tools and scripts using Node.js Commander, Python Click, or Go Cobra with proper argument parsing and help systems
---

# CreateCLI Skill

Create command-line interface tools and scripts.

## Routing

**Trigger keywords**: cli, command line, terminal tool, script, executable, argparse, commander

Use this skill when:
- Building CLI tools
- Creating terminal scripts
- Adding command-line arguments
- Building developer tools

## CLI Frameworks

### Node.js
- **Commander.js** - Full-featured CLI framework
- **Yargs** - Powerful argument parsing
- **Inquirer** - Interactive prompts
- **Chalk** - Terminal styling

### Python
- **Click** - Composable CLI creation
- **Typer** - Type hints for CLI
- **argparse** - Standard library
- **Rich** - Beautiful output

### Go
- **Cobra** - Standard for Go CLIs
- **urfave/cli** - Simple CLI apps

## Workflows

### Node.js CLI
```bash
crush "Create Node.js CLI tool:
- Name: [tool-name]
- Purpose: [description]
- Commands: [list]
- Use Commander.js
- Add --help and --version
- Output to: tools/[name].js"
```

### Python CLI
```bash
crush "Create Python CLI with Click:
- Name: [tool-name]
- Commands: [list]
- Add type hints
- Include --verbose flag
- Output to: tools/[name].py"
```

## Templates

### Node.js (Commander)
```javascript
#!/usr/bin/env node
const { program } = require('commander');

program
  .name('mytool')
  .description('Tool description')
  .version('1.0.0');

program
  .command('action')
  .description('Do something')
  .argument('<input>', 'Input file')
  .option('-o, --output <file>', 'Output file')
  .action((input, options) => {
    // Implementation
  });

program.parse();
```

### Python (Click)
```python
#!/usr/bin/env python3
import click

@click.group()
@click.version_option()
def cli():
    """Tool description."""
    pass

@cli.command()
@click.argument('input')
@click.option('-o', '--output', help='Output file')
def action(input, output):
    """Do something."""
    # Implementation

if __name__ == '__main__':
    cli()
```

## Best Practices

- Always include `--help`
- Add `--version`
- Use clear command names
- Provide examples in help
- Handle errors gracefully
- Support stdin/stdout pipes

## Best Agent

| Priority | CLI | Command | Why |
|----------|-----|---------|-----|
| Primary | Crush | `crush "..."` | Code implementation |
| Backup | OpenCode | `opencode run "..."` | Fast prototyping |

## Output Location

CLI tools go to `tools/` directory.
