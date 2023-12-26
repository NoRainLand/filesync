export class copyData {
    static async copyToClipboard(text: string): Promise<void> {
        try {
            // await navigator.clipboard.writeText(text);
            // console.log('Text copied to clipboard');

            var input = text + '';
            const el = document.createElement('textarea');
            el.value = input;
            el.setAttribute('readonly', '');
            el.style.position = 'absolute';
            el.style.left = '-9999px';
            el.style.fontSize = '12pt'; // Prevent zooming on iOS
            const selection = getSelection();  //dom api 微信小游戏不支持
            var originalRange;
            if (selection!.rangeCount > 0) {
                originalRange = selection!.getRangeAt(0);
            }
            document.body.appendChild(el);
            el.select();
            el.selectionStart = 0;
            el.selectionEnd = input.length;
            var success = false;
            try {
                success = document.execCommand('copy');
            } catch (err) { }

            document.body.removeChild(el);
            if (originalRange) {
                selection!.removeAllRanges();
                selection!.addRange(originalRange);
            }
        } catch (err) {
        }
    }
}