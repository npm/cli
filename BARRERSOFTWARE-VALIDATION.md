# npm-safe - BarrerSoftware Quality Validation

## Mission
Prevent broken packages from being published to npm by enforcing quality standards at the CLI level.

## Validation Hooks

### Pre-Publish Validation (Line 89 in lib/commands/publish.js)
After manifest is loaded, before tarball creation:

1. **Memory Leak Detection**
   - Run package in isolated environment
   - Monitor heap usage over 30 seconds
   - Fail if heap growth exceeds 100MB without GC recovery
   - Check: No unbounded loops, no memory retention

2. **Input Validation Testing**
   - Test with special characters: `@ # $ % & * ( ) [ ] { } < > | \`
   - Test with Unicode: emoji, international characters
   - Test with edge cases: null, undefined, empty strings, very long strings
   - Fail if ANY crash or unhandled exception

3. **Type Safety Check**
   - If TypeScript project: require `tsconfig.json` with strict mode
   - If JavaScript: suggest/warn about missing TypeScript
   - Check for ESLint configuration
   - Warn on any type: `any` usage (TypeScript)

4. **Test Coverage Requirements**
   - Require test directory exists
   - Require test script in package.json
   - Run tests, fail if any fail
   - Optional: Check code coverage threshold (configurable)

5. **Dependency Audit**
   - Run `npm audit` on dependencies
   - Fail on high/critical vulnerabilities
   - Warn on deprecated dependencies
   - Check for circular dependencies

6. **Performance Validation**
   - Measure package load time
   - Fail if startup time > 5 seconds for CLI tools
   - Check bundle size (warn if > 10MB uncompressed)

## Configuration

`package.json` additions:
```json
{
  "npm-safe": {
    "validation": {
      "memoryLeakCheck": true,
      "inputValidation": true,
      "typeSafety": "warn|error|off",
      "testCoverage": 80,
      "auditLevel": "high",
      "performanceCheck": true
    }
  }
}
```

## Implementation Plan

### Phase 1: Core Validation (Week 1)
- [ ] Create validator module in `lib/utils/barrersoftware-validator.js`
- [ ] Implement memory leak detector
- [ ] Implement input validation tester
- [ ] Hook into publish.js line 89

### Phase 2: Advanced Checks (Week 2)
- [ ] Type safety validation
- [ ] Test coverage requirements
- [ ] Dependency audit integration
- [ ] Performance monitoring

### Phase 3: Documentation & Release (Week 3)
- [ ] Update README with npm-safe branding
- [ ] Document all validation rules
- [ ] Create migration guide from npm to npm-safe
- [ ] Set up BarrerSoftware CI/CD

## Why This Matters

**Problem:** Microsoft's copilot-cli consumed 4GB of heap memory and crashed on `@` symbol
**Root Cause:** No pre-publish quality validation in npm ecosystem
**Solution:** Enforce quality standards before packages can be published

## BarrerSoftware Standards
- No crashes on basic input
- No memory leaks
- Type safety encouraged/enforced
- Test coverage required
- Security vulnerabilities addressed
- Performance benchmarks met

## Success Metrics
- Zero packages published with memory leaks
- Zero packages that crash on special characters
- 100% of packages have tests
- Reduced npm ecosystem CVEs by catching vulnerable deps

---

🏴‍☠️ **Quality over speed. Reliability over convenience. Standards over chaos.** 🏴‍☠️

*Built by BarrerSoftware - proving two people can outbuild trillion-dollar corporations*
