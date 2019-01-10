

module.exports = mp

function mp(args, cb) {
	const filePath = file ? `${process.cwd()}/${file}` : null
	const isDir = fs.lstatSync(filePath).isDirectory()
  const packagesInstalled = getPackagesInstalled()
  const packagesToInstall = check(filePath)

  const action = args.shift()

  if (action === 'i' || action === "install") {
    installPackages(packagesToInstall, packagesInstalled)
  } else if (action === 'c' || action === "check") {
    displayPackages(packagesToInstall, packagesInstalled)
  } else {
    // unknown action // test if file
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
const displayPackages = (packagesToShow, installed) => {
  const display = packagesToShow
    .filter((pack) => !installed.includes(pack))

  console.log('Packages to install: ', display)
}

/////////////////// CHECK FILE ///////////////////

// Checks a file before deciding weither to install or display
const checkFile = (filePath, installedPackages = []) => {
  const file = fs.readFileSync(filePath, 'utf8')
  const packages = extractPackagesToInstall(file)

  if (packages) {
    packages.forEach((pack) => {
      if (!installedPackages.includes(pack)) {
        installedPackages.push(pack)
      }
    })
  }

  return packages
}

///////////////// CHECK DIRECTORY /////////////////

const checkDirectoryRecusrsive = (path, packages) => {
  fs.readdirSync(path).forEach((file) => {
    const filePath = `${path}/${file}`

    if (fs.lstatSync(filePath).isDirectory()
      && file !== 'node_modules') {
      return checkDirectoryRecusrsive(`${path}/${file}`, packages)
    } else {
      if (file.match(/\.js/gu) && !file.match(/\.json/gu)) {
        packages = checkFile(filePath, packages)
        return packages
      }
    }
  })

  return packages
}

// Checks all files in a directory
const check = (path, isDir = false) => {
  let packages = []

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

const getPackagesInstalled = () => {
  const packageJson = getPackageJson()

  if (!packageJson) {
    throw new Error('No package.json found')
  }

  const installedPackagesObject = JSON.parse(packageJson).dependencies || { }
  const installedPackagesArray = Object.keys(installedPackagesObject)

  return installedPackagesArray
}

////////////// EXTRACT PACKAGES TO INSTALL //////////////

// Finds all packages to install in a file
const extractPackagesToInstall = (fileContent) => {
  const packages = fileContent.match(/require\(["'][A-Za-z0-9_-]+['"]\)/giu)

  if (!packages) {
    console.log('No packages to install')

    return []
  }

  const mappedPackages = packages.map((pack) => pack.substr(9, pack.length - 11))

  return mappedPackages
}