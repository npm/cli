/* IMPORTANT
 * This snapshot file is auto-generated, but designed for humans.
 * It should be checked into source control and tracked carefully.
 * Re-generate by setting TAP_SNAPSHOT=1 and running tests.
 * Make sure to inspect the output below.  Do not ignore changes!
 */
'use strict'
exports[`test/audit-report.js TAP a dep vuln that also has its own advisory against it > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "high",
      "isDirect": true,
      "via": [
        {
          "source": 42069,
          "name": "mkdirp",
          "dependency": "mkdirp",
          "title": "File System Pollution",
          "url": "https://npmjs.com/advisories/42069",
          "severity": "high",
          "range": "<0.5.5"
        },
        "minimist"
      ],
      "effects": [],
      "range": "<=0.5.4",
      "nodes": [
        "node_modules/mkdirp"
      ],
      "fixAvailable": true
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 1,
      "moderate": 0,
      "high": 1,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 3,
      "dev": 0,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "total": 2
    }
  }
}
`

exports[`test/audit-report.js TAP all severity levels > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "handlebars": {
      "name": "handlebars",
      "severity": "critical",
      "isDirect": false,
      "via": [
        {
          "source": 1164,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.3.0"
        },
        {
          "source": 1300,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "severity": "moderate",
          "range": ">=4.0.0 <4.4.5"
        },
        {
          "source": 1316,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.2"
        },
        {
          "source": 1324,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 1325,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 755,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "severity": "critical",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2"
        },
        "optimist"
      ],
      "effects": [],
      "range": "<=4.7.3",
      "nodes": [
        "node_modules/nyc/node_modules/handlebars"
      ],
      "fixAvailable": true
    },
    "kind-of": {
      "name": "kind-of",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1490,
          "name": "kind-of",
          "dependency": "kind-of",
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "severity": "low",
          "range": ">=6.0.0 <6.0.3"
        }
      ],
      "effects": [],
      "range": "6.0.0 - 6.0.2",
      "nodes": [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of"
      ],
      "fixAvailable": true
    },
    "lodash": {
      "name": "lodash",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1065,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "severity": "high",
          "range": "<4.17.12"
        },
        {
          "source": 782,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "severity": "high",
          "range": "<4.17.11"
        }
      ],
      "effects": [],
      "range": "<=4.17.11",
      "nodes": [
        "node_modules/nyc/node_modules/lodash"
      ],
      "fixAvailable": true
    },
    "mem": {
      "name": "mem",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1084,
          "name": "mem",
          "dependency": "mem",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "severity": "low",
          "range": "<4.0.0"
        }
      ],
      "effects": [
        "os-locale"
      ],
      "range": "<4.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mem"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp",
        "optimist"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist",
        "node_modules/nyc/node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "mixin-deep": {
      "name": "mixin-deep",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1013,
          "name": "mixin-deep",
          "dependency": "mixin-deep",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "severity": "high",
          "range": "<1.3.2 || >=2.0.0 <2.0.1"
        }
      ],
      "effects": [],
      "range": "<=1.3.1 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mixin-deep"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [
        "nyc"
      ],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp",
        "node_modules/nyc/node_modules/mkdirp"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "node-weakauras-parser": {
      "name": "node-weakauras-parser",
      "severity": "moderate",
      "isDirect": true,
      "via": [
        {
          "source": 1504,
          "name": "node-weakauras-parser",
          "dependency": "node-weakauras-parser",
          "title": "Buffer Overflow",
          "url": "https://npmjs.com/advisories/1504",
          "severity": "moderate",
          "range": ">=1.0.4 <1.0.5 || >=2.0.0 <2.0.2 || >=3.0.0 <3.0.1"
        }
      ],
      "effects": [],
      "range": "1.0.4 || 2.0.1 || 3.0.0",
      "nodes": [
        "node_modules/node-weakauras-parser"
      ],
      "fixAvailable": true
    },
    "nyc": {
      "name": "nyc",
      "severity": "low",
      "isDirect": true,
      "via": [
        "mkdirp",
        "yargs"
      ],
      "effects": [],
      "range": "6.2.0-alpha - 13.1.0",
      "nodes": [
        "node_modules/nyc"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "optimist": {
      "name": "optimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        "minimist"
      ],
      "effects": [
        "handlebars"
      ],
      "range": ">=0.6.0",
      "nodes": [
        "node_modules/nyc/node_modules/optimist"
      ],
      "fixAvailable": true
    },
    "os-locale": {
      "name": "os-locale",
      "severity": "low",
      "isDirect": false,
      "via": [
        "mem"
      ],
      "effects": [
        "yargs"
      ],
      "range": "2.0.0 - 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/os-locale"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "sapper": {
      "name": "sapper",
      "severity": "critical",
      "isDirect": true,
      "via": [
        {
          "source": 1494,
          "name": "sapper",
          "dependency": "sapper",
          "title": "Path Traversal",
          "url": "https://npmjs.com/advisories/1494",
          "severity": "critical",
          "range": "<0.27.11"
        }
      ],
      "effects": [],
      "range": "<0.27.11",
      "nodes": [
        "node_modules/sapper"
      ],
      "fixAvailable": true
    },
    "set-value": {
      "name": "set-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1012,
          "name": "set-value",
          "dependency": "set-value",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "severity": "high",
          "range": "<2.0.1 || >=3.0.0 <3.0.1"
        }
      ],
      "effects": [
        "union-value"
      ],
      "range": "<=2.0.0 || 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value"
      ],
      "fixAvailable": true
    },
    "subtext": {
      "name": "subtext",
      "severity": "high",
      "isDirect": true,
      "via": [
        {
          "source": 1168,
          "name": "subtext",
          "dependency": "subtext",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1168",
          "severity": "high",
          "range": ">=0.0.0"
        },
        {
          "source": 1478,
          "name": "subtext",
          "dependency": "subtext",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1478",
          "severity": "high",
          "range": ">=4.1.0"
        },
        {
          "source": 1479,
          "name": "subtext",
          "dependency": "subtext",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1479",
          "severity": "high",
          "range": ">=0.0.0"
        }
      ],
      "effects": [],
      "range": "*",
      "nodes": [
        "node_modules/subtext"
      ],
      "fixAvailable": false
    },
    "union-value": {
      "name": "union-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        "set-value"
      ],
      "effects": [],
      "range": "<=1.0.0 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/union-value"
      ],
      "fixAvailable": true
    },
    "yargs": {
      "name": "yargs",
      "severity": "low",
      "isDirect": false,
      "via": [
        "os-locale"
      ],
      "effects": [
        "nyc"
      ],
      "range": "8.0.1 - 11.1.0 || 12.0.0-candidate.0 - 12.0.1",
      "nodes": [
        "node_modules/nyc/node_modules/yargs"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 8,
      "moderate": 1,
      "high": 5,
      "critical": 2,
      "total": 16
    },
    "dependencies": {
      "prod": 507,
      "dev": 0,
      "optional": 12,
      "peer": 0,
      "peerOptional": 0,
      "total": 518
    }
  }
}
`

exports[`test/audit-report.js TAP audit outdated nyc and mkdirp > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "handlebars": {
      "name": "handlebars",
      "severity": "critical",
      "isDirect": false,
      "via": [
        {
          "source": 1164,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.3.0"
        },
        {
          "source": 1300,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "severity": "moderate",
          "range": ">=4.0.0 <4.4.5"
        },
        {
          "source": 1316,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.2"
        },
        {
          "source": 1324,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 1325,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 755,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "severity": "critical",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2"
        },
        "optimist"
      ],
      "effects": [],
      "range": "<=4.7.3",
      "nodes": [
        "node_modules/nyc/node_modules/handlebars"
      ],
      "fixAvailable": true
    },
    "kind-of": {
      "name": "kind-of",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1490,
          "name": "kind-of",
          "dependency": "kind-of",
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "severity": "low",
          "range": ">=6.0.0 <6.0.3"
        }
      ],
      "effects": [],
      "range": "6.0.0 - 6.0.2",
      "nodes": [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of"
      ],
      "fixAvailable": true
    },
    "lodash": {
      "name": "lodash",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1065,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "severity": "high",
          "range": "<4.17.12"
        },
        {
          "source": 782,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "severity": "high",
          "range": "<4.17.11"
        }
      ],
      "effects": [],
      "range": "<=4.17.11",
      "nodes": [
        "node_modules/nyc/node_modules/lodash"
      ],
      "fixAvailable": true
    },
    "mem": {
      "name": "mem",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1084,
          "name": "mem",
          "dependency": "mem",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "severity": "low",
          "range": "<4.0.0"
        }
      ],
      "effects": [
        "os-locale"
      ],
      "range": "<4.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mem"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp",
        "optimist"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist",
        "node_modules/nyc/node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "mixin-deep": {
      "name": "mixin-deep",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1013,
          "name": "mixin-deep",
          "dependency": "mixin-deep",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "severity": "high",
          "range": "<1.3.2 || >=2.0.0 <2.0.1"
        }
      ],
      "effects": [],
      "range": "<=1.3.1 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mixin-deep"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [
        "nyc"
      ],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp",
        "node_modules/nyc/node_modules/mkdirp"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "nyc": {
      "name": "nyc",
      "severity": "low",
      "isDirect": true,
      "via": [
        "mkdirp",
        "yargs"
      ],
      "effects": [],
      "range": "6.2.0-alpha - 13.1.0",
      "nodes": [
        "node_modules/nyc"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "optimist": {
      "name": "optimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        "minimist"
      ],
      "effects": [
        "handlebars"
      ],
      "range": ">=0.6.0",
      "nodes": [
        "node_modules/nyc/node_modules/optimist"
      ],
      "fixAvailable": true
    },
    "os-locale": {
      "name": "os-locale",
      "severity": "low",
      "isDirect": false,
      "via": [
        "mem"
      ],
      "effects": [
        "yargs"
      ],
      "range": "2.0.0 - 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/os-locale"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "set-value": {
      "name": "set-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1012,
          "name": "set-value",
          "dependency": "set-value",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "severity": "high",
          "range": "<2.0.1 || >=3.0.0 <3.0.1"
        }
      ],
      "effects": [
        "union-value"
      ],
      "range": "<=2.0.0 || 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value"
      ],
      "fixAvailable": true
    },
    "union-value": {
      "name": "union-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        "set-value"
      ],
      "effects": [],
      "range": "<=1.0.0 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/union-value"
      ],
      "fixAvailable": true
    },
    "yargs": {
      "name": "yargs",
      "severity": "low",
      "isDirect": false,
      "via": [
        "os-locale"
      ],
      "effects": [
        "nyc"
      ],
      "range": "8.0.1 - 11.1.0 || 12.0.0-candidate.0 - 12.0.1",
      "nodes": [
        "node_modules/nyc/node_modules/yargs"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 8,
      "moderate": 0,
      "high": 4,
      "critical": 1,
      "total": 13
    },
    "dependencies": {
      "prod": 318,
      "dev": 0,
      "optional": 12,
      "peer": 0,
      "peerOptional": 0,
      "total": 329
    }
  }
}
`

exports[`test/audit-report.js TAP audit outdated nyc and mkdirp with before: option > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "handlebars": {
      "name": "handlebars",
      "severity": "critical",
      "isDirect": false,
      "via": [
        {
          "source": 1164,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.3.0"
        },
        {
          "source": 1300,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "severity": "moderate",
          "range": ">=4.0.0 <4.4.5"
        },
        {
          "source": 1316,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.2"
        },
        {
          "source": 1324,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 1325,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 755,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "severity": "critical",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2"
        },
        "optimist"
      ],
      "effects": [],
      "range": "<=4.7.3",
      "nodes": [
        "node_modules/nyc/node_modules/handlebars"
      ],
      "fixAvailable": true
    },
    "kind-of": {
      "name": "kind-of",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1490,
          "name": "kind-of",
          "dependency": "kind-of",
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "severity": "low",
          "range": ">=6.0.0 <6.0.3"
        }
      ],
      "effects": [],
      "range": "6.0.0 - 6.0.2",
      "nodes": [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of"
      ],
      "fixAvailable": true
    },
    "lodash": {
      "name": "lodash",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1065,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "severity": "high",
          "range": "<4.17.12"
        },
        {
          "source": 782,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "severity": "high",
          "range": "<4.17.11"
        }
      ],
      "effects": [],
      "range": "<=4.17.11",
      "nodes": [
        "node_modules/nyc/node_modules/lodash"
      ],
      "fixAvailable": true
    },
    "mem": {
      "name": "mem",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1084,
          "name": "mem",
          "dependency": "mem",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "severity": "low",
          "range": "<4.0.0"
        }
      ],
      "effects": [
        "os-locale"
      ],
      "range": "<4.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mem"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp",
        "optimist"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist",
        "node_modules/nyc/node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "mixin-deep": {
      "name": "mixin-deep",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1013,
          "name": "mixin-deep",
          "dependency": "mixin-deep",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "severity": "high",
          "range": "<1.3.2 || >=2.0.0 <2.0.1"
        }
      ],
      "effects": [],
      "range": "<=1.3.1 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mixin-deep"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [
        "nyc"
      ],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp",
        "node_modules/nyc/node_modules/mkdirp"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "nyc": {
      "name": "nyc",
      "severity": "low",
      "isDirect": true,
      "via": [
        "mkdirp",
        "yargs"
      ],
      "effects": [],
      "range": "6.2.0-alpha - 13.1.0",
      "nodes": [
        "node_modules/nyc"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "optimist": {
      "name": "optimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        "minimist"
      ],
      "effects": [
        "handlebars"
      ],
      "range": ">=0.6.0",
      "nodes": [
        "node_modules/nyc/node_modules/optimist"
      ],
      "fixAvailable": true
    },
    "os-locale": {
      "name": "os-locale",
      "severity": "low",
      "isDirect": false,
      "via": [
        "mem"
      ],
      "effects": [
        "yargs"
      ],
      "range": "2.0.0 - 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/os-locale"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "set-value": {
      "name": "set-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1012,
          "name": "set-value",
          "dependency": "set-value",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "severity": "high",
          "range": "<2.0.1 || >=3.0.0 <3.0.1"
        }
      ],
      "effects": [
        "union-value"
      ],
      "range": "<=2.0.0 || 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value"
      ],
      "fixAvailable": true
    },
    "union-value": {
      "name": "union-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        "set-value"
      ],
      "effects": [],
      "range": "<=1.0.0 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/union-value"
      ],
      "fixAvailable": true
    },
    "yargs": {
      "name": "yargs",
      "severity": "low",
      "isDirect": false,
      "via": [
        "os-locale"
      ],
      "effects": [
        "nyc"
      ],
      "range": "8.0.1 - 11.1.0 || 12.0.0-candidate.0 - 12.0.1",
      "nodes": [
        "node_modules/nyc/node_modules/yargs"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 8,
      "moderate": 0,
      "high": 4,
      "critical": 1,
      "total": 13
    },
    "dependencies": {
      "prod": 318,
      "dev": 0,
      "optional": 12,
      "peer": 0,
      "peerOptional": 0,
      "total": 329
    }
  }
}
`

exports[`test/audit-report.js TAP audit outdated nyc and mkdirp with newer endpoint > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "handlebars": {
      "name": "handlebars",
      "severity": "critical",
      "isDirect": false,
      "via": [
        {
          "source": 1164,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.3.0"
        },
        {
          "source": 1300,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "severity": "moderate",
          "range": ">=4.0.0 <4.4.5"
        },
        {
          "source": 1316,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.2"
        },
        {
          "source": 1324,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 1325,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "severity": "high",
          "range": "<3.0.8 || >=4.0.0 <4.5.3"
        },
        {
          "source": 755,
          "name": "handlebars",
          "dependency": "handlebars",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "severity": "critical",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2"
        },
        "optimist"
      ],
      "effects": [],
      "range": "<=4.7.3",
      "nodes": [
        "node_modules/nyc/node_modules/handlebars"
      ],
      "fixAvailable": true
    },
    "kind-of": {
      "name": "kind-of",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1490,
          "name": "kind-of",
          "dependency": "kind-of",
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "severity": "low",
          "range": ">=6.0.0 <6.0.3"
        }
      ],
      "effects": [],
      "range": "6.0.0 - 6.0.2",
      "nodes": [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of"
      ],
      "fixAvailable": true
    },
    "lodash": {
      "name": "lodash",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1065,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "severity": "high",
          "range": "<4.17.12"
        },
        {
          "source": 782,
          "name": "lodash",
          "dependency": "lodash",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "severity": "high",
          "range": "<4.17.11"
        }
      ],
      "effects": [],
      "range": "<=4.17.11",
      "nodes": [
        "node_modules/nyc/node_modules/lodash"
      ],
      "fixAvailable": true
    },
    "mem": {
      "name": "mem",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1084,
          "name": "mem",
          "dependency": "mem",
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "severity": "low",
          "range": "<4.0.0"
        }
      ],
      "effects": [
        "os-locale"
      ],
      "range": "<4.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mem"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp",
        "optimist"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist",
        "node_modules/nyc/node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "mixin-deep": {
      "name": "mixin-deep",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1013,
          "name": "mixin-deep",
          "dependency": "mixin-deep",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "severity": "high",
          "range": "<1.3.2 || >=2.0.0 <2.0.1"
        }
      ],
      "effects": [],
      "range": "<=1.3.1 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/mixin-deep"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [
        "nyc"
      ],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp",
        "node_modules/nyc/node_modules/mkdirp"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "nyc": {
      "name": "nyc",
      "severity": "low",
      "isDirect": true,
      "via": [
        "mkdirp",
        "yargs"
      ],
      "effects": [],
      "range": "6.2.0-alpha - 13.1.0",
      "nodes": [
        "node_modules/nyc"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "optimist": {
      "name": "optimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        "minimist"
      ],
      "effects": [
        "handlebars"
      ],
      "range": ">=0.6.0",
      "nodes": [
        "node_modules/nyc/node_modules/optimist"
      ],
      "fixAvailable": true
    },
    "os-locale": {
      "name": "os-locale",
      "severity": "low",
      "isDirect": false,
      "via": [
        "mem"
      ],
      "effects": [
        "yargs"
      ],
      "range": "2.0.0 - 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/os-locale"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    },
    "set-value": {
      "name": "set-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        {
          "source": 1012,
          "name": "set-value",
          "dependency": "set-value",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "severity": "high",
          "range": "<2.0.1 || >=3.0.0 <3.0.1"
        }
      ],
      "effects": [
        "union-value"
      ],
      "range": "<=2.0.0 || 3.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value"
      ],
      "fixAvailable": true
    },
    "union-value": {
      "name": "union-value",
      "severity": "high",
      "isDirect": false,
      "via": [
        "set-value"
      ],
      "effects": [],
      "range": "<=1.0.0 || 2.0.0",
      "nodes": [
        "node_modules/nyc/node_modules/union-value"
      ],
      "fixAvailable": true
    },
    "yargs": {
      "name": "yargs",
      "severity": "low",
      "isDirect": false,
      "via": [
        "os-locale"
      ],
      "effects": [
        "nyc"
      ],
      "range": "8.0.1 - 11.1.0 || 12.0.0-candidate.0 - 12.0.1",
      "nodes": [
        "node_modules/nyc/node_modules/yargs"
      ],
      "fixAvailable": {
        "name": "nyc",
        "version": "15.1.0",
        "isSemVerMajor": true
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 8,
      "moderate": 0,
      "high": 4,
      "critical": 1,
      "total": 13
    },
    "dependencies": {
      "prod": 318,
      "dev": 0,
      "optional": 12,
      "peer": 0,
      "peerOptional": 0,
      "total": 329
    }
  }
}
`

exports[`test/audit-report.js TAP audit report with a lying v5 lockfile > must match snapshot 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 1,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "prod": 156,
      "total": 156,
    },
    "vulnerabilities": Object {
      "critical": 0,
      "high": 2,
      "info": 0,
      "low": 2,
      "moderate": 1,
      "total": 5,
    },
  },
  "vulnerabilities": Object {
    "acorn": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "acorn",
      "nodes": Array [
        "node_modules/acorn",
      ],
      "range": "5.5.0 - 5.7.3 || 6.0.0 - 6.4.0 || 7.0.0 - 7.1.0",
      "severity": "moderate",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "acorn",
          "id": undefined,
          "name": "acorn",
          "range": ">=5.5.0 <5.7.4 || >=6.0.0 <6.4.1 || >=7.0.0 <7.1.1",
          "severity": "moderate",
          "source": 1488,
          "title": "Regular Expression Denial of Service",
          "url": "https://npmjs.com/advisories/1488",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "js-yaml": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "js-yaml",
      "nodes": Array [
        "node_modules/js-yaml",
      ],
      "range": "<=3.13.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "js-yaml",
          "id": undefined,
          "name": "js-yaml",
          "range": "<3.13.0",
          "severity": "moderate",
          "source": 788,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/788",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "js-yaml",
          "id": undefined,
          "name": "js-yaml",
          "range": "<3.13.1",
          "severity": "high",
          "source": 813,
          "title": "Code Injection",
          "url": "https://npmjs.com/advisories/813",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "lodash": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "lodash",
      "nodes": Array [
        "node_modules/lodash",
      ],
      "range": "<=4.17.18",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.12",
          "severity": "high",
          "source": 1065,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.19",
          "severity": "low",
          "source": 1523,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1523",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.11",
          "severity": "high",
          "source": 782,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "minimist": Object {
      "effects": Array [
        "mkdirp",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mkdirp": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "mkdirp",
      "nodes": Array [
        "node_modules/mkdirp",
      ],
      "range": "0.4.1 - 0.5.1",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP audit supports alias deps > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "mkdirp",
        "version": "0.5.5",
        "isSemVerMajor": false
      }
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp",
        "node_modules/novulnshereiswear"
      ],
      "fixAvailable": {
        "name": "mkdirp",
        "version": "0.5.5",
        "isSemVerMajor": false
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 2,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 0,
      "dev": 4,
      "optional": 4,
      "peer": 4,
      "peerOptional": 0,
      "total": 3
    }
  }
}
`

exports[`test/audit-report.js TAP audit with filterSet limiting to only mkdirp and minimist > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": true
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp"
      ],
      "fixAvailable": true
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 2,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 318,
      "dev": 0,
      "optional": 12,
      "peer": 0,
      "peerOptional": 0,
      "total": 329
    }
  }
}
`

exports[`test/audit-report.js TAP metavuln where a dep is not on the registry at all > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "@isaacs/this-does-not-exist-at-all": {
      "name": "@isaacs/this-does-not-exist-at-all",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [],
      "range": "",
      "nodes": [
        "node_modules/@isaacs/this-does-not-exist-at-all"
      ],
      "fixAvailable": false
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "@isaacs/this-does-not-exist-at-all"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": false
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 2,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 1,
      "dev": 0,
      "optional": 2,
      "peer": 0,
      "peerOptional": 0,
      "total": 2
    }
  }
}
`

exports[`test/audit-report.js TAP metavuln where dep is not a registry dep > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "@isaacs/minimist-git-dep": {
      "name": "@isaacs/minimist-git-dep",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [],
      "range": "*",
      "nodes": [
        "node_modules/@isaacs/minimist-git-dep"
      ],
      "fixAvailable": false
    },
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "@isaacs/minimist-git-dep"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": false
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 2,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 2,
      "dev": 2,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "total": 3
    }
  }
}
`

exports[`test/audit-report.js TAP omit options omit=[] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 4,
      "info": 0,
      "low": 9,
      "moderate": 0,
      "total": 14,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": true,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/handlebars",
        "node_modules/nyc/node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "kind-of": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "kind-of",
      "nodes": Array [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of",
      ],
      "range": "6.0.0 - 6.0.2",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "kind-of",
          "id": undefined,
          "name": "kind-of",
          "range": ">=6.0.0 <6.0.3",
          "severity": "low",
          "source": 1490,
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "lodash": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "lodash",
      "nodes": Array [
        "node_modules/nyc/node_modules/lodash",
      ],
      "range": "<=4.17.18",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.12",
          "severity": "high",
          "source": 1065,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.19",
          "severity": "low",
          "source": 1523,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1523",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.11",
          "severity": "high",
          "source": 782,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mem": Object {
      "effects": Array [
        "os-locale",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mem",
      "nodes": Array [
        "node_modules/nyc/node_modules/mem",
      ],
      "range": "<4.0.0",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mem",
          "id": undefined,
          "name": "mem",
          "range": "<4.0.0",
          "severity": "low",
          "source": 1084,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "minimist": Object {
      "effects": Array [
        "mkdirp",
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/minimist",
        "node_modules/optimist/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mixin-deep": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "mixin-deep",
      "nodes": Array [
        "node_modules/nyc/node_modules/mixin-deep",
      ],
      "range": "<=1.3.1 || 2.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mixin-deep",
          "id": undefined,
          "name": "mixin-deep",
          "range": "<1.3.2 || >=2.0.0 <2.0.1",
          "severity": "high",
          "source": 1013,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mkdirp": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mkdirp",
      "nodes": Array [
        "node_modules/nyc/node_modules/mkdirp",
      ],
      "range": "0.4.1 - 0.5.1",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "nyc": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": true,
      "name": "nyc",
      "nodes": Array [
        "node_modules/nyc",
      ],
      "range": "6.0.0 - 13.3.0",
      "severity": "low",
      "via": Array [
        "mkdirp",
        "yargs",
        "yargs-parser",
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/optimist",
        "node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "os-locale": Object {
      "effects": Array [
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "os-locale",
      "nodes": Array [
        "node_modules/nyc/node_modules/os-locale",
      ],
      "range": "2.0.0 - 3.0.0",
      "severity": "low",
      "via": Array [
        "mem",
      ],
    },
    "set-value": Object {
      "effects": Array [
        "union-value",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "set-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value",
      ],
      "range": "<=2.0.0 || 3.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "set-value",
          "id": undefined,
          "name": "set-value",
          "range": "<2.0.1 || >=3.0.0 <3.0.1",
          "severity": "high",
          "source": 1012,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "union-value": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "union-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/union-value",
      ],
      "range": "<=1.0.0 || 2.0.0",
      "severity": "high",
      "via": Array [
        "set-value",
      ],
    },
    "yargs": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs",
      ],
      "range": "4.0.0-alpha1 - 12.0.5 || 14.1.0 || 15.0.0 - 15.2.0",
      "severity": "low",
      "via": Array [
        "os-locale",
        "yargs-parser",
      ],
    },
    "yargs-parser": Object {
      "effects": Array [
        "nyc",
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs-parser",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs-parser",
        "node_modules/nyc/node_modules/yargs/node_modules/yargs-parser",
      ],
      "range": "<=13.1.1 || 14.0.0 - 15.0.0 || 16.0.0 - 18.1.1",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "yargs-parser",
          "id": undefined,
          "name": "yargs-parser",
          "range": "<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2",
          "severity": "low",
          "source": 1500,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1500",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP omit options omit=[dev,optional] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 0,
      "info": 0,
      "low": 2,
      "moderate": 0,
      "total": 3,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": true,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "minimist": Object {
      "effects": Array [
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/optimist/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP omit options omit=[dev] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 4,
      "info": 0,
      "low": 9,
      "moderate": 0,
      "total": 14,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": true,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/handlebars",
        "node_modules/nyc/node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "kind-of": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "kind-of",
      "nodes": Array [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of",
      ],
      "range": "6.0.0 - 6.0.2",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "kind-of",
          "id": undefined,
          "name": "kind-of",
          "range": ">=6.0.0 <6.0.3",
          "severity": "low",
          "source": 1490,
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "lodash": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "lodash",
      "nodes": Array [
        "node_modules/nyc/node_modules/lodash",
      ],
      "range": "<=4.17.18",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.12",
          "severity": "high",
          "source": 1065,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.19",
          "severity": "low",
          "source": 1523,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1523",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.11",
          "severity": "high",
          "source": 782,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mem": Object {
      "effects": Array [
        "os-locale",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mem",
      "nodes": Array [
        "node_modules/nyc/node_modules/mem",
      ],
      "range": "<4.0.0",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mem",
          "id": undefined,
          "name": "mem",
          "range": "<4.0.0",
          "severity": "low",
          "source": 1084,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "minimist": Object {
      "effects": Array [
        "mkdirp",
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/minimist",
        "node_modules/optimist/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mixin-deep": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "mixin-deep",
      "nodes": Array [
        "node_modules/nyc/node_modules/mixin-deep",
      ],
      "range": "<=1.3.1 || 2.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mixin-deep",
          "id": undefined,
          "name": "mixin-deep",
          "range": "<1.3.2 || >=2.0.0 <2.0.1",
          "severity": "high",
          "source": 1013,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mkdirp": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mkdirp",
      "nodes": Array [
        "node_modules/nyc/node_modules/mkdirp",
      ],
      "range": "0.4.1 - 0.5.1",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "nyc": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": true,
      "name": "nyc",
      "nodes": Array [
        "node_modules/nyc",
      ],
      "range": "6.0.0 - 13.3.0",
      "severity": "low",
      "via": Array [
        "mkdirp",
        "yargs",
        "yargs-parser",
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/optimist",
        "node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "os-locale": Object {
      "effects": Array [
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "os-locale",
      "nodes": Array [
        "node_modules/nyc/node_modules/os-locale",
      ],
      "range": "2.0.0 - 3.0.0",
      "severity": "low",
      "via": Array [
        "mem",
      ],
    },
    "set-value": Object {
      "effects": Array [
        "union-value",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "set-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value",
      ],
      "range": "<=2.0.0 || 3.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "set-value",
          "id": undefined,
          "name": "set-value",
          "range": "<2.0.1 || >=3.0.0 <3.0.1",
          "severity": "high",
          "source": 1012,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "union-value": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "union-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/union-value",
      ],
      "range": "<=1.0.0 || 2.0.0",
      "severity": "high",
      "via": Array [
        "set-value",
      ],
    },
    "yargs": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs",
      ],
      "range": "4.0.0-alpha1 - 12.0.5 || 14.1.0 || 15.0.0 - 15.2.0",
      "severity": "low",
      "via": Array [
        "os-locale",
        "yargs-parser",
      ],
    },
    "yargs-parser": Object {
      "effects": Array [
        "nyc",
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs-parser",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs-parser",
        "node_modules/nyc/node_modules/yargs/node_modules/yargs-parser",
      ],
      "range": "<=13.1.1 || 14.0.0 - 15.0.0 || 16.0.0 - 18.1.1",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "yargs-parser",
          "id": undefined,
          "name": "yargs-parser",
          "range": "<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2",
          "severity": "low",
          "source": 1500,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1500",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP omit options omit=[optional] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 0,
      "info": 0,
      "low": 2,
      "moderate": 0,
      "total": 3,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": true,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "minimist": Object {
      "effects": Array [
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/optimist/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": false,
        "name": "handlebars",
        "version": "4.7.6",
      },
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP omit options omit=[peer,dev,optional] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 0,
      "high": 0,
      "info": 0,
      "low": 0,
      "moderate": 0,
      "total": 0,
    },
  },
  "vulnerabilities": Object {},
}
`

exports[`test/audit-report.js TAP omit options omit=[peer,dev] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 4,
      "info": 0,
      "low": 9,
      "moderate": 0,
      "total": 14,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/nyc/node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "kind-of": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "kind-of",
      "nodes": Array [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of",
      ],
      "range": "6.0.0 - 6.0.2",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "kind-of",
          "id": undefined,
          "name": "kind-of",
          "range": ">=6.0.0 <6.0.3",
          "severity": "low",
          "source": 1490,
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "lodash": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "lodash",
      "nodes": Array [
        "node_modules/nyc/node_modules/lodash",
      ],
      "range": "<=4.17.18",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.12",
          "severity": "high",
          "source": 1065,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.19",
          "severity": "low",
          "source": 1523,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1523",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.11",
          "severity": "high",
          "source": 782,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mem": Object {
      "effects": Array [
        "os-locale",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mem",
      "nodes": Array [
        "node_modules/nyc/node_modules/mem",
      ],
      "range": "<4.0.0",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mem",
          "id": undefined,
          "name": "mem",
          "range": "<4.0.0",
          "severity": "low",
          "source": 1084,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "minimist": Object {
      "effects": Array [
        "mkdirp",
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mixin-deep": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "mixin-deep",
      "nodes": Array [
        "node_modules/nyc/node_modules/mixin-deep",
      ],
      "range": "<=1.3.1 || 2.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mixin-deep",
          "id": undefined,
          "name": "mixin-deep",
          "range": "<1.3.2 || >=2.0.0 <2.0.1",
          "severity": "high",
          "source": 1013,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mkdirp": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mkdirp",
      "nodes": Array [
        "node_modules/nyc/node_modules/mkdirp",
      ],
      "range": "0.4.1 - 0.5.1",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "nyc": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": true,
      "name": "nyc",
      "nodes": Array [
        "node_modules/nyc",
      ],
      "range": "6.0.0 - 13.3.0",
      "severity": "low",
      "via": Array [
        "mkdirp",
        "yargs",
        "yargs-parser",
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "os-locale": Object {
      "effects": Array [
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "os-locale",
      "nodes": Array [
        "node_modules/nyc/node_modules/os-locale",
      ],
      "range": "2.0.0 - 3.0.0",
      "severity": "low",
      "via": Array [
        "mem",
      ],
    },
    "set-value": Object {
      "effects": Array [
        "union-value",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "set-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value",
      ],
      "range": "<=2.0.0 || 3.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "set-value",
          "id": undefined,
          "name": "set-value",
          "range": "<2.0.1 || >=3.0.0 <3.0.1",
          "severity": "high",
          "source": 1012,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "union-value": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "union-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/union-value",
      ],
      "range": "<=1.0.0 || 2.0.0",
      "severity": "high",
      "via": Array [
        "set-value",
      ],
    },
    "yargs": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs",
      ],
      "range": "4.0.0-alpha1 - 12.0.5 || 14.1.0 || 15.0.0 - 15.2.0",
      "severity": "low",
      "via": Array [
        "os-locale",
        "yargs-parser",
      ],
    },
    "yargs-parser": Object {
      "effects": Array [
        "nyc",
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs-parser",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs-parser",
        "node_modules/nyc/node_modules/yargs/node_modules/yargs-parser",
      ],
      "range": "<=13.1.1 || 14.0.0 - 15.0.0 || 16.0.0 - 18.1.1",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "yargs-parser",
          "id": undefined,
          "name": "yargs-parser",
          "range": "<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2",
          "severity": "low",
          "source": 1500,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1500",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP omit options omit=[peer] > bulk 1`] = `
Object {
  "auditReportVersion": 2,
  "metadata": Object {
    "dependencies": Object {
      "dev": 399,
      "optional": 351,
      "peer": 26,
      "peerOptional": 0,
      "prod": 3,
      "total": 751,
    },
    "vulnerabilities": Object {
      "critical": 1,
      "high": 4,
      "info": 0,
      "low": 9,
      "moderate": 0,
      "total": 14,
    },
  },
  "vulnerabilities": Object {
    "handlebars": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "handlebars",
      "nodes": Array [
        "node_modules/nyc/node_modules/handlebars",
      ],
      "range": "<=4.7.3",
      "severity": "critical",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.3.0",
          "severity": "high",
          "source": 1164,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1164",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": ">=4.0.0 <4.4.5",
          "severity": "moderate",
          "source": 1300,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1300",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.2",
          "severity": "high",
          "source": 1316,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1316",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1324,
          "title": "Arbitrary Code Execution",
          "url": "https://npmjs.com/advisories/1324",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<3.0.8 || >=4.0.0 <4.5.3",
          "severity": "high",
          "source": 1325,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1325",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "handlebars",
          "id": undefined,
          "name": "handlebars",
          "range": "<=4.0.13 || >=4.1.0 <4.1.2",
          "severity": "critical",
          "source": 755,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/755",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        "optimist",
      ],
    },
    "kind-of": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "kind-of",
      "nodes": Array [
        "node_modules/nyc/node_modules/base/node_modules/kind-of",
        "node_modules/nyc/node_modules/define-property/node_modules/kind-of",
        "node_modules/nyc/node_modules/extglob/node_modules/kind-of",
        "node_modules/nyc/node_modules/micromatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/nanomatch/node_modules/kind-of",
        "node_modules/nyc/node_modules/snapdragon-node/node_modules/kind-of",
        "node_modules/nyc/node_modules/test-exclude/node_modules/kind-of",
        "node_modules/nyc/node_modules/use/node_modules/kind-of",
      ],
      "range": "6.0.0 - 6.0.2",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "kind-of",
          "id": undefined,
          "name": "kind-of",
          "range": ">=6.0.0 <6.0.3",
          "severity": "low",
          "source": 1490,
          "title": "Validation Bypass",
          "url": "https://npmjs.com/advisories/1490",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "lodash": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "lodash",
      "nodes": Array [
        "node_modules/nyc/node_modules/lodash",
      ],
      "range": "<=4.17.18",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.12",
          "severity": "high",
          "source": 1065,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1065",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.19",
          "severity": "low",
          "source": 1523,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1523",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "lodash",
          "id": undefined,
          "name": "lodash",
          "range": "<4.17.11",
          "severity": "high",
          "source": 782,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/782",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mem": Object {
      "effects": Array [
        "os-locale",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mem",
      "nodes": Array [
        "node_modules/nyc/node_modules/mem",
      ],
      "range": "<4.0.0",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mem",
          "id": undefined,
          "name": "mem",
          "range": "<4.0.0",
          "severity": "low",
          "source": 1084,
          "title": "Denial of Service",
          "url": "https://npmjs.com/advisories/1084",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "minimist": Object {
      "effects": Array [
        "mkdirp",
        "optimist",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "minimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/minimist",
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "minimist",
          "id": undefined,
          "name": "minimist",
          "range": "<0.2.1 || >=1.0.0 <1.2.3",
          "severity": "low",
          "source": 1179,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mixin-deep": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "mixin-deep",
      "nodes": Array [
        "node_modules/nyc/node_modules/mixin-deep",
      ],
      "range": "<=1.3.1 || 2.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "mixin-deep",
          "id": undefined,
          "name": "mixin-deep",
          "range": "<1.3.2 || >=2.0.0 <2.0.1",
          "severity": "high",
          "source": 1013,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1013",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "mkdirp": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "mkdirp",
      "nodes": Array [
        "node_modules/nyc/node_modules/mkdirp",
      ],
      "range": "0.4.1 - 0.5.1",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "nyc": Object {
      "effects": Array [],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": true,
      "name": "nyc",
      "nodes": Array [
        "node_modules/nyc",
      ],
      "range": "6.0.0 - 13.3.0",
      "severity": "low",
      "via": Array [
        "mkdirp",
        "yargs",
        "yargs-parser",
      ],
    },
    "optimist": Object {
      "effects": Array [
        "handlebars",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "optimist",
      "nodes": Array [
        "node_modules/nyc/node_modules/optimist",
      ],
      "range": ">=0.6.0",
      "severity": "low",
      "via": Array [
        "minimist",
      ],
    },
    "os-locale": Object {
      "effects": Array [
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "os-locale",
      "nodes": Array [
        "node_modules/nyc/node_modules/os-locale",
      ],
      "range": "2.0.0 - 3.0.0",
      "severity": "low",
      "via": Array [
        "mem",
      ],
    },
    "set-value": Object {
      "effects": Array [
        "union-value",
      ],
      "fixAvailable": true,
      "isDirect": false,
      "name": "set-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/set-value",
        "node_modules/nyc/node_modules/union-value/node_modules/set-value",
      ],
      "range": "<=2.0.0 || 3.0.0",
      "severity": "high",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "set-value",
          "id": undefined,
          "name": "set-value",
          "range": "<2.0.1 || >=3.0.0 <3.0.1",
          "severity": "high",
          "source": 1012,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1012",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
    "union-value": Object {
      "effects": Array [],
      "fixAvailable": true,
      "isDirect": false,
      "name": "union-value",
      "nodes": Array [
        "node_modules/nyc/node_modules/union-value",
      ],
      "range": "<=1.0.0 || 2.0.0",
      "severity": "high",
      "via": Array [
        "set-value",
      ],
    },
    "yargs": Object {
      "effects": Array [
        "nyc",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs",
      ],
      "range": "4.0.0-alpha1 - 12.0.5 || 14.1.0 || 15.0.0 - 15.2.0",
      "severity": "low",
      "via": Array [
        "os-locale",
        "yargs-parser",
      ],
    },
    "yargs-parser": Object {
      "effects": Array [
        "nyc",
        "yargs",
      ],
      "fixAvailable": Object {
        "isSemVerMajor": true,
        "name": "nyc",
        "version": "15.1.0",
      },
      "isDirect": false,
      "name": "yargs-parser",
      "nodes": Array [
        "node_modules/nyc/node_modules/yargs-parser",
        "node_modules/nyc/node_modules/yargs/node_modules/yargs-parser",
      ],
      "range": "<=13.1.1 || 14.0.0 - 15.0.0 || 16.0.0 - 18.1.1",
      "severity": "low",
      "via": Array [
        Object {
          "cvss": undefined,
          "cwe": undefined,
          "dependency": "yargs-parser",
          "id": undefined,
          "name": "yargs-parser",
          "range": "<13.1.2 || >=14.0.0 <15.0.1 || >=16.0.0 <18.1.2",
          "severity": "low",
          "source": 1500,
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1500",
          "versions": undefined,
          "vulnerableVersions": undefined,
        },
      ],
    },
  },
}
`

exports[`test/audit-report.js TAP one vulnerability > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": true,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": true
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 1,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 1
    },
    "dependencies": {
      "prod": 2,
      "dev": 0,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "total": 1
    }
  }
}
`

exports[`test/audit-report.js TAP unfixable, but not a semver major forced fix > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": false,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [
        "mkdirp"
      ],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": {
        "name": "mkdirp",
        "version": "0.5.5",
        "isSemVerMajor": false
      }
    },
    "mkdirp": {
      "name": "mkdirp",
      "severity": "low",
      "isDirect": true,
      "via": [
        "minimist"
      ],
      "effects": [],
      "range": "0.4.1 - 0.5.1",
      "nodes": [
        "node_modules/mkdirp"
      ],
      "fixAvailable": {
        "name": "mkdirp",
        "version": "0.5.5",
        "isSemVerMajor": false
      }
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 2,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 2
    },
    "dependencies": {
      "prod": 3,
      "dev": 0,
      "optional": 0,
      "peer": 0,
      "peerOptional": 0,
      "total": 2
    }
  }
}
`

exports[`test/audit-report.js TAP vulnerable dep not from registry > json version 1`] = `
{
  "auditReportVersion": 2,
  "vulnerabilities": {
    "minimist": {
      "name": "minimist",
      "severity": "low",
      "isDirect": true,
      "via": [
        {
          "source": 1179,
          "name": "minimist",
          "dependency": "minimist",
          "title": "Prototype Pollution",
          "url": "https://npmjs.com/advisories/1179",
          "severity": "low",
          "range": "<0.2.1 || >=1.0.0 <1.2.3"
        }
      ],
      "effects": [],
      "range": "<0.2.1 || >=1.0.0 <1.2.3",
      "nodes": [
        "node_modules/minimist"
      ],
      "fixAvailable": false
    }
  },
  "metadata": {
    "vulnerabilities": {
      "info": 0,
      "low": 1,
      "moderate": 0,
      "high": 0,
      "critical": 0,
      "total": 1
    },
    "dependencies": {
      "prod": 1,
      "dev": 0,
      "optional": 0,
      "peer": 1,
      "peerOptional": 0,
      "total": 1
    }
  }
}
`
