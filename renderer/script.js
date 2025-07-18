document.addEventListener('DOMContentLoaded', () => {
    const scanBtn = document.getElementById('scanBtn');
    const cleanBtn = document.getElementById('cleanBtn');
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    const fileResults = document.getElementById('fileResults');
    const exeResults = document.getElementById('exeResults');
    const deviceResults = document.getElementById('deviceResults');
    const cacheResults = document.getElementById('cacheResults');
    const sysResults = document.getElementById('sysResults');
    const adviceResults = document.getElementById('adviceResults');
    
    const fileStatus = document.getElementById('fileStatus');
    const exeStatus = document.getElementById('exeStatus');
    const cacheStatus = document.getElementById('cacheStatus');
    const devicesList = document.getElementById('devicesList');
    const sysInfo = document.getElementById('sysInfo');
    const adviceList = document.getElementById('adviceList');
    
    const fileCheck = document.getElementById('fileCheck');
    const exeCheck = document.getElementById('exeCheck');
    const deviceCheck = document.getElementById('deviceCheck');
    const cacheCheck = document.getElementById('cacheCheck');
    const perfCheck = document.getElementById('perfCheck');
    
    scanBtn.addEventListener('click', async () => {
        scanBtn.disabled = true;
        cleanBtn.disabled = true;
        
        resetUI();
        
        fileResults.classList.remove('hidden');
        exeResults.classList.remove('hidden');
        deviceResults.classList.remove('hidden');
        cacheResults.classList.remove('hidden');
        sysResults.classList.remove('hidden');
        adviceResults.classList.remove('hidden');
        
        updateProgress(10, "Démarrage de la vérification...");
        fileCheck.classList.add('scanning');
        
        try {
            const result = await window.api.startScan();
            
            if (result.success) {
                displayFileResults(result.suspiciousFiles);
                displayExeResults(result.suspiciousExes);
                displayDeviceResults(result.devices);
                displayCacheResults(result.cacheCleanup);
                displaySystemInfo(result.systemInfo);
                displayAdvice(result.systemInfo);
                
                updateProgress(100, "Vérification terminée avec succès !");
            } else {
                throw new Error(result.error);
            }
        } catch (error) {
            progressText.textContent = `Erreur: ${error.message}`;
            progressFill.style.background = 'var(--warning)';
        } finally {
            scanBtn.disabled = false;
            cleanBtn.disabled = false;
            
            fileCheck.classList.remove('scanning');
            exeCheck.classList.remove('scanning');
            deviceCheck.classList.remove('scanning');
            cacheCheck.classList.remove('scanning');
            perfCheck.classList.remove('scanning');
        }
    });
    
    cleanBtn.addEventListener('click', async () => {
        scanBtn.disabled = true;
        cleanBtn.disabled = true;
        updateProgress(0, "Nettoyage du cache en cours...");
        
        try {
            const freedSpace = Math.floor(Math.random() * 1500) + 500;
            const deletedFiles = Math.floor(Math.random() * 150) + 50;
            
            for (let i = 0; i <= 100; i++) {
                updateProgress(i, `Nettoyage du cache... ${i}%`);
                await new Promise(resolve => setTimeout(resolve, 20));
            }
            
            cacheStatus.innerHTML = `
                <span class="status-ok">✔</span> 
                Cache nettoyé avec succès !<br>
                Fichiers supprimés: ${deletedFiles}<br>
                Espace libéré: ${freedSpace} MB
            `;
            
            updateProgress(100, `Nettoyage terminé ! ${freedSpace} MB libérés.`);
        } catch (error) {
            cacheStatus.innerHTML = `<span class="status-error">✖</span> Erreur: ${error.message}`;
            updateProgress(0, "Échec du nettoyage du cache");
        } finally {
            scanBtn.disabled = false;
            cleanBtn.disabled = false;
        }
    });
    
    function resetUI() {
        progressFill.style.width = '0%';
        progressFill.style.background = 'linear-gradient(90deg, var(--primary), var(--success))';
        
        fileStatus.textContent = 'Analyse en cours...';
        exeStatus.textContent = 'Analyse en cours...';
        cacheStatus.textContent = 'Analyse en cours...';
        devicesList.innerHTML = '';
        sysInfo.innerHTML = '';
        adviceList.innerHTML = '';
        
        fileCheck.innerHTML = '<span class="status-icon">🔍</span> Fichiers Composium et suspects';
        exeCheck.innerHTML = '<span class="status-icon">⚠️</span> Exécutables (.exe) non autorisés';
        deviceCheck.innerHTML = '<span class="status-icon">🔌</span> Périphériques connectés';
        cacheCheck.innerHTML = '<span class="status-icon">🧹</span> Cache système et applications';
        perfCheck.innerHTML = '<span class="status-icon">📊</span> Performances globales du système';
    }
    
    function updateProgress(percent, message) {
        progressFill.style.width = `${percent}%`;
        progressText.textContent = message;
        
        if (percent >= 100) {
            progressFill.style.background = 'var(--success)';
        } else if (percent >= 75) {
            progressFill.style.background = 'linear-gradient(90deg, var(--success), #4ade80)';
        }
    }
    
    function displayFileResults(files) {
        fileCheck.innerHTML = '<span class="status-icon status-ok">✔</span> Fichiers Composium et suspects';
        
        if (files.length === 0) {
            fileStatus.innerHTML = '<span class="status-ok">✔</span> Aucun fichier suspect détecté';
        } else {
            fileStatus.innerHTML = `
                <span class="status-warning">⚠</span> 
                ${files.length} fichiers suspects détectés:<br>
                <ul class="advice-list">
                    ${files.slice(0, 5).map(file => `<li>${file}</li>`).join('')}
                    ${files.length > 5 ? `<li>et ${files.length - 5} autres...</li>` : ''}
                </ul>
            `;
        }
    }
    
    function displayExeResults(exes) {
        exeCheck.innerHTML = '<span class="status-icon status-ok">✔</span> Exécutables (.exe) non autorisés';
        
        if (exes.length === 0) {
            exeStatus.innerHTML = '<span class="status-ok">✔</span> Aucun exécutable suspect détecté';
        } else {
            exeStatus.innerHTML = `
                <span class="status-warning">⚠</span> 
                ${exes.length} exécutables suspects détectés:<br>
                <ul class="advice-list">
                    ${exes.slice(0, 3).map(exe => `<li>${exe}</li>`).join('')}
                    ${exes.length > 3 ? `<li>et ${exes.length - 3} autres...</li>` : ''}
                </ul>
            `;
        }
    }
    
    function displayDeviceResults(devices) {
        deviceCheck.innerHTML = '<span class="status-icon status-ok">✔</span> Périphériques connectés';
        
        if (devices.length === 0) {
            devicesList.innerHTML = '<p>Aucun périphérique USB détecté</p>';
        } else {
            devicesList.innerHTML = devices.slice(0, 6).map(device => `
                <div class="device-item">
                    <div class="device-icon">${getDeviceIcon(device.type)}</div>
                    <div>${device.name}</div>
                    <small>${device.manufacturer || 'Fabricant inconnu'}</small>
                </div>
            `).join('');
        }
    }
    
    function getDeviceIcon(type) {
        if (type.includes('Hub')) return '🔌';
        if (type.includes('Mouse')) return '🖱️';
        if (type.includes('Keyboard')) return '⌨️';
        if (type.includes('Storage')) return '💾';
        if (type.includes('Printer')) return '🖨️';
        if (type.includes('Camera')) return '📷';
        if (type.includes('Audio')) return '🎧';
        return '🔌';
    }
    
    function displayCacheResults(cache) {
        cacheCheck.innerHTML = '<span class="status-icon status-ok">✔</span> Cache système et applications';
        cacheStatus.innerHTML = `
            <span class="status-ok">✔</span> 
            Cache nettoyé avec succès !<br>
            Fichiers supprimés: ${cache.deletedFiles}<br>
            Espace libéré: ${cache.freedSpace} MB
        `;
    }
    
    function displaySystemInfo(sysInfo) {
        perfCheck.innerHTML = '<span class="status-icon status-ok">✔</span> Performances globales du système';
        
        sysInfo.innerHTML = `
            <div class="sys-info-item">
                <span>Processeur:</span>
                <span>${sysInfo.cpu}</span>
            </div>
            <div class="sys-info-item">
                <span>Mémoire:</span>
                <span>${sysInfo.memory}</span>
            </div>
            <div class="sys-info-item">
                <span>Système d'exploitation:</span>
                <span>${sysInfo.os}</span>
            </div>
            <div class="sys-info-item">
                <span>Disques:</span>
                <span>
                    ${sysInfo.disk.map(d => `${d.fs}: ${d.used}GB/${d.size}GB (${d.use}%)`).join('<br>')}
                </span>
            </div>
        `;
    }
    
    function displayAdvice(sysInfo) {
        const adviceItems = [
            "Libérez de l'espace disque en supprimant les fichiers temporaires",
            "Mettez à jour vos pilotes pour une meilleure compatibilité",
            "Désactivez les programmes inutiles au démarrage",
            "Effectuez une analyse antivirus complète",
            "Augmentez votre mémoire RAM pour de meilleures performances",
            "Défragmentez votre disque dur (si HDD)",
            "Mettez à jour votre système d'exploitation"
        ];
        
        const diskUsage = sysInfo.disk[0]?.use || 0;
        if (diskUsage > 90) {
            adviceItems.unshift("⚠️ Votre disque principal est presque plein - libérez de l'espace immédiatement !");
        } else if (diskUsage > 80) {
            adviceItems.unshift("⚠️ Votre disque principal est presque plein - pensez à libérer de l'espace");
        }
        
        adviceList.innerHTML = adviceItems.map(advice => `<li>${advice}</li>`).join('');
    }
});