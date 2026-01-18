export class Router {
    constructor(appContainerId) {
        this.appContainer = document.getElementById(appContainerId);
        this.mainContent = document.getElementById('main-content');
        this.routes = {};
        this.currentRoute = null;
    }

    addRoute(name, renderFunction) {
        this.routes[name] = renderFunction;
    }

    async navigate(name, params = {}) {
        if (!this.routes[name]) {
            console.error(`Route ${name} not found`);
            return;
        }

        // Cleanup current view if needed (optional)
        this.mainContent.innerHTML = '';

        // Render new view
        const viewHtml = await this.routes[name](params);
        if (typeof viewHtml === 'string') {
            this.mainContent.innerHTML = viewHtml;
        } else if (viewHtml instanceof HTMLElement) {
            this.mainContent.appendChild(viewHtml);
        }

        this.currentRoute = name;

        // Trigger generic page loaded event if needed
        window.dispatchEvent(new CustomEvent('routeChanged', { detail: { name, params } }));
    }
}
