export class HtmlControl {
    /**复制按钮的class */
    static readonly copyBtnClass = "btnCopy";
    /**展示二维码的class */
    static readonly showQrcodeDivClass: string = "showQrcodeDiv";
    /**隐藏二维码的class */
    static readonly hideQrcodeDivClass: string = "hideQrcodeDiv";

    /**进度条的class */
    static readonly Progress =
        `
        <dialog close id = "myProgress">
            <article id = "myProgressCard">
                <progress id = "myProgressValue" value="25" max="100"></progress>
                <p id="myProgressText">25%</p>
            </article>
        </dialog>
    `;
    /**提示框的class */
    static readonly Alert =
        `
        <dialog close id = "myAlert">
            <article>
                <header>
                    <a href="#close" aria-label="Close" class="close"></a>
                    <h6>提示</h6>
                </header>
                <p>hello world!</p>
                <div id="qrcodeDiv"></div>
            </article>
        </dialog>
        `;
    /**对话框的class */
    static readonly Dialog =
        `
    <dialog close id = "myDialog">
        <article>
            <header>
                <a href="#close" aria-label="Close" class="close"></a>
                <h6>提示</h6>
            </header>
            <p>hello world!</p>
            <footer>
                <a href="#cancel" role="button" class="secondary"> 取消 </a>
                <a href="#confirm" role="button"> 确认 </a>
            </footer>
        </article>
    </dialog>
    `;
    /**月亮图案的svg */
    static readonly moonSVG = `<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M21.752 15.002A9.72 9.72 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998Z"></path>
    </svg>`;
    /**太阳图案的svg */
    static readonly sunSVG = `<svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <path stroke-linecap="round" stroke-linejoin="round" d="M12 3v2.25m6.364.386-1.591 1.591M21 12h-2.25m-.386 6.364-1.591-1.591M12 18.75V21m-4.773-4.227-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z"></path>
    </svg>`;
}