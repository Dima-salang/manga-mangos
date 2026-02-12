const messages = [
    {role: 'assistant', content: 'Hello! I\'m your MangaMangos AI assistant. Ask me anything about manga!'}
];

document.addEventListener('DOMContentLoaded', function() {
    checkAuth();
    initMobileMenu();
    displayMessages();
    
    document.getElementById('messageInput').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });
});

function displayMessages() {
    const container = document.getElementById('chatMessages');
    container.innerHTML = messages.map(m => `
        <div style="background: ${m.role === 'user' ? 'var(--mango-pale)' : '#f5f5f5'}; padding: 1rem; border-radius: 12px; align-self: ${m.role === 'user' ? 'flex-end' : 'flex-start'}; max-width: 70%;">
            ${m.content}
        </div>
    `).join('');
    container.scrollTop = container.scrollHeight;
}

function sendMessage() {
    const input = document.getElementById('messageInput');
    const text = input.value.trim();
    
    if (text) {
        messages.push({role: 'user', content: text});
        messages.push({role: 'assistant', content: 'Based on your interests, I recommend checking out Attack on Titan and Demon Slayer!'});
        input.value = '';
        displayMessages();
    }
}