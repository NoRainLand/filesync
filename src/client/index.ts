import "../../client/css/style.scss";
import { ProjectConfig } from "../ProjectConfig";
import { EventMgr } from "../common/EventMgr";
import { NiarApp } from "../common/NiarApp";
import { EventName } from "./ClientDefine";
import { HtmlControl } from "./HtmlControl";
import { Logger } from "./Logger";
import { Utils } from "./Utils";
export class index {


    private _isDark: number = -1;
    get isDark(): boolean {
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
    set isDark(value: boolean) {
        this._isDark = value ? 1 : 0;
        localStorage.setItem("isDark", value.toString());
    }

    themeButtonSvg: HTMLElement;


    constructor() {
        this.init();
    }
    init() {
        (<any>window)["NiarApp"] = NiarApp;
        ProjectConfig.openVC && Utils.openVConsole();
        this.initUI();
        this.initTheme();
        Logger.tranLogger();
        this.addEvent();
    }

    initUI() {
        this.themeButtonSvg = document.getElementById('themeButton') as HTMLElement;
    }

    initTheme() {
        if (this.isDark) {
            this.themeButtonSvg.innerHTML = HtmlControl.sunSVG;
            document.documentElement.setAttribute('data-theme', 'dark');
        } else {
            this.themeButtonSvg.innerHTML = HtmlControl.moonSVG;
            document.documentElement.setAttribute('data-theme', 'light');
        }
    }

    addEvent() {
        document.addEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });

        this.themeButtonSvg.addEventListener('click', this.onChangeTheme.bind(this));
    }

    removeEvent() {
        document.removeEventListener(EventName.visibilitychange, () => {
            EventMgr.emit(EventName.visibilitychange, document.hidden);
        });
    }

    onChangeTheme() {
        this.isDark = !this.isDark;
        this.initTheme();
    }


}
new index();