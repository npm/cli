
/*
 * mp - missing packages
 *
 * Shows what packages do not appear as dependencies in package.json
 * within a file or a folder (multiple files) and prompts the user
 * to install those relevant
 */

module.exports = mp

const usage = require("./utils/usage")
const output = require("./utils/output.js")
const fs = require("graceful-fs")
const inquirer = require("inquirer")

mp.usage = usage(
  "mp",
  "\nnpm mp <path>" +
  "\nnpm mp install <path>" +
  "npm mp i <path>" +
  "\nnpm mp check <path>" +
  "\nnpm mp c <path>"
)

function mp(args, cb) {
  const firstParam = args.shift()
  const secondParam = args.shift()
  const packagesInstalled = getPackagesInstalled(cb)

  if ((firstParam === "i" || firstParam === "install") && fs.existsSync(`${process.cwd()}/${secondParam}`)) {
    const filePath = `${process.cwd()}/${secondParam}`
    const packagesToInstall = check(filePath)

    installPackages(packagesToInstall, packagesInstalled, cb)
  } else if (firstParam === "c" || firstParam === "check"  && fs.existsSync(`${process.cwd()}/${secondParam}`)) {
    const filePath = `${process.cwd()}/${secondParam}`
    const packagesToInstall = check(filePath)

    displayPackages(packagesToInstall, packagesInstalled, cb)
  } else if (fs.existsSync(`${process.cwd()}/${firstParam}`)) {
    const filePath = `${process.cwd()}/${firstParam}`
    const packagesToInstall = check(filePath)

    installPackages(packagesToInstall, packagesInstalled, cb)
  } else {
    misuse(cb)
  }
}

// Installs a single package
function installOnePackage(uniquePackage) {
  shell.exec(`npm install --save ${uniquePackage}`)
}

function installFromQuestions(toInstallQuestions, cb) {
  inquirer.prompt(toInstallQuestions).then((answers) => {
    for (let pack in answers) {
      if (answers[pack]) {
        installOnePackage(pack)
      }
    }
    cb()
  })
}

// Prompts the user before installing missing packages
function installPackages(packages, installed, cb) {
  const toInstallQuestions = packages
		.filter((pack) => !installed.includes(pack))
		.map((pack) => {
			return {
				default: false,
				message: `Install package \x1b[32m${pack}\x1b[0m ?`,
				name: pack,
				type: "confirm",
			}
		})

  installFromQuestions(toInstallQuestions, cb)
}

// Compare packages given in parameters and shows those to install
function displayPackages(packagesToShow, installed, cb) {
  const display = packagesToShow
    .filter((pack) => !installed.includes(pack))

  const message = display.length ?
    ` ⚡️️ Packages to install: ${display.toString()}` : "No package to install"

  output(message)
  cb()
}

// Checks a file before deciding weither to install or display
function checkFile(filePath, knownPackages) {
  const file = fs.readFileSync(filePath, "utf8")
  const packages = extractPackagesToInstall(file)

  if (packages) {
    packages.forEach((pack) => {
      if (!knownPackages.includes(pack)) {
        knownPackages.push(pack)
      }
    })
  }

  return packages
}

function checkDirectoryRecusrsive(path, knownPackages) {
  fs.readdirSync(path).forEach((file) => {
    const filePath = `${path}/${file}`

    if (fs.lstatSync(filePath).isDirectory()
      && file !== "node_modules") {
      return checkDirectoryRecusrsive(`${path}/${file}`, knownPackages)
    } else {
      if (file.match(/\.js/gu) && !file.match(/\.json/gu)) {
        knownPackages = checkFile(filePath, knownPackages)
        return knownPackages
      }
    }
  })

  return knownPackages
}

// Checks all for packages in file(s)
function check(path) {
  let packages = []
  const isDir = fs.lstatSync(path).isDirectory()

  // Passing an empty array to initiate recursivity or search one file
  packages = isDir ? checkDirectoryRecusrsive(path, packages) : checkFile(path, packages)

  return packages
}

function getPackageJsonRecursive(packagePath, cpt) {
  try {
    const file = fs.readFileSync(`${process.cwd()}/${packagePath}`, "utf8")

    return file
  } catch (err) {
    cpt++
    // Loop recursively only 5 times then abort
    if (cpt < 5) {
      return getPackageJsonRecursive(`../${packagePath}`, cpt)
    }

    return null
  }
}

// Tries to find a package.json
function getPackageJson() {
  let cpt = 0
  const packageJson = getPackageJsonRecursive("package.json", cpt)

  return packageJson
}

function getPackagesInstalled(cb) {
  const packageJson = getPackageJson()

  if (!packageJson) {
    cb(new Error("No package.json found"))
  }

  const installedPackagesObject = JSON.parse(packageJson).dependencies || {}
  const installedPackagesArray = Object.keys(installedPackagesObject)

  return installedPackagesArray
}

// Finds all packages to install in a file
function extractPackagesToInstall(fileContent) {
  const packages = fileContent.match(/require\(["'][A-Za-z0-9_-]+['"]\)/giu)

  if (!packages) {
    return []
  }

  // removes "require(" and ")"
  const mappedPackages = packages.map((pack) => pack.substr(9, pack.length - 11))

  return mappedPackages
}

function misuse(cb) {
  cb(`Usage: \n${mp.usage}`);
}