const express = require('express');
const path = require('path');
const app = express();

// Serve i file statici dalla directory corrente
app.use(express.static(__dirname));

// Aggiungi gli header necessari per PWA
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
        'Service-Worker-Allowed': '/'
    });
    next();
});

// Rotta principale
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Avvia il server
const port = 8000;
app.listen(port, '0.0.0.0', () => {
    console.log(`Server avviato su http://localhost:${port}`);
    console.log('Per accedere da altri dispositivi, usa uno di questi indirizzi:');
    require('dns').lookup(require('os').hostname(), (err, add, fam) => {
        console.log(`http://${add}:${port}`);
    });
});
