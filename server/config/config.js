// ==========================================
//     PUERTO
// ==========================================
process.env.PORT = process.env.PORT || 3000;

// ==========================================
//     Entorno
// ==========================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// ==========================================
//     Vencimiento del Token
// ==========================================
// 60 segundos
// 60 minutos
// 24 horas
// 30 días
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;

// ==========================================
//     SEED de autenticación
// ==========================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';

// ==========================================
//     Base de datos
// ==========================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}

process.env.URLDB = urlDB;


// ==========================================
//  Google Client ID
// ==========================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '522054728613-epjrlg8jjqpl3af5o57nu01l5b9gcac9.apps.googleusercontent.com';