export class HtmlControl {
    /**复制按钮的class */
    static readonly copyBtnClass = "btnCopy";
    /**展示二维码的class */
    static readonly showQrcodeDivClass: string = "showQrcodeDiv";
    /**隐藏二维码的class */
    static readonly hideQrcodeDivClass: string = "hideQrcodeDiv";

    /**根节点 */
    static readonly container =
        `
    <div class="container" id="container"></div>
    `;

    /**文件列表 */
    static readonly fileList =
        `
    <div id="fileList"></div>
    `



    /**二维码按钮 */
    static readonly qrcodeButton =
        `
        <div id="qrcodeButton" class="qrcodeButton">
            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
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
        </div>
    `



    /**主题按钮 */
    static readonly themeButton =
        `
        <div id="themeButton" class="themeButton"></div>
        `

    /**进度条的class */
    static readonly myProgress =
        `
        <dialog close id = "myProgress">
            <article id = "myProgressCard">
                <progress id = "myProgressValue" value="25" max="100"></progress>
                <p id="myProgressText">25%</p>
            </article>
        </dialog>
    `;
    /**提示框的class */
    static readonly myAlert =
        `
        <dialog close id = "myAlert">
            <article>
                <header>
                    <button aria-label="Close" rel="prev"></button>
                    <p>
                        <strong>提示</strong>
                    </p>
                </header>
                <p class="dialogContent">hello world!</p>
                <Div id="qrcodeDiv">
                    <Img id="qrcodeImg"></Img>
                </Div>
            </article>
        </dialog>
        `;
    /**对话框的class */
    static readonly myDialog =
        `
        <dialog close id = "myDialog">
            <article>
                <header>
                    <button aria-label="Close" rel="prev"></button>
                    <p>
                        <strong>提示</strong>
                    </p>
                </header>
                <p class="dialogContent">hello world!</p>
                <footer>
                    <button className="secondary">
                    取消
                    </button>
                    <button>确认</button>
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

    /**运行程序按钮 */
    static readonly runButton =
        `
        <div id="runButton" class="runButton">
            <svg data-slot="icon" fill="none" stroke-width="1.5" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="m21 7.5-9-5.25L3 7.5m18 0-9 5.25m9-5.25v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9"></path>
            </svg>
        </div>
        `;

    /**提示组件 */
    static readonly tipsComponent =
        `
        <article class="tips">提示</article>
        `;


    /**上传组件 */
    static readonly uploadComponent =
        `
        <form id="uploadForm" action="/upload" method="post" enctype="multipart/form-data">
				<fieldset role="group">
					<input type="file" id="fileInput" name="file" value="浏览" />
					<input type="text" id="textInput" name="text" placeholder="输入文本..." />
					<input type="button" value="发送" id="uploadButton" />
				</fieldset>
			</form>
        `;

    /**复制节点按钮的class */
    static readonly copyNodeButton = ".copyMsg";

    /**文件列表 */
    static readonly fileItem =
        `
    <form class="item" class="grid">
        <p class="NameOrText"></p>
        <div>
            <small class="msgDate"></small>
            <button type="button" class="downloadFile">下载</button>
            <button type="button" class="copyMsg">复制</button>
            <button type="button" class="deleteMsg">删除</button>
        </div>
    </form>
    `;

    /**图片预览节点 */
    static readonly alertImgPreview =
        `
    <dialog close id = "alertImgPreview">
        <article id = "alertImgPreviewArticle">
            <header id = "alertImgPreviewHeader">
                <button aria-label="Close" rel="prev"></button>
                <p>
                    <strong>图片预览</strong>
                </p>
            </header>
            <img id="imgPreview">
        </article>
    </dialog>
    `;


    /**视频预览节点 */
    static readonly alertVideoPreview =
        `
    <dialog close id = "alertVideoPreview">
        <article id = "alertVideoPreviewArticle">
            <header id = "alertVideoPreviewHeader">
                <button aria-label="Close" rel="prev"></button>
                <p>
                    <strong>视频预览</strong>
                </p>
            </header>
            <video controls id="videoPreview"></video>
        </article>
    </dialog>
    `;


    /**音频预览节点 */
    static readonly alertAudioPreview =
        `
    <dialog close id = "alertAudioPreview">
        <article>
            <header id = "alertAudioPreviewHeader">
                <button aria-label="Close" rel="prev"></button>
                <p>
                    <strong>音频预览</strong>
                </p>
            </header>
            <audio controls id="audioPreview"></audio>
        </article>
    </dialog>
    `;
}