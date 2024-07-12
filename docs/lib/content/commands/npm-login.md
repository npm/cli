<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bibliothèque de Documents</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Bibliothèque de Documents</h1>
        </header>
        <main>
            <form id="documentForm" aria-labelledby="formTitle">
                <fieldset>
                    <legend id="formTitle">Ajouter un Nouveau Document</legend>
                    
                    <label for="documentTitle">Titre du Document</label>
                    <input type="text" id="documentTitle" name="documentTitle" placeholder="Titre du Document" required>
                    
                    <label for="documentImage">Image du Document</label>
                    <input type="url" id="documentImage" name="documentImage" placeholder="URL de l'image" required>
                    
                    <label for="documentContent">Contenu du Document</label>
                    <textarea id="documentContent" name="documentContent" placeholder="Contenu du Document" required></textarea>
                    
                    <label for="releaseDate">Date de Sortie</label>
                    <input type="date" id="releaseDate" name="releaseDate" required>
                    
                    <label for="returnDate">Date de Retour</label>
                    <input type="date" id="returnDate" name="returnDate">
                    
                    <label for="borrower">Personne ayant emprunté le livre</label>
                    <input type="text" id="borrower" name="borrower" placeholder="Nom de la personne<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bibliothèque de Documents</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>Bibliothèque de Documents</h1>
        </header>
        <main>
            <form id="documentForm" aria-labelledby="formTitle">
                <fieldset>
                    <legend id="formTitle">Ajouter un Nouveau Document</legend>
                    
                    <label for="documentTitle">Titre du Document</label>
                    <input type="text" id="documentTitle" name="documentTitle" placeholder="Titre du Document" required>
                    
                    <label for="documentImage">Image du Document</label>
                    <input type="url" id="documentImage" name="documentImage" placeholder="URL de l'image" required>
                    
                    <label for="documentContent">Contenu du Document</label>
                    <textarea id="documentContent" name="documentContent" placeholder="Contenu du Document" required></textarea>
                    
                    <label for="releaseDate">Date de Sortie</label>
                    <input type="date" id="releaseDate" name="releaseDate" required>
                    
                    <label for="returnDate">Date de Retour</label>
                    <input type="date" id="returnDate" name="returnDate">
                    
                    <label for="borrower">Personne ayant emprunté le livre</label>
                    <input type="text" id="borrower" name="borrower" placeholder="Nom de la personne">
                    
                    <button type="submit">Ajouter le Document</button>
                </fieldset>
            </form>
            
            <section aria-labelledby="documentListTitle">
                <h2 id="documentListTitle">Liste des Documents</h2>
                <ul id="documentList"></ul>
            </section>
            
            <section aria-labelledby="checkedOutBooksTitle">
                <h2 id="checkedOutBooksTitle">Livres Sortis</h2>
                <ul id="checkedOutBooks"></ul>
            </section>
        </main>
    </div>
    <script src="scripts.js"></script>
</body>
</html>
                    
                    <button type="submit">Ajouter le Document</button>
                </fieldset>
            </form>
            
            <section aria-labelledby="documentListTitle">
                <h2 id="documentListTitle">Liste des Documents</h2>
                <ul id="documentList"></ul>
            </section>
            
            <section aria-labelledby="checkedOutBooksTitle">
                <h2 id="checkedOutBooksTitle">Livres Sortis</h2>
                <ul id="checkedOutBooks"></ul>
            </section>
        </main>
    </div>
    <script src="scripts.js"></script>
</body>
</html>
