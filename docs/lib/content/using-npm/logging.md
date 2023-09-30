---
title: Logging
section: 7
description: Why, What & How We Log
---

### Description

The `npm` CLI has various mechanisms for showing different levels of information back to end-users for certain commands, configurations & environments.

### Setting Log File Location

All logs are written to a debug log, with the path to that file printed if the execution of a command fails.

The default location of the logs directory is a directory named `_logs` inside the npm cache. This can be changed with the `logs-dir` config option.

For example, if you wanted to write all your logs to the current working directory, you could run: `npm install --logs-dir=.`.  This is especially helpful in debugging a specific `npm` issue as you can run
a command multiple times with different config values and then diff all the log files.

Log files will be removed from the `logs-dir` when the number of log files exceeds `logs-max`, with the oldest logs being deleted first.

To turn off logs completely set `--logs-max=0`.

### Setting Log Levels

#### `loglevel`

`loglevel` is a global argument/config that can be set to determine the type of information to be displayed.

The default value of `loglevel` is `"notice"` but there are several levels/types of logs available, including:

- `"silent"`
- `"error"`
- `"warn"`
- `"notice"`
- `"http"`
- `"info"`
- `"verbose"`
- `"silly"`

All logs pertaining to a level proceeding the current setting will be shown.

##### Aliases

The log levels listed above have various corresponding aliases, including:

- `-d`: `--loglevel info`
- `--dd`: `--loglevel verbose`
- `--verbose`: `--loglevel verbose`
- `--ddd`: `--loglevel silly`
- `-q`: `--loglevel warn`
- `--quiet`: `--loglevel warn`
- `-s`: `--loglevel silent`
- `--silent`: `--loglevel silent`

#### `foreground-scripts`

The `npm` CLI began hiding the output of lifecycle scripts for `npm install` as of `v7`. Notably, this means you will not see logs/output from packages that may be using "install scripts" to display information back to you or from your own project's scripts defined in `package.json`. If you'd like to change this behavior & log this output you can set `foreground-scripts` to `true`.

### Timing Information

The [`--timing` config](/using-npm/config#timing) can be set which does a few
things:

1. Always shows the full path to the debug log regardless of command exit status
1. Write timing information to a process specific timing file in the cache or `logs-dir`
1. Output timing information to the terminal

This file contains a `timers` object where the keys are an identifier for the
portion of the process being timed and the value is the number of milliseconds it took to complete.

Sometimes it is helpful to get timing information without outputting anything to the terminal. For
example, the performance might be affected by writing to the terminal. In this case you can use
`--timing --silent` which will still write the timing file, but not output anything to the terminal
while running.

### Registry Response Headers

#### `npm-notice`

The `npm` CLI reads from & logs any `npm-notice` headers that are returned from the configured registry. This mechanism can be used by third-party registries to provide useful information when network-dependent requests occur.

This header is not cached, and will not be logged if the request is served from the cache.

### Logs and Sensitive Information

The `npm` CLI makes a best effort to redact the following from terminal output and log files:

- Passwords inside basic auth URLs
- npm tokens

However, this behavior should not be relied on to keep all possible sensitive information redacted. If you are concerned about secrets in your log file or terminal output, you can use `--loglevel=silent` and `--logs-max=0` to ensure no logs are written to your terminal or filesystem.

### See also

* [config](/using-npm/config)

# /** 
  * WordPress dependencies 
  */ 
 const { test, expect } = require( '@wordpress/e2e-test-utils-playwright' ); 
  
 test.use( { 
         KeyboardNavigableBlocks: async ( { page, pageUtils }, use ) => { 
                 await use( new KeyboardNavigableBlocks( { page, pageUtils } ) ); 
         }, 
 } ); 
  
 test.describe( 'Order of block keyboard navigation', () => { 
         test.beforeEach( async ( { admin } ) => { 
                 await admin.createNewPost(); 
         } ); 
  
         test( 'permits tabbing through paragraph blocks in the expected order', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
                 page, 
         } ) => { 
                 const paragraphBlocks = [ 'Paragraph 0', 'Paragraph 1', 'Paragraph 2' ]; 
  
                 // Create 3 paragraphs blocks with some content. 
                 for ( const paragraphBlock of paragraphBlocks ) { 
                         await editor.insertBlock( { name: 'core/paragraph' } ); 
                         await page.keyboard.type( paragraphBlock ); 
                 } 
  
                 // Select the middle block. 
                 await page.keyboard.press( 'ArrowUp' ); 
                 await editor.showBlockToolbar(); 
                 await KeyboardNavigableBlocks.navigateToContentEditorTop(); 
                 await KeyboardNavigableBlocks.tabThroughParagraphBlock( 'Paragraph 1' ); 
  
                 // Repeat the same steps to ensure that there is no change introduced in how the focus is handled. 
                 // This prevents the previous regression explained in: https://github.com/WordPress/gutenberg/issues/11773. 
                 await KeyboardNavigableBlocks.navigateToContentEditorTop(); 
                 await KeyboardNavigableBlocks.tabThroughParagraphBlock( 'Paragraph 1' ); 
         } ); 
  
         test( 'allows tabbing in navigation mode if no block is selected', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
                 page, 
         } ) => { 
                 const paragraphBlocks = [ '0', '1' ]; 
  
                 // Create 2 paragraphs blocks with some content. 
                 for ( const paragraphBlock of paragraphBlocks ) { 
                         await editor.insertBlock( { name: 'core/paragraph' } ); 
                         await page.keyboard.type( paragraphBlock ); 
                 } 
  
                 // Clear the selected block. 
                 const paragraph = editor.canvas 
                         .locator( '[data-type="core/paragraph"]' ) 
                         .getByText( '1' ); 
                 const box = await paragraph.boundingBox(); 
                 await page.mouse.click( box.x - 1, box.y ); 
  
                 await page.keyboard.press( 'Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Add title' ); 
  
                 await page.keyboard.press( 'Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Paragraph Block. Row 1. 0' 
                 ); 
  
                 await page.keyboard.press( 'Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Paragraph Block. Row 2. 1' 
                 ); 
  
                 await page.keyboard.press( 'Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Post (selected)' 
                 ); 
         } ); 
  
         test( 'allows tabbing in navigation mode if no block is selected (reverse)', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
                 page, 
                 pageUtils, 
         } ) => { 
                 const paragraphBlocks = [ '0', '1' ]; 
  
                 // Create 2 paragraphs blocks with some content. 
                 for ( const paragraphBlock of paragraphBlocks ) { 
                         await editor.insertBlock( { name: 'core/paragraph' } ); 
                         await page.keyboard.type( paragraphBlock ); 
                 } 
  
                 // Clear the selected block. 
                 const paragraph = editor.canvas 
                         .locator( '[data-type="core/paragraph"]' ) 
                         .getByText( '1' ); 
                 const box = await paragraph.boundingBox(); 
                 await page.mouse.click( box.x - 1, box.y ); 
  
                 // Put focus behind the block list. 
                 await page.evaluate( () => { 
                         document 
                                 .querySelector( '.interface-interface-skeleton__sidebar' ) 
                                 .focus(); 
                 } ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Add block' ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Add default block' 
                 ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Paragraph Block. Row 2. 1' 
                 ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Paragraph Block. Row 1. 0' 
                 ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Add title' ); 
         } ); 
  
         test( 'should navigate correctly with multi selection', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
                 page, 
                 pageUtils, 
         } ) => { 
                 const paragraphBlocks = [ '0', '1', '2', '3' ]; 
  
                 // Create 4 paragraphs blocks with some content. 
                 for ( const paragraphBlock of paragraphBlocks ) { 
                         await editor.insertBlock( { name: 'core/paragraph' } ); 
                         await page.keyboard.type( paragraphBlock ); 
                 } 
                 await page.keyboard.press( 'ArrowUp' ); 
                 await pageUtils.pressKeys( 'shift+ArrowUp' ); 
  
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Multiple selected blocks' 
                 ); 
  
                 await page.keyboard.press( 'Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Post' ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 
                         'Multiple selected blocks' 
                 ); 
  
                 await pageUtils.pressKeys( 'shift+Tab' ); 
                 await page.keyboard.press( 'ArrowRight' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Move up' ); 
         } ); 
  
         test( 'allows the first element within a block to receive focus', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
                 page, 
         } ) => { 
                 // Insert a image block. 
                 await editor.insertBlock( { name: 'core/image' } ); 
  
                 // Make sure the upload button has focus. 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Upload' ); 
  
                 // Try to focus the image block wrapper. 
                 await page.keyboard.press( 'ArrowUp' ); 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Block: Image' ); 
         } ); 
  
         test( 'allows the block wrapper to gain focus for a group block instead of the first element', async ( { 
                 editor, 
                 KeyboardNavigableBlocks, 
         } ) => { 
                 // Insert a group block. 
                 await editor.insertBlock( { name: 'core/group' } ); 
                 // Select the default, selected Group layout from the variation picker. 
                 const groupButton = editor.canvas.locator( 
                         'button[aria-label="Group: Gather blocks in a container."]' 
                 ); 
  
                 await groupButton.click(); 
  
                 // If active label matches, that means focus did not change from group block wrapper. 
                 await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Block: Group' ); 
         } ); 
 } ); 
  
 class KeyboardNavigableBlocks { 
         constructor( { page, pageUtils } ) { 
                 this.page = page; 
                 this.pageUtils = pageUtils; 
         } 
  
         async expectLabelToHaveFocus( label ) { 
                 const ariaLabel = await this.page.evaluate( () => { 
                         const { activeElement } = 
                                 document.activeElement.contentDocument ?? document; 
                         return ( 
                                 activeElement.getAttribute( 'aria-label' ) || 
                                 activeElement.innerText 
                         ); 
                 } ); 
  
                 expect( ariaLabel ).toBe( label ); 
         } 
  
         async navigateToContentEditorTop() { 
                 // Use 'Ctrl+`' to return to the top of the editor. 
                 await this.pageUtils.pressKeys( 'ctrl+`' ); 
                 await this.pageUtils.pressKeys( 'ctrl+`' ); 
                 await this.pageUtils.pressKeys( 'ctrl+`' ); 
                 await this.pageUtils.pressKeys( 'ctrl+`' ); 
                 await this.pageUtils.pressKeys( 'ctrl+`' ); 
         } 
  
         async tabThroughParagraphBlock( paragraphText ) { 
                 await this.tabThroughBlockToolbar(); 
  
                 await this.page.keyboard.press( 'Tab' ); 
                 await this.expectLabelToHaveFocus( 'Block: Paragraph' ); 
  
                 const blockText = await this.page.evaluate( () => { 
                         const { activeElement } = 
                                 document.activeElement.contentDocument ?? document; 
                         return activeElement.innerHTML; 
                 } ); 
  
                 expect( blockText ).toBe( paragraphText ); 
  
                 await this.page.keyboard.press( 'Tab' ); 
                 await this.expectLabelToHaveFocus( 'Post' ); 
  
                 // Need to shift+tab here to end back in the block. If not, we'll be in the next region and it will only require 4 region jumps instead of 5. 
                 await this.pageUtils.pressKeys( 'shift+Tab' ); 
                 await this.expectLabelToHaveFocus( 'Block: Paragraph' ); 
         } 
  
         async tabThroughBlockToolbar() { 
                 await this.page.keyboard.press( 'Tab' ); 
                 await this.expectLabelToHaveFocus( 'Paragraph' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Move up' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Move down' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Align text' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Bold' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Italic' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Link' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'More' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Options' ); 
  
                 await this.page.keyboard.press( 'ArrowRight' ); 
                 await this.expectLabelToHaveFocus( 'Paragraph' ); 
         } 
 }
 # Desde 78747e942b68a552c39b827a62a2fb102951ce70 lunes 17 de septiembre 00:00:00 2001
De: Jerry Jones <jones.jeremydavid@gmail.com>
Fecha: viernes, 29 de septiembre de 2023 15:33:33 -0500
Asunto: [PARCHE] Migrar pruebas e2e de bloques navegables por teclado de titiritero a
 dramaturgo

---
 .../bloques-navegables-teclado.test.js.snap | 19--
 .../varios/keyboard-navigable-blocks.test.js | 239 ---------------
 .../varios/keyboard-navigable-blocks.spec.js | 279 ++++++++++++++++++
 3 archivos modificados, 279 inserciones(+), 258 eliminaciones(-)
 modo de eliminación 100644 paquetes/e2e-tests/specs/editor/various/__snapshots__/keyboard-navigable-blocks.test.js.snap
 modo de eliminación 100644 paquetes/e2e-tests/specs/editor/various/keyboard-navigable-blocks.test.js
 crear modo 100644 test/e2e/specs/editor/various/keyboard-navigable-blocks.spec.js

diff --git a/packages/e2e-tests/specs/editor/various/__snapshots__/keyboard-navigable-blocks.test.js.snap b/packages/e2e-tests/specs/editor/various/__snapshots__/keyboard-navigable -blocks.test.js.snap
modo de archivo eliminado 100644
índice d619d310d5c29..0000000000000
--- a/packages/e2e-tests/specs/editor/various/__snapshots__/keyboard-navigable-blocks.test.js.snap
+++ /dev/nulo
@@ -1,19 +0,0 @@
-// Instantánea de broma v1, https://goo.gl/fbAQLP
-
-exports[`El orden de navegación del teclado en bloque debe navegar correctamente con la selección múltiple 1`] = `
-"<!-- wp:párrafo -->
-<p>1</p>
-<!-- /wp:párrafo -->
-
-<!-- wp:párrafo -->
-<p>2</p>
-<!-- /wp:párrafo -->
-
-<!-- wp:párrafo -->
-<p>3</p>
-<!-- /wp:párrafo -->
-
-<!-- wp:párrafo -->
-<p>4</p>
-<!-- /wp:párrafo -->"
-`;
diff --git a/packages/e2e-tests/specs/editor/various/keyboard-navigable-blocks.test.js b/packages/e2e-tests/specs/editor/various/keyboard-navigable-blocks.test.js
modo de archivo eliminado 100644
índice 55fc8473c22fd..0000000000000
--- a/packages/e2e-tests/specs/editor/various/keyboard-navigable-blocks.test.js
+++ /dev/nulo
@@ -1,239 +0,0 @@
-/**
- * Dependencias de WordPress
- */
-importar {
- crear nueva publicación,
- insertarBloque,
- presioneKeyWithModifier,
- haga clic en BlockAppender,
- obtener contenido de publicación editado,
- mostrarBlockToolbar,
- lienzo,
-} de '@wordpress/e2e-test-utils';
-
-función asíncrona getActiveLabel() {
- volver a esperar página.evaluar( () => {
- constante {elementoactivo} =
- documento.activeElement.contentDocumento?? documento;
- devolver (
- activeElement.getAttribute( 'aria-label' ) ||
- activeElement.innerHTML
- );
- } );
-}
-
-const navegarToContentEditorTop = async () => {
- // Utilice 'Ctrl+`' para volver a la parte superior del editor.
- espere pressKeyWithModifier( 'ctrl', '`' );
- espere pressKeyWithModifier( 'ctrl', '`' );
- espere pressKeyWithModifier( 'ctrl', '`' );
- espere pressKeyWithModifier( 'ctrl', '`' );
- espere pressKeyWithModifier( 'ctrl', '`' );
-};
-
-const tabThroughParagraphBlock = async (texto del párrafo) => {
- espera tabThroughBlockToolbar();
-
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Bloque: Párrafo' );
- esperar esperar (
- espera página.evaluar( () => {
- constante {elementoactivo} =
- documento.activeElement.contentDocumento?? documento;
- devolver activeElement.innerHTML;
- } )
- ).toBe(párrafoTexto);
-
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Abrir configuración de documento' );
-
- // Necesita presionar Mayús+tab aquí para terminar nuevamente en el bloque. De lo contrario, estaremos en la siguiente región y solo requerirá 4 saltos de región en lugar de 5.
- espere pressKeyWithModifier ('shift', 'Tab');
- await expect( await getActiveLabel() ).toBe( 'Bloque: Párrafo' );
-};
-
-const tabThroughBlockToolbar = async () => {
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Párrafo' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Subir' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Mover hacia abajo' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Alinear texto' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Bold' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Cursiva' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Enlace' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Más' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Opciones' );
-
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Párrafo' );
-};
-
-describe( 'Orden de navegación del teclado en bloque', () => {
- antes de cada uno (async () => {
- espera createNewPost();
- } );
-
- it( 'permite tabular los bloques de párrafos en el orden esperado', async () => {
- const parrafoBlocks = [ 'Párrafo 0', 'Párrafo 1', 'Párrafo 2' ];
-
- // Crea bloques de 3 párrafos con algún contenido.
- for (const bloque de párrafo de bloques de párrafo) {
- await insertBlock('Párrafo');
- espera página.teclado.tipo(párrafoBloque);
- }
-
- //Selecciona el bloque del medio.
- espera página.keyboard.press('FlechaArriba');
- espera showBlockToolbar();
- esperar a navegarToContentEditorTop();
- await tabThroughParagraphBlock('Párrafo 1');
-
- // Repita los mismos pasos para asegurarse de que no se introduzcan cambios en la forma en que se maneja el foco.
- // Esto evita la regresión anterior explicada en: https://github.com/WordPress/gutenberg/issues/11773.
- esperar a navegarToContentEditorTop();
- await tabThroughParagraphBlock('Párrafo 1');
- } );
-
- it( 'permite tabulación en modo de navegación si no se selecciona ningún bloque', async() => {
- const párrafoBlocks = ['0', '1'];
-
- // Crea bloques de 2 párrafos con algún contenido.
- for (const bloque de párrafo de bloques de párrafo) {
- await insertBlock('Párrafo');
- espera página.teclado.tipo(párrafoBloque);
- }
-
- // Borrar el bloque seleccionado.
- párrafo constante = await canvas().$( '[data-type="core/paragraph"]' );
- cuadro constante = esperar párrafo.boundingBox();
- espera página.mouse.click(box.x - 1, box.y);
-
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Agregar título' );
-
- espera página.keyboard.press('Tab');
- esperar esperar (esperar getActiveLabel()).toBe(
- 'Bloque de párrafos. Fila 1. 0'
- );
-
- espera página.keyboard.press('Tab');
- esperar esperar (esperar getActiveLabel()).toBe(
- 'Bloque de párrafos. Fila 2. 1'
- );
-
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Abrir configuración de documento' );
- } );
-
- it( 'permite tabulación en modo de navegación si no se selecciona ningún bloque (inverso)', async() => {
- const párrafoBlocks = ['0', '1'];
-
- // Crea bloques de 2 párrafos con algún contenido.
- for (const bloque de párrafo de bloques de párrafo) {
- await insertBlock('Párrafo');
- espera página.teclado.tipo(párrafoBloque);
- }
-
- // Borrar el bloque seleccionado.
- párrafo constante = await canvas().$( '[data-type="core/paragraph"]' );
- cuadro constante = esperar párrafo.boundingBox();
- espera página.mouse.click(box.x - 1, box.y);
-
- // Poner el foco detrás de la lista de bloqueo.
- espera página.evaluar( () => {
- documento
- .querySelector( '.interface-interface-skeleton__sidebar' )
- .enfocar();
- } );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- await expect( await getActiveLabel() ).toBe( 'Agregar bloque' );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- await expect( await getActiveLabel() ).toBe( 'Agregar bloque predeterminado' );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- esperar esperar (esperar getActiveLabel()).toBe(
- 'Bloque de párrafos. Fila 2. 1'
- );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- esperar esperar (esperar getActiveLabel()).toBe(
- 'Bloque de párrafos. Fila 1. 0'
- );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- await expect( await getActiveLabel() ).toBe( 'Agregar título' );
- } );
-
- it( 'debe navegar correctamente con selección múltiple', async() => {
- espera clickBlockAppender();
- espera página.teclado.tipo('1');
- espera página.keyboard.press('Entrar');
- espera página.teclado.tipo('2');
- espera página.keyboard.press('Entrar');
- espera página.teclado.tipo('3');
- espera página.keyboard.press('Entrar');
- espera página.teclado.tipo('4');
- espera página.keyboard.press('FlechaArriba');
- espere pressKeyWithModifier ('shift', 'ArrowUp');
-
- esperar (espera obtenerEditedPostContent()).toMatchSnapshot();
-
- expect( espera getActiveLabel() ).toBe( 'Múltiples bloques seleccionados' );
-
- espera página.keyboard.press('Tab');
- await expect( await getActiveLabel() ).toBe( 'Publicar' );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- esperar esperar (esperar getActiveLabel()).toBe(
- 'Múltiples bloques seleccionados'
- );
-
- espere pressKeyWithModifier ('shift', 'Tab');
- espera página.keyboard.press('FlechaDerecha');
- await expect( await getActiveLabel() ).toBe( 'Subir' );
- } );
-
- it( 'permite que el primer elemento dentro de un bloque reciba el foco', async () => {
- // Insertar un bloque de imagen.
- await insertBlock('Imagen');
-
- // Asegúrate de que el botón de carga esté enfocado.
- const uploadButton = esperar lienzo().waitForXPath(
- '//botón[contiene(texto(), "Subir") ]'
- );
- espera esperar (uploadButton). toHaveFocus();
-
- // Intenta enfocar el contenedor del bloque de imágenes.
- espera página.keyboard.press('FlechaArriba');
- await expect( await getActiveLabel() ).toBe( 'Bloque: Imagen' );
- } );
-
- it( 'permite que el contenedor del bloque obtenga el foco para un bloque de grupo en lugar del primer elemento', async () => {
- // Insertar un bloque de grupo.
- espera insertBlock ('Grupo');
- // Seleccione el diseño de grupo predeterminado seleccionado en el selector de variaciones.
- esperar lienzo().hacer clic(
- 'button[aria-label="Grupo: Reúna bloques en un contenedor."]'
- );
- // Si la etiqueta activa coincide, eso significa que el enfoque no cambió desde el contenedor del bloque de grupo.
- await expect( await getActiveLabel() ).toBe( 'Bloque: Grupo' );
- } );
-} );
diff --git a/test/e2e/specs/editor/various/keyboard-navigable-blocks.spec.js b/test/e2e/specs/editor/various/keyboard-navigable-blocks.spec.js
nuevo modo de archivo 100644
índice 0000000000000..044870d81041b
--- /dev/nulo
+++ b/test/e2e/specs/editor/various/keyboard-navigable-blocks.spec.js
@@ -0,0 +1,279 @@
+/**
+ * Dependencias de WordPress
+ */
+const {prueba, esperar} = requerir( '@wordpress/e2e-test-utils-playwright' );
+
+prueba.uso( {
+ KeyboardNavigableBlocks: asíncrono ({página, pageUtils}, uso) => {
+ espera de uso (nuevos KeyboardNavigableBlocks ({página, pageUtils}));
+ },
+} );
+
+test.describe( 'Orden de navegación del teclado en bloque', () => {
+ prueba.beforeEach( async ( { admin } ) => {
+ espera admin.createNewPost();
+ } );
+
+ test( 'permite tabular los bloques de párrafos en el orden esperado', async ( {
+ editor,
+ Bloques navegables del teclado,
+ página,
+ } ) => {
+ const parrafoBlocks = [ 'Párrafo 0', 'Párrafo 1', 'Párrafo 2' ];
+
+ // Crea bloques de 3 párrafos con algún contenido.
+ for ( const bloque de párrafo de bloques de párrafo ) {
+ await editor.insertBlock( { nombre: 'núcleo/párrafo' } );
+ espera página.teclado.tipo (párrafoBloque);
+ }
+
+ // Selecciona el bloque del medio.
+ espera página.keyboard.press( 'FlechaArriba' );
+ espera editor.showBlockToolbar();
+ espera KeyboardNavigableBlocks.navigateToContentEditorTop();
+ await KeyboardNavigableBlocks.tabThroughParagraphBlock ('Párrafo 1');
+
+ // Repita los mismos pasos para asegurarse de que no se introduzcan cambios en la forma en que se maneja el foco.
+ // Esto evita la regresión anterior explicada en: https://github.com/WordPress/gutenberg/issues/11773.
+ espera KeyboardNavigableBlocks.navigateToContentEditorTop();
+ await KeyboardNavigableBlocks.tabThroughParagraphBlock ('Párrafo 1');
+ } );
+
+ test( 'permite tabulación en el modo de navegación si no se selecciona ningún bloque', async ( {
+ editor,
+ Bloques navegables del teclado,
+ página,
+ } ) => {
+ const párrafoBlocks = [ '0', '1' ];
+
+ // Crea bloques de 2 párrafos con algún contenido.
+ for ( const bloque de párrafo de bloques de párrafo ) {
+ await editor.insertBlock( { nombre: 'núcleo/párrafo' } );
+ espera página.teclado.tipo (párrafoBloque);
+ }
+
+ // Borra el bloque seleccionado.
+ párrafo constante = editor.canvas
+ .locator( '[tipo-datos="núcleo/párrafo"]' )
+ .getByText('1');
+ cuadro constante = esperar párrafo.boundingBox();
+ espera página.mouse.click( box.x - 1, box.y );
+
+ espera página.teclado.press( 'Tab' );
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Agregar título' );
+
+ espera página.teclado.press( 'Tab' );
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Bloque de párrafo. Fila 1. 0'
+ );
+
+ espera página.teclado.press( 'Tab' );
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Bloque de párrafo. Fila 2. 1'
+ );
+
+ espera página.teclado.press( 'Tab' );
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Publicación (seleccionada)'
+ );
+ } );
+
+ test( 'permite tabulación en modo de navegación si no se selecciona ningún bloque (inverso)', async ( {
+ editor,
+ Bloques navegables del teclado,
+ página,
+ utilidades de página,
+ } ) => {
+ const párrafoBlocks = [ '0', '1' ];
+
+ // Crea bloques de 2 párrafos con algún contenido.
+ for ( const bloque de párrafo de bloques de párrafo ) {
+ await editor.insertBlock( { nombre: 'núcleo/párrafo' } );
+ espera página.teclado.tipo (párrafoBloque);
+ }
+
+ // Borra el bloque seleccionado.
+ párrafo constante = editor.canvas
+ .locator( '[tipo-datos="núcleo/párrafo"]' )
+ .getByText('1');
+ cuadro constante = esperar párrafo.boundingBox();
+ espera página.mouse.click( box.x - 1, box.y );
+
+ // Poner el foco detrás de la lista de bloqueo.
+ espera página.evaluar( () => {
+ documento
+ .querySelector( '.interfaz-interfaz-esqueleto__barra lateral' )
+ .enfoque();
+ } );
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus('Agregar bloque');
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Agregar bloque predeterminado'
+ );
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Bloque de párrafo. Fila 2. 1'
+ );
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Bloque de párrafo. Fila 1. 0'
+ );
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Agregar título' );
+ } );
+
+ test( 'debería navegar correctamente con selección múltiple', async ( {
+ editor,
+ Bloques navegables del teclado,
+ página,
+ utilidades de página,
+ } ) => {
+ const párrafoBlocks = [ '0', '1', '2', '3' ];
+
+ // Crea bloques de 4 párrafos con algún contenido.
+ for ( const bloque de párrafo de bloques de párrafo ) {
+ await editor.insertBlock( { nombre: 'núcleo/párrafo' } );
+ espera página.teclado.tipo (párrafoBloque);
+ }
+ espera página.keyboard.press( 'FlechaArriba' );
+ espera pageUtils.pressKeys ('shift+ArrowUp');
+
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Múltiples bloques seleccionados'
+ );
+
+ espera página.teclado.press( 'Tab' );
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus('Publicar');
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ espera KeyboardNavigableBlocks.expectLabelToHaveFocus(
+ 'Múltiples bloques seleccionados'
+ );
+
+ espera pageUtils.pressKeys ('shift+Tab');
+ espera página.keyboard.press( 'FlechaDerecha' );
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus('Subir');
+ } );
+
+ test( 'permite que el primer elemento dentro de un bloque reciba el foco', async ( {
+ editor,
+ Bloques navegables del teclado,
+ página,
+ } ) => {
+ // Insertar un bloque de imagen.
+ await editor.insertBlock( { nombre: 'núcleo/imagen' } );
+
+ // Asegúrate de que el botón de carga esté enfocado.
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Cargar' );
+
+ // Intenta enfocar el contenedor del bloque de imágenes.
+ espera página.keyboard.press( 'FlechaArriba' );
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Bloque: Imagen' );
+ } );
+
+ test( 'permite que el contenedor del bloque obtenga el foco para un bloque de grupo en lugar del primer elemento', async ( {
+ editor,
+ Bloques navegables del teclado,
+ } ) => {
+ // Insertar un bloque de grupo.
+ espera editor.insertBlock( { nombre: 'núcleo/grupo' } );
+ // Seleccione el diseño de grupo seleccionado predeterminado en el selector de variaciones.
+ const grupoButton = editor.canvas.locator(
+ 'button[aria-label="Grupo: Reúne bloques en un contenedor."]'
+ );
+
+ espera groupButton.click();
+
+ // Si la etiqueta activa coincide, eso significa que el foco no cambió desde el contenedor del bloque de grupo.
+ await KeyboardNavigableBlocks.expectLabelToHaveFocus( 'Bloque: Grupo' );
+ } );
+} );
+
+clase KeyboardNavigableBlocks {
+ constructor( { página, pageUtils } ) {
+ esta.página = página;
+ this.pageUtils = pageUtils;
+ }
+
+ asíncrono expectLabelToHaveFocus(etiqueta) {
+ const ariaLabel = espera esta.página.evaluate( () => {
+ constante {elementoactivo} =
+ documento.activeElement.contentDocumento ?? documento;
+ regresar (
+ activeElement.getAttribute( 'aria-label' ) ||
+ elemento activo.textointerior
+ );
+ } );
+
+ esperar( ariaLabel ).toBe( etiqueta );
+ }
+
+ asíncrono navegarToContentEditorTop() {
+ // Utilice 'Ctrl+`' para volver a la parte superior del editor.
+ espere this.pageUtils.pressKeys( 'ctrl+`' );
+ espere this.pageUtils.pressKeys( 'ctrl+`' );
+ espere this.pageUtils.pressKeys( 'ctrl+`' );
+ espere this.pageUtils.pressKeys( 'ctrl+`' );
+ espere this.pageUtils.pressKeys( 'ctrl+`' );
+ }
+
+ pestaña asíncrona a través del bloque de párrafo (texto del párrafo) {
+ espere esto.tabThroughBlockToolbar();
+
+ espere esta.página.teclado.presione ('Tab');
+ await this.expectLabelToHaveFocus( 'Bloque: Párrafo' );
+
+ const blockText = espera esta.página.evaluate( () => {
+ constante {elementoactivo} =
+ documento.activeElement.contentDocumento ?? documento;
+ devolver activeElement.innerHTML;
+ } );
+
+ esperar (texto de bloque). toBe (texto de párrafo);
+
+ espere esta.página.teclado.presione ('Tab');
+ await this.expectLabelToHaveFocus('Publicar');
+
+ // Necesita cambiar+tabulación aquí para terminar nuevamente en el bloque. De lo contrario, estaremos en la siguiente región y solo requerirá 4 saltos de región en lugar de 5.
+ espere this.pageUtils.pressKeys ('shift+Tab');
+ await this.expectLabelToHaveFocus( 'Bloque: Párrafo' );
+ }
+
+ pestaña asíncronaThroughBlockToolbar() {
+ espere esta.página.teclado.presione ('Tab');
+ await this.expectLabelToHaveFocus( 'Párrafo' );
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Subir');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Mover hacia abajo');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Alinear texto');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Bold');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Cursiva');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus('Enlace');
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus( 'Más' );
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus( 'Opciones' );
+
+ espere esta.página.teclado.presione ('FlechaDerecha');
+ await this.expectLabelToHaveFocus( 'Párrafo' );
+ }
+}
