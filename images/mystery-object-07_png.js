/* eslint-disable */
const img = new Image();
window.phetImages.push( img );
img.src = 'data:image/png;base64,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';
export default img;
