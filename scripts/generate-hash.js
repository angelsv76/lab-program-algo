/**
 * Laboratorio de Programación INTI
 * © 2025 Angel Sanchez – Todos los derechos reservados
 *
 * Script: generate-hash.js
 * Genera el hash SHA-256 de la contraseña del administrador.
 *
 * Uso:
 *   node scripts/generate-hash.js
 *
 * Luego copia el hash generado y pégalo en tu archivo .env:
 *   VITE_ADMIN_HASH=<hash_generado>
 */

import crypto from 'crypto';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Ingresa la contraseña que deseas hashear: ', (password) => {
  if (!password || password.trim().length === 0) {
    console.error('\n❌ Error: La contraseña no puede estar vacía.');
    rl.close();
    process.exit(1);
  }

  const hash = crypto.createHash('sha256').update(password.trim()).digest('hex');

  console.log('\n✅ Hash SHA-256 generado exitosamente:\n');
  console.log(`   ${hash}\n`);
  console.log('📋 Copia esta línea a tu archivo .env:');
  console.log(`   VITE_ADMIN_HASH=${hash}\n`);
  console.log('⚠️  Nunca compartas tu contraseña ni subas el archivo .env al repositorio.\n');

  rl.close();
});
