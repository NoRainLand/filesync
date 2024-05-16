import { HtmlControl } from "./HtmlControl";

export class ThemeMgr {
    private static _isDark: number = -1;
    static get isDark(): boolean {
        if (this._isDark == -1) {
            let dark = localStorage.getItem("isDark");
            if (dark == null || dark == void 0) {
                this._isDark = 0;
                localStorage.setItem("isDark", "false");
            } else {
                this._isDark = ((dark == "true") ? 1 : 0);
            }
        }
        return !!this._isDark;
    }
    static set isDark(value: boolean) {
        this._isDark = value ? 1 : 0;
        localStorage.setItem("isDark", value.toString());
    }

    private static themeButtonSvg: HTMLElement;
    private static parent: HTMLElement;
    static init(parent) {
        this.parent = parent;
        this.setUI();
        this.initTheme();
        this.addEvent();
    }
    private static setUI() {
        this.parent.insertAdjacentHTML("afterbegin", HtmlControl.themeButton);
        this.themeButtonSvg = document.getElementById('themeButton') as HTMLElement;
    }

    /**初始化主题 */
    private static initTheme() {
        if (this.isDark) {
            this.themeButtonSvg.innerHTML = HtmlControl.sunSVG;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            this.themeButtonSvg.innerHTML = HtmlControl.moonSVG;
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    private static addEvent() {
        this.themeButtonSvg.addEventListener('click', this.onChangeTheme.bind(this));
    }

    private static removeEvent() {
        this.themeButtonSvg.removeEventListener('click', this.onChangeTheme.bind(this));
    }

    static onChangeTheme() {
        this.isDark = !this.isDark;
        this.initTheme();
    }

    static clear() {
        this.removeEvent();
    }

}