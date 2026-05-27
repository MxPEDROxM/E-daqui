import * as SQLite from 'expo-sqlite';


export const banco = SQLite.openDatabaseSync('e_daqui.db');


banco.execSync(`
  CREATE TABLE IF NOT EXISTS servicos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    categoria TEXT NOT NULL,
    descricao TEXT,
    telefone TEXT,
    cidade TEXT DEFAULT 'Rio de Janeiro',
    bairro TEXT,
    cep TEXT,
    rua TEXT,
    numero TEXT,
    complemento TEXT,
    referencia TEXT,
    possuiLojaFisica INTEGER DEFAULT 1,
    uriImagem TEXT,
    subtipoPrestador TEXT
  );
`);

try {
  banco.execSync('ALTER TABLE servicos ADD COLUMN subtipoPrestador TEXT;');
} catch (e) {
}

try {
  banco.execSync('ALTER TABLE servicos ADD COLUMN favorito INTEGER DEFAULT 0;');
} catch (e) {
}
