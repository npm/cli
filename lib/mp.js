

function mp(args) {

	const filePath = file ? `${process.cwd()}/${file}` : null
	const isDir = fs.lstatSync(filePath).isDirectory()

	if (program.install && program.check) {
		// eslint-disable-next-line
		console.log('\\033[0;31mStop fooling around please !\\033[0m')
		// eslint-disable-next-line
		console.log('Read the doc ! ---> mp -h')
	} else if (program.install && isDir) {
		const packagesToInstall = checkDirectory(filePath)
		const packagesInstalled = getPackagesInstalled()

		installPackages(packagesToInstall, packagesInstalled)
	} else if (program.install) {
		const packagesToInstall = checkFile(filePath)
		const packagesInstalled = getPackagesInstalled()

		installPackages(packagesToInstall, packagesInstalled)
	} else if (isDir) {
		const packagesToInstall = checkDirectory(filePath)
		const packagesInstalled = getPackagesInstalled()

		displayPackages(packagesToInstall, packagesInstalled)
	} else {
		const packagesToInstall = checkFile(filePath)
		const packagesInstalled = getPackagesInstalled()

		displayPackages(packagesToInstall, packagesInstalled)
	}
}

module.exports = mp

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
const checkFile = (filePath) => {
  const file = fs.readFileSync(filePath, 'utf8')
  const packages = extractPackagesToInstall(file)

  return packages
}

///////////////// CHECK DIRECTORY /////////////////

const checkDirectoryRecusrsive = (path, packages) => {
  fs.readdirSync(path).forEach((file) => {
    const filePath = `${path}/${file}`

    if (file.match(/\.js/gu) && !file.match(/\.json/gu)) {
      let newPackages = checkFile(filePath)

      if (newPackages) {
        newPackages.forEach((pack) => {
          if (!packages.includes(pack)) {
            packages.push(pack)
          }
        })
      }
    } else if (fs.lstatSync(filePath).isDirectory()
      && file !== 'node_modules') {
      return checkDirectoryRecusrsive(`${path}/${file}`, packages)
    }

    return []
  })

  return packages
}

// Checks all files in a directory
const checkDirectory = (path) => {
  // Passing an empty array to initiate recursivity
  const packagesFound = checkDirectoryRecusrsive(path, [])

  return packagesFound
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

export const getPackagesInstalled = () => {
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

////////////// INSTALL PACKAGES ////////////////////

// Prompts the user before installing missing packages
const installPackages = (packages, installed) => {
  const toInstallQuestions = packages
  .filter((pack) => !installed.includes(pack))
  // eslint-disable-next-line
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