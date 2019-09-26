export default function (callback) {
    let time = +new Date();
    (function loop() {
        window.requestAnimationFrame(() => {
            if (+new Date() - time < 16.7) {
                loop()
            } else {
                callback()
            }
        })
    })()
}