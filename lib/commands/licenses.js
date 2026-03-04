const { output, log } = require('proc-log')
const localeCompare = require('@isaacs/string-locale-compare')('en')
const ArboristWorkspaceCmd = require('../arborist-cmd.js')

// SPDX license categories for classification
const OSI_APPROVED = new Set([
  '0BSD', 'AAL', 'AFL-3.0', 'AGPL-3.0-only', 'AGPL-3.0-or-later',
  'Apache-2.0', 'APSL-2.0', 'Artistic-2.0', 'BlueOak-1.0.0',
  'BSD-1-Clause', 'BSD-2-Clause', 'BSD-3-Clause', 'BSD-3-Clause-LBNL',
  'BSL-1.0', 'CAL-1.0', 'CAL-1.0-Combined-Work-Exception',
  'CERN-OHL-P-2.0', 'CERN-OHL-S-2.0', 'CERN-OHL-W-2.0',
  'CNRI-Python', 'CPAL-1.0', 'CUA-OPL-1.0',
  'ECL-2.0', 'EFL-2.0', 'Entessa', 'EPL-1.0', 'EPL-2.0',
  'EUDatagrid', 'EUPL-1.1', 'EUPL-1.2',
  'Fair', 'Frameworx-1.0', 'FSFAP',
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'HPND', 'Intel', 'IPA', 'IPL-1.0', 'ISC',
  'JSON', 'JAM',
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'LiLiQ-P-1.1', 'LiLiQ-R-1.1', 'LiLiQ-Rplus-1.1', 'LPL-1.0', 'LPL-1.02',
  'LPPL-1.3c', 'MIT', 'MIT-0', 'Motosoto', 'MPL-2.0', 'MPL-2.0-no-copyleft-exception',
  'MS-PL', 'MS-RL', 'MulanPSL-2.0',
  'Multics', 'NASA-1.3', 'NCSA', 'NGPL', 'Nokia', 'NPOSL-3.0', 'NTP',
  'OCLC-2.0', 'OFL-1.1', 'OGTSL', 'OLDAP-2.8', 'OSET-PL-2.1',
  'OSL-3.0', 'PHP-3.01', 'PostgreSQL', 'Python-2.0', 'QPL-1.0',
  'RPL-1.1', 'RPL-1.5', 'RPSL-1.0', 'RSCPL',
  'SimPL-2.0', 'SISSL', 'Sleepycat', 'SPL-1.0',
  'UCL-1.0', 'Unicode-DFS-2016', 'Unlicense', 'UPL-1.0',
  'VSL-1.0', 'W3C', 'Watcom-1.0', 'Xnet', 'Zlib', 'ZPL-2.0', 'ZPL-2.1',
])

const COPYLEFT = new Set([
  'AGPL-3.0-only', 'AGPL-3.0-or-later',
  'GPL-2.0-only', 'GPL-2.0-or-later', 'GPL-3.0-only', 'GPL-3.0-or-later',
  'LGPL-2.1-only', 'LGPL-2.1-or-later', 'LGPL-3.0-only', 'LGPL-3.0-or-later',
  'MPL-2.0', 'MPL-2.0-no-copyleft-exception',
  'OSL-3.0', 'CPAL-1.0', 'EUPL-1.1', 'EUPL-1.2',
  'CECILL-2.1', 'RPL-1.1', 'RPL-1.5',
])

const getLicense = (pkg) => {
  // Modern SPDX string
  if (typeof pkg.license === 'string') {
    return pkg.license
  }

  // Legacy object form: { type: "MIT", url: "..." }
  if (pkg.license && typeof pkg.license === 'object' && pkg.license.type) {
    return pkg.license.type
  }

  // Legacy array form: licenses: [{ type: "MIT" }, { type: "Apache-2.0" }]
  if (Array.isArray(pkg.licenses)) {
    return pkg.licenses
      .map(l => (typeof l === 'string' ? l : l.type) || 'Unknown')
      .join(' OR ')
  }

  return null
}

const getLicenseUrl = (pkg) => {
  if (pkg.license && typeof pkg.license === 'object' && pkg.license.url) {
    return pkg.license.url
  }
  if (Array.isArray(pkg.licenses) && pkg.licenses[0]) {
    return pkg.licenses[0].url || null
  }
  return null
}

const classifyLicense = (license) => {
  if (!license) {
    return 'Unknown'
  }
  if (COPYLEFT.has(license)) {
    return 'Copyleft'
  }
  if (OSI_APPROVED.has(license)) {
    return 'Permissive'
  }
  // Check for SPDX expression (contains AND, OR, WITH)
  if (/\b(AND|OR|WITH)\b/.test(license)) {
    return 'Custom Expression'
  }
  return 'Other'
}

class Licenses extends ArboristWorkspaceCmd {
  static description = 'List licenses of installed packages'
  static name = 'licenses'
  static usage = [
    '',
    '--json',
    '--parseable',
    '--filter=<license>',
    '--group',
  ]
  static params = [
    'json',
    'long',
    'parseable',
    'global',
    'depth',
    'omit',
    'include',
    'package-lock-only',
    ...super.params,
  ]

  async exec (args) {
    const Arborist = require('@npmcli/arborist')
    const global = this.npm.global
    const { resolve } = require('node:path')
    const path = global ? resolve(this.npm.globalDir, '..') : this.npm.prefix
    const json = this.npm.config.get('json')
    const parseable = this.npm.config.get('parseable')
    const long = this.npm.config.get('long')
    const packageLockOnly = this.npm.config.get('package-lock-only')

    // --filter is not a standard npm config param, so we read it from args
    const filterLicense = args[0] || null

    const arb = new Arborist({
      global,
      ...this.npm.flatOptions,
      path,
    })

    const tree = packageLockOnly
      ? await arb.loadVirtual()
      : await arb.loadActual()

    const pkgs = this.#collectPackages(tree, filterLicense)

    if (!pkgs.length) {
      if (filterLicense) {
        log.warn('licenses', `No packages found with license: ${filterLicense}`)
      } else {
        output.standard('No dependencies found.')
      }
      this.checkExpected(0)
      return
    }

    this.checkExpected(pkgs.length)

    if (json) {
      output.buffer(this.#jsonOutput(pkgs, long))
    } else if (parseable) {
      output.standard(this.#parseableOutput(pkgs, long))
    } else {
      output.standard(this.#tableOutput(pkgs, long))
    }
  }

  #collectPackages (tree, filterLicense) {
    const pkgs = []
    const seen = new Set()
    const omit = new Set(this.npm.flatOptions.omit)

    // Walk the tree via inventory (includes all installed packages)
    for (const node of tree.inventory.values()) {
      // Skip the root project itself
      if (node.isRoot) {
        continue
      }

      // Dedupe by realpath
      if (seen.has(node.realpath)) {
        continue
      }
      seen.add(node.realpath)

      // Respect --omit
      if (omit.has('dev') && node.dev) {
        continue
      }
      if (omit.has('optional') && node.optional) {
        continue
      }
      if (omit.has('peer') && node.peer) {
        continue
      }

      // Filter by workspace
      if (this.workspaceNames && this.workspaceNames.length) {
        const inWorkspace = this.workspaceNames.some(ws => {
          const wsNode = tree.children.get(ws)
          return wsNode && this.#isDescendant(node, wsNode)
        })
        if (!inWorkspace) {
          continue
        }
      }

      const pkg = node.package || {}
      const license = getLicense(pkg) || 'UNLICENSED'
      const licenseUrl = getLicenseUrl(pkg)
      const category = classifyLicense(license === 'UNLICENSED' ? null : license)

      // Apply license filter
      if (filterLicense) {
        const filterUpper = filterLicense.toUpperCase()
        const licenseUpper = license.toUpperCase()
        const categoryUpper = category.toUpperCase()
        if (licenseUpper !== filterUpper && categoryUpper !== filterUpper) {
          continue
        }
      }

      pkgs.push({
        name: pkg.name || node.name,
        version: pkg.version || '',
        license,
        licenseUrl,
        category,
        path: node.realpath,
        homepage: pkg.homepage || null,
        repository: this.#getRepoUrl(pkg),
        author: this.#getAuthor(pkg),
      })
    }

    pkgs.sort((a, b) => localeCompare(a.name, b.name))
    return pkgs
  }

  #isDescendant (node, wsNode) {
    let current = node
    while (current) {
      if (current === wsNode || current === wsNode.target) {
        return true
      }
      current = current.parent
    }
    return false
  }

  #getRepoUrl (pkg) {
    if (!pkg.repository) {
      return null
    }
    if (typeof pkg.repository === 'string') {
      return pkg.repository
    }
    return pkg.repository.url || null
  }

  #getAuthor (pkg) {
    if (!pkg.author) {
      return null
    }
    if (typeof pkg.author === 'string') {
      return pkg.author
    }
    const parts = [pkg.author.name]
    if (pkg.author.email) {
      parts.push(`<${pkg.author.email}>`)
    }
    return parts.join(' ')
  }

  #tableOutput (pkgs, long) {
    const chalk = this.npm.chalk
    const lines = []

    // Summary header
    const licenseMap = new Map()
    for (const pkg of pkgs) {
      const count = licenseMap.get(pkg.license) || 0
      licenseMap.set(pkg.license, count + 1)
    }

    lines.push(chalk.bold(`Licenses for ${pkgs.length} package${pkgs.length === 1 ? '' : 's'}`))
    lines.push('')

    // Summary by license type
    const sortedLicenses = [...licenseMap.entries()]
      .sort((a, b) => b[1] - a[1])

    for (const [license, count] of sortedLicenses) {
      const category = classifyLicense(license === 'UNLICENSED' ? null : license)
      const color = category === 'Copyleft' ? chalk.yellow
        : category === 'Unknown' ? chalk.red
          : category === 'Permissive' ? chalk.green
            : chalk.cyan
      lines.push(`  ${color(license)}: ${count}`)
    }

    lines.push('')

    // Detailed table
    const nameWidth = Math.min(
      Math.max(...pkgs.map(p => `${p.name}@${p.version}`.length), 7),
      40
    )
    const licWidth = Math.min(
      Math.max(...pkgs.map(p => p.license.length), 7),
      30
    )

    lines.push(
      chalk.dim(
        'Package'.padEnd(nameWidth + 2) +
        'License'.padEnd(licWidth + 2) +
        (long ? 'Author' : 'Category')
      )
    )
    lines.push(chalk.dim('─'.repeat(nameWidth + licWidth + 22)))

    for (const pkg of pkgs) {
      const pkgId = `${pkg.name}@${pkg.version}`
      const truncName = pkgId.length > nameWidth
        ? pkgId.slice(0, nameWidth - 1) + '…'
        : pkgId
      const truncLic = pkg.license.length > licWidth
        ? pkg.license.slice(0, licWidth - 1) + '…'
        : pkg.license

      const category = classifyLicense(pkg.license === 'UNLICENSED' ? null : pkg.license)
      const colorLic = category === 'Copyleft' ? chalk.yellow(truncLic)
        : category === 'Unknown' ? chalk.red(truncLic)
          : category === 'Permissive' ? chalk.green(truncLic)
            : chalk.cyan(truncLic)

      const thirdCol = long ? (pkg.author || '') : category
      lines.push(
        truncName.padEnd(nameWidth + 2) +
        colorLic + ' '.repeat(Math.max(0, licWidth + 2 - truncLic.length)) +
        thirdCol
      )
    }

    return lines.join('\n')
  }

  #parseableOutput (pkgs, long) {
    const lines = []
    for (const pkg of pkgs) {
      const parts = [`${pkg.name}@${pkg.version}`, pkg.license, pkg.path]
      if (long) {
        parts.push(pkg.repository || '', pkg.author || '', pkg.homepage || '')
      }
      lines.push(parts.join('\t'))
    }
    return lines.join('\n')
  }

  #jsonOutput (pkgs, long) {
    if (long) {
      return pkgs
    }
    return pkgs.map(({ name, version, license, category }) => ({
      name,
      version,
      license,
      category,
    }))
  }
}

module.exports = Licenses
