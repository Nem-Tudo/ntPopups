const { execSync } = require('child_process');

// Captura o primeiro argumento após o nome do script (ex: 'minor', 'major')
const type = process.argv[2] || 'patch';

console.log(`🚀 Preparando o lançamento da versão: ${type}`);

try {
    // 1. Incrementa a versão, cria commit e tag
    execSync(`npm version ${type}`, { stdio: 'inherit' });

    // 2. Envia o commit e a tag
    execSync('git push && git push --tags', { stdio: 'inherit' });

    console.log('✅ Lançamento concluído com sucesso!');
} catch (error) {
    console.error('❌ Falha no processo de lançamento.');
    process.exit(1);
}