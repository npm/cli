

module.exports = mp

var usage = require('./utils/usage')
var output = require('./utils/output.js')
var fs = require('graceful-fs')

// @TODO: Add usage & missing requires

function mp(args, cb) {
  const firstParam = args.shift()
  const secondParam = args.shift()
  const packagesInstalled = getPackagesInstalled(cb)

  if ((firstParam === 'i' || firstParam === "install") && fs.existsSync(`${process.cwd()}/${secondParam}`)) {
    const filePath = `${process.cwd()}/${secondParam}`
    const packagesToInstall = check(filePath) // @TODO: uncomment it and make it work
    // installPackages(packagesToInstall, packagesInstalled)
  } else if (firstParam === 'c' || firstParam === "check"  && fs.existsSync(`${process.cwd()}/${secondParam}`)) {
    const filePath = `${process.cwd()}/${secondParam}`
    const packagesToInstall = check(filePath)

    displayPackages(packagesToInstall, packagesInstalled, cb)
  } else if (fs.existsSync(`${process.cwd()}/${firstParam}`)) {
    const filePath = `${process.cwd()}/${firstParam}`
    output("3 - "+filePath)
    cb(null, filePath) // @TODO: implement it
    // const packagesToInstall = check(filePath)
    // installPackages(packagesToInstall, packagesInstalled)
  } else { // @TODO: test it
    misuse(cb)
  }
}

////////////// INSTALL FROM QUESTIONS ///////////////////

// Installs a single package
function installOnePackage(uniquePackage) {
  shell.exec(`npm install --save ${uniquePackage}`)
}

function installFromQuestions(toInstallQuestions) {
  inquirer.prompt(toInstallQuestions).then((answers) => {
    for (let pack in answers) {
      if (answers[pack]) {
        installOnePackage(pack)
      }
    }
  })
}

///////////////// INSTALL PACKAGES //////////////

// Prompts the user before installing missing packages
function installPackages(packages, installed) {
  const toInstallQuestions = packages
		.filter((pack) => !installed.includes(pack))
		.map((pack) => {
			return {
				default: false,
				message: `Install package \x1b[32m${pack}\x1b[0m ?`,
				name: pack,
				type: 'confirm',
			}
		})

  installFromQuestions(toInstallQuestions)
}

//////////////////// DISPLAY PACKAGES /////////////

// Displays packages given in parameters
const displayPackages = (packagesToShow, installed, cb) => {
  const display = packagesToShow
    .filter((pack) => !installed.includes(pack))

  // @TODO: Add emoji
  const message = display.length ?
    `Packages to install: ${display.toString()}` : "No package to install" 
  
  output(message)
  cb()
}

/////////////////// CHECK FILE ///////////////////

// Checks a file before deciding weither to install or display
const checkFile = (filePath, knownPackages) => {
  const file = fs.readFileSync(filePath, 'utf8')
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

///////////////// CHECK DIRECTORY /////////////////

const checkDirectoryRecusrsive = (path, knownPackages) => {
  fs.readdirSync(path).forEach((file) => {
    const filePath = `${path}/${file}`

    if (fs.lstatSync(filePath).isDirectory()
      && file !== 'node_modules') {
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

// Checks all files in a directory
const check = (path) => {
  let packages = []
  const isDir = fs.lstatSync(path).isDirectory()

  // Passing an empty array to initiate recursivity
  packages = isDir ? checkDirectoryRecusrsive(path, packages) : checkFile(path, packages)

  return packages
}

/////////////// GET PACKAGE JSON ///////////////

const getPackageJsonRecursive = (packagePath, cpt) => {
  try {
    const file = fs.readFileSync(`${process.cwd()}/${packagePath}`, 'utf8')

    return file
  } catch (err) {
    cpt++
    if (cpt < 5) {
      return getPackageJsonRecursive(`../${packagePath}`, cpt)
    }

    return null
  }
}

// Does everything it can to find a package.json, even in parent dirs
const getPackageJson = () => {
  let cpt = 0
  const packageJson = getPackageJsonRecursive('package.json', cpt)

  return packageJson
}

const getPackagesInstalled = (cb) => {
  const packageJson = getPackageJson()

  if (!packageJson) {
    cb(new Error('No package.json found'))
  }

  const installedPackagesObject = JSON.parse(packageJson).dependencies || {}
  const installedPackagesArray = Object.keys(installedPackagesObject)

  return installedPackagesArray
}

////////////// EXTRACT PACKAGES TO INSTALL //////////////

// Finds all packages to install in a file
const extractPackagesToInstall = (fileContent) => {
  const packages = fileContent.match(/require\(["'][A-Za-z0-9_-]+['"]\)/giu)

  if (!packages) {
    return []
  }

  // removes "require(" and ")"
  const mappedPackages = packages.map((pack) => pack.substr(9, pack.length - 11))

  return mappedPackages
}

/////////////////// APP MISUSE /////////////////////////

function misuse (cb) {
  cb('Usage: \n' + mp.usage);
}