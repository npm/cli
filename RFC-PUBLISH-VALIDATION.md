# RFC: Pre-Publish Quality Validation

## Summary

Add optional pre-publish validation to npm CLI that checks packages for common quality issues before allowing publication. This prevents broken packages from entering the ecosystem.

## Motivation

The npm ecosystem currently allows any package to be published with zero quality validation. This has led to widespread issues:

1. **Memory leaks**: Packages that consume unbounded memory (e.g., GitHub Copilot CLI consuming 4GB heap on `@` symbol)
2. **Input validation failures**: Packages that crash on common input patterns (special characters, Unicode, null values)
3. **Missing tests**: Critical packages shipped without test coverage
4. **Known vulnerabilities**: Packages published with high-severity security issues
5. **Performance regressions**: Packages with severe performance problems

These issues affect millions of developers and damage trust in the npm ecosystem.

## Detailed Design

### Configuration

Packages opt-in via `package.json`:

```json
{
  "publishValidation": {
    "enabled": true,
    "memoryLeakCheck": true,
    "inputValidation": true,
    "requireTests": false,
    "auditLevel": "moderate"
  }
}
```

### Validation Checks

#### 1. Memory Leak Detection
- Spawn isolated Node process
- Load package and monitor heap usage
- Fail if heap growth exceeds threshold without GC recovery
- Prevents packages like copilot-cli (4GB leak) from being published

#### 2. Input Validation Testing
- Test package with special characters: `@ # $ % & * ( ) [ ] { } < > |`
- Test with Unicode characters and emojis
- Test edge cases: null, undefined, empty strings, long strings
- Fail on any unhandled exceptions or crashes

#### 3. Test Requirements
- Verify test directory exists
- Verify test script is defined
- Optionally run tests before publish
- Configurable enforcement level

#### 4. Dependency Audit
- Run `npm audit` automatically
- Fail based on severity threshold
- Configurable audit level (low/moderate/high/critical)

### Implementation

Add `lib/utils/publish-validator.js`:
- Modular validator class
- Each check is independent
- Easy to extend with new checks
- Detailed error/warning reporting

Integrate into `lib/commands/publish.js`:
- Run before tarball creation
- After manifest loaded
- Before `prepublishOnly` script
- Fails publish if validation fails

### Backwards Compatibility

- **Opt-in by default**: Existing packages unaffected
- `publishValidation.enabled: false` explicitly disables
- Individual checks can be disabled
- Warnings vs errors configurable

### Performance Impact

- Validation time will depend on which checks are enabled and package complexity
- Only runs on `npm publish`, not install
- Can be disabled entirely with `enabled: false`
- Runs locally, no registry impact
- Performance benchmarks will be established once checks are fully implemented

## Rationale and Alternatives

### Why not external tools?

External linters/validators exist, but:
- Not enforced at publish time
- Easy to forget or bypass
- Different tools for different checks
- No ecosystem-wide standards

### Why opt-in?

- Gradual adoption
- No breaking changes
- Proven value before mandatory
- Different packages have different needs

### Alternative: Registry-side validation

Could validate on the registry, but:
- Higher infrastructure cost
- Slower feedback loop
- Can't fail fast locally
- Less transparent to developers

## Implementation Plan

### Phase 1: Core Framework (Week 1-2)
- Add `PublishValidator` class
- Integrate into publish command
- Basic configuration support
- Documentation

### Phase 2: Validation Checks (Week 3-4)
- Memory leak detection
- Input validation testing
- Test requirement checks
- Dependency audit integration

### Phase 3: Testing & Refinement (Week 5-6)
- Test on popular packages
- Gather community feedback
- Tune thresholds
- Performance optimization

### Phase 4: Documentation & Launch (Week 7-8)
- Complete documentation
- Migration guide
- Blog post announcement
- Community outreach

## Prior Art

- **Rust cargo**: `cargo publish` runs tests by default
- **Go modules**: `go mod verify` checks integrity
- **Python pip**: Can run setup.py tests
- **Ruby gems**: RubyGems runs gem build validations

While npm performs basic checks such as package and manifest validation, access control, and tarball integrity verification, it currently lacks built-in pre-publish quality validation for issues like memory leaks, input validation testing, test requirements, and performance checks.

## Unresolved Questions

1. Should validation be opt-in or opt-out?
2. What should default thresholds be?
3. Should we validate on `npm pack` as well?
4. How to handle packages that legitimately need high memory?

## Success Metrics

- Number of packages opting in
- Reduction in published packages with critical bugs
- Ecosystem-wide test coverage increase
- Fewer support issues related to broken packages

## References

- [GitHub Copilot CLI Issue #841](https://github.com/github/copilot-cli/issues/841) - 4GB memory leak on @ symbol
- [npm audit documentation](https://docs.npmjs.com/cli/v8/commands/npm-audit)
- [libnpmpack implementation](https://github.com/npm/libnpmpack)

---

**Proposed by**: Contributors from BarrerSoftware  
**Status**: Draft  
**Discussion**: TBD
