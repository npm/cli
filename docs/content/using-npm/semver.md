# Bifurcar un repositorio

Bifurque un repositorio sobre GitHub para proponer cambios, colaborar en proyectos y administrar su propia copia del código base.

## Acerca de los forks

Bifurcar un repositorio te permite proponer cambios a un proyecto sin afectar al repositorio original. Consulte [Acerca de los forks](/es/pull-requests/get-started/about-forks).

## Prerequisites

Si aún no lo ha hecho, configure Git y la autenticación con GitHub.com desde Git. Consulte [Configuración de Git](/es/get-started/git-basics/set-up-git).

## Clonar un repositorio

<div class="ghd-tool webui">

Puedes ramificar un proyecto para proponer cambios en el repositorio ascendente. En este caso, es una buena práctica sincronizar regularmente tu fork con el repositorio original. Para hacerlo, deberás usar Git en la línea de comando. Puede practicar la configuración del repositorio ascendente con el mismo repositorio [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife) que acaba de bifurcar.

1. En GitHub, vaya al repositorio [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife).
2. En la esquina superior derecha de la página, haga clic en **Fork** (Bifurcar).

   ![Captura de pantalla de la página principal del repositorio. Un botón, etiquetado con un icono de fork y "Fork 59.3k", está delineado en naranja oscuro.](/assets/images/help/repository/fork-button.png)
3. En "Propietario", selecciona el menú desplegable y haz clic sobre un propietario del repositorio bifurcado.
4. De forma predeterminada, las bifurcaciones tienen el mismo nombre que sus repositorios ascendentes. Opcionalmente, en el campo "Nombre del repositorio", escriba otro nombre para distinguir tu bifurcación.
5. Opcionalmente, en el campo de descripción, escribe una descripción de tu bifurcación.
6. Opcionalmente, selecciona **Copiar solo la rama DEFAULT**.

   En muchos escenarios de bifurcación, como los de contribución a proyectos de código abierto, solo tienes que copiar la rama predeterminada. Si no selecciona esta opción, todas las ramas se copiarán en la nueva bifurcación.
7. Haz clic en **Crear bifurcación**.

> \[!NOTE]
> Si quieres copiar otras ramas del repositorio ascendente, puedes hacerlo desde la página **Branches**. Consulte [Administración de ramas dentro del repositorio](/es/pull-requests/how-tos/commit-changes/managing-branches-within-your-repository).

</div>

<div class="ghd-tool cli">

> \[!NOTE]
> Para más información sobre GitHub CLI, consulta [Acerca de GitHub CLI](/es/github-cli/github-cli/about-github-cli).

Para crear una bifurcación de un repositorio, use el subcomando `gh repo fork`.

```shell
gh repo fork REPOSITORY
```

Para crear la bifurcación en una organización, use la marca `--org`.

```shell
gh repo fork REPOSITORY --org "octo-org"
```

</div>

<div class="ghd-tool desktop">

Puede bifurcar un repositorio en GitHub.com o en GitHub Desktop. Para obtener información sobre cómo crear una bifurcación en GitHub.com, consulte [la versión de este artículo para el navegador web](/es/pull-requests/how-tos/work-with-forks/fork-a-repo?tool=webui).

En GitHub Desktop, al clonar un repositorio al que no tienes acceso de escritura e insertar después un cambio en el repositorio, se creará una bifurcación automáticamente.

1. En el menú **File**, haga clic en **Clone Repository**.

   <div class="ghd-tool mac">

   ![Captura de pantalla de la barra de menús en un equipo Mac. El menú desplegable "Archivo" se expande y la opción "Clonar repositorio" está resaltada con un contorno naranja.](/assets/images/help/desktop/clone-file-menu-mac.png)

   </div>

   <div class="ghd-tool windows">

   ![Captura de pantalla de la barra de menús "Escritorio de GitHub" en un equipo Windows. El menú desplegable "Archivo" se expande y la opción "Clonar repositorio" está resaltada en naranja.](/assets/images/help/desktop/clone-file-menu-windows.png)

   </div>

2. Haz clic en la pestaña que corresponde a la ubicación del repositorio que deseas clonar. En este ejemplo, hacemos clic en la pestaña URL.

   ![Captura de pantalla de la pestaña "URL" de la ventana "Clone a repository". Las pestañas "GitHub.com", "GitHub Enterprise" y "URL" se resaltan en color naranja oscuro.](/assets/images/help/desktop/choose-repository-location-url-tab-windows.png)

3. Escribe la dirección URL o la ruta de acceso del repositorio que quieres clonar.

   ![Captura de pantalla de la pestaña "URL" de la ventana "Clone a repository". La entrada que contiene "octocat/Spoon-Knife" está resaltada con un contorno naranja.](/assets/images/help/desktop/clone-a-repository-url-tab-name-input.png)

4. Para seleccionar el directorio local en el que quieres clonar el repositorio, junto al campo "Ruta de acceso local", haz clic en **Elegir...** y ve al directorio.

   ![Captura de pantalla de la pestaña "URL" de la ventana "Clone a repository". Un botón, con la etiqueta "Elegir", está resaltado con un contorno naranja.](/assets/images/help/desktop/clone-choose-button-url-windows.png)

5. En la parte inferior de la ventana "Clonar un repositorio", haz clic en **Clonar**.

6. Para crear una bifurcación, inserta un cambio en el repositorio. Por ejemplo, crea una rama y publícala. Aparecerá un mensaje en el que se te preguntará si quieres bifurcar el repositorio.

   ![Captura de pantalla de la ventana "Create a fork prompt". Botón con la etiqueta "Fork this repository" (Bifurcar este repositorio) resaltado con un contorno naranja.](/assets/images/help/desktop/create-fork-button-windows.png)

7. Lee la información en la ventana "¿Cómo planeas usar esta bifurcación?" .
   * Si planea usar esta bifurcación para contribuir con el repositorio ascendente original, haga clic en **To contribute to the parent project** (Para contribuir con el proyecto).
   * Si planea usar esta bifurcación para un proyecto que no esta conectado al elemento ascendente, haga clic en **For my own purposes** (Para mis propios propósitos).

8. Haga clic en **Continuar**.

</div>

<div class="ghd-tool webui">

## Clonar tu repositorio bifurcado

Ahora tienes un fork del repositorio Spoon-Knife, pero no tienes los archivos de ese repositorio en tu ordenador.

1. En GitHub, vaya a la **bifurcación** del repositorio de Spoon-Knife.

2. Encima de la lista de archivos, haz clic en **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-code" aria-label="code" role="img"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path></svg> Code**.

   ![Captura de pantalla de la lista de archivos en la página de aterrizaje de un repositorio. El botón "Código" está resaltado con un contorno naranja oscuro.](/assets/images/help/repository/code-button.png)

3. Copia la dirección URL del repositorio.

   * Para clonar el repositorio mediante HTTPS, en "HTTPS", haga clic en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copiar al portapapeles" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.
   * Para clonar el repositorio mediante una clave SSH, incluido un certificado emitido por la entidad de certificación SSH de la organización, haz clic en **SSH** y luego en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copy to clipboard" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.
   * Para clonar un repositorio mediante GitHub CLI, haz clic en **GitHub CLI** y, después, en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copy to clipboard" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.

     ![Captura de pantalla del menú desplegable "Código". A la derecha de la dirección URL HTTPS del repositorio, hay un icono de copia resaltado en naranja oscuro.](/assets/images/help/repository/https-url-clone-cli.png)

4. Abre Terminal o Git Bash.

5. Cambia el directorio de trabajo actual a la ubicación en donde quieres clonar el directorio.

6. Escriba `git clone`y pegue la dirección URL que copió anteriormente. Tendrá este aspecto, con el GitHub nombre de usuario en lugar de `YOUR-USERNAME`:

   ```shell
   git clone https://github.com/YOUR-USERNAME/Spoon-Knife
   ```

7. Presione **ENTRAR**. Git crea el clon local.

   ```shell
   $ git clone https://github.com/YOUR-USERNAME/Spoon-Knife
   > Cloning into `Spoon-Knife`...
   > remote: Counting objects: 10, done.
   > remote: Compressing objects: 100% (8/8), done.
   > remote: Total 10 (delta 1), reused 10 (delta 1)
   > Unpacking objects: 100% (10/10), done.
   ```

</div>

<div class="ghd-tool cli">

## Clonar tu repositorio bifurcado

Ahora tienes un fork del repositorio Spoon-Knife, pero no tienes los archivos de ese repositorio en tu ordenador.

> \[!NOTE]
> Para más información sobre GitHub CLI, consulta [Acerca de GitHub CLI](/es/github-cli/github-cli/about-github-cli).

Para clonar tu bifurcación, usa la opción `--clone`.

```shell
gh repo fork REPOSITORY --clone=true
```

</div>

## Configurar Git para sincronizar tu bifurcación con el repositorio original

Cuando creas una bifurcación de un proyecto para proponer cambios en el repositorio original, puedes configurar Git para incorporar cambios desde el repositorio original al clon local de tu bifurcación.

<div class="ghd-tool webui">

1. En GitHub, vaya al repositorio [octocat/Spoon-Knife](https://github.com/octocat/Spoon-Knife).

2. Encima de la lista de archivos, haz clic en **<svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-code" aria-label="code" role="img"><path d="m11.28 3.22 4.25 4.25a.75.75 0 0 1 0 1.06l-4.25 4.25a.749.749 0 0 1-1.275-.326.749.749 0 0 1 .215-.734L13.94 8l-3.72-3.72a.749.749 0 0 1 .326-1.275.749.749 0 0 1 .734.215Zm-6.56 0a.751.751 0 0 1 1.042.018.751.751 0 0 1 .018 1.042L2.06 8l3.72 3.72a.749.749 0 0 1-.326 1.275.749.749 0 0 1-.734-.215L.47 8.53a.75.75 0 0 1 0-1.06Z"></path></svg> Code**.

   ![Captura de pantalla de la lista de archivos en la página de aterrizaje de un repositorio. El botón "Código" está resaltado con un contorno naranja oscuro.](/assets/images/help/repository/code-button.png)

3. Copia la dirección URL del repositorio.

   * Para clonar el repositorio mediante HTTPS, en "HTTPS", haga clic en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copiar al portapapeles" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.
   * Para clonar el repositorio mediante una clave SSH, incluido un certificado emitido por la entidad de certificación SSH de la organización, haz clic en **SSH** y luego en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copy to clipboard" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.
   * Para clonar un repositorio mediante GitHub CLI, haz clic en **GitHub CLI** y, después, en <svg version="1.1" width="16" height="16" viewBox="0 0 16 16" class="octicon octicon-copy" aria-label="Copy to clipboard" role="img"><path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path><path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path></svg>.

     ![Captura de pantalla del menú desplegable "Código". A la derecha de la dirección URL HTTPS del repositorio, hay un icono de copia resaltado en naranja oscuro.](/assets/images/help/repository/https-url-clone-cli.png)

4. Abre Terminal o Git Bash.

5. Cambie al directorio del fork que clonó.
   * Para ir al directorio principal, escriba solo `cd` sin ningún otro texto.
   * Para generar una lista de los archivos y carpetas en su directorio actual, escriba `ls`.
   * Para ir a uno de los directorios mostrados, escriba `cd YOUR-LISTED-DIRECTORY`.
   * Para subir un directorio, escriba `cd ..`.

6. Escriba `git remote -v` y presione **Entrar**. Verás el repositorio remoto configurado actualmente para tu fork.

   ```shell
   $ git remote -v
   > origin  https://github.com/YOUR-USERNAME/YOUR-FORK.git (fetch)
   > origin  https://github.com/YOUR-USERNAME/YOUR-FORK.git (push)
   ```

7. Escriba `git remote add upstream`y pegue la dirección URL que copió en el paso 3 y presione **Entrar**. Tendrá este aspecto:

   ```shell
   git remote add upstream https://github.com/ORIGINAL-OWNER/Spoon-Knife.git
   ```

8. Para comprobar el nuevo repositorio ascendente que especificó para la bifurcación, vuelva a escribir `git remote -v` . Deberías ver la URL de tu fork como `origin` y la URL del repositorio upstream como `upstream`.

   ```shell
   $ git remote -v
   > origin    https://github.com/YOUR-USERNAME/YOUR-FORK.git (fetch)
   > origin    https://github.com/YOUR-USERNAME/YOUR-FORK.git (push)
   > upstream  https://github.com/ORIGINAL-OWNER/ORIGINAL-REPOSITORY.git (fetch)
   > upstream  https://github.com/ORIGINAL-OWNER/ORIGINAL-REPOSITORY.git (push)
   ```

Ahora puede mantener su fork sincronizado con el repositorio original con unos pocos comandos de Git. Consulte [Sincronizar una bifurcación](/es/pull-requests/how-tos/work-with-forks/syncing-a-fork).

</div>

<div class="ghd-tool cli">

> \[!NOTE]
> Para más información sobre GitHub CLI, consulta [Acerca de GitHub CLI](/es/github-cli/github-cli/about-github-cli).

A fin de configurar un repositorio remoto para el repositorio bifurcado, utilice la marca `--remote`.

```shell
gh repo fork REPOSITORY --remote=true
```

Para especificar el nombre del repositorio remoto, use la marca `--remote-name`.

```shell
gh repo fork REPOSITORY --remote-name "main-remote-repo"
```

</div>

### Edición de una bifurcación

Puedes realizar cualquier cambio a una bifurcación, incluyendo:

* **Crear ramas**: las [*ramas*](/es/pull-requests/how-tos/commit-changes/managing-branches-within-your-repository) permiten compilar características o probar ideas sin poner en riesgo el proyecto principal.
* **Abrir solicitudes de incorporación de cambios:** Si desea volver a contribuir al repositorio ascendente, puede enviar una solicitud de incorporación de cambios para pedir al autor original que extraiga la bifurcación en su repositorio. Consulte [Crear una solicitud de extracción desde una bifurcación](/es/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork).

## Busca otro repositorio para hacer un fork

Haz un fork de un repositorio para comenzar a contribuir a un proyecto.
Puedes bifurcar cualquier repositorio público:

* A tu cuenta personal
* A una organización en la que tengas permiso para crear repositorios

Si tiene acceso a un repositorio privado y el propietario permite la bifurcación, puedes bifurcar el repositorio:

* A tu cuenta personal
* Para una organización en GitHub Team donde tienes permiso para crear repositorios

No puedes bifurcar un repositorio privado a una organización que use GitHub Free. Para más información sobre GitHub Team y GitHub Free, consulta [planes de GitHub](/es/get-started/learning-about-github/githubs-plans).

Para obtener más información sobre cuándo puede bifurcar un repositorio, consulte [Horquillas](/es/pull-requests/reference/forks).

Puedes explorar [Explore GitHub](https://github.com/explore) para encontrar proyectos y empezar a contribuir a repositorios de código abierto. Consulte [Búsqueda de formas de contribuir a la open source en GitHub](/es/get-started/exploring-projects-on-github/finding-ways-to-contribute-to-open-source-on-github).

## Pasos siguientes

Ahora ya has bifurcado un repositorio, has practicado la clonación de tu bifurcación y has configurado un repositorio ascendente.

* Para obtener más información sobre el uso de Git en la línea de comandos para clonar y sincronizar los cambios, consulte [Configuración de Git](/es/get-started/git-basics/set-up-git).

* También puede crear un repositorio para almacenar los proyectos y compartir el código en GitHub. La creación de un repositorio para el proyecto permite almacenar código en GitHub. Esto proporciona una copia de seguridad del trabajo que puedes elegir compartir con otros desarrolladores. Para más información, consulta [Inicio rápido para repositorios](/es/repositories/creating-and-managing-repositories/quickstart-for-repositories).

* Cada repositorio de GitHub es propiedad de una persona o una organización. Puede interactuar con las personas, los repositorios y las organizaciones mediante la conexión y el seguimiento de ellos en GitHub. Para más información, consulta [Detección de proyectos en GitHub](/es/get-started/exploring-projects-on-github/discovering-projects-on-github).

* GitHub tiene una excelente comunidad de soporte técnico en la que puede pedir ayuda y hablar con usuarios de todo el mundo. Únete a la conversación en [GitHub Community](https://github.com/orgs/community/discussions).Prints valid versions sorted by SemVer precedence

Options:
-r --range <range>
        Print versions that match the specified range.

-i --increment [<level>]
        Increment a version by the specified level.  Level can
        be one of: major, minor, patch, premajor, preminor,
        prepatch, or prerelease.  Default level is 'patch'.
        Only one version may be specified.

--preid <identifier>
        Identifier to be used to prefix premajor, preminor,
        prepatch or prerelease version increments.

-l --loose
        Interpret versions and ranges loosely

-p --include-prerelease
        Always include prerelease versions in range matching

-c --coerce
        Coerce a string into SemVer if possible
        (does not imply --loose)

Program exits successfully if any valid version satisfies
all supplied ranges, and prints all satisfying versions.

If no satisfying versions are found, then exits failure.

Versions are printed in ascending order, so supplying
multiple versions to the utility will just sort them.
```

## Versions

A "version" is described by the `v2.0.0` specification found at
<https://semver.org/>.

A leading `"="` or `"v"` character is stripped off and ignored.

## Ranges

A `version range` is a set of `comparators` which specify versions
that satisfy the range.

A `comparator` is composed of an `operator` and a `version`.  The set
of primitive `operators` is:

* `<` Less than
* `<=` Less than or equal to
* `>` Greater than
* `>=` Greater than or equal to
* `=` Equal.  If no operator is specified, then equality is assumed,
  so this operator is optional, but MAY be included.

For example, the comparator `>=1.2.7` would match the versions
`1.2.7`, `1.2.8`, `2.5.3`, and `1.3.9`, but not the versions `1.2.6`
or `1.1.0`.

Comparators can be joined by whitespace to form a `comparator set`,
which is satisfied by the **intersection** of all of the comparators
it includes.

A range is composed of one or more comparator sets, joined by `||`.  A
version matches a range if and only if every comparator in at least
one of the `||`-separated comparator sets is satisfied by the version.

For example, the range `>=1.2.7 <1.3.0` would match the versions
`1.2.7`, `1.2.8`, and `1.2.99`, but not the versions `1.2.6`, `1.3.0`,
or `1.1.0`.

The range `1.2.7 || >=1.2.9 <2.0.0` would match the versions `1.2.7`,
`1.2.9`, and `1.4.6`, but not the versions `1.2.8` or `2.0.0`.

### Prerelease Tags

If a version has a prerelease tag (for example, `1.2.3-alpha.3`) then
it will only be allowed to satisfy comparator sets if at least one
comparator with the same `[major, minor, patch]` tuple also has a
prerelease tag.

For example, the range `>1.2.3-alpha.3` would be allowed to match the
version `1.2.3-alpha.7`, but it would *not* be satisfied by
`3.4.5-alpha.9`, even though `3.4.5-alpha.9` is technically "greater
than" `1.2.3-alpha.3` according to the SemVer sort rules.  The version
range only accepts prerelease tags on the `1.2.3` version.  The
version `3.4.5` *would* satisfy the range, because it does not have a
prerelease flag, and `3.4.5` is greater than `1.2.3-alpha.7`.

The purpose for this behavior is twofold.  First, prerelease versions
frequently are updated very quickly, and contain many breaking changes
that are (by the author's design) not yet fit for public consumption.
Therefore, by default, they are excluded from range matching
semantics.

Second, a user who has opted into using a prerelease version has
clearly indicated the intent to use *that specific* set of
alpha/beta/rc versions.  By including a prerelease tag in the range,
the user is indicating that they are aware of the risk.  However, it
is still not appropriate to assume that they have opted into taking a
similar risk on the *next* set of prerelease versions.

Note that this behavior can be suppressed (treating all prerelease
versions as if they were normal versions, for the purpose of range
matching) by setting the `includePrerelease` flag on the options
object to any
[functions](https://github.com/npm/node-semver#functions) that do
range matching.

#### Prerelease Identifiers

The method `.inc` takes an additional `identifier` string argument that
will append the value of the string as a prerelease identifier:

```javascript
semver.inc('1.2.3', 'prerelease', 'beta')
// '1.2.4-beta.0'
```

command-line example:

```bash
$ semver 1.2.3 -i prerelease --preid beta
1.2.4-beta.0
```

Which then can be used to increment further:

```bash
$ semver 1.2.4-beta.0 -i prerelease
1.2.4-beta.1
```

### Advanced Range Syntax

Advanced range syntax desugars to primitive comparators in
deterministic ways.

Advanced ranges may be combined in the same way as primitive
comparators using white space or `||`.

#### Hyphen Ranges `X.Y.Z - A.B.C`

Specifies an inclusive set.

* `1.2.3 - 2.3.4` := `>=1.2.3 <=2.3.4`

If a partial version is provided as the first version in the inclusive
range, then the missing pieces are replaced with zeroes.

* `1.2 - 2.3.4` := `>=1.2.0 <=2.3.4`

If a partial version is provided as the second version in the
inclusive range, then all versions that start with the supplied parts
of the tuple are accepted, but nothing that would be greater than the
provided tuple parts.

* `1.2.3 - 2.3` := `>=1.2.3 <2.4.0`
* `1.2.3 - 2` := `>=1.2.3 <3.0.0`

#### X-Ranges `1.2.x` `1.X` `1.2.*` `*`

Any of `X`, `x`, or `*` may be used to "stand in" for one of the
numeric values in the `[major, minor, patch]` tuple.

* `*` := `>=0.0.0` (Any version satisfies)
* `1.x` := `>=1.0.0 <2.0.0` (Matching major version)
* `1.2.x` := `>=1.2.0 <1.3.0` (Matching major and minor versions)

A partial version range is treated as an X-Range, so the special
character is in fact optional.

* `""` (empty string) := `*` := `>=0.0.0`
* `1` := `1.x.x` := `>=1.0.0 <2.0.0`
* `1.2` := `1.2.x` := `>=1.2.0 <1.3.0`

#### Tilde Ranges `~1.2.3` `~1.2` `~1`

Allows patch-level changes if a minor version is specified on the
comparator.  Allows minor-level changes if not.

* `~1.2.3` := `>=1.2.3 <1.(2+1).0` := `>=1.2.3 <1.3.0`
* `~1.2` := `>=1.2.0 <1.(2+1).0` := `>=1.2.0 <1.3.0` (Same as `1.2.x`)
* `~1` := `>=1.0.0 <(1+1).0.0` := `>=1.0.0 <2.0.0` (Same as `1.x`)
* `~0.2.3` := `>=0.2.3 <0.(2+1).0` := `>=0.2.3 <0.3.0`
* `~0.2` := `>=0.2.0 <0.(2+1).0` := `>=0.2.0 <0.3.0` (Same as `0.2.x`)
* `~0` := `>=0.0.0 <(0+1).0.0` := `>=0.0.0 <1.0.0` (Same as `0.x`)
* `~1.2.3-beta.2` := `>=1.2.3-beta.2 <1.3.0` Note that prereleases in
  the `1.2.3` version will be allowed, if they are greater than or
  equal to `beta.2`.  So, `1.2.3-beta.4` would be allowed, but
  `1.2.4-beta.2` would not, because it is a prerelease of a
  different `[major, minor, patch]` tuple.

#### Caret Ranges `^1.2.3` `^0.2.5` `^0.0.4`

Allows changes that do not modify the left-most non-zero digit in the
`[major, minor, patch]` tuple.  In other words, this allows patch and
minor updates for versions `1.0.0` and above, patch updates for
versions `0.X >=0.1.0`, and *no* updates for versions `0.0.X`.

Many authors treat a `0.x` version as if the `x` were the major
"breaking-change" indicator.

Caret ranges are ideal when an author may make breaking changes
between `0.2.4` and `0.3.0` releases, which is a common practice.
However, it presumes that there will *not* be breaking changes between
`0.2.4` and `0.2.5`.  It allows for changes that are presumed to be
additive (but non-breaking), according to commonly observed practices.

* `^1.2.3` := `>=1.2.3 <2.0.0`
* `^0.2.3` := `>=0.2.3 <0.3.0`
* `^0.0.3` := `>=0.0.3 <0.0.4`
* `^1.2.3-beta.2` := `>=1.2.3-beta.2 <2.0.0` Note that prereleases in
  the `1.2.3` version will be allowed, if they are greater than or
  equal to `beta.2`.  So, `1.2.3-beta.4` would be allowed, but
  `1.2.4-beta.2` would not, because it is a prerelease of a
  different `[major, minor, patch]` tuple.
* `^0.0.3-beta` := `>=0.0.3-beta <0.0.4`  Note that prereleases in the
  `0.0.3` version *only* will be allowed, if they are greater than or
  equal to `beta`.  So, `0.0.3-pr.2` would be allowed.

When parsing caret ranges, a missing `patch` value desugars to the
number `0`, but will allow flexibility within that value, even if the
major and minor versions are both `0`.

* `^1.2.x` := `>=1.2.0 <2.0.0`
* `^0.0.x` := `>=0.0.0 <0.1.0`
* `^0.0` := `>=0.0.0 <0.1.0`

A missing `minor` and `patch` values will desugar to zero, but also
allow flexibility within those values, even if the major version is
zero.

* `^1.x` := `>=1.0.0 <2.0.0`
* `^0.x` := `>=0.0.0 <1.0.0`

### Range Grammar

Putting all this together, here is a Backus-Naur grammar for ranges,
for the benefit of parser authors:

```bnf
range-set  ::= range ( logical-or range ) *
logical-or ::= ( ' ' ) * '||' ( ' ' ) *
range      ::= hyphen | simple ( ' ' simple ) * | ''
hyphen     ::= partial ' - ' partial
simple     ::= primitive | partial | tilde | caret
primitive  ::= ( '<' | '>' | '>=' | '<=' | '=' ) partial
partial    ::= xr ( '.' xr ( '.' xr qualifier ? )? )?
xr         ::= 'x' | 'X' | '*' | nr
nr         ::= '0' | ['1'-'9'] ( ['0'-'9'] ) *
tilde      ::= '~' partial
caret      ::= '^' partial
qualifier  ::= ( '-' pre )? ( '+' build )?
pre        ::= parts
build      ::= parts
parts      ::= part ( '.' part ) *
part       ::= nr | [-0-9A-Za-z]+
```

## Functions

All methods and classes take a final `options` object argument.  All
options in this object are `false` by default.  The options supported
are:

- `loose`  Be more forgiving about not-quite-valid semver strings.
  (Any resulting output will always be 100% strict compliant, of
  course.)  For backwards compatibility reasons, if the `options`
  argument is a boolean value instead of an object, it is interpreted
  to be the `loose` param.
- `includePrerelease`  Set to suppress the [default
  behavior](https://github.com/npm/node-semver#prerelease-tags) of
  excluding prerelease tagged versions from ranges unless they are
  explicitly opted into.

Strict-mode Comparators and Ranges will be strict about the SemVer
strings that they parse.

* `valid(v)`: Return the parsed version, or null if it's not valid.
* `inc(v, release)`: Return the version incremented by the release
  type (`major`,   `premajor`, `minor`, `preminor`, `patch`,
  `prepatch`, or `prerelease`), or null if it's not valid
  * `premajor` in one call will bump the version up to the next major
    version and down to a prerelease of that major version.
    `preminor`, and `prepatch` work the same way.
  * If called from a non-prerelease version, the `prerelease` will work the
    same as `prepatch`. It increments the patch version, then makes a
    prerelease. If the input version is already a prerelease it simply
    increments it.
* `prerelease(v)`: Returns an array of prerelease components, or null
  if none exist. Example: `prerelease('1.2.3-alpha.1') -> ['alpha', 1]`
* `major(v)`: Return the major version number.
* `minor(v)`: Return the minor version number.
* `patch(v)`: Return the patch version number.
* `intersects(r1, r2, loose)`: Return true if the two supplied ranges
  or comparators intersect.
* `parse(v)`: Attempt to parse a string as a semantic version, returning either
  a `SemVer` object or `null`.

### Comparison

* `gt(v1, v2)`: `v1 > v2`
* `gte(v1, v2)`: `v1 >= v2`
* `lt(v1, v2)`: `v1 < v2`
* `lte(v1, v2)`: `v1 <= v2`
* `eq(v1, v2)`: `v1 == v2` This is true if they're logically equivalent,
  even if they're not the exact same string.  You already know how to
  compare strings.
* `neq(v1, v2)`: `v1 != v2` The opposite of `eq`.
* `cmp(v1, comparator, v2)`: Pass in a comparison string, and it'll call
  the corresponding function above.  `"==="` and `"!=="` do simple
  string comparison, but are included for completeness.  Throws if an
  invalid comparison string is provided.
* `compare(v1, v2)`: Return `0` if `v1 == v2`, or `1` if `v1` is greater, or `-1` if
  `v2` is greater.  Sorts in ascending order if passed to `Array.sort()`.
* `rcompare(v1, v2)`: The reverse of compare.  Sorts an array of versions
  in descending order when passed to `Array.sort()`.
* `diff(v1, v2)`: Returns difference between two versions by the release type
  (`major`, `premajor`, `minor`, `preminor`, `patch`, `prepatch`, or `prerelease`),
  or null if the versions are the same.

### Comparators

* `intersects(comparator)`: Return true if the comparators intersect

### Ranges

* `validRange(range)`: Return the valid range or null if it's not valid
* `satisfies(version, range)`: Return true if the version satisfies the
  range.
* `maxSatisfying(versions, range)`: Return the highest version in the list
  that satisfies the range, or `null` if none of them do.
* `minSatisfying(versions, range)`: Return the lowest version in the list
  that satisfies the range, or `null` if none of them do.
* `minVersion(range)`: Return the lowest version that can possibly match
  the given range.
* `gtr(version, range)`: Return `true` if version is greater than all the
  versions possible in the range.
* `ltr(version, range)`: Return `true` if version is less than all the
  versions possible in the range.
* `outside(version, range, hilo)`: Return true if the version is outside
  the bounds of the range in either the high or low direction.  The
  `hilo` argument must be either the string `'>'` or `'<'`.  (This is
  the function called by `gtr` and `ltr`.)
* `intersects(range)`: Return true if any of the ranges comparators intersect

Note that, since ranges may be non-contiguous, a version might not be
greater than a range, less than a range, *or* satisfy a range!  For
example, the range `1.2 <1.2.9 || >2.0.0` would have a hole from `1.2.9`
until `2.0.0`, so the version `1.2.10` would not be greater than the
range (because `2.0.1` satisfies, which is higher), nor less than the
range (since `1.2.8` satisfies, which is lower), and it also does not
satisfy the range.

If you want to know if a version satisfies or does not satisfy a
range, use the `satisfies(version, range)` function.

### Coercion

* `coerce(version)`: Coerces a string to semver if possible

This aims to provide a very forgiving translation of a non-semver string to
semver. It looks for the first digit in a string, and consumes all
remaining characters which satisfy at least a partial semver (e.g., `1`,
`1.2`, `1.2.3`) up to the max permitted length (256 characters).  Longer
versions are simply truncated (`4.6.3.9.2-alpha2` becomes `4.6.3`).  All
surrounding text is simply ignored (`v3.4 replaces v3.3.1` becomes
`3.4.0`).  Only text which lacks digits will fail coercion (`version one`
is not valid).  The maximum  length for any semver component considered for
coercion is 16 characters; longer components will be ignored
(`10000000000000000.4.7.4` becomes `4.7.4`).  The maximum value for any
semver component is `Number.MAX_SAFE_INTEGER || (2**53 - 1)`; higher value
components are invalid (`9999999999999999.4.7.4` is likely invalid).
