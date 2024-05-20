export class HtmlControl {
    /**复制按钮的class */
    static readonly copyBtnClass = "btnCopy";
    /**展示二维码的class */
    static readonly showQrcodeDivClass: string = "showQrcodeDiv";
    /**隐藏二维码的class */
    static readonly hideQrcodeDivClass: string = "hideQrcodeDiv";

    /**文件列表 */
    static readonly fileList =
        `
    <div id="fileList"></div>
    `

    /**二维码按钮 */
    static readonly qrcodeButton =
        `
    <svg id="qrcodeButton" class="qrcodeButton" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M3.75 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 3.75 9.375v-4.5ZM3.75 14.625c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5a1.125 1.125 0 0 1-1.125-1.125v-4.5ZM13.5 4.875c0-.621.504-1.125 1.125-1.125h4.5c.621 0 1.125.504 1.125 1.125v4.5c0 .621-.504 1.125-1.125 1.125h-4.5A1.125 1.125 0 0 1 13.5 9.375v-4.5Z"
        ></path>
        <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M6.75 6.75h.75v.75h-.75v-.75ZM6.75 16.5h.75v.75h-.75v-.75ZM16.5 6.75h.75v.75h-.75v-.75ZM13.5 13.5h.75v.75h-.75v-.75ZM13.5 19.5h.75v.75h-.75v-.75ZM19.5 13.5h.75v.75h-.75v-.75ZM19.5 19.5h.75v.75h-.75v-.75ZM16.5 16.5h.75v.75h-.75v-.75Z"
        ></path>
    </svg>
    `



    /**主题按钮 */
    static readonly themeButton =
        `
    <svg id="themeButton" class="themeButton" data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"></svg>
    `

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
                    <button aria-label="Close" rel="prev"></button>
                    <p>
                        <strong>提示</strong>
                    </p>
                </header>
                <p>hello world!</p>
                <Div id="qrcodeDiv">
                    <Img id="qrcodeImg"></Img>
                </Div>
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