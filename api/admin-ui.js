export default function handler(req, res) {
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.status(200).send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Dashboard | API Portfolio</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
    <script src="https://unpkg.com/lucide@latest"></script>
    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <style>
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #0f172a; color: #f8fafc; }
        .glass { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.1); }
        .accent-gradient { background: linear-gradient(135deg, #2dd4bf 0%, #3b82f6 100%); }
        .status-dot { width: 10px; height: 10px; border-radius: 50%; background: #22c55e; animation: pulse 2s infinite; }
        @keyframes pulse { 0% { opacity: 0.5; } 50% { opacity: 1; } 100% { opacity: 0.5; } }
        /* Hide scrollbar */
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
    </style>
</head>
<body class="min-h-screen overflow-x-hidden">

    <!-- Login Overlay -->
    <div id="login-overlay" class="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md transition-opacity">
        <div class="glass p-8 rounded-2xl w-full max-w-md text-center shadow-2xl">
            <div class="mb-6 inline-flex p-4 bg-teal-500/10 rounded-full">
                <i data-lucide="lock" class="w-8 h-8 text-teal-500"></i>
            </div>
            <h1 class="text-2xl font-bold mb-2">Restricted Access</h1>
            <p class="text-slate-400 mb-8">Enter your admin passcode to proceed.</p>
            <input type="password" id="passcode-input" 
                class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-teal-500 text-center text-lg tracking-widest uppercase"
                placeholder="••••••">
            <button onclick="login()" class="w-full accent-gradient hover:opacity-90 py-3 rounded-xl font-semibold transition-all shadow-lg shadow-teal-500/20">
                Unlock Dashboard
            </button>
        </div>
    </div>

    <!-- Main Dashboard -->
    <div id="main-content" class="hidden opacity-0 transition-opacity duration-500">
        <!-- Sidebar & Nav -->
        <div class="max-w-7xl mx-auto px-6 py-8">
            <header class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div>
                    <div class="flex items-center gap-2 mb-1">
                        <span class="status-dot"></span>
                        <span class="text-xs font-semibold text-emerald-400 uppercase tracking-wider">System Live</span>
                    </div>
                    <h1 class="text-3xl font-bold tracking-tight">API Command Center</h1>
                    <p class="text-slate-400">Managing your developer identity in real-time.</p>
                </div>
                <div class="flex items-center gap-3">
                    <button onclick="fetchStats()" class="glass px-4 py-2.5 rounded-xl hover:bg-slate-800 transition-colors flex items-center gap-2">
                        <i data-lucide="refresh-cw" class="w-4 h-4"></i>
                        <span>Refresh</span>
                    </button>
                    <button onclick="logout()" class="glass px-4 py-2.5 rounded-xl text-rose-400 border-rose-500/20 hover:bg-rose-500/10 transition-colors">
                        Sign Out
                    </button>
                </div>
            </header>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div class="glass p-6 rounded-2xl">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-blue-500/10 rounded-xl">
                            <i data-lucide="users" class="w-6 h-6 text-blue-500"></i>
                        </div>
                    </div>
                    <p class="text-slate-400 text-sm font-medium">Total Visitors</p>
                    <h2 id="total-visitors" class="text-4xl font-bold mt-1">--</h2>
                </div>
                <div class="glass p-6 rounded-2xl">
                    <div class="flex justify-between items-start mb-4">
                        <div class="p-3 bg-teal-500/10 rounded-xl">
                            <i data-lucide="activity" class="w-6 h-6 text-teal-500"></i>
                        </div>
                    </div>
                    <p class="text-slate-400 text-sm font-medium">Active Endpoints</p>
                    <h2 id="active-endpoints" class="text-4xl font-bold mt-1">--</h2>
                </div>
                <div class="glass lg:col-span-2 p-6 rounded-2xl">
                    <div class="flex items-center justify-between mb-2">
                        <p class="text-slate-400 text-sm font-medium">7-Day Traffic</p>
                    </div>
                    <canvas id="traffic-chart" style="height: 100px; width: 100%;"></canvas>
                </div>
            </div>

            <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <!-- Endpoint Management -->
                <div class="lg:col-span-2 glass rounded-2xl overflow-hidden">
                    <div class="px-6 py-5 border-b border-slate-700/50 flex items-center justify-between bg-white/[0.02]">
                        <h3 class="font-bold flex items-center gap-2">
                            <i data-lucide="file-json" class="w-5 h-5 text-teal-400"></i>
                            API Data Editor
                        </h3>
                        <div id="file-selector" class="flex gap-2"></div>
                    </div>
                    <div class="p-6">
                        <div id="editor-container" class="relative">
                            <textarea id="json-editor" class="w-full h-[500px] bg-slate-900 border border-slate-700/50 rounded-xl p-4 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-teal-500 leading-relaxed"></textarea>
                            <div class="absolute bottom-4 right-4 flex gap-3">
                                <button onclick="saveConfig()" class="accent-gradient px-6 py-2.5 rounded-lg font-bold shadow-xl shadow-teal-500/10 hover:brightness-110 transition-all flex items-center gap-2">
                                    <i data-lucide="save" class="w-4 h-4"></i>
                                    Save Changes
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Breakdown -->
                <div class="glass rounded-2xl p-6 h-fit">
                    <h3 class="font-bold mb-6 flex items-center gap-2">
                        <i data-lucide="bar-chart-3" class="w-5 h-5 text-purple-400"></i>
                        Endpoint Popularity
                    </h3>
                    <div id="endpoints-list" class="space-y-4">
                        <!-- Items injected here -->
                        <p class="text-slate-500">Loading metrics...</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Notification Toast -->
    <div id="toast" class="fixed bottom-6 right-6 translate-y-20 opacity-0 transition-all duration-300 z-[100]">
        <div class="glass border-teal-500/50 px-6 py-3 rounded-xl flex items-center gap-3 shadow-2xl">
            <div class="p-1 bg-teal-500/20 rounded-full">
                <i id="toast-icon" data-lucide="check" class="w-4 h-4 text-teal-500"></i>
            </div>
            <span id="toast-message" class="font-medium text-sm">Success!</span>
        </div>
    </div>

    <script>
        let currentPasscode = '';
        let currentConfigs = {};
        let activeFile = '';
        let chart = null;

        function showToast(msg, isError = false) {
            const toast = document.getElementById('toast');
            const message = document.getElementById('toast-message');
            const icon = document.getElementById('toast-icon');
            
            message.innerText = msg;
            icon.dataset.lucide = isError ? 'alert-circle' : 'check';
            icon.className = isError ? 'w-4 h-4 text-rose-500' : 'w-4 h-4 text-teal-500';
            toast.className = \`fixed bottom-6 right-6 translate-y-0 opacity-100 transition-all duration-300 z-[100]\`;
            
            lucide.createIcons();
            setTimeout(() => {
                toast.className = \`fixed bottom-6 right-6 translate-y-20 opacity-0 transition-all duration-300 z-[100]\`;
            }, 3000);
        }

        async function login() {
            const input = document.getElementById('passcode-input');
            const code = input.value;
            
            try {
                const res = await fetch(\`/api/admin-api?action=getStats&passcode=\${code}\`);
                if (res.ok) {
                    currentPasscode = code;
                    localStorage.setItem('admin_passcode', code);
                    document.getElementById('login-overlay').classList.add('opacity-0', 'pointer-events-none');
                    document.getElementById('main-content').classList.remove('hidden');
                    setTimeout(() => document.getElementById('main-content').classList.add('opacity-100'), 100);
                    init();
                } else {
                    showToast('Invalid passcode. Try again.', true);
                    input.value = '';
                }
            } catch (err) {
                showToast('Connection error.', true);
            }
        }

        function logout() {
            localStorage.removeItem('admin_passcode');
            location.reload();
        }

        async function init() {
            lucide.createIcons();
            await fetchStats();
            await fetchConfigs();
            
            // Auto-select first config
            const fileNames = Object.keys(currentConfigs);
            if (fileNames.length > 0) selectFile(fileNames[0]);
        }

        async function fetchStats() {
            const res = await fetch(\`/api/admin-api?action=getStats&passcode=\${currentPasscode}\`);
            const data = await res.json();
            
            document.getElementById('total-visitors').innerText = data.stats.total_visitors || 0;
            const endpoints = data.stats.endpoints || {};
            document.getElementById('active-endpoints').innerText = Object.keys(endpoints).length;

            // Update Popularity List
            const list = document.getElementById('endpoints-list');
            list.innerHTML = Object.entries(endpoints)
                .sort((a, b) => b[1] - a[1])
                .map(([name, count]) => {
                    const pct = Math.min(100, (count / (data.stats.total_visitors || 1)) * 100);
                    return \`
                        <div>
                            <div class="flex justify-between text-xs mb-1.5 font-semibold">
                                <span class="text-slate-300">\${name.replace(/_/g, '/')}</span>
                                <span class="text-teal-400 font-mono">\${count} hits</span>
                            </div>
                            <div class="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                                <div class="h-full accent-gradient rounded-full" style="width: \${pct}%"></div>
                            </div>
                        </div>
                    \`;
                }).join('');

            // Update Chart
            updateChart(data.history);
        }

        async function fetchConfigs() {
            const res = await fetch(\`/api/admin-api?action=getConfigs&passcode=\${currentPasscode}\`);
            const data = await res.json();
            currentConfigs = data.configs;
            
            const selector = document.getElementById('file-selector');
            selector.innerHTML = Object.keys(currentConfigs).map(name => \`
                <button onclick="selectFile('\${name}')" id="btn-\${name}" class="file-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-700/50 text-slate-400">
                    \${name.replace('.json', '')}
                </button>
            \`).join('');
            
            if (activeFile) selectFile(activeFile);
        }

        function selectFile(name) {
            activeFile = name;
            document.querySelectorAll('.file-btn').forEach(btn => btn.className = 'file-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-slate-800/50 hover:bg-slate-700/50 text-slate-400');
            document.getElementById(\`btn-\${name}\`).className = 'file-btn px-3 py-1.5 rounded-lg text-xs font-bold transition-all bg-teal-500/20 text-teal-400 ring-1 ring-teal-500/50';
            document.getElementById('json-editor').value = JSON.stringify(currentConfigs[name], null, 2);
        }

        async function saveConfig() {
            try {
                const content = JSON.parse(document.getElementById('json-editor').value);
                const res = await fetch(\`/api/admin-api?passcode=\${currentPasscode}\`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        action: 'updateConfig',
                        fileName: activeFile,
                        content: content
                    })
                });

                if (res.ok) {
                    showToast(\`Successfully updated \${activeFile}!\`);
                    currentConfigs[activeFile] = content;
                } else {
                    showToast('Failed to save.', true);
                }
            } catch (err) {
                showToast('Invalid JSON syntax.', true);
            }
        }

        function updateChart(history) {
            const ctx = document.getElementById('traffic-chart').getContext('2d');
            const data = history.reverse();
            
            if (chart) chart.destroy();
            chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: data.map(d => d.date.split('-').slice(1).join('/')),
                    datasets: [{
                        label: 'Hits',
                        data: data.map(d => d.hits),
                        borderColor: '#2dd4bf',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        backgroundColor: ctx.createLinearGradient(0, 0, 0, 100),
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false }, tooltip: { enabled: true } },
                    scales: {
                        x: { display: false },
                        y: { display: false, beginAtZero: true }
                    }
                }
            });
            // Apply gradient after init
            const grad = ctx.createLinearGradient(0, 0, 0, 100);
            grad.addColorStop(0, 'rgba(45, 212, 191, 0.2)');
            grad.addColorStop(1, 'transparent');
            chart.data.datasets[0].backgroundColor = grad;
            chart.update();
        }

        // Auto-login from local storage
        const saved = localStorage.getItem('admin_passcode');
        if (saved) {
            document.getElementById('passcode-input').value = saved;
            login();
        }
    </script>
</body>
</html>
  `);
}
