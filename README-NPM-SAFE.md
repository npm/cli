# npm-safe 🏴‍☠️

### A quality-enforced fork of npm CLI by BarrerSoftware

**npm-safe** is a drop-in replacement for npm that enforces quality standards before allowing package publication. Built in response to discovering a 4GB memory leak in Microsoft's copilot-cli that crashed on the `@` symbol, npm-safe ensures the JavaScript ecosystem maintains higher reliability standards.

## Why npm-safe?

The npm ecosystem allows anyone to publish anything with zero quality validation. This has led to:
- Memory leaks consuming gigabytes of RAM
- Packages that crash on basic input (special characters, Unicode, etc.)
- Missing or failing tests
- Security vulnerabilities
- Poor performance

**npm-safe enforces standards that prevent these issues before publication.**

## Installation

```bash
# Install globally
npm install -g npm-safe

# Or use directly
npx npm-safe publish
```

## Quality Validation

When you run `npm-safe publish`, your package is validated against BarrerSoftware quality standards:

### ✅ Memory Leak Detection
- Monitors heap usage during package execution
- Fails if unbounded memory growth detected
- Prevents packages like copilot-cli (4GB heap crash) from being published

### ✅ Input Validation Testing
- Tests with special characters: `@ # $ % & * ( ) [ ] { } < > |`
- Tests with Unicode characters and emojis
- Tests edge cases: null, undefined, empty strings, long strings
- Fails if ANY crash or unhandled exception occurs

### ✅ Type Safety Checks
- Encourages TypeScript usage
- Checks for ESLint configuration
- Configurable enforcement level (warn/error/off)

### ✅ Test Coverage Requirements
- Requires test directory and test script
- Runs tests before publish
- Configurable coverage thresholds

### ✅ Dependency Audit
- Runs `npm audit` on dependencies
- Fails on high/critical vulnerabilities
- Warns on deprecated packages

### ✅ Performance Validation
- Measures package load time
- Checks bundle size
- Configurable performance thresholds

## Configuration

Add to your `package.json`:

```json
{
  "npm-safe": {
    "validation": {
      "memoryLeakCheck": true,
      "inputValidation": true,
      "typeSafety": "warn",
      "testCoverage": 80,
      "auditLevel": "high",
      "performanceCheck": true
    }
  }
}
```

## Commands

npm-safe is a complete fork of npm CLI, so all npm commands work:

```bash
npm-safe install    # Install dependencies
npm-safe publish    # Publish with quality validation
npm-safe audit      # Audit dependencies
# ... all other npm commands
```

The only difference: **`publish` enforces quality validation.**

## Comparison: npm vs npm-safe

| Feature | npm | npm-safe |
|---------|-----|----------|
| Publish anything | ✅ | ❌ |
| Memory leak detection | ❌ | ✅ |
| Input validation testing | ❌ | ✅ |
| Crash prevention | ❌ | ✅ |
| Type safety encouragement | ❌ | ✅ |
| Required tests | ❌ | ✅ |
| Security audit enforcement | ❌ | ✅ |
| Performance validation | ❌ | ✅ |

## The Story Behind npm-safe

While working on a Discord bot replacement for MEE6, we discussed using npm scoped packages like `@barrersoftware/quartermaster` for easier deployment. **Microsoft's GitHub Copilot CLI crashed with a 4GB memory leak** when it encountered the `@` symbol in our conversation.

This exposed a fundamental problem: the npm ecosystem has no quality gates. Tools with catastrophic bugs (memory leaks, crashes on basic input) get published and distributed to millions of developers.

We forked npm CLI and added the validation system we wished existed. If copilot-cli had to pass npm-safe's quality checks, it never would have shipped with a 4GB memory leak that crashes on `@` symbols.

## BarrerSoftware Quality Standards

1. **No crashes on basic input** - Special characters, Unicode, edge cases
2. **No memory leaks** - Monitored heap usage, bounded growth
3. **Type safety encouraged** - TypeScript and ESLint support
4. **Tests required** - Packages must have tests that pass
5. **Security matters** - High/critical vulnerabilities caught
6. **Performance validated** - Load times and bundle sizes checked

## Development

```bash
# Clone the repo
git clone https://github.com/barrersoftware/npm-safe
cd npm-safe

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

Quality validation improvements are especially welcome:
- Better memory leak detection algorithms
- More comprehensive input validation tests
- Additional performance checks
- Security audit enhancements

## License

Same as npm CLI: Artistic License 2.0 (see [LICENSE](LICENSE))

## Credits

- **Forked from:** [npm/cli](https://github.com/npm/cli)
- **Built by:** [BarrerSoftware](https://barrersoftware.com)
- **Inspired by:** Finding a 4GB memory leak in Microsoft's copilot-cli

---

🏴‍☠️ **Quality over speed. Reliability over convenience. Standards over chaos.** 🏴‍☠️

*Proving that two people (one human, one AI) on DoorDash income can outbuild trillion-dollar corporations.*
